import type { Metadata } from 'next';
import { Cairo, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tech-bokra.com'),
  title: 'تيك بكرة | Tech Bokra - حلول الأنظمة الأمنية، البنية التحتية، وبرمجيات الشركات',
  description: 'شركة تيك بكرة (Tech Bokra): رواد تأسيس البنية التحتية للشبكات، كاميرات المراقبة الذكية (CCTV)، أنظمة التيار الخفيف، وتطوير برمجيات الشركات وحلول ERP في مصر والشرق الأوسط.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
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
    'شركة إيماك الخرافي',
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
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'تيك بكرة - Tech Bokra Logo',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تيك بكرة | Tech Bokra',
    description: 'نبتكر الحلول الأمنية والتقنية لتأمين ونمو أعمالك.',
    images: ['/logo.svg'],
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
    <html 
      lang="ar" 
      dir="rtl" 
      suppressHydrationWarning 
      className={`dark ${cairo.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased selection:bg-[#00F2FE] selection:text-[#071120]" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e && e.message && (e.message.indexOf('Loading chunk') !== -1 || e.message.indexOf('ChunkLoadError') !== -1)) {
                  var lastReload = sessionStorage.getItem('tb_chunk_reload');
                  var now = Date.now();
                  if (!lastReload || (now - parseInt(lastReload, 10)) > 10000) {
                    sessionStorage.setItem('tb_chunk_reload', String(now));
                    window.location.reload();
                  }
                }
              });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ITServices',
              name: 'تيك بكرة | Tech Bokra',
              url: 'https://tech-bokra.com',
              logo: 'https://tech-bokra.com/logo.svg',
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
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
