export interface Project {
  id: string;
  title: string;
  client: string;
  tag: string;
  category: 'security' | 'network' | 'software' | 'erp';
  description: string;
  summary: string;
  icon: string;
  image: string;
  highlight: string;
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
    viewDetails: string;
    closeModal: string;
    challengeTitle: string;
    solutionTitle: string;
    techTitle: string;
    livePreviewBtn: string;
    upcomingBadge: string;
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
    phoneLabel: string;
    phonePlaceholder: string;
    serviceLabel: string;
    governorateLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
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
  phone: "+20 101 234 5678",
  whatsappNumber: "201012345678",
  email: "Support@tech-bokra.com",
  secondaryEmail: "sales@tech-bokra.com",
  addressAr: "مصر، القاهرة، مكرم عبيد، مدينة نصر",
  addressEn: "Makram Ebeid, Nasr City, Cairo, Egypt",
  workingHoursAr: "السبت - الخميس: 9:00 ص - 6:00 م (خدمة الطوارئ 24/7 للمشتركين)",
  workingHoursEn: "Sat - Thu: 9:00 AM - 6:00 PM (24/7 SLA for Contract Clients)",
  linkedinUrl: "https://linkedin.com/company/tech-bokra",
  facebookUrl: "https://facebook.com/techbokra",
  commercialRegister: "CR-194022",
  taxId: "TX-682-901-443",
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
    sub: "في \"تيك بكرة\" نقدم حلولاً تقنية متكاملة ومصممة وفق احتياجات المشروعات؛ تشمل أنظمة المراقبة الذكية، البنية التحتية للشبكات ومراكز البيانات، المنصات المتخصصة، وتطبيقات ومنظومات ERP، مدعومة بالاستشارات والاعتمادات الهندسية.",
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
    subtitle: "حلول تقنية متكاملة مصممة وفق احتياجات أعمالك، منظمة تحت ركيزتين رئيسيتين: أنظمة الأمن المادي والبنية التحتية، والحلول الرقمية والبرمجيات.",
    allTab: "كافة الحلول",
    secTab: "أنظمة الأمن المادي والبنية التحتية",
    netTab: "البنية التحتية ومراكز البيانات",
    softTab: "الحلول الرقمية والبرمجيات",
    erpTab: "تطبيقات ومنظومات ERP",
    consultTab: "استشارات واعتمادات فنية",
    orderCta: "طلب أو استفسار عن هذه الخدمة",
    viewSpecs: "المواصفات الفنية",
    list: [
      {
        id: "cctv-surveillance",
        category: "security",
        iconName: "Camera",
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
        title: "أنظمة المراقبة الذكية والذكاء الاصطناعي (CCTV & AI Video)",
        shortDesc: "كاميرات مراقبة رقمية فائقة الدقة (IP & 4K) مزودة بتقنيات الذكاء الاصطناعي للتعرف على الوجوه، اللوحات، وتحليل الحركة المحيطية.",
        points: [
          "تغطية محيطية وداخلية بدقة 4K مع رؤية ليلية ملونة Full-Color وتقريب بصري ذكي",
          "تحليل فيديو ذكي لكشف التسلل والتعرف على لوحات السيارات (ANPR/LPR) وتتبع المسار",
          "أجهزة تسجيل شبكية NVR مركزية مع مصفوفة تخزين RAID وتكرار النسخ الاحتياطي حتى 180 يوماً",
          "غرف مراقبة موحدة وإمكانية المتابعة الآمنة والمشفرة عن بُعد عبر تطبيقات الجوال",
        ],
        specs: [
          { title: "البروتوكولات", desc: "ONVIF Profile S/G/T, RTSP, H.265+, H.265 Smart Stream" },
          { title: "العلامات المعتمدة", desc: "Hikvision Pro, Dahua Enterprise, Uniview, Axis" },
          { title: "الضمان", desc: "ضمان وكيل محلي 2 إلى 3 سنوات مع عقد صيانة وقائي" },
        ],
        deliverables: ["مخطط توزيع زوايا الرؤية والنقاط العمياء", "كابلات نحاسية Cat6A نقية محمية", "تدريب فريق الأمن الداخلي"],
      },
      {
        id: "network-infrastructure",
        category: "network",
        iconName: "Network",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        title: "البنية التحتية، كابلات UTP والفايبر، ومراكز البيانات (Data Centers)",
        shortDesc: "تصميم وتنفيذ شبكات الكابلات المهيكلة UTP/STP، مسارات الفايبر البصري، وتجهيز مراكز البيانات مع حلول DCIM ومراكز البيانات المصغرة.",
        points: [
          "تمديد كابلات الشبكات المهيكلة النحاسية UTP / STP / SFTP (Cat6 / Cat6A / Cat7) مع مسارات Cable Trays وترانكات معزولة",
          "تمديد ولحام كابلات الألياف الضوئية (Fiber Optic Single/Multi-mode) واختبارات فلوك Fluke Test و OTDR",
          "تجهيزات مراكز البيانات المتكاملة (Data Center Fit-out): كبائن سيرفرات 42U/48U، وحدات PDU ذكية، والتبريد الدقيق In-Row Precision Cooling",
          "أنظمة إدارة ومراقبة البنية التحتية DCIM وحساسات الحرارة والرطوبة ومراقبة استهلاك الطاقة وتفادي الأعطال",
          "مراكز البيانات المصغرة والذكية (Smart Mini Data Centers & Micro Edge Centers) كحل مدمج موفر للمساحة والطاقة",
        ],
        specs: [
          { title: "سرعات النقل", desc: "10Gbps / 40Gbps / 100Gbps Backbone Throughput" },
          { title: "الماركات المعتمدة", desc: "Schneider, Legrand, Panduit, CommScope, Rittal" },
          { title: "أجهزة الشبكة", desc: "Cisco Catalyst, Aruba, Ubiquiti UniFi, MikroTik" },
        ],
        deliverables: ["خرائط As-Built دقيقة", "شهادات فحص واختبار Fluke DSX معتمدة", "ترقيم وتنظيم كبائن الخوادم"],
      },
      {
        id: "access-control",
        category: "security",
        iconName: "ShieldCheck",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        title: "أنظمة التحكم بالدخول والبوابات الذكية (Access Control)",
        shortDesc: "حلول إدارة صلاحيات الدخول، بوابات التفتيش والمرور الدوارة (Turnstiles)، وأنظمة الحضور والانصراف البيومترية.",
        points: [
          "أجهزة بصمة الوجه، الأصابع، والكروت الذكية RFID / NFC بدون لمس مع كاميرات ثنائية العدسة",
          "بوابات أفراد أوتوماتيكية وزجاجية (Flap Barriers & Speed Gates) للشركات والمصانع والمؤسسات",
          "بوابات سيارات آلية (Boom Barriers) مع قارئات المدى البعيد UHF أو كاميرات LPR لقراءة اللوحات",
          "ربط فوري ومباشر مع أنظمة الموارد البشرية (HR) وإدارة الوقت وحساب الأجور والرواتب",
        ],
        specs: [
          { title: "زمن الاستجابة", desc: "أقل من 0.2 ثانية للتعرف على الوجه" },
          { title: "حماية الطوارئ", desc: "فتح تلقائي عند إشارات إنذار الحريق (Fire Interlock)" },
          { title: "الأنظمة المعتمدة", desc: "ZKTeco Enterprise, Suprema, Hikvision Access" },
        ],
        deliverables: ["سيرفر إدارة مركزي للصلاحيات", "كروت وبطاقات مشفرة", "تقارير الحضور اللحظية"],
      },
      {
        id: "specialized-web-platforms",
        category: "software",
        iconName: "Layers",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        title: "المواقع والمنصات المتخصصة ذات العمليات المتراكمة",
        shortDesc: "تطوير بوابات الويب المتقدمة والمنصات متعددة الأطراف التي تدير تدفقات بيانات ضخمة وعمليات تشغيلية تراكمية معقدة.",
        points: [
          "منصات إدارة الأصول العقارية والمجمعات (PropTech) وبوابات المستأجرين والملاك (مثل منصة Helio Property)",
          "منصات الحجز والعمليات اللوجستية والسياحية التفاعلية متعددة الخدمات والشركاء (مثل منصة الرحلة)",
          "بوابات المعاملات والتجارة B2B/B2C ذات العمليات الحسابية والمالية المتراكمة ولوحات المؤشرات اللحظية",
          "معمارية سحابية مصممة لتحمل مئات الآلاف من الزيارات والطلبات المتزامنة مع سرعة فائقة",
        ],
        specs: [
          { title: "التقنيات", desc: "Next.js 15, TypeScript, Node.js, PostgreSQL / MongoDB, Redis" },
          { title: "الحماية والتكامل", desc: "تشفير TLS 1.3، بوابات الدفع الإلكتروني المعتمدة، وAPIs مؤمنة" },
          { title: "السحابة", desc: "AWS, Google Cloud, Docker Containers, CDN Edge Networks" },
        ],
        deliverables: ["بنية برمجية معيارية قابلة للتوسع", "لوحات تحكم إدارية وتحليلية", "توثيق شامل للـ API"],
      },
      {
        id: "enterprise-apps-erp",
        category: "erp",
        iconName: "Smartphone",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        title: "التطبيقات والمنظومات المتخصصة وأنظمة ERP",
        shortDesc: "بناء تطبيقات الجوال الميدانية المتخصصة وتخصيص أنظمة تخطيط الموارد ERP لإدارة المخازن، سلاسل الإمداد، والفاتورة الإلكترونية.",
        points: [
          "تطبيقات هواتف ذكية متخصصة لفرق العمل الميدانية وخدمة العملاء (iOS & Android) مثل تطبيقي محياي وهليو إن",
          "تطبيق وتخصيص أنظمة ERP المتقدمة (Odoo, ERPNext, Custom Engines) لإدارة الحسابات، المشتريات، والمخازن",
          "إدارة المستودعات وسلاسل الإمداد وتتبع حركة الأصناف بالباركود و RFID مع نقاط البيع POS",
          "التكامل والربط المباشر المعتمد عبر API مع منظومة الفاتورة والإيصال الإلكتروني لمصلحة الضرائب المصرية (ETA)",
        ],
        specs: [
          { title: "منصات التطبيقات", desc: "Flutter, React Native, Native iOS/Android" },
          { title: "محرك الـ ERP", desc: "Odoo Enterprise / Community, ERPNext, Tailored Modules" },
          { title: "الربط الضريبي", desc: "ربط رسمي معتمد مع بوابة الفاتورة الإلكترونية المصرية ETA" },
        ],
        deliverables: ["نشر معتمد على المتاجر", "تهيئة الدورة المحاسبية والمخزنية", "تدريب شامل للموظفين"],
      },
      {
        id: "technical-submittals-consulting",
        category: "consulting",
        iconName: "FileCheck",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        title: "الاستشارات الهندسية وإعداد الاعتمادات الفنية (Technical Submittals)",
        shortDesc: "إعداد ومراجعة ملفات الاعتماد الفني، مراجعة كراسات شروط المناقصات، المخططات التنفيذية، واستلام الأعمال بأجهزة الفحص المعتمدة.",
        points: [
          "إعداد وتجهيز ملفات الاعتماد الفني للمواد (Material Submittals) وبطاقات البيانات الفنية (Datasheets) لمقاولي التيار الخفيف والشبكات",
          "صياغة جداول المطابقة الفنية (Compliance Sheets) بنداً ببند وفق اشتراطات كراسة الشروط والمواصفات للمشاريع والمناقصات",
          "مراجعة كراسات الشروط والمواصفات (Tender Specs & RFP Review) وتقديم التوصيات والبدائل المعتمدة هندسياً ومادياً",
          "إعداد المخططات التنفيذية Shop Drawings ومخططات الـ As-Built وتوزيع زوايا الرؤية والكابلات وتفاصيل الكبائن",
          "فحص واستلام تمديدات الشبكات بجهاز Fluke Networks وفحص كابلات الألياف الضوئية بجهاز OTDR مع تسليم شهادات المعايرة",
          "عقود الصيانة السنوية الوقائية والطارئة وعقود مستوى الخدمة (SLA) مع فريق دعم واستجابة ميداني 24/7",
        ],
        specs: [
          { title: "معايير الاعتماد", desc: "اشتراطات المكاتب الاستشارية الكبرى (Dar, ECG, Shaker, Sabbour)" },
          { title: "أجهزة الفحص", desc: "Fluke DSX-8000 CableAnalyzer, EXFO / Noyes OTDR" },
          { title: "عقود SLA", desc: "زمن استجابة 2 إلى 4 ساعات للحالات الحرجة مع أجهزة بديلة" },
        ],
        deliverables: ["ملف اعتماد فني متكامل جاهز للموافقة", "مخططات Shop Drawings معتمدة", "شهادات اختبار رسمية لكل نقطة"],
      },
    ],
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
    title: "أبرز مشاريعنا وقصص النجاح",
    subtitle: "نفخر بسجل حافل من الإنجازات في البنية التحتية وتطوير التطبيقات والأنظمة لقطاعات متنوعة.",
    filterAll: "جميع المشاريع",
    filterUpcoming: "منصات قيد التجهيز / شقيقة",
    filterSecurity: "أنظمة مراقبة",
    filterNetwork: "شبكات وتيار خفيف",
    filterSoftware: "تطبيقات ومنصات",
    filterERP: "أنظمة إدارة و ERP",
    viewDetails: "عرض تفاصيل المشروع",
    closeModal: "إغلاق",
    challengeTitle: "التحديات الهندسية للمشروع",
    solutionTitle: "الحلول المنفذة بواسطة تيك بكرة",
    techTitle: "التقنيات والمعدات المستخدمة",
    livePreviewBtn: "زيارة المنصة الحالية (Live)",
    upcomingBadge: "قيد التجهيز - قريباً",
    list: [
      {
        id: "emak-kharafi",
        title: "شركة إيماك - مجموعة الخرافي",
        client: "شركة إيماك للمقاولات (إحدى شركات مجموعة الخرافي - المقاول العام للمشروع)",
        tag: "شبكات وتيار خفيف للبنية التحتية",
        category: "network",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        highlight: "تأسيس وتجهيز البنية التحتية لشبكات البيانات ومراكز العمليات بأعلى معايير الأمان المعتمدة.",
        summary: "تأسيس وتجهيز البنية التحتية لشبكات البيانات ومراكز العمليات لصالح شركة إيماك للمقاولات (إحدى شركات مجموعة الخرافي - المقاول العام للمشروع).",
        description: "قام فريق مهندسي 'تيك بكرة' بتصميم وتنفيذ شبكة البيانات المتكاملة للبنية التحتية للمشروع بالتعاون مع المقاول العام (شركة إيماك للمقاولات)، مع تمديد خطوط الألياف الضوئية عالية السرعة وكابلات Cat6A، وتركيب وتأمين كبائن السيرفرات المجهزة بنظم حماية التغذية الكهربائية والتأريض والتبريد المركزي.",
        stats: [
          { label: "نقاط الشبكة", value: "+350 نقطة" },
          { label: "كابلات فايبر", value: "Multi-Gigabit" },
          { label: "اعتمادية التشغيل", value: "100%" },
        ],
        technologies: ["Cisco Catalyst Managed Switches", "Schneider Cat6A Structured Cabling", "Fiber Optic Backbone", "Fluke DSX Certified"],
        challenges: [
          "تنفيذ شبكة ضخمة متكاملة تلبي اشتراطات ومواصفات المقاول العام والمشاريع الكبرى بدقة زمنية صارمة",
          "متطلبات أمنية وهندسية مشددة جداً لسرية واستقرار تدفق البيانات وعزل الشبكات الحساسة",
          "تنسيق مسارات التمديد مع أعمال الهندسة الكهروميكانيكية المتزامنة في الموقع",
        ],
        solutions: [
          "استخدام مسارات كابلات خفية ومحمية بمواسير معدنية مجلفنة (EMT) مطابقة للمواصفات العالمية",
          "تطبيق تقسيم الشبكة إلى Virtual LANs معزولة ومحمية بجدران نارية متقدمة",
          "إجراء اختبارات Fluke موثقة ومعتمدة لكل مسار شبكة وتسليم المخططات As-Built بدقة هندسية",
        ],
      },
      {
        id: "hacienda-ras-sedr",
        title: "قرية هاسيندا رأس سدر",
        client: "قرية هاسيندا - رأس سدر",
        tag: "أنظمة مراقبة",
        category: "security",
        icon: "ShieldAlert",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        highlight: "تغطية أمنية شاملة عبر توريد وتركيب أحدث كاميرات المراقبة.",
        summary: "تغطية أمنية شاملة عبر توريد وتركيب أحدث كاميرات المراقبة المحيطية والداخلية مع ربط لاسلكي بعيد المدى.",
        description: "نظراً لاتساع رقعة المنتجع وقربه من شاطئ البحر، تم توريد وتركيب منظومة مراقبة ذكية بكاميرات مقاومة للعوامل الجوية (IP67 / IK10) مع ربط لاسلكي بين الشاليهات والبوابات والشاطئ دون الحاجة لحفر مسافات طويلة.",
        stats: [
          { label: "كاميرات مراقبة", value: "+120 كاميرا IP" },
          { label: "روابط لاسلكية", value: "5GHz Point-to-Multipoint" },
          { label: "التغطية", value: "360° محيطية كاملة" },
        ],
        technologies: ["Hikvision DarkFighter & ColorVu 4K", "Ubiquiti AirMax Wireless Bridge", "Solar-Powered Surveillance Poles", "Milestone VMS"],
        challenges: [
          "ارتفاع الرطوبة والرياح المحملة برذاذ الملح البحري مما يتلف الأجهزة العادية سريعاً",
          "صعوبة الحفر وتمديد الكابلات الأرضية بين المنشآت الشاطئية وحمامات السباحة",
          "الحاجة للرؤية الليلية الصافية في المناطق الشاطئية المظلمة تماماً",
        ],
        solutions: [
          "اختيار كاميرات بهياكل ألومنيوم بحري معالجة ومقاومة للتآكل بتصنيف IP67",
          "تطبيق شبكة ربط لاسلكية موثوقة (Wireless PTP/PTMP) لنقل إشارات الفيديو بسرعة فائقة",
          "استخدام كاميرات بتقنية ColorVu الملونة ليلاً لضمان وضوح ملامح الأشخاص والمركبات على الشاطئ",
        ],
      },
      {
        id: "mahyay-app",
        title: "تطبيق محياي",
        client: "منصة محياي",
        tag: "تطبيق جوال",
        category: "software",
        icon: "Smartphone",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
        highlight: "تطبيق متوفر على جوجل بلاي يهدف لتقديم خدمات نوعية.",
        summary: "تطبيق متوفر على جوجل بلاي يهدف لتقديم خدمات نوعية للأفراد والشركات مع نظام حجز ودفع إلكتروني فوري.",
        description: "قامت تيك بكرة بتطوير التطبيق من الصفر بأسلوب Cross-Platform مع بنية تحتية سحابية قابلة للتوسع التلقائي وتدعم آلاف المستخدمين النشطين في نفس اللحظة.",
        stats: [
          { label: "تقييم المستخدمين", value: "4.8 / 5" },
          { label: "وقت استجابة الـ API", value: "< 120ms" },
          { label: "جاهزية السيرفرات", value: "99.95%" },
        ],
        technologies: ["Flutter SDK", "Node.js & TypeScript Backend", "PostgreSQL & Redis Cache", "Google Cloud Platform", "Paymob Gateway"],
        challenges: [
          "ضمان عمل التطبيق بسلاسة تامة على مختلف إصدارات هواتف أندرويد الاقتصادية والـ iOS",
          "حماية بيانات المستخدمين ومعاملات الدفع الرقمية بأعلى مستويات التشفير",
          "الحاجة لنظام إشعارات فورية (Push Notifications) سريع ومحدد حسب الموقع الجغرافي",
        ],
        solutions: [
          "استخدام إطار عمل Flutter مع State Management محكم لاستهلاك أقل قدر من ذاكرة الهاتف",
          "تطبيق بنية Microservices مؤمنة بالكامل مع توثيق JWT و Cloudflare DDoS Shield",
          "التكامل مع Firebase Cloud Messaging مع استهداف دقيق للمستخدمين",
        ],
      },
      {
        id: "helio-in",
        title: "تطبيق هليو ان",
        client: "مجتمع نيو هليوبوليس",
        tag: "تطبيق مجتمعي",
        category: "software",
        icon: "Home",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
        highlight: "منصة خدمية متكاملة لخدمة سكان وعمال نيو هليوبوليس.",
        summary: "منصة خدمية متكاملة لخدمة سكان وعمال نيو هليوبوليس، تشمل إدارة طلبات الصيانة والإعلانات والتواصل المجتمعي.",
        description: "تم تصميم وتطوير المنصة لتكون المركز الرقمي الأول للمدينة، حيث يمكن للساكن طلب فني صيانة، متابعة عدادات الخدمات، الإبلاغ عن الأعطال، والتواصل مع الإدارة بسهولة تامة.",
        stats: [
          { label: "مستخدم نشط", value: "+8,000" },
          { label: "تذكرة صيانة محلولة", value: "+14,000" },
          { label: "نسبة رضا السكان", value: "94%" },
        ],
        technologies: ["React Native", "Next.js Admin Dashboard", "MongoDB Enterprise", "WebSockets Real-time Chat", "Amazon S3"],
        challenges: [
          "تعدد أطراف المنظومة (السكان، عمال الصيانة، شركات الخدمات، إدارة المدينة)",
          "ضرورة متابعة موقع فني الصيانة ومسار طلبه في الوقت الفعلي على الخريطة",
          "توفير بيئة تواصل آمنة لمنع الحسابات الوهمية",
        ],
        solutions: [
          "بناء 3 واجهات منفصلة ومتناغمة (تطبيق الساكن، تطبيق الفني، ولوحة تحكم الإدارة العامة)",
          "ربط نظام التتبع الجغرافي المباشر بنظام تذاكر الصيانة وإشعار الساكن بوصول الفني",
          "التحقق من هوية الساكن برقم الوحدة وعقد التمليك لتوفير أمان تام للمجتمع",
        ],
      },
      {
        id: "eelaf-kpi",
        title: "نظام EELAF-KPI",
        client: "مجموعة إيلاف للاستثمار",
        tag: "نظام إدارة",
        category: "erp",
        icon: "BarChart3",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        highlight: "لوحة تحكم متطورة لمتابعة وتحليل مؤشرات الأداء.",
        summary: "لوحة تحكم متطورة لمتابعة وتحليل مؤشرات الأداء اللحظية (KPIs) وتقارير الإنتاجية.",
        description: "طورت تيك بكرة نظام EELAF-KPI لتمكين الإدارة العليا من مراقبة صحة الأعمال ومعدلات الإنجاز دون الحاجة لتقارير ورقية معقدة، مع تنبيهات استباقية عند حدوث أي انحراف عن الأهداف المخططة.",
        stats: [
          { label: "توفير وقت التقارير", value: "70%" },
          { label: "دقة البيانات المالية", value: "99.8%" },
          { label: "مؤشر أداء مراقب", value: "+45 KPI" },
        ],
        technologies: ["Custom ERP Engine", "Python Fast API", "Apache Kafka Data Pipeline", "Tailwind CSS Dashboards", "Automated PDF Exporter"],
        challenges: [
          "تشتت البيانات بين ملفات إكسل قديمة وبرامج محاسبية غير متوافقة",
          "تأخر صدور التقارير الختامية لأيام بعد نهاية الشهر المالي",
          "صعوبة مراقبة الإنتاجية اليومية للمصانع والأفرع المختلفة",
        ],
        solutions: [
          "بناء طبقة ربط سحابية (Data Aggregator) تسحب البيانات وتوحدها تلقائياً كل ساعة",
          "إنشاء لوحة تحكم تفاعلية مع رسوم بيانية وتنبؤات باستخدام خوارزميات ذكية",
          "إتاحة صلاحيات متدرجة (RBAC) تضمن اطلاع كل مدير على مؤشرات قسمه فقط مع حماية البيانات السرية",
        ],
      },
      {
        id: "industrial-smart-security",
        title: "المجمع الصناعي وبوابات الشاحنات الذكية",
        client: "مجموعة الفهد للصناعات الهندسية",
        tag: "تيار خفيف ومراقبة حرارية",
        category: "security",
        icon: "Cpu",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        highlight: "نظام كشف حراري للمستودعات مع بوابات آلية ذكية للتحكم بمرور الشاحنات.",
        summary: "منظومة متكاملة لحماية المنشأة الصناعية ضد مخاطر الحريق وسرقة البضائع عبر كاميرات حرارية وبوابات بصرية متطورة.",
        description: "قامت تيك بكرة بتوريد وتركيب شبكة كاميرات حرارية (Thermal Cameras) للكشف المبكر عن ارتفاع درجات حرارة المحولات وخطوط التخزين، مع نظام بوابات هيدروليكية للشاحنات مزود بكاميرات قراءة اللوحات وربطها بنظام أذونات خروج البضائع.",
        stats: [
          { label: "حوادث حريق مبكرة مسجلة", value: "3 اكتشافات ناجحة" },
          { label: "زمن دخول الشاحنة", value: "انخفض من 5 دقائق إلى 15 ثانية" },
          { label: "منطقة تغطية صناعية", value: "25,000 م²" },
        ],
        technologies: ["Hikvision Thermography Cameras", "Long-Range UHF RFID Gate", "Automatic Number Plate Recognition (ANPR)", "Schneider Industrial Enclosures"],
        challenges: [
          "بيئة صناعية شاقة مليئة بالأتربة والحرارة العالية والاهتزازات الناتجة عن الماكينات",
          "تكلس الشاحنات عند البوابات وتسببها في تأخير جدول الشحن والتوزيع",
          "خطر نشوب حرائق في مستودعات المواد الخام الحساسة دون إنذار كلاسيكي فوري",
        ],
        solutions: [
          "استخدام كبائن صناعية معزولة ومكيفة (Industrial Enclosures) لحماية أجهزة الشبكة والسويتشات",
          "كاميرات حرارية ثنائية الطيف تطلق إنذاراً صوتياً وبصرياً فور تجاوز أي جزء لدرجة 60 مئوية قبل ظهور الدخان",
          "أتمتة دخول الشاحنات بربط باركود إذن الاستلام بنظام فتح البوابة التلقائي",
        ],
      },
      {
        id: "helio-property",
        title: "منصة هليو بروبرتي (نموذج أولي قيد التطوير الهندسي)",
        client: "منصة عقارية قيد التجهيز والتطوير الهندسي الداخلي",
        tag: "نموذج أولي قيد التطوير",
        category: "software",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        highlight: "نموذج أولي لمنصة عقارية ذكية تحت التطوير والتجهيز التقني الداخلي.",
        summary: "نموذج تجريبي لمنصة رقمية لإدارة وحجز الوحدات العقارية قيد التطوير الهندسي الداخلي.",
        description: "تعمل تيك بكرة على تطوير واختبار نموذج منصة 'هليو بروبرتي' داخلياً لتقييم كفاءة وتجربة المستخدم في استعراض المشروعات وجداول الأقساط قبل الإطلاق الرسمي.",
        stats: [
          { label: "حالة المنظومة", value: "قيد التطوير والاختبار" },
          { label: "المعمارية", value: "Next.js سحابية" },
          { label: "نوع المشروع", value: "نموذج أولي داخلي" },
        ],
        technologies: ["Next.js 15 App Router", "Tailwind CSS & Motion", "Vercel Edge Network", "PostgreSQL Cloud Database", "Real Estate Search Engine", "WhatsApp Instant Hook"],
        challenges: [
          "عرض المخططات الهندسية والكتالوجات العقارية فائقة الدقة دون التأثير على سرعة التحميل على الموبايل",
          "تنظيم جداول الأقساط المتغيرة وحسابات السداد وتأمين بيانات المشترين",
          "تمكين فريق المبيعات من تحديث وتخصيص حالات الوحدات لحظياً",
        ],
        solutions: [
          "الاعتماد على شبكة توزيع محتوى CDN عالمية مع تحسين تلقائي للصور والمخططات",
          "تطوير لوحة تحكم ذكية تمكن المطور والمسوق من إدارة المشروعات وجداول الدفع بسهولة",
          "ربط المنصة بنظام محادثات فوري عبر واتساب للرد على استفسارات المشترين فوراً",
        ],
        statusBadge: "قيد التطوير والتجهيز الداخلي (Prototype)",
        isUpcoming: true,
      },
      {
        id: "alrehla",
        title: "منصة الرحلة (منصة تفاعلية قيد التطوير الهندسي)",
        client: "مبادرة رقمية وتجربة مستخدم قيد التطوير التقني",
        tag: "منصة قيد التطوير",
        category: "software",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        highlight: "منصة معرفية وتفاعلية تحت التطوير والاختبار الداخلي.",
        summary: "منصة رقمية قيد التطوير والتجهيز التقني تجمع بين المحتوى والتفاعل البصري.",
        description: "تعمل تيك بكرة على تطوير ودعم البنية التحتية السحابية لمنصة 'الرحلة' قيد التطوير والاختبار، لتقييم آليات تدفق المحتوى والتفاعل الرقمي واستقرار السيرفرات.",
        stats: [
          { label: "حالة المنظومة", value: "قيد التطوير والاختبار" },
          { label: "المعمارية", value: "Next.js & TypeScript" },
          { label: "نوع المشروع", value: "منصة قيد التجهيز" },
        ],
        technologies: ["Next.js & TypeScript", "Cloud Architecture", "Interactive Story Engine", "Redis Cache", "Progressive Web App"],
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
        statusBadge: "قيد التطوير والاختبار التقني",
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
    subtitle: "كل ما تحتاج معرفته عن إجراءات التوريد، الضمانات، عقود الصيانة، والربط الرقمي.",
    items: [
      {
        q: "كيف يتم تحديد احتياجات ومواصفات المنشأة؟",
        a: "يقوم فريقنا الهندسي بدراسة متطلبات منشأتك، نوعية المبنى، والأنظمة المطلوبة (كاميرات، شبكات، بوابات) لإعداد مقترح فني وجدول كميات (BOQ) دقيق يلبي أهدافك بأفضل تكلفة.",
      },
      {
        q: "ما هي مدة الضمان على الأجهزة والكابلات؟",
        a: "نوفر أجهزة أصلية معتمدة من الوكلاء الرسميين (مثل Hikvision و Cisco و Schneider) مع ضمان رسمي يتراوح بين سنتين إلى 3 سنوات على الأجهزة، وضمان يصل إلى 15 عاماً على أعمال تمديد كابلات البنية التحتية المعتمدة.",
      },
      {
        q: "هل تدعم حلول ERP لديكم الربط مع الفاتورة الإلكترونية المصرية؟",
        a: "بالتأكيد. جميع أنظمة ERP التي نقوم بتطويرها أو تطبيقها متوافقة 100% مع معايير مصلحة الضرائب المصرية (ETA) وتتضمن الربط الفوري عبر الـ API مع منظومة الفاتورة والإيصال الإلكتروني والتوقيع الإلكتروني.",
      },
      {
        q: "ما هي مميزات عقد الصيانة السنوي (SLA) من تيك بكرة؟",
        a: "يشمل عقد الصيانة زيارات وقائية شهرية لفحص الأجهزة، تنظيف الكاميرات والسيرفرات، التحقق من النسخ الاحتياطية، مع خط ساخن للطوارئ يوفر استجابة فنية سريعة خلال 2 إلى 4 ساعات عند حدوث أي عطل مفاجئ، مع توفير أجهزة بديلة مؤقتة.",
      },
      {
        q: "هل تقدمون خدمات البرمجيات وتطبيقات الجوال من الصفر؟",
        a: "نعم، يضم فريقنا مهندسي برمجيات متخصصين في بناء تطبيقات الهواتف الذكية (iOS و Android) والمنصات السحابية وقواعد البيانات بتصميمات مخصصة تخدم هوية علامتك التجارية ومتطلبات عملائك الخاصة.",
      },
      {
        q: "هل تقدمون خدمة إعداد ملفات الاعتماد الفني (Technical Submittals) وجداول المطابقة للمقاولين؟",
        a: "نعم، نقدم خدمة متخصصة وشاملة للمقاولين والشركات تتضمن إعداد ومراجعة ملفات الاعتماد الفني للمواد (Material Submittals)، إعداد جداول المطابقة الفنية (Compliance Sheets) بنداً ببند وفق كراسات الشروط والمواصفات للمشاريع الكبرى، تجهيز المخططات التنفيذية Shop Drawings، وتقديم تقارير فحص كابلات الشبكات المعتمدة بجهاز Fluke DSX وجهاز OTDR للموافقة الاستشارية الرسمية.",
      },
      {
        q: "ما هي حلول البنية التحتية ومراكز البيانات وتجهيزات DCIM التي توفرونها؟",
        a: "نغطي كافة مراحل البنية التحتية: تمديد كابلات الشبكات النحاسية المهيكلة UTP/STP من Cat6 وحتى Cat8، مسارات Cable Trays والترانكات، لحام وتوصيل الألياف الضوئية، تجهيز مراكز البيانات (Data Center Fit-out) بكبائن السيرفرات 42U/48U، التبريد الدقيق In-Row Precision Cooling، أنظمة مراقبة البنية التحتية DCIM للتحكم في الحرارة والرطوبة والطاقة عن بعد، وتوريد مراكز البيانات المصغرة الذكية (Smart Mini Data Centers).",
      },
    ],
  },
  contact: {
    title: "طلب أو استفسار وعرض سعر",
    subtitle: "لا تترك أمن منشأتك أو كفاءة شبكتك للصدفة. تواصل مع مهندسينا ومستشارينا اليوم.",
    nameLabel: "الاسم بالكامل",
    namePlaceholder: "الاسم الكريم",
    companyLabel: "اسم الشركة / المنشأة",
    companyPlaceholder: "اسم شركتك أو جهتك",
    phoneLabel: "رقم الهاتف / الواتساب",
    phonePlaceholder: "01012345678",
    serviceLabel: "الخدمة المطلوبة",
    governorateLabel: "المحافظة / المدينة",
    notesLabel: "تفاصيل الاستفسار أو متطلبات محددة",
    notesPlaceholder: "يرجى ذكر عدد الكاميرات التقريبي أو مساحة المنشأة وأي تفاصيل تود الاستفسار عنها...",
    btnWhatsapp: "إرسال عبر واتساب",
    btnEmail: "إرسال كبريد إلكتروني",
    btnSubmitting: "جارٍ تجهيز طلبك...",
    successMessage: "تم تجهيز طلبك بنجاح! سيتم تحويلك الآن للتواصل المباشر مع فريق تيك بكرة.",
    consultantPhone: "أو اتصل مباشرة بالخط الساخن:",
    quickResponseBadge: "متوسط وقت الرد: أقل من 15 دقيقة خلال ساعات العمل الرسمية",
  },
  footer: {
    brandBio: "شريكك التقني الموثوق لتأسيس البنية التحتية، الأنظمة الأمنية، والحلول البرمجية المتكاملة لقطاع الأعمال والمنشآت.",
    servicesTitle: "حلولنا الهندسية",
    quickLinksTitle: "روابط سريعة",
    contactTitle: "تواصل معنا",
    rights: "جميع الحقوق محفوظة لـ تيك بكرة © 2026",
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
    sub: "At Tech Bokra, we engineer project-based technology solutions spanning physical security, network & data center infrastructure, specialized digital platforms, and tailored ERP systems—backed by technical submittal consultations.",
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
    title: "Engineering & Technology Solutions",
    subtitle: "Integrated technology solutions engineered for business, organized into two primary pillars: Physical Security & Infrastructure, and Digital Solutions & Software.",
    allTab: "All Solutions",
    secTab: "Physical Security & Infrastructure",
    netTab: "Infrastructure & Data Centers",
    softTab: "Digital Solutions & Software",
    erpTab: "Enterprise Apps & Custom ERP",
    consultTab: "Technical Submittals & Consulting",
    orderCta: "Inquire About this Solution",
    viewSpecs: "Technical Specs",
    list: [
      {
        id: "cctv-surveillance",
        category: "security",
        iconName: "Camera",
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
        title: "Intelligent Video Surveillance (CCTV & AI Analytics)",
        shortDesc: "Enterprise IP and 4K cameras equipped with edge AI for facial recognition, automatic license plate recognition (ANPR/LPR), and perimeter detection.",
        points: [
          "Perimeter and internal 4K coverage with Full-Color 24/7 night vision and smart optical zoom",
          "Edge AI video analytics for tripwire, perimeter intrusion, and vehicle license plate recognition (LPR)",
          "Centralized NVR storage arrays with RAID 5/6 redundancy and long-term retention up to 180 days",
          "Unified security operation centers (SOC) and secure mobile monitoring",
        ],
        specs: [
          { title: "Protocols", desc: "ONVIF Profile S/G/T, RTSP, H.265+, H.265 Smart Stream" },
          { title: "Certified Brands", desc: "Hikvision Pro, Dahua Enterprise, Uniview, Axis" },
          { title: "Warranty", desc: "2-3 Years Local Agency Warranty + Preventative SLA" },
        ],
        deliverables: ["Field-of-View & Blind Spot CAD Layouts", "Solid Pure Copper Shielded Cat6A", "Security Personnel Training"],
      },
      {
        id: "network-infrastructure",
        category: "network",
        iconName: "Network",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        title: "Infrastructure, UTP/Fiber Cabling & Data Centers",
        shortDesc: "Structured cabling (UTP/STP), single & multimode fiber backbones, data center fit-out with DCIM, and modular mini data centers.",
        points: [
          "Structured copper cabling UTP/STP/SFTP (Cat6, Cat6A, Cat7) with galvanized cable trays and conduits",
          "Single-mode and multi-mode optical fiber splicing, OTDR loss testing, and Fluke DSX certification",
          "Complete Data Center Fit-out: 42U/48U server racks, smart managed PDUs, and in-row precision cooling",
          "Data Center Infrastructure Management (DCIM) with environmental temp/humidity sensors and power tracking",
          "Smart Mini Data Centers & Modular Edge Centers for space- and power-efficient remote branch operations",
        ],
        specs: [
          { title: "Backbone Speed", desc: "10Gbps / 40Gbps / 100Gbps Throughput" },
          { title: "Cabling Brands", desc: "Schneider Electric, Legrand, Panduit, CommScope, Rittal" },
          { title: "Active Hardware", desc: "Cisco Catalyst, Aruba, Ubiquiti UniFi, MikroTik" },
        ],
        deliverables: ["As-Built Engineering Schematics", "Certified Fluke DSX Calibration Reports", "Server Rack & Cable Labeling"],
      },
      {
        id: "access-control",
        category: "security",
        iconName: "ShieldCheck",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        title: "Access Control & Smart Pedestrian/Vehicle Gates",
        shortDesc: "Enterprise access management, motorized speed gates, turnstiles, and contactless biometric attendance systems.",
        points: [
          "Dual-lens contactless facial recognition, fingerprint readers, and encrypted RFID/NFC smart cards",
          "Motorized optical speed gates and turnstiles for corporate headquarters and industrial plants",
          "Automatic boom barriers for vehicles with long-range UHF readers or ANPR camera integration",
          "Direct integration with HR attendance, shifts, and automated payroll software",
        ],
        specs: [
          { title: "Recognition Speed", desc: "< 0.2s Biometric Facial Verification" },
          { title: "Emergency Safety", desc: "Automatic fail-safe fire alarm unlock interlock" },
          { title: "Systems", desc: "ZKTeco Enterprise, Suprema, Hikvision Access Control" },
        ],
        deliverables: ["Central Management Server Setup", "Encrypted Keycards", "Live Attendance Dashboard"],
      },
      {
        id: "specialized-web-platforms",
        category: "software",
        iconName: "Layers",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        title: "Specialized Web Platforms with Complex Workflows",
        shortDesc: "High-complexity web platforms and multi-stakeholder portals managing accumulated transactional logic and large data volumes.",
        points: [
          "PropTech platforms and smart compound management portals (e.g., Helio Property portal)",
          "Interactive multi-service travel, logistics, and booking portals (e.g., Al-Rehla platform)",
          "B2B/B2C transactional portals with accumulated financial calculations and live KPI dashboards",
          "Resilient cloud architecture engineered to handle high concurrency with low latency",
        ],
        specs: [
          { title: "Tech Stack", desc: "Next.js 15, TypeScript, Node.js, PostgreSQL / MongoDB, Redis" },
          { title: "Security & APIs", desc: "TLS 1.3, Verified Payment Gateways (Fawry, Paymob, Stripe)" },
          { title: "Cloud Scale", desc: "AWS, Google Cloud, Docker Containers, CDN Edge Networks" },
        ],
        deliverables: ["Modular Scalable Codebase", "Administrative Analytics Dashboard", "Full API Documentation"],
      },
      {
        id: "enterprise-apps-erp",
        category: "erp",
        iconName: "Smartphone",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        title: "Specialized Enterprise Apps & Custom ERP",
        shortDesc: "Native mobile apps for field staff and custom ERP systems for warehousing, supply chains, and Egyptian Tax Authority e-invoicing.",
        points: [
          "Specialized iOS and Android applications for enterprise field teams and customer services (e.g., Mahyay & Helio In)",
          "Tailored ERP systems (Odoo, ERPNext, Custom Engines) for general ledger, procurement, and inventory",
          "Warehouse management and barcode/RFID item tracking synchronized with POS points of sale",
          "Direct certified API integration with the Egyptian Tax Authority (ETA) e-Invoicing & e-Receipt portal",
        ],
        specs: [
          { title: "App Platforms", desc: "Flutter, React Native, Native iOS/Android" },
          { title: "ERP Engine", desc: "Odoo Enterprise / Community, ERPNext, Tailored Modules" },
          { title: "Tax Compliance", desc: "Official direct API integration with Egyptian Tax Authority (ETA)" },
        ],
        deliverables: ["App Store & Play Store Publishing", "Customized Financial Workflow", "Comprehensive Staff Training"],
      },
      {
        id: "technical-submittals-consulting",
        category: "consulting",
        iconName: "FileCheck",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        title: "Engineering Consulting & Technical Submittals",
        shortDesc: "Material submittals, tender specifications review, shop drawings, and certified Fluke/OTDR commissioning for contractors.",
        points: [
          "Formulation and engineering review of Material Submittals and technical datasheets for low-current & IT tenders",
          "Line-by-line Compliance Sheets crafted strictly according to project tender specifications and RFPs",
          "Tender specifications & RFP analysis providing value engineering, cost optimization, and certified alternates",
          "Preparation of CAD/BIM Shop Drawings, camera optical field-of-view coverage, cable routes, and As-Built sets",
          "Structured cabling Fluke Networks DSX testing and optical fiber OTDR loss testing with official calibration reports",
          "Annual Preventative & Emergency SLA maintenance contracts with 24/7 rapid response dispatch teams",
        ],
        specs: [
          { title: "Consultant Standards", desc: "Compliant with major consultant requirements (Dar, ECG, Shaker)" },
          { title: "Testing Hardware", desc: "Fluke DSX-8000 CableAnalyzer, EXFO / Noyes OTDR" },
          { title: "SLA Response", desc: "2 to 4 hours emergency response for critical systems" },
        ],
        deliverables: ["Complete Technical Submittal Binder", "Approved Shop Drawings Sets", "Official Fluke Calibration Certificates"],
      },
    ],
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
    title: "Our Featured Projects",
    subtitle: "We pride ourselves on a proven track record of infrastructure and software achievements.",
    filterAll: "All Projects",
    filterUpcoming: "Upcoming & Sister Platforms",
    filterSecurity: "Security & CCTV",
    filterNetwork: "Networks & LC",
    filterSoftware: "Apps & Platforms",
    filterERP: "Management Systems",
    viewDetails: "View Project Details",
    closeModal: "Close",
    challengeTitle: "Engineering Challenges",
    solutionTitle: "Tech Bokra Solutions Implemented",
    techTitle: "Technologies & Hardware Deployed",
    livePreviewBtn: "Visit Live Platform",
    upcomingBadge: "In Progress - Beta Launch Soon",
    list: [
      {
        id: "emak-kharafi",
        title: "EMAK - Kharafi Group",
        client: "EMAK Contracting (Kharafi Group - General Contractor of the Project)",
        tag: "Infrastructure & Light Current",
        category: "network",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        highlight: "Engineering and equipping high-security data network infrastructure and mission-critical racks.",
        summary: "Engineering and equipping enterprise data network infrastructure for EMAK Contracting (Kharafi Group - General Contractor).",
        description: "Tech Bokra engineered and deployed the complete enterprise data network for the project under main contractor EMAK (Kharafi Group), pulling high-speed fiber optic trunklines, structured Cat6A drops, and certified high-density server enclosures with redundant power distribution and precision cooling.",
        stats: [
          { label: "Network Drops", value: "+350 Points" },
          { label: "Fiber Trunk", value: "Multi-Gigabit" },
          { label: "Operational Reliability", value: "100%" },
        ],
        technologies: ["Cisco Catalyst Managed Switches", "Schneider Cat6A Structured Cabling", "Fiber Optic Backbone", "Fluke DSX Certified"],
        challenges: [
          "Deploying enterprise-grade infrastructure adhering to rigorous general contractor engineering standards",
          "Strict data compartmentalization and physical/logical security mandates",
          "Synchronizing conduit runs with simultaneous MEP (Mechanical, Electrical, Plumbing) works",
        ],
        solutions: [
          "Heavy-duty galvanized EMT conduits adhering strictly to international low-current standards",
          "Isolated VLAN partitioning fortified with modern enterprise firewalls",
          "Rigorous Fluke DSX testing with certified diagnostic reports for every single network drop and As-Built handover",
        ],
      },
      {
        id: "hacienda-ras-sedr",
        title: "Hacienda Ras Sedr",
        client: "Hacienda Village - Ras Sedr",
        tag: "CCTV Systems",
        category: "security",
        icon: "ShieldAlert",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        highlight: "Comprehensive security coverage by supplying and installing the latest surveillance cameras.",
        summary: "Comprehensive security coverage by supplying and installing the latest surveillance cameras.",
        description: "Given the vast coastal perimeter, Tech Bokra deployed marine-grade anti-corrosion (IP67/IK10) surveillance hardware, interconnecting remote chalets, security gates, and beach zones wirelessly without destructive deep trenching.",
        stats: [
          { label: "IP Cameras", value: "+120 IP Nodes" },
          { label: "Wireless Links", value: "5GHz Point-to-Multipoint" },
          { label: "Perimeter Coverage", value: "360° Total Coverage" },
        ],
        technologies: ["Hikvision DarkFighter & ColorVu 4K", "Ubiquiti AirMax Wireless Bridge", "Solar-Powered Surveillance Poles", "Milestone VMS"],
        challenges: [
          "Harsh coastal humidity and salt-spray winds rapidly degrading conventional hardware",
          "Prohibitive civil trenching costs between scattered chalets and recreational areas",
          "Requirement for crystal-clear night vision across pitch-dark beach zones",
        ],
        solutions: [
          "Treated marine-grade aluminum housing rated IP67 for extreme saline resistance",
          "Ultra-reliable 5GHz wireless bridges establishing high-bandwidth video backhauls",
          "ColorVu warm-illumination optics delivering vivid full-color night footage",
        ],
      },
      {
        id: "mahyay-app",
        title: "Mahyay App",
        client: "Mahyay Platform",
        tag: "Mobile App",
        category: "software",
        icon: "Smartphone",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
        highlight: "An application available on Google Play designed to provide quality services.",
        summary: "An application available on Google Play designed to provide quality services.",
        description: "Tech Bokra built the cross-platform application from scratch with an auto-scaling cloud microservices architecture handling thousands of simultaneous users.",
        stats: [
          { label: "Store Rating", value: "4.8 / 5" },
          { label: "API Latency", value: "< 120ms" },
          { label: "Cloud Uptime", value: "99.95%" },
        ],
        technologies: ["Flutter SDK", "Node.js & TypeScript Backend", "PostgreSQL & Redis Cache", "Google Cloud Platform", "Paymob Gateway"],
        challenges: [
          "Ensuring buttery-smooth performance across diverse budget Android handsets and iPhones",
          "Securing payment sessions and user biometric logins with strict encryption",
          "Geo-targeted instant push notifications dispatched within sub-second thresholds",
        ],
        solutions: [
          "Flutter framework coupled with streamlined state management minimizing memory footprint",
          "Stateless microservices architecture shielded with JWT tokens and Cloudflare DDoS protection",
          "Deep Firebase Cloud Messaging integration enabling granular segmented messaging",
        ],
      },
      {
        id: "helio-in",
        title: "Helio In App",
        client: "New Heliopolis Community",
        tag: "Community App",
        category: "software",
        icon: "Home",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
        highlight: "An integrated service platform for residents and workers of New Heliopolis.",
        summary: "An integrated service platform for residents and workers of New Heliopolis.",
        description: "The platform functions as the digital pulse of the community, enabling residents to submit maintenance tickets, pay bills, access a verified local directory, and communicate directly with property management.",
        stats: [
          { label: "Active Residents", value: "+8,000" },
          { label: "Maintenance Tickets", value: "+14,000" },
          { label: "Resident Satisfaction", value: "94%" },
        ],
        technologies: ["React Native", "Next.js Admin Dashboard", "MongoDB Enterprise", "WebSockets Real-time Chat", "Amazon S3"],
        challenges: [
          "Coordinating four distinct stakeholder personas (residents, technicians, service partners, management)",
          "Live GPS tracking for service crews dispatched across city zones",
          "Preventing unauthorized accounts and maintaining a strictly gated community database",
        ],
        solutions: [
          "Engineered three specialized interfaces (Resident App, Tech Dispatch App, Super Admin Web Console)",
          "Real-time GPS tracking with WebSockets notifying residents upon technician arrival",
          "Title-deed and national ID algorithmic verification securing resident onboarding",
        ],
      },
      {
        id: "eelaf-kpi",
        title: "EELAF-KPI System",
        client: "Eelaf Investment Group",
        tag: "Management System",
        category: "erp",
        icon: "BarChart3",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        highlight: "An advanced dashboard for tracking and analyzing performance indicators.",
        summary: "An advanced dashboard for tracking and analyzing performance indicators.",
        description: "Tech Bokra created EELAF-KPI to empower leadership with actionable clarity, eradicating chaotic spreadsheets in favor of automated trend graphs, budget variance warnings, and predictive metrics.",
        stats: [
          { label: "Reporting Time Saved", value: "70%" },
          { label: "Ledger Reconciliation", value: "99.8%" },
          { label: "Monitored Metrics", value: "+45 KPIs" },
        ],
        technologies: ["Custom ERP Engine", "Python Fast API", "Apache Kafka Data Pipeline", "Tailwind CSS Dashboards", "Automated PDF Exporter"],
        challenges: [
          "Data fragmentation scattered across siloed legacy software and Excel spreadsheets",
          "Costly multi-day reporting delays after monthly accounting closures",
          "Difficulty monitoring multi-branch productivity in real time",
        ],
        solutions: [
          "Constructed an automated ETL pipeline that normalizes data from all branches hourly",
          "Interactive browser dashboards with predictive machine learning forecasting",
          "Strict Role-Based Access Control (RBAC) ensuring divisional managers only see authorized parameters",
        ],
      },
      {
        id: "industrial-smart-security",
        title: "Al-Fahd Industrial Complex",
        client: "Al-Fahd Engineering Industries",
        tag: "Low-Current & Thermal CCTV",
        category: "security",
        icon: "Cpu",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        highlight: "Thermal early fire detection and automated RFID boom barriers for industrial logistics.",
        summary: "Comprehensive perimeter shielding with bi-spectrum thermal cameras and automated logistics gate dispatching.",
        description: "Tech Bokra supplied and installed thermal cameras for real-time temperature tracking across raw material depots, coupled with high-speed automated hydraulic boom barriers integrated with dispatch ERP software.",
        stats: [
          { label: "Early Hazard Alerts", value: "3 Fires Prevented" },
          { label: "Truck Gate Clearance", value: "From 5 mins to 15s" },
          { label: "Industrial Area", value: "25,000 m²" },
        ],
        technologies: ["Hikvision Thermography Cameras", "Long-Range UHF RFID Gate", "Automatic Number Plate Recognition (ANPR)", "Schneider Industrial Enclosures"],
        challenges: [
          "Harsh factory environment with heavy ambient dust, mechanical vibrations, and high temperatures",
          "Truck congestion blocking delivery schedules at main facility gates",
          "High fire hazards in sensitive raw chemical storage zones requiring sub-smoke detection",
        ],
        solutions: [
          "NEMA 4X / IP66 climate-controlled industrial enclosures protecting all network switches",
          "Bi-spectrum thermal optics triggering audio-visual warnings the moment heat exceeds 60°C",
          "Automated UHF RFID tags reading truck manifests and raising hydraulic gates in 15 seconds",
        ],
      },
      {
        id: "helio-property",
        title: "Helio Property Platform (In-Development Engineering Prototype)",
        client: "PropTech Platform (Internal Prototype in Development)",
        tag: "In-Development Prototype",
        category: "software",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        highlight: "An interactive PropTech prototype currently under active internal engineering and testing.",
        summary: "An interactive prototype engineered for real estate listing, unit discovery, and installment plan tracking.",
        description: "Tech Bokra is developing and testing the 'Helio Property' platform prototype internally to evaluate usability, geo-search performance, and installment workflows prior to public launch.",
        stats: [
          { label: "Platform Status", value: "Active Testing" },
          { label: "Architecture", value: "Cloud Next.js" },
          { label: "Project Nature", value: "Internal Prototype" },
        ],
        technologies: ["Next.js 15 App Router", "Tailwind CSS & Motion", "Vercel Edge Network", "PostgreSQL Cloud Database", "Real Estate Search Engine", "WhatsApp Instant Hook"],
        challenges: [
          "Rendering high-res architectural plans and floor layouts with zero mobile latency",
          "Managing flexible installment schedules and securing prospective buyer data",
          "Empowering sales agents with real-time unit status updates (Available, Reserved, Sold)",
        ],
        solutions: [
          "Optimized responsive CDN delivery for immediate high-definition property asset loading",
          "Engineered an intuitive control dashboard for instant unit and pricing updates",
          "Instant WhatsApp & Email webhooks bridging client inquiries directly to sales reps",
        ],
        statusBadge: "Internal Prototype in Progress (Beta)",
        isUpcoming: true,
      },
      {
        id: "alrehla",
        title: "Al-Rehla Platform (In-Development Interactive Platform)",
        client: "Digital Initiative (Internal Platform in Progress)",
        tag: "In-Development Platform",
        category: "software",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        highlight: "An interactive digital knowledge and media platform under active internal development.",
        summary: "A digital storytelling platform combining structured content and fluid interaction design.",
        description: "Tech Bokra supports the cloud infrastructure and interface engineering for the 'Al-Rehla' platform under active technical testing and iteration.",
        stats: [
          { label: "Platform Status", value: "Development & QA" },
          { label: "Architecture", value: "Next.js & TypeScript" },
          { label: "Project Nature", value: "In-Progress Platform" },
        ],
        technologies: ["Next.js & TypeScript", "Cloud Architecture", "Interactive Story Engine", "Redis Cache", "Progressive Web App"],
        challenges: [
          "Delivering immersive interactive experiences without compromising response speeds",
          "Managing media content pipelines while safeguarding user privacy and data",
          "Cross-device responsiveness with full RTL and LTR support",
        ],
        solutions: [
          "Fast, lightweight API caching ensuring immediate page interactions",
          "Scalable cloud cluster capable of handling traffic spikes seamlessly",
          "Bespoke visual typography and elegant layout fostering engagement",
        ],
        statusBadge: "Platform Under Active Development",
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
    subtitle: "Everything you need to know about our warranties, inquiry procedures, SLA contracts, and systems integration.",
    items: [
      {
        q: "How are facility needs and technical specifications determined?",
        a: "Our engineering team studies your facility requirements, architectural layout, and requested systems (CCTV, networking, gates) to prepare a tailored technical proposal and detailed Bill of Quantities (BOQ).",
      },
      {
        q: "What warranties do you provide on hardware and structured cabling?",
        a: "We only supply 100% genuine hardware backed by official authorized Egyptian agents (Hikvision, Cisco, Schneider, etc.) with 2 to 3 years hardware warranty, and up to 15 years warranty on certified structured cabling installations.",
      },
      {
        q: "Do your ERP systems integrate with the Egyptian Tax Authority e-Invoicing?",
        a: "Absolutely. All ERP solutions we deploy are 100% compliant with ETA (Egyptian Tax Authority) standards, providing native REST API connections for electronic invoices, receipts, and digital signature tokens.",
      },
      {
        q: "What does Tech Bokra's annual SLA maintenance contract cover?",
        a: "Our SLA includes scheduled monthly preventative visits (cleaning lenses, checking UPS batteries, firmware updates, cable integrity), plus a dedicated emergency hotline ensuring our technical crew arrives within 2 to 4 hours with standby loaner units.",
      },
      {
        q: "Can Tech Bokra build custom mobile apps and platforms from scratch?",
        a: "Yes. Our in-house software engineering team designs and develops native and cross-platform apps (iOS & Android) with custom backends, real-time tracking, payment gateways, and high-security architectures tailored to your brand.",
      },
      {
        q: "Do you formulate and review Technical Submittals & Compliance Sheets for contractors?",
        a: "Yes. We offer an end-to-end technical engineering service for contractors and developers: formulation of Material Submittals, manufacturer datasheets, line-by-line Compliance Sheets crafted strictly according to tender RFP specifications, CAD Shop Drawings, and certified Fluke DSX/OTDR cable testing reports for consultant approval.",
      },
      {
        q: "What structured cabling, data center, and DCIM infrastructure services do you deliver?",
        a: "We cover complete turnkey infrastructure: Cat6 through Cat8 UTP/STP structured cabling, galvanized cable trays and conduits, optical fiber splicing, Data Center fit-out with 42U/48U racks, In-Row precision cooling, intelligent DCIM environmental and power monitoring, and modular smart mini data centers for remote branches.",
      },
    ],
  },
  contact: {
    title: "Request an Inquiry & Quote",
    subtitle: "Don't leave your facility's security or network efficiency to chance. Contact our engineers today.",
    nameLabel: "Full Name",
    namePlaceholder: "Your full name",
    companyLabel: "Company / Facility Name",
    companyPlaceholder: "Your company name",
    phoneLabel: "Phone / WhatsApp Number",
    phonePlaceholder: "+20 101 234 5678",
    serviceLabel: "Required Service",
    governorateLabel: "City / Governorate",
    notesLabel: "Inquiry Details or Specific Requirements",
    notesPlaceholder: "Estimated camera count, facility area, special requirements...",
    btnWhatsapp: "Send via WhatsApp",
    btnEmail: "Send via Email",
    btnSubmitting: "Preparing your inquiry...",
    successMessage: "Your inquiry is ready! Connecting you directly with our senior engineer...",
    consultantPhone: "Or speak directly to our hotline:",
    quickResponseBadge: "Average response time: Under 15 minutes during business hours",
  },
  footer: {
    brandBio: "Your reliable tech partner for infrastructure, security systems, and enterprise software solutions.",
    servicesTitle: "Solutions",
    quickLinksTitle: "Quick Links",
    contactTitle: "Contact Us",
    rights: "All Rights Reserved to Tech Bokra © 2026",
    taxId: "CR: 194022 • Tax ID: 682-901-443",
    addressVal: "Nasr City, Cairo, Egypt",
  },
};
