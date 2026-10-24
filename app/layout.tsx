import type { Metadata } from 'next';
import { Cairo, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';

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
  title: 'تيك بكرة | Tech Bokra - حلول تقنية متكاملة وهندسة البنية التحتية والأمن المادي',
  description: 'حلول تقنية متكاملة، مصممة وفق احتياجات أعمالك. نقدم حلول الأمن المادي والبنية التحتية التقنية والبرمجيات للشركات والمؤسسات، بدءًا من التخطيط والتصميم وحتى التنفيذ والدعم المستمر.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  keywords: [
    'تيك بكرة',
    'Tech Bokra',
    'حلول تقنية متكاملة',
    'أنظمة الأمن المادي',
    'كاميرات المراقبة CCTV',
    'التحكم في الدخول',
    'البنية التحتية والشبكات',
    'الكابلات المنظمة',
    'مراكز البيانات',
    'أنظمة التيار الخفيف ELV',
    'البرمجيات وحلول الأعمال',
    'Physical Security Systems',
    'Structured Cabling',
    'IT Infrastructure',
    'Enterprise Software'
  ],
  authors: [{ name: 'تيك بكرة - Tech Bokra' }],
  openGraph: {
    title: 'تيك بكرة | Tech Bokra - حلول تقنية متكاملة، مصممة وفق احتياجات أعمالك',
    description: 'نقدم حلول الأمن المادي والبنية التحتية التقنية والبرمجيات للشركات والمؤسسات — من التخطيط والتصميم إلى التنفيذ والدعم المستمر.',
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
    title: 'تيك بكرة | Tech Bokra - حلول هندسية وتقنية للأعمال',
    description: 'Integrated Technology Solutions. Engineered for Business.',
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
        <LanguageProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
