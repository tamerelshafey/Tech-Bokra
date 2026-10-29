import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/serverAuth';

export const runtime = 'nodejs';

/**
 * Server-side endpoint to authorize and record customConfig modifications.
 * Strictly verifies admin session cookie before permitting any configuration save.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.valid || !auth.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid administrator session cookie is required to modify customConfig.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid configuration payload' }, { status: 400 });
    }

    // Server-side audit log
    console.info(`[ADMIN AUDIT] customConfig update validated for ${auth.user.email} (${auth.user.role}) at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Configuration write authorized and verified on server',
      updatedBy: auth.user.email,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Config write server error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
