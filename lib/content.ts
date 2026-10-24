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

export const siteConfig = {
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+20 101 234 5678 [TO_CONFIRM]",
  whatsappNumber: process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || "201012345678",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "Support@tech-bokra.com",
  secondaryEmail: process.env.NEXT_PUBLIC_COMPANY_SALES_EMAIL || "sales@tech-bokra.com",
  addressAr: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_AR || "مصر، القاهرة، مكرم عبيد، مدينة نصر",
  addressEn: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_EN || "Makram Ebeid, Nasr City, Cairo, Egypt",
  workingHoursAr: "السبت - الخميس: 9:00 ص - 6:00 م (خدمة الطوارئ 24/7 للمشتركين)",
  workingHoursEn: "Sat - Thu: 9:00 AM - 6:00 PM (24/7 SLA for Contract Clients)",
  linkedinUrl: process.env.NEXT_PUBLIC_COMPANY_LINKEDIN || "https://linkedin.com/company/tech-bokra",
  facebookUrl: process.env.NEXT_PUBLIC_COMPANY_FACEBOOK || "https://facebook.com/techbokra",
  commercialRegister: process.env.NEXT_PUBLIC_COMPANY_CR || "[TO_CONFIRM_CR]",
  taxId: process.env.NEXT_PUBLIC_COMPANY_TAX_ID || "[TO_CONFIRM_TAX_ID]",
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
    title: "مشروعات وحلول مصممة لخدمة الأعمال",
    subtitle: "نماذج للحلول والمشروعات التي ننفذها وندعمها، مع مراعاة اتفاقيات السرية ومتطلبات المنشآت.",
    filterAll: "جميع المشروعات",
    filterUpcoming: "مشروعات قيد التطوير والتجهيز",
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
    upcomingBadge: "قيد التطوير والتجهيز",
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
        statusBadge: "تم التنفيذ والتسليم (مع دعم فني وصيانة دورية)",
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
        statusBadge: "تم التنفيذ والتسليم بنجاح",
      },
      {
        id: "contracting-ops-platform",
        title: "تطوير نظام داخلي لإدارة العمليات ومتابعة المهام",
        client: "منصة ويب داخلية للعمليات",
        sector: "قطاع المقاولات والخدمات الهندسية",
        challengeNeed: "التغلب على تشتت متابعة المشروعات والمهام بين الفرق الميدانية والإدارية، وتوحيد دورة العمل وتسجيل مستجدات الإنجاز في مكان واحد.",
        scopeOfWork: [
          "تحليل دورة العمل الحالية وتحديد الاحتياجات الفنية والتشغيلية",
          "تصميم وبناء تطبيق ويب داخلي مخصص يتيح توزيع المهام ومتابعة نسب الإنجاز",
          "إتاحة إرفاق التقارير والصور الميدانية من المواقع وتتبع الاعتمادات",
          "لوحة تحكم لإدارة المشروع وتحديد الصلاحيات والمستخدمين",
        ],
        tag: "البرمجيات والحلول الرقمية",
        category: "software",
        icon: "Layers",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        highlight: "توحيد متابعة المشروعات والمهام وربط الفرق الميدانية بالإدارة عبر منصة داخلية.",
        summary: "تطبيق ويب داخلي لإدارة العمليات ومتابعة نسب الإنجاز وإرفاق التقارير الفنية.",
        description: "تطوير نظام ويب مخصص يساعد شركات المقاولات والخدمات الهندسية على متابعة المشروعات وتوزيع المهام واستلام التقارير الميدانية بلوحة تحكم مركزية آمنة.",
        stats: [
          { label: "المعمارية", value: "تطبيق ويب وقواعد سحابية" },
          { label: "نظام الصلاحيات", value: "إدارة متعددة الأدوار (RBAC)" },
          { label: "حالة المشروع", value: "قيد التطوير والتجهيز" },
        ],
        technologies: ["معمارية ويب حديثة (Web Application)", "قواعد بيانات سحابية مؤمنة", "لوحات تحكم تفاعلية وتقارير لحظية", "نظام أمان وتشفير وإدارة صلاحيات (RBAC)"],
        challenges: [
          "تفاوت بيئات العمل بين المهندسين الميدانيين والمقر الإداري",
          "الحاجة لتسجيل وتحديث التقارير من الهواتف بسلاسة وسرعة",
          "حماية بيانات المشروعات وخصوصية المستندات الداخلية",
        ],
        solutions: [
          "واجهات تفاعلية سريعة الاستجابة تعمل على الهواتف والأجهزة اللوحية",
          "أتمتة دورة تسجيل المهام وتقارير الإنجاز في تسلسل معتمد",
          "إدارة دقيقة لصلاحيات الوصول لكل دور وظيفي ومراجع",
        ],
        statusBadge: "قيد التطوير والتجهيز للتشغيل الداخلي (In Progress)",
        isUpcoming: true,
      },
      {
        id: "helio-property",
        title: "منصة هليو بروبرتي (Helio Property)",
        client: "منصة رقمية متخصصة",
        sector: "التطوير العقاري وإدارة المشروعات (PropTech)",
        challengeNeed: "أتمتة استعراض الوحدات العقارية وجداول الأقساط وحسابات السداد، وتسهيل تواصل العملاء مع مسؤولي المبيعات دون تأخير.",
        scopeOfWork: [
          "تطوير الواجهات البرمجية وتجربة المستخدم السريعة المتوافقة مع كافة الشاشات",
          "هندسة محرك بحث وفلترة متقدم للمشروعات والوحدات حسب المساحة والسعر وجدول السداد",
          "تكامل المحادثة المباشرة لتسهيل التواصل الفوري",
          "نشر المنصة على شبكة سحابية سريعة مع تحديثات لحظية لحالات الوحدات",
        ],
        tag: "البرمجيات والحلول الرقمية",
        category: "software",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        highlight: "نموذج تقني لمنصة عقارية ذكية تحت التطوير والتجهيز الهندسي.",
        summary: "نموذج لمنصة رقمية لإدارة وحجز الوحدات العقارية قيد التطوير التقني.",
        description: "تعمل تيك بكرة على تطوير واختبار نموذج منصة 'هليو بروبرتي' داخلياً لتقييم كفاءة وتجربة المستخدم في استعراض المشروعات وجداول الأقساط.",
        stats: [
          { label: "حالة المنظومة", value: "قيد التطوير والتجهيز" },
          { label: "المعمارية", value: "Next.js سحابية" },
          { label: "نوع المشروع", value: "منصة رقمية" },
        ],
        technologies: ["Next.js App Router", "TypeScript & Tailwind CSS", "Cloud Edge Network", "Real Estate Query Engine"],
        challenges: [
          "عرض المخططات والبيانات دون التأثير على سرعة التحميل على الهواتف",
          "تنظيم جداول الأقساط المتغيرة وحسابات السداد بوضوح",
          "تمكين فريق المبيعات من تحديث حالات الوحدات والتواصل اللحظي",
        ],
        solutions: [
          "الاعتماد على شبكة توزيع محتوى سحابية مع تحسين تلقائي للصور والمخططات",
          "تطوير محرك مرن لحساب وتوزيع جداول الدفع بوضوح وشفافية",
          "ربط المنصة بنظام محادثات فوري للرد على استفسارات المشترين فوراً",
        ],
        statusBadge: "قيد التطوير والتجهيز (In Progress)",
        liveUrl: "https://helio-property.vercel.app/",
        isUpcoming: true,
      },
      {
        id: "alrehla",
        title: "منصة الرحلة (Al-Rehla Interactive)",
        client: "منصة تفاعلية رقمية",
        sector: "المنصات التفاعلية والوسائط الرقمية",
        challengeNeed: "تقديم تجربة بصرية تفاعلية وسلسة تدير تدفق الوسائط والمحتوى مع استجابة فائقة السرعة على مختلف الأجهزة والشبكات.",
        scopeOfWork: [
          "هندسة الواجهات التفاعلية وتجربة التصفح المخصصة متعددة اللغات",
          "بناء معمارية سحابية مرنة مع تقنيات التخزين المؤقت المتقدم",
          "اختبار الأداء واستقرار السيرفرات تحت أحمال الزوار المرتفعة",
          "تهيئة التطبيق للعمل كـ Progressive Web App مع سرعة تحميل استثنائية",
        ],
        tag: "البرمجيات والحلول الرقمية",
        category: "software",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        highlight: "منصة رقمية معرفية وتفاعلية تحت التطوير والاختبار الداخلي.",
        summary: "منصة رقمية قيد التطوير والتجهيز التقني تجمع بين المحتوى والتفاعل البصري.",
        description: "تعمل تيك بكرة على تطوير ودعم البنية التحتية السحابية لمنصة 'الرحلة' قيد التطوير والاختبار، لتقييم آليات تدفق المحتوى والتفاعل الرقمي واستقرار السيرفرات.",
        stats: [
          { label: "حالة المنظومة", value: "قيد التطوير والاختبار" },
          { label: "المعمارية", value: "Next.js & TypeScript" },
          { label: "نوع المشروع", value: "منصة تفاعلية" },
        ],
        technologies: ["Next.js & TypeScript", "Cloud Architecture", "Interactive Story Engine", "Progressive Web App"],
        challenges: [
          "تقديم تجربة بصرية استثنائية وجذابة دون المساومة على سرعة استجابة الموقع",
          "إدارة تدفق المحتوى والوسائط التفاعلية مع حماية سرية المستخدمين",
          "العمل بسلاسة تامة عبر جميع الأجهزة والمتصفحات مع دعم كامل للغتين",
        ],
        solutions: [
          "هندسة واجهات برمجية سريعة وخفيفة مع تخزين مؤقت متقدم للمحتوى المتكرر",
          "بنية تحتية سحابية مرنة قادرة على استيعاب طفرات الزوار بأعلى موثوقية",
          "تكامل تصميمي عالي الجودة مع خطوط وتدرجات بصرية تمنح المستخدم إحساساً بالأصالة والابتكار",
        ],
        statusBadge: "قيد التطوير والاختبار (In Progress)",
        liveUrl: "https://www.alrehla.org/",
        isUpcoming: true,
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
    taxId: "سجل تجاري 194022 • بطاقة ضريبية 682-901-443",
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
    title: "Projects & Solutions Engineered for Business",
    subtitle: "Selected examples of systems and solutions we implement and support, strictly adhering to non-disclosure agreements and client facility guidelines.",
    filterAll: "All Projects",
    filterUpcoming: "In Progress / Prototype",
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
    upcomingBadge: "In Progress - Beta Launch Soon",
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
        statusBadge: "Delivered & Supported (With Preventative Maintenance)",
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
        statusBadge: "Successfully Completed & Handed Over",
      },
      {
        id: "contracting-ops-platform",
        title: "Internal Operations & Task Management Web Application",
        client: "Internal Web Operations System",
        sector: "Contracting & Engineering Services",
        challengeNeed: "Overcoming fragmented field communication and disorganized spreadsheet tracking by centralizing project milestones, task dispatching, and site logs into a unified platform.",
        scopeOfWork: [
          "Workflow analysis mapping operational handoffs between field engineers and office management",
          "Custom web platform design with task assignment, progress tracking, and milestone logging",
          "Mobile-responsive upload capability for site inspection photos and daily progress reports",
          "Centralized administrative dashboard with granular Role-Based Access Control (RBAC)",
        ],
        tag: "Software & Digital Solutions",
        category: "software",
        icon: "Layers",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        highlight: "Streamlining site reporting, task dispatching, and project milestone tracking in one platform.",
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
        statusBadge: "In Progress (Internal Staging & Testing)",
        isUpcoming: true,
      },
      {
        id: "helio-property",
        title: "Helio Property Platform",
        client: "PropTech Platform Prototype",
        sector: "Real Estate & Property Tech (PropTech)",
        challengeNeed: "Automating unit discovery, payment breakdown calculation, and connecting prospective buyers directly with dedicated sales representatives.",
        scopeOfWork: [
          "Intuitive multi-device user interface engineered for property searches and plan reviews",
          "Advanced filtering engine calculating installment schedules and down payments",
          "Direct messaging integration for real-time buyer inquiries",
          "Cloud-edge deployment delivering rapid asset caching and real-time inventory updates",
        ],
        tag: "Software & Digital Solutions",
        category: "software",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        highlight: "PropTech digital platform prototype currently under internal engineering and iteration.",
        summary: "Interactive digital platform prototype engineered for property listings and installment tracking.",
        description: "Tech Bokra is developing and testing the Helio Property platform prototype internally to refine UX, search performance, and payment schedules prior to public release.",
        stats: [
          { label: "Current Status", value: "In Active Development" },
          { label: "Architecture", value: "Cloud Next.js" },
          { label: "Project Nature", value: "Digital Prototype" },
        ],
        technologies: ["Next.js App Router", "TypeScript & Tailwind CSS", "Cloud Edge Network", "Real Estate Query Engine"],
        challenges: [
          "Rendering architectural layouts and floor plans without mobile loading lag",
          "Organizing dynamic installment structures with transparent payment breakdowns",
          "Equipping sales agents with real-time unit status updates",
        ],
        solutions: [
          "Global content distribution network optimizing image and schematic delivery",
          "Modular calculation engine handling diverse payment plan timelines",
          "Direct chat integrations routing inquiries instantaneously to representatives",
        ],
        statusBadge: "In Progress (Prototype Development)",
        liveUrl: "https://helio-property.vercel.app/",
        isUpcoming: true,
      },
      {
        id: "alrehla",
        title: "Al-Rehla Platform",
        client: "Interactive Media Platform",
        sector: "Digital Media & Interactive Platforms",
        challengeNeed: "Delivering a fluid, visually compelling storytelling experience that handles rich media streams seamlessly across varying network conditions.",
        scopeOfWork: [
          "Bespoke interactive interface architecture with multi-language layout support",
          "Scalable cloud infrastructure utilizing edge caching for rich media assets",
          "Performance testing and optimization under concurrent visitor workloads",
          "Progressive Web App (PWA) optimization for instant load times",
        ],
        tag: "Software & Digital Solutions",
        category: "software",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        highlight: "Knowledge and interactive digital storytelling platform under internal technical testing.",
        summary: "Interactive media platform prototype uniting narrative content with modern visual design.",
        description: "Tech Bokra supports the cloud foundation and interface engineering for the Al-Rehla interactive platform under active technical development and refinement.",
        stats: [
          { label: "Current Status", value: "Development & Testing" },
          { label: "Architecture", value: "Next.js & TypeScript" },
          { label: "Project Nature", value: "Interactive Platform" },
        ],
        technologies: ["Next.js & TypeScript", "Cloud Architecture", "Interactive Story Engine", "Progressive Web App"],
        challenges: [
          "Delivering immersive visual experiences without sacrificing page response speed",
          "Streamlining interactive media pipelines while safeguarding user privacy",
          "Seamless responsiveness across devices with complete RTL and LTR support",
        ],
        solutions: [
          "Lightweight API responses with edge caching for recurring media assets",
          "Resilient cloud clustering designed to handle visitor spikes smoothly",
          "Tailored typography and interface gradients creating an authentic experience",
        ],
        statusBadge: "In Progress (Platform Testing)",
        liveUrl: "https://www.alrehla.org/",
        isUpcoming: true,
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
    taxId: "CR: 194022 • Tax ID: 682-901-443",
    addressVal: "Nasr City, Cairo, Egypt",
  },
};
