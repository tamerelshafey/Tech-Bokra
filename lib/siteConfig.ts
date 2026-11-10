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
  logoScale?: 'sm' | 'md' | 'lg' | 'xl';
  showLogoSubtitle?: boolean;
  showLogoArabicBadge?: boolean;
  customLogoHeight?: number;

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

  showAnnouncement: boolean;
  announcementBadgeAr: string;
  announcementBadgeEn: string;
  announcementTextAr: string;
  announcementTextEn: string;
  announcementLink: string;

  // Section Visibility Toggles (تحكم الظهور والإخفاء لأقسام وصفحات الموقع)
  showProjectsSection: boolean;   // سابقة الأعمال والمشاريع الحالية (الافتراضي: true)
  showEstimator: boolean;         // حاسبة وتخطيط تكلفة المشروع (الافتراضي: false)
  showTenders: boolean;           // مرصد المناقصات والممارسات (الافتراضي: false)
  showEngineeringHub: boolean;     // أدوات وحاسبة المهندسين (الافتراضي: false)
  showPartnersSection: boolean;   // منصات وتقنيات نعمل بها (الافتراضي: false)
  showProcessSection: boolean;    // آلية ومراحل العمل (الافتراضي: true)
  showFaqSection: boolean;        // الأسئلة الشائعة (الافتراضي: true)

  // Trust Stats Section Control (Default hidden pending verification)
  showStatsSection: boolean;
  stat1Val: string;
  stat1LabelAr?: string;
  stat1LabelEn?: string;
  stat1DescAr?: string;
  stat1DescEn?: string;
  stat2Val: string;
  stat2LabelAr?: string;
  stat2LabelEn?: string;
  stat2DescAr?: string;
  stat2DescEn?: string;
  stat3Val: string;
  stat3LabelAr?: string;
  stat3LabelEn?: string;
  stat3DescAr?: string;
  stat3DescEn?: string;
  stat4Val: string;
  stat4LabelAr?: string;
  stat4LabelEn?: string;
  stat4DescAr?: string;
  stat4DescEn?: string;

  // Media & Images CMS
  heroCctvImage?: string;
  heroNetworkImage?: string;
  heroAccessImage?: string;
  heroCloudImage?: string;

  // Projects CMS (Arabic & English)
  projectsList?: Project[];
  projectsListEn?: Project[];

  // Services CMS (Arabic & English)
  servicesList?: ServiceItem[];
  servicesListEn?: ServiceItem[];

  // Services Section Header & Branding (توحيد وضبط عناوين وشعار قسم الخدمات في الرئيسية وصفحة الخدمات)
  servicesBadgeAr?: string;
  servicesBadgeEn?: string;
  servicesTitleLine1Ar?: string;
  servicesTitleLine1En?: string;
  servicesTitleLine2Ar?: string;
  servicesTitleLine2En?: string;
  servicesSubAr?: string;
  servicesSubEn?: string;

  // FAQ CMS (Arabic & English)
  faqList?: { q: string; a: string }[];
  faqListEn?: { q: string; a: string }[];

  // Footer & Brand Bio
  brandBioAr?: string;
  brandBioEn?: string;
  commercialRegister?: string;
  taxId?: string;
  footerRightsAr?: string;
  footerRightsEn?: string;

  // Media Vault (Uploaded Assets Library)
  mediaVault?: MediaVaultItem[];

  // Content Version & Sync Metadata
  contentVersion?: number;
  updatedAt?: string;
}

export const CURRENT_CONTENT_VERSION = 4;

export const LEGACY_PROJECT_IDS: readonly string[] = [
  'alrehla',
  'alrehla-platform',
  'contracting-ops-platform',
  'helio-property',
  'widad-tech',
];

/**
 * Merge two collections of items by unique 'id'.
 * If seed has an equal or higher seedRevision, updates to the corrected seed version
 * while preserving custom administrator visibility and draft flags.
 * Ignores any legacy IDs passed via ignoredIds to purge stale cloud entries safely.
 */
export function mergeCollectionsById<T extends { id: string; seedRevision?: number }>(
  seedList: T[], 
  cloudList?: T[],
  ignoredIds?: readonly string[] | string[]
): T[] {
  const ignoredSet = new Set<string>(ignoredIds || []);

  if (!cloudList || !Array.isArray(cloudList) || cloudList.length === 0) {
    if (ignoredSet.size > 0) {
      return seedList.filter((s) => s && s.id && !ignoredSet.has(s.id));
    }
    return seedList;
  }

  const seedById = new Map<string, T>();
  for (const s of seedList) if (s && s.id && !ignoredSet.has(s.id)) seedById.set(s.id, s);

  const processedIds = new Set<string>(ignoredSet);
  const merged: T[] = [];

  for (const item of cloudList) {
    if (!item || !item.id || processedIds.has(item.id)) continue;
    const seed = seedById.get(item.id);
    if (seed && (seed.seedRevision ?? 0) >= (item.seedRevision ?? 0)) {
      // الكود أحدث أو مكافئ: نستبدل النسخة القديمة مع الإبقاء على اختيارات المشرف للإظهار والمسودة
      const keep: Record<string, unknown> = {};
      const flags = item as unknown as Record<string, unknown>;
      if (flags.showOnSite !== undefined) keep.showOnSite = flags.showOnSite;
      if (flags.isDraft !== undefined) keep.isDraft = flags.isDraft;
      merged.push({ ...seed, ...keep } as T);
    } else {
      const itemRecord = item as unknown as Record<string, unknown>;
      if (typeof itemRecord.image === 'string' && itemRecord.image.startsWith('data:image')) {
        const seedRecord = seed as unknown as Record<string, unknown> | undefined;
        merged.push({ ...item, image: (seedRecord?.image as string) || '' });
      } else {
        merged.push(item);
      }
    }
    processedIds.add(item.id);
  }

  for (const s of seedList) {
    if (s && s.id && !processedIds.has(s.id)) {
      merged.push(s);
      processedIds.add(s.id);
    }
  }
  return merged;
}

export const defaultEditableConfig: EditableConfig = {
  contentVersion: CURRENT_CONTENT_VERSION,
  // Logo
  logoEmblemStyle: 'modern-tb',
  customLogoUrl: '',
  logoScale: 'md',
  showLogoSubtitle: true,
  showLogoArabicBadge: true,
  customLogoHeight: 44,

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
  showAnnouncement: false,
  announcementBadgeAr: 'مشروعات وحلول',
  announcementBadgeEn: 'Solutions & Projects',
  announcementTextAr: 'نقدم استشارات هندسية متخصصة في أنظمة المراقبة والشبكات والتيار الخفيف',
  announcementTextEn: 'Specialized engineering consultations in surveillance, networking, and ELV systems',
  announcementLink: '',

  // Section Visibility Toggles (تحكم الظهور والإخفاء لأقسام وصفحات الموقع)
  showProjectsSection: true,      // سابقة الأعمال والمشاريع الحالية (مفعلة)
  showEstimator: false,          // حاسبة وتخطيط تكلفة المشروع (ملغاة افتراضياً بطلب المستخدم)
  showTenders: false,            // مرصد المناقصات والممارسات (ملغاة افتراضياً بطلب المستخدم)
  showEngineeringHub: false,      // أدوات وحاسبة المهندسين (ملغاة افتراضياً بطلب المستخدم)
  showPartnersSection: false,    // منصات وتقنيات نعمل بها (افتراضي غير مفعل حتى التأكيد)
  showProcessSection: true,      // آلية ومراحل العمل (مفعلة)
  showFaqSection: true,          // الأسئلة الشائعة (مفعلة)

  // Stats - Default hidden pending official verification
  showStatsSection: false,
  stat1Val: contentAr.stats.stat1Val,
  stat1LabelAr: contentAr.stats.stat1Label,
  stat1LabelEn: contentEn.stats.stat1Label,
  stat1DescAr: contentAr.stats.stat1Desc,
  stat1DescEn: contentEn.stats.stat1Desc,

  stat2Val: contentAr.stats.stat2Val,
  stat2LabelAr: contentAr.stats.stat2Label,
  stat2LabelEn: contentEn.stats.stat2Label,
  stat2DescAr: contentAr.stats.stat2Desc,
  stat2DescEn: contentEn.stats.stat2Desc,

  stat3Val: contentAr.stats.stat3Val,
  stat3LabelAr: contentAr.stats.stat3Label,
  stat3LabelEn: contentEn.stats.stat3Label,
  stat3DescAr: contentAr.stats.stat3Desc,
  stat3DescEn: contentEn.stats.stat3Desc,

  stat4Val: contentAr.stats.stat4Val,
  stat4LabelAr: contentAr.stats.stat4Label,
  stat4LabelEn: contentEn.stats.stat4Label,
  stat4DescAr: contentAr.stats.stat4Desc,
  stat4DescEn: contentEn.stats.stat4Desc,

  // Media & Images CMS
  heroCctvImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
  heroNetworkImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
  heroAccessImage: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
  heroCloudImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',

  // Projects CMS
  projectsList: contentAr.projects.list.map((p) => ({ ...p, seedRevision: CURRENT_CONTENT_VERSION })),
  projectsListEn: contentEn.projects.list.map((p) => ({ ...p, seedRevision: CURRENT_CONTENT_VERSION })),

  // Services CMS
  servicesList: contentAr.services.list,
  servicesListEn: contentEn.services.list,

  // Services Section Header & Branding (Unified to: Integrated Technology Solutions, Engineered for Business)
  servicesBadgeAr: 'حلول هندسية وتقنية للأعمال',
  servicesBadgeEn: 'Engineering & Technology Solutions for Business',
  servicesTitleLine1Ar: 'حلول تقنية متكاملة،',
  servicesTitleLine1En: 'Integrated Technology Solutions,',
  servicesTitleLine2Ar: 'مصممة وفق احتياجات أعمالك',
  servicesTitleLine2En: 'Engineered for Business',
  servicesSubAr: 'نقدم حلول الأمن المادي والبنية التحتية التقنية والبرمجيات للشركات والمؤسسات، بدءاً من دراسة الاحتياج والتصميم الهندسي، وصولاً إلى التوريد والتنفيذ والدعم المستمر.',
  servicesSubEn: 'We deliver physical security systems, technology infrastructure, and software solutions tailored to business needs — from requirements and design to implementation and ongoing support.',

  // FAQ CMS
  faqList: contentAr.faq.items,
  faqListEn: contentEn.faq.items,

  // Footer & Brand Bio
  brandBioAr: contentAr.footer.brandBio,
  brandBioEn: contentEn.footer.brandBio,
  commercialRegister: defaultSiteConfig.commercialRegister,
  taxId: defaultSiteConfig.taxId,
  footerRightsAr: contentAr.footer.rights,
  footerRightsEn: contentEn.footer.rights,

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
      url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
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
