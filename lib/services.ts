/**
 * Tech Bokra - Engineering Services Data Repository
 * Single Source of Truth for Categories, Sub-Services, Capabilities, and Technical Deliverables.
 * Fully Bilingual (AR / EN) with strict engineering terminology for the Egyptian B2B market.
 */

export type ServiceCategoryKey = 'security' | 'network' | 'elv' | 'software';

export type EstimatorGroupKey = 'cctv' | 'network' | 'access' | 'software' | 'erp' | 'consulting';

export interface ServiceStandard {
  name: string;
  confirmed: boolean; // false denotes [TO_CONFIRM] status in the UI
}

export interface ServiceFAQItem {
  q: { ar: string; en: string };
  a: { ar: string; en: string };
}

export interface SubService {
  slug: string;
  category: ServiceCategoryKey;
  estimatorGroup: EstimatorGroupKey | null;

  title: { ar: string; en: string };
  summary: { ar: string; en: string };
  problemSolved?: { ar: string; en: string };
  image?: string;

  capabilities: { ar: string[]; en: string[] };
  sectors: { ar: string[]; en: string[] };
  components: { ar: string[]; en: string[] };
  designInputs: { ar: string[]; en: string[] };
  standards: ServiceStandard[];
  deliverables: { ar: string[]; en: string[] };
  integrations: { ar: string[]; en: string[] };
  faq: ServiceFAQItem[];

  relatedServices: string[];
  relatedTool: 'storage-calculator' | 'estimator' | 'none';
  toolPreset?: Record<string, string | number>;

  seo: {
    title: { ar: string; en: string };
    description: { ar: string; en: string };
  };

  status: 'live' | 'coming-soon';
}

export interface ServiceCategory {
  id: ServiceCategoryKey;
  slug: string;
  title: { ar: string; en: string };
  summary: { ar: string; en: string };
  iconName: string;
  seo: {
    title: { ar: string; en: string };
    description: { ar: string; en: string };
  };
}

// =========================================================================
// 1. MAIN SERVICE CATEGORIES
// =========================================================================
export const SERVICE_CATEGORIES: Record<ServiceCategoryKey, ServiceCategory> = {
  security: {
    id: 'security',
    slug: 'security',
    title: {
      ar: 'أنظمة الأمن المادي والمراقبة الذكية',
      en: 'Physical Security & Smart Surveillance Systems',
    },
    summary: {
      ar: 'حلول متكاملة تشمل المراقبة بالكاميرات الذكية، التحكم البيومتري في الدخول، بوابات وحواجز المركبات، ومنصات إدارة الفيديو المركزية وفق المعايير الهندسية.',
      en: 'Turnkey physical security solutions encompassing AI video surveillance, biometric access control, vehicle barrier automation, and enterprise VMS platforms.',
    },
    iconName: 'ShieldCheck',
    seo: {
      title: {
        ar: 'أنظمة الأمن المادي وكاميرات المراقبة للشركات | تيك بكرة',
        en: 'Physical Security & AI CCTV Solutions | Tech Bokra',
      },
      description: {
        ar: 'توريد وتنفيذ أنظمة الأمن المادي، كاميرات المراقبة الشبكية 4K، التحكم في الدخول، وإدارة بوابات المنشآت الحيوية والشركات في مصر.',
        en: 'Turnkey enterprise physical security, 4K IP surveillance, access control, and smart perimeter systems in Egypt.',
      },
    },
  },
  network: {
    id: 'network',
    slug: 'network',
    title: {
      ar: 'البنية التحتية والشبكات ومراكز البيانات',
      en: 'IT Infrastructure, Networking & Data Centers',
    },
    summary: {
      ar: 'تصميم وتنفيذ شبكات الكابلات المنظمة النحاسية والألياف الضوئية، تجهيز غرف الخوادم والكبائن، وحلول التوجيه والتبديل الشبكي المدار للمؤسسات.',
      en: 'Engineering design and deployment of structured copper and fiber cabling, data center racks, server rooms, and managed enterprise switching.',
    },
    iconName: 'Network',
    seo: {
      title: {
        ar: 'شبكات الكابلات المنظمة وتجهيز مراكز البيانات | تيك بكرة',
        en: 'Structured Cabling & Data Center Infrastructure | Tech Bokra',
      },
      description: {
        ar: 'تنفيذ شبكات Cat6A والألياف الضوئية، غرف السيرفرات، ومحولات الشبكة المدارة للمباني الإدارية والمصانع.',
        en: 'Enterprise Cat6A & optical fiber cabling, server rooms, and switching infrastructure in Egypt.',
      },
    },
  },
  elv: {
    id: 'elv',
    slug: 'elv',
    title: {
      ar: 'أنظمة التيار الخفيف المتكاملة',
      en: 'Low Current & ELV Systems',
    },
    summary: {
      ar: 'منظومات إنذار الحريق المعنونة، الإذاعة العامة والصوتيات التنبيهية، الاتصال الداخلي المرئي، وحلول العرض التفاعلي لغرف العمليات والاجتماعات.',
      en: 'Comprehensive Extra Low Voltage (ELV) systems including addressable fire alarms, public address, IP intercoms, and command center video walls.',
    },
    iconName: 'Radio',
    seo: {
      title: {
        ar: 'أنظمة التيار الخفيف ELV وإنذار الحريق | تيك بكرة',
        en: 'Integrated ELV & Fire Alarm Systems | Tech Bokra',
      },
      description: {
        ar: 'توريد وتركيب أنظمة التيار الخفيف، إنذار الحريق، الصوتيات والإذاعة الداخلية، وشاشات غرف التحكم والعمليات.',
        en: 'Engineered ELV packages: addressable fire detection, public address, IP intercom, and AV infrastructure.',
      },
    },
  },
  software: {
    id: 'software',
    slug: 'software',
    title: {
      ar: 'البرمجيات والحلول الرقمية وإدارة المنشآت',
      en: 'Software, BMS & Digital Enterprise Solutions',
    },
    summary: {
      ar: 'أنظمة إدارة المباني الذكية (BMS)، برمجيات إدارة الطوابير والمواقف، وأتمتة دورات العمل والربط البرمجي لتكامل البنية التشغيلية للمنشأة.',
      en: 'Smart Building Management Systems (BMS), queue automation, parking revenue software, and enterprise workflow integrations.',
    },
    iconName: 'Layers',
    seo: {
      title: {
        ar: 'برمجيات إدارة المباني BMS والحلول الرقمية | تيك بكرة',
        en: 'Building Management Software & Digital Solutions | Tech Bokra',
      },
      description: {
        ar: 'أنظمة BMS الذكية للمباني، برمجيات إدارة الطوابير، وتطبيقات أتمتة العمليات للمؤسسات.',
        en: 'Enterprise BMS integration, workflow automation, and custom facility software in Egypt.',
      },
    },
  },
};

// =========================================================================
// 2. LEGACY SERVICE ID MAPPING (Backward Compatibility with useCustomConfig)
// =========================================================================
export const LEGACY_SERVICE_ID_MAP: Record<string, string> = {
  'physical-security-systems': 'cctv-ai-analytics',
  'networking-infrastructure': 'structured-cabling',
  'elv-systems': 'fire-alarm',
  'software-digital-solutions': 'bms',
};

// =========================================================================
// 3. ALL 26 SUB-SERVICES (5 LIVE WITH FULL CONTENT, 21 COMING-SOON)
// =========================================================================
export const SUB_SERVICES: SubService[] = [
  // -----------------------------------------------------------------------
  // [1] PHYSICAL SECURITY: cctv-ai-analytics (LIVE)
  // -----------------------------------------------------------------------
  {
    slug: 'cctv-ai-analytics',
    category: 'security',
    estimatorGroup: 'cctv',
    title: {
      ar: 'كاميرات المراقبة الذكية وتحليلات الفيديو',
      en: 'Smart CCTV & AI Video Analytics',
    },
    summary: {
      ar: 'تصميم وتوريد وتركيب منظومات المراقبة التلفزيونية الشبكية (IP-CCTV) بدقة 4K مع تفعيل تحليلات الذكاء الاصطناعي لحماية المحيط واكتشاف الاختراقات.',
      en: 'Design, supply, and installation of 4K IP CCTV surveillance systems empowered with edge AI analytics for perimeter protection and automated threat detection.',
    },
    problemSolved: {
      ar: 'معالجة ثغرات التغطية العمياء في المنشآت الحيوية، والحد من الاعتماد على المراقبة البشرية المرهقة من خلال التنبيه اللحظي الذكي عند رصد أي حركة غير مصرح بها.',
      en: 'Eliminating surveillance blind spots and reducing operator fatigue by leveraging automated AI triggers for unauthorized perimeter crossings and suspicious behaviors.',
    },
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    capabilities: {
      ar: [
        'كاميرات شبكية بدقة 4K Ultra HD مع تقنيات الرؤية الليلية بالأشعة تحت الحمراء وضوء النجوم',
        'تحليلات ذكية لاكتشاف عبور الخطوط الافتراضية واختراق المحيط (Tripwire & Perimeter Intrusion)',
        'التعرف على المركبات والوجوه وتصنيف الأهداف البشرية وتجاهل الإنذارات الكاذبة',
        'منظومة تسجيل مركزي (NVR / Server Storage) تدعم مصفوفات RAID لضمان عدم فقدان التسجيلات',
        'مراقبة مركزية عن بعد عبر غرف العمليات وشبكات VPN الآمنة للمؤسسات متعددة الفروع',
      ],
      en: [
        '4K Ultra HD IP cameras with advanced infrared and starlight low-light performance',
        'Deep learning video analytics: virtual tripwire, intrusion detection, and object classification',
        'Automated false-alarm filtering distinguishing humans and vehicles from environmental noise',
        'Enterprise NVR and server storage configured with RAID redundancy to prevent footage loss',
        'Unified multi-site monitoring via command centers and secure encrypted WAN/VPN channels',
      ],
    },
    sectors: {
      ar: ['المصانع والمستودعات اللوجستية', 'المباني الإدارية والمقرات الرئيسية', 'المجمعات السكنية والتجارية', 'المنشآت الصحية والمستشفيات', 'البنوك والمؤسسات المالية'],
      en: ['Factories & Logistics Hubs', 'Corporate Headquarters', 'Commercial & Residential Compounds', 'Hospitals & Healthcare Facilities', 'Banks & Financial Institutions'],
    },
    components: {
      ar: [
        'كاميرات شبكية خارجية وداخلية (Bullet & Dome) مقاومة للعوامل الجوية بمعيار IP67 و IK10',
        'كاميرات متحركة عالية السرعة (PTZ) مع تتبع تلقائي ومستشعرات تقريب بصري ممتد',
        'أجهزة تسجيل فيديو شبكية مركزية (NVRs) وخوادم VMS مجهزة بمنافذ شبكية مزدوجة',
        'محولات شبكة مخصصة لنقل الطاقة عبر الإيثرنت (Managed PoE+ Switches)',
        'وحدات تخزين مخصصة للمراقبة المستمرة (Enterprise Surveillance HDDs)',
      ],
      en: [
        'Weatherproof and vandal-resistant IP bullet and dome cameras (IP67 / IK10 rated)',
        'High-speed PTZ cameras with optical zoom and automated intelligent tracking',
        'Enterprise Network Video Recorders (NVR) and scalable VMS server appliances',
        'Managed PoE+ network switches engineered for continuous video streaming loads',
        'Surveillance-grade 24/7 continuous writing hard disk drives and storage arrays',
      ],
    },
    designInputs: {
      ar: [
        'المخططات المعمارية ومساقط المنشأة بصيغة CAD لتحديد زوايا الرؤية ومواقع النقاط',
        'مستويات التغطية المطلوبة لكل زاوية وفق معايير DORI (الكشف، الملاحظة، التعرف، التحديد)',
        'مدة الاحتفاظ بالتسجيلات المطلوبة (Retention Days: 30 / 60 / 90 يوماً)',
        'مواقع كبائن الخوادم ومسارات الكابلات المتاحة ومصادر التغذية الكهربائية المنتظمة (UPS)',
      ],
      en: [
        'Architectural floor plans and site CAD drawings to establish fields of view and mounting points',
        'Required DORI operational requirements (Detection, Observation, Recognition, Identification)',
        'Mandated video retention period (e.g., 30, 60, or 90 days of continuous recording)',
        'Server room and IDF locations, cable tray pathways, and clean UPS power availability',
      ],
    },
    standards: [],
    deliverables: {
      ar: [
        'مخططات التوزيع الهندسي للكاميرات وحسابات زوايا الرؤية (Camera Layout & FOV Drawings)',
        'تقرير حسابات سعات التخزين وعرض النطاق الترددي للشبكة (Storage & Bandwidth Calculation Report)',
        'جدول حصر الكميات والمواصفات الفنية التفصيلية (Detailed BOQ & Tech Submittal)',
        'مخططات التمديد والربط الفعلي كما تم تنفيذه (As-Built Schematics)',
        'محضر الاختبار الميداني والتشغيل التجريبي وتسليم المنظومة (Testing & Commissioning Certificate)',
      ],
      en: [
        'Camera layout drawings with field-of-view (FOV) and lens focal coverage calculations',
        'Engineering storage capacity and network bandwidth consumption report',
        'Detailed Bill of Quantities (BOQ) and equipment technical submittal package',
        'Complete As-Built network and camera connection schematics',
        'Formal site testing, commissioning sign-off, and administrator handover documentation',
      ],
    },
    integrations: {
      ar: [
        'الربط التكاملي مع أنظمة التحكم في الدخول لبدء التسجيل والتقاط الصور لحظة فتح الأبواب',
        'التكامل مع لوحات إنذار الحريق لتوجيه كاميرات PTZ آلياً نحو منطقة الإنذار',
        'الربط مع منصات إدارة الفيديو المفتوحة (Milestone, Genetec, VMS)',
        'إرسال إشعارات التنبيه الفورية إلى الهواتف الذكية وغرف التحكم المركزية',
      ],
      en: [
        'Event-driven linkage with access control to bookmark video upon badge swipes',
        'Automated integration with fire alarm panels to steer PTZ cameras toward alarmed zones',
        'Seamless compatibility with open enterprise VMS platforms (e.g. Milestone, Genetec)',
        'Push alert triggers and instant snapshot delivery to SOC dashboards and mobile devices',
      ],
    },
    faq: [
      {
        q: {
          ar: 'كيف يتم تحديد سعة التخزين المطلوبة لكاميرات المراقبة بالمنشأة؟',
          en: 'How is the required surveillance storage capacity calculated?',
        },
        a: {
          ar: 'تُحسب السعة استناداً إلى دقة كل كاميرا، معدل الإطارات (FPS)، نوع خوارزمية الضغط (H.264 مقابل H.265+)، ونسبة النشاط والحركة اليومية مضروبة في عدد الأيام المطلوبة للاحتفاظ بالتسجيل، مع إضافة هامش أمان هندسي بنسبة 15%.',
          en: 'Storage is calculated based on resolution, frame rate (FPS), codec efficiency (H.264 vs H.265+), and expected daily motion percentage multiplied by retention days, plus an engineering headroom margin of ~15%.',
        },
      },
      {
        q: {
          ar: 'هل تدعم المنظومة تشغيل كاميرات من شركات مختلفة على نفس منصة التسجيل؟',
          en: 'Does the system support mixing camera brands on a unified recording platform?',
        },
        a: {
          ar: 'نعم، نعتمد أجهزة وبرمجيات تدعم بروتوكولات الفيديو الشبكية القياسية المفتوحة، مما يتيح دمج كاميرات متعددة المصادر وربطها بسلاسة تحت واجهة إدارة موحدة.',
          en: 'Yes. We deploy hardware and software conforming to open IP video streaming protocols, allowing seamless multi-vendor camera integration under a single pane of glass.',
        },
      },
    ],
    relatedServices: ['vms', 'access-control', 'structured-cabling'],
    relatedTool: 'storage-calculator',
    toolPreset: { cameras: 32, resolution: '4mp', codec: 'h265plus', days: 60 },
    seo: {
      title: {
        ar: 'كاميرات مراقبة ذكية 4K وتحليلات الذكاء الاصطناعي للشركات | تيك بكرة',
        en: 'Smart 4K IP CCTV & AI Video Analytics Systems | Tech Bokra',
      },
      description: {
        ar: 'توريد وتركيب كاميرات مراقبة شبكية 4K وأنظمة تحليلات ذكية وخوادم تسجيل مركزية للمصانع والمنشآت في مصر.',
        en: 'Enterprise 4K IP surveillance, deep learning video analytics, and enterprise NVR storage solutions in Egypt.',
      },
    },
    status: 'live',
  },

  // -----------------------------------------------------------------------
  // [2] PHYSICAL SECURITY: access-control (LIVE)
  // -----------------------------------------------------------------------
  {
    slug: 'access-control',
    category: 'security',
    estimatorGroup: 'access',
    title: {
      ar: 'أنظمة التحكم في الدخول والأبواب الذكية',
      en: 'Access Control & Smart Door Security',
    },
    summary: {
      ar: 'منظومات متطورة لتنظيم وتوثيق حركة الدخول والخروج للموظفين والزوار عبر بصمة الوجه، الكروت المشفرة، والأقفال الكهرومغناطيسية مع لوحات تحكم شبكية موحدة.',
      en: 'Advanced access management architectures regulating personnel and visitor entry via facial recognition, encrypted smart cards, and electromagnetic locks.',
    },
    problemSolved: {
      ar: 'منع دخول الأشخاص غير المصرح لهم للمناطق الحساسة (مثل غرف الخوادم، الخزائن، والمكاتب التنفيذية) وإنهاء إهدار الوقت والتكاليف الناتجة عن المفاتيح التقليدية مع إتاحة سجل تدقيق زمني كامل.',
      en: 'Preventing unauthorized access to critical zones (server rooms, vaults, executive areas) while eliminating physical key vulnerabilities through automated, time-stamped audit trails.',
    },
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
    capabilities: {
      ar: [
        'التحقق البيومتري الفوري ببصمة الوجه ثلاثية الأبعاد بدون تلامس وبصمة الإصبع',
        'دعم كروت القرب الذكية المشفرة بتقنيات RFID و MIFARE عالية الأمان لمنع الاستنساخ',
        'إدارة الصلاحيات متعددة المستويات بحسب الفترات الزمنية والمجموعات الوظيفية',
        'ميزة منع الدخول المزدوج (Anti-Passback) لمنع تمرير الكارت لشخص آخر',
        'الفتح التلقائي الفوري لجميع الأبواب المخارج عند حدوث إنذار حريق (Life Safety Release)',
      ],
      en: [
        'Contactless 3D facial recognition, biometric fingerprint, and mobile credential verification',
        'Support for encrypted RFID / MIFARE DESFire smart cards preventing credential duplication',
        'Multi-tiered permission levels categorized by employee roles, shifts, and time windows',
        'Enforced Anti-Passback logic preventing badge pass-backs and tailgating',
        'Automatic emergency fail-safe release on all egress routes upon fire alarm activation',
      ],
    },
    sectors: {
      ar: ['الشركات الإدارية ومكاتب الأعمال', 'المستشفيات والمختبرات الطبية', 'غرف الخوادم ومراكز البيانات', 'المصانع والمناطق الجمركية', 'المؤسسات التعليمية والجامعات'],
      en: ['Corporate Headquarters', 'Hospitals & Medical Labs', 'Data Centers & Server Rooms', 'Industrial & Bonded Zones', 'Universities & Academic Campuses'],
    },
    components: {
      ar: [
        'لوحات تحكم شبكية مركزية (IP Access Controllers) تدعم 2/4/8 أبواب متزامنة',
        'أجهزة قراءة بيومترية وكروت خارجية مقاومة للطقس والرطوبة (IP65)',
        'أقفال كهرومغناطيسية مغناطيسية (Magnetic Locks 600/1200 lbs) وسقاطات كهربائية (Dropbolts)',
        'أزرار خروج بدون لمس (Touchless Exit Sensors) ووحدات كسر زجاج الطوارئ (Emergency Break Glass)',
        'وحدات تزويد طاقة خطية مدعومة ببطاريات شحن احتياطية (Battery Backup Power Supplies)',
      ],
      en: [
        'Multi-door network controllers supporting 2, 4, or 8 doors with onboard buffer memory',
        'Weather-rated biometric readers and contactless RFID card scanners (IP65)',
        'Heavy-duty electromagnetic locks (600/1200 lbs holding force) and electric drop bolts',
        'Touch-free exit push buttons and green emergency glass-break release stations',
        'Regulated linear power supply enclosures with sealed lead-acid backup batteries',
      ],
    },
    designInputs: {
      ar: [
        'جدول الأبواب المعماري (Door Schedule) يوضح خامات الأبواب (خشب، زجاج سيكوريت، حديد مصفح)',
        'مصفوفة الصلاحيات الأمنية وخطة الإخلاء المقررة للمبنى',
        'مسارات التغذية الكهربائية ومسارات كابلات التحكم من لوحات التحكم إلى الأبواب',
        'اشتراطات الربط مع لوحة إنذار الحريق المركزية ومواصفات السلامة المهنية',
      ],
      en: [
        'Architectural door schedule specifying frame types and leaf materials (glass, wood, steel)',
        'Security access matrix and approved building egress/evacuation paths',
        'Dedicated conduit pathways between central controllers and door frames',
        'Fire alarm dry-contact interface specifications for life-safety compliance',
      ],
    },
    standards: [],
    deliverables: {
      ar: [
        'مخطط توزيع نقاط التحكم ومخططات الأسلاك الصاعدة (Access Control Riser Diagram)',
        'جدول توصيل الأسلاك لكل باب (Door Wiring & Termination Schedule)',
        'قائمة توريد المعدات واللوحات والأقفال المقترحة (BOQ)',
        'مخططات التثبيت كما تم التنفيذ (As-Built Drawings)',
        'دليل إعداد المستخدمين وتدريب مسؤولي تكنولوجيا المعلومات والأمن',
      ],
      en: [
        'Access control riser diagrams and architectural hardware deployment layouts',
        'Comprehensive door wiring, power requirement, and termination schedules',
        'Approved Bill of Quantities (BOQ) with full technical specifications',
        'Final As-Built schematics detailing cable routes and controller addresses',
        'System administrator setup guide and IT/Security training manual',
      ],
    },
    integrations: {
      ar: [
        'الربط مع كاميرات المراقبة لتسجيل مقطع فيديو فوري لكل محاولة فتح باب مرفوضة أو مقبولة',
        'الربط مع لوحة إنذار الحريق لقطع التيار فوراً عن الأقفال الكهرومغناطيسية وتسهيل الخروج',
        'التكامل مع قواعد بيانات الموظفين (Active Directory / HR Systems) لمزامنة البيانات',
        'الربط مع برمجيات الحضور والانصراف لحساب ساعات العمل والإضافي آلياً',
      ],
      en: [
        'Integration with CCTV to capture automated snapshots on door alarm events',
        'Direct interface with fire alarm panels for instantaneous fail-safe door unlocks',
        'Synchronization with Active Directory and corporate HR databases for user provisioning',
        'Seamless export of entry/exit timestamps to Time & Attendance payroll engines',
      ],
    },
    faq: [
      {
        q: {
          ar: 'ماذا يحدث للأبواب الإلكترونية في حال انقطاع التيار الكهربائي؟',
          en: 'What happens to the access-controlled doors during a power outage?',
        },
        a: {
          ar: 'تتضمن المنظومة بطاريات احتياطية مدمجة تحافظ على استمرار العمل لعدة ساعات، وفي حال نفادها تم ضبط أقفال مخارج الطوارئ على وضع Fail-Safe (فتح القفل تلقائياً لضمان سلامة الأفراد)، مع توفير مفاتيح ميكانيكية ومفاتيح كسر زجاج للطوارئ.',
          en: 'Units are backed by auxiliary battery enclosures ensuring hours of operation. Under total power failure, life-safety egress locks default to Fail-Safe mode (unlocked for life safety), backed by manual emergency break-glass units.',
        },
      },
    ],
    relatedServices: ['cctv-ai-analytics', 'time-attendance', 'fire-alarm'],
    relatedTool: 'estimator',
    seo: {
      title: {
        ar: 'أنظمة التحكم في الدخول والأبواب الذكية للشركات | تيك بكرة',
        en: 'Biometric Access Control & Smart Door Systems | Tech Bokra',
      },
      description: {
        ar: 'حلول التحكم في الدخول ببصمة الوجه والكروت الذكية والأقفال الكهرومغناطيسية مع الربط بلوحات الحريق للمؤسسات.',
        en: 'Enterprise biometric access control, smart card door security, and fire alarm interlock systems in Egypt.',
      },
    },
    status: 'live',
  },

  // -----------------------------------------------------------------------
  // [3] NETWORKING: structured-cabling (LIVE - Fiber Merged)
  // -----------------------------------------------------------------------
  {
    slug: 'structured-cabling',
    category: 'network',
    estimatorGroup: 'network',
    title: {
      ar: 'شبكات الكابلات المنظمة والألياف الضوئية',
      en: 'Structured Cabling & Fiber Optic Networks',
    },
    summary: {
      ar: 'تصميم وبناء البنية التحتية الفيزيائية للشبكات؛ وتشمل تمديد كابلات Cat6A و Cat7 النحاسية، كابلات الفايبر أحادية ومتعددة النمط، اللحام بالقوس الحراري، واختبارات الاعتمادية بجهاز Fluke.',
      en: 'Comprehensive physical network cabling architectures encompassing Cat6A/Cat7 copper horizontal runs, singlemode/multimode fiber backbones, fusion splicing, and Fluke certification testing.',
    },
    problemSolved: {
      ar: 'القضاء التام على بطء الشبكات وانقطاع الاتصال العشوائي الناتج عن التمديدات العشوائية والتداخل الكهرومغناطيسي، مع ضمان بنية تحتية مستقرة وجاهزة لدعم سرعات 10Gbps لعقود قادمة.',
      en: 'Eliminating intermittent packet loss and bandwidth bottlenecks caused by disorganized wiring, delivering reliable 10Gbps-ready infrastructure with 25-year performance margins.',
    },
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    capabilities: {
      ar: [
        'تمديد الكابلات النحاسية المهيكلة Cat6 و Cat6A المحمية (U/FTP & F/UTP) لسرعات نقل حتى 10Gbps',
        'مد مسارات كابلات الألياف الضوئية (Singlemode OS2 & Multimode OM3/OM4) للروابط الصاعدة',
        'عمليات لحام الفايبر الدقيقة بالانصهار الحراري (Precision Core-Alignment Fusion Splicing)',
        'اختبار وفحص خطوط الشبكة بجهاز Fluke Networks وتسليم تقارير رسمية بالأرقام التسلسلية',
        'تنظيم وترقيم كبائن الراك (Patch Panels & Cable Management) وفق معايير ANSI/TIA-606',
      ],
      en: [
        'Deployment of Cat6 and Cat6A shielded copper cabling (U/FTP & F/UTP) rated for 10 Gigabit speeds',
        'Installation of singlemode OS2 and multimode OM3/OM4 fiber optic backbones between IDFs and MDF',
        'High-precision optical fiber core-alignment fusion splicing and OTDR attenuation testing',
        'Fluke Networks DSX cable analyzer certification testing with documented test trace reports',
        'Comprehensive patch panel dressing, cable labeling, and rack management conforming to TIA-606',
      ],
    },
    sectors: {
      ar: ['المباني الإدارية ومقرات الشركات', 'مراكز البيانات وغرف السيرفرات', 'المنشآت الصناعية والمستودعات', 'المستشفيات والمراكز الطبية', 'المصارف والمؤسسات الحكومية'],
      en: ['Corporate Office Buildings', 'Data Centers & Colocation Sites', 'Industrial Facilities & Warehouses', 'Hospitals & Medical Campuses', 'Banks & Government Complexes'],
    },
    components: {
      ar: [
        'كابلات شبكة نحاسية مصنفة Cat6A LSZH خالية من الهالوجين ومقاومة للحرائق',
        'لوحات توزيع نحاسية معيارية (24/48 Port Modular Patch Panels & Keystones)',
        'كابلات ألياف ضوئية مدرعة داخلية وخارجية (Armored Singlemode / Multimode Cables)',
        'وحدات توزيع ألياف ضوئية (Fiber Optical Patch Panels / LIU) وباتش كورد فايبر LC-LC',
        'منظمات كابلات أفقية ورأسية ومسارات كابلات شبكية معدنية (Wire Mesh Cable Trays)',
      ],
      en: [
        'Cat6A LSZH (Low Smoke Zero Halogen) fire-rated solid copper network cables',
        '24/48-port high-density modular keystone patch panels with grounded shielding',
        'Indoor/Outdoor armored fiber optic trunk cables (OS2 Singlemode & OM4 Multimode)',
        'Rack-mount Fiber Optic Distribution Units (LIU) with LC/SC duplex couplers and pigtails',
        'Vertical and horizontal cable management ducts and wire-mesh overhead cable tray systems',
      ],
    },
    designInputs: {
      ar: [
        'المخططات المعمارية ومخططات الفرش المكتبي لتحديد مواقع نقاط البيانات (Data Outlets)',
        'موقع غرفة التحكم والاتصالات الرئيسية (MDF) وغرف الاتصالات الفرعية (IDFs)',
        'المسافات القصوى بين غرف التوزيع والمخارج (الالتزام بالحد الأقصى 90 متراً للكابل النحاسي)',
        'متطلبات السرعة وعرض النطاق المخصص للأنظمة (كاميرات، حواسيب، هواتف VoIP، نقاط Wi-Fi)',
      ],
      en: [
        'Architectural floor plans and furniture layouts indicating data and workstation outlet points',
        'MDF (Main Distribution Frame) and IDF (Intermediate Distribution Frame) room locations',
        'Distance verification ensuring horizontal permanent copper links do not exceed 90 meters',
        'Bandwidth and PoE budget requirements for endpoint devices (APs, VoIP, IP Cameras)',
      ],
    },
    standards: [],
    deliverables: {
      ar: [
        'مخططات التوزيع الشبكي ومواقع النقاط المرقمة (Network Outlets Layout Plan)',
        'مخطط الروابط الصاعدة بين الكبائن (Network Riser & Fiber Backbone Diagram)',
        'تقارير فحص واختبار خطوط الشبكة بجهاز Fluke (Channel & Permanent Link Test Reports)',
        'مخططات واجهات الراك وترتيب الباتش بانل (Rack Elevation Schematics)',
        'وثيقة الفحص الفني واختبار جودة الكابلات والتوصيلات',
      ],
      en: [
        'Structured cabling layout drawings showing numbered data outlet locations',
        'Comprehensive network riser diagram showing copper and fiber backbone topology',
        'Fluke DSX test reports detailing NEXT, Return Loss, and Attenuation per drop',
        'Detailed rack elevation diagrams showing patch panel, switch, and cable manager assignments',
        'System quality and testing documentation for cabling installations',
      ],
    },
    integrations: {
      ar: [
        'توفير البنية التحتية لكافة محولات الشبكة المدارة (Cisco, Aruba, Extreme Switches)',
        'تغذية نقاط الوصول اللاسلكية المؤسسية (Enterprise Wi-Fi Access Points)',
        'ربط خوادم ومصفوفات التخزين في الداتا سنتر بكابلات الألياف الضوئية عالية السرعة',
        'دعم نقل إشارات أنظمة المراقبة والتحكم في الدخول وتلفزيون بروتوكول الإنترنت (IPTV)',
      ],
      en: [
        'Physical Layer transport for managed core, distribution, and access switches',
        'High-power PoE transport delivering data and electricity to Wi-Fi 6/7 access points',
        'High-throughput optical interconnects linking SAN/NAS storage and server virtualized clusters',
        'Unified physical medium carrying IP CCTV, VoIP telephony, and digital signage traffic',
      ],
    },
    faq: [
      {
        q: {
          ar: 'ما الفرق بين كابلات Cat6 و Cat6A ومتى يجب اختيار كابلات الألياف الضوئية؟',
          en: 'What is the difference between Cat6 and Cat6A, and when should fiber optics be used?',
        },
        a: {
          ar: 'تدعم كابلات Cat6 سرعات 1Gbps وتصل إلى 10Gbps لمسافات قصيرة (حتى 37-55 متراً)، بينما كابلات Cat6A تدعم 10Gbps كاملة حتى مسافة 90 متراً مع عزل ممتاز ضد التشويش. أما الألياف الضوئية (Fiber) فتُستخدم إلزامياً للربط بين الأدوار والمباني لأنها تدعم مسافات تمتد لعدة كيلومترات ولا تتأثر نهائياً بالمجالات الكهرومغناطيسية.',
          en: 'Cat6 supports 1Gbps up to 90m (and 10Gbps up to ~37-55m), while Cat6A guarantees 10Gbps over the full 90m horizontal distance with superior crosstalk resistance. Fiber optics is mandatory for inter-building and inter-floor backbones exceeding 90m and offers zero electromagnetic interference.',
        },
      },
    ],
    relatedServices: ['data-center-racks', 'enterprise-switching', 'cctv-ai-analytics'],
    relatedTool: 'estimator',
    seo: {
      title: {
        ar: 'كابلات شبكات منظمة Cat6A وشبكات فايبر ضوئية | تيك بكرة',
        en: 'Structured Cabling & Fiber Optics Infrastructure | Tech Bokra',
      },
      description: {
        ar: 'تنفيذ شبكات الكابلات المنظمة Cat6A، كابلات الفايبر واللحام الحراري، وفحص الفلوك للشركات ومراكز البيانات في مصر.',
        en: 'High-performance Cat6A copper cabling, singlemode/multimode fiber optic splicing, and data center network cabling in Egypt.',
      },
    },
    status: 'live',
  },

  // -----------------------------------------------------------------------
  // [4] ELV: fire-alarm (LIVE - EstimatorGroup: null, RelatedTool: 'none')
  // -----------------------------------------------------------------------
  {
    slug: 'fire-alarm',
    category: 'elv',
    estimatorGroup: null,
    title: {
      ar: 'أنظمة إنذار الحريق المعنونة والكشف المبكر',
      en: 'Addressable Fire Alarm & Early Detection Systems',
    },
    summary: {
      ar: 'توريد وتركيب وبرمجة أنظمة إنذار الحريق المعنونة (Addressable Fire Alarm) مع مراعاة اشتراطات الدفاع المدني المصري وإجراءات السلامة لتأمين المنشآت.',
      en: 'Engineering, supply, and installation of addressable fire detection systems with consideration of relevant safety guidelines and local Civil Defense requirements.',
    },
    problemSolved: {
      ar: 'حماية الأرواح والممتلكات عبر الرصد المبكر والدقيق لمصادر الدخان والحرارة قبل انتشار الحريق، مع تحديد موقع الخطر بدقة مترية ومنع الإنذارات العشوائية غير المحددة.',
      en: 'Protecting lives and property through pinpoint, room-by-room detection of thermal and smoke hazards before propagation, eliminating unverified general alarms.',
    },
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1200&q=80',
    capabilities: {
      ar: [
        'لوحات تحكم معنونة ذكية (Intelligent Addressable FACPs) تحدد موقع الكاشف بدقة متناهية',
        'كواشف دخان بصرية وكواشف حرارة مبرمجة لبيئات العمل المختلفة مع ميزة التعويض البيئي',
        'أجهزة كسر زجاج وسارينات إنذار مع فلاشات ضوئية لإرشاد المتواجدين أثناء الإخلاء',
        'كابلات مقاومة للهب والحريق (Fire-Resistant Cables PH120) تحافظ على استمرار الإشارة أثناء الحريق',
        'لوحات تكرار بيانية (Repeater Panels) لمكاتب الأمن وغرف الاستقبال ومداخل المنشأة',
      ],
      en: [
        'Intelligent addressable fire alarm control panels identifying exact detector location and room ID',
        'Multi-criteria optical smoke and rate-of-rise thermal detectors with automated drift compensation',
        'Manual call points and high-decibel sounder strobes providing audible and visual evacuation signals',
        'Fire-resistant cabling (PH120 fire rated) ensuring continuous loop survival during fires',
        'Remote graphic annunciator and repeater panels installed at security desks and main reception',
      ],
    },
    sectors: {
      ar: ['المصانع والمستودعات والمنشآت الصناعية', 'المستشفيات والمنشآت الطبية', 'الفنادق والقرى السياحية', 'المباني الإدارية والأبراج التجارية', 'المؤسسات التعليمية والمدارس'],
      en: ['Industrial Plants & Warehouses', 'Hospitals & Medical Facilities', 'Hotels & Hospitality Resorts', 'Commercial Towers & Corporate Offices', 'Educational Institutions & Schools'],
    },
    components: {
      ar: [
        'لوحة تحكم مركزية معنونة (1 إلى 4 Loops) تدعم مئات الأجهزة لكل حلقة برمجية',
        'كواشف دخان ضوئية (Optical Smoke Detectors) وكواشف حرارة (Heat Detectors)',
        'كواشف دخان شعاعية (Beam Detectors) مخصصة للمستودعات والمساحات ذات الأسقف العالية',
        'سارينات إنذار مع وميض فلاش ضوئي (Electronic Sounder Strobes)',
        'موديولات تحكم ومراقبة (Control & Monitor Modules) للربط مع الأنظمة الميكانيكية والكهربائية',
      ],
      en: [
        'Addressable fire alarm control panels (1 to 4 loops) supporting hundreds of monitored field devices',
        'Analog addressable optical smoke and thermal rate-of-rise sensors',
        'Reflective optical beam smoke detectors designed for high-ceiling warehouses and atriums',
        'Synchronized visual sounder strobes and manual break-glass call points',
        'Supervised control and monitor modules interfacing with mechanical and electrical equipment',
      ],
    },
    designInputs: {
      ar: [
        'مخططات المنشأة المعمارية وأسقف المبنى ومواقع التكييف المركزي (HVAC Vents)',
        'تصنيف خطورة الإشغال ونوع الأنشطة الممارسة بالمنشأة (Low / Medium / High Hazard)',
        'اشتراطات الحماية المدنية ومتطلبات الدفاع المدني المصري الخاصة بالترخيص',
        'مواقع لوحات التحكم الرئيسية ومخارج الطوارئ ومسارات الهروب المحددة',
      ],
      en: [
        'Architectural floor and reflected ceiling plans indicating HVAC supply and return diffuser positions',
        'Occupancy hazard classification (Light, Ordinary, or Extra Hazard) and building usage',
        'Egyptian Civil Defense code mandates and specific authority inspection requirements',
        'Designated locations for main panels, emergency evacuation exits, and egress paths',
      ],
    },
    standards: [],
    deliverables: {
      ar: [
        'مخططات توزيع الكواشف والسارينات وحسابات التغطية طبقاً للمسافات القياسية',
        'مخطط الحلقات الصاعدة والربط الكهربائي (Fire Alarm Loop Riser Diagram)',
        'مصفوفة السبب والنتيجة للتحكم في الأنظمة (Cause & Effect Logic Matrix)',
        'حسابات سعة البطاريات الاحتياطية وهبوط الجهد (Battery & Voltage Drop Calculations)',
        'ملف المواصفات الفنية ومحاضر الاختبار الميداني والتشغيل التجريبي للمنظومة',
      ],
      en: [
        'Fire detector and sounder placement layouts with standard spacing verification',
        'Complete loop riser and electrical schematic wiring diagrams',
        'Building Cause & Effect control logic matrix detailing automated interlock actions',
        'Secondary power supply battery standby and voltage drop calculation sheets',
        'Engineering submittal package and technical commissioning sign-off records',
      ],
    },
    integrations: {
      ar: [
        'فصل أجهزة التكييف المركزي ووحدات مناولة الهواء (AHU) لمنع انتشار الدخان',
        'تفعيل الفتح التلقائي الفوري لكافة أبواب الطوارئ والتحكم في الدخول',
        'استدعاء المصاعد تلقائياً وإنزالها للدور الأرضي مع فتح الأبواب لخروج الركاب',
        'تشغيل الإذاعة الصوتية التنبيهية (Voice Evacuation) لبث تعليمات الإخلاء المنظمة',
      ],
      en: [
        'Automated shutdown of air handling units (AHUs) and smoke dampers to arrest smoke spread',
        'Immediate fail-safe release of all access-controlled egress doors throughout the facility',
        'Elevator phase-one recall sending all passenger cars to ground floor with doors open',
        'Triggering voice alarm / public address systems to broadcast recorded evacuation protocols',
      ],
    },
    faq: [
      {
        q: {
          ar: 'ما الفرق بين نظام إنذار الحريق التقليدي (Conventional) والمعنون (Addressable)؟',
          en: 'What is the key difference between conventional and addressable fire alarm systems?',
        },
        a: {
          ar: 'النظام التقليدي يقسم المبنى لمناطق (Zones) وعند حدوث إنذار يُظهر المنطقة فقط دون معرفة الغرفة المحددة، بينما النظام المعنون يخصص لكل كاشف عنواناً رقمياً مستقلاً، مما يظهر على شاشة اللوحة اسم ورقم الغرفة بدقة في جزء من الثانية، وهو الخيار القياسي للمنشآت الإدارية والصناعية الحديثة.',
          en: 'Conventional systems indicate only a generalized zone (e.g., Floor 2) requiring manual searching. Addressable systems assign a unique digital ID to each individual detector, displaying the exact room and device description instantly on the panel screen, making it essential for modern commercial facilities.',
        },
      },
    ],
    relatedServices: ['access-control', 'public-address-bgm', 'bms'],
    relatedTool: 'none',
    seo: {
      title: {
        ar: 'أنظمة إنذار الحريق المعنونة واشتراطات الدفاع المدني | تيك بكرة',
        en: 'Addressable Fire Alarm & Life Safety Systems | Tech Bokra',
      },
      description: {
        ar: 'توريد وتركيب وبرمجة أنظمة إنذار الحريق المعنونة والكواشف الذكية واختبارات الدفاع المدني للمنشآت في مصر.',
        en: 'Addressable fire alarm installation, smoke detection, and Civil Defense inspection support in Egypt.',
      },
    },
    status: 'live',
  },

  // -----------------------------------------------------------------------
  // [5] SOFTWARE: bms (LIVE)
  // -----------------------------------------------------------------------
  {
    slug: 'bms',
    category: 'software',
    estimatorGroup: 'software',
    title: {
      ar: 'أنظمة إدارة المباني الذكية والمرافق (BMS)',
      en: 'Building Management Systems (BMS & Automation)',
    },
    summary: {
      ar: 'منظومات أتمتة وتحكم مركزي متقدمة لمراقبة وإدارة أنظمة التكييف والتهوية (HVAC)، شبكات الإنارة، ومحطات الكهرباء والمياه بالمنشآت لتحقيق أعلى كفاءة تشغيل وتوفير الطاقة.',
      en: 'Centralized building automation and facility control software monitoring HVAC, lighting, energy meters, and pumping stations for optimized operational efficiency.',
    },
    problemSolved: {
      ar: 'معالجة الهدر الكثيف في فواتير الكهرباء وتكاليف التشغيل الناتجة عن التشغيل العشوائي للمكيفات والإنارة، مع استبدال الصيانة اليدوية بالمراقبة الآلية للأعطال ودرجات الحرارة في الوقت الفعلي.',
      en: 'Eliminating energy waste and excessive utility bills caused by uncoordinated mechanical runtimes, while replacing manual oversight with automated predictive telemetry.',
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    capabilities: {
      ar: [
        'مراقبة وتحكم مركزي في محطات التكييف المركزي (Chillers, AHUs, FCUs, VAVs)',
        'جداول زمنية ذكية لتشغيل وإيقاف الأحمال الكهربائية والإنارة بحسب ساعات العمل الفعلية',
        'رصد ومراقبة استهلاك الطاقة وتوليد تقارير بيانية تفاعلية لرفع كفاءة الاستهلاك',
        'لوحات تحكم رسومية تفاعلية تعرض حالة المعدات ودرجات الحرارة وضغوط الهواء لحظة بلحظة',
        'تنبيهات فورية عند حدوث أعطال في مضخات المياه، المولدات، أو ارتفاع درجات حرارة غرف السيرفرات',
      ],
      en: [
        'Centralized telemetry and closed-loop control of HVAC chillers, AHUs, FCUs, and VAV units',
        'Automated time scheduling aligning electrical lighting and cooling with actual working hours',
        'Real-time power monitoring and automated energy analytics reporting to trim peak demand',
        'Dynamic interactive graphical floor plans indicating equipment status, temperatures, and pressures',
        'Instant alarm notifications for pump trip events, generator faults, and server room thermal drift',
      ],
    },
    sectors: {
      ar: ['الأبراج والمباني الإدارية الحديثة', 'المستشفيات والمراكز الجراحية', 'الفنادق والمنتجعات السياحية', 'المصانع والمستودعات الدوائية', 'المراكز التجارية والمولات'],
      en: ['Commercial Office Towers', 'Hospitals & Surgical Centers', 'Hotels & Luxury Resorts', 'Pharmaceutical & Cleanroom Plants', 'Shopping Malls & Retail Centers'],
    },
    components: {
      ar: [
        'وحدات تحكم رقمية مباشرة معمارية (Direct Digital Controllers - DDC)',
        'حساسات حرارة ورطوبة وضغط تفاضلي وجودة هواء (CO2/VOC) معتمدة للمباني',
        'محابس ومحركات تحكم آلية (Motorized Valves & Damper Actuators)',
        'عدادات طاقة كهربائية ذكية تدعم بروتوكولات Modbus و بروتوكولات الأتمتة المفتوحة',
        'محطة عمل وخادم مركزي مثبت عليه برمجيات إدارة المبنى (BMS Server Workstation)',
      ],
      en: [
        'Modular Direct Digital Controllers (DDC) with native fieldbus and IP communications',
        'Calibrated duct/room temperature, humidity, differential pressure, and indoor air quality sensors',
        'Proportional motorized control valves and electronic damper actuators',
        'Digital multi-function power meters communicating over Modbus RTU / Fieldbus',
        'Enterprise BMS server software suite with web-based multi-user visualization client',
      ],
    },
    designInputs: {
      ar: [
        'المخططات الميكانيكية والتكييف وجداول معدات التبريد (Chiller / AHU / FCU Schedules)',
        'المخططات الكهربائية للوحات التوزيع ولوحات تشغيل المحركات (MCC Panels)',
        'قائمة النقاط الهندسية المراد مراقبتها والتحكم بها (Input/Output Points Schedule)',
        'اشتراطات بروتوكول الاتصال المفضل للمنشأة (Fieldbus, Modbus, IP)',
      ],
      en: [
        'Mechanical HVAC schematics and equipment schedules (Chiller, AHU, FCU, Exhaust Fans)',
        'Single-line electrical schematics and Motor Control Center (MCC) interlock drawings',
        'Target Input/Output (I/O) control points list (Physical DI/DO/AI/AO and Software Points)',
        'Specified communication protocol standards (e.g., native Fieldbus/IP, Modbus, or MQTT)',
      ],
    },
    standards: [],
    deliverables: {
      ar: [
        'جدول النقاط التفصيلي للتحكم والمراقبة (Comprehensive BMS Points List)',
        'مخططات التحكم والمخططات السلكية الصاعدة (DDC Panel Wiring & Network Topology Riser)',
        'واجهات التحكم الرسومية المخصصة للمنشأة (Custom Graphical User Interface)',
        'مخططات التثبيت كما تم التنفيذ وتقارير المعايرة الميدانية (As-Built & Sensor Calibration Reports)',
        'برنامج تدريب المشغلين ودليل الصيانة الوقائية للأنظمة الميكانيكية',
      ],
      en: [
        'Comprehensive BMS Input/Output (I/O) Points Schedule and sequence of operations',
        'DDC control panel schematics and field-bus riser topology drawings',
        'Tailored 2D/3D graphical plant displays and floor plan dashboard interfaces',
        'Final As-Built documentation and field sensor calibration verification sheets',
        'Facility engineering training curriculum and preventive maintenance operation manuals',
      ],
    },
    integrations: {
      ar: [
        'التكامل مع وحدات التكييف عبر بروتوكولات الأتمتة المفتوحة و Modbus لقراءة درجات الحرارة والأعطال',
        'الربط مع لوحة إنذار الحريق لتشغيل مراوح سحب الدخان وقطع التكييف آلياً',
        'التكامل مع عدادات الطاقة الرقمية لمتابعة استهلاك الكهرباء وتحديد ساعات الذروة',
        'الربط مع أنظمة إدارة المرافق والصيانة الوقائية (CAFM / CMMS)',
      ],
      en: [
        'Direct interface with HVAC chillers and VRF systems over industrial IP protocols for rich operational metrics',
        'Safety interlock with fire alarm panel to activate stairwell pressurization and smoke exhaust',
        'Integration with digital power meters for sub-metering and energy baseline trending',
        'Automated work-order generation via Computer-Aided Facility Management (CAFM) APIs',
      ],
    },
    faq: [
      {
        q: {
          ar: 'ما مقدار التوفير المتوقع في استهلاك الطاقة بعد تطبيق نظام BMS؟',
          en: 'What is the anticipated energy saving achievable with an automated BMS?',
        },
        a: {
          ar: 'يحقق نظام إدارة المباني عائداً سريعاً على الاستثمار من خلال توفير يتراوح عملياً بين 15% إلى 30% من استهلاك الكهرباء والتكييف، بفضل الجدولة التلقائية ومنع عمل المكيفات في أوقات فراغ المبنى وضبط أحمال التبريد حسب الإشغال.',
          en: 'BMS deployments typically yield documented energy savings of 15% to 30% in commercial facilities through automated runtime scheduling, setpoint trimming, and eliminating uncoordinated cooling in unoccupied zones.',
        },
      },
    ],
    relatedServices: ['structured-cabling', 'fire-alarm', 'cctv-ai-analytics'],
    relatedTool: 'estimator',
    seo: {
      title: {
        ar: 'أنظمة إدارة المباني الذكية BMS وأتمتة المرافق | تيك بكرة',
        en: 'Smart Building Management Systems (BMS) & Automation | Tech Bokra',
      },
      description: {
        ar: 'حلول أنظمة إدارة المباني BMS والتحكم في التكييف والطاقة ولوحات التحكم DDC للمؤسسات في مصر.',
        en: 'Enterprise BMS automation, DDC control panels, and HVAC energy optimization systems in Egypt.',
      },
    },
    status: 'live',
  },

  // -----------------------------------------------------------------------
  // [6 to 14] COMING SOON - PHYSICAL SECURITY (8 services)
  // -----------------------------------------------------------------------
  {
    slug: 'vms',
    category: 'security',
    estimatorGroup: 'cctv',
    title: { ar: 'منصات إدارة الفيديو المركزية والتسجيل السحابي (VMS)', en: 'Enterprise Video Management Systems (VMS)' },
    summary: { ar: 'منصات برمجية مركزية لإدارة آلاف الكاميرات والتسجيل الموزع مع إمكانية التوسع السحابي وتحليلات الفيديو المركزية.', en: 'Enterprise-grade software platforms orchestrating distributed camera streams, multi-tier storage, and centralized investigations.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['cctv-ai-analytics'],
    relatedTool: 'storage-calculator', toolPreset: { cameras: 64, resolution: '4k', days: 90 },
    seo: { title: { ar: 'منصات إدارة الفيديو المركزية VMS | تيك بكرة', en: 'Enterprise VMS Platforms | Tech Bokra' }, description: { ar: 'منصات VMS المركزية لإدارة أنظمة المراقبة في مصر.', en: 'Enterprise Video Management Software systems in Egypt.' } },
    status: 'coming-soon',
  },
  {
    slug: 'anpr-lpr',
    category: 'security',
    estimatorGroup: 'cctv',
    title: { ar: 'أنظمة قراءة لوحات المركبات والتحكم بالمداخل (ANPR/LPR)', en: 'Automatic Number Plate Recognition (ANPR / LPR)' },
    summary: { ar: 'كاميرات وخوارزميات متخصصة للتعرف التلقائي على لوحات السيارات وتنظيم فتح البوابات آلياً للمركبات المصرح لها.', en: 'Dedicated optical cameras and neural algorithms for automated license plate reading and barrier gate automation.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['cctv-ai-analytics', 'smart-parking-guidance'],
    relatedTool: 'none',
    seo: { title: { ar: 'أنظمة قراءة لوحات السيارات ANPR | تيك بكرة', en: 'ANPR Vehicle Plate Recognition | Tech Bokra' }, description: { ar: 'حلول قراءة لوحات السيارات والتحكم في بوابات المنشآت.', en: 'Automated Number Plate Recognition and vehicle gate control.' } },
    status: 'coming-soon',
  },
  {
    slug: 'time-attendance',
    category: 'security',
    estimatorGroup: 'access',
    title: { ar: 'أنظمة الحضور والانصراف الذكية وإدارة الدوام', en: 'Time & Attendance Management Systems' },
    summary: { ar: 'أجهزة بصمة وقارئات ذكية متصلة ببرمجيات الحضور والانصراف لحساب ساعات العمل والإضافي والربط مع أنظمة الرواتب.', en: 'Biometric and facial time clocks integrated with enterprise payroll engines to automate workforce shift tracking.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['access-control'],
    relatedTool: 'estimator',
    seo: { title: { ar: 'أنظمة الحضور والانصراف بالبصمة | تيك بكرة', en: 'Time & Attendance Systems | Tech Bokra' }, description: { ar: 'أجهزة وبرمجيات تسجيل الحضور والانصراف بالبصمة للشركات.', en: 'Biometric employee time and attendance systems in Egypt.' } },
    status: 'coming-soon',
  },
  {
    slug: 'guard-tour',
    category: 'security',
    estimatorGroup: 'access',
    title: { ar: 'أنظمة حراسة وتتبع جولات الأمن (Guard Tour)', en: 'Guard Tour Patrol Verification Systems' },
    summary: { ar: 'منظومات إلكترونية للتحقق من التزام أفراد الأمن بجولات الحراسة الدورية وتوثيق أوقات المرور بنقاط التفتيش.', en: 'Electronic checkpoint wand and RFID checkpoint verification tracking security patrol compliance in real time.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['access-control'],
    relatedTool: 'none',
    seo: { title: { ar: 'أنظمة متابعة جولات الحراسة والأمن | تيك بكرة', en: 'Electronic Guard Tour Systems | Tech Bokra' }, description: { ar: 'أنظمة تتبع جولات أفراد الحراسة والأمن للمنشآت والمجمعات.', en: 'Electronic security guard patrol tracking systems in Egypt.' } },
    status: 'coming-soon',
  },
  {
    slug: 'perimeter-protection',
    category: 'security',
    estimatorGroup: 'cctv',
    title: { ar: 'تأمين الأسوار وحماية المحيط الخارجي', en: 'Perimeter Intrusion Detection Systems (PIDS)' },
    summary: { ar: 'حواجز بصرية بالأشعة تحت الحمراء، كابلات استشعار الاهتزاز على الأسوار، وكاميرات حرارية لرصد التسلل قبل الوصول للمبنى.', en: 'Fence vibration sensors, infrared active photo beams, and radar sensors establishing multi-layered boundary defense.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['cctv-ai-analytics', 'thermal-cameras'],
    relatedTool: 'none',
    seo: { title: { ar: 'أنظمة تأمين الأسوار وحماية المحيط | تيك بكرة', en: 'Perimeter Intrusion Detection | Tech Bokra' }, description: { ar: 'حلول تأمين أسوار المنشآت الحيوية والمصانع ضد التسلل.', en: 'Advanced perimeter intrusion detection and boundary security.' } },
    status: 'coming-soon',
  },
  {
    slug: 'thermal-cameras',
    category: 'security',
    estimatorGroup: 'cctv',
    title: { ar: 'الكاميرات الحرارية والرصد الصناعي والأمني', en: 'Thermal Imaging & Industrial Radiometric Cameras' },
    summary: { ar: 'كاميرات حرارية دقيقة لرصد درجات الحرارة الزائدة في المحولات والمعدات، والرصد الأمني الليلي في الظلام التام والظروف الجوية الصعبة.', en: 'Dual-spectrum optical and thermal sensors detecting overheating electrical assets and boundary intrusions in zero light.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['cctv-ai-analytics', 'perimeter-protection'],
    relatedTool: 'storage-calculator', toolPreset: { cameras: 16, resolution: '1080p', days: 30 },
    seo: { title: { ar: 'كاميرات مراقبة حرارية ورصد صناعي | تيك بكرة', en: 'Thermal Surveillance & Radiometric Cameras | Tech Bokra' }, description: { ar: 'كاميرات حرارية للكشف المبكر عن الحرائق والرصد الليلي للشركات.', en: 'Industrial thermal imaging and perimeter security cameras.' } },
    status: 'coming-soon',
  },
  {
    slug: 'visitor-counting-queue',
    category: 'security',
    estimatorGroup: 'cctv',
    title: { ar: 'أنظمة عد الزوار وتحليل كثافة الحشود', en: 'People Counting & Occupancy Analytics' },
    summary: { ar: 'مستشعرات ثلاثية الأبعاد وكاميرات مخصصة لحساب أعداد الزوار بدقة، ومراقبة الكثافة ونسب الإشغال في المتاجر والمنشآت العامة.', en: 'Stereoscopic 3D sensors and AI optical counters measuring footfall traffic, dwell times, and area occupancies.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['cctv-ai-analytics', 'queue-management-software'],
    relatedTool: 'none',
    seo: { title: { ar: 'أنظمة عد الزوار وتحليل الكثافة | تيك بكرة', en: 'People Counting & Crowd Analytics | Tech Bokra' }, description: { ar: 'أنظمة بصرية لعد الزوار وتحليل أعداد الوافدين في المولات والمتاجر.', en: 'Optical footfall traffic counting and occupancy sensors.' } },
    status: 'coming-soon',
  },
  {
    slug: 'smart-parking-guidance',
    category: 'security',
    estimatorGroup: 'cctv',
    title: { ar: 'إرشاد وتوجيه المواقف الذكية (PGS)', en: 'Smart Parking Guidance Systems (PGS)' },
    summary: { ar: 'مستشعرات فوق صوتية وكاميرات مسارات لإرشاد السائقين نحو الأماكن الشاغرة عبر لوحات مضيئة وإشارات ملونة.', en: 'Ultrasonic bay sensors and LED directional signage guiding motorists directly to unoccupied parking stalls.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['parking-management-software', 'anpr-lpr'],
    relatedTool: 'none',
    seo: { title: { ar: 'أنظمة إرشاد المواقف الذكية PGS | تيك بكرة', en: 'Smart Parking Guidance Systems | Tech Bokra' }, description: { ar: 'حلول توجيه وإرشاد السيارات للمواقف الشاغرة في المولات والأبراج.', en: 'Intelligent parking guidance and vacancy monitoring solutions.' } },
    status: 'coming-soon',
  },

  // -----------------------------------------------------------------------
  // [15 to 17] COMING SOON - NETWORKING (3 services)
  // -----------------------------------------------------------------------
  {
    slug: 'data-center-racks',
    category: 'network',
    estimatorGroup: 'network',
    title: { ar: 'تجهيز كبائن الراك وغرف الخوادم (Data Center Racks)', en: 'Server Room & Data Center Rack Infrastructure' },
    summary: { ar: 'توريد كبائن خوادم وراك قياسية، توزيع مسارات الهواء الساخن والبارد، وحدات توزيع الطاقة الذكية (PDU)، ومراقبة البيئة المحيطة.', en: 'Turnkey server room fit-out featuring standard enterprise racks, aisle containment, intelligent PDUs, and environmental monitoring.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['structured-cabling', 'enterprise-switching'],
    relatedTool: 'estimator',
    seo: { title: { ar: 'تجهيز غرف الخوادم وكبائن الداتا سنتر | تيك بكرة', en: 'Server Room & Data Center Infrastructure | Tech Bokra' }, description: { ar: 'تجهيز كبائن الراك ووحدات PDU ومسارات الكابلات للداتا سنتر.', en: 'Turnkey server room and data center rack installation in Egypt.' } },
    status: 'coming-soon',
  },
  {
    slug: 'enterprise-switching',
    category: 'network',
    estimatorGroup: 'network',
    title: { ar: 'محولات الشبكة المدارة والتوجيه المؤسسي (Switching & Routing)', en: 'Enterprise Managed Switching & Core Routing' },
    summary: { ar: 'توريد وبرمجة محولات الشبكة الأساسية والفرعية (Core / Distribution / Access) مع تفعيل شبكات VLAN والأمان الشبكي المتقدم.', en: 'Hardware supply and configuration of resilient Layer 2/3 managed core, aggregation, and PoE access switching fabrics.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['structured-cabling', 'enterprise-wifi'],
    relatedTool: 'estimator',
    seo: { title: { ar: 'محولات الشبكة وسويتشات الشركات المدارة | تيك بكرة', en: 'Enterprise Network Switches & Routing | Tech Bokra' }, description: { ar: 'توريد وبرمجة سويتشات الشبكة المدارة ومحولات Core Switches للشركات.', en: 'Enterprise managed network switches and core routing infrastructure.' } },
    status: 'coming-soon',
  },
  {
    slug: 'enterprise-wifi',
    category: 'network',
    estimatorGroup: 'network',
    title: { ar: 'الشبكات اللاسلكية المؤسسية وحسابات التغطية (Wi-Fi)', en: 'Enterprise Wi-Fi & Predictive Heatmap Site Surveys' },
    summary: { ar: 'تصميم وتنفيذ شبكات Wi-Fi 6 و 7 عالية الكثافة للمباني الإدارية والفنادق، مدعومة بدراسات التغطية والخرائط الحرارية (Heatmaps).', en: 'High-density Wi-Fi 6/7 wireless networks for office campuses, backed by Ekahau RF predictive heatmaps and active spectrum surveys.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['enterprise-switching', 'structured-cabling'],
    relatedTool: 'estimator',
    seo: { title: { ar: 'شبكات واي فاي للشركات وتغطية الفنادق | تيك بكرة', en: 'Enterprise Wi-Fi & Site Survey Heatmaps | Tech Bokra' }, description: { ar: 'حلول الشبكات اللاسلكية ونقاط الوصول Access Points ودراسات التغطية.', en: 'Enterprise wireless networks and predictive Wi-Fi coverage surveys.' } },
    status: 'coming-soon',
  },

  // -----------------------------------------------------------------------
  // [18 to 24] COMING SOON - ELV (7 services - estimatorGroup: null, relatedTool: 'none')
  // -----------------------------------------------------------------------
  {
    slug: 'public-address-bgm',
    category: 'elv',
    estimatorGroup: null,
    title: { ar: 'الإذاعة العامة والصوتيات التنبيهية (PA / BGM)', en: 'Public Address & Background Music (PA/BGM)' },
    summary: { ar: 'أنظمة صوتية معيارية لبث النداءات العامة، الإعلانات الصوتية، والموسيقى الخلفية مع الربط بلوحات الإخلاء ومخارج الطوارئ.', en: 'Commercial public address, paging, and ambient background music systems engineered with emergency evacuation override.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['fire-alarm'],
    relatedTool: 'none',
    seo: { title: { ar: 'أنظمة الإذاعة العامة والصوتيات PA BGM | تيك بكرة', en: 'Public Address & Background Music | Tech Bokra' }, description: { ar: 'توريد وتركيب أنظمة الصوتيات والإذاعة الداخلية للمباني والمستشفيات.', en: 'Commercial audio paging and public address systems in Egypt.' } },
    status: 'coming-soon',
  },
  {
    slug: 'ip-intercom',
    category: 'elv',
    estimatorGroup: null,
    title: { ar: 'الاتصال الداخلي المرئي والمسموع (IP Intercom)', en: 'IP Video Intercom & Door Entry Stations' },
    summary: { ar: 'محطات نداء مرئية صوتية عند المداخل والمصاعد مجهزة بكاميرات عالية الدقة وتدعم الفتح عن بُعد عبر الهواتف والسنترالات.', en: 'SIP-compliant IP door entry stations with HD video and remote door unlock integration with VoIP PBX and smartphones.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['access-control'],
    relatedTool: 'none',
    seo: { title: { ar: 'أنظمة الانتركم المرئي الشبكي IP Intercom | تيك بكرة', en: 'IP Video Intercom Systems | Tech Bokra' }, description: { ar: 'أنظمة الانتركم المرئي الشبكي للمكاتب والكمبوندات السكنية.', en: 'IP video door entry and intercom systems for buildings.' } },
    status: 'coming-soon',
  },
  {
    slug: 'nurse-call',
    category: 'elv',
    estimatorGroup: null,
    title: { ar: 'أنظمة استدعاء التمريض للمستشفيات (Nurse Call)', en: 'Hospital Nurse Call Systems (IP & Wired)' },
    summary: { ar: 'منظومات استدعاء ذكية لأسرة المرضى وغرف العمليات متوافقة مع معايير المستشفيات لتسريع استجابة الفرق الطبية.', en: 'UL 1069 compliant acute care nurse call communications linking patient bedside units directly with nurse station consoles.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['central-clock', 'ip-intercom'],
    relatedTool: 'none',
    seo: { title: { ar: 'أنظمة استدعاء التمريض للمستشفيات | تيك بكرة', en: 'Hospital Nurse Call Systems | Tech Bokra' }, description: { ar: 'أنظمة استدعاء التمريض والطوارئ الطبية للمستشفيات والمراكز العلاجية.', en: 'Hospital nurse call and emergency notification systems in Egypt.' } },
    status: 'coming-soon',
  },
  {
    slug: 'central-clock',
    category: 'elv',
    estimatorGroup: null,
    title: { ar: 'منظومة التوقيت والساعات المركزية (Master Clock)', en: 'Centralized Master Clock Systems' },
    summary: { ar: 'أنظمة ساعات جدارية ورقمية متزامنة عبر بروتوكول NTP مع الأقمار الصناعية لتوحيد التوقيت بالمستشفيات والمدارس والمطارات.', en: 'NTP/GPS synchronized digital and analog master clock systems ensuring time uniformity across mission-critical facilities.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['nurse-call'],
    relatedTool: 'none',
    seo: { title: { ar: 'أنظمة الساعات المركزية الموحدة | تيك بكرة', en: 'Centralized Master Clock Systems | Tech Bokra' }, description: { ar: 'ساعات مركزية متزامنة عبر NTP للمستشفيات والمدارس والجهات الحكومية.', en: 'GPS and NTP synchronized master clock networks in Egypt.' } },
    status: 'coming-soon',
  },
  {
    slug: 'conference-room-av',
    category: 'elv',
    estimatorGroup: null,
    title: { ar: 'تجهيزات قاعات الاجتماعات الذكية والـ AV', en: 'Smart Conference Room Audio-Visual (AV)' },
    summary: { ar: 'حلول متكاملة للشاشات التفاعلية، كاميرات المؤتمرات الذكية ذات التتبع، ميكروفونات السقف المعلقة، وتجهيزات Teams و Zoom.', en: 'Integrated collaborative video conferencing suites, beamforming ceiling mics, interactive displays, and room touch controls.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['video-wall', 'digital-signage'],
    relatedTool: 'none',
    seo: { title: { ar: 'تجهيزات قاعات الاجتماعات الذكية AV | تيك بكرة', en: 'Smart Conference Room Audio-Visual | Tech Bokra' }, description: { ar: 'شاشات وكاميرات قاعات الاجتماعات وغرف الفيديو كونفرانس للشركات.', en: 'Corporate audio-visual systems and smart meeting room solutions.' } },
    status: 'coming-soon',
  },
  {
    slug: 'video-wall',
    category: 'elv',
    estimatorGroup: null,
    title: { ar: 'حوائط العرض وشاشات غرف المراقبة (Video Wall)', en: 'Control Room Video Walls & Display Matrices' },
    summary: { ar: 'شاشات عرض ضخمة بإطارات فائقة النحافة (Ultra-Narrow Bezel) ومصفوفات LED لغرف العمليات المركزية ومراكز المراقبة (SOC).', en: 'Seamless ultra-narrow bezel LCD and direct-view LED video wall matrices for 24/7 Security Operations Centers (SOC).' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['cctv-ai-analytics', 'vms'],
    relatedTool: 'none',
    seo: { title: { ar: 'شاشات غرف التحكم وحوائط العرض Video Wall | تيك بكرة', en: 'Control Room Video Walls | Tech Bokra' }, description: { ar: 'شاشات عرض غرف التحكم والمراقبة وحوائط العرض Video Wall للشركات.', en: 'Mission-critical control room video walls and matrix processors.' } },
    status: 'coming-soon',
  },
  {
    slug: 'digital-signage',
    category: 'elv',
    estimatorGroup: null,
    title: { ar: 'الشاشات واللوحات الرقمية التفاعلية (Digital Signage)', en: 'Commercial Digital Signage & Content Management' },
    summary: { ar: 'شاشات عرض تجارية وإعلانية مخصصة للعمل المتواصل مع نظام إدارة ونشر المحتوى سحابياً عبر الشبكة الداخلية.', en: 'High-brightness commercial displays managed via centralized cloud CMS for corporate messaging and retail promotion.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['conference-room-av'],
    relatedTool: 'none',
    seo: { title: { ar: 'الشاشات الإعلانية الرقمية Digital Signage | تيك بكرة', en: 'Digital Signage Displays & CMS | Tech Bokra' }, description: { ar: 'توريد وتركيب الشاشات الرقمية التفاعلية وأنظمة إدارة المحتوى.', en: 'Commercial digital signage hardware and content software.' } },
    status: 'coming-soon',
  },

  // -----------------------------------------------------------------------
  // [25 to 27] COMING SOON - SOFTWARE (3 services)
  // -----------------------------------------------------------------------
  {
    slug: 'queue-management-software',
    category: 'software',
    estimatorGroup: 'software',
    title: { ar: 'أنظمة إدارة الطوابير والانتظار الرقمي (QMS)', en: 'Queue Management Systems & Ticket Kiosks' },
    summary: { ar: 'شاشات وأجهزة حجز تذاكر الدور مع برمجيات لإدارة أوقات خدمة العملاء وتوجيه المراجعين وتقارير أداء الموظفين.', en: 'Multi-service ticketing kiosks, calling counter terminals, and real-time teller performance analytics software.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['digital-signage', 'visitor-counting-queue'],
    relatedTool: 'none',
    seo: { title: { ar: 'أنظمة إدارة الطوابير والانتظار QMS | تيك بكرة', en: 'Queue Management Systems | Tech Bokra' }, description: { ar: 'أجهزة تذاكر وشاشات وحلول تنظيم الطوابير للمؤسسات والبنوك.', en: 'Customer queue management kiosks and teller software.' } },
    status: 'coming-soon',
  },
  {
    slug: 'parking-management-software',
    category: 'software',
    estimatorGroup: 'software',
    title: { ar: 'برمجيات إدارة المواقف والمحاسبة الآلية', en: 'Parking Management & Revenue Control Software' },
    summary: { ar: 'منظومة إدارة أوقات ركن السيارات، التذاكر المشفرة، المحاسبة الآلية، وحسابات الاشتراكات الشهرية والتكامل مع بوابات ANPR.', en: 'Automated barrier access, barcode ticket dispensing, payment kiosks, and subscription management for paid parking facilities.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['smart-parking-guidance', 'anpr-lpr'],
    relatedTool: 'none',
    seo: { title: { ar: 'برمجيات إدارة مواقف السيارات والمحاسبة | تيك بكرة', en: 'Parking Revenue & Management Software | Tech Bokra' }, description: { ar: 'برمجيات إدارة بوابات ومواقف السيارات والمحاسبة الإلكترونية.', en: 'Parking access control, ticketing, and revenue management systems.' } },
    status: 'coming-soon',
  },
  {
    slug: 'bpa-workflow-automation',
    category: 'software',
    estimatorGroup: 'erp',
    title: { ar: 'أتمتة دورات العمل والعمليات التشغيلية (BPA)', en: 'Business Process & Workflow Automation (BPA)' },
    summary: { ar: 'برمجيات مخصصة لأتمتة النماذج والاعتمادات الإدارية والميدانية، ربط الأنظمة غير المتوافقة عبر APIs، وتكامل الفاتورة الإلكترونية.', en: 'Tailored enterprise software automating operational approval workflows, system integrations, and business process telemetry.' },
    capabilities: { ar: [], en: [] }, sectors: { ar: [], en: [] }, components: { ar: [], en: [] }, designInputs: { ar: [], en: [] }, standards: [], deliverables: { ar: [], en: [] }, integrations: { ar: [], en: [] }, faq: [], relatedServices: ['bms'],
    relatedTool: 'estimator',
    seo: { title: { ar: 'أتمتة العمليات ودورات العمل للشركات | تيك بكرة', en: 'Business Process & Workflow Automation | Tech Bokra' }, description: { ar: 'تطوير وتكامل البرمجيات وأتمتة دورات العمل التشغيلية للشركات.', en: 'Custom workflow automation and API system integrations in Egypt.' } },
    status: 'coming-soon',
  },
];

// =========================================================================
// 4. HELPER QUERY FUNCTIONS
// =========================================================================

/**
 * Returns a single sub-service by its unique slug.
 */
export function getServiceBySlug(slug: string): SubService | undefined {
  if (!slug) return undefined;
  return SUB_SERVICES.find((s) => s.slug === slug);
}

/**
 * Returns all sub-services belonging to a given category.
 */
export function getServicesByCategory(category: ServiceCategoryKey): SubService[] {
  return SUB_SERVICES.filter((s) => s.category === category);
}

/**
 * Returns the related sub-services objects for a given service.
 */
export function getRelatedServices(slug: string): SubService[] {
  const service = getServiceBySlug(slug);
  if (!service || !service.relatedServices || service.relatedServices.length === 0) {
    return [];
  }
  return service.relatedServices
    .map((rSlug) => getServiceBySlug(rSlug))
    .filter((s): s is SubService => s !== undefined)
    .map((s) => ({
      ...s,
      standards: s.standards.filter((std) => std.confirmed),
    }));
}

/**
 * Helper to generate contact dropdown options:
 * Category level options first (cctv/network/elv/software/turnkey),
 * followed by sub-services grouped by category.
 */
export interface ContactOption {
  id: string; // slug or legacy category key
  label: string;
  isCategory?: boolean;
  category?: ServiceCategoryKey;
}

export function getContactSelectOptions(lang: 'ar' | 'en'): {
  categories: ContactOption[];
  subServicesByCategory: Record<ServiceCategoryKey, ContactOption[]>;
} {
  const isAr = lang === 'ar';

  const categories: ContactOption[] = [
    {
      id: 'cctv',
      label: isAr
        ? 'أنظمة الأمن المادي (المراقبة بالكاميرات والتحكم في الدخول)'
        : 'Physical Security Systems (CCTV & Access Control)',
      isCategory: true,
      category: 'security',
    },
    {
      id: 'network',
      label: isAr
        ? 'البنية التحتية والشبكات ومراكز البيانات (الكابلات المنظمة وغرف الخوادم)'
        : 'Networking & IT Infrastructure (Structured Cabling & Server Rooms)',
      isCategory: true,
      category: 'network',
    },
    {
      id: 'elv',
      label: isAr
        ? 'أنظمة التيار الخفيف (الإنذار، الصوتيات، الاتصال الداخلي)'
        : 'Low Current / ELV Systems (Fire Alarm, PA/BGM, Intercom)',
      isCategory: true,
      category: 'elv',
    },
    {
      id: 'software',
      label: isAr
        ? 'البرمجيات والحلول الرقمية (تطبيقات مخصصة وتكامل الأنظمة)'
        : 'Software & Digital Solutions (Custom Apps, ERP & APIs)',
      isCategory: true,
      category: 'software',
    },
    {
      id: 'turnkey',
      label: isAr
        ? 'مشروعات متكاملة (أمن مادي + شبكات وبنية تحتية)'
        : 'Integrated Turnkey Project (Security & Infrastructure)',
      isCategory: true,
    },
  ];

  const subServicesByCategory: Record<ServiceCategoryKey, ContactOption[]> = {
    security: [],
    network: [],
    elv: [],
    software: [],
  };

  SUB_SERVICES.forEach((s) => {
    subServicesByCategory[s.category].push({
      id: s.slug,
      label: s.title[lang],
      category: s.category,
      isCategory: false,
    });
  });

  return { categories, subServicesByCategory };
}

export interface LegacyServiceItem {
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

export const DEFAULT_SERVICES_LIST_AR: LegacyServiceItem[] = [
  {
    id: "physical-security-systems",
    category: "security",
    iconName: "ShieldCheck",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    title: "أنظمة الأمن المادي (Physical Security Systems)",
    shortDesc: "تشمل حلول المراقبة بالكاميرات، وأنظمة التحكم في الدخول، والبوابات والحواجز، وإدارة الفيديو (VMS)؛ بما يتماشى مع احتياجات المنشأة ومتطلباتها التشغيلية.",
    points: [
      "كاميرات مراقبة شبكية عالية الدقة مع الرؤية الليلية والتغطية المحيطية وتحليلات الحركة",
      "أنظمة تحكم في الدخول بيومترية وكروت ذكية مع إدارة مركزية للصلاحيات",
      "بوابات مرور أفراد وحواجز آلية لتنظيم حركة المركبات في المنشآت",
      "أنظمة إدارة وتسجيل الفيديو (VMS) المركزية وحسابات سعات التخزين الهندسية",
    ],
    specs: [
      { title: "المواصفات الفنية", desc: "كاميرات IP متوافقة مع متطلبات المنشآت وأجهزة NVR مخصصة للأعمال المستمرة" },
      { title: "التكامل والسلامة", desc: "ربط متكامل مع حساسات إنذار الحريق وغرف المراقبة والتحكم" },
      { title: "الدعم والتشغيل", desc: "تسليم تشغيلي متكامل مع خيارات عقود الدعم الفني والصيانة الدورية" },
    ],
    deliverables: ["مخطط توزيع الكاميرات ونقاط التحكم في الدخول", "توريد وتركيب وبرمجة المنظومات والأجهزة", "تدريب المشغلين وتسليم وثائق التشغيل"],
  },
  {
    id: "networking-infrastructure",
    category: "network",
    iconName: "Network",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    title: "البنية التحتية والشبكات ومراكز البيانات (Networking & IT Infrastructure)",
    shortDesc: "تصميم وتنفيذ شبكات البيانات، والكابلات المنظمة (Structured Cabling)، وتجهيز غرف الخوادم، وحلول الربط الداخلي والخارجي؛ لضمان استقرار الاتصال واعتمادية بيئة العمل.",
    points: [
      "تمديد وتنظيم الكابلات الشبكية النحاسية والفايبر (Structured Cabling Cat6/Cat6A/Fiber)",
      "توريد وتركيب وبرمجة محولات الشبكة (Managed Switches) وأجهزة التوجيه والربط",
      "تجهيز كبائن الراك وغرف الخوادم وتوزيع مسارات الكابلات المحمية",
      "حلول تغطية الشبكات اللاسلكية المؤسسية (Enterprise Wi-Fi) للشركات والمباني الإدارية",
    ],
    specs: [
      { title: "المعايير الهندسية", desc: "مراعاة المواصفات القياسية لمسارات الكابلات والعزل" },
      { title: "الفحص والاختبار", desc: "إجراء اختبارات فحص خطوط الشبكة وتسليم تقارير التوصيل" },
      { title: "التجهيز الميداني", desc: "كبائن راك منظمة ومرقمة لسهولة الصيانة والتوسع المستقبلي" },
    ],
    deliverables: ["مخططات التمديد وتوزيع نقاط الشبكة التنفيذية", "تقارير فحص ومعايرة التوصيلات والخطوط", "ترقيم وتوثيق كبائن الخوادم ومسارات الربط"],
  },
  {
    id: "elv-systems",
    category: "elv",
    iconName: "Radio",
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
    title: "أنظمة التيار الخفيف (Low Current / ELV Systems)",
    shortDesc: "حلول متكاملة تشمل أنظمة الإنذار، والصوتيات، والاتصال الداخلي، والأنظمة المساندة؛ لدعم كفاءة التشغيل والسلامة داخل المنشأة.",
    points: [
      "توريد وتركيب أنظمة إنذار الحريق المعنونة والكشف المبكر طبقاً لاشتراطات السلامة",
      "أنظمة الصوتيات والإذاعة العامة والموسيقى الخلفية (Public Address & BGM)",
      "شبكات الاتصال الداخلي المرئي والمسموع (IP Intercom) للمنشآت والمكاتب",
      "تنسيق وتكامل أنظمة التيار الخفيف المساندة مع البنية التحتية للمشروع",
    ],
    specs: [
      { title: "الكود والسلامة", desc: "مراعاة المواصفات الفنية الهندسية واشتراطات السلامة المعمول بها" },
      { title: "التكامل التشغيلي", desc: "ربط تكاملي بين أنظمة الإنذار والتحكم بالدخول ومسارات الإخلاء" },
      { title: "الاعتمادية", desc: "مهمات وتجهيزات هندسية تدعم استمرارية العمل في الظروف التشغيلية المختلفة" },
    ],
    deliverables: ["مخططات المسارات والتوزيع الهندسي للأنظمة", "تركيب وبرمجة واختبار كفاءة عمل المنظومات", "تسليم تشغيلي وكتيبات التوثيق الفني"],
  },
  {
    id: "software-digital-solutions",
    category: "software",
    iconName: "Layers",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    title: "البرمجيات والحلول الرقمية (Software & Digital Solutions)",
    shortDesc: "تطوير نظم وبرمجيات مخصصة، وأتمتة العمليات، وتكامل الأنظمة وواجهات الربط (APIs)؛ لربط الحلول التقنية بالأهداف التشغيلية للمؤسسة.",
    points: [
      "تطوير تطبيقات الويب والمنصات الرقمية المخصصة لاحتياجات الأعمال",
      "أتمتة دورات العمل والعمليات التشغيلية والميدانية وربط الفرق",
      "تكامل الأنظمة وبناء وتوثيق واجهات الربط البرمجي (APIs)",
      "لوحات تحكم وتقارير تفاعلية لمتابعة الأداء وإدارة صلاحيات المستخدمين",
    ],
    specs: [
      { title: "المعمارية التقنية", desc: "بنية برمجية معيارية حديثة وقابلة للتوسع وفق نمو المؤسسة" },
      { title: "أمن البيانات", desc: "تطبيق معايير حماية البيانات والتشفير وصلاحيات الوصول الصارمة" },
      { title: "تجربة الاستخدام", desc: "تصميم واجهات عملية تسهل متابعة المهام وتدريب فرق العمل" },
    ],
    deliverables: ["نظام برمجي متكامل ومختبر وفق متطلبات العمل", "لوحة تحكم إدارية وتكامل واجهات الربط (API)", "نشر المنظومة وتدريب المستخدمين ووثائق التشغيل"],
  },
];

export const DEFAULT_SERVICES_LIST_EN: LegacyServiceItem[] = [
  {
    id: "physical-security-systems",
    category: "security",
    iconName: "ShieldCheck",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    title: "Physical Security Systems",
    shortDesc: "CCTV surveillance, biometric access control, vehicle barrier automation, and enterprise VMS platforms aligned with operational requirements.",
    points: [
      "High-definition IP surveillance with low-light night vision and motion analytics",
      "Biometric and smart-card access control with centralized permission management",
      "Pedestrian speed gates and automated vehicle barrier arms for site access regulation",
      "Enterprise video management systems (VMS) with precise storage calculations",
    ],
    specs: [
      { title: "Technical Standards", desc: "Commercial-grade IP cameras and standard NVR/storage appliances" },
      { title: "Interlock & Safety", desc: "Seamless integration with fire alarm systems and central control rooms" },
      { title: "Support & Operations", desc: "Turnkey handover backed by preventive maintenance and SLA support" },
    ],
    deliverables: ["Camera & Access Control Distribution Layout Drawings", "Hardware Supply, Mounting, Cabling & Commissioning", "Operator Training & Operational Technical Documentation"],
  },
  {
    id: "networking-infrastructure",
    category: "network",
    iconName: "Network",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    title: "Networking & IT Infrastructure",
    shortDesc: "Structured cabling, server room deployment, and managed enterprise switching for resilient, high-speed business connectivity.",
    points: [
      "Structured copper and optical fiber cabling (Cat6, Cat6A, single/multi-mode fiber)",
      "Supply, mounting, and VLAN configuration of managed enterprise network switches",
      "Server room rack enclosures, cable organizers, and protected pathway management",
      "Enterprise wireless network (Wi-Fi) coverage for administrative and commercial sites",
    ],
    specs: [
      { title: "Engineering Codes", desc: "Adherence to standard pathway separation and bend radius specifications" },
      { title: "Testing & Validation", desc: "Copper and optical channel testing with full link validation reports" },
      { title: "Field Organization", desc: "Clean labeled patch panels and racks designed for maintainability and scaling" },
    ],
    deliverables: ["As-Built Structured Cabling Schematics", "Channel Test Reports & Validation Sheets", "Rack Layout Documentation & Cable Termination Schedules"],
  },
  {
    id: "elv-systems",
    category: "elv",
    iconName: "Radio",
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
    title: "Low Current / ELV Systems",
    shortDesc: "Integrated fire alarm, public address, audio-visual distribution, and intercom systems safeguarding facility operations.",
    points: [
      "Addressable fire detection and alarm systems compliant with life-safety codes",
      "Public Address and Background Music (PA / BGM) acoustic sound distribution",
      "IP Intercom and internal communication systems for offices and commercial buildings",
      "Coordination of auxiliary low-current systems with facility infrastructure",
    ],
    specs: [
      { title: "Code Compliance", desc: "Alignment with life safety standards and approved project engineering specs" },
      { title: "System Interlock", desc: "Interlock integration between fire alarm, access control, and emergency egress" },
      { title: "Reliability", desc: "Standard hardware engineered for resilient continuous operations" },
    ],
    deliverables: ["Conduit Routing & Sound Distribution Layouts", "Installation, Configuration & Commissioning", "Operational Handover & User Manuals"],
  },
  {
    id: "software-digital-solutions",
    category: "software",
    iconName: "Layers",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    title: "Software & Digital Solutions",
    shortDesc: "Development of custom applications, workflow automation, and system integration via robust APIs to align technology with business goals.",
    points: [
      "Custom web application and portal development tailored to business requirements",
      "Operational workflow automation connecting field teams with management",
      "System integration and secure Application Programming Interfaces (APIs)",
      "Interactive management dashboards and role-based access management",
    ],
    specs: [
      { title: "Modern Architecture", desc: "Modern modular software architecture engineered to scale with business growth" },
      { title: "Data Security", desc: "Strict data privacy, encrypted communications, and role-based authentication" },
      { title: "Usability", desc: "Intuitive user experience tailored to increase operational staff productivity" },
    ],
    deliverables: ["Custom System Engineered to Specifications", "Admin Dashboard & API Integration", "Deployment, Staff Training & Technical Documentation"],
  },
];

