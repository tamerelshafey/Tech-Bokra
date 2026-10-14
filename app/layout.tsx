import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'تيك بكرة | Tech Bokra - حلول الأنظمة الأمنية، البنية التحتية، وبرمجيات الشركات',
  description: 'شركة تيك بكرة (Tech Bokra): رواد تأسيس البنية التحتية للشبكات، كاميرات المراقبة الذكية (CCTV)، أنظمة التيار الخفيف، وتطوير برمجيات الشركات وحلول ERP في مصر والشرق الأوسط.',
  keywords: [
    'تيك بكرة',
    'Tech Bokra',
    'كاميرات مراقبة',
    'تيار خفيف',
    'شبكات وسيرفرات',
    'أنظمة ERP',
    'CCTV Egypt',
    'Low Current',
    'تطبيقات جوال',
    'مجلس الدولة',
    'هاسيندا رأس سدر',
    'محياي',
    'هليو ان',
    'EELAF KPI'
  ],
  authors: [{ name: 'تيك بكرة - Tech Bokra' }],
  openGraph: {
    title: 'تيك بكرة | Tech Bokra - هندسة المستقبل التقني والأمني',
    description: 'شريكك الاستراتيجي في تأسيس البنية التحتية المتطورة للشبكات والأنظمة الأمنية والحلول البرمجية لقطاع الأعمال والمنشآت الكبرى.',
    url: 'https://tech-bokra.com',
    siteName: 'تيك بكرة | Tech Bokra',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تيك بكرة | Tech Bokra',
    description: 'نبتكر الحلول الأمنية والتقنية لتأمين ونمو أعمالك.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ITServices',
              name: 'تيك بكرة | Tech Bokra',
              url: 'https://tech-bokra.com',
              logo: 'https://tech-bokra.com/logo.png',
              description: 'نبتكر الحلول الأمنية والتقنية لتأمين ونمو أعمالك - كاميرات مراقبة، شبكات، أنظمة تيار خفيف، وتطوير أنظمة ERP.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'مدينة نصر، القاهرة',
                addressCountry: 'EG',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+20-101-234-5678',
                contactType: 'customer service',
                availableLanguage: ['Arabic', 'English'],
              },
              sameAs: [
                'https://linkedin.com/company/tech-bokra',
                'https://facebook.com/techbokra',
              ],
            }),
          }}
        />
      </head>
      <body className="bg-[#071120] text-slate-100 antialiased selection:bg-[#00F2FE] selection:text-[#071120]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
