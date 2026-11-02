import { DEFAULT_SERVICES_LIST_AR, DEFAULT_SERVICES_LIST_EN } from '@/lib/services';

export interface Project {
  id: string;
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
  stats: { label: string; value: string }[];
  technologies: string[];
  challenges: string[];
  solutions: string[];
  liveUrl?: string;
  statusBadge?: string;
  isUpcoming?: boolean;
  isDraft?: boolean;
  verified?: boolean;
  projectStatus?: 'completed' | 'ongoing'; // سابقة أعمال منفذة vs مشاريع جاري العمل عليها
  showOnSite?: boolean; // إمكانية الضبط للإظهار أو الإخفاء
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
        id: "alrehla-platform",
        title: "منصة الرحلة - المنظومة الرقمية للبرامج والمبادرات المجتمعية",
        client: "منظمة الرحلة (Alrehla)",
        sector: "التعليم وتنمية المهارات والمبادرات الرقمية",
        challengeNeed: "بناء منصة رقمية متطورة وسريعة تمكّن المستفيدين من التعرف على المبادرات والتسجيل التفاعلي في البرامج التدريبية والمجتمعية بأعلى كفاءة وسهولة.",
        scopeOfWork: [
          "تصميم واجهات المستخدم العصرية (UI/UX) المتوافقة مع مختلف الشاشات والهواتف الذكية",
          "تطوير منصة الويب التفاعلية بتقنيات سريعة ومعمارية سحابية متقدمة",
          "تهيئة تحسين محركات البحث (SEO) والمشاركة الاجتماعية (OpenGraph) لضمان انتشار المبادرات",
          "إعداد البنية التحتية السحابية الموزعة لتحقيق أعلى سرعة تصفح وأمان للبيانات",
        ],
        tag: "البرمجيات والحلول الرقمية",
        category: "software",
        icon: "Globe",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        highlight: "منصة رقمية تفاعلية تقدم تجربة مستخدم سلسة واستجابة فورية لكافة المبادرات والبرامج.",
        summary: "تصميم وتطوير المنصة الرقمية الرسمية لمؤسسة الرحلة لدعم وتوثيق البرامج والمبادرات المجتمعية.",
        description: "منصة ويب متكاملة مبنية بأحدث معايير الويب السريعة والمتجاوبة، تتيح للزوار والمستفيدين استعراض المبادرات، والتسجيل في البرامج، ومتابعة الفعاليات مع بنية تحتية سحابية تضمن الأمان وسرعة التحميل.",
        stats: [
          { label: "نوع المنصة", value: "Web Platform سحابية" },
          { label: "الأداء وسرعة التحميل", value: "فائقة (+95 PageSpeed)" },
          { label: "حالة الإطلاق", value: "منجز ومطلق رسمياً" },
        ],
        technologies: ["Next.js", "React & TypeScript", "Tailwind CSS", "Cloud Hosting", "RESTful APIs", "SEO Optimization"],
        challenges: [
          "توفير تجربة استخدام سريعة ومريحة لجميع الفئات على مختلف الهواتف والشاشات",
          "عرض تفاصيل المبادرات والبرامج بهيكلية منظمة ومباشرة للزائر",
          "ضمان استقرار وسرعة المنصة تحت أعداد الزيارات المتزايدة",
        ],
        solutions: [
          "بناء واجهات مستخدم مخصصة تعتمد على العرض السريع وتقليل زمن الاستجابة",
          "تصميم تجربة تصفح هرمية واضحة تسهل الوصول للفعاليات والمبادرات",
          "استضافة سحابية موزعة جغرافياً مع تحسين الصور والمحتوى تلقائياً",
        ],
        liveUrl: "https://www.alrehla.org/",
        statusBadge: "منجز ومطلق رسمياً (Live)",
        projectStatus: "completed",
        isUpcoming: false,
        verified: true,
        showOnSite: true,
      },
      {
        id: "mahyay-app",
        title: "تطبيق محياي للهواتف الذكية - متجر Google Play",
        client: "محياي (Mahyay)",
        sector: "تطبيقات الهواتف الذكية ونمط الحياة المجتمعي",
        challengeNeed: "تطوير تطبيق هاتف ذكي رسمي ونشره على متجر Google Play يقدم للمستخدمين تجربة تفاعلية سريعة ومستقرة مع إشعارات لحظية.",
        scopeOfWork: [
          "تطوير وبرمجة تطبيق الهاتف المحمول لأجهزة أندرويد بأعلى معايير الأداء",
          "تجهيز متطلبات النشر والامتثال لسياسات متجر Google Play الرسمية",
          "تكامل نظام الإشعارات الفورية (Push Notifications) والتسجيل الآمن",
          "اختبار كفاءة التشغيل، استهلاك البطارية، والاتصال في ظروف الشبكة المتفاوتة",
        ],
        tag: "تطبيقات الهواتف الذكية",
        category: "software",
        icon: "Smartphone",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
        highlight: "تطبيق هاتف رسمي منشور على متجر Google Play يتميز بأداء سلس وتجربة استخدام عصرية وإشعارات لحظية.",
        summary: "تطوير وإطلاق تطبيق الهاتف الذكي 'محياي' على متجر Google Play لتقديم تجربة رقمية سهلة ومباشرة.",
        description: "تطبيق جوال متطور تم بناؤه وبرمجته ليعمل بكفاءة عالية على أجهزة أندرويد، يتضمن تسجيل الدخول الآمن، استقبال الإشعارات اللحظية، وتصفح الخدمات التفاعلية مع دعم كامل للغة العربية وتجربة استخدام خفيفة وسريعة.",
        stats: [
          { label: "المتجر الرسمي", value: "Google Play Store" },
          { label: "منصة التشغيل", value: "Android Mobile" },
          { label: "حالة التطبيق", value: "منجز ومتاح للتحميل" },
        ],
        technologies: ["Android Application", "Google Play Console", "Push Notifications (FCM)", "REST APIs", "Modern Mobile UI/UX"],
        challenges: [
          "الامتثال الكامل لمتطلبات وسياسات متجر Google Play الأمنية والتقنية",
          "ضمان سرعة الاستجابة وكفاءة استهلاك البطارية والبيانات",
          "تقديم واجهة استخدام عربية مريحة وتفاعلية لكافة أحجام الهواتف",
        ],
        solutions: [
          "برمجة معمارية نظيفة تلتزم بأعلى معايير الأمان والفحص المعتمد من Google",
          "تطبيق نظام التخزين المؤقت الذكي والتعامل الخفيف مع البيانات والشبكة",
          "تصميم واجهات حديثة تعتمد على عناصر تفاعلية مريحة وسهلة الوصول",
        ],
        liveUrl: "https://play.google.com/store/apps/details?id=com.mahyay.app",
        statusBadge: "منجز ومتاح على Google Play",
        projectStatus: "completed",
        isUpcoming: false,
        verified: true,
        showOnSite: true,
      },
      {
        id: "helio-company-app",
        title: "تطبيق شركة هيليو الرسمي - متجر Google Play",
        client: "شركة هيليو (Helio Company)",
        sector: "حلول الشركات والمؤسسات الاستثمارية",
        challengeNeed: "توفير قناة تواصل مؤسسية معتمدة ورسمية لشركة هيليو عبر تطبيق محمول منشور على متجر Google Play يخدم عملاء الشركة وشركائها.",
        scopeOfWork: [
          "تطوير التطبيق المحمول لخدمات وأعمال شركة هيليو",
          "إعداد واعتماد الحساب الرسمي ونشر التطبيق على Google Play Store",
          "بناء قنوات الاستفسار والتواصل المباشر مع فرق خدمة العملاء",
          "ربط التطبيق بقواعد بيانات سحابية وتأمين نقل البيانات بتشفير متقدم",
        ],
        tag: "تطبيقات الهواتف الذكية",
        category: "software",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        highlight: "تطبيق أعمال مؤسسي رسمي لشركة هيليو يتيح التواصل المؤسسي وإدارة الخدمات عبر متجر Google Play.",
        summary: "بناء وإطلاق تطبيق الهاتف الرسمي لشركة هيليو على Google Play لتعزيز التواصل المؤسسي وعرض خدمات الشركة.",
        description: "تطبيق موبايل مؤسسي مخصص لشركة هيليو، يتيح لعملاء الشركة وشركائها متابعة الخدمات والأنشطة والتواصل المباشر مع فرق العمل عبر منصة موثوقة ومحمية منشورة رسمياً على Google Play.",
        stats: [
          { label: "المتجر الرسمي", value: "Google Play Store" },
          { label: "الجهة المستفيدة", value: "شركة هيليو" },
          { label: "حالة التطبيق", value: "منجز ومتاح رسمياً" },
        ],
        technologies: ["Android Enterprise App", "Google Play Console", "Corporate Services Integration", "Secure Data Transfer", "Multi-Language UI"],
        challenges: [
          "عكس الهوية المؤسسية الراقية لشركة هيليو في تطبيق محمول عالي الاعتمادية",
          "تأمين سرية البيانات وسلاسة التواصل المباشر مع العملاء والشركاء",
          "النشر والاعتماد الرسمي وفق متطلبات متجر Google Play المحدثة",
        ],
        solutions: [
          "تصميم واجهات برمجية نظيفة ترتكز على هوية الشركة ومعايير التصميم الاحترافية",
          "بناء قنوات اتصال مشفرة وإشعارات موجهة للعملاء والشركاء",
          "اجتياز كافة اختبارات الجودة والأمان الخاصة بسياسات Google Play بنجاح",
        ],
        liveUrl: "https://play.google.com/store/apps/details?id=com.helio.company&hl=en",
        statusBadge: "منجز ومتاح على Google Play",
        projectStatus: "completed",
        isUpcoming: false,
        verified: true,
        showOnSite: true,
      },
      {
        id: "helio-property",
        title: "منصة هيليو لإدارة العقارات والأملاك (Helio Property)",
        client: "هيليو العقارية (Helio Property Management)",
        sector: "القطاع العقاري وإدارة المشروعات والممتلكات (PropTech)",
        challengeNeed: "تأسيس منصة سحابية عصرية لإدارة وتصفح المشروعات والوحدات العقارية، مع إتاحة فلاتر بحث ذكية ونظام حجز واستفسارات للمشترين.",
        scopeOfWork: [
          "هندسة وتطوير واجهات المنصة العقارية باستخدام Next.js وTailwind CSS",
          "بناء نظام تصفية وبحث متقدم للوحدات حسب المساحة، السعر، والنوع",
          "توفير بيئة معاينة واختبار حية ومباشرة (Live Staging) على Vercel",
          "تجهيز نماذج استقطاب العملاء المهتمين وتوجيه الطلبات لفرق المبيعات",
        ],
        tag: "البرمجيات والحلول الرقمية",
        category: "software",
        icon: "Home",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
        highlight: "منصة سحابية متطورة لإدارة وعرض الوحدات العقارية، ومتابعة الحجوزات والمبيعات مع بيئة تشغيل تجريبية حية.",
        summary: "تطوير منصة ويب عقارية متقدمة لهيليو تتيح استعراض الوحدات العقارية وإدارة بيانات المشروعات بكفاءة.",
        description: "مشروع تطوير منصة رقمية سحابية لإدارة المحافظ والوحدات العقارية لشركة هيليو؛ تشمل تصفح المشاريع والوحدات، فلاتر البحث المتقدمة، ونظام إدارة الحجوزات واستفسارات المشترين، مع واجهات ويب تفاعلية سريعة.",
        stats: [
          { label: "المعمارية", value: "Next.js سحابي" },
          { label: "بيئة العمل", value: "Staging Live نشطة" },
          { label: "حالة المشروع", value: "قيد التطوير والتحسين" },
        ],
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel Cloud Staging", "Interactive Property Catalogs", "Lead CRM Integration"],
        challenges: [
          "عرض تفاصيل المشروعات والوحدات العقارية بتنظيم بصري مريح وسريع التحميل",
          "توفير تجربة استعراض للمستخدمين مع ربط فوري لنماذج الاهتمام والاستفسار",
          "الحفاظ على سرعة فائقة مع الصور عالية الدقة للمشاريع والوحدات",
        ],
        solutions: [
          "تحسين وتوزيع الصور عبر شبكات CDN مع تقنيات الضغط الحديثة",
          "تصميم بطاقات وفلاتر تصفية ذكية للمساحات والأسعار والمدن",
          "نشر بيئة Staging حية تتيح للفريق والعميل مراجعة الإنجاز لحظة بلحظة",
        ],
        liveUrl: "https://helio-property.vercel.app/",
        statusBadge: "مشروع نعمل عليه حالياً (قيد التطوير - معاينة حية)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: true,
        showOnSite: true,
      },
      {
        id: "widad-tech",
        title: "منصة وداد تك للحلول التقنية (Widad Tech Platform)",
        client: "وداد تك (Widad Tech Solutions)",
        sector: "قطاع تكنولوجيا المعلومات والحلول الرقمية المؤسسية",
        challengeNeed: "بناء منصة تقنية تفاعلية تعكس قوة وتنوع الخدمات البرمجية والحلول السحابية لشركة وداد تك مع تجربة تصفح فائقة السرعة.",
        scopeOfWork: [
          "تطوير منصة رقمية متجاوبة تقدم حلول وخدمات الشركة المؤسسية",
          "نشر المنصة عبر بيئة سحابية تفاعلية مباشرة على Vercel للاختبار والتطوير",
          "بناء مكونات تفاعلية لشرح مسارات التحول الرقمي وخدمات الدعم",
          "تحسين محركات البحث وسرعة استجابة الصفحات للمستخدمين",
        ],
        tag: "البرمجيات والحلول الرقمية",
        category: "software",
        icon: "Layers",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        highlight: "بوابة رقمية تفاعلية تعرض الخدمات التقنية والحلول السحابية المؤسسية بمعمارية فائقة السرعة.",
        summary: "تطوير المنصة الرقمية لشركة وداد تك لتقديم واستعراض خدمات تكنولوجيا المعلومات والحلول البرمجية.",
        description: "بناء منصة رقمية متقدمة لشركة وداد تك، تعتمد على معمارية برمجية حديثة لعرض مجالات التحول الرقمي والخدمات التقنية المتخصصة، مع بيئة اختبار سحابية تتيح متابعة سير التطوير والإضافات المستمرة.",
        stats: [
          { label: "المعمارية", value: "Next.js & Vercel" },
          { label: "بيئة العرض", value: "Staging Live تفاعلية" },
          { label: "حالة المشروع", value: "قيد التطوير المستمر" },
        ],
        technologies: ["Next.js", "React & TypeScript", "Tailwind CSS", "Vercel Platform", "Modular Component Design", "Enterprise Forms"],
        challenges: [
          "صياغة هوية بصرية تقنية واضحة ومميزة تعبر عن تنوع الخدمات",
          "ضمان أعلى معايير سهولة الاستخدام وتجاوب كافة المكونات في مختلف الأجهزة",
          "ربط استفسارات العملاء بنظام تتبع مباشر للمتطلبات",
        ],
        solutions: [
          "تطبيق تصميم عصري يرتكز على تدرجات لونية هادئة وتنظيم دقيق للمعلومات",
          "استخدام مكونات برمجية قابلة لإعادة الاستخدام مع كفاءة تحميل عالية",
          "نشر المنصة عبر بيئة سحابية حية للمراجعة والتدقيق المستمر",
        ],
        liveUrl: "https://widad-tech.vercel.app/",
        statusBadge: "مشروع نعمل عليه حالياً (قيد التطوير - معاينة حية)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: true,
        showOnSite: true,
      },
      {
        id: "bokra-ai",
        title: "منصة بكرة للذكاء الاصطناعي (Bokra AI Platform)",
        client: "بكرة تك للذكاء الاصطناعي (Bokra AI Solutions)",
        sector: "حلول الذكاء الاصطناعي وأتمتة الأعمال الذكية",
        challengeNeed: "تطوير بوابة تقنية متقدمة تستعرض حلول الذكاء الاصطناعي التوليدي، أتمتة العمليات، والنماذج الذكية الموجهة للشركات والمؤسسات.",
        scopeOfWork: [
          "تصميم وبناء المنصة الرقمية لحلول الذكاء الاصطناعي التوليدي",
          "دمج نماذج العرض التوضيحي للأتمتة الذكية والتعامل مع النماذج اللغوية (LLMs)",
          "نشر المنصة عبر بيئة سحابية حية (Live Staging) للاختبار والتطوير المستمر",
          "تجهيز واجهات تفاعلية مريحة للعين تدعم النمط الداكن والفاتح",
        ],
        tag: "الذكاء الاصطناعي والبرمجيات",
        category: "software",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        highlight: "منصة رائدة لحلول وتطبيقات الذكاء الاصطناعي الموجهة لرفع الكفاءة التشغيلية وأتمتة مهام الأعمال.",
        summary: "تطوير منصة بكرة للذكاء الاصطناعي لتقديم حلول النماذج الذكية والأتمتة المتطورة للمؤسسات والشركات.",
        description: "منصة رقمية مستقبلية متخصصة في توفير حلول الذكاء الاصطناعي، أتمتة العمليات، والتكامل مع النماذج اللغوية الكبيرة (LLMs) لتمكين المؤسسات من تسريع قراراتها ورفع جودة الإنتاجية، مع بيئة معاينة مباشرة على Vercel.",
        stats: [
          { label: "مجال المنصة", value: "الذكاء الاصطناعي (AI)" },
          { label: "البيئة التشغيلية", value: "Vercel Staging Live" },
          { label: "حالة المشروع", value: "قيد التطوير والتدريب" },
        ],
        technologies: ["Artificial Intelligence (AI)", "Next.js & TypeScript", "LLM APIs Integration", "Tailwind CSS", "Vercel Staging", "Interactive AI Demos"],
        challenges: [
          "تبسيط مفاهيم الذكاء الاصطناعي المتقدمة في واجهة تفاعلية سهلة الفهم للشركات",
          "توفير بيئة تجريبية مستقرة وسريعة لاختبار النماذج والحلول",
          "دمج معايير الأمان والخصوصية في التعامل مع بيانات المؤسسات",
        ],
        solutions: [
          "تصميم واجهات عرض مستقبلية وجذابة تشرح تطبيقات الذكاء الاصطناعي بأسلوب عملي",
          "معمارية برمجية سحابية مرنة تدعم التوسع والربط مع أحدث محركات الذكاء الاصطناعي",
          "استضافة تجريبية حية تتيح تجربة واختبار الميزات مباشرة",
        ],
        liveUrl: "https://bokra-ai.vercel.app/",
        statusBadge: "مشروع نعمل عليه حالياً (قيد التطوير - معاينة حية)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: true,
        showOnSite: true,
      },
      {
        id: "logistics-cctv-access",
        title: "توريد وتركيب نظام المراقبة التلفزيونية والتحكم في الدخول",
        client: "مستودع لوجستي ومقر إداري",
        sector: "قطاع الخدمات اللوجستية والتوزيع",
        challengeNeed: "تأمين بوابات الدخول ومناطق الشحن والتفريغ، ومراقبة حركة الأفراد والمركبات بدقة على مدار الساعة.",
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
        verified: true,
        showOnSite: true,
      },
      {
        id: "retail-structured-cabling",
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
        verified: true,
        showOnSite: true,
      },
      {
        id: "industrial-fire-alarm",
        title: "توريد وتركيب نظام الإنذار المبكر ومكافحة الحريق لمجمع صناعي",
        client: "مجمع صناعي وخطوط إنتاج",
        sector: "القطاع الصناعي والتصنيع",
        challengeNeed: "تأمين بيئة إنتاجية صناعية حساسة ضد مخاطر الحريق، والربط المباشر مع لوحات التحكم وأنظمة الإخلاء الآلي.",
        scopeOfWork: [
          "تركيب لوحة إنذار حريق عنونة ذكية (Addressable Fire Alarm Panel)",
          "توزيع كواشف الدخان والحرارة المقاومة للأتربة والظروف الصناعية",
          "ربط نظام سحب الدخان وفتح بوابات الطوارئ أوتوماتيكياً",
          "اختبار التكامل الشامل وتسليم شهادات الفحص الهندسي والاعتماد",
        ],
        tag: "أنظمة التيار الخفيف ELV",
        category: "elv",
        icon: "ShieldAlert",
        image: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80",
        highlight: "حماية خطوط الإنتاج والمستودعات بنظام إنذار حريق معنون مع إخلاء آلي.",
        summary: "تنفيذ شبكة إنذار حريق معنونة ذكية وربطها بأنظمة الإخلاء لمجمع صناعي.",
        description: "مشروع توريد وتركيب شبكة إنذار حريق متكاملة تشمل اللوحات المعنونة، الكواشف الحرارية، السراين الصوتية، ووحدات التحكم في بوابات الطوارئ ونظم التهوية الميكانيكية.",
        stats: [
          { label: "نوع اللوحة", value: "Addressable ذكية" },
          { label: "نقاط الكشف", value: "أكثر من 150 كاشف" },
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
        verified: true,
        showOnSite: true,
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
        id: "alrehla-platform",
        title: "Alrehla Platform - Digital Ecosystem for Community & Educational Initiatives",
        client: "Alrehla Organization",
        sector: "Education, EdTech & Community Initiatives",
        challengeNeed: "Building a modern, scalable web platform enabling participants to seamlessly discover programs, register interactively, and access community training with maximum speed and reliability.",
        scopeOfWork: [
          "Responsive, mobile-first UI/UX engineering optimized across smartphones, tablets, and desktops",
          "Interactive full-stack web application built on high-performance cloud architecture",
          "Advanced SEO and OpenGraph optimization to maximize public reach and social sharing",
          "Distributed cloud hosting infrastructure delivering high uptime and enterprise data protection",
        ],
        tag: "Software & Digital Platforms",
        category: "software",
        icon: "Globe",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        highlight: "Interactive community and educational platform delivering intuitive user experiences and real-time program tracking.",
        summary: "Design and deployment of the official Alrehla digital platform supporting community initiatives and programs.",
        description: "Full-stack web platform built with modern responsive architecture, enabling seamless program registration, event tracking, and high-performance community interaction with cloud-backed reliability.",
        stats: [
          { label: "Platform Type", value: "Cloud Web App" },
          { label: "Performance", value: "95+ PageSpeed" },
          { label: "Project Status", value: "Launched & Live" },
        ],
        technologies: ["Next.js", "React & TypeScript", "Tailwind CSS", "Cloud Hosting", "RESTful APIs", "SEO & OpenGraph"],
        challenges: [
          "Ensuring ultra-fast responsiveness across mobile devices and diverse screen sizes",
          "Structuring complex community program directories into an intuitive, accessible UI",
          "Maintaining high uptime and quick asset delivery during peak traffic surges",
        ],
        solutions: [
          "Engineered optimized frontend bundles minimizing initial render times and latency",
          "Designed clear hierarchical navigation for seamless program access and registrations",
          "Distributed cloud hosting with automated asset optimization and caching",
        ],
        liveUrl: "https://www.alrehla.org/",
        statusBadge: "Delivered & Live",
        projectStatus: "completed",
        isUpcoming: false,
        verified: true,
        showOnSite: true,
      },
      {
        id: "mahyay-app",
        title: "Mahyay Mobile App - Official Google Play Release",
        client: "Mahyay",
        sector: "Mobile Apps & Lifestyle Services",
        challengeNeed: "Engineering and publishing a verified native Android mobile application on Google Play Store with real-time push notifications, smooth gestures, and responsive bilingual UX.",
        scopeOfWork: [
          "Mobile application engineering for Android devices adhering to modern mobile UI standards",
          "Full compliance validation and publishing release on Google Play Console",
          "Firebase Cloud Messaging (FCM) integration for instant alerts and secure session authentication",
          "Performance profiling, battery optimization, and resilient offline-friendly connectivity handling",
        ],
        tag: "Mobile Applications",
        category: "software",
        icon: "Smartphone",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
        highlight: "Native mobile experience published on Google Play featuring fluid UI, push notifications, and verified reliability.",
        summary: "Development and official Google Play release of the Mahyay mobile application for modern user engagement.",
        description: "Enterprise-grade mobile application deployed to Google Play, featuring secure user authentication, instant push notification architecture, offline caching, and Arabic-first localized ergonomics.",
        stats: [
          { label: "Store", value: "Google Play Store" },
          { label: "Platform", value: "Android App" },
          { label: "Status", value: "Live & Available" },
        ],
        technologies: ["Android Application", "Google Play Console", "Push Notifications (FCM)", "REST APIs", "Modern Mobile UI/UX"],
        challenges: [
          "Strict compliance with Google Play Store developer guidelines and privacy policies",
          "Optimizing memory consumption and battery efficiency across varied Android devices",
          "Polished localized interface with instant gesture response and smooth scrolling",
        ],
        solutions: [
          "Clean mobile architecture meeting Google Play security and runtime criteria",
          "Smart data caching reducing network overhead on mobile data connections",
          "Streamlined ergonomic touch UI with intuitive user journeys and quick access flows",
        ],
        liveUrl: "https://play.google.com/store/apps/details?id=com.mahyay.app",
        statusBadge: "Delivered & Live on Google Play",
        projectStatus: "completed",
        isUpcoming: false,
        verified: true,
        showOnSite: true,
      },
      {
        id: "helio-company-app",
        title: "Helio Company Corporate App - Official Google Play Release",
        client: "Helio Company",
        sector: "Enterprise & Corporate Applications",
        challengeNeed: "Delivering an official, verified corporate mobile channel on Google Play Store enabling enterprise clients and stakeholders to interact with corporate services seamlessly.",
        scopeOfWork: [
          "Turnkey mobile development tailored to Helio Company's corporate operational requirements",
          "Verification, security audits, and store publishing pipeline on Google Play Console",
          "Direct corporate inquiry workflows and customer relationship touchpoints",
          "Encrypted cloud API integration safeguarding enterprise communication and user profiles",
        ],
        tag: "Mobile Applications",
        category: "software",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        highlight: "Official corporate mobile solution for Helio Company published on Google Play for enterprise service management.",
        summary: "Turnkey development and store publishing of Helio Company's mobile application on Google Play.",
        description: "Dedicated corporate mobile application connecting Helio Company's clients and stakeholders with enterprise services, real-time updates, and direct service inquiry channels.",
        stats: [
          { label: "Store", value: "Google Play Store" },
          { label: "Enterprise Client", value: "Helio Company" },
          { label: "Status", value: "Live & Available" },
        ],
        technologies: ["Android Enterprise App", "Google Play Console", "Corporate Services Integration", "Secure Data Transfer", "Multi-Language UI"],
        challenges: [
          "Reflecting corporate prestige and brand identity in a polished mobile client",
          "Securing encrypted communication channels for enterprise client requests",
          "Smooth store review, compliance validation, and official publishing on Google Play",
        ],
        solutions: [
          "Custom corporate UI adhering strictly to brand design systems and high-density typography",
          "Encrypted endpoint integration for corporate communication and inquiries",
          "Complete quality assurance certification and store approval",
        ],
        liveUrl: "https://play.google.com/store/apps/details?id=com.helio.company&hl=en",
        statusBadge: "Delivered & Live on Google Play",
        projectStatus: "completed",
        isUpcoming: false,
        verified: true,
        showOnSite: true,
      },
      {
        id: "helio-property",
        title: "Helio Property - PropTech & Real Estate Asset Management Platform",
        client: "Helio Property Management",
        sector: "PropTech & Real Estate Asset Management",
        challengeNeed: "Developing an advanced PropTech cloud platform for real estate portfolio visualization, unit filtering, booking requests, and client inquiry tracking with active live staging.",
        scopeOfWork: [
          "Engineering high-speed responsive web interfaces using Next.js and Tailwind CSS",
          "Multi-parameter search and filtration engine for property spaces, pricing, and types",
          "Active continuous staging deployment on Vercel for live collaborative review",
          "Buyer inquiry routing and integration with property sales pipelines",
        ],
        tag: "Software & PropTech",
        category: "software",
        icon: "Home",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
        highlight: "Advanced PropTech web platform for property listings, lease management, and buyer booking workflows.",
        summary: "Development of modern PropTech web solution for real estate asset visualization, lead acquisition, and unit management.",
        description: "Comprehensive cloud platform tailored for real estate portfolios, featuring advanced property search filters, interactive unit catalogs, inquiry lead routing, and dynamic staging deployment.",
        stats: [
          { label: "Architecture", value: "Next.js Cloud App" },
          { label: "Environment", value: "Staging Live Active" },
          { label: "Project Status", value: "Under Development" },
        ],
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel Cloud Staging", "Interactive Property Catalogs", "Lead CRM Integration"],
        challenges: [
          "Rendering high-resolution property photography without compromising page velocity",
          "Providing seamless filtering across unit types, spaces, and availability",
          "Continuous staging integration with instant client feedback cycles",
        ],
        solutions: [
          "CDN-powered asset streaming with automated next-gen image compression",
          "Dynamic multi-criteria search filters for locations, pricing, and unit tiers",
          "Continuous deployment workflow on Vercel ensuring immediate milestone reviews",
        ],
        liveUrl: "https://helio-property.vercel.app/",
        statusBadge: "Active Project in Progress (Under Development - Staging Live)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: true,
        showOnSite: true,
      },
      {
        id: "widad-tech",
        title: "Widad Tech - Technology Solutions & Enterprise Digital Services",
        client: "Widad Tech Solutions",
        sector: "IT & Digital Enterprise Services",
        challengeNeed: "Building a high-impact corporate web portal showcasing Widad Tech's specialized cloud engineering, software solutions, and digital transformation consulting with live staging preview.",
        scopeOfWork: [
          "Developing an ultra-fast, modern responsive corporate web presence",
          "Continuous deployment and testing on Vercel cloud staging for stakeholder verification",
          "Interactive service showcases illustrating digital transformation and support architectures",
          "Search engine optimization and structured content delivery for B2B procurement",
        ],
        tag: "Software & Digital Solutions",
        category: "software",
        icon: "Layers",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        highlight: "Modern interactive corporate platform showcasing enterprise cloud, software, and technology consulting services.",
        summary: "Development and staging deployment of Widad Tech's web platform showcasing corporate digital transformation services.",
        description: "Enterprise web presence engineered for Widad Tech, presenting comprehensive digital solutions, IT services, and technical consulting with clean typography and high-speed cloud infrastructure.",
        stats: [
          { label: "Stack", value: "Next.js & Vercel Cloud" },
          { label: "Preview", value: "Interactive Live Staging" },
          { label: "Project Status", value: "Active Development" },
        ],
        technologies: ["Next.js", "React & TypeScript", "Tailwind CSS", "Vercel Platform", "Modular Component Design", "Enterprise Forms"],
        challenges: [
          "Creating a distinctive, professional digital persona for diverse IT capabilities",
          "Delivering fluid micro-interactions while preserving zero-lag performance",
          "Facilitating clear structured service request funnels for corporate buyers",
        ],
        solutions: [
          "Engineered modular design system with enterprise typography hierarchy",
          "Optimized lightweight component tree ensuring instant page loads",
          "Active staging on Vercel facilitating seamless collaborative iterations",
        ],
        liveUrl: "https://widad-tech.vercel.app/",
        statusBadge: "Active Project in Progress (Under Development - Staging Live)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: true,
        showOnSite: true,
      },
      {
        id: "bokra-ai",
        title: "Bokra AI - Enterprise Artificial Intelligence & Automation Platform",
        client: "Bokra AI Solutions",
        sector: "Artificial Intelligence & Enterprise Automation",
        challengeNeed: "Creating an advanced, futuristic web platform introducing generative AI solutions, workflow automation engines, and enterprise LLM integrations with an active staging environment.",
        scopeOfWork: [
          "Architecting the digital platform for enterprise AI and intelligent automation solutions",
          "Integrating interactive demonstration modules for smart agents and language models",
          "Live staging deployment on Vercel enabling real-time experimentation and client reviews",
          "Engineered dark and light mode aesthetics tailored for deep-tech innovation presentation",
        ],
        tag: "AI & Smart Automation",
        category: "software",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        highlight: "Innovative enterprise AI platform providing intelligent workflows, automation models, and conversational tech.",
        summary: "Development and active staging of Bokra AI, delivering enterprise artificial intelligence and automated workflows.",
        description: "Cutting-edge AI platform engineered to deliver automated workflows, LLM integrations, and intelligent business assistant architectures, deployed on an active live preview environment.",
        stats: [
          { label: "Domain", value: "Enterprise AI & LLMs" },
          { label: "Environment", value: "Vercel Staging Live" },
          { label: "Project Status", value: "Active Development" },
        ],
        technologies: ["Artificial Intelligence (AI)", "Next.js & TypeScript", "LLM APIs Integration", "Tailwind CSS", "Vercel Staging", "Interactive AI Demos"],
        challenges: [
          "Demystifying complex generative AI capabilities into clear business value propositions",
          "Creating responsive, low-latency interfaces for conversational and automated demos",
          "Implementing rigorous enterprise data privacy and security standards",
        ],
        solutions: [
          "Modern futuristic visual styling emphasizing clarity and practical use cases",
          "Resilient cloud API integration supporting advanced inference and model pipelines",
          "Active staging release enabling rapid client evaluation and feature tuning",
        ],
        liveUrl: "https://bokra-ai.vercel.app/",
        statusBadge: "Active Project in Progress (Under Development - Staging Live)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: true,
        showOnSite: true,
      },
      {
        id: "logistics-cctv-access",
        title: "Supply & Installation of IP CCTV & Access Control Systems",
        client: "Logistics Hub & Administrative Facility",
        sector: "Logistics & Distribution Sector",
        challengeNeed: "Securing access gates, loading bays, and warehouses with 24/7 high-precision monitoring of personnel and vehicles without disrupting round-the-clock logistics flow.",
        scopeOfWork: [
          "Deployment of high-definition IP surveillance cameras covering facility perimeter, high-bay storage, and loading bays",
          "Biometric and RFID access control implementation for administrative offices and central command rooms",
          "Centralized NVR storage integration and multi-screen security command console setup",
          "Shielded cabling deployment backed by Uninterruptible Power Supply (UPS) units to ensure zero downtime",
        ],
        tag: "Physical Security",
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
        verified: true,
        showOnSite: true,
      },
      {
        id: "retail-structured-cabling",
        title: "Network Infrastructure & Structured Cabling for a New Retail Branch",
        client: "Commercial & Administrative Retail Branch",
        sector: "Retail & Corporate Offices",
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
        verified: true,
        showOnSite: true,
      },
      {
        id: "industrial-fire-alarm",
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
        image: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80",
        highlight: "Protecting production lines with intelligent addressable detection and automated evacuation integration.",
        summary: "Design and deployment of certified addressable fire detection system for an industrial plant.",
        description: "Full-scale implementation of addressable fire alarm infrastructure featuring multi-criteria sensors, audio-visual sirens, and automated mechanical interface controls.",
        stats: [
          { label: "Panel Architecture", value: "Addressable Intelligent" },
          { label: "Detector Points", value: "150+ Field Sensors" },
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
        verified: true,
        showOnSite: true,
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
