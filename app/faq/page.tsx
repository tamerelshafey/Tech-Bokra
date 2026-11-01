import React from 'react';
import type { Metadata } from 'next';
import FaqView from '@/components/FaqView';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة والاستفسارات التقنية | تيك بكرة - Tech Bokra',
  description: 'إجابات مباشرة وموثقة عن خدمات تيك بكرة: أنظمة المراقبة CCTV، شبكات البنية التحتية، التيار الخفيف، البرمجيات، دورة حياة المشروعات، وعقود الصيانة والضمان.',
  openGraph: {
    title: 'الأسئلة الشائعة | تيك بكرة - Tech Bokra',
    description: 'إجابات واضحة وشفافة حول التعاقد، التوريد، التركيبات، والضمان الفني للمشروعات الهندسية.',
    type: 'website',
    url: 'https://tech-bokra.com/faq',
  },
  alternates: {
    canonical: 'https://tech-bokra.com/faq',
  },
};

export default function FaqPage() {
  return <FaqView />;
}
