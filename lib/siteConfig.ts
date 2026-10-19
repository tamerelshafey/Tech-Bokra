import { siteConfig as defaultSiteConfig, contentAr, contentEn, Project, ServiceItem } from '@/lib/content';
import { LogoEmblemStyle } from '@/components/TechBokraLogo';

export interface MediaVaultItem {
  id: string;
  name: string;
  url: string;
  size?: string;
  date: string;
  tag?: string;
}

export interface EditableConfig {
  // Logo & Branding
  logoEmblemStyle: LogoEmblemStyle;
  customLogoUrl: string;

  // Contact & Social
  whatsappNumber: string;
  phone: string;
  email: string;
  secondaryEmail: string;
  addressAr: string;
  addressEn: string;
  workingHoursAr: string;
  workingHoursEn: string;
  linkedinUrl: string;
  facebookUrl: string;

  // Hero & Brand Headlines
  heroBadgeAr: string;
  heroBadgeEn: string;
  heroTitleLine1Ar: string;
  heroTitleLine1En: string;
  heroTitleLine2Ar: string;
  heroTitleLine2En: string;
  heroSubAr: string;
  heroSubEn: string;

  // Announcement Banner
  showAnnouncement: boolean;
  announcementBadgeAr: string;
  announcementBadgeEn: string;
  announcementTextAr: string;
  announcementTextEn: string;
  announcementLink: string;

  // Trust Stats
  stat1Val: string;
  stat2Val: string;
  stat3Val: string;
  stat4Val: string;

  // Live Project URLs
  helioPropertyUrl: string;
  alrehlaUrl: string;

  // Media & Images CMS
  heroCctvImage?: string;
  heroNetworkImage?: string;
  heroAccessImage?: string;
  heroCloudImage?: string;

  // Projects CMS
  projectsList?: Project[];

  // Services CMS
  servicesList?: ServiceItem[];

  // FAQ CMS
  faqList?: { q: string; a: string }[];

  // Footer & Brand Bio
  brandBioAr?: string;
  brandBioEn?: string;
  commercialRegister?: string;
  taxId?: string;

  // Media Vault (Uploaded Assets Library)
  mediaVault?: MediaVaultItem[];
}

export const defaultEditableConfig: EditableConfig = {
  // Logo
  logoEmblemStyle: 'modern-tb',
  customLogoUrl: '',

  // Contact
  whatsappNumber: defaultSiteConfig.whatsappNumber,
  phone: defaultSiteConfig.phone,
  email: defaultSiteConfig.email,
  secondaryEmail: defaultSiteConfig.secondaryEmail,
  addressAr: defaultSiteConfig.addressAr,
  addressEn: defaultSiteConfig.addressEn,
  workingHoursAr: defaultSiteConfig.workingHoursAr,
  workingHoursEn: defaultSiteConfig.workingHoursEn,
  linkedinUrl: defaultSiteConfig.linkedinUrl,
  facebookUrl: defaultSiteConfig.facebookUrl,

  // Hero
  heroBadgeAr: contentAr.hero.badge,
  heroBadgeEn: contentEn.hero.badge,
  heroTitleLine1Ar: contentAr.hero.titleLine1,
  heroTitleLine1En: contentEn.hero.titleLine1,
  heroTitleLine2Ar: contentAr.hero.titleLine2,
  heroTitleLine2En: contentEn.hero.titleLine2,
  heroSubAr: contentAr.hero.sub,
  heroSubEn: contentEn.hero.sub,

  // Announcement
  showAnnouncement: true,
  announcementBadgeAr: 'مشروعات جديدة',
  announcementBadgeEn: 'New Projects',
  announcementTextAr: 'نعمل حالياً على تجهيز منصة هليو بروبرتي العقارية ومنصة الرحلة التفاعلية',
  announcementTextEn: 'Currently engineering Helio Property PropTech and Al-Rehla Interactive Platform',
  announcementLink: 'https://helio-property.vercel.app/',

  // Stats
  stat1Val: contentAr.stats.stat1Val,
  stat2Val: contentAr.stats.stat2Val,
  stat3Val: contentAr.stats.stat3Val,
  stat4Val: contentAr.stats.stat4Val,

  // Live Projects
  helioPropertyUrl: 'https://helio-property.vercel.app/',
  alrehlaUrl: 'https://www.alrehla.org/',

  // Media & Images CMS
  heroCctvImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
  heroNetworkImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
  heroAccessImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80',
  heroCloudImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',

  // Projects CMS
  projectsList: contentAr.projects.list,

  // Services CMS
  servicesList: contentAr.services.list,

  // FAQ CMS
  faqList: contentAr.faq.items,

  // Footer & Brand Bio
  brandBioAr: contentAr.footer.brandBio,
  brandBioEn: contentEn.footer.brandBio,
  commercialRegister: defaultSiteConfig.commercialRegister,
  taxId: defaultSiteConfig.taxId,

  // Media Vault default items
  mediaVault: [
    {
      id: 'vault-1',
      name: 'كاميرات المراقبة والذكاء الاصطناعي CCTV',
      url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
      size: '180 KB',
      date: '2025-01-10',
      tag: 'CCTV'
    },
    {
      id: 'vault-2',
      name: 'كابلات الفايبر وراك السيرفرات Network',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      size: '210 KB',
      date: '2025-01-12',
      tag: 'Network'
    },
    {
      id: 'vault-3',
      name: 'بوابات الدخول الذكية والتحكم البيومتري Access',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1200&q=80',
      size: '195 KB',
      date: '2025-01-14',
      tag: 'Access'
    },
    {
      id: 'vault-4',
      name: 'منصات البرمجيات السحابية ولوحات التحكم Cloud ERP',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      size: '220 KB',
      date: '2025-01-15',
      tag: 'Cloud'
    },
    {
      id: 'vault-5',
      name: 'برمجيات العقارات PropTech وإدارة الأصول',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      size: '240 KB',
      date: '2025-01-18',
      tag: 'PropTech'
    },
    {
      id: 'vault-6',
      name: 'منظومة إدارة رحلات وعمليات سياحية تفاعلية',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      size: '190 KB',
      date: '2025-01-20',
      tag: 'Tourism'
    }
  ],
};
