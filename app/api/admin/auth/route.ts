import { NextRequest, NextResponse } from 'next/server';
import {
  signSessionPayload,
  verifyAdminRequest,
  verifyFirebaseIdToken,
  isEmailAuthorizedAdmin,
  isSessionSecretConfigured,
  getSessionCookieOptions,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginRateLimit,
  getClientIp,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/serverAuth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Server Secret Check (must run before issuing/evaluating sessions)
  if (!isSessionSecretConfigured()) {
    console.error('[SECURITY] ADMIN_SESSION_SECRET is missing or still set to a placeholder.');
    return NextResponse.json(
      {
        code: 'MISSING_SESSION_SECRET',
        error:
          'متغير ADMIN_SESSION_SECRET غير مضبوط أو ما زال قيمة افتراضية على الخادم. يرجى ضبطه في إعدادات البيئة لإصدار جلسة الدخول.',
      },
      { status: 503 }
    );
  }

  // 2. Rate Limiting Check (shows exact remaining cooldown time)
  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    const retryAfter = rateLimit.retryAfterSeconds || 60;
    return NextResponse.json(
      {
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfterSeconds: retryAfter,
        error: `تم تجاوز الحد الأقصى لمحاولات الدخول الفاشلة. يرجى المحاولة مرة أخرى بعد ${retryAfter} ثانية.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    );
  }

  // 3. Whitelist Env Var Check
  if (!process.env.ADMIN_ALLOWED_EMAILS || process.env.ADMIN_ALLOWED_EMAILS.trim().length === 0) {
    console.warn('[SECURITY] ADMIN_ALLOWED_EMAILS is not configured in server environment.');
    return NextResponse.json(
      {
        code: 'MISSING_ALLOWED_EMAILS',
        error: 'متغير ADMIN_ALLOWED_EMAILS غير مضبوط على الخادم. يرجى إضافته في إعدادات البيئة للسماح بالدخول.',
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { idToken } = body;

    if (!idToken || typeof idToken !== 'string') {
      recordFailedLogin(ip);
      return NextResponse.json(
        {
          code: 'MISSING_ID_TOKEN',
          error: 'لم يتم إرسال توكن المصادقة (Firebase ID token) إلى الخادم.',
        },
        { status: 400 }
      );
    }

    // 4. Cryptographic Verification of Firebase ID Token (Google public x509 keys)
    const tokenResult = await verifyFirebaseIdToken(idToken);
    if (!tokenResult.valid || !tokenResult.email) {
      recordFailedLogin(ip);
      return NextResponse.json(
        {
          code: tokenResult.code || 'TOKEN_VERIFICATION_FAILED',
          error: tokenResult.error || 'فشل التحقق من توكن Firebase ID على الخادم.',
        },
        { status: 401 }
      );
    }

    const verifiedEmail = tokenResult.email;

    // 5. Strict Email Verification Enforcement
    if (!tokenResult.emailVerified) {
      recordFailedLogin(ip);
      console.warn(`[SECURITY] Unverified email login blocked: ${verifiedEmail} from IP: ${ip}`);
      return NextResponse.json(
        {
          code: 'EMAIL_NOT_VERIFIED',
          email: verifiedEmail,
          error: `البريد الإلكتروني (${verifiedEmail}) غير مُحقَّق (email_verified=false). يرجى تأكيد البريد الإلكتروني في حسابك قبل دخول لوحة التحكم.`,
        },
        { status: 403 }
      );
    }

    // 6. Strict Admin Whitelist Verification (exposes the attempted email clearly)
    if (!isEmailAuthorizedAdmin(verifiedEmail)) {
      recordFailedLogin(ip);
      console.warn(`[SECURITY] Unauthorized login attempt for non-whitelisted email: ${verifiedEmail} from IP: ${ip}`);
      return NextResponse.json(
        {
          code: 'EMAIL_NOT_ALLOWED',
          email: verifiedEmail,
          error: `البريد (${verifiedEmail}) غير مسموح له بدخول لوحة التحكم (غير مدرج في ADMIN_ALLOWED_EMAILS على الخادم).`,
        },
        { status: 403 }
      );
    }

    // Success: Reset rate limit for this IP
    resetLoginRateLimit(ip);

    // 7. Create cryptographically signed HMAC session payload
    const now = Date.now();
    const payload = {
      email: verifiedEmail,
      emailVerified: true,
      role: 'admin',
      iat: now,
      exp: now + SESSION_MAX_AGE_SECONDS * 1000,
    };

    const signedToken = signSessionPayload(payload);

    const response = NextResponse.json({
      success: true,
      user: {
        email: verifiedEmail,
        role: payload.role,
      },
    });

    // 8. Issue httpOnly cookie (SameSite=None; Secure for preview iframes, SameSite=Lax on localhost & direct production)
    response.cookies.set({
      ...getSessionCookieOptions(req, SESSION_MAX_AGE_SECONDS),
      value: signedToken,
    });

    console.info(`[ADMIN LOGIN SUCCESS] Admin ${verifiedEmail} authenticated from IP: ${ip}`);
    return response;
  } catch (err: any) {
    recordFailedLogin(ip);
    console.error('Admin authentication route error:', err);
    return NextResponse.json(
      {
        code: 'INTERNAL_AUTH_ERROR',
        error: err?.message || 'حدث خطأ داخلي أثناء المصادقة على الخادم.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (!isSessionSecretConfigured()) {
    return NextResponse.json(
      {
        authenticated: false,
        code: 'MISSING_SESSION_SECRET',
        error: 'متغير ADMIN_SESSION_SECRET غير مضبوط أو ما زال قيمة افتراضية على الخادم.',
      },
      { status: 503 }
    );
  }

  const auth = await verifyAdminRequest(req);
  if (!auth.valid || !auth.user) {
    return NextResponse.json(
      { authenticated: false, code: 'NO_ACTIVE_SESSION', error: auth.error },
      { status: 401 }
    );
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      email: auth.user.email,
      role: auth.user.role,
    },
  });
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Admin session terminated' });
  response.cookies.set({
    ...getSessionCookieOptions(req, 0),
    value: '',
  });
  return response;
}
