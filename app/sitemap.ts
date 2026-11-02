import { MetadataRoute } from 'next';
import { SUB_SERVICES, SERVICE_CATEGORIES } from '@/lib/services';
import { hasVerifiedProjects } from '@/lib/content';
import { fetchPublishedSiteSettings } from '@/lib/dbService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tech-bokra.com';
  const liveConfig = await fetchPublishedSiteSettings();

  const showProjects = (liveConfig.showProjectsSection ?? true) && hasVerifiedProjects(liveConfig.projectsList);
  const showEstimator = liveConfig.showEstimator ?? false;
  const showEngineeringHub = liveConfig.showEngineeringHub ?? false;
  const showTenders = liveConfig.showTenders ?? false;
  const showProcess = liveConfig.showProcessSection ?? true;
  const showFaq = liveConfig.showFaqSection ?? true;

  // Core static pages
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...(showProjects ? [{ url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }] : []),
    ...(showProcess ? [{ url: `${baseUrl}/process`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 }] : []),
    ...(showFaq ? [{ url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 }] : []),
    ...(showEngineeringHub ? [{ url: `${baseUrl}/engineering-hub`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }] : []),
    ...(showTenders ? [{ url: `${baseUrl}/tenders`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }] : []),
    ...(showEstimator ? [{ url: `${baseUrl}/estimator`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 }] : []),
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Category pages
  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(SERVICE_CATEGORIES).map((catKey) => ({
    url: `${baseUrl}/services/${catKey}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Only LIVE sub-services (21 coming-soon services are excluded per engineering constraints)
  const liveServicesRoutes: MetadataRoute.Sitemap = SUB_SERVICES
    .filter((s) => s.status === 'live')
    .map((s) => ({
      url: `${baseUrl}/services/${s.category}/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  // Dedicated dynamic projects pages
  const projectRoutes: MetadataRoute.Sitemap = showProjects && liveConfig.projectsList
    ? liveConfig.projectsList
        .filter((p) => p.showOnSite !== false)
        .map((p) => ({
          url: `${baseUrl}/projects/${p.slug || p.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
    : [];

  return [...coreRoutes, ...categoryRoutes, ...liveServicesRoutes, ...projectRoutes];
}
