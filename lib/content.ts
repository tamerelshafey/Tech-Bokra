import { DEFAULT_SERVICES_LIST_AR, DEFAULT_SERVICES_LIST_EN } from '@/lib/services';

export interface ProjectMetric {
  label: string;
  value: string;
  source?: string;
  asOf?: string;
}

export interface ProjectLinks {
  live?: string;
  googlePlay?: string;
  appStore?: string;
  staging?: string;
  caseStudy?: string;
}

export interface ProjectMedia {
  cover?: string;
  screenshots?: string[];
}

export interface Project {
  id: string;
  slug?: string;
  type?: 'web' | 'mobile' | 'ai' | 'infrastructure';
  status?: 'delivered' | 'in_development';
  featured?: boolean;
  order?: number;
  seedRevision?: number;
  title: string;
  client: string;
  tag: string;
  category: 'security' | 'network' | 'software' | 'erp' | 'elv';
  description: string;
  summary: string;
  icon: string;
  image: string;
  highlight: string;
  sector?: string;
  challengeNeed?: string;
  scopeOfWork?: string[];
  statusNote?: string;
  stats: { label: string; value: string; source?: string; asOf?: string }[];
  metrics?: ProjectMetric[];
  technologies: string[];
  challenges: string[];
  solutions: string[];
  features?: string[];
  links?: ProjectLinks;
  media?: ProjectMedia;
  liveUrl?: string;
  statusBadge?: string;
  isUpcoming?: boolean;
  isDraft?: boolean;
  verified?: boolean;
  projectStatus?: 'completed' | 'ongoing'; // سابقة أعمال منفذة vs مشاريع جاري العمل عليها
  showOnSite?: boolean; // إمكانية الضبط للإظهار أو الإخفاء
  isNDA?: boolean;
}

/**
 * Normalizes project status into 'delivered' | 'in_development'
 */
export function getProjectStatus(p: Project): 'delivered' | 'in_development' {
  if (p.status) return p.status;
  if (p.projectStatus === 'ongoing' || p.isUpcoming) return 'in_development';
  return 'delivered';
}

/**
 * Normalizes project type into 'web' | 'mobile' | 'ai' | 'infrastructure'
 */
export function getProjectType(p: Project): 'web' | 'mobile' | 'ai' | 'infrastructure' {
  if (p.type) return p.type;
  if (p.category === 'security' || p.category === 'network' || p.category === 'elv') return 'infrastructure';
  if (p.liveUrl?.includes('play.google.com')) return 'mobile';
  if (p.id.includes('ai') || p.technologies.some(t => t.toLowerCase().includes('ai') || t.toLowerCase().includes('llm'))) return 'ai';
  return 'web';
}

/**
 * Extracts verified project metrics that have both source and asOf
 */
export function getVerifiedMetrics(p: Project): ProjectMetric[] {
  const verified: ProjectMetric[] = [];
  if (p.metrics && Array.isArray(p.metrics)) {
    for (const m of p.metrics) {
      if (m.source && m.source !== 'TO_CONFIRM' && m.asOf && m.asOf !== 'TO_CONFIRM') {
        verified.push(m);
      }
    }
  }
  // Check stats for backwards compatibility
  if (p.stats && Array.isArray(p.stats)) {
    for (const s of p.stats) {
      if (s.source && s.source !== 'TO_CONFIRM' && s.asOf && s.asOf !== 'TO_CONFIRM') {
        verified.push({ label: s.label, value: s.value, source: s.source, asOf: s.asOf });
      }
    }
  }
  return verified;
}

/**
 * Check if there is any verified, active project.
 * When false, /projects route and projects sections are completely hidden from visitors.
 */
export function hasVerifiedProjects(projects?: Project[]): boolean {
  const list = projects && Array.isArray(projects) && projects.length > 0 ? projects : contentAr.projects.list;
  return Array.isArray(list) && list.some((p) => p && p.verified === true && p.isDraft !== true && p.showOnSite !== false);
}

export interface ServiceItem {
  id: string;
  seedRevision?: number;
  title: string;
  shortDesc: string;
  category: string;
  iconName: string;
  image: string;
  points: string[];
  specs: { title: string; desc: string }[];
  deliverables: string[];
}

export interface SiteLanguageData {
  nav: {
    home: string;
    services: string;
    projects: string;
    architecture: string;
    estimator: string;
    process: string;
    faq: string;
    contact: string;
    surveyCta: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    sub: string;
    btnEstimate: string;
    btnContact: string;
    engineerOnline: string;
    cardTitle: string;
    cardSubtitle: string;
    guarantee1: string;
    guarantee2: string;
    guarantee3: string;
  };
  stats: {
    stat1Val: string;
    stat1Label: string;
    stat1Desc: string;
    stat2Val: string;
    stat2Label: string;
    stat2Desc: string;
    stat3Val: string;
    stat3Label: string;
    stat3Desc: string;
    stat4Val: string;
    stat4Label: string;
    stat4Desc: string;
  };
  services: {
    title: string;
    subtitle: string;
    allTab: string;
    secTab: string;
    netTab: string;
    softTab: string;
    erpTab: string;
    consultTab: string;
    orderCta: string;
    viewSpecs: string;
    list: ServiceItem[];
  };
  architecture: {
    title: string;
    subtitle: string;
    badge: string;
    coreBadge: string;
    tip: string;
  };
  estimator: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    facilityType: string;
    systemsSelect: string;
    scaleRange: string;
    maintenanceTier: string;
    resultTitle: string;
    estimatedDelivery: string;
    breakdownNote: string;
    sendWhatsappBtn: string;
    sendEmailBtn: string;
  };
  projects: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterUpcoming: string;
    filterSecurity: string;
    filterNetwork: string;
    filterSoftware: string;
    filterERP: string;
    filterELV?: string;
    viewDetails: string;
    closeModal: string;
    challengeTitle: string;
    solutionTitle: string;
    techTitle: string;
    livePreviewBtn: string;
    upcomingBadge: string;
    confidentialityNotice?: string;
    sectorLabel?: string;
    challengeLabel?: string;
    scopeLabel?: string;
    techLabel?: string;
    statusLabel?: string;
    list: Project[];
  };
  process: {
    title: string;
    subtitle: string;
    steps: {
      number: string;
      title: string;
      desc: string;
      features: string[];
    }[];
  };
  partners: {
    title: string;
    subtitle: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: {
      q: string;
      a: string;
    }[];
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    phoneLabel: string;
    phonePlaceholder: string;
    serviceLabel: string;
    governorateLabel: string;
    timelineLabel?: string;
    notesLabel: string;
    notesPlaceholder: string;
    helperNote?: string;
    disclaimer?: string;
    btnSubmit?: string;
    btnWhatsapp: string;
    btnEmail: string;
    btnSubmitting: string;
    successMessage: string;
    consultantPhone: string;
    quickResponseBadge: string;
  };
  footer: {
    brandBio: string;
    servicesTitle: string;
    quickLinksTitle: string;
    contactTitle: string;
    rights: string;
    taxId: string;
    addressVal: string;
  };
}

const rawPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || "";
const rawWhatsapp = process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || "";
const rawCR = process.env.NEXT_PUBLIC_COMPANY_CR || "";
const rawTaxId = process.env.NEXT_PUBLIC_COMPANY_TAX_ID || "";

export const siteConfig = {
  phone: (rawPhone && !rawPhone.includes('TO_CONFIRM') && !rawPhone.includes('[')) ? rawPhone : "",
  whatsappNumber: (rawWhatsapp && !rawWhatsapp.includes('TO_CONFIRM') && !rawWhatsapp.includes('[')) ? rawWhatsapp : "",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "Support@tech-bokra.com",
  secondaryEmail: process.env.NEXT_PUBLIC_COMPANY_SALES_EMAIL || "sales@tech-bokra.com",
  addressAr: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_AR || "مصر، القاهرة، مكرم عبيد، مدينة نصر",
  addressEn: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_EN || "Makram Ebeid, Nasr City, Cairo, Egypt",
  workingHoursAr: "السبت - الخميس: 9:00 ص - 6:00 م (خدمة الطوارئ 24/7 للمشتركين)",
  workingHoursEn: "Sat - Thu: 9:00 AM - 6:00 PM (24/7 SLA for Contract Clients)",
  linkedinUrl: process.env.NEXT_PUBLIC_COMPANY_LINKEDIN || "https://linkedin.com/company/tech-bokra",
  facebookUrl: process.env.NEXT_PUBLIC_COMPANY_FACEBOOK || "https://facebook.com/techbokra",
  commercialRegister: (rawCR && !rawCR.includes('TO_CONFIRM') && !rawCR.includes('[')) ? rawCR : "",
  taxId: (rawTaxId && !rawTaxId.includes('TO_CONFIRM') && !rawTaxId.includes('[')) ? rawTaxId : "",
};

export const contentAr: SiteLanguageData = {
  nav: {
    home: "الرئيسية",
    services: "خدماتنا وحلولنا",
    projects: "المشاريع وسابقة الأعمال",
    architecture: "أدوات وحاسبة المهندسين",
    estimator: "حاسبة التكلفة",
    process: "آلية العمل",
    faq: "الأسئلة الشائعة",
    contact: "تواصل معنا",
    surveyCta: "طلب معاينة واستفسار",
  },
  hero: {
    badge: "حلول تقنية متكاملة للأنظمة الأمنية والبنية التحتية والبرمجيات",
    titleLine1: "حلول تقنية متكاملة،",
    titleLine2: "مصممة وفق احتياجات أعمالك.",
    sub: "نقدم حلول الأمن المادي والبنية التحتية التقنية والبرمجيات للشركات والمؤسسات، بدءًا من تحديد الاحتياجات والتصميم، وصولًا إلى التنفيذ والدعم المستمر.",
    btnEstimate: "تخطيط وحساب نطاق المشروع",
    btnContact: "تحدث مع مستشار تقني",
    engineerOnline: "مهندسون واستشاريون جاهزون للرد على استفسارك",
    cardTitle: "مركز التحكم والعمليات الموحد",
    cardSubtitle: "مراقبة شبكية وأمنية ذكية في الوقت الفعلي",
    guarantee1: "استشارة فنية متخصصة",
    guarantee2: "أجهزة أصلية بضمان رسمي",
    guarantee3: "دعم فني واستجابة مستمرة",
  },
  stats: {
    stat1Val: "هندسي",
    stat1Label: "حلول مخصصة للمشروع",
    stat1Desc: "تصميم وتنفيذ يلبي متطلبات واشتراطات المنشأة",
    stat2Val: "معتمد",
    stat2Label: "أنظمة ومعدات معيارية",
    stat2Desc: "توريد أجهزة ومهمات أصلية من قنوات معتمدة",
    stat3Val: "كود",
    stat3Label: "مطابقة للمواصفات الفنية",
    stat3Desc: "التزام باشتراطات الكود الهندسي وجداول الكميات",
    stat4Val: "SLA",
    stat4Label: "عقود صيانة ودعم مستمر",
    stat4Desc: "صيانة وقائية واستجابة سريعة للأعطال",
  },
  services: {
    title: "حلول تقنية متكاملة، مصممة وفق احتياجات أعمالك",
    subtitle: "نقدم حلول الأمن المادي والبنية التحتية التقنية والبرمجيات للشركات والمؤسسات، بدءاً من دراسة الاحتياج والتصميم الهندسي، وصولاً إلى التوريد والتنفيذ والدعم المستمر.",
    allTab: "كافة الحلول",
    secTab: "أنظمة الأمن المادي",
    netTab: "الشبكات والبنية التحتية",
    softTab: "البرمجيات والحلول الرقمية",
    erpTab: "أنظمة التيار الخفيف",
    consultTab: "تكامل المشروعات",
    orderCta: "طلب دراسة مشروع",
    viewSpecs: "المواصفات الفنية والتسليمات",
    list: DEFAULT_SERVICES_LIST_AR,
  },
  architecture: {
    title: "مركز الأدوات الهندسية ومرصد المناقصات",
    subtitle: "حاسبة متقدمة لسعات تخزين الكاميرات والباندويث، مرصد لأحدث مناقصات وممارسات التيار الخفيف، ودليل إعداد الاعتمادات الفنية (Technical Submittals).",
    badge: "أدوات عملية للمهندسين والمقاولين",
    coreBadge: "حسابات معتمدة",
    tip: "اختر الأداة المناسبة لمشروعك للحصول على الحسابات الهندسية الدقيقة ومواصفات التوريد فوراً.",
  },
  estimator: {
    title: "حاسبة وتخطيط تكلفة المشروع الذكية",
    subtitle: "احصل على تقدير هندسي أولي لمشروعك خلال ثوانٍ، وتواصل مباشرة مع خبرائنا لمناقشة التفاصيل.",
    step1: "1. نوع المنشأة والقطاع",
    step2: "2. الأنظمة المطلوبة",
    step3: "3. الحجم وعدد النقاط",
    step4: "4. مستوى عقد الصيانة",
    facilityType: "نوع المنشأة",
    systemsSelect: "الأنظمة المطلوبة",
    scaleRange: "حجم المنشأة / النقاط",
    maintenanceTier: "مستوى الدعم وعقد الصيانة",
    resultTitle: "الملخص التقديري للمشروع الهندسـي",
    estimatedDelivery: "المدة الزمنية المتوقعة للتنفيذ",
    breakdownNote: "* هذه التقديرات أولية وتتحدد بدقة بناءً على المواصفات الفنية وجدول الكميات (BOQ).",
    sendWhatsappBtn: "إرسال هذا الاستفسار عبر واتساب",
    sendEmailBtn: "طلب استفسار وتواصل بهذا النطاق",
  },
  projects: {
    title: "المشاريع التي نعمل عليها وسابقة الأعمال",
    subtitle: "استعرض المشروعات التي نعمل على تنفيذها حالياً وسابقة أعمالنا المنجزة وفق أعلى المعايير الهندسية وجودة التسليم.",
    filterAll: "جميع المشاريع",
    filterUpcoming: "مشاريع نعمل عليها حالياً (جاري التنفيذ)",
    filterSecurity: "أنظمة الأمن المادي",
    filterNetwork: "الشبكات والبنية التحتية",
    filterSoftware: "البرمجيات والحلول الرقمية",
    filterERP: "أنظمة التيار الخفيف",
    filterELV: "أنظمة التيار الخفيف",
    viewDetails: "تفاصيل المشروع ونطاق العمل",
    closeModal: "إغلاق",
    challengeTitle: "التحدي أو الاحتياج الفعلي",
    solutionTitle: "نطاق العمل والحل المنفذ",
    techTitle: "الأنظمة والتقنيات المستخدمة",
    livePreviewBtn: "معاينة المنصة (Live)",
    upcomingBadge: "مشروع جاري العمل عليه",
    confidentialityNotice: "نلتزم باتفاقيات سرية البيانات (NDA) مع عملائنا؛ لذلك قد تُعرض بعض المشروعات دون ذكر الاسم التجاري للجهة أو تفاصيل المواقع الحساسة.",
    sectorLabel: "القطاع / نوع المنشأة",
    challengeLabel: "التحدي أو الاحتياج",
    scopeLabel: "نطاق العمل والحل المقدم",
    techLabel: "الأنظمة والتقنيات المستخدمة",
    statusLabel: "حالة المشروع",
    list: [
      {
        id: "mahyay-app",
        slug: "mahyay",
        type: "mobile",
        status: "delivered",
        title: "تطبيق مَحيّاي (Mahyay) - رفيق العبادات اليومية وتنظيم الطاعات",
        client: "مستخدمو الهواتف الذكية (Mahyay)",
        sector: "تطبيقات الهواتف الذكية ونمط الحياة الإسلامي",
        challengeNeed: "تطوير تطبيق هاتف ذكي مجاني بالكامل وبلا أي إعلانات يساعد المسلم على تنظيم عباداته اليومية ومتابعة الصلوات والأذكار والقرآن الكريم بسلاسة وخصوصية تامة.",
        scopeOfWork: [
          "برمجة تطبيق أندرويد خفيف وسريع خالٍ تماماً من الإعلانات والمشتريات المدفوعة",
          "بناء نظام تتبع الصلوات الخمس والسنن الرواتب مع تنبيهات مواقيت الصلاة الدقيقة والقبلة",
          "توفير أذكار الصباح والمساء واليوم والليلة مع سبحة إلكترونية تفاعلية",
          "تضمين المصحف الشريف وورد التلاوة اليومي ونشر التطبيق رسمياً على متجر Google Play",
        ],
        tag: "تطبيقات الهواتف الذكية",
        category: "software",
        icon: "Smartphone",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
        highlight: "تطبيق إسلامي مجاني بالكامل وبلا إعلانات لتنظيم العبادات اليومية، الصلوات، الأذكار، والمصحف الشريف.",
        summary: "تطوير وإطلاق تطبيق الهاتف الذكي 'مَحيّاي' على Google Play لمتابعة الصلوات والأذكار ومواقيت الصلاة بلا إعلانات.",
        description: "تطبيق أندرويد إسلامي شامل ومجاني، صُمم ليكون رفيق المسلم اليومي في تنظيم الطاعات؛ يتضمن متابعة أداء الصلوات والسنن، أذكار الصباح والمساء والنوم، تحديد اتجاه القبلة، مواقيت الصلاة، والمصحف الشريف في واجهة عربية هادئة وخفيفة.",
        stats: [
          { label: "المتجر الرسمي", value: "Google Play Store" },
          { label: "التنزيلات المعتمدة", value: "+50 عملية تنزيل", source: "Google Play Store", asOf: "2026-11" },
          { label: "نموذج التطبيق", value: "مجاني 100% بلا إعلانات", source: "Google Play Store", asOf: "2026-11" },
        ],
        metrics: [
          { label: "عمليات التنزيل", value: "+50 عملية تنزيل", source: "Google Play Store", asOf: "2026-11" },
          { label: "نموذج التشغيل", value: "مجاني تماماً وبلا إعلانات", source: "Google Play Store", asOf: "2026-11" },
        ],
        technologies: ["Android Application", "Google Play Console", "Local Notifications", "Prayer Times Algorithms", "Offline Data Storage"],
        challenges: [
          "الالتزام الصارم بتقديم تجربة مجانية ونقية خالية تماماً من الإعلانات الترويجية",
          "دقة حساب مواقيت الصلاة واتجاه القبلة عبر خوارزميات فلكية ومستشعرات الجهاز بدون استهلاك البطارية",
          "ضمان عمل التطبيق وقراءة الأذكار والمصحف في وضع عدم الاتصال (Offline)",
        ],
        solutions: [
          "بناء معمارية محلية خفيفة لا تتطلب اتصالات خارجية متكررة ولا تجمع بيانات خاصة",
          "استخدام مستشعرات البوصلة المدمجة وحسابات الموقع الجغرافي محلياً لحساب القبلة والمواقيت",
          "تخزين بيانات المصحف الشريف والأذكار كاملاً محلياً للوصول الفوري في أي وقت",
        ],
        links: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.mahyay.app",
        },
        liveUrl: "https://play.google.com/store/apps/details?id=com.mahyay.app",
        statusBadge: "منجز ومتاح على Google Play",
        projectStatus: "completed",
        isUpcoming: false,
        verified: false,
        showOnSite: true,
        isNDA: false,
      },
      {
        id: "helio-company-app",
        slug: "helio-directory",
        type: "mobile",
        status: "delivered",
        title: "تطبيق هيليو - دليل هليوبوليس الجديدة (Helio Directory)",
        client: "سكان ورواد مدينة هليوبوليس الجديدة",
        sector: "تطبيقات الأدلة الخدمية والتجارية للمدن والمجتمعات السكنية",
        challengeNeed: "توفير دليل رقمي شامل وموثق يخدم سكان وزوار مدينة هليوبوليس الجديدة، يجمع أرقام الطوارئ والمراكز الخدمية والطبية والتجارية والأنشطة اليومية مع الاتصال المباشر بنقرة واحدة.",
        scopeOfWork: [
          "تطوير وتصميم تطبيق محمول يغطي كافة قطاعات الخدمات بمدينة هليوبوليس الجديدة",
          "تنظيم أقسام الطوارئ، الصيدليات، العيادات والمراكز الطبية، المدارس، المطاعم والمقاهي، ووسائل النقل والمواصلات",
          "إتاحة مواعيد العمل الرسمية، العناوين التفصيلية، وخاصية الاتصال الهاتفي المباشر بنقرة واحدة",
          "إدارة واعتماد التطبيق على متجر Google Play بمعدل رضا مرتفع وتقييم 5.0 كامل",
        ],
        tag: "تطبيقات الهواتف الذكية",
        category: "software",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        highlight: "الدليل الخدمي والتجاري لسكان مدينة هليوبوليس الجديدة: أرقام الطوارئ، المطاعم، العيادات، المدارس، ومواعيد العمل.",
        summary: "تطوير وإطلاق دليل مدينة هليوبوليس الجديدة على Google Play بأكثر من 1,000 تنزيل وتقييم 5.0★ كامل.",
        description: "تطبيق الهاتف الرسمي لدليل مدينة هليوبوليس الجديدة على متجر Google Play؛ يقدم دليلاً مرتباً حسب الفئات يشمل خدمات الطوارئ، الرعاية الصحية، المدارس، الأنشطة التجارية، والمطاعم مع إمكانية الاتصال المباشر واستعراض أوقات العمل.",
        stats: [
          { label: "المتجر الرسمي", value: "Google Play Store" },
          { label: "التنزيلات المعتمدة", value: "+1,000 عملية تنزيل", source: "Google Play Store", asOf: "2026-11" },
          { label: "تقييم المستخدمين", value: "5.0 ★ تقييم كامل", source: "Google Play Store", asOf: "2026-11" },
        ],
        metrics: [
          { label: "عمليات التنزيل", value: "+1,000 عملية تنزيل", source: "Google Play Store", asOf: "2026-11" },
          { label: "تقييم المتجر", value: "5.0 ★ من 5 نجوم", source: "Google Play Store", asOf: "2026-11" },
        ],
        technologies: ["Android Application", "Google Play Console", "City Directory Architecture", "Direct-Dial Integration", "Categorized Search"],
        challenges: [
          "حصر وتحديث البيانات الخدمية والتجارية لمدينة حديثة التوسع كهليوبوليس الجديدة",
          "تنظيم الهيكل التصنيفي للأنشطة والخدمات لتيسير الوصول السريع في حالات الطوارئ",
          "الحفاظ على بساطة الاستخدام وسرعة الأداء مع التوسع المستمر في عدد الأماكن المسجلة",
        ],
        solutions: [
          "تقسيم الأنشطة إلى قطاعات واضحة (طوارئ، صحة، تعليم، مطاعم، مواصلات، خدمات حكومية)",
          "ربط أزرار الاتصال الهاتفي السريع والمواقع الجغرافية لكل منشأة مباشرة في واجهة التطبيق",
          "تطبيق معايير أداء خفيفة ساهمت في حصول التطبيق على تقييم 5.0★ وثقة أكثر من 1,000 مستخدم",
        ],
        links: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.helio.company&hl=en",
        },
        liveUrl: "https://play.google.com/store/apps/details?id=com.helio.company&hl=en",
        statusBadge: "منجز ومتاح على Google Play",
        projectStatus: "completed",
        isUpcoming: false,
        verified: false,
        showOnSite: true,
        isNDA: false,
      },
      {
        id: "bokra-ai",
        slug: "bokra-hrms",
        type: "ai",
        status: "in_development",
        title: "منظومة بكرة للموارد البشرية (Bokra HRMS AI-Powered)",
        client: "بكرة تك (Bokra HRMS)",
        sector: "إدارة الموارد البشرية وأتمتة الأعمال المؤسسية (HRTech & AI)",
        challengeNeed: "تطوير منظومة سحابية متقدمة لإدارة الموارد البشرية تعتمد على الذكاء الاصطناعي لإدارة الحضور والانصراف، مسيرات الرواتب والمكافآت، تقييمات أداء الموظفين، والتحليلات الذكية لإدارة المواهب.",
        scopeOfWork: [
          "بناء لوحة تحكم مركزية لإدارة ملفات الموظفين والهيكل التنظيمي للمؤسسة",
          "تطوير محرك حساب الرواتب والبدلات والاستقطاعات التلقائي وفق قوانين العمل",
          "برمجة دورات اعتماد الإجازات والطلبات متعددة المستويات مع التنبيهات الفورية",
          "توفير بيئة تجريبية حية وتفاعلية على Vercel لاختبار وحدات المنظومة وتدريب النماذج",
        ],
        tag: "الذكاء الاصطناعي والبرمجيات",
        category: "software",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        highlight: "منظومة ذكية لإدارة الموارد البشرية: أتمتة الحضور، مسيرات الرواتب، وتقييمات الأداء بالذكاء الاصطناعي.",
        summary: "تطوير منظومة Bokra HRMS لإدارة الموارد البشرية السحابية المدعومة بالذكاء الاصطناعي والأتمتة الذكية.",
        description: "حل مؤسسي شامل لإدارة الموارد البشرية وأتمتة العمليات الداخلية للشركات؛ يشمل تنظيم الحضور، احتساب مسيرات الرواتب، متابعة الإجازات، وتقييم أداء الكوادر بالتحليلات التنبؤية، مع بيئة معاينة مباشرة على Vercel.",
        stats: [
          { label: "المنظومة", value: "HRMS سحابي ذكي" },
          { label: "القدرات الذكية", value: "حساب رواتب وتحليلات أداء AI" },
          { label: "البيئة الحالية", value: "Staging معاينة حية" },
        ],
        technologies: ["Artificial Intelligence (AI)", "Next.js & TypeScript", "Tailwind CSS", "Vercel Staging", "HR Analytics", "Payroll Automation"],
        challenges: [
          "التعامل مع تعقيدات حسابات مسيرات الرواتب واختلاف لوائح الاستقطاعات والبدلات",
          "بناء تسلسل هرمي مرن للموافقات على الإجازات والطلبات يتناسب مع مختلف أحجام الشركات",
          "تقديم لوحات مؤشرات بيانية واضحة تمكّن الإدارة من اتخاذ قرارات سريعة ودقيقة",
        ],
        solutions: [
          "برمجة محرك قواعد محاسبي دقيق قابل للتخصيص حسب لوائح العمل الداخلية",
          "توفير نظام دورات عمل (Workflow) مرن يدعم الإسناد التلقائي والمتابعة اللحظية",
          "تصميم لوحات تحليلات بيانية تفاعلية تعرض مؤشرات الحضور وتكاليف القوى العاملة",
        ],
        links: {
          staging: "https://bokra-ai.vercel.app/",
          live: "https://bokra-ai.vercel.app/",
        },
        liveUrl: "https://bokra-ai.vercel.app/",
        statusBadge: "قيد التطوير - معاينة أولية (Staging)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: false,
        showOnSite: true,
        isNDA: false,
      },
      {
        id: "raed-platform",
        slug: "raed",
        type: "web",
        status: "in_development",
        title: "منصة رائد للتدريب والتنمية المتكاملة للأطفال والمراهقين",
        client: "منصة رائد (Raed)",
        sector: "التربية وتنمية المهارات الحياتية للأطفال والمراهقين",
        challengeNeed: "بناء تجربة رقمية عربية أصيلة تدمج التوجيه البشري الدافئ مع التفاعل الرقمي، وتخصص مسار التنمية لكل طفل بدل برنامج موحد للجميع.",
        scopeOfWork: [
          "تصميم وتطوير واجهة الموقع العربية RTL التي تشرح منهجية «رائد» ومحاورها الخمسة",
          "تجهيز رحلة التقييم المبدئي ومحاكي تفاعلي توضيحي لتجربة التقييم",
          "تجهيز تجربة التحدي اليومي داخل المنصة بنظام نقاط وشارات",
          "إتاحة صفحة تسجيل للمستخدمين وقنوات تواصل للشراكات المؤسسية (مدارس ومراكز تعليمية وأندية)",
          "نشر بيئة معاينة حية (Staging) على Vercel للمراجعة المستمرة",
        ],
        tag: "البرمجيات والحلول الرقمية",
        category: "software",
        icon: "Sparkles",
        // TEMP cover: replace with a real Raed screenshot uploaded from the admin portal (Media tab).
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        highlight: "منظومة تربوية رقمية تقوم على خمسة محاور تنموية ومسار تدريبي فردي مخصص لكل طفل.",
        summary: "منصة عربية للتدريب والتنمية الشاملة للأطفال والمراهقين، تجمع بين جلسة أسبوعية فردية مع مدرب وتحديات يومية تفاعلية داخل المنصة.",
        description: "منصة ويب عربية تقدم منهجية «رائد» للتنمية المتكاملة للأطفال والمراهقين في خمسة محاور: النفسي، الاجتماعي، الديني والقيمي، الصحي، والشخصي. تعتمد المنصة تفاعلاً مزدوجاً يجمع جلسة أسبوعية فردية مع مدرب وتحديات يومية قصيرة بنظام نقاط وشارات، مع مسار تدريبي مخصص يُبنى على تقييم أولي يشمل اختباراً تفاعلياً للطفل واستبياناً لولي الأمر وملاحظة المدرب، وتقارير دورية لأولياء الأمور. المشروع قيد التطوير وتتوفر له بيئة معاينة حية.",
        stats: [
          { label: "نوع المنصة", value: "منصة ويب" },
          { label: "حالة المشروع", value: "قيد التطوير – بيئة تجريبية حية" },
        ],
        technologies: ["منصة ويب بواجهة عربية RTL", "نشر سحابي على Vercel (Staging)"],
        challenges: [
          "تقديم محتوى عربي يناسب الهوية والقيم الثقافية للأسرة العربية",
          "تحقيق توازن بين التفاعل الرقمي وعدم الإفراط في وقت الشاشة",
          "مراعاة خصوصية الطفل وسلامته الرقمية",
        ],
        solutions: [
          "منهجية بخمسة محاور تكاملية بدل مسار واحد موحد",
          "تحديات يومية قصيرة مركزة تعزز ما يتدرب عليه الطفل في الجلسة",
          "تقارير دورية شفافة لولي الأمر وشراكة معه في المتابعة",
        ],
        features: [
          "خمسة محاور تنموية",
          "جلسة أسبوعية فردية مع مدرب",
          "تحديات يومية بنظام نقاط وشارات",
          "تقييم أولي ثلاثي المصادر",
          "تقارير لأولياء الأمور",
          "شراكات مؤسسية للمدارس والمراكز والأندية",
        ],
        links: {
          staging: "https://raed-sable.vercel.app/",
          live: "https://raed-sable.vercel.app/",
        },
        liveUrl: "https://raed-sable.vercel.app/",
        statusBadge: "مشروع نعمل عليه حالياً (قيد التطوير – معاينة حية)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: false,
        showOnSite: true,
        isDraft: false,
        isNDA: false,
      },
      {
        id: "logistics-cctv-access",
        slug: "logistics-cctv-access",
        type: "infrastructure",
        status: "delivered",
        title: "توريد وتركيب نظام المراقبة التلفزيونية والتحكم في الدخول",
        client: "مستودع لوجستي ومقر إداري",
        sector: "قطاع الخدمات اللوجستية والتوزيع",
        challengeNeed: "تأمين بوابات الدخول ومناطق الشحن والتفريغ، ومراقبة حركة الأفراد والمركبات بدقة على مدار الساعة وفق معايير الحماية الهندسية.",
        scopeOfWork: [
          "توزيع وتركيب كاميرات مراقبة شبكية عالية الدقة مع تغطية كاملة للمحيط الخارجي وصالات التخزين",
          "تركيب نظام تحكم في الدخول للمكاتب الإدارية وغرف التحكم المركزية",
          "ربط المنظومة بجهاز تسجيل مركزي NVR وشاشات متابعة مجهزة لغرفة الأمن",
          "تمديد شبكة كابلات محمية وتأمين التغذية الكهربائية بوحدة طاقة مستمرة (UPS)",
        ],
        tag: "أنظمة الأمن المادي",
        category: "security",
        icon: "ShieldAlert",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        highlight: "تأمين بوابات الدخول وصالات التخزين بمنظومة مراقبة شبكية وتحكم بيومتري مركزي.",
        summary: "توريد وتركيب كاميرات مراقبة IP ونظام تحكم في الدخول لمستودع لوجستي ومقر إداري.",
        description: "تنفيذ مشروع متكامل يشمل توزيع وتركيب كاميرات مراقبة شبكية عالية الدقة لتغطية المحيط وصالات التخزين ومناطق الشحن، مع نظام تحكم بالدخول للمكاتب وغرف التحكم، وربط المنظومة بجهاز تسجيل مركزي NVR وشاشات متابعة لغرفة الأمن.",
        stats: [
          { label: "نوع المنظومة", value: "كاميرات IP وتحكم بيومتري" },
          { label: "نطاق التغطية", value: "المحيط والصالات والمكاتب" },
          { label: "حالة المشروع", value: "تم التنفيذ والتسليم" },
        ],
        technologies: ["كاميرات مراقبة IP عالية الدقة", "أجهزة تسجيل NVR مركزية", "قارئات وبوابات تحكم في الدخول", "كابلات شبكة معتمدة", "وحدة تغذية طاقة مستمرة UPS"],
        challenges: [
          "اتساع المساحة التشغيلية وصالات التخزين المفتوحة",
          "كثافة حركة الشاحنات والأفراد على مدار 24 ساعة",
          "الحاجة لرؤية ليلية واضحة في ساحات الشحن والتفريغ",
        ],
        solutions: [
          "توزيع الكاميرات بزوايا رؤية مدروسة مع حساسات إضاءة منخفضة",
          "تنظيم صلاحيات الدخول للأفراد المصرح لهم في المكاتب وغرف التحكم",
          "تأمين استمرارية التغذية والتسجيل عبر وحدة طاقة مستمرة",
        ],
        statusBadge: "تم التنفيذ والتسليم (سابقة أعمال)",
        projectStatus: "completed",
        isUpcoming: false,
        verified: false,
        showOnSite: true,
        isNDA: true,
      },
      {
        id: "retail-structured-cabling",
        slug: "retail-structured-cabling",
        type: "infrastructure",
        status: "delivered",
        title: "تنفيذ البنية التحتية للشبكة والكابلات المنظمة لفرع تجاري جديد",
        client: "فرع تجاري وإداري جديد",
        sector: "قطاع التجزئة والمقار الإدارية",
        challengeNeed: "تأسيس بنية تحتية مرنة لربط أجهزة نقاط البيع (POS)، وأجهزة الموظفين، ونقاط الوصول اللاسلكي (Wi-Fi)، ونظام المراقبة، في مساحة تتطلب تنظيماً هندسياً دقيقاً وسهولة في الصيانة والتوسع.",
        scopeOfWork: [
          "تمديد وتنظيم مسارات الكابلات الشبكية (Structured Cabling)",
          "تركيب راك خوادم فرعي مجهز ومنظم بلوحات توزيع (Patch Panels)",
          "توصيل وبرمجة محولات الشبكة (Switches) وتوزيع النقاط الحيوية",
          "تجهيز نقاط الشبكة واختبار كفاءة الإرسال وتوثيق التوصيلات بلوحات ترقيم واضحة",
        ],
        tag: "الشبكات والبنية التحتية",
        category: "network",
        icon: "Network",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        highlight: "تأسيس بنية شبكات متكاملة تدعم نقاط البيع وأجهزة الموظفين وكاميرات المراقبة.",
        summary: "تمديد كابلات منظمة وتركيب راك خوادم ومحولات شبكة لفرع تجاري جديد.",
        description: "تنفيذ أعمال الكابلات المنظمة وتجهيز كابينة الخوادم وربط نقاط البيع والشبكة اللاسلكية وأنظمة المراقبة في بيئة عمل منظمة وقابلة للتوسع والصيانة بسهولة.",
        stats: [
          { label: "الكابلات المستخدمة", value: "Cat6 معتمدة" },
          { label: "نقاط الاتصال", value: "POS، Wi-Fi، كاميرات، مكاتب" },
          { label: "حالة المشروع", value: "تم التنفيذ بنجاح" },
        ],
        technologies: ["كابلات شبكة Cat6 معتمدة", "لوحات توزيع Patch Panels", "كابينة راك حائطية مجهزة", "محولات شبكة Managed Switches", "نقاط وصول لاسلكية Enterprise Access Points"],
        challenges: [
          "تنسيق مسارات التمديد مع التشطيبات الداخلية والديكور",
          "ضرورة تفادي أي تداخل أو توقف لنقاط البيع والمعاملات",
          "أهمية التوثيق والترقيم الدقيق لسهولة الصيانة المستقبلية",
        ],
        solutions: [
          "استخدام مسارات كابلات محمية مطابقة لمعايير السلامة",
          "عزل حركة شبكة نقاط البيع في شبكة افتراضية (VLAN) مستقلة",
          "ترقيم وتوثيق كافة النقاط وتسليم مخططات التوصيل وتقارير الفحص",
        ],
        statusBadge: "تم التنفيذ والتسليم بنجاح (سابقة أعمال)",
        projectStatus: "completed",
        isUpcoming: false,
        verified: false,
        showOnSite: true,
        isNDA: true,
      },
      {
        id: "industrial-fire-alarm",
        slug: "industrial-fire-alarm",
        type: "infrastructure",
        status: "delivered",
        title: "توريد وتركيب نظام الإنذار المبكر ومكافحة الحريق لمجمع صناعي",
        client: "مجمع صناعي وخطوط إنتاج",
        sector: "القطاع الصناعي والتصنيع",
        challengeNeed: "تأمين بيئة إنتاجية صناعية حساسة ضد مخاطر الحريق، والربط المباشر مع لوحات التحكم وأنظمة الإخلاء الآلي وفق اشتراطات السلامة الهندسية.",
        scopeOfWork: [
          "تركيب لوحة إنذار حريق عنونة ذكية (Addressable Fire Alarm Panel)",
          "توزيع كواشف الدخان والحرارة المقاومة للأتربة والظروف الصناعية",
          "ربط نظام سحب الدخان وفتح بوابات الطوارئ أوتوماتيكياً",
          "اختبار التكامل الشامل وتسليم شهادات الفحص الهندسي والاعتماد",
        ],
        tag: "أنظمة التيار الخفيف ELV",
        category: "elv",
        icon: "ShieldAlert",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        highlight: "حماية خطوط الإنتاج والمستودعات بنظام إنذار حريق معنون مع إخلاء آلي.",
        summary: "تنفيذ شبكة إنذار حريق معنونة ذكية وربطها بأنظمة الإخلاء لمجمع صناعي.",
        description: "مشروع توريد وتركيب شبكة إنذار حريق متكاملة تشمل اللوحات المعنونة، الكواشف الحرارية، السراين الصوتية، ووحدات التحكم في بوابات الطوارئ ونظم التهوية الميكانيكية.",
        stats: [
          { label: "نوع اللوحة", value: "Addressable ذكية" },
          { label: "المطابقة", value: "اشتراطات الدفاع المدني والكود" },
          { label: "حالة المشروع", value: "تم التسليم والاعتماد" },
        ],
        technologies: ["لوحة إنذار معنونة ذكية", "كواشف دخان بصرية وحرارية", "كابلات حريق معتمدة مقاومة للحرارة", "سراين ضوئية وصوتية", "نظام الربط مع مخارج الطوارئ"],
        challenges: [
          "وجود أتربة صناعية واهتزازات تتطلب كواشف ذات حساسية معيرة",
          "ضرورة الربط مع بوابات الطوارئ ونظام سحب الدخان بسلاسة",
        ],
        solutions: [
          "اعتماد كواشف صناعية معزولة لمنع الإنذارات الخاطئة",
          "برمجة سيناريوهات إخلاء فورية متعددة المراحل",
        ],
        statusBadge: "تم التنفيذ والاعتماد (سابقة أعمال)",
        projectStatus: "completed",
        isUpcoming: false,
        verified: false,
        showOnSite: true,
        isNDA: true,
      },
    ],
  },
  process: {
    title: "رحلة العميل معنا",
    subtitle: "منهجية عمل واضحة تضمن تنفيذ مشروعك بأعلى كفاءة وبدون مفاجآت.",
    steps: [
      {
        number: "1",
        title: "المعاينة والتخطيط",
        desc: "ندرس طبيعة منشأتك ونحدد الاحتياجات التقنية الدقيقة لتقديم أفضل حل هندسي.",
        features: ["دراسة متطلبات المنشأة", "فحص مسارات الكابلات والتأريض", "تحديد نوعية الأجهزة والعدسات المناسبة"],
      },
      {
        number: "2",
        title: "الهندسة والتصميم",
        desc: "نرسم مخططاً هندسياً متكاملاً لضمان أعلى كفاءة بأقل تكلفة مع جدول كميات واضح (BOQ).",
        features: ["مخطط توزيـع بصري للزوايا", "جدول كميات ومواصفات تفصيلي", "خيارات بديلة تناسب الميزانية"],
      },
      {
        number: "3",
        title: "التنفيذ والتشغيل",
        desc: "يقوم فريقنا الفني بتركيب الأنظمة واختبارها بدقة متناهية وفق أعلى معايير الجودة.",
        features: ["كابلات نحاسية وفايبر أصلية 100%", "ترتيب وتنسيق السيرفر راك باحترافية", "اختبارات سرعة واعتمادية Fluke Test"],
      },
      {
        number: "4",
        title: "الدعم المستمر",
        desc: "نؤمن لك عقود صيانة دورية ودعماً فنياً فورياً لاستمرارية عمل أنظمتك بلا توقف.",
        features: ["دورة تدريبية لفريقك على البرامج", "شهادات الضمان والوكالة الرسمية", "دعم فني واستجابة فورية للأعطال"],
      },
    ],
  },
  partners: {
    title: "المعدات والتقنيات المستخدمة في المشروعات",
    subtitle: "نعتمد على مواصفات وتجهيزات هندسية معيارية لضمان كفاءة واعتمادية البنية التحتية والأنظمة الأمنية.",
  },
  faq: {
    title: "الأسئلة الشائعة حول خدماتنا",
    subtitle: "إجابات عملية ومباشرة حول نطاق خدماتنا، نماذج التعاقد، والدعم الفني للمشروعات.",
    items: [
      {
        q: "ما طبيعة الخدمات والحلول التي تقدمها شركة تيك بكرة؟",
        a: "تقدم تيك بكرة حلولاً هندسية وتقنية متكاملة للشركات والمؤسسات، تشمل أنظمة الأمن المادي (كاميرات المراقبة، التحكم في الدخول، البوابات)، وتأسيس البنية التحتية والشبكات، وأنظمة التيار الخفيف، إلى جانب تطوير البرمجيات والحلول الرقمية وتكامل الأنظمة.",
      },
      {
        q: "هل تقدمون خدمات التوريد فقط أم التوريد والتنفيذ والتشغيل؟",
        a: "نوفر خدمات متكاملة تبدأ من دراسة الاحتياج والتصميم الهندسي، ثم توريد المهمات والأنظمة المعتمدة، مروراً بأعمال التركيب والبرمجة والتشغيل الفعلي، مع إمكانية تقديم الدعم الفني والتدريب للمشغلين.",
      },
      {
        q: "كيف تبدأ الخطوة الأولى للتعامل معكم في أي مشروع؟",
        a: "تبدأ الخطوة الأولى بالتواصل معنا عبر نموذج طلب دراسة المشروع أو الهاتف/واتساب، لتوضيح طبيعة المشروع ومتطلباته؛ ويقوم فريقنا بمراجعة التفاصيل، وتحديد موعد للمعاينة أو الاجتماع الفني، ثم إعداد مقترح الحل وجدول الكميات (BOQ).",
      },
      {
        q: "هل تقدمون خدمات عقود الدعم الفني والصيانة بعد التنفيذ؟",
        a: "نعم، نوفر خيارات عقود صيانة سنوية ودعم فني منتظم للمنشآت والمشروعات المنفذة، تتضمن الفحص الوقائي، وسرعة الاستجابة للأعطال، وتأمين استمرارية عمل الأنظمة بكفاءة.",
      },
      {
        q: "هل تعملون مع المنشآت الصغيرة والمتوسطة أم الكبرى فقط؟",
        a: "نصمم حلولنا وفق حجم واحتياج كل منشأة، ونتعامل مع المشروعات بمختلف أحجامها، سواء تأسيس فرع أو منشأة تجارية صغيرة/متوسطة، أو تنفيذ وتأمين مواقع ومستودعات ومقار إدارية كبرى.",
      },
      {
        q: "هل تشمل حلولكم الأنظمة الأمنية والبنية التحتية معًا؟",
        a: "نعم، هذه إحدى نقاط القوة لدينا؛ إذ نقدم حلولاً متكاملة تجمع بين تمديد الشبكات والكابلات، وربط كاميرات المراقبة، وأنظمة الدخول، والبرمجيات في بنية تشغيلية واحدة متوافقة دون الحاجة لتعدد المقاولين.",
      },
    ],
  },
  contact: {
    title: "تواصل معنا لمناقشة مشروعك",
    subtitle: "أرسل إلينا احتياجاتك الأولية، وسيقوم فريقنا الهندسي بدراسة المتطلبات والتواصل معك لتحديد الخطوة التالية.",
    nameLabel: "الاسم بالكامل",
    namePlaceholder: "الاسم الكريم",
    companyLabel: "اسم الشركة أو الجهة",
    companyPlaceholder: "اسم شركتك أو جهتك",
    emailLabel: "البريد الإلكتروني للعمل",
    emailPlaceholder: "name@company.com",
    phoneLabel: "رقم الهاتف / واتساب",
    phonePlaceholder: "01012345678",
    serviceLabel: "نوع الحل أو الخدمة المطلوبة",
    governorateLabel: "موقع أو نطاق تنفيذ المشروع (المحافظة / المدينة)",
    timelineLabel: "الإطار الزمني المتوقع للبدء",
    notesLabel: "وصف مختصر للمشروع أو الاحتياج (مع إشارة: هل لديك مواصفات فنية أو كراسة شروط؟)",
    notesPlaceholder: "اذكر طبيعة الاحتياج، نطاق العمل التقريبي، أو أشر إلى وجود كراسة شروط ومواصفات للتنسيق بشأنها...",
    helperNote: "المعلومات التي تساعدنا على فهم طلبك: الاسم واسم الشركة، البريد الإلكتروني ورقم الهاتف، نوع الخدمة المطلوبة، موقع المشروع، وصف مختصر للاحتياج، والجدول الزمني المتوقع. نهدف إلى فهم احتياجك بوضوح قبل اقتراح الحل المناسب.",
    disclaimer: "* ملاحظة: إرسال هذا النموذج يعد استفساراً أولياً ولا يترتب عليه أي التزام تعاقدي أو عرض سعر نهائي قبل مراجعة المتطلبات والتأكيد الفني.",
    btnSubmit: "إرسال استفسار المشروع",
    btnWhatsapp: "إرسال عبر واتساب",
    btnEmail: "إرسال كبريد إلكتروني",
    btnSubmitting: "جارٍ إرسال استفسار المشروع...",
    successMessage: "تم إرسال استفسارك بنجاح! سيقوم فريق تيك بكرة بدراسة المتطلبات والتواصل معك لمناقشة الخطوة التالية.",
    consultantPhone: "أو تواصل مباشرة مع فريق المشروعات:",
    quickResponseBadge: "تنسيق هندسي ومتابعة مباشرة للاستفسارات",
  },
  footer: {
    brandBio: "حلول تقنية متكاملة، مصممة وفق احتياجات أعمالك. تشمل أنظمة الأمن المادي، والبنية التحتية، والبرمجيات للشركات مع تنفيذ المشروعات والدعم المستمر.",
    servicesTitle: "الحلول والخدمات",
    quickLinksTitle: "روابط سريعة",
    contactTitle: "تواصل معنا",
    rights: "© Tech Bokra. جميع الحقوق محفوظة.",
    taxId: (siteConfig.taxId && siteConfig.commercialRegister) ? `سجل تجاري: ${siteConfig.commercialRegister} • بطاقة ضريبية: ${siteConfig.taxId}` : "",
    addressVal: "مصر، القاهرة، مدينة نصر",
  },
};

export const contentEn: SiteLanguageData = {
  nav: {
    home: "Home",
    services: "Services & Solutions",
    projects: "Projects & Portfolio",
    architecture: "Engineering Hub",
    estimator: "Cost Estimator",
    process: "Our Process",
    faq: "FAQ",
    contact: "Contact Us",
    surveyCta: "Request Survey & Quote",
  },
  hero: {
    badge: "Integrated Technology Solutions for Security, Infrastructure & Software",
    titleLine1: "Integrated Technology Solutions.",
    titleLine2: "Engineered for Business.",
    sub: "We deliver physical security systems, technology infrastructure, and software solutions tailored to business needs — from requirements and design to implementation and ongoing support.",
    btnEstimate: "Configure Project Scope",
    btnContact: "Consult an Engineer",
    engineerOnline: "Certified Engineers Ready to Assist You",
    cardTitle: "Unified Command & Control Center",
    cardSubtitle: "Real-time intelligent network and security telemetry",
    guarantee1: "Specialized Engineering Consultation",
    guarantee2: "Standard Certified Equipment",
    guarantee3: "Structured SLA Technical Support",
  },
  stats: {
    stat1Val: "Tailored",
    stat1Label: "Project-Tailored Solutions",
    stat1Desc: "Custom engineering fit for your facility requirements",
    stat2Val: "Standard",
    stat2Label: "Standard Certified Hardware",
    stat2Desc: "Genuine equipment from authorized agency channels",
    stat3Val: "Compliance",
    stat3Label: "Technical Specifications",
    stat3Desc: "Strict adherence to engineering codes and project BOQs",
    stat4Val: "SLA",
    stat4Label: "Preventative Maintenance & SLA",
    stat4Desc: "Structured SLA contracts and rapid fault response",
  },
  services: {
    title: "Integrated Technology Solutions, Engineered for Business",
    subtitle: "We deliver physical security systems, technology infrastructure, and software solutions tailored to business needs — from requirements and design to implementation and ongoing support.",
    allTab: "All Solutions",
    secTab: "Physical Security Systems",
    netTab: "Networking & IT Infrastructure",
    softTab: "Software & Digital Solutions",
    erpTab: "Low Current / ELV Systems",
    consultTab: "Project Integration",
    orderCta: "Request Project Study",
    viewSpecs: "Technical Specs & Deliverables",
    list: DEFAULT_SERVICES_LIST_EN,
  },
  architecture: {
    title: "Engineering Hub & Tenders Radar",
    subtitle: "Advanced CCTV storage & bandwidth calculator, live security and network tenders radar, and technical submittal services.",
    badge: "Practical Tools for Engineers & Contractors",
    coreBadge: "Verified Calculations",
    tip: "Select the tool tailored for your project to obtain precision engineering metrics and supply specifications instantly.",
  },
  estimator: {
    title: "Interactive Project Scope & Cost Estimator",
    subtitle: "Get an instant preliminary scope breakdown in seconds, and contact our consultants directly.",
    step1: "1. Facility Type",
    step2: "2. Required Systems",
    step3: "3. Scope & Node Count",
    step4: "4. Maintenance Level",
    facilityType: "Facility Type",
    systemsSelect: "Required Systems",
    scaleRange: "Scale / Node Count",
    maintenanceTier: "SLA Support Level",
    resultTitle: "Preliminary Engineering Scope Summary",
    estimatedDelivery: "Estimated Implementation Timeline",
    breakdownNote: "* Estimates are indicative and finalized following technical review and BOQ specification.",
    sendWhatsappBtn: "Send Inquiry via WhatsApp",
    sendEmailBtn: "Contact Us Regarding this Scope",
  },
  projects: {
    title: "Current Projects & Completed Works",
    subtitle: "Explore our active ongoing projects and delivered engineering portfolio spanning surveillance, networking, ELV, and enterprise software.",
    filterAll: "All Projects",
    filterUpcoming: "Ongoing Projects (In Progress)",
    filterSecurity: "Physical Security",
    filterNetwork: "Networking & IT Infrastructure",
    filterSoftware: "Software & Digital Solutions",
    filterERP: "Low Current / ELV",
    filterELV: "Low Current / ELV",
    viewDetails: "View Project Details",
    closeModal: "Close",
    challengeTitle: "Engineering Challenge",
    solutionTitle: "Tech Bokra Implemented Scope & Solution",
    techTitle: "Technologies & Systems Deployed",
    livePreviewBtn: "Visit Live Platform",
    upcomingBadge: "Active Ongoing Project",
    confidentialityNotice: "We strictly adhere to Non-Disclosure Agreements (NDAs); certain projects are presented without disclosing client trade names or sensitive operational locations.",
    sectorLabel: "Sector / Facility Type",
    challengeLabel: "Operational Need / Challenge",
    scopeLabel: "Delivered Solution Scope",
    techLabel: "Systems & Technologies Deployed",
    statusLabel: "Project Status",
    list: [
      {
        id: "mahyay-app",
        slug: "mahyay",
        type: "mobile",
        status: "delivered",
        title: "Mahyay App - Free Ad-Free Daily Islamic Routine & Worship Tracker",
        client: "Mobile App Users (Mahyay)",
        sector: "Mobile Applications & Islamic Lifestyle",
        challengeNeed: "Engineering and publishing a completely free, 100% ad-free native Android mobile application that assists users in organizing daily worship, prayer tracking, athkar, and Quran recitation with high privacy.",
        scopeOfWork: [
          "Lightweight, battery-efficient Android mobile application development with zero advertisements or paywalls",
          "Five daily prayers and sunnah habit tracker with precise astronomical prayer time calculations and Qibla compass",
          "Morning, evening, and bedtime athkar collections with an interactive digital tasbih",
          "Complete Quran reader and daily reading portion tracking, published officially on Google Play",
        ],
        tag: "Mobile Applications",
        category: "software",
        icon: "Smartphone",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
        highlight: "Completely free, ad-free Islamic routine mobile companion for prayer tracking, daily athkar, and Quran.",
        summary: "Turnkey development and official Google Play launch of Mahyay, a privacy-first Islamic routine app with verified downloads.",
        description: "Comprehensive Android application crafted to accompany daily worship; features prayer tracking, morning/evening athkar, precise Qibla direction, astronomical prayer alerts, and Holy Quran reading in an uncluttered, peaceful Arabic UI.",
        stats: [
          { label: "Store", value: "Google Play Store" },
          { label: "Verified Downloads", value: "+50 Downloads", source: "Google Play Store", asOf: "2026-11" },
          { label: "Monetization", value: "100% Free & Ad-Free", source: "Google Play Store", asOf: "2026-11" },
        ],
        metrics: [
          { label: "Store Downloads", value: "+50 Downloads", source: "Google Play Store", asOf: "2026-11" },
          { label: "Ad Experience", value: "100% Free & Zero Ads", source: "Google Play Store", asOf: "2026-11" },
        ],
        technologies: ["Android Application", "Google Play Console", "Local Notifications", "Prayer Times Algorithms", "Offline Data Storage"],
        challenges: [
          "Strict commitment to an ad-free, respectful experience without any intrusive popups or tracking",
          "High accuracy for prayer times and compass Qibla alignment across diverse geographic zones with minimal battery drain",
          "Ensuring complete offline access for all athkar and Quran texts without requiring network connectivity",
        ],
        solutions: [
          "Clean local architecture eliminating third-party ad networks and unnecessary analytics scripts",
          "Built-in sensor filtering and mathematical solar altitude equations executed on-device",
          "Complete local database bundling enabling immediate access anytime, anywhere",
        ],
        links: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.mahyay.app",
        },
        liveUrl: "https://play.google.com/store/apps/details?id=com.mahyay.app",
        statusBadge: "Delivered & Live on Google Play",
        projectStatus: "completed",
        isUpcoming: false,
        verified: false,
        showOnSite: true,
        isNDA: false,
      },
      {
        id: "helio-company-app",
        slug: "helio-directory",
        type: "mobile",
        status: "delivered",
        title: "Helio App - New Heliopolis City Commercial & Services Directory",
        client: "Residents & Visitors of New Heliopolis City",
        sector: "City Directory & Community Services Apps",
        challengeNeed: "Developing an authoritative, categorized city directory serving residents and visitors of New Heliopolis City, consolidating emergency contacts, healthcare, dining, education, and transportation with one-tap dialing.",
        scopeOfWork: [
          "Turnkey mobile app development covering all service and commercial sectors of New Heliopolis City",
          "Categorized hubs for emergency lines, pharmacies, clinics, schools, restaurants, cafes, and transportation",
          "Display of verified operating hours, exact addresses, and direct phone dialing in one touch",
          "Full publishing, review clearance, and release on Google Play Store achieving a 5.0★ rating",
        ],
        tag: "Mobile Applications",
        category: "software",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        highlight: "Integrated commercial and emergency directory for New Heliopolis City residents: emergency, dining, clinics, and one-tap dialing.",
        summary: "Development and official Google Play release of the New Heliopolis City Directory, surpassing 1,000 downloads with a 5.0★ rating.",
        description: "Official Android mobile guide for New Heliopolis City on Google Play; delivers a cleanly categorized index of public utilities, emergency units, healthcare centers, schools, businesses, and cafes with immediate direct calling.",
        stats: [
          { label: "Store", value: "Google Play Store" },
          { label: "Verified Downloads", value: "+1,000 Downloads", source: "Google Play Store", asOf: "2026-11" },
          { label: "User Rating", value: "5.0 ★ Top Rating", source: "Google Play Store", asOf: "2026-11" },
        ],
        metrics: [
          { label: "Total Downloads", value: "+1,000 Downloads", source: "Google Play Store", asOf: "2026-11" },
          { label: "Store Rating", value: "5.0 ★ out of 5", source: "Google Play Store", asOf: "2026-11" },
        ],
        technologies: ["Android Application", "Google Play Console", "City Directory Architecture", "Direct-Dial Integration", "Categorized Search"],
        challenges: [
          "Compiling and systematically organizing verified service points in a rapidly growing new city",
          "Creating an ergonomic directory structure enabling emergency contact retrieval in seconds",
          "Maintaining high speed and responsiveness as new commercial listings are continuously added",
        ],
        solutions: [
          "Logical domain categorization (Emergency, Medical, Education, Dining, Transport, Government)",
          "Direct device telephone intents enabling single-touch calls without leaving the app",
          "Streamlined caching architecture contributing to a verified 5.0★ rating across over 1,000 users",
        ],
        links: {
          googlePlay: "https://play.google.com/store/apps/details?id=com.helio.company&hl=en",
        },
        liveUrl: "https://play.google.com/store/apps/details?id=com.helio.company&hl=en",
        statusBadge: "Delivered & Live on Google Play",
        projectStatus: "completed",
        isUpcoming: false,
        verified: false,
        showOnSite: true,
        isNDA: false,
      },
      {
        id: "bokra-ai",
        slug: "bokra-hrms",
        type: "ai",
        status: "in_development",
        title: "Bokra HRMS - AI-Powered Human Resource Management System",
        client: "Bokra Tech (Bokra HRMS)",
        sector: "HRTech & Enterprise AI Automation",
        challengeNeed: "Architecting an enterprise cloud HRMS platform leveraging artificial intelligence for automated attendance, payroll execution, performance evaluation, and predictive talent analytics with active staging preview.",
        scopeOfWork: [
          "Centralized administrative console managing employee records, organizational hierarchies, and shifts",
          "Automated payroll calculation engine accounting for overtime, deductions, and statutory labor codes",
          "Multi-level approval workflows for leaves, expenses, and official requests with instant notifications",
          "Active staging environment on Vercel facilitating real-time module validation and model training",
        ],
        tag: "AI & Smart Automation",
        category: "software",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        highlight: "AI-powered enterprise HRMS: attendance automation, payroll processing, and predictive performance analytics.",
        summary: "Development of Bokra HRMS, delivering intelligent cloud human resource management and automated organizational workflows.",
        description: "Enterprise software solution designed to streamline workforce management and corporate internal processes; features attendance synchronization, automated payroll calculations, leave tracking, and AI-assisted employee performance insights deployed on Vercel staging.",
        stats: [
          { label: "Platform", value: "Intelligent Cloud HRMS" },
          { label: "AI Capabilities", value: "Payroll & Talent Analytics" },
          { label: "Environment", value: "Active Live Staging" },
        ],
        technologies: ["Artificial Intelligence (AI)", "Next.js & TypeScript", "Tailwind CSS", "Vercel Staging", "HR Analytics", "Payroll Automation"],
        challenges: [
          "Configuring multi-variable payroll rules accommodating diverse corporate compensation structures",
          "Designing versatile multi-tier approval chains adaptable to companies of varying operational sizes",
          "Delivering real-time graphical insight dashboards that empower leadership with immediate workforce data",
        ],
        solutions: [
          "Modular accounting rule engine customizable according to internal company bylaws",
          "Flexible workflow pipeline supporting dynamic approver assignment and automated escalation",
          "Interactive dashboard components displaying headcount metrics, attendance trends, and payroll forecasts",
        ],
        links: {
          staging: "https://bokra-ai.vercel.app/",
          live: "https://bokra-ai.vercel.app/",
        },
        liveUrl: "https://bokra-ai.vercel.app/",
        statusBadge: "Under Development - Staging Preview",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: false,
        showOnSite: true,
        isNDA: false,
      },
      {
        id: "raed-platform",
        slug: "raed",
        type: "web",
        status: "in_development",
        title: "Raed Platform – Integrated Training & Development for Children and Teens",
        client: "Raed",
        sector: "Education & life-skills development for children and teens",
        challengeNeed: "Build an authentic Arabic digital experience that blends warm human guidance with digital interaction, and personalise the development path for each child instead of one programme for all.",
        scopeOfWork: [
          "Design and develop the Arabic RTL website explaining the Raed methodology and its five pillars",
          "Prepare the initial assessment journey and an interactive illustrative simulator",
          "Prepare the daily in-platform challenge experience with points and badges",
          "Provide a sign-up page and contact channels for institutional partnerships (schools, learning centres, clubs)",
          "Deploy a live staging preview on Vercel for continuous review",
        ],
        tag: "Software & Digital Solutions",
        category: "software",
        icon: "Sparkles",
        // TEMP cover: replace with a real Raed screenshot uploaded from the admin portal (Media tab).
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        highlight: "A digital educational ecosystem built on five development pillars and an individual learning path for every child.",
        summary: "An Arabic platform for holistic training and development of children and teens, combining a weekly one-to-one coach session with interactive daily challenges inside the platform.",
        description: "An Arabic web platform delivering the \"Raed\" methodology for integrated development of children and teens across five pillars: psychological, social, values and faith, health, and personal. It uses a dual-interaction model: a weekly one-to-one session with a coach plus short daily challenges with points and badges. Each child gets a personalised path built from an initial assessment (an interactive test for the child, a parent questionnaire, and the coach's observation), with periodic reports for parents. The project is in development and a live staging preview is available.",
        stats: [
          { label: "Platform Type", value: "Web platform" },
          { label: "Project Status", value: "In development – live staging" },
        ],
        technologies: ["Arabic RTL web platform", "Vercel cloud staging"],
        challenges: [
          "Deliver Arabic content that fits the cultural identity and values of Arab families",
          "Balance digital engagement with healthy screen time",
          "Respect each child's privacy and online safety",
        ],
        solutions: [
          "A five-pillar methodology instead of a single uniform path",
          "Short, focused daily challenges that reinforce what the child practised in the session",
          "Transparent periodic reports and a partnership with the parent",
        ],
        features: [
          "Five development pillars",
          "Weekly one-to-one coach session",
          "Daily challenges with points and badges",
          "Three-source initial assessment",
          "Parent reports",
          "Institutional partnerships for schools, centres and clubs",
        ],
        links: {
          staging: "https://raed-sable.vercel.app/",
          live: "https://raed-sable.vercel.app/",
        },
        liveUrl: "https://raed-sable.vercel.app/",
        statusBadge: "Currently in development (live staging preview)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: false,
        showOnSite: true,
        isNDA: false,
      },
      {
        id: "logistics-cctv-access",
        slug: "logistics-cctv-access",
        type: "infrastructure",
        status: "delivered",
        title: "IP CCTV Surveillance & Access Control System Implementation",
        client: "Logistics Hub & Administrative Facility",
        sector: "Logistics & Distribution Facilities",
        challengeNeed: "Securing perimeter gates, storage bays, and shipping docks with 24/7 high-precision camera coverage and strict personnel access management in accordance with facility security codes.",
        scopeOfWork: [
          "Engineering and deployment of high-definition IP cameras covering outdoor perimeters and high-bay warehouses",
          "Installation of biometric and RFID access control at administrative offices and server rooms",
          "Centralized NVR storage integration and multi-screen security monitoring console fit-out",
          "Shielded network cabling runs backed by Uninterruptible Power Supply (UPS) units to ensure uninterrupted operation",
        ],
        tag: "Physical Security Systems",
        category: "security",
        icon: "ShieldAlert",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        highlight: "Securing access perimeters and warehouses via centralized IP surveillance and biometric credentials.",
        summary: "Supply, installation, and commissioning of enterprise IP cameras and access control for a logistics depot.",
        description: "Turnkey delivery of high-definition IP video surveillance covering perimeter, loading docks, and warehouse aisles, integrated with access control for administration and central NVR recording consoles.",
        stats: [
          { label: "Systems Deployed", value: "IP CCTV & Biometrics" },
          { label: "Coverage Scope", value: "Perimeter, Hub & Admin" },
          { label: "Project Status", value: "Delivered & Handed Over" },
        ],
        technologies: ["High-Definition IP Cameras", "Centralized NVR Recorders", "Biometric Access Controllers", "Certified Shielded Cabling", "UPS Power Backup"],
        challenges: [
          "Expansive open storage bays requiring broad-angle high-resolution optics",
          "Continuous 24/7 vehicle traffic and rapid shift changeovers",
          "Need for dependable low-light night vision in outdoor loading yards",
        ],
        solutions: [
          "Calculated optical field-of-view layout minimizing blind spots with low-light sensors",
          "Granular role-based access credentials restricting unauthorized zones",
          "Conditioned UPS backup ensuring continuous recording through power fluctuations",
        ],
        statusBadge: "Delivered & Handed Over (Portfolio)",
        projectStatus: "completed",
        isUpcoming: false,
        verified: false,
        showOnSite: true,
        isNDA: true,
      },
      {
        id: "retail-structured-cabling",
        slug: "retail-structured-cabling",
        type: "infrastructure",
        status: "delivered",
        title: "Network Infrastructure & Structured Cabling for a New Retail Branch",
        client: "Commercial & Administrative Retail Branch",
        sector: "Retail & Commercial Outlets",
        challengeNeed: "Establishing a resilient cabling foundation connecting POS terminals, office workstations, Wi-Fi access points, and surveillance in a space demanding clean engineering aesthetics and easy scaling.",
        scopeOfWork: [
          "Pulling and dressing structured network cabling according to approved engineering standards",
          "Server rack fit-out with organized patch panels and managed network switches",
          "VLAN configuration segmenting POS financial transactions from general staff and visitor Wi-Fi",
          "Drop termination, Fluke verification testing, and comprehensive As-Built port labeling",
        ],
        tag: "Networking & IT Infrastructure",
        category: "network",
        icon: "Network",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        highlight: "Integrated network cabling supporting POS registers, office staff, Wi-Fi, and CCTV.",
        summary: "Structured cabling, server rack termination, and network switch deployment for a modern retail branch.",
        description: "Complete deployment of structured copper cabling, wall-mounted rack fit-out, and active switch configuration connecting points of sale, enterprise access points, and surveillance cameras.",
        stats: [
          { label: "Cabling Standard", value: "Certified Cat6" },
          { label: "Connected Nodes", value: "POS, Wi-Fi, CCTV, Admin" },
          { label: "Project Status", value: "Successfully Completed" },
        ],
        technologies: ["Certified Cat6 Copper Cabling", "High-Density Patch Panels", "Wall-Mount Enclosure", "Managed Gigabit Switches", "Enterprise Wireless APs"],
        challenges: [
          "Coordinating conduit pathways with interior architectural finishes and ceiling drops",
          "Zero-tolerance mandate for POS downtime and transaction latency",
          "Precise port labeling required for non-technical retail manager troubleshooting",
        ],
        solutions: [
          "Fire-retardant conduits adhering strictly to commercial safety codes",
          "Dedicated isolated VLAN prioritizing encrypted payment transactions",
          "Clear sequential labeling and full As-Built schematics delivered at handover",
        ],
        statusBadge: "Successfully Completed & Handed Over (Portfolio)",
        projectStatus: "completed",
        isUpcoming: false,
        verified: false,
        showOnSite: true,
        isNDA: true,
      },
      {
        id: "industrial-fire-alarm",
        slug: "industrial-fire-alarm",
        type: "infrastructure",
        status: "delivered",
        title: "Turnkey Addressable Fire Alarm & Life Safety System for Industrial Facility",
        client: "Industrial Complex & Production Lines",
        sector: "Manufacturing & Industrial Sector",
        challengeNeed: "Protecting sensitive manufacturing lines with certified early detection, emergency evacuation, and smoke control integration.",
        scopeOfWork: [
          "Installation of intelligent multi-loop addressable fire alarm control panels",
          "Deployment of optical smoke and heat detectors calibrated for industrial environments",
          "Integration with emergency smoke damper exhaust and automatic exit releases",
          "Complete commissioning testing and handover of compliance certifications",
        ],
        tag: "ELV & Life Safety Systems",
        category: "elv",
        icon: "ShieldAlert",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        highlight: "Protecting production lines with intelligent addressable detection and automated evacuation integration.",
        summary: "Design and deployment of certified addressable fire detection system for an industrial plant.",
        description: "Full-scale implementation of addressable fire alarm infrastructure featuring multi-criteria sensors, audio-visual sirens, and automated mechanical interface controls.",
        stats: [
          { label: "Panel Architecture", value: "Addressable Intelligent" },
          { label: "Code Compliance", value: "Civil Defense Approved" },
          { label: "Project Status", value: "Commissioned & Certified" },
        ],
        technologies: ["Addressable Alarm Panels", "Optical & Thermal Detectors", "Fire-Rated Shielded Cable", "Emergency Strobe Sirens", "Damper Interface Modules"],
        challenges: [
          "Industrial dust and machinery vibrations requiring specialized sensor sensitivity",
          "Seamless interlock with emergency exits and mechanical ventilation",
        ],
        solutions: [
          "Industrial sealed detectors preventing false alarms",
          "Phased emergency evacuation sequences programmed into central controller",
        ],
        statusBadge: "Commissioned & Certified (Portfolio)",
        projectStatus: "completed",
        isUpcoming: false,
        verified: false,
        showOnSite: true,
        isNDA: true,
      },
    ],
  },
  process: {
    title: "Our Process",
    subtitle: "A clear methodology ensuring your project is executed efficiently and without surprises.",
    steps: [
      {
        number: "1",
        title: "Inspection & Planning",
        desc: "We study your facility and determine the exact technical needs to craft the optimal solution.",
        features: ["Facility requirements assessment", "Cabling pathway & electrical audit", "Optimal equipment and optics selection"],
      },
      {
        number: "2",
        title: "Engineering & Design",
        desc: "We draw an integrated engineering plan to ensure maximum efficiency with a clear BOQ.",
        features: ["Field-of-View layout blueprint", "Itemized hardware & cabling specs (BOQ)", "Budget-optimized phased tiers"],
      },
      {
        number: "3",
        title: "Implementation",
        desc: "Our technical team installs and tests the systems accurately to factory specifications.",
        features: ["100% genuine copper & fiber media", "Immaculate server rack cable dressing", "Fluke DSX channel certification testing"],
      },
      {
        number: "4",
        title: "Continuous Support",
        desc: "We provide periodic maintenance contracts and immediate tech support to safeguard uptime.",
        features: ["Hands-on admin & operator training", "Manufacturer warranty certificates", "Guaranteed 2-4 hour emergency response SLA"],
      },
    ],
  },
  partners: {
    title: "Hardware & Technology Deployed in Projects",
    subtitle: "We deploy industry-standard hardware and enterprise equipment across physical infrastructure and security projects.",
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Practical and direct answers regarding our services, contract models, and technical support for projects.",
    items: [
      {
        q: "What services and solutions does Tech Bokra provide?",
        a: "Tech Bokra provides integrated engineering and technology solutions for businesses and institutions, covering physical security systems (CCTV, access control, speed gates), structured cabling and network infrastructure, low current systems, as well as custom software development and system integration.",
      },
      {
        q: "Do you provide equipment supply only, or end-to-end supply, installation, and commissioning?",
        a: "We deliver turnkey project services starting from facility requirement analysis and engineering design, to supply of standard certified hardware, installation, configuration, testing, operational commissioning, and operator training.",
      },
      {
        q: "What is the first step to initiate a project with Tech Bokra?",
        a: "You can reach out through our project inquiry form or via phone/WhatsApp. Our engineering team reviews your requirements, coordinates a site survey or technical scoping session, and prepares a tailored proposal with a clear Bill of Quantities (BOQ).",
      },
      {
        q: "Do you offer preventative maintenance and technical support contracts after project handover?",
        a: "Yes. We offer comprehensive annual preventative maintenance contracts and SLA technical support for delivered facilities, including periodic inspections, priority fault response, and ongoing operational reliability.",
      },
      {
        q: "Do you work with small and medium businesses, or only large-scale enterprises?",
        a: "We engineer our solutions according to each client's operational scale and budget. We deliver projects ranging from new commercial branches and retail facilities to large-scale warehouses, headquarters, and industrial depots.",
      },
      {
        q: "Do your turnkey solutions integrate physical security and IT infrastructure together?",
        a: "Yes, this is one of our key strengths. We unite network cabling, IP surveillance, access control, and software integrations into a cohesive, dependable operating infrastructure without requiring multiple fragmented contractors.",
      },
    ],
  },
  contact: {
    title: "Contact Us to Discuss Your Project",
    subtitle: "Share your initial project requirements with us, and our engineering team will evaluate the scope and connect with you to define the next steps.",
    nameLabel: "Full Name",
    namePlaceholder: "Your full name",
    companyLabel: "Company / Organization Name",
    companyPlaceholder: "Your company name",
    emailLabel: "Work Email",
    emailPlaceholder: "name@company.com",
    phoneLabel: "Phone / WhatsApp Number",
    phonePlaceholder: "+20 101 234 5678",
    serviceLabel: "Required Solution or Service",
    governorateLabel: "Project Location / City",
    timelineLabel: "Expected Project Timeline",
    notesLabel: "Brief Project Description (or indicate available RFP / BOQ)",
    notesPlaceholder: "Describe your project scope, facility type, or indicate if you have technical specifications or a tender BOQ...",
    helperNote: "Information that helps us understand your inquiry: Full name, company name, work email, phone/WhatsApp, required solution, project location, brief scope, and expected timeline. We aim to thoroughly understand your needs before proposing an optimal solution.",
    disclaimer: "* Note: Submitting this inquiry is an initial discussion step and does not constitute a binding contract or a final commercial quotation prior to technical review and requirement confirmation.",
    btnSubmit: "Send Project Inquiry",
    btnWhatsapp: "Send via WhatsApp",
    btnEmail: "Send via Email",
    btnSubmitting: "Sending Project Inquiry...",
    successMessage: "Your inquiry has been received! Our engineering team will review your specifications and contact you to coordinate the next steps.",
    consultantPhone: "Or connect directly with our engineering team:",
    quickResponseBadge: "Direct Engineering Scoping & Project Review",
  },
  footer: {
    brandBio: "Integrated Technology Solutions. Engineered for Business. Delivering physical security systems, technology infrastructure, and software solutions with project execution and ongoing support.",
    servicesTitle: "Solutions",
    quickLinksTitle: "Quick Links",
    contactTitle: "Contact Us",
    rights: "© Tech Bokra. All Rights Reserved.",
    taxId: (siteConfig.taxId && siteConfig.commercialRegister) ? `CR: ${siteConfig.commercialRegister} • Tax ID: ${siteConfig.taxId}` : "",
    addressVal: "Nasr City, Cairo, Egypt",
  },
};
