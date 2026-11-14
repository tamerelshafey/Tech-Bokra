import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/serverAuth';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

/**
 * Server-side endpoint to authorize and record customConfig modifications,
 * and purge/revalidate Next.js cache tags and paths on publish.
 * Strictly accepts HTTP-only tb_admin_session cookie (Cookie-only auth).
 */
export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!cookieToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing admin session cookie (tb_admin_session).' },
        { status: 401 }
      );
    }

    const session = verifySessionToken(cookieToken);
    if (!session.valid || !session.payload) {
      return NextResponse.json(
        { error: `Unauthorized: Invalid or expired admin session (${session.reason || 'invalid signature'}).` },
        { status: 401 }
      );
    }

    const authUser = session.payload;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid configuration payload' }, { status: 400 });
    }

    // Targeted cache revalidation based on modified fields (NEVER invalidate entire layout)
    try {
      const keys = Object.keys(body);
      const modifiedFields = Array.isArray(body.modifiedFields) ? body.modifiedFields : [];
      const allKeys = Array.from(new Set([...keys, ...modifiedFields]));
      const pathsToRevalidate = new Set<string>();

      // Field -> Route mapping
      const contactKeys = ['whatsappNumber', 'phone', 'email', 'secondaryEmail', 'addressAr', 'addressEn', 'workingHoursAr', 'workingHoursEn', 'linkedinUrl', 'facebookUrl'];
      const brandingKeys = ['customLogoUrl', 'logoEmblemStyle', 'logoScale', 'customLogoHeight', 'brandBioAr', 'brandBioEn', 'footerRightsAr', 'taxId', 'commercialRegister'];
      const heroKeys = ['heroBadgeAr', 'heroBadgeEn', 'heroTitleLine1Ar', 'heroTitleLine1En', 'heroTitleLine2Ar', 'heroTitleLine2En', 'heroSubAr', 'heroSubEn', 'showAnnouncement', 'announcementBadgeAr', 'announcementBadgeEn', 'announcementTextAr', 'announcementTextEn', 'announcementLink', 'heroCctvImage', 'heroNetworkImage', 'heroAccessImage', 'heroCloudImage'];
      const serviceKeys = ['servicesList', 'servicesListEn', 'servicesBadgeAr', 'servicesBadgeEn', 'servicesTitleLine1Ar', 'servicesTitleLine1En', 'servicesTitleLine2Ar', 'servicesTitleLine2En', 'servicesSubAr', 'servicesSubEn'];
      const faqKeys = ['faqList', 'faqListEn', 'showFaqSection'];
      const processKeys = ['showProcessSection'];
      const projectKeys = ['projectsList', 'projectsListEn', 'showProjectsSection'];

      const touches = (fieldList: string[]) => allKeys.some((k) => fieldList.includes(k));

      if (touches(contactKeys) || touches(brandingKeys)) {
        pathsToRevalidate.add('/');
        pathsToRevalidate.add('/contact');
      }
      if (touches(heroKeys)) {
        pathsToRevalidate.add('/');
      }
      if (touches(serviceKeys)) {
        pathsToRevalidate.add('/');
        pathsToRevalidate.add('/services');
      }
      if (touches(faqKeys)) {
        pathsToRevalidate.add('/');
        pathsToRevalidate.add('/faq');
      }
      if (touches(processKeys)) {
        pathsToRevalidate.add('/');
        pathsToRevalidate.add('/process');
      }
      if (touches(projectKeys)) {
        pathsToRevalidate.add('/');
        pathsToRevalidate.add('/projects');
        pathsToRevalidate.add('/sitemap.xml');
        revalidatePath('/projects/[slug]', 'page');
        if (Array.isArray(body.projectSlugs)) {
          for (const s of body.projectSlugs) {
            if (typeof s === 'string' && s.trim()) {
              pathsToRevalidate.add(`/projects/${s.trim()}`);
            }
          }
        }
      }

      // If payload is empty or unrecognized, default to homepage only without layout revalidation
      if (pathsToRevalidate.size === 0) {
        pathsToRevalidate.add('/');
      }

      for (const p of pathsToRevalidate) {
        revalidatePath(p);
      }
    } catch (revalidateErr) {
      console.warn('Cache revalidation notice:', revalidateErr);
    }

    // Server-side audit log
    console.info(`[ADMIN AUDIT] customConfig update validated and revalidated for ${authUser.email} (${authUser.role}) at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Configuration write authorized and cache revalidated.',
      updatedBy: authUser.email,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Config write server error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
