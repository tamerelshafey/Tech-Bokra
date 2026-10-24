import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { 
  SUB_SERVICES, 
  SERVICE_CATEGORIES, 
  getServiceBySlug, 
  ServiceCategoryKey 
} from '@/lib/services';
import ServiceDetailTemplate from '@/components/ServiceDetailTemplate';

interface ServiceDetailPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return SUB_SERVICES.map((s) => ({
    category: s.category,
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service || service.category !== category) {
    return {
      title: 'الخدمة غير متوفرة | تيك بكرة',
      robots: { index: false, follow: false },
    };
  }

  // 21 coming-soon services must have noindex, follow: false
  if (service.status === 'coming-soon') {
    return {
      title: `${service.title.ar} (قريباً) | تيك بكرة`,
      description: service.summary.ar,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Live services
  return {
    title: `${service.seo.title.ar} | Tech Bokra`,
    description: service.seo.description.ar,
    openGraph: {
      title: `${service.seo.title.ar} | Tech Bokra`,
      description: service.seo.description.ar,
      type: 'article',
      images: service.image ? [{ url: service.image }] : undefined,
    },
    alternates: {
      canonical: `https://tech-bokra.com/services/${service.category}/${service.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { category, slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service || service.category !== category) {
    notFound();
  }

  const categoryObj = SERVICE_CATEGORIES[category as ServiceCategoryKey];
  if (!categoryObj) {
    notFound();
  }

  // JSON-LD structured data for LIVE services only (omitting any unconfirmed standards)
  const jsonLd = service.status === 'live' ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `https://tech-bokra.com/services/${service.category}/${service.slug}#service`,
        name: service.title.ar,
        description: service.summary.ar,
        provider: {
          '@type': 'Organization',
          name: 'تيك بكرة للحلول الهندسية المتكاملة',
          url: 'https://tech-bokra.com',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Egypt',
        },
        serviceType: categoryObj.title.ar,
        url: `https://tech-bokra.com/services/${service.category}/${service.slug}`,
        ...(service.image ? { image: service.image } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://tech-bokra.com/services/${service.category}/${service.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: 'https://tech-bokra.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'الخدمات والحلول',
            item: 'https://tech-bokra.com/services',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: categoryObj.title.ar,
            item: `https://tech-bokra.com/services/${categoryObj.slug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: service.title.ar,
            item: `https://tech-bokra.com/services/${categoryObj.slug}/${service.slug}`,
          },
        ],
      },
    ],
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ServiceDetailTemplate service={service} category={categoryObj} />
    </>
  );
}
