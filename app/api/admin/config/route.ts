import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/serverAuth';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

/**
 * Server-side endpoint to authorize and record customConfig modifications,
 * and purge/revalidate Next.js cache tags and paths on publish.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
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

    // Targeted cache revalidation based on modified fields (NEVER invalidate entire layout)
    try {
      const keys = Object.keys(body);
      const pathsToRevalidate = new Set<string>();

      // Field -> Route mapping
      const contactKeys = ['whatsappNumber', 'phone', 'email', 'secondaryEmail', 'addressAr', 'addressEn', 'workingHoursAr', 'workingHoursEn', 'linkedinUrl', 'facebookUrl'];
      const brandingKeys = ['customLogoUrl', 'logoEmblemStyle', 'logoScale', 'customLogoHeight', 'brandBioAr', 'brandBioEn', 'footerRightsAr', 'taxId', 'commercialRegister'];
      const heroKeys = ['heroBadgeAr', 'heroBadgeEn', 'heroTitleLine1Ar', 'heroTitleLine1En', 'heroTitleLine2Ar', 'heroTitleLine2En', 'heroSubAr', 'heroSubEn', 'showAnnouncement', 'announcementBadgeAr', 'announcementBadgeEn', 'announcementTextAr', 'announcementTextEn', 'announcementLink', 'heroCctvImage', 'heroNetworkImage', 'heroAccessImage', 'heroCloudImage'];
      const serviceKeys = ['servicesList', 'servicesListEn', 'servicesBadgeAr', 'servicesBadgeEn', 'servicesTitleLine1Ar', 'servicesTitleLine1En', 'servicesTitleLine2Ar', 'servicesTitleLine2En', 'servicesSubAr', 'servicesSubEn'];
      const faqKeys = ['faqList', 'faqListEn', 'showFaqSection'];
      const processKeys = ['showProcessSection'];
      const projectKeys = ['projectsList', 'projectsListEn', 'showProjectsSection'];

      const touches = (fieldList: string[]) => keys.some((k) => fieldList.includes(k));

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
    console.info(`[ADMIN AUDIT] customConfig update validated and revalidated for ${auth.user.email} (${auth.user.role}) at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Configuration write authorized and cache revalidated.',
      updatedBy: auth.user.email,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Config write server error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
