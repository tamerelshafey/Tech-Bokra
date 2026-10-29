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
    services: "حلولنا الهندسية",
    projects: "مشاريعنا وقصص النجاح",
    architecture: "أدوات ومرصد المهندسين",
    estimator: "حاسبة التكلفة",
    process: "آلية العمل",
    faq: "الأسئلة الشائعة",
    contact: "طلب أو استفسار",
    surveyCta: "طلب أو استفسار",
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
    title: "الحلول والخدمات الهندسية والتقنية",
    subtitle: "حلول تقنية متكاملة، مصممة وفق احتياجات أعمالك، تشمل أنظمة الأمن المادي والبنية التحتية إلى جانب البرمجيات والحلول الرقمية مع تنفيذ المشروعات والدعم المستمر.",
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
      {
        id: "smart-bms-hvac",
        title: "توريد وبرمجة نظام التحكم الذكي بالمباني وإدارة استهلاك الطاقة (BMS)",
        client: "مقر إداري وتجاري متعدد الطوابق",
        sector: "المباني الإدارية والذكية",
        challengeNeed: "تحقيق كفاءة استهلاك الطاقة ومراقبة أجهزة التكييف والإنارة ولوحات التوزيع الكهربائية من شاشة تحكم مركزية موحدة.",
        scopeOfWork: [
          "تركيب لوحات DDC للتحكم بوحدات مناولة الهواء (AHU) ومبردات الشيلر",
          "ربط عدادات الطاقة الذكية لمراقبة الاستهلاك وتحليل الأحمال",
          "بناء واجهة مستخدم رسومية (SCADA Dashboard) لفريق الصيانة والتشغيل",
          "برمجة جداول التشغيل الآلية لتحسين استهلاك الطاقة بنسبة تفوق 20%",
        ],
        tag: "التحكم الذكي بالمباني BMS",
        category: "software",
        icon: "Cpu",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        highlight: "تحكم ذكي بوحدات التكييف والإنارة والطاقة عبر واجهة رسومية مركزية.",
        summary: "نظام BMS لإدارة الطاقة والمراقبة الآلية للتكييف واللوحات الكهربائية في مبنى إداري.",
        description: "مشروع متطور يهدف إلى ربط كافة الأنظمة الكهروميكانيكية في المقر الإداري عبر منصة تحكم موحدة تتيح المراقبة التنبؤية والتنبيه المبكر لأي أعطال.",
        stats: [
          { label: "نطاق التحكم", value: "تكييف، إنارة، طاقة" },
          { label: "كفاءة التوفير", value: "توفير متوقع 22%" },
          { label: "حالة المشروع", value: "جاري التوريد والبرمجة" },
        ],
        technologies: ["لوحات DDC الميدانية", "حساسات حرارة وضغط دقيقة", "بروتوكولات ربط شبكية قياسية", "برمجيات المراقبة المركزية SCADA"],
        challenges: [
          "تنسيق الربط مع لوحات ومعدات من شركات تصنيع مختلفة",
          "ضمان استقرار قراءات الحساسات عبر الطوابق المختلفة",
        ],
        solutions: [
          "استخدام بروتوكولات تحكم قياسية مفتوحة للدمج السلس",
          "معايرة واختبار نقاط التحكم مرحلياً قبل الإطلاق الكلي",
        ],
        statusBadge: "مشروع نعمل عليه حالياً (جاري التنفيذ)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: true,
        showOnSite: true,
      },
      {
        id: "contracting-ops-platform",
        title: "تطوير منصة العمليات الرقمية وإدارة الصيانة والمتابعة الميدانية",
        client: "منصة ويب وإدارة ميدانية مخصصة",
        sector: "قطاع المشروعات والخدمات الهندسية",
        challengeNeed: "أتمتة وتوحيد متابعة أوامر العمل وبلاغات الصيانة بين المهندسين الميدانيين والإدارة المركزية.",
        scopeOfWork: [
          "تحليل متطلبات فرق العمل الميدانية ومسارات الاستجابة لبلاغات الأعطال",
          "بناء تطبيق ويب للهواتف يتيح توثيق الأعمال بالصور وتسجيل تقارير الإنجاز",
          "لوحة تحكم إدارية مركزية لمتابعة حالة المشروعات ونسب التنفيذ اللحظية",
          "نظام إشعارات وتنبيهات فورية لمديري المشروعات وفريق الصيانة",
        ],
        tag: "البرمجيات والحلول الرقمية",
        category: "software",
        icon: "Layers",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        highlight: "منصة ويب موحدة لإدارة أوامر العمل والمتابعة الميدانية وتوثيق الإنجاز.",
        summary: "تطبيق ويب متكامل لإدارة العمليات الميدانية وبلاغات الصيانة وتتبع المهام.",
        description: "تطوير نظام ويب متقدم يلائم احتياجات شركات المقاولات والخدمات الهندسية لمتابعة المشروعات وتوزيع المهام وتوثيق الاعتمادات في بيئة آمنة.",
        stats: [
          { label: "المعمارية", value: "تطبيق ويب سحابي سريع" },
          { label: "الصلاحيات", value: "متعددة الأدوار (RBAC)" },
          { label: "حالة المشروع", value: "قيد التطوير والتجهيز" },
        ],
        technologies: ["واجهات ويب تفاعلية حديثة", "قواعد بيانات سحابية لحظية", "نظام توثيق بالصور والتقارير", "إدارة صلاحيات متقدمة"],
        challenges: [
          "تمكين المهندسين من تحديث المهام بسهولة من المواقع والمستودعات",
          "حماية سرية وثائق المشروعات وبيانات العملاء",
        ],
        solutions: [
          "تصميم شاشات استجابة سريعة خفيفة البيانات للهواتف",
          "تطبيق تشفير كامل وصلاحيات مستندة للأدوار الوظيفية",
        ],
        statusBadge: "مشروع نعمل عليه حالياً (قيد التجهيز)",
        projectStatus: "ongoing",
        isUpcoming: true,
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
    services: "Engineering Solutions",
    projects: "Projects & Success",
    architecture: "Engineering Tools & Radar",
    estimator: "Cost Estimator",
    process: "Process",
    faq: "FAQ",
    contact: "Inquiry & Contact",
    surveyCta: "Inquiry & Contact",
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
    title: "Engineering Solutions & Services",
    subtitle: "Integrated technology solutions engineered for business, spanning physical security systems, IT infrastructure, ELV systems, and custom software—backed by project delivery and ongoing support.",
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
      {
        id: "smart-bms-hvac",
        title: "Smart Building Management (BMS) & Energy Optimization System",
        client: "Multi-Storey Corporate Headquarters",
        sector: "Smart Commercial Buildings",
        challengeNeed: "Optimizing HVAC power consumption and centralizing electrical switchgear monitoring from a unified SCADA workstation.",
        scopeOfWork: [
          "Direct Digital Controller (DDC) panels installation for AHU and chiller plants",
          "Smart power meter integration analyzing real-time building load profiles",
          "Central SCADA graphical interface engineering for facility operations team",
          "Automated schedule optimization projected to reduce cooling energy by over 20%",
        ],
        tag: "Building Management Systems BMS",
        category: "software",
        icon: "Cpu",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        highlight: "Centralized SCADA control for HVAC, energy metering, and predictive maintenance.",
        summary: "Enterprise BMS for automated energy optimization and mechanical plant monitoring.",
        description: "Modern smart building deployment interconnecting multi-floor electromechanical systems to enable real-time energy telemetry and early fault detection.",
        stats: [
          { label: "Supervised Systems", value: "HVAC, Power, Lighting" },
          { label: "Energy Savings", value: "22% Projected" },
          { label: "Project Status", value: "Active Implementation" },
        ],
        technologies: ["Field DDC Controllers", "Precision Thermal Sensors", "Standard Bus Protocols", "Centralized SCADA Workstation"],
        challenges: [
          "Interfacing with legacy HVAC chillers from diverse equipment vendors",
          "Ensuring zero disruption to daily corporate tenant operations during installation",
        ],
        solutions: [
          "Open standard industrial gateways for seamless multi-vendor integration",
          "Phased sensor commissioning during off-peak weekend windows",
        ],
        statusBadge: "Active Project in Progress (Ongoing)",
        projectStatus: "ongoing",
        isUpcoming: true,
        verified: true,
        showOnSite: true,
      },
      {
        id: "contracting-ops-platform",
        title: "Digital Field Operations & Maintenance Management Platform",
        client: "Custom Contracting Web & Field Operations Portal",
        sector: "Contracting & Engineering Services",
        challengeNeed: "Automating site work orders, technician dispatches, and daily engineering logs between field crews and executive management.",
        scopeOfWork: [
          "Field operations workflow analysis and automated SLA dispatch rules",
          "Mobile-first web application enabling site photo logging and sign-off approvals",
          "Executive analytics dashboard tracking real-time project milestone velocity",
          "Instant alert system notifying project managers of on-site blockers",
        ],
        tag: "Software & Digital Solutions",
        category: "software",
        icon: "Layers",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        highlight: "Unified platform for work orders, mobile site reporting, and milestone tracking.",
        summary: "Custom internal web system engineered for task dispatching, milestone tracking, and site documentation.",
        description: "Development of a tailored web platform empowering contracting and engineering firms to monitor job sites, assign technician tasks, and review progress logs through a secure administrative interface.",
        stats: [
          { label: "Architecture", value: "Web App & Cloud DB" },
          { label: "Access Security", value: "Role-Based Access (RBAC)" },
          { label: "Project Status", value: "In Progress / Staging" },
        ],
        technologies: ["Modern Web Architecture", "Cloud Database Storage", "Interactive Analytics Dashboards", "Encrypted Authentication (RBAC)"],
        challenges: [
          "Divergent work environments between outdoor site engineers and office administrators",
          "Need for rapid, lightweight mobile logging with minimal data input friction",
          "Protecting proprietary project data, client documents, and costing records",
        ],
        solutions: [
          "Responsive, fast-loading mobile interfaces optimized for handheld tablets and phones",
          "Automated milestone approval workflows ensuring traceable progress logs",
          "Granular permission policies ensuring staff only access authorized projects",
        ],
        statusBadge: "Active Project in Progress (Ongoing)",
        projectStatus: "ongoing",
        isUpcoming: true,
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
