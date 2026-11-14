import { NextRequest } from 'next/server';
import crypto from 'crypto';
import firebaseConfig from '@/firebase-applet-config.json';

export const SESSION_COOKIE_NAME = 'tb_admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

export interface AdminSessionPayload {
  email: string;
  emailVerified: boolean;
  role: string;
  iat: number;
  exp: number;
}

const PLACEHOLDER_SECRETS = new Set([
  'MY_ADMIN_SESSION_SECRET',
  'tech-bokra-secure-admin-secret-2026-v1',
  'changeme',
  'default-secret',
]);

/**
 * Check whether ADMIN_SESSION_SECRET is explicitly configured to a real secret on the server.
 */
export function isSessionSecretConfigured(): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() || '';
  return secret.length > 0 && !PLACEHOLDER_SECRETS.has(secret);
}

/**
 * Get the HMAC secret strictly from environment. Throws explicitly when missing/placeholder.
 */
export function getRequiredHmacSecret(): string {
  if (!isSessionSecretConfigured()) {
    throw new Error('ADMIN_SESSION_SECRET غير مضبوط أو ما زال قيمة افتراضية على الخادم.');
  }
  return process.env.ADMIN_SESSION_SECRET!.trim();
}

/**
 * Determine whether the incoming request arrived over HTTPS.
 * Ensures localhost HTTP never sets Secure=true even under `next start` (NODE_ENV=production).
 */
export function isHttpsRequest(req: NextRequest | Request): boolean {
  const forwardedProto = (req.headers.get('x-forwarded-proto') || '').split(',')[0].trim().toLowerCase();
  if (forwardedProto) {
    return forwardedProto === 'https';
  }
  const host = (req.headers.get('host') || '').toLowerCase();
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]')) {
    return false;
  }
  if ('nextUrl' in req && (req as NextRequest).nextUrl?.protocol) {
    return (req as NextRequest).nextUrl.protocol === 'https:';
  }
  try {
    return new URL(req.url).protocol === 'https:';
  } catch {
    return process.env.NODE_ENV === 'production';
  }
}

/**
 * Determine cookie attributes for tb_admin_session across localhost HTTP,
 * AI Studio HTTPS preview iframes (*.run.app), and standard production domains.
 */
export function getSessionCookieOptions(req: NextRequest | Request, maxAge: number) {
  const secure = isHttpsRequest(req);
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').toLowerCase().split(':')[0];
  const secFetchDest = (req.headers.get('sec-fetch-dest') || '').toLowerCase();
  const isAiStudioPreview = host.endsWith('.run.app') || secFetchDest === 'iframe';

  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure,
    sameSite: (secure && isAiStudioPreview ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    maxAge,
  };
}

/**
 * In-memory IP-based rate limiting for authentication attempts.
 * Maximum 5 failed attempts per 15-minute window per IP.
 */
const RATE_LIMIT_MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitEntry {
  failedCount: number;
  resetAt: number;
}

const failedAttemptsMap = new Map<string, RateLimitEntry>();

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = failedAttemptsMap.get(ip);

  if (!entry) {
    return { allowed: true };
  }

  if (now > entry.resetAt) {
    failedAttemptsMap.delete(ip);
    return { allowed: true };
  }

  if (entry.failedCount >= RATE_LIMIT_MAX_FAILED_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = failedAttemptsMap.get(ip);

  if (!entry || now > entry.resetAt) {
    failedAttemptsMap.set(ip, {
      failedCount: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
  } else {
    entry.failedCount += 1;
  }
}

export function resetLoginRateLimit(ip: string): void {
  failedAttemptsMap.delete(ip);
}

/**
 * Extract client IP from NextRequest with standard headers fallback
 */
export function getClientIp(req: NextRequest | Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

/**
 * Google official public x509 certificates for Firebase ID tokens (RS256).
 * Does NOT depend on Firebase Web API Key, so it works reliably even when
 * the API key has strict HTTP referrer restrictions in Google Cloud Console.
 */
const GOOGLE_SECURETOKEN_CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

interface CertsCache {
  certs: Record<string, string>;
  expiresAt: number;
}

let cachedGoogleCerts: CertsCache | null = null;

async function fetchGooglePublicCerts(forceRefresh = false): Promise<Record<string, string>> {
  const now = Date.now();
  if (!forceRefresh && cachedGoogleCerts && now < cachedGoogleCerts.expiresAt) {
    return cachedGoogleCerts.certs;
  }

  const res = await fetch(GOOGLE_SECURETOKEN_CERTS_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Google public x509 certs endpoint returned HTTP ${res.status}`);
  }

  const certs = (await res.json()) as Record<string, string>;
  if (!certs || typeof certs !== 'object' || Object.keys(certs).length === 0) {
    throw new Error('Google public x509 certs response is empty or invalid');
  }

  const cacheControl = res.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeMs = maxAgeMatch ? Math.max(60, parseInt(maxAgeMatch[1], 10)) * 1000 : 3600 * 1000;

  cachedGoogleCerts = {
    certs,
    expiresAt: now + maxAgeMs,
  };

  return certs;
}

/**
 * Verify Firebase ID Token cryptographically using Google's official public x509 keys (RS256).
 * Zero dependency on Firebase Web API key (immune to API_KEY_HTTP_REFERRER_BLOCKED).
 * Never falls back to unsigned base64 JWT decoding.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<{
  valid: boolean;
  email?: string;
  emailVerified?: boolean;
  uid?: string;
  code?: string;
  error?: string;
}> {
  if (!idToken || typeof idToken !== 'string') {
    return { valid: false, code: 'MISSING_ID_TOKEN', error: 'توكن Firebase مفقود أو غير صالح.' };
  }

  const parts = idToken.split('.');
  if (parts.length !== 3) {
    return {
      valid: false,
      code: 'MALFORMED_ID_TOKEN',
      error: 'توكن Firebase غير صالح الصيغة (يجب أن يكون JWT مكوناً من 3 أجزاء).',
    };
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  let header: { alg?: string; kid?: string };
  let payload: Record<string, any>;

  try {
    header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf-8'));
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
  } catch {
    return {
      valid: false,
      code: 'MALFORMED_JWT_JSON',
      error: 'تعذر فك بنية JWT الخاصة بتوكن Firebase.',
    };
  }

  if (header?.alg !== 'RS256' || typeof header?.kid !== 'string' || !header.kid.trim()) {
    return {
      valid: false,
      code: 'INVALID_JWT_HEADER',
      error: 'خوارزمية التوكن غير مدعومة أو معرف المفتاح (kid) مفقود (مطلوب RS256).',
    };
  }

  // Primary cryptographic verification via Google public x509 certificates (API-key free)
  let certsFetchError: string | null = null;
  let certs: Record<string, string> | null = null;

  try {
    certs = await fetchGooglePublicCerts(false);
    if (!certs[header.kid]) {
      certs = await fetchGooglePublicCerts(true);
    }
  } catch (err: any) {
    certs = null;
    certsFetchError = err?.message || 'Network error fetching Google public keys';
  }

  if (certs) {
    const certPem = certs[header.kid];
    if (!certPem) {
      return {
        valid: false,
        code: 'UNKNOWN_KEY_ID',
        error: `معرف مفتاح التوقيع (${header.kid}) غير موجود ضمن مفاتيح Google العامة المعتمدة.`,
      };
    }

    try {
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(`${headerB64}.${payloadB64}`);
      verifier.end();
      const isSignatureValid = verifier.verify(certPem, signatureB64, 'base64url');
      if (!isSignatureValid) {
        return {
          valid: false,
          code: 'INVALID_JWT_SIGNATURE',
          error: 'تم رفض توكن Firebase: التوقيع التشفيري غير صحيح أو التوكن مزوّر (Invalid RS256 signature).',
        };
      }
    } catch (sigErr: any) {
      return {
        valid: false,
        code: 'SIGNATURE_VERIFY_ERROR',
        error: `خطأ أثناء فحص التوقيع التشفيري للتوكن: ${sigErr?.message || 'verify failed'}`,
      };
    }

    const projectId = firebaseConfig.projectId;
    const nowSec = Math.floor(Date.now() / 1000);

    if (payload.aud !== projectId) {
      return {
        valid: false,
        code: 'INVALID_AUDIENCE',
        error: `التوكن يخص مشروع Firebase آخر (aud=${String(payload.aud)}).`,
      };
    }

    const expectedIssuer = `https://securetoken.google.com/${projectId}`;
    if (payload.iss !== expectedIssuer) {
      return {
        valid: false,
        code: 'INVALID_ISSUER',
        error: `مصدر التوكن (iss) غير مطابق لمشروع Firebase المعتمد.`,
      };
    }

    if (typeof payload.sub !== 'string' || payload.sub.length === 0 || payload.sub.length > 128) {
      return {
        valid: false,
        code: 'INVALID_SUBJECT',
        error: 'التوكن لا يحتوي على معرف مستخدم (sub) صالح.',
      };
    }

    if (typeof payload.exp !== 'number' || payload.exp <= nowSec) {
      return {
        valid: false,
        code: 'TOKEN_EXPIRED',
        error: 'انتهت صلاحية توكن تسجيل الدخول (ID token expired). يرجى إعادة تسجيل الدخول.',
      };
    }

    if (typeof payload.iat !== 'number' || payload.iat > nowSec + 300) {
      return {
        valid: false,
        code: 'INVALID_IAT',
        error: 'تاريخ إصدار توكن تسجيل الدخول (iat) غير صالح.',
      };
    }

    if (typeof payload.auth_time !== 'number' || payload.auth_time > nowSec + 300) {
      return {
        valid: false,
        code: 'INVALID_AUTH_TIME',
        error: 'زمن المصادقة (auth_time) في التوكن غير صالح.',
      };
    }

    if (typeof payload.email !== 'string' || !payload.email.includes('@')) {
      return {
        valid: false,
        code: 'MISSING_EMAIL_CLAIM',
        error: 'توكن Firebase لا يتضمن عنوان بريد إلكتروني صالح.',
      };
    }

    return {
      valid: true,
      email: payload.email.toLowerCase(),
      emailVerified: Boolean(payload.email_verified),
      uid: payload.sub,
    };
  }

  // Secondary fallback ONLY when fetching Google's public x509 certs failed due to network:
  // Call Identity Toolkit and strictly parse & surface Google's exact error text (e.g. API_KEY_HTTP_REFERRER_BLOCKED).
  const apiKey = firebaseConfig.apiKey;
  if (apiKey) {
    try {
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const user = data?.users?.[0];
        if (user && user.email) {
          return {
            valid: true,
            email: String(user.email).toLowerCase(),
            emailVerified: Boolean(user.emailVerified),
            uid: user.localId,
          };
        }
        return {
          valid: false,
          code: 'IDENTITY_TOOLKIT_EMPTY_USER',
          error: 'استجابة Google Identity Toolkit لم تعد بيانات مستخدم صالحة.',
        };
      }

      const toolkitMsg =
        data?.error?.message ||
        data?.error?.errors?.[0]?.reason ||
        `HTTP ${res.status}`;
      return {
        valid: false,
        code: 'IDENTITY_TOOLKIT_REJECTED',
        error: `رفض Google Identity Toolkit التحقق من التوكن (${toolkitMsg}).${
          certsFetchError ? ` [سبب فشل المفاتيح العامة: ${certsFetchError}]` : ''
        }`,
      };
    } catch (netErr: any) {
      return {
        valid: false,
        code: 'TOKEN_VERIFICATION_NETWORK_ERROR',
        error: `تعذر الوصول إلى خوادم التحقق من Google (${netErr?.message || certsFetchError || 'Network error'}).`,
      };
    }
  }

  return {
    valid: false,
    code: 'TOKEN_VERIFICATION_UNAVAILABLE',
    error: `فشل التحقق من التوكن: ${certsFetchError || 'تعذر جلب مفاتيح Google العامة'}`,
  };
}

/**
 * Check if the verified email belongs to the list of authorized administrators.
 * Reads strictly from ADMIN_ALLOWED_EMAILS environment variable (comma-separated).
 * Zero hardcoded emails. If the environment variable is not configured, returns false.
 */
export function isEmailAuthorizedAdmin(email: string): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();

  const allowedEnv = process.env.ADMIN_ALLOWED_EMAILS;
  if (!allowedEnv || allowedEnv.trim().length === 0) {
    return false;
  }

  const allowedSet = new Set(
    allowedEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );

  return allowedSet.has(cleanEmail);
}

/**
 * Sign session payload using HMAC-SHA256 with required environment secret
 */
export function signSessionPayload(payload: AdminSessionPayload): string {
  const secret = getRequiredHmacSecret();
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 signed session token.
 * Strictly uses crypto.timingSafeEqual and verifies expiration.
 */
export function verifySessionToken(token: string): { valid: boolean; payload?: AdminSessionPayload; reason?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Missing session token' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Malformed token structure' };
  }

  const [data, signature] = parts;

  let secret: string;
  try {
    secret = getRequiredHmacSecret();
  } catch (err: any) {
    return { valid: false, reason: err.message };
  }

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSig);

  // Constant-time comparison
  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, reason: 'Invalid token cryptographic signature' };
  }

  try {
    const jsonStr = Buffer.from(data, 'base64url').toString('utf-8');
    const payload = JSON.parse(jsonStr) as AdminSessionPayload;

    // Check expiration
    if (Date.now() > payload.exp) {
      return { valid: false, reason: 'Session token has expired' };
    }

    if (!payload.email || typeof payload.email !== 'string') {
      return { valid: false, reason: 'Session token lacks valid email subject' };
    }

    if (!isEmailAuthorizedAdmin(payload.email)) {
      return { valid: false, reason: 'User email is not in the authorized administrator whitelist' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, reason: 'Failed to deserialize session payload' };
  }
}

/**
 * Authoritatively verify incoming NextRequest for an active Admin session
 * Dual verification:
 * 1. Checks httpOnly cookie (tb_admin_session)
 * 2. Checks Authorization Bearer header:
 *    - First tests HMAC signed session token
 *    - Second tests Google Firebase ID Token via Google Identity Toolkit
 */
export async function verifyAdminRequest(
  req: NextRequest | Request
): Promise<{ valid: boolean; user?: AdminSessionPayload; error?: string }> {
  let cookieToken: string | undefined;

  // 1. Check httpOnly Cookie
  if ('cookies' in req && typeof (req as NextRequest).cookies?.get === 'function') {
    cookieToken = (req as NextRequest).cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
    if (match) {
      cookieToken = match[1];
    }
  }

  if (cookieToken) {
    const verification = verifySessionToken(cookieToken);
    if (verification.valid && verification.payload) {
      return { valid: true, user: verification.payload };
    }
  }

  // 2. Check Authorization Bearer header as secondary / dual fallback
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    if (bearerToken) {
      // 2a. Try verifying as HMAC session token
      const hmacVerification = verifySessionToken(bearerToken);
      if (hmacVerification.valid && hmacVerification.payload) {
        return { valid: true, user: hmacVerification.payload };
      }

      // 2b. Authoritative Firebase ID token verification via Google Identity Toolkit
      const fbResult = await verifyFirebaseIdToken(bearerToken);
      if (fbResult.valid && fbResult.email) {
        if (isEmailAuthorizedAdmin(fbResult.email)) {
          const now = Date.now();
          const userPayload: AdminSessionPayload = {
            email: fbResult.email,
            emailVerified: Boolean(fbResult.emailVerified),
            role: 'admin',
            iat: now,
            exp: now + SESSION_MAX_AGE_SECONDS * 1000,
          };
          return { valid: true, user: userPayload };
        } else {
          return { valid: false, error: 'Unauthorized: Email is not in the administrator whitelist' };
        }
      } else if (fbResult.error) {
        return { valid: false, error: `Invalid Firebase token: ${fbResult.error}` };
      }
    }
  }

  return { valid: false, error: 'Unauthorized: No active admin session found' };
}
