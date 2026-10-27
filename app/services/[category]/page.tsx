import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SERVICE_CATEGORIES, getServicesByCategory, ServiceCategoryKey } from '@/lib/services';
import CategoryView from '@/components/CategoryView';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { category: 'security' },
    { category: 'network' },
    { category: 'elv' },
    { category: 'software' },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryKey = category as ServiceCategoryKey;
  const catObj = SERVICE_CATEGORIES[categoryKey];

  if (!catObj) {
    return {
      title: 'القطاع الهندسي غير موجود | تيك بكرة',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${catObj.seo.title.ar} | Tech Bokra`,
    description: catObj.seo.description.ar,
    openGraph: {
      title: `${catObj.seo.title.ar} | Tech Bokra`,
      description: catObj.seo.description.ar,
      type: 'website',
    },
    alternates: {
      canonical: `https://tech-bokra.com/services/${catObj.id}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryKey = category as ServiceCategoryKey;
  const catObj = SERVICE_CATEGORIES[categoryKey];

  if (!catObj) {
    notFound();
  }

  const subServices = getServicesByCategory(categoryKey).map((s) => ({
    ...s,
    standards: s.standards.filter((std) => std.confirmed),
  }));

  return <CategoryView category={catObj} subServices={subServices} />;
}
