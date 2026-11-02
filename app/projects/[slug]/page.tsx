import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetailView from '@/components/ProjectDetailView';
import { defaultEditableConfig } from '@/lib/siteConfig';
import { fetchPublishedSiteSettings } from '@/lib/dbService';
import { getProjectStatus, getProjectType, getVerifiedMetrics } from '@/lib/content';

export const revalidate = 60;
export const dynamicParams = true;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allProjects = defaultEditableConfig.projectsList || [];
  const params: { slug: string }[] = [];

  for (const p of allProjects) {
    if (p.slug) params.push({ slug: p.slug });
    if (p.id && p.id !== p.slug) params.push({ slug: p.id });
  }

  return params;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const publishedConfig = await fetchPublishedSiteSettings();

  if (publishedConfig.showProjectsSection === false) {
    notFound();
  }

  const projects = publishedConfig.projectsList || defaultEditableConfig.projectsList || [];
  const project = projects.find(
    (p) => (p.slug && p.slug.toLowerCase() === slug.toLowerCase()) || (p.id && p.id.toLowerCase() === slug.toLowerCase())
  );

  if (!project || project.isDraft === true || project.verified !== true || project.showOnSite === false) {
    notFound();
  }

  const title = `${project.title} | تيك بكرة - Tech Bokra`;
  const description = project.summary || project.highlight;
  const canonicalUrl = `https://tech-bokra.com/projects/${project.slug || project.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const publishedConfig = await fetchPublishedSiteSettings();

  if (publishedConfig.showProjectsSection === false) {
    notFound();
  }

  const projects = publishedConfig.projectsList || defaultEditableConfig.projectsList || [];
  const project = projects.find(
    (p) => (p.slug && p.slug.toLowerCase() === slug.toLowerCase()) || (p.id && p.id.toLowerCase() === slug.toLowerCase())
  );

  if (!project || project.isDraft === true || project.verified !== true || project.showOnSite === false) {
    notFound();
  }

  const pType = getProjectType(project);
  const canonicalUrl = `https://tech-bokra.com/projects/${project.slug || project.id}`;
  const verifiedMetrics = getVerifiedMetrics(project);

  // Determine Schema.org @type: SoftwareApplication for mobile apps, WebApplication for web/ai, Service for infrastructure
  let schemaType = 'Service';
  let extraSchemaProps: Record<string, any> = {};

  if (pType === 'mobile' || project.liveUrl?.includes('play.google.com')) {
    schemaType = 'SoftwareApplication';
    extraSchemaProps = {
      operatingSystem: 'Android',
      applicationCategory: 'UtilityApplication',
      ...(project.liveUrl ? { downloadUrl: project.liveUrl } : {}),
    };
  } else if (pType === 'web' || pType === 'ai') {
    schemaType = 'WebApplication';
    extraSchemaProps = {
      applicationCategory: 'BusinessApplication',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
    };
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: project.title,
    description: project.summary || project.highlight,
    url: canonicalUrl,
    image: project.image,
    author: {
      '@type': 'Organization',
      name: 'تيك بكرة - Tech Bokra',
      url: 'https://tech-bokra.com',
    },
    provider: {
      '@type': 'Organization',
      name: 'تيك بكرة - Tech Bokra',
      url: 'https://tech-bokra.com',
    },
    ...extraSchemaProps,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
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
        name: 'سابقة الأعمال والمشاريع',
        item: 'https://tech-bokra.com/projects',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectDetailView slug={slug} />
    </>
  );
}
