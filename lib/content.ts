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
    services: "حلولنا التقنية",
    projects: "مشاريعنا وقصص النجاح",
    architecture: "الهندسة المتكاملة",
    estimator: "حاسبة التكلفة",
    process: "آلية العمل",
    faq: "الأسئلة الشائعة",
    contact: "طلب أو استفسار",
    surveyCta: "طلب أو استفسار",
  },
  hero: {
    badge: "شريكك التقني الموثوق للأنظمة الأمنية والشبكات في مصر",
    titleLine1: "نبتكر الحلول الأمنية والتقنية",
    titleLine2: "لتأمين وتسريع نمو أعمالك.",
    sub: "في \"تيك بكرة\" ندمج بين أحدث أنظمة المراقبة الذكية، البنية التحتية للألياف الضوئية والشبكات، وبرمجيات ERP وتطبيقات الجوال لنمنح منشأتك استقراراً تاماً وبيئة تشغيلية آمنة وجاهزة للمستقبل.",
    btnEstimate: "تخطيط وحساب تكلفة المشروع",
    btnContact: "تحدث مع مستشار تقني",
    engineerOnline: "مهندسون واستشاريون جاهزون للرد على استفسارك",
    cardTitle: "مركز التحكم والعمليات الموحد",
    cardSubtitle: "مراقبة شبكية وأمنية ذكية في الوقت الفعلي",
    guarantee1: "استشارة فنية متخصصة",
    guarantee2: "أجهزة أصلية بضمان رسمي",
    guarantee3: "دعم فني واستجابة 24/7",
  },
  stats: {
    stat1Val: "+15",
    stat1Label: "عاماً من الخبرة الهندسية",
    stat1Desc: "خبرة متراكمة في كبرى المنشآت",
    stat2Val: "+50",
    stat2Label: "مشروع بنية تحتية ومؤسسي",
    stat2Desc: "جهات حكومية وقرى وشركات رائدة",
    stat3Val: "+1,200",
    stat3Label: "نظام مراقبة ونقطة شبكة",
    stat3Desc: "كاميرات IP وسويتشات وراكات عاملة",
    stat4Val: "99.9%",
    stat4Label: "موثوقية التشغيل وعقود SLA",
    stat4Desc: "استجابة فنية سريعة وتواصل فوري",
  },
  services: {
    title: "حلولنا وخدماتنا الهندسية المتكاملة",
    subtitle: "نقدم طيفاً واسعاً من الحلول الهندسية والبرمجية المصممة خصيصاً لرفع كفاءة وأمان منشأتك.",
    allTab: "كافة الخدمات",
    secTab: "أنظمة أمنية وتيار خفيف",
    netTab: "بنية تحتية وشبكات",
    softTab: "برمجيات وتطبيقات",
    erpTab: "أنظمة ERP واستشارات",
    orderCta: "طلب أو استفسار عن هذه الخدمة",
    viewSpecs: "المواصفات الفنية",
    list: [
      {
        id: "cctv-surveillance",
        category: "security",
        iconName: "Camera",
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
        title: "أنظمة المراقبة الذكية (CCTV & AI Video)",
        shortDesc: "كاميرات مراقبة رقمية فائقة الدقة (IP & 4K) مزودة بتقنيات الذكاء الاصطناعي للتعرف على الوجوه، اللوحات، وتحليل الحركة المحيطية.",
        points: [
          "تغطية محيطية وداخلية بدقة 4K مع رؤية ليلية ملونة Full-Color",
          "تحليل فيديو ذكي لكشف التسلل والتعرف على لوحات السيارات (ANPR)",
          "أجهزة تسجيل شبكية NVR مركزية مع مصفوفة تخزين RAID وتكرار النسخ الاحتياطي",
          "غرف مراقبة موحدة وإمكانية المتابعة الآمنة عن بُعد عبر تطبيقات الجوال",
        ],
        specs: [
          { title: "البروتوكولات", desc: "ONVIF Profile S/G/T, RTSP, H.265+ Compression" },
          { title: "العلامات المعتمدة", desc: "Hikvision Pro, Dahua Enterprise, Uniview, Axis" },
          { title: "الضمان", desc: "ضمان وكيل محلي 2 إلى 3 سنوات مع عقد صيانة وقائي" },
        ],
        deliverables: ["مخطط توزيـع زوايا الرؤية", "كابلات نحاسية Cat6A نقية محمية", "تدريب فريق الأمن الداخلي"],
      },
      {
        id: "network-infrastructure",
        category: "network",
        iconName: "Network",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        title: "البنية التحتية للشبكات والألياف الضوئية",
        shortDesc: "تصميم وتنفيذ شبكات البيانات والاتصالات المنظمة (Structured Cabling)، مسارات الفايبر، وحجرات السيرفرات المتطورة.",
        points: [
          "تمديد ولحام كابلات الألياف الضوئية (Fiber Optic Single/Multi-mode)",
          "تأسيس شبكات الكابلات المهيكلة Cat6/Cat6A/Cat7 مع قنوات وترانكات معزولة",
          "توريد وتنظيم كبائن وسيرفر راك (Server Racks 42U/24U) مع أنظمة PDU و Cable Management",
          "شبكات واي فاي للمنشآت (Enterprise Mesh Wi-Fi 6/7) ذات تغطية وسعة استيعاب ضخمة",
        ],
        specs: [
          { title: "سرعات النقل", desc: "10Gbps / 40Gbps Backbone Throughput" },
          { title: "ماركات الكابلات", desc: "Schneider, Legrand, Panduit, CommScope" },
          { title: "أجهزة الشبكة", desc: "Cisco Catalyst, Aruba, Ubiquiti UniFi, MikroTik" },
        ],
        deliverables: ["خرائط As-Built دقيقة", "شهادات اختبار Fluke Test لكل نقطة", "ترقيم وتنظيم الكبائن"],
      },
      {
        id: "access-control",
        category: "security",
        iconName: "ShieldCheck",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        title: "أنظمة التحكم بالدخول والبوابات الذكية",
        shortDesc: "حلول إدارة صلاحيات الدخول، بوابات التفتيش والمرور الدوارة (Turnstiles)، وأنظمة الحضور والانصراف البيومترية.",
        points: [
          "أجهزة بصمة الوجه، الأصابع، والكروت الذكية RFID / NFC بدون لمس",
          "بوابات أفراد أوتوماتيكية وزجاجية (Flap Barriers & Turnstiles) للشركات والمصانع",
          "بوابات سيارات آلية (Boom Barriers) مع قارئات المدى البعيد UHF أو كاميرات LPR",
          "ربط فوري ومباشر مع أنظمة الموارد البشرية (HR) وحساب الأجور والرواتب",
        ],
        specs: [
          { title: "زمن الاستجابة", desc: "أقل من 0.2 ثانية للتعرف على الوجه" },
          { title: "حماية الطوارئ", desc: "فتح تلقائي عند إشارات إنذار الحريق (Fire Interlock)" },
          { title: "الأنظمة", desc: "ZKTeco Enterprise, Suprema, Hikvision Access" },
        ],
        deliverables: ["سيرفر إدارة مركزي للصلاحيات", "كروت وبطاقات مشفرة", "تقارير الحضور اللحظية"],
      },
      {
        id: "custom-software-apps",
        category: "software",
        iconName: "Smartphone",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
        title: "تطبيقات الجوال والمنصات السحابية",
        shortDesc: "بناء تطبيقات الهواتف الذكية (iOS & Android) ولوحات التحكم السحابية المتقدمة لرقمنة الخدمات وخدمة العملاء.",
        points: [
          "تطبيقات خدمات مجتمعية وإدارة مجمعات سكنية وتجارية (مثل Helio In)",
          "تطبيقات خدمات واستشارات ومنصات حجز متخصصة (مثل تطبيق محياي)",
          "واجهات تفاعلية سريعة بأحدث أطر العمل (Flutter, React Native, Next.js)",
          "ربط بوابات الدفع الإلكتروني المحلية والدولية (Fawry, Paymob, Stripe)",
        ],
        specs: [
          { title: "المنصات", desc: "iOS (App Store) & Android (Google Play) & Web" },
          { title: "الحماية", desc: "تشفير AES-256، حماية البيانات والتوثيق الثنائي OTP" },
          { title: "السحابة", desc: "Google Cloud, AWS, Hostinger Cloud, Docker" },
        ],
        deliverables: ["كود مصدري منظم", "نشر معتمد على المتاجر", "لوحة تحكم إدارية كاملة"],
      },
      {
        id: "erp-automation",
        category: "erp",
        iconName: "Layers",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        title: "أنظمة ERP وتخطيط الموارد المتقدمة",
        shortDesc: "تطبيق وتخصيص أنظمة Odoo و ERPNext لإدارة المبيعات، المخازن، الحسابات، والربط مع منظومة الفاتورة الإلكترونية المصرية.",
        points: [
          "إدارة المستودعات ونقاط البيع POS وتتبع المخزون بالباركود و RFID",
          "الربط القانوني المعتمد مع منظومة الفاتورة والإيصال الإلكتروني لمصلحة الضرائب المصرية (ETA)",
          "نظام إدارة الموارد البشرية وشؤون الموظفين والرواتب المتوافق مع قانون العمل",
          "لوحات بيانات تنفيذية لمتابعة الأرباح والتدفقات النقدية والـ KPIs في شاشة واحدة",
        ],
        specs: [
          { title: "النظام الأساسي", desc: "Odoo Enterprise / Community, ERPNext, Custom Modules" },
          { title: "الضرائب المصرية", desc: "تكامل مباشر عبر API مع بوابة مصلحة الضرائب المصرية" },
          { title: "الاستضافة", desc: "سيرفرات محلية آمنة On-Premises أو سحابية مشفرة" },
        ],
        deliverables: ["تهيئة وتخصيص الدورة المحاسبية", "هجرة ونقل البيانات السابقة", "تدريب الموظفين"],
      },
      {
        id: "consulting-sla",
        category: "erp",
        iconName: "Headphones",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        title: "الاستشارات الفنية وعقود الصيانة السنوية (SLA)",
        shortDesc: "إشراف هندسي، اختبارات أمنية دورية، وعقود دعم وصيانة فورية تضمن استمرارية أعمالك بلا توقف.",
        points: [
          "زيارات وقائية مجدولة لفحص السيرفرات، الكاميرات، ونظافة الكبائن والتبريد",
          "خط ساخن وفريق طوارئ ميداني للاستجابة للأعطال خلال وقت قياسي",
          "توفير قطع غيار وأجهزة بديلة فورية لمنع تعطل المنشأة",
          "مراجعة دورية للأمن السيبراني والنسخ الاحتياطي للبيانات ضد الفقدان",
        ],
        specs: [
          { title: "سرعة الاستجابة", desc: "خلال 2 إلى 4 ساعات للحالات الحرجة" },
          { title: "التغطية", desc: "القاهرة الكبرى، المدن الجديدة، والمحافظات" },
          { title: "التقارير", desc: "تقرير فني شهري شامل لحالة كافة الأنظمة" },
        ],
        deliverables: ["عقد SLA قانوني موثق", "سجل زيارات وتذاكر رقمي", "قطع غيار أصلية"],
      },
    ],
  },
  architecture: {
    title: "الهندسة المتكاملة للبنية التحتية",
    subtitle: "كيف نربط بين الأجهزة الميدانية والشبكات والأنظمة السحابية في نسق رقمي واحد ومحمي.",
    badge: "معمارية هندسية موحدة",
    coreBadge: "مركز التحكم والعمليات",
    tip: "اضغط على أي مكوّن في المخطط لاستعراض معايير الربط والأمان الهندسية.",
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
        title: "منصة هليو بروبرتي العقارية (Helio Property)",
        client: "شركة هليو بروبرتي للتطوير والاستثمار العقاري",
        tag: "منصة عقارية PropTech",
        category: "software",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        highlight: "منصة عقارية ذكية متخصصة في المشروعات والوحدات العقارية بمدينة هليوبوليس الجديدة والمناطق العمرانية الحديثة.",
        summary: "منصة متكاملة لاستكشاف المشروعات العقارية، حجز الوحدات، وإدارة المبيعات وجداول الأقساط بدقة ومرونة.",
        description: "تقوم تيك بكرة بتطوير وتجهيز منصة 'هليو بروبرتي' بأحدث تقنيات Next.js السحابية لتكون الواجهة الرقمية الأبرز لخدمة السوق العقاري في هليوبوليس الجديدة والمناطق العمرانية، مع محرك بحث جغرافي ذكي، إدارة العقود، وجداول الأقساط المرنة، وتجربة تصفح سريعة وتفاعلية.",
        stats: [
          { label: "الوحدات والمشروعات", value: "+500 وحدة" },
          { label: "حالة الجاهزية", value: "90% قرب الإطلاق" },
          { label: "سرعة التحميل", value: "0.2 ثانية" },
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
        liveUrl: "https://helio-property.vercel.app/",
        statusBadge: "قيد التجهيز - الإطلاق التجريبي",
        isUpcoming: true,
      },
      {
        id: "alrehla",
        title: "منصة وتطبيق الرحلة (Al-Rehla)",
        client: "مؤسسة ومنصة الرحلة (alrehla.org)",
        tag: "منصة رقمية وتطبيق تفاعلي",
        category: "software",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        highlight: "منصة معرفية وتفاعلية متطورة تقدم تجربة مستخدم نوعية للرحلات والتفاعل الاجتماعي والمحتوى المبتكر.",
        summary: "منصة رقمية تجمع بين عمق المحتوى، التفاعل البصري، وتجربة المستخدم الحديثة المبنية وفق معايير عالمية.",
        description: "تعمل تيك بكرة على دعم وتطوير البنية التقنية لمنصة 'الرحلة' (alrehla.org)، موفرة حلول استضافة وتطوير سحابي عالية الاعتمادية، مع واجهات مستخدم مخصصة تعتمد على السلاسة الحركية، وأنظمة تفاعل ومعالجة بيانات تضمن استقرار المنظومة لمئات الآلاف من الزيارات.",
        stats: [
          { label: "الزيارات والتفاعل", value: "+25,000" },
          { label: "جاهزية السيرفرات", value: "99.9% Uptime" },
          { label: "تقييم التجربة", value: "4.9 / 5" },
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
        liveUrl: "https://www.alrehla.org/",
        statusBadge: "مشروع نشط - تحديثات مستمرة",
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
    title: "شركاء التكنولوجيا والعلامات العالمية المعتمدة",
    subtitle: "نعتمد على توريد أرقى الماركات العالمية لضمان أعلى اعتمادية واستقرار لمنشأتك على المدى الطويل.",
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
    services: "Solutions",
    projects: "Projects",
    architecture: "Architecture",
    estimator: "Cost Estimator",
    process: "Process",
    faq: "FAQ",
    contact: "Inquiry & Contact",
    surveyCta: "Inquiry & Contact",
  },
  hero: {
    badge: "Certified Engineering Partner for Smart Security & Infrastructure in Egypt",
    titleLine1: "Innovating Security & Tech Solutions",
    titleLine2: "For Your Growth.",
    sub: "At Tech Bokra, we integrate advanced surveillance, networking, and smart ERP solutions to provide your enterprise with a secure and scalable environment.",
    btnEstimate: "Configure Project & Scope",
    btnContact: "Consult an Expert",
    engineerOnline: "Certified Consultants Ready to Assist You",
    cardTitle: "Unified Command & Control Center",
    cardSubtitle: "Real-time intelligent network and security telemetry",
    guarantee1: "Specialized Tech Consultation",
    guarantee2: "Genuine Certified Equipment",
    guarantee3: "24/7 SLA Tech Support",
  },
  stats: {
    stat1Val: "+15",
    stat1Label: "Years of Experience",
    stat1Desc: "Field-tested expertise in mission-critical facilities",
    stat2Val: "+50",
    stat2Label: "Infrastructure Projects",
    stat2Desc: "Government ministries, resorts & industrial leaders",
    stat3Val: "+1,200",
    stat3Label: "Systems & Cameras",
    stat3Desc: "High-definition IP cameras, switches & server racks",
    stat4Val: "99.9%",
    stat4Label: "Reliability & SLA",
    stat4Desc: "Fast response emergency tech support & rapid consult",
  },
  services: {
    title: "Our Integrated Solutions",
    subtitle: "We offer a wide range of engineering and software solutions tailored for your business.",
    allTab: "All Solutions",
    secTab: "Security & Low Current",
    netTab: "Network Infrastructure",
    softTab: "Software & Mobile Apps",
    erpTab: "ERP & Automation",
    orderCta: "Inquire About this Solution",
    viewSpecs: "Technical Specs",
    list: [
      {
        id: "cctv-surveillance",
        category: "security",
        iconName: "Camera",
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
        title: "Security & Low Current Systems",
        shortDesc: "Smart CCTV networks (IP & 4K) equipped with AI video analytics for perimeter intrusion detection, license plate recognition (LPR), and facial identification.",
        points: [
          "Smart CCTV networks with 4K clarity",
          "Perimeter AI intrusion detection & license plate recognition",
          "Centralized NVR storage arrays with RAID redundancy",
          "Unified security control rooms and secure remote mobile monitoring",
        ],
        specs: [
          { title: "Protocols", desc: "ONVIF Profile S/G/T, RTSP, H.265+ Compression" },
          { title: "Certified Brands", desc: "Hikvision Pro, Dahua Enterprise, Uniview, Axis" },
          { title: "Warranty", desc: "2-3 Years Local Agency Warranty + Preventative SLA" },
        ],
        deliverables: ["Field of View CAD Layouts", "Solid Pure Copper Shielded Cat6A", "Security Personnel Training"],
      },
      {
        id: "network-infrastructure",
        category: "network",
        iconName: "Network",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        title: "Networking & Communications Infrastructure",
        shortDesc: "Structured cabling architectures, high-speed single/multi-mode fiber optics, high-density server rack setups, and enterprise Wi-Fi.",
        points: [
          "Splicing and testing single-mode and multi-mode fiber optic backbones",
          "Structured Cat6/Cat6A/Cat7 cabling with conduits and certified patch panels",
          "Server rack supply (42U/24U) complete with managed PDUs and cable managers",
          "Enterprise Mesh Wi-Fi 6/7 setups capable of high concurrent capacity",
        ],
        specs: [
          { title: "Backbone Speed", desc: "10Gbps / 40Gbps Throughput" },
          { title: "Cabling Brands", desc: "Schneider Electric, Legrand, Panduit, CommScope" },
          { title: "Active Hardware", desc: "Cisco Catalyst, Aruba, Ubiquiti UniFi, MikroTik" },
        ],
        deliverables: ["As-Built Engineering Schematics", "Certified Fluke DSX Test Reports", "Labeled Rack & Cable Diagrams"],
      },
      {
        id: "access-control",
        category: "security",
        iconName: "ShieldCheck",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        title: "Access Control & Biometric Systems",
        shortDesc: "Enterprise access management, motorized speed gates, turnstiles, and contactless biometric attendance systems.",
        points: [
          "Contactless facial recognition, fingerprint, and RFID/NFC smart cards",
          "Motorized optical turnstiles and flap barriers for corporate offices and factories",
          "Automatic boom barriers for vehicles with long-range UHF readers or ANPR",
          "Direct synchronization with HR and automated payroll systems",
        ],
        specs: [
          { title: "Recognition Speed", desc: "< 0.2s Facial Recognition" },
          { title: "Emergency Safety", desc: "Automatic fail-safe fire alarm unlock interlock" },
          { title: "Systems", desc: "ZKTeco Enterprise, Suprema, Hikvision Access Control" },
        ],
        deliverables: ["Central Management Server Setup", "Encrypted Keycards", "Live Attendance Dashboard"],
      },
      {
        id: "custom-software-apps",
        category: "software",
        iconName: "Smartphone",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
        title: "Software & Mobile Apps",
        shortDesc: "Cross-platform mobile applications (iOS & Android) and high-performance cloud admin consoles built with modern frameworks.",
        points: [
          "Mobile Apps (iOS & Android) with high responsiveness",
          "Smart community and compound management mobile apps (e.g., Helio In)",
          "Specialized booking and lifestyle on-demand service platforms (e.g., Mahyay)",
          "Seamless payment gateway integration with Fawry, Paymob, and Stripe",
        ],
        specs: [
          { title: "Platforms", desc: "iOS (App Store) & Android (Google Play) & Web Portals" },
          { title: "Security", desc: "AES-256 Encryption, OTP Multi-Factor Authentication" },
          { title: "Cloud Stacks", desc: "Google Cloud, AWS, Docker Containers, PostgreSQL" },
        ],
        deliverables: ["Clean Documented Source Code", "Store Publication Approval", "Central Admin Console"],
      },
      {
        id: "erp-automation",
        category: "erp",
        iconName: "Layers",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        title: "ERP Systems & Business Consulting",
        shortDesc: "Implementation and customization of Odoo and ERPNext for sales, warehousing, accounting, and official Egyptian Tax Authority integration.",
        points: [
          "ERP & Resource Planning (ERP & Odoo)",
          "Direct API compliance with Egyptian Tax Authority (ETA) e-Invoicing",
          "HR and payroll module tailored strictly to Egyptian labor laws",
          "C-suite executive dashboards delivering real-time revenue and KPI visualizers",
        ],
        specs: [
          { title: "Platform", desc: "Odoo Enterprise / Community, ERPNext, Custom APIs" },
          { title: "Egyptian Tax (ETA)", desc: "Direct API integration with electronic signature tokens" },
          { title: "Hosting", desc: "Secure On-Premises Servers or Encrypted Cloud" },
        ],
        deliverables: ["Customized Accounting Workflow", "Legacy Data Migration", "Comprehensive Staff Training"],
      },
      {
        id: "consulting-sla",
        category: "erp",
        iconName: "Headphones",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        title: "Business Consulting & SLA Maintenance",
        shortDesc: "Digital transformation strategies, process automation, and emergency SLA support to safeguard your operations 24/7.",
        points: [
          "Digital transformation strategies and operational process automation",
          "Scheduled monthly preventative checkups covering all equipment",
          "24/7 emergency dispatch hotline guaranteeing critical fault arrival within 2-4 hours",
          "Immediate cold-standby hardware replacement to eliminate business downtime",
        ],
        specs: [
          { title: "SLA Response Time", desc: "2 to 4 hours for priority critical incidents" },
          { title: "Coverage Area", desc: "Greater Cairo, New Cities, and Key Egyptian Governorates" },
          { title: "Reports", desc: "Detailed monthly health audit report for all systems" },
        ],
        deliverables: ["Formal Legally-Binding SLA", "Digital Support Ticket Portal", "Certified Spare Units"],
      },
    ],
  },
  architecture: {
    title: "Unified Technology Architecture",
    subtitle: "How we interconnect edge hardware, high-speed networks, and cloud ERP systems into one resilient ecosystem.",
    badge: "Integrated Blueprint",
    coreBadge: "Unified Command Hub",
    tip: "Click on any node in the schematic below to inspect its engineering protocols and specifications.",
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
        title: "Helio Property Platform",
        client: "Helio Property Real Estate Development",
        tag: "PropTech Platform",
        category: "software",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        highlight: "Smart PropTech platform dedicated to residential & commercial developments in New Heliopolis and beyond.",
        summary: "Integrated real estate platform enabling smart unit discovery, reservation workflows, flexible installment tracking, and developer CRM.",
        description: "Tech Bokra is engineering and deploying the 'Helio Property' platform utilizing cloud-native Next.js and high-performance serverless infrastructure. The platform serves as the premier digital gateway for the New Heliopolis property market, offering geo-search filters, contract management, flexible installment plans, and sub-second page loads.",
        stats: [
          { label: "Listed Units", value: "+500 Units" },
          { label: "Launch Status", value: "90% Beta Ready" },
          { label: "Render Latency", value: "0.2s Instant" },
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
        liveUrl: "https://helio-property.vercel.app/",
        statusBadge: "In Progress - Beta Launch Soon",
        isUpcoming: true,
      },
      {
        id: "alrehla",
        title: "Al-Rehla Platform",
        client: "Al-Rehla Organization (alrehla.org)",
        tag: "Interactive Platform",
        category: "software",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        highlight: "An innovative interactive knowledge and digital storytelling platform offering a distinctive user journey.",
        summary: "A world-class digital platform combining depth of content, visual interactivity, and high-performance user experience.",
        description: "Tech Bokra powers and supports the technical infrastructure of 'Al-Rehla' (alrehla.org), delivering ultra-reliable cloud hosting, bespoke fluid animations, and high-throughput data processing to ensure rock-solid stability across hundreds of thousands of visitor sessions.",
        stats: [
          { label: "Monthly Engagements", value: "+25,000" },
          { label: "Server Availability", value: "99.9% Uptime" },
          { label: "User Satisfaction", value: "4.9 / 5" },
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
        liveUrl: "https://www.alrehla.org/",
        statusBadge: "Active Platform - Continuous Evolution",
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
    title: "Global Technology & Hardware Partners",
    subtitle: "We partner directly with industry-leading global vendors to deliver uncompromising durability and performance.",
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
