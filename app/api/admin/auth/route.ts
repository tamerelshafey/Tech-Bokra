import { NextRequest, NextResponse } from 'next/server';
import { 
  signSessionPayload, 
  verifyAdminRequest, 
  verifyFirebaseIdToken,
  isEmailAuthorizedAdmin,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginRateLimit,
  getClientIp,
  SESSION_COOKIE_NAME, 
  SESSION_MAX_AGE_SECONDS 
} from '@/lib/serverAuth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Rate Limiting Check
  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many failed login attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { idToken } = body;

    // Reject requests without authentic Firebase ID token
    if (!idToken || typeof idToken !== 'string') {
      recordFailedLogin(ip);
      return NextResponse.json(
        { error: 'Firebase ID token is required for server authentication' },
        { status: 400 }
      );
    }

    // 2. Authoritative verification of the ID Token via Google Identity Toolkit
    const tokenResult = await verifyFirebaseIdToken(idToken);
    if (!tokenResult.valid || !tokenResult.email) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { error: tokenResult.error || 'Authentication failed: Invalid or expired Firebase ID token' },
        { status: 401 }
      );
    }

    const verifiedEmail = tokenResult.email;

    // 3. Strict Admin Whitelist Verification
    if (!isEmailAuthorizedAdmin(verifiedEmail)) {
      recordFailedLogin(ip);
      console.warn(`[SECURITY] Unauthorized login attempt for non-whitelisted email: ${verifiedEmail} from IP: ${ip}`);
      return NextResponse.json(
        { error: 'Access denied: This account is not authorized as an administrator.' },
        { status: 403 }
      );
    }

    // Success: Reset rate limit for this IP
    resetLoginRateLimit(ip);

    // 4. Create cryptographically signed HMAC session payload
    const now = Date.now();
    const payload = {
      email: verifiedEmail,
      role: 'admin',
      iat: now,
      exp: now + SESSION_MAX_AGE_SECONDS * 1000,
    };

    const signedToken = signSessionPayload(payload);
    const isProd = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({
      success: true,
      user: {
        email: verifiedEmail,
        role: payload.role,
      },
    });

    // 5. Issue httpOnly, SameSite=Lax, Secure (in production) cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: signedToken,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    console.info(`[ADMIN LOGIN SUCCESS] Admin ${verifiedEmail} authenticated from IP: ${ip}`);
    return response;
  } catch (err: any) {
    recordFailedLogin(ip);
    console.error('Admin authentication route error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal authentication error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = verifyAdminRequest(req);
  if (!auth.valid || !auth.user) {
    return NextResponse.json({ authenticated: false, error: auth.error }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      email: auth.user.email,
      role: auth.user.role,
    },
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Admin session terminated' });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
