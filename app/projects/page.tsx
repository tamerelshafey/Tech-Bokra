import React from 'react';
import { notFound } from 'next/navigation';
import { fetchPublishedSiteSettings } from '@/lib/dbService';
import { hasVerifiedProjects } from '@/lib/content';
import ProjectsClientPage from '@/components/ProjectsClientPage';
import { Metadata } from 'next';

export const revalidate = false;
export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const publishedConfig = await fetchPublishedSiteSettings();
  const show =
    (publishedConfig.showProjectsSection ?? true) &&
    hasVerifiedProjects(publishedConfig.projectsList);

  if (!show) {
    notFound();
  }

  return {
    title: 'سابقة الأعمال والمشاريع | Tech Bokra',
    description: 'استعرض مشروعات تيك بكرة وسابقة أعمالنا في الأنظمة الأمنية والشبكات والتيار الخفيف والبرمجيات.',
  };
}

export default async function ProjectsPage() {
  const publishedConfig = await fetchPublishedSiteSettings();
  const show =
    (publishedConfig.showProjectsSection ?? true) &&
    hasVerifiedProjects(publishedConfig.projectsList);

  if (!show) {
    notFound();
  }

  return <ProjectsClientPage />;
}
