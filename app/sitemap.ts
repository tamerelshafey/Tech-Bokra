import { MetadataRoute } from 'next';
import { SUB_SERVICES, SERVICE_CATEGORIES } from '@/lib/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tech-bokra.com';

  // Core static pages
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/estimator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/engineering-hub`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
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

  return [...coreRoutes, ...categoryRoutes, ...liveServicesRoutes];
}
