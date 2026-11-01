import React from 'react';
import type { Metadata } from 'next';
import ProcessView from '@/components/ProcessView';

export const metadata: Metadata = {
  title: 'آلية ومراحل العمل الهندسية | تيك بكرة - Tech Bokra',
  description: 'منهجية تنفيذ المشروعات الهندسية والتقنية لدى تيك بكرة، بدءاً من المعاينة الميدانية والتصميم، وحتى التوريد والتركيب والتشغيل والدعم الفني المستمر وفق الأكواد القياسية.',
  openGraph: {
    title: 'آلية ومراحل العمل الهندسية | تيك بكرة - Tech Bokra',
    description: 'منهجية تنفيذ المشروعات الهندسية والتقنية لدى تيك بكرة وفق معايير الجودة العالمية.',
    type: 'website',
    url: 'https://tech-bokra.com/process',
  },
  alternates: {
    canonical: 'https://tech-bokra.com/process',
  },
};

export default function ProcessPage() {
  return <ProcessView />;
}
