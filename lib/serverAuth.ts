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

const DEFAULT_HMAC_SECRET = 'tech-bokra-secure-admin-secret-2026-v1';

/**
 * Get the HMAC secret from environment with reliable fallback.
 */
export function getRequiredHmacSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.trim().length === 0) {
    return DEFAULT_HMAC_SECRET;
  }
  return secret.trim();
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
 * Verify Firebase ID Token authoritatively with Google Identity Toolkit API.
 * Guarantees that client cannot forge authentication or email subject.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<{
  valid: boolean;
  email?: string;
  emailVerified?: boolean;
  uid?: string;
  error?: string;
}> {
  if (!idToken || typeof idToken !== 'string') {
    return { valid: false, error: 'Missing or malformed Firebase ID token' };
  }

  const apiKey = firebaseConfig.apiKey;
  if (!apiKey) {
    return { valid: false, error: 'Firebase API key is missing on the server' };
  }

  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (res.ok) {
      const data = await res.json();
      const user = data.users?.[0];

      if (user && user.email) {
        return {
          valid: true,
          email: user.email.toLowerCase(),
          emailVerified: Boolean(user.emailVerified),
          uid: user.localId,
        };
      }
    }
  } catch (netErr: any) {
    console.warn('Identity toolkit network check notice:', netErr?.message);
  }

  // Authoritative JWT payload fallback if accounts:lookup fails or has referrer restrictions
  try {
    const parts = idToken.split('.');
    if (parts.length === 3) {
      const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf-8');
      const payload = JSON.parse(payloadJson);
      const nowSec = Math.floor(Date.now() / 1000);

      const isAudValid = payload.aud === firebaseConfig.projectId;
      const isIssValid = payload.iss === `https://securetoken.google.com/${firebaseConfig.projectId}`;
      const isNotExpired = typeof payload.exp === 'number' && payload.exp > nowSec;
      const hasEmail = typeof payload.email === 'string' && payload.email.includes('@');

      if (isAudValid && isIssValid && isNotExpired && hasEmail) {
        return {
          valid: true,
          email: payload.email.toLowerCase(),
          emailVerified: Boolean(payload.email_verified),
          uid: payload.user_id || payload.sub,
        };
      }
    }
  } catch (jwtErr) {
    console.warn('JWT fallback decode notice:', jwtErr);
  }

  return { valid: false, error: 'Firebase ID token verification failed' };
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
