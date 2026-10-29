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

/**
 * Get and strictly validate the HMAC secret from environment.
 * Throws a clear error if not set.
 */
export function getRequiredHmacSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error('Server configuration error: ADMIN_SESSION_SECRET is not configured in environment variables');
  }
  return secret;
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

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const message = errData?.error?.message || `Google verification failed (${res.status})`;
      return { valid: false, error: message };
    }

    const data = await res.json();
    const user = data.users?.[0];

    if (!user || !user.email) {
      return { valid: false, error: 'No user account found for provided token' };
    }

    return {
      valid: true,
      email: user.email.toLowerCase(),
      emailVerified: Boolean(user.emailVerified),
      uid: user.localId,
    };
  } catch (err: any) {
    console.error('Firebase ID token verification network error:', err);
    return { valid: false, error: err?.message || 'Token verification network failure' };
  }
}

/**
 * Check if the verified email belongs to the list of authorized administrators.
 * Reads strictly from ADMIN_ALLOWED_EMAILS environment variable (comma-separated).
 * Fails closed with a clear error if the variable is not configured.
 */
export function isEmailAuthorizedAdmin(email: string): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();

  const allowedEnv = process.env.ADMIN_ALLOWED_EMAILS;
  if (!allowedEnv || allowedEnv.trim().length === 0) {
    throw new Error('Server security error: ADMIN_ALLOWED_EMAILS environment variable is not configured');
  }

  const allowedList = allowedEnv
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowedList.length === 0) {
    throw new Error('Server security error: ADMIN_ALLOWED_EMAILS contains no valid email addresses');
  }

  return allowedList.includes(cleanEmail);
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

    if (payload.emailVerified !== true) {
      return { valid: false, reason: 'Session token email has not been verified' };
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
 * Checks both httpOnly cookie (tb_admin_session) and Authorization Bearer header.
 */
export function verifyAdminRequest(req: NextRequest | Request): { valid: boolean; user?: AdminSessionPayload; error?: string } {
  let token: string | undefined;

  // 1. Check httpOnly Cookie
  if ('cookies' in req && typeof (req as NextRequest).cookies?.get === 'function') {
    token = (req as NextRequest).cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
    if (match) {
      token = match[1];
    }
  }

  // 2. Check Authorization Bearer header as secondary fallback
  if (!token) {
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    return { valid: false, error: 'Unauthorized: No active admin session found' };
  }

  const verification = verifySessionToken(token);
  if (!verification.valid || !verification.payload) {
    return { valid: false, error: verification.reason || 'Unauthorized: Invalid session' };
  }

  return { valid: true, user: verification.payload };
}
