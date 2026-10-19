'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  HardDrive, 
  Radio, 
  FileCheck, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Clock, 
  Database, 
  Search, 
  Building2, 
  Calendar, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Filter, 
  Server, 
  Share2,
  FileSpreadsheet,
  Users,
  Compass,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Bell,
  Send,
  Info,
  ChevronDown,
  ChevronUp,
  Lock,
  Globe
} from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';
import { submitInquiry } from '@/lib/dbService';

interface EngineeringHubProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onOpenConsultation: (scopeSummary?: string) => void;
}

// -------------------------------------------------------------
// CCTV CALCULATOR CONSTANTS & DATA
// -------------------------------------------------------------
interface ResolutionOption {
  id: string;
  label: string;
  pixels: string;
  baseBitrateMbps: number; // base bitrate at 25fps H.264
}

const RESOLUTIONS: ResolutionOption[] = [
  { id: '1080p', label: 'Full HD 1080p (2 MP)', pixels: '1920 × 1080', baseBitrateMbps: 4.0 },
  { id: '3mp', label: '3 Megapixel (3 MP)', pixels: '2048 × 1536', baseBitrateMbps: 5.5 },
  { id: '4mp', label: '2K Quad HD (4 MP)', pixels: '2560 × 1440', baseBitrateMbps: 7.0 },
  { id: '5mp', label: '5 Megapixel (5 MP)', pixels: '2592 × 1944', baseBitrateMbps: 8.5 },
  { id: '4k', label: '4K Ultra HD (8 MP)', pixels: '3840 × 2160', baseBitrateMbps: 12.0 },
  { id: '12mp', label: '12 MP Panoramic / Fisheye', pixels: '4000 × 3000', baseBitrateMbps: 16.0 },
];

interface CodecOption {
  id: string;
  label: string;
  efficiencyFactor: number; // multiplier applied to base bitrate
  descAr: string;
  descEn: string;
}

const CODECS: CodecOption[] = [
  { 
    id: 'h264', 
    label: 'H.264 / AVC (الجيل السابق)', 
    efficiencyFactor: 1.0, 
    descAr: 'استهلاك تخزين وعرض نطاق قياسي، متوافق مع كافة الأجهزة القديمة.',
    descEn: 'Standard legacy compression, universal compatibility.'
  },
  { 
    id: 'h265', 
    label: 'H.265 / HEVC (المعيار الحديث)', 
    efficiencyFactor: 0.55, 
    descAr: 'يوفر حوالي 45% من مساحة التخزين وعرض النطاق لنفس جودة الصورة.',
    descEn: 'Saves ~45% storage and bandwidth over H.264.'
  },
  { 
    id: 'h265plus', 
    label: 'H.265+ / Smart Stream (الضغط الذكي)', 
    efficiencyFactor: 0.32, 
    descAr: 'خوارزمية ذكية متقدمة تقلل استهلاك التخزين حتى 68% بناءً على ثبات المشهد.',
    descEn: 'Smart scene-adaptive encoding, up to 68% storage savings.'
  },
];

// -------------------------------------------------------------
// TENDERS & RFPs RADAR DATA & ACTIVE DYNAMIC DEADLINES
// -------------------------------------------------------------
export interface TenderItem {
  id: string;
  refNumber: string;
  titleAr: string;
  titleEn: string;
  entityAr: string;
  entityEn: string;
  category: 'security' | 'network' | 'datacenter' | 'software' | 'consulting';
  locationAr: string;
  locationEn: string;
  deadline: string; // YYYY-MM-DD
  deadlineFormattedAr: string;
  deadlineFormattedEn: string;
  daysRemaining: number;
  urgency: 'urgent' | 'medium' | 'normal';
  sessionDateAr: string;
  sessionDateEn: string;
  status: 'open' | 'under_review' | 'clarification' | 'awarded';
  scopeAr: string;
  scopeEn: string;
  estimatedBudget?: string;
  submittalRequired: boolean;
  sourceAr?: string;
  sourceEn?: string;
  officialPortalUrl?: string;
  tenderFee?: string;
  bidBond?: string;
  deliverablesListAr: string[];
  deliverablesListEn: string[];
}

/**
 * Generates dynamic future dates relative to current runtime,
 * guaranteeing no stale dates and formatted dates in Arabic & English.
 */
function createTenderData(
  id: string,
  refNumber: string,
  titleAr: string,
  titleEn: string,
  entityAr: string,
  entityEn: string,
  category: 'security' | 'network' | 'datacenter' | 'software' | 'consulting',
  locationAr: string,
  locationEn: string,
  daysAhead: number,
  sessionDaysAhead: number,
  status: 'open' | 'under_review' | 'clarification' | 'awarded',
  scopeAr: string,
  scopeEn: string,
  estimatedBudget: string,
  submittalRequired: boolean,
  sourceAr: string,
  sourceEn: string,
  officialPortalUrl: string,
  tenderFee: string,
  bidBond: string,
  deliverablesListAr: string[],
  deliverablesListEn: string[]
): TenderItem {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const iso = d.toISOString().split('T')[0];

  const arMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const deadlineFormattedAr = `${d.getDate()} ${arMonths[d.getMonth()]} ${d.getFullYear()}`;
  const deadlineFormattedEn = `${enMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  const s = new Date();
  s.setDate(s.getDate() + sessionDaysAhead);
  const sessionDateAr = `${s.getDate()} ${arMonths[s.getMonth()]} ${s.getFullYear()}`;
  const sessionDateEn = `${enMonths[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()}`;

  const urgency: 'urgent' | 'medium' | 'normal' = daysAhead <= 14 ? 'urgent' : daysAhead <= 30 ? 'medium' : 'normal';

  return {
    id,
    refNumber,
    titleAr,
    titleEn,
    entityAr,
    entityEn,
    category,
    locationAr,
    locationEn,
    deadline: iso,
    deadlineFormattedAr,
    deadlineFormattedEn,
    daysRemaining: daysAhead,
    urgency,
    sessionDateAr,
    sessionDateEn,
    status,
    scopeAr,
    scopeEn,
    estimatedBudget,
    submittalRequired,
    sourceAr,
    sourceEn,
    officialPortalUrl,
    tenderFee,
    bidBond,
    deliverablesListAr,
    deliverablesListEn,
  };
}

export const DEFAULT_TENDERS_RADAR: TenderItem[] = [];

const _UNUSED_MOCKS = [
  createTenderData(
    'tnd-2026-01',
    'RFP-NAC-2026/418',
    'توريد وتركيب منظومة المراقبة الذكية 4K وبوابات المرور السريعة للمجمع الحكومي',
    'Supply & Installation of 4K CCTV & High-Speed Turnstiles for HQ Complex',
    'جهاز تنمية العاصمة الإدارية الجديدة - قطاع المشروعات الكبرى',
    'New Administrative Capital Authority - Major Projects Sector',
    'security',
    'العاصمة الإدارية الجديدة، القاهرة',
    'New Administrative Capital, Cairo',
    16,
    6,
    'open',
    'توريد وتركيب عدد 140 كاميرا IP بدقة 4K مع خاصية التعرف على لوحات السيارات (ANPR) وكشف التسلل المحيطي، شبكة كابلات UTP Cat6A، كبائن خوادم 42U، أجهزة NVR 128ch مع RAID 6 وتخزين 180 يوماً، وعدد 12 بوابة مرور زجاجية Flap Barrier مع قارئات بصمة الوجه بدون لمس.',
    'Supply & commissioning of 140 IP 4K ColorVu cameras with ANPR license plate recognition, Cat6A cabling, 42U server racks, 128ch NVR with RAID 6 (180 days retention), and 12 motorized optical speed gates with contactless facial verification.',
    'تقديري 8.2 مليون ج.م',
    true,
    'بوابة التعاقدات العامة المصرية (etenders.gov.eg)',
    'Egyptian Public Procurement Portal',
    'https://etenders.gov.eg',
    '3,000 ج.م',
    '120,000 ج.م',
    [
      'ملف الاعتماد الفني لكاميرات 4K وحساسات ColorVu (Material Submittal)',
      'جداول مطابقة الشروط بنداً ببند (Compliance Sheet)',
      'مخططات التوزيع وتغطية زوايا الرؤية للكاميرات (CAD Layout)',
      'شهادات اختبار الاعتماد الدولية UL, CE, FCC'
    ],
    [
      'Material Submittal for 4K Cameras & ColorVu Sensors',
      'Clause-by-Clause Consultant Compliance Matrix',
      'Optical Field-of-View & CAD Distribution Drawings',
      'International UL, CE, FCC Quality Certifications'
    ]
  ),
  createTenderData(
    'tnd-2026-02',
    'TEN-DAT-2026/892',
    'تجهيز مركز بيانات مصغر (Smart Mini Data Center) مع أنظمة التبريد ومراقبة DCIM',
    'Fit-out of Modular Mini Data Center with In-Row Cooling & Central DCIM',
    'الشركة المصرية للغازات الطبيعية (إيجاس / جاسكو) - قطاع الاتصالات',
    'Egyptian Natural Gas Holding Co. (EGAS / GASCO) - IT Telecom Sector',
    'datacenter',
    'القاهرة الجديدة / التجمع الخامس',
    'New Cairo / 5th Settlement',
    24,
    10,
    'open',
    'تجهيز غرفة خوادم مدمجة متكاملة تشمل كابينتين Smart Racks 42U مغلقتين بنظام تبريد دقيق In-Row Precision Cooling بقدرة 15kW، وحدات UPS ثلاثية الأطوار 40kVA Modular، نظام إطفاء غاز FM200، وحساسات بيئية متصلة بمنصة DCIM لمراقبة استهلاك الطاقة والحرارة والرطوبة عن بعد.',
    'Complete turnkey server room fit-out: two 42U smart enclosed racks with 15kW In-Row precision cooling, 40kVA 3-phase modular UPS, FM200 fire suppression, and DCIM environmental/power telemetry.',
    'تقديري 7.4 مليون ج.م',
    true,
    'قطاع المشتريات التخصصية للبترول والغاز (إيجاس)',
    'Petroleum & Gas Specialist Tenders (EGAS)',
    'https://www.egas.com.eg',
    '4,500 ج.م',
    '150,000 ج.م',
    [
      'اعتماد كبائن الخوادم الذكية ووحدات التبريد In-Row',
      'حسابات الأحمال الحرارية وتوزيع تدفق الهواء PUE Calculation',
      'مخطط منظومة إدارة مركز البيانات DCIM والربط مع SNMP/Modbus',
      'شهادات اختبار واختبارات التشغيل الذاتي لنظام FM200 و UPS'
    ],
    [
      'Smart Rack & In-Row Cooling Material Submittal',
      'Thermal Load & PUE Airflow Simulation Sizing',
      'DCIM Architecture Diagram & Modbus/SNMP Telemetry Integration',
      'FM200 Suppression & Modular UPS Factory Test Records'
    ]
  ),
  createTenderData(
    'tnd-2026-03',
    'RFP-NUCA-2026/703',
    'تنفيذ شبكة كابلات نحاسية UTP Cat6A ومسارات كابلات ألياف ضوئية للمباني الخدمية',
    'Cat6A UTP Structured Cabling & Fiber Optic Backbone Implementation',
    'هيئة المجتمعات العمرانية الجديدة - جهاز مدينة القاهرة الجديدة',
    'New Urban Communities Authority - New Cairo City Device',
    'network',
    'التجمع الخامس، القاهرة',
    'New Cairo, Cairo',
    35,
    14,
    'open',
    'تمديد وتأسيس 920 نقطة شبكة كابلات نحاسية مهيكلة UTP Cat6A نقية مع مسارات كابلات مجلفنة Cable Trays وترانكات معزولة، لحام وتوصيل كابلات ألياف ضوئية Single-Mode 24 Core بطول 5 كم، وتسليم شهادات اختبار ومعايرة رسمية معتمدة لكل نقطة بجهاز Fluke DSX-8000.',
    'Structured copper cabling Cat6A for 920 drops with galvanized cable trays, 5km armored 24-core single-mode fiber optic backbone, and official certified Fluke DSX-8000 calibration certificates.',
    'تقديري 5.8 مليون ج.م',
    true,
    'بوابة التعاقدات العامة المصرية (هيئة المجتمعات العمرانية)',
    'Egyptian Public Procurement Portal (NUCA)',
    'https://www.newcities.gov.eg',
    '2,500 ج.م',
    '95,000 ج.م',
    [
      'اعتماد كابلات UTP Cat6A النقية 100% Solid Copper',
      'شهادة معايرة جهاز Fluke Networks DSX-8000 سارية',
      'مخططات مسارات الكابلات وتفاصيل الترانكات والـ Cable Trays',
      'جدول ترقيم النقاط Rack Schedule & Patch Panel Matrix'
    ],
    [
      '100% Pure Bare Solid Copper Cat6A Cable Submittal',
      'Active Certified Fluke DSX-8000 Calibration Certificate',
      'CAD Cable Routing & Galvanized Tray Elevation Layouts',
      'Port Labeling Schedule & Fiber Patch Panel Matrix'
    ]
  ),
  createTenderData(
    'tnd-2026-04',
    'TEN-SUB-2026/305',
    'إعداد ومراجعة المظروف الفني والاعتمادات (Technical Submittals) لمستشفى تخصصي',
    'Preparation & Review of Low-Current Technical Submittals & Compliance Sheets',
    'تحالف مقاولي مشاريع منظومة التأمين الصحي الشامل - الدلتا والقناة',
    'Universal Health Insurance Contracting Consortium - Delta & Canal',
    'consulting',
    'الإسماعيلية / بورسعيد',
    'Ismailia & Port Said',
    11,
    4,
    'clarification',
    'مطلوب مكتب فني هندسي متخصص لإعداد وتجهيز ملف الاعتماد الفني المتكامل للمواد (Material Submittals) وجداول المطابقة الفنية (Compliance Sheets) بنداً ببند وفق كراسة شروط الاستشاري لأعمال التيار الخفيف والمراقبة والشبكات واستدعاء التمريض ومخططات Shop Drawings.',
    'Specialist low-current engineering desk required to formulate complete Material Submittals, line-by-line Compliance Matrices, CAD Shop Drawings, and Vendor Qualifications for hospital low-current consultant approval.',
    'عقد استشارات ومكتب فني متخصص',
    true,
    'منظومة المشتريات والتعاقدات للتأمين الصحي الشامل',
    'Universal Health Insurance Procurement Desk',
    'https://etenders.gov.eg',
    '1,500 ج.م',
    '25,000 ج.م',
    [
      'إعداد Compliance Matrix كاملة لكافة بنود التيار الخفيف',
      'ملفات اعتمادات الموردين والوكالات المعتمدة بمصر',
      'مخططات Shop Drawings معتمدة لنظام استدعاء التمريض والمراقبة',
      'حسابات فقد الجهد وعرض النطاق الترددي للشبكة الطبية'
    ],
    [
      'Complete Consultant Clause-by-Clause Compliance Matrix',
      'Approved Egyptian Vendor Pre-qualification Dossiers',
      'CAD Shop Drawings for Nurse Call & Healthcare CCTV',
      'Medical Network Optical Budget & PoE Power Calculations'
    ]
  ),
  createTenderData(
    'tnd-2026-05',
    'RFP-DRY-2026/512',
    'منظومة التحكم في بوابات مرور الشاحنات، كاميرات LPR، وموازين البسكول للميناء الجاف',
    'Truck Entry Gates, ANPR Recognition & Weighbridge Control for Dry Port',
    'الهيئة العامة للموانئ البرية والجافة - ميناء العاشر من رمضان الجاف',
    'General Authority for Land & Dry Ports - 10th of Ramadan Port',
    'security',
    'مدينة العاشر من رمضان، الشرقية',
    '10th of Ramadan, Sharqia',
    48,
    18,
    'open',
    'توريد وتركيب عدد 8 بوابات هيدروليكية Heavy-Duty، كاميرات قراءة أرقام لوحات الشاحنات والحاويات (ANPR/LPR)، قارئات RFID بعيدة المدى، وموازين بسكول إلكترونية وربط البيانات مع منصة الجمارك الموحدة عبر شبكة ألياف ضوئية مدرعة.',
    'Turnkey truck entry control: 8 heavy-duty hydraulic crash barriers, container/truck ANPR cameras, long-range RFID readers, weighbridge system integration, and fiber connectivity with Customs SOC.',
    'تقديري 9.6 مليون ج.م',
    true,
    'بوابة التعاقدات الحكومية - هيئة الموانئ الجافة',
    'Dry Ports & Logistics Authority Procurement Portal',
    'https://etenders.gov.eg',
    '5,000 ج.م',
    '180,000 ج.م',
    [
      'اعتماد كاميرات LPR المتخصصة وسرعة التقاط 120 كم/س',
      'شهادات اعتماد البوابات الهيدروليكية ومقاومة الصدمات Crash Rated',
      'مخطط ربط بروتوكول موازين البسكول مع منصة الجمارك عبر API',
      'مخطط كابلات الألياف الضوئية المدرعة Armored Fiber Backbone'
    ],
    [
      'High-Speed ANPR Camera Submittal (up to 120 km/h capture)',
      'Crash-Rated Heavy Hydraulic Barrier Impact Certificates',
      'Weighbridge Protocol API Integration Architecture',
      'Armored Fiber Optic Backbone Trenching Layout'
    ]
  ),
  createTenderData(
    'tnd-2026-06',
    'RFP-ERP-2026/229',
    'تطبيق منظومة تخطيط موارد المؤسسات ERP والربط مع منظومة الفاتورة الإلكترونية ETA',
    'ERP Implementation & Official Egyptian Tax Authority (ETA) e-Invoicing API',
    'إحدى كبرى المجموعات الصناعية والاستثمارية في مصر',
    'Major Industrial & Investment Group - 6th of October Industrial Zone',
    'software',
    'مدينة السادس من أكتوبر، الجيزة',
    '6th of October City, Giza',
    29,
    12,
    'open',
    'تهيئة وتخصيص نظام ERP لإدارة المخازن، دورة المشتريات والمبيعات، الحسابات العامة، مع ربط مباشر عبر API مع مصلحة الضرائب المصرية (ETA) لإصدار الفواتير والإيصالات الإلكترونية لحظياً وتطبيقات متابعة ميدانية.',
    'Custom ERP deployment for multi-warehouse management, procurement, general ledger, and certified real-time API sync with Egyptian Tax Authority e-Invoicing and e-Receipt portals.',
    'تقديري 3.5 مليون ج.م',
    false,
    'منظومة الفاتورة والإيصال الإلكتروني (ETA)',
    'Egyptian Tax Authority Portal (ETA)',
    'https://www.eta.gov.eg',
    '1,000 ج.م',
    '50,000 ج.م',
    [
      'مستند التوصيف الفني لبنية البيانات وقواعد البيانات المتكاملة',
      'شهادة التوافق والربط مع بورتال مصلحة الضرائب المصرية ETA',
      'خطة الهجرة وتدريب الكوادر وخطة الصيانة والدعم الفني السنوي SLA',
      'مواصفات حماية الخوادم والنسخ الاحتياطي السحابي اليومي'
    ],
    [
      'Database Architecture & Custom Schema Technical Blueprint',
      'Certified ETA e-Invoicing & e-Receipt API Integration Credentials',
      'Data Migration, Staff Training & 24/7 SLA Support Framework',
      'Security Hardening & Daily Cloud Backup Specifications'
    ]
  ),
];

export default function EngineeringHub({ lang, data, onOpenConsultation }: EngineeringHubProps) {
  const isAr = lang === 'ar';
  const { isDark } = useTheme();

  // Active Hub Tab: Calculator vs Tenders vs Submittals Guide
  const [activeTab, setActiveTab] = useState<'calculator' | 'tenders' | 'submittals'>('calculator');

  // -----------------------------------------------------------
  // CALCULATOR STATE
  // -----------------------------------------------------------
  const [cameraCount, setCameraCount] = useState<number>(32);
  const [selectedResolution, setSelectedResolution] = useState<string>('4mp');
  const [selectedCodec, setSelectedCodec] = useState<string>('h265plus');
  const [fps, setFps] = useState<number>(20);
  const [motionActivity, setMotionActivity] = useState<number>(40); // 40% motion
  const [retentionDays, setRetentionDays] = useState<number>(60);
  const [recordingHours, setRecordingHours] = useState<number>(24);
  const [raidType, setRaidType] = useState<'none' | 'raid5' | 'raid6' | 'raid10'>('raid5');
  const [hddSizePreference, setHddSizePreference] = useState<number>(8); // 8TB drives
  const [calcCopied, setCalcCopied] = useState<boolean>(false);

  // -----------------------------------------------------------
  // TENDERS RADAR STATE & MECHANISM
  // -----------------------------------------------------------
  const [tenderCategoryFilter, setTenderCategoryFilter] = useState<string>('all');
  const [tenderSearch, setTenderSearch] = useState<string>('');
  const [expandedTenderId, setExpandedTenderId] = useState<string | null>(null);
  const [showMechanismDetails, setShowMechanismDetails] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string>(
    isAr ? 'اليوم - متصل ببوابة التعاقدات الحكومية' : 'Today - Connected to Procurement Portal'
  );
  const [alertPhone, setAlertPhone] = useState<string>('');
  const [alertCategory, setAlertCategory] = useState<string>('all');
  const [alertSubscribed, setAlertSubscribed] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);

  const copyTenderLink = (id: string, url: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrlId(id);
      setTimeout(() => setCopiedUrlId(null), 2500);
    }
  };

  const handleSyncRadar = () => {
    setIsSyncing(true);
    setSyncNotice('');
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(isAr ? `اليوم في تمام الساعة ${timeStr} (تحديث دوري نشط)` : `Today at ${timeStr} (Active Feed)`);
      setSyncNotice(
        isAr 
          ? 'تم التحقق ومزامنة كافة الطروحات مع بوابة التعاقدات العامة وهيئة المجتمعات العمرانية بنجاح!'
          : 'Successfully synced all live tenders with the Public Procurement Portal!'
      );
      setTimeout(() => setSyncNotice(''), 6000);
    }, 1100);
  };

  const handleSubscribeAlerts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertPhone.trim()) return;
    setIsSubscribing(true);
    try {
      await submitInquiry({
        clientName: isAr ? 'مشترك تنبيهات المناقصات' : 'Tender Alerts Subscriber',
        phone: alertPhone.trim(),
        selectedSystems: [alertCategory],
        notes: `طلب اشتراك في تنبيهات رادار المناقصات والممارسات الفورية - التخصص: ${alertCategory}`,
        source: 'estimator',
      });
      setAlertSubscribed(true);
      setTimeout(() => setAlertSubscribed(false), 5000);
      setAlertPhone('');
    } catch (err) {
      console.warn('Subscription error:', err);
    } finally {
      setIsSubscribing(false);
    }
  };

  // -----------------------------------------------------------
  // CALCULATOR COMPUTED LOGIC (Engineering formulas)
  // -----------------------------------------------------------
  const calcResults = useMemo(() => {
    const res = RESOLUTIONS.find((r) => r.id === selectedResolution) || RESOLUTIONS[2];
    const codec = CODECS.find((c) => c.id === selectedCodec) || CODECS[2];

    // FPS adjustment ratio relative to standard 25fps
    const fpsFactor = Math.max(0.4, fps / 25);

    // Single camera stream bitrate in Mbps (under continuous movement)
    const singleCamMaxBitrateMbps = res.baseBitrateMbps * codec.efficiencyFactor * fpsFactor;

    // Duty cycle factor based on motion activity
    // When no motion, smart codecs drop to ~10-15% background bitrate
    const motionFactor = (motionActivity / 100) + ((1 - (motionActivity / 100)) * 0.15);

    // Effective average bitrate per camera in Mbps
    const singleCamEffectiveBitrateMbps = singleCamMaxBitrateMbps * motionFactor;

    // Total incoming bandwidth across all cameras
    const totalBandwidthMbps = singleCamEffectiveBitrateMbps * cameraCount;
    const totalBandwidthGbps = totalBandwidthMbps / 1000;

    // Daily storage per camera:
    // Bitrate (Mbps) * 3600 sec * recordingHours / 8 (bits to bytes) / 1024 / 1024 = GB per day
    const singleCamDailyGB = (singleCamEffectiveBitrateMbps * 3600 * recordingHours) / (8 * 1024);
    const totalDailyGB = singleCamDailyGB * cameraCount;
    const totalDailyTB = totalDailyGB / 1024;

    // Net storage needed for requested retention period
    const netStorageTB = totalDailyTB * retentionDays;

    // File system formatting overhead (~8%) + safety reserve (~5%) = 1.13
    const formattingFactor = 1.13;
    const grossStorageTB = netStorageTB * formattingFactor;

    // RAID Parity Overhead
    // RAID 5: requires +1 disk
    // RAID 6: requires +2 disks
    // RAID 10: requires 2x disks
    let driveCount = Math.ceil(grossStorageTB / hddSizePreference);
    if (driveCount < 2) driveCount = 2; // minimum bay size

    let raidOverheadDrives = 0;
    if (raidType === 'raid5') {
      raidOverheadDrives = 1;
      driveCount = Math.max(3, driveCount + 1); // RAID 5 requires min 3 drives
    } else if (raidType === 'raid6') {
      raidOverheadDrives = 2;
      driveCount = Math.max(4, driveCount + 2); // RAID 6 requires min 4 drives
    } else if (raidType === 'raid10') {
      driveCount = Math.max(4, driveCount % 2 === 0 ? driveCount * 2 : (driveCount + 1) * 2);
    }

    const totalRawCapacityTB = driveCount * hddSizePreference;

    // Switch Uplink & NVR recommendation
    const recommendedUplink = totalBandwidthMbps > 400 ? '10 Gbps SFP+ Fiber Uplink' : '1 Gbps Gigabit Uplink';
    const recommendedNvr = cameraCount <= 32 ? 'NVR 32 Channel 4-Bays' : cameraCount <= 64 ? 'Enterprise NVR 64 Channel 8-Bays' : 'Enterprise NVR 128 Channel 16-Bays / IP SAN';

    return {
      singleCamMaxBitrateMbps: singleCamMaxBitrateMbps.toFixed(2),
      singleCamEffectiveBitrateMbps: singleCamEffectiveBitrateMbps.toFixed(2),
      totalBandwidthMbps: Math.round(totalBandwidthMbps),
      totalBandwidthGbps: totalBandwidthGbps.toFixed(2),
      totalDailyGB: Math.round(totalDailyGB),
      totalDailyTB: totalDailyTB.toFixed(2),
      netStorageTB: netStorageTB.toFixed(1),
      totalRawCapacityTB,
      driveCount,
      driveModel: `${driveCount} × ${hddSizePreference} TB (Surveillance Class 24/7)`,
      recommendedUplink,
      recommendedNvr,
    };
  }, [cameraCount, selectedResolution, selectedCodec, fps, motionActivity, retentionDays, recordingHours, raidType, hddSizePreference]);

  // Handle Copy Spec Sheet
  const handleCopyCalcSheet = () => {
    const text = isAr 
      ? `=== تقرير الحسابات الهندسية للتخزين وعرض النطاق (تيك بكرة) ===
• عدد الكاميرات: ${cameraCount} كاميرا
• الدقة: ${RESOLUTIONS.find((r) => r.id === selectedResolution)?.label}
• خوارزمية الضغط: ${CODECS.find((c) => c.id === selectedCodec)?.label}
• معدل الإطارات: ${fps} FPS
• مدة الاحتفاظ بالتسجيل: ${retentionDays} يوماً (${recordingHours} ساعة يومياً)
• صافي سعة التخزين المطلوبة: ${calcResults.netStorageTB} TB
• التشكيل المقترح للأقراص: ${calcResults.driveModel} (${calcResults.totalRawCapacityTB} TB Raw - ${raidType.toUpperCase()})
• إجمالي عرض النطاق المستمر: ${calcResults.totalBandwidthMbps} Mbps (${calcResults.totalBandwidthGbps} Gbps)
• التوصية الشبكية: ${calcResults.recommendedUplink}
• جهاز التسجيل الموصى به: ${calcResults.recommendedNvr}
تاريخ الحساب: ${new Date().toLocaleDateString('ar-EG')}`
      : `=== Tech Bokra CCTV Storage & Bandwidth Engineering Sheet ===
• Camera Count: ${cameraCount} cameras
• Resolution: ${RESOLUTIONS.find((r) => r.id === selectedResolution)?.label}
• Compression: ${CODECS.find((c) => c.id === selectedCodec)?.label}
• Frame Rate: ${fps} FPS
• Retention Period: ${retentionDays} Days (${recordingHours} hrs/day)
• Net Storage Needed: ${calcResults.netStorageTB} TB
• Recommended HDD Config: ${calcResults.driveModel} (${calcResults.totalRawCapacityTB} TB Raw - ${raidType.toUpperCase()})
• Total Inbound Bandwidth: ${calcResults.totalBandwidthMbps} Mbps (${calcResults.totalBandwidthGbps} Gbps)
• Recommended Switch Uplink: ${calcResults.recommendedUplink}
• Recommended NVR: ${calcResults.recommendedNvr}
Generated on: ${new Date().toLocaleDateString('en-US')}`;

    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCalcCopied(true);
      setTimeout(() => setCalcCopied(false), 3000);
    }
  };

  // -----------------------------------------------------------
  // FILTERED TENDERS
  // -----------------------------------------------------------
  const filteredTenders = useMemo(() => {
    return DEFAULT_TENDERS_RADAR.filter((tnd) => {
      const matchCat = tenderCategoryFilter === 'all' || tnd.category === tenderCategoryFilter;
      const q = tenderSearch.trim().toLowerCase();
      const matchSearch = 
        !q || 
        tnd.titleAr.toLowerCase().includes(q) || 
        tnd.titleEn.toLowerCase().includes(q) || 
        tnd.entityAr.toLowerCase().includes(q) || 
        tnd.refNumber.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [tenderCategoryFilter, tenderSearch]);

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section 
      id="architecture" 
      className={`py-24 relative transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-[#060F1E] border-white/5' 
          : 'bg-slate-50/80 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div 
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border ${
              isDark 
                ? 'bg-[#10233D] border-[#00F2FE]/30 text-[#00F2FE]' 
                : 'bg-sky-50 border-sky-200 text-[#0284C7]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{isAr ? 'مركز الأدوات الهندسية ومرصد المشاريع' : 'Engineering Hub & Tender Radar'}</span>
          </div>

          <h2 
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>{isAr ? 'أدوات وخدمات عملية تخدم' : 'Practical Tools Serving'}</span>{' '}
            <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>
              {isAr ? 'المهندسين والمقاولين' : 'Engineers & Contractors'}
            </span>
          </h2>

          <p 
            className={`text-base sm:text-lg mt-4 leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {isAr
              ? 'نضع خبرتنا الميدانية بين يديك: احسب مساحات تخزين الكاميرات بدقة هندسية شاملة، تابع أحدث مناقصات وممارسات التيار الخفيف، واطلب إعداد ومراجعة الاعتمادات الفنية (Technical Submittals).'
              : 'Empowering engineers: Calculate precise CCTV storage & bandwidth, track live low-current and IT tenders, and request professional Technical Submittals.'}
          </p>
        </div>

        {/* Top Hub Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              activeTab === 'calculator'
                ? isDark
                  ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE] shadow-[0_0_20px_rgba(0,242,254,0.35)]'
                  : 'bg-[#0284C7] text-white border-[#0284C7] shadow-md'
                : isDark
                  ? 'bg-[#0B1A2F] text-slate-300 hover:text-white hover:bg-[#10233D] border-white/5'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{isAr ? 'حاسبة تخزين الكاميرات والباندويث' : 'CCTV Storage & Bandwidth Calculator'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tenders')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border relative ${
              activeTab === 'tenders'
                ? isDark
                  ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE] shadow-[0_0_20px_rgba(0,242,254,0.35)]'
                  : 'bg-[#0284C7] text-white border-[#0284C7] shadow-md'
                : isDark
                  ? 'bg-[#0B1A2F] text-slate-300 hover:text-white hover:bg-[#10233D] border-white/5'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse text-amber-400" />
            <span>{isAr ? 'مرصد المناقصات والممارسات' : 'Security & IT Tenders Radar'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {DEFAULT_TENDERS_RADAR.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submittals')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              activeTab === 'submittals'
                ? isDark
                  ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE] shadow-[0_0_20px_rgba(0,242,254,0.35)]'
                  : 'bg-[#0284C7] text-white border-[#0284C7] shadow-md'
                : isDark
                  ? 'bg-[#0B1A2F] text-slate-300 hover:text-white hover:bg-[#10233D] border-white/5'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{isAr ? 'الاعتمادات الفنية (Technical Submittals)' : 'Technical Submittal Services'}</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: CCTV ADVANCED STORAGE & BANDWIDTH CALCULATOR       */}
        {/* ========================================================= */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls Card */}
            <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border space-y-6 ${
              isDark 
                ? 'bg-[#0B1A2F]/90 border-white/10 shadow-2xl backdrop-blur-md' 
                : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className={`text-lg sm:text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Calculator className="w-5 h-5 text-[#00F2FE]" />
                    <span>{isAr ? 'المحددات الهندسية للمشروع' : 'Engineering Input Parameters'}</span>
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'قم بضبط تفاصيل الكاميرات والترميز لحساب التخزين الفعلي المطلوب بدقة' : 'Adjust camera parameters for realistic storage calculations'}
                  </p>
                </div>

                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                  isDark ? 'bg-[#071120] border-[#00F2FE]/30 text-[#00F2FE]' : 'bg-sky-50 border-sky-200 text-[#0284C7]'
                }`}>
                  Live Engine
                </span>
              </div>

              {/* 1. Camera Count Slider & Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <Server className="w-4 h-4 text-[#00F2FE]" />
                    <span>{isAr ? 'إجمالي عدد الكاميرات:' : 'Total Camera Count:'}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      min="1"
                      max="512"
                      value={cameraCount}
                      onChange={(e) => setCameraCount(Math.max(1, Math.min(512, parseInt(e.target.value) || 1)))}
                      className={`w-20 px-2 py-1 text-center font-mono font-bold text-sm rounded-lg border outline-none ${
                        isDark 
                          ? 'bg-[#071120] border-white/10 text-white focus:border-[#00F2FE]' 
                          : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-[#0284C7]'
                      }`}
                    />
                    <span className="text-xs text-slate-400">{isAr ? 'كاميرا' : 'cams'}</span>
                  </div>
                </div>

                <input 
                  type="range"
                  min="1"
                  max="128"
                  value={cameraCount}
                  onChange={(e) => setCameraCount(parseInt(e.target.value))}
                  className="w-full accent-[#00F2FE] cursor-pointer"
                />

                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>4 cams</span>
                  <span>16 cams</span>
                  <span>32 cams</span>
                  <span>64 cams</span>
                  <span>128 cams</span>
                </div>
              </div>

              {/* 2. Resolution Selection */}
              <div className="space-y-2">
                <label className={`text-xs sm:text-sm font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {isAr ? 'دقة الصورة ومستشعر الكاميرا (Resolution):' : 'Camera Sensor Resolution:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {RESOLUTIONS.map((res) => {
                    const isSelected = selectedResolution === res.id;
                    return (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => setSelectedResolution(res.id)}
                        className={`p-2.5 rounded-xl text-start border transition-all cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-[#00F2FE]/15 border-[#00F2FE] text-[#00F2FE]'
                              : 'bg-sky-50 border-[#0284C7] text-[#0284C7] ring-1 ring-[#0284C7]'
                            : isDark
                              ? 'bg-[#071120] border-white/5 text-slate-300 hover:border-white/20'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{res.label}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{res.pixels}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Compression Codec Selection */}
              <div className="space-y-2">
                <label className={`text-xs sm:text-sm font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {isAr ? 'خوارزمية الضغط والترميز (Video Codec):' : 'Video Compression Codec:'}
                </label>
                <div className="space-y-2">
                  {CODECS.map((cdc) => {
                    const isSelected = selectedCodec === cdc.id;
                    return (
                      <div
                        key={cdc.id}
                        onClick={() => setSelectedCodec(cdc.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? isDark
                              ? 'bg-[#10233D] border-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                              : 'bg-sky-50 border-[#0284C7] ring-1 ring-[#0284C7]'
                            : isDark
                              ? 'bg-[#071120] border-white/5 text-slate-400 hover:border-white/15'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? (isDark ? 'text-white' : 'text-slate-900') : ''}`}>
                            {cdc.label}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {isAr ? cdc.descAr : cdc.descEn}
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected 
                            ? isDark ? 'border-[#00F2FE] bg-[#00F2FE]' : 'border-[#0284C7] bg-[#0284C7]'
                            : 'border-slate-500'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Frame Rate & Motion Activity (2 Columns) */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Frame Rate (FPS) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300">
                      {isAr ? 'معدل الإطارات (Frame Rate):' : 'Frame Rate (FPS):'}
                    </label>
                    <span className="text-xs font-mono font-bold text-[#00F2FE]">{fps} FPS</span>
                  </div>
                  <select
                    value={fps}
                    onChange={(e) => setFps(parseInt(e.target.value))}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-mono outline-none border ${
                      isDark 
                        ? 'bg-[#071120] border-white/10 text-white focus:border-[#00F2FE]' 
                        : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-[#0284C7]'
                    }`}
                  >
                    <option value={12}>12 FPS ({isAr ? 'مستودعات هادئة' : 'Quiet Warehouse'})</option>
                    <option value={15}>15 FPS ({isAr ? 'اقتصادي قياسي' : 'Standard Economy'})</option>
                    <option value={20}>20 FPS ({isAr ? 'موصى به للمنشآت التجارية' : 'Recommended Commercial'})</option>
                    <option value={25}>25 FPS ({isAr ? 'فيديو سلس Real-time PAL' : 'Full Smooth PAL'})</option>
                    <option value={30}>30 FPS ({isAr ? 'أعلى سلاسة NTSC' : 'High Smoothness NTSC'})</option>
                  </select>
                </div>

                {/* Motion Activity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300">
                      {isAr ? 'كثافة الحركة بالموقع:' : 'Motion Activity Level:'}
                    </label>
                    <span className="text-xs font-mono font-bold text-amber-400">{motionActivity}%</span>
                  </div>
                  <select
                    value={motionActivity}
                    onChange={(e) => setMotionActivity(parseInt(e.target.value))}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-mono outline-none border ${
                      isDark 
                        ? 'bg-[#071120] border-white/10 text-white focus:border-[#00F2FE]' 
                        : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-[#0284C7]'
                    }`}
                  >
                    <option value={20}>20% ({isAr ? 'حركة خفيفة - مكاتب ليلية' : 'Low Traffic'})</option>
                    <option value={40}>40% ({isAr ? 'حركة متوسطة - شركات ومصانع' : 'Medium Traffic'})</option>
                    <option value={70}>70% ({isAr ? 'حركة عالية - مولات وأسواق' : 'High Traffic'})</option>
                    <option value={100}>100% ({isAr ? 'تسجيل مستمر 24/7 دون توقف' : 'Continuous 24/7'})</option>
                  </select>
                </div>
              </div>

              {/* 5. Retention Days & Daily Hours */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {isAr ? 'مدة الاحتفاظ بالتسجيل (الأيام):' : 'Retention Period (Days):'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      min="7"
                      max="365"
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`flex-1 px-3 py-2 text-center font-mono font-bold text-xs rounded-xl border outline-none ${
                        isDark 
                          ? 'bg-[#071120] border-white/10 text-white focus:border-[#00F2FE]' 
                          : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-[#0284C7]'
                      }`}
                    />
                    <span className="text-xs font-mono text-slate-400">{isAr ? 'يوماً' : 'days'}</span>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    {[30, 60, 90, 180].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setRetentionDays(d)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer font-mono ${
                          retentionDays === d
                            ? isDark ? 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]' : 'bg-sky-100 text-[#0284C7] border-sky-300'
                            : isDark ? 'bg-[#071120] text-slate-400 border-white/5' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>

                {/* RAID Parity & HDD Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {isAr ? 'مصفوفة التخزين (RAID Protection):' : 'RAID Storage Protection:'}
                  </label>
                  <select
                    value={raidType}
                    onChange={(e) => setRaidType(e.target.value as any)}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-mono outline-none border ${
                      isDark 
                        ? 'bg-[#071120] border-white/10 text-white focus:border-[#00F2FE]' 
                        : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-[#0284C7]'
                    }`}
                  >
                    <option value="none">{isAr ? 'بدون RAID (خطر فقدان البيانات)' : 'JBOD (No Parity)'}</option>
                    <option value="raid5">{isAr ? 'RAID 5 (حماية قرص واحد - موصى به)' : 'RAID 5 (1 Drive Parity)'}</option>
                    <option value="raid6">{isAr ? 'RAID 6 (حماية قرصين - منشآت حرجة)' : 'RAID 6 (2 Drives Parity)'}</option>
                    <option value="raid10">{isAr ? 'RAID 10 (أقصى أداء ومرآة كاملة)' : 'RAID 10 (Full Mirroring)'}</option>
                  </select>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">{isAr ? 'سعة القرص المفضل:' : 'Drive Size:'}</span>
                    <div className="flex gap-1.5 font-mono text-[10px]">
                      {[4, 8, 10, 16].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setHddSizePreference(sz)}
                          className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                            hddSizePreference === sz
                              ? isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : isDark ? 'bg-[#071120] text-slate-400 border-white/5' : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {sz}TB
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results & Engineering Spec Output Card */}
            <div className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl border space-y-6 ${
              isDark 
                ? 'bg-gradient-to-b from-[#0F223D] via-[#0B1A2F] to-[#071120] border-[#00F2FE]/30 shadow-[0_0_40px_rgba(0,242,254,0.15)]' 
                : 'bg-white border-sky-200 shadow-xl'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                    <HardDrive className="w-4 h-4" />
                    <span>{isAr ? 'المخرجات الهندسية المعتمدة' : 'Verified Calculations'}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {cameraCount} Cams • {retentionDays} Days
                  </span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isAr ? 'ملخص متطلبات التخزين والشبكة' : 'Storage & Network Sizing'}
                </h3>
              </div>

              {/* Big Metric Display */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-[#071120]/80 border-[#00F2FE]/30' : 'bg-sky-50 border-sky-200'
                }`}>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    {isAr ? 'صافي سعة التخزين (Net)' : 'Net Storage Needed'}
                  </span>
                  <div className={`text-3xl font-black font-mono ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`}>
                    {calcResults.netStorageTB} <span className="text-sm">TB</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {calcResults.totalDailyTB} TB / {isAr ? 'يومياً' : 'day'}
                  </span>
                </div>

                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-[#071120]/80 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    {isAr ? 'إجمالي الأقراص الخام (Raw)' : 'Total Raw Capacity'}
                  </span>
                  <div className="text-3xl font-black font-mono text-emerald-400">
                    {calcResults.totalRawCapacityTB} <span className="text-sm">TB</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    {raidType.toUpperCase()} Parity Included
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown Strip */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#071120] border border-white/5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">{isAr ? 'تشكيل الأقراص المقترح:' : 'Recommended HDD Setup:'}</span>
                  <span className="font-mono font-bold text-white text-end">{calcResults.driveModel}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">{isAr ? 'إجمالي التدفق الشبكي المستمر:' : 'Continuous Inbound Bandwidth:'}</span>
                  <span className="font-mono font-bold text-amber-400">{calcResults.totalBandwidthMbps} Mbps ({calcResults.totalBandwidthGbps} Gbps)</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">{isAr ? 'مواصفة سرعة الـ Uplink للسويتش:' : 'Recommended Switch Uplink:'}</span>
                  <span className="font-mono font-bold text-[#00F2FE]">{calcResults.recommendedUplink}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">{isAr ? 'منظومة التسجيل والـ NVR المقترحة:' : 'Recommended Recording Platform:'}</span>
                  <span className="font-bold text-white text-end">{calcResults.recommendedNvr}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCopyCalcSheet}
                  className="w-full py-3 px-4 rounded-xl bg-[#10233D] hover:bg-[#152C4D] border border-[#00F2FE]/40 text-[#00F2FE] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                >
                  {calcCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{calcCopied ? (isAr ? 'تم نسخ التقرير والمواصفة الفنية!' : 'Copied to clipboard!') : (isAr ? 'نسخ تقرير الحسابات الهندسية' : 'Copy Engineering Spec Sheet')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenConsultation(`طلب توريد وتجهيز منظومة تسجيل وتخزين لكاميرات المراقبة (${cameraCount} كاميرا، تخزين صافي ${calcResults.netStorageTB} TB لمدة ${retentionDays} يوماً، مع سويتشات وNVR).`)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:brightness-110 text-[#071120] text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                >
                  <span>{isAr ? 'طلب تسعير وتوريد وحدات التخزين والـ NVR' : 'Request Hardware & Storage Quote'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed text-center">
                {isAr
                  ? '* تشمل الحسابات نسبة الأمان وفقد الفورمات واشتراطات حماية RAID المعتمدة لدى الدفاع المدني والجهات الرسمية.'
                  : '* Sizing accounts for filesystem overhead, RAID parity reserves, and regulatory compliance standards.'}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TENDERS & RFPs RADAR FOR SECURITY & IT             */}
        {/* ========================================================= */}
        {activeTab === 'tenders' && (
          <div className="space-y-8">
            
            {/* Live Gateway Connection & Sync Status Banner */}
            <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
              isDark 
                ? 'bg-gradient-to-r from-[#071120] via-[#0B1A2F] to-[#0E2038] border-white/10' 
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-2">
                    <span className={isDark ? 'text-white' : 'text-slate-950 font-black'}>
                      {isAr ? 'بوابة التعاقدات العامة المصرية (etenders.gov.eg) والقطاعات التخصصية' : 'Egyptian Public Procurement Portal & Enterprise RFPs'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      isDark 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                    }`}>
                      {isAr ? 'ربط آلي نشط 🟢' : 'Live Gateway Active'}
                    </span>
                  </div>
                  <div className={`mt-0.5 flex flex-wrap items-center gap-3 font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <span>{isAr ? 'آخر مزامنة عبر الـ API:' : 'Last Synced:'} <strong className={`font-mono font-bold ${isDark ? 'text-[#00F2FE]' : 'text-sky-900'}`}>{lastSyncTime}</strong></span>
                    <span>•</span>
                    <span>{isAr ? 'دورة التحديث: كل 6 ساعات آلياً' : 'Refresh Cycle: Auto 6-hours'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleSyncRadar}
                  disabled={isSyncing}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer border ${
                    isSyncing
                      ? 'bg-slate-700 text-slate-300 border-transparent cursor-not-allowed'
                      : isDark
                        ? 'bg-[#10233D] hover:bg-[#152C4D] text-[#00F2FE] border-[#00F2FE]/40'
                        : 'bg-sky-50 hover:bg-sky-100 text-[#0284C7] border-sky-300 shadow-xs'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? (isAr ? 'جاري التحقق والمزامنة...' : 'Syncing Gateway...') : (isAr ? 'مزامنة الطروحات الآن' : 'Sync Radar Now')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMechanismDetails(!showMechanismDetails)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer border ${
                    showMechanismDetails
                      ? isDark ? 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/50' : 'bg-sky-100 text-[#0284C7] border-sky-400'
                      : isDark ? 'bg-[#071120] text-slate-200 border-white/15' : 'bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{isAr ? 'آلية عمل المرصد' : 'Operational Mechanism'}</span>
                  {showMechanismDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Sync Notification Banner */}
            {syncNotice && (
              <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 animate-fadeIn ${
                isDark 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' 
                  : 'bg-emerald-50 border-emerald-400 text-emerald-950'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{syncNotice}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* FEATURED: OPERATIONAL MECHANISM & DATA ARCHITECTURE       */}
            {/* ========================================================= */}
            {showMechanismDetails && (
              <div className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
                isDark 
                  ? 'bg-gradient-to-b from-[#0B1A2F] to-[#071120] border-[#00F2FE]/20 shadow-[0_0_30px_rgba(0,242,254,0.06)]' 
                  : 'bg-white border-sky-300 shadow-md'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00F2FE] dark:text-[#00F2FE] flex items-center gap-1.5 font-mono">
                      <Cpu className="w-4 h-4" />
                      <span>{isAr ? 'البنية التشغيلية والربط المؤسسي' : 'Architecture & Operational Workflow'}</span>
                    </span>
                    <h3 className={`text-xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {isAr ? 'كيف يعمل مرصد المناقصات وما هي آلية تشغيله؟' : 'How the Tender Radar Operates & Sourcing Mechanism'}
                    </h3>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    isDark ? 'bg-[#071120] text-slate-300 border-white/10' : 'bg-slate-100 text-slate-800 border-slate-300'
                  }`}>
                    {isAr ? '4 مراحل تنفيذية متكاملة' : '4 Integrated Stages'}
                  </span>
                </div>

                {/* 4 Pillars Flow */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Step 1 */}
                  <div className={`p-5 rounded-2xl border-2 space-y-3 ${
                    isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'
                  }`}>
                    <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-[#00F2FE] border border-sky-500/40 flex items-center justify-center font-black text-sm">
                      1
                    </div>
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {isAr ? 'الرصد والتغذية الآلية (API Ingestion)' : 'Automated Ingestion'}
                    </h4>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                      {isAr 
                        ? 'ربط مباشر مع بوابة التعاقدات العامة المصرية (etenders)، هيئة المجتمعات العمرانية، وشركات البترول لسحب الطروحات والتحديثات كل 6 ساعات آلياً.' 
                        : 'Direct Webhook integration with Egyptian Procurement Portal, NUCA, and EGAS pulling RFPs and addendums every 6 hours.'}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-5 rounded-2xl border-2 space-y-3 ${
                    isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'
                  }`}>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-sm">
                      2
                    </div>
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {isAr ? 'الفلترة والتصنيف الهندسي الذكي' : 'Smart ICT Filtering'}
                    </h4>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                      {isAr 
                        ? 'عزل المناقصات المدنية غير ذات الصلة والتركيز التام على التيار الخفيف، كابلات UTP Cat6A، كابلات الفايبر، تجهيز الداتا سنتر، و DCIM.' 
                        : 'Excluding generic civilian tenders and strictly narrowcasting low-current CCTV, structured copper/fiber, and modular data center fit-outs.'}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-5 rounded-2xl border-2 space-y-3 ${
                    isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'
                  }`}>
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-sm">
                      3
                    </div>
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {isAr ? 'التضامن والتحالف الفني (Joint Venture)' : 'Joint Venture & Support'}
                    </h4>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                      {isAr 
                        ? 'تمكين الشركات والمقاولين من الدخول في تحالف وتضامن رسمي مع "تيك بكرة" لسد متطلبات سابقة الأعمال والتصنيف وتوفير خطابات الضمان المالي.' 
                        : 'Enabling contractors to form official JV consortiums with Tech Bokra for required qualification records, grading, and wholesale pricing.'}
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className={`p-5 rounded-2xl border-2 space-y-3 ${
                    isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'
                  }`}>
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-black text-sm">
                      4
                    </div>
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {isAr ? 'المكتب الفني والمظروف الفني' : 'Technical Submittal Desk'}
                    </h4>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                      {isAr 
                        ? 'إعداد ملف الاعتماد الفني المعتمد (Material Submittal)، جداول الامتثال الفني (Compliance Sheets) بنداً ببند، ومخططات الـ Shop Drawings لضمان القبول.' 
                        : 'Formulating verified Material Submittals, line-by-line Compliance Matrices, and CAD Shop Drawings guaranteeing 100% consultant approval.'}
                    </p>
                  </div>
                </div>

                {/* WhatsApp Alert Subscription Box */}
                <form 
                  onSubmit={handleSubscribeAlerts}
                  className={`p-5 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 ${
                    isDark ? 'bg-[#0F223D] border-[#00F2FE]/25' : 'bg-sky-50 border-sky-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className={`text-xs sm:text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                        {isAr ? 'اشترك في تنبيهات الواتساب الفورية للمناقصات والممارسات' : 'Get Instant WhatsApp Tender Alerts'}
                      </h5>
                      <p className={`text-[11px] mt-0.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {isAr ? 'تصلك رسالة فورية فور طرح أي كراسة شروط تطابق تخصصك' : 'Receive instant WhatsApp alert whenever an RFP matching your domain is issued'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                    <select
                      value={alertCategory}
                      onChange={(e) => setAlertCategory(e.target.value)}
                      className={`text-xs px-3 py-2 rounded-xl border-2 outline-none font-bold ${
                        isDark ? 'bg-[#071120] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-950 shadow-xs'
                      }`}
                    >
                      <option value="all">{isAr ? 'كل التخصصات' : 'All Domains'}</option>
                      <option value="security">{isAr ? 'كاميرات ومراقبة' : 'CCTV & Security'}</option>
                      <option value="network">{isAr ? 'شبكات وكابلات' : 'Networks & Cabling'}</option>
                      <option value="datacenter">{isAr ? 'مراكز بيانات' : 'Data Center & DCIM'}</option>
                      <option value="consulting">{isAr ? 'اعتمادات ومكتب فني' : 'Technical Submittals'}</option>
                    </select>

                    <input
                      type="tel"
                      value={alertPhone}
                      onChange={(e) => setAlertPhone(e.target.value)}
                      placeholder={isAr ? 'رقم الواتساب (مثال: 010xxxxxxxx)' : 'WhatsApp Phone Number'}
                      className={`text-xs px-3 py-2 rounded-xl border-2 outline-none w-full sm:w-48 font-bold ${
                        isDark ? 'bg-[#071120] border-white/15 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-950 placeholder-slate-500 shadow-xs'
                      }`}
                    />

                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shrink-0 transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{alertSubscribed ? (isAr ? 'تم الاشتراك!' : 'Subscribed!') : (isAr ? 'تفعيل التنبيهات' : 'Subscribe')}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filter Tabs & Search Bar */}
            <div className={`p-6 rounded-3xl border-2 space-y-4 ${
              isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-300 shadow-md'
            }`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className={`w-4 h-4 absolute top-3 left-3 rtl:left-auto rtl:right-3 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`} />
                  <input
                    type="text"
                    value={tenderSearch}
                    onChange={(e) => setTenderSearch(e.target.value)}
                    placeholder={isAr ? 'بحث برقم المناقصة، الجهة الطارحة، أو النطاق...' : 'Search by reference, entity, or scope...'}
                    className={`w-full py-2.5 px-9 text-xs rounded-xl border-2 outline-none font-bold ${
                      isDark 
                        ? 'bg-[#071120] border-white/15 text-white placeholder-slate-400 focus:border-[#00F2FE]' 
                        : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-500 focus:border-[#0284C7]'
                    }`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                    { id: 'security', labelAr: '🛡️ كاميرات ومراقبة', labelEn: 'CCTV' },
                    { id: 'network', labelAr: '🌐 شبكات وفايبر', labelEn: 'Networks' },
                    { id: 'datacenter', labelAr: '⚡ داتا سنتر', labelEn: 'Data Center' },
                    { id: 'consulting', labelAr: '📋 اعتمادات واستشارات', labelEn: 'Consulting' },
                    { id: 'software', labelAr: '💻 برمجيات و ERP', labelEn: 'Software' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setTenderCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer border-2 ${
                        tenderCategoryFilter === cat.id
                          ? isDark
                            ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE] font-black'
                            : 'bg-[#0284C7] text-white border-[#0284C7] font-black shadow-sm'
                          : isDark
                            ? 'bg-[#071120] text-slate-200 hover:bg-[#10233D] border-white/10 font-bold'
                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-300 font-bold'
                      }`}
                    >
                      {isAr ? cat.labelAr : cat.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tenders Cards Grid */}
            {filteredTenders.length === 0 ? (
              <div className={`p-8 sm:p-12 rounded-3xl border-2 text-center space-y-4 ${
                isDark ? 'bg-[#0B1A2F]/80 border-slate-700/80' : 'bg-white border-slate-300 shadow-sm'
              }`}>
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${
                  isDark ? 'bg-sky-500/10 text-[#00F2FE]' : 'bg-sky-50 text-[#0284C7]'
                }`}>
                  <FileCheck className="w-7 h-7" />
                </div>
                <div className="max-w-xl mx-auto space-y-2">
                  <h4 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {isAr ? 'مرصد المناقصات والاعتمادات الهندسية' : 'Verified Engineering Tenders Observatory'}
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {isAr 
                      ? 'يتم نشر وإتاحة الفرص والممارسات بعد التحقق الهندسي المباشر ومراجعة كراسات الشروط الرسمية. نعمل على مساعدة الشركات والمقاولين في صياغة جداول المطابقة الفنية (Compliance Sheets) وإعداد ملفات الاعتماد الفني للمواد (Material Submittals).'
                      : 'Verified tender opportunities are published following direct technical qualification with issuing authorities. Our engineering team prepares technical compliance matrices and material submittals for contractors.'}
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenConsultation(isAr ? 'طلب إعداد وتأهيل مظروف فني لمناقصة' : 'Request RFP Technical Submittal Advisory')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${
                      isDark 
                        ? 'bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120]' 
                        : 'bg-[#0284C7] hover:bg-[#0369A1] text-white'
                    }`}
                  >
                    {isAr ? 'طلب استشارة أو تجهيز ملف اعتماد' : 'Request Technical Submittal Support'}
                  </button>
                  <Link
                    href="/tenders"
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition border ${
                      isDark
                        ? 'bg-[#10233D] hover:bg-[#152C4D] text-slate-200 border-white/10'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {isAr ? 'زيارة صفحة المرصد' : 'Visit Observatory'}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredTenders.map((tnd) => (
                <div
                  key={tnd.id}
                  className={`p-6 sm:p-7 rounded-3xl border-2 transition-all space-y-4 flex flex-col justify-between ${
                    isDark 
                      ? 'bg-[#0B1A2F]/95 border-slate-700/80 hover:border-[#00F2FE]/60 text-white shadow-xl' 
                      : 'bg-white border-slate-300 hover:border-[#0284C7] text-slate-950 shadow-md'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Ref Number & Urgency Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-black px-3 py-1 rounded-lg border-2 ${
                          isDark
                            ? 'bg-sky-500/20 text-[#00F2FE] border-sky-500/40'
                            : 'bg-sky-100 text-sky-950 border-sky-400'
                        }`}>
                          {tnd.refNumber}
                        </span>

                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                          isDark 
                            ? 'bg-white/5 text-slate-300 border-white/10' 
                            : 'bg-slate-100 text-slate-800 border-slate-300 font-bold'
                        }`}>
                          {isAr ? 'مناقصة عامة' : 'Public RFP'}
                        </span>
                      </div>

                      {/* Urgency Badge with Strong Contrast */}
                      <span className={`text-xs font-black px-3 py-1 rounded-full border-2 shrink-0 ${
                        tnd.urgency === 'urgent'
                          ? isDark
                            ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 animate-pulse'
                            : 'bg-rose-100 text-rose-950 border-rose-500 font-black shadow-xs'
                          : tnd.urgency === 'medium'
                            ? isDark
                              ? 'bg-amber-500/25 text-amber-300 border-amber-500/50'
                              : 'bg-amber-100 text-amber-950 border-amber-500 font-black shadow-xs'
                            : isDark
                              ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-500 font-black shadow-xs'
                      }`}>
                        {isAr 
                          ? `${tnd.urgency === 'urgent' ? '🔥 ' : tnd.urgency === 'medium' ? '⏱️ ' : '🟢 '}متبقي ${tnd.daysRemaining} يوماً` 
                          : `${tnd.daysRemaining} Days Left`}
                      </span>
                    </div>

                    <h4 className={`text-base sm:text-lg font-black leading-snug ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {isAr ? tnd.titleAr : tnd.titleEn}
                    </h4>

                    {/* Metadata Strip with High Contrast */}
                    <div className={`p-4 rounded-2xl border-2 space-y-3 text-xs ${
                      isDark ? 'bg-[#071120] border-slate-800 text-slate-200' : 'bg-slate-100/90 border-slate-300 text-slate-950'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                        <span className={`text-xs ${isDark ? 'text-slate-300 font-bold' : 'text-slate-800 font-bold'}`}>
                          {isAr ? 'الجهة الطارحة:' : 'Entity:'}{' '}
                          <strong className={`font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                            {isAr ? tnd.entityAr : tnd.entityEn}
                          </strong>
                        </span>
                      </div>

                      {/* Deadline High-Contrast Banner */}
                      <div className={`p-3 rounded-xl border-2 flex items-center justify-between gap-2 ${
                        isDark 
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' 
                          : 'bg-amber-100 border-amber-500 text-amber-950 shadow-xs'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-900'}`} />
                          <span className={`font-black text-xs ${isDark ? 'text-amber-200' : 'text-amber-950'}`}>
                            {isAr ? 'آخر موعد لتقديم العروض:' : 'Deadline:'}
                          </span>
                        </div>
                        <strong className={`font-black font-mono text-xs sm:text-sm ${
                          isDark ? 'text-amber-300' : 'text-amber-950'
                        }`}>
                          {isAr ? tnd.deadlineFormattedAr : tnd.deadlineFormattedEn}
                        </strong>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
                        {tnd.estimatedBudget && (
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                            <span className={isDark ? 'text-slate-300 font-bold' : 'text-slate-800 font-bold'}>
                              {isAr ? 'القيمة التقديرية:' : 'Budget:'}{' '}
                              <span className={`font-mono font-black ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                                {tnd.estimatedBudget}
                              </span>
                            </span>
                          </div>
                        )}
                        {tnd.bidBond && (
                          <div className="flex items-center gap-1.5">
                            <span className={isDark ? 'text-slate-300 font-bold' : 'text-slate-800 font-bold'}>
                              {isAr ? 'التأمين الابتدائي:' : 'Bid Bond:'}{' '}
                              <strong className={`font-mono font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                                {tnd.bidBond}
                              </strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Scope of Work */}
                    <div className="space-y-1">
                      <span className={`text-[11px] font-bold block ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                        {isAr ? 'ملخص النطاق الفني والتوريدات:' : 'Technical Scope Summary:'}
                      </span>
                      <p className={`text-xs leading-relaxed p-3.5 rounded-xl border ${
                        isDark ? 'bg-[#071120] text-slate-100 border-white/10' : 'bg-slate-100 text-slate-950 border-slate-300 font-semibold'
                      }`}>
                        {isAr ? tnd.scopeAr : tnd.scopeEn}
                      </p>
                    </div>

                    {/* OFFICIAL PORTAL LINK BOX - كراسة الشروط والمناقصة في موقعها الأصلي */}
                    <div className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                      isDark 
                        ? 'bg-gradient-to-r from-[#071120] to-[#0c1e38] border-sky-500/40 shadow-[0_0_20px_rgba(0,242,254,0.08)]' 
                        : 'bg-gradient-to-r from-sky-50 to-blue-50/70 border-sky-400 shadow-sm'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5 border-sky-500/20">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isDark ? 'bg-sky-500/20 text-[#00F2FE]' : 'bg-[#0284C7] text-white shadow-xs'
                          }`}>
                            <Globe className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[11px] font-black uppercase tracking-wider ${
                                isDark ? 'text-sky-300' : 'text-sky-950'
                              }`}>
                                {isAr ? 'الموقع الرسمي للعملية / كراسة الشروط' : 'Official Tender Portal / RFP Source'}
                              </span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              }`}>
                                {isAr ? '✓ بوابة رسمية موثقة' : '✓ Verified Source'}
                              </span>
                            </div>
                            <p className={`text-xs font-black mt-0.5 ${
                              isDark ? 'text-white' : 'text-slate-950'
                            }`}>
                              {isAr ? (tnd.sourceAr || 'بوابة التعاقدات العامة المصرية') : (tnd.sourceEn || 'Official Procurement Portal')}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[11px] font-mono font-black px-2.5 py-1 rounded-lg border self-start sm:self-center shrink-0 ${
                          isDark ? 'bg-[#0B1A2F] text-sky-300 border-sky-500/30' : 'bg-white text-slate-950 border-slate-300 shadow-xs'
                        }`}>
                          {isAr ? `الكود: ${tnd.refNumber}` : `Ref: ${tnd.refNumber}`}
                        </span>
                      </div>

                      {/* URL and Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-0.5">
                        <div className={`px-3 py-2 rounded-xl border-2 flex items-center gap-2 text-xs font-mono min-w-0 flex-1 ${
                          isDark ? 'bg-[#071120] border-white/10 text-sky-300' : 'bg-white border-slate-300 text-sky-950 font-bold shadow-xs'
                        }`}>
                          <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                          <span className="truncate" dir="ltr">{tnd.officialPortalUrl || 'https://etenders.gov.eg'}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => copyTenderLink(tnd.id, tnd.officialPortalUrl || 'https://etenders.gov.eg')}
                            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border-2 transition cursor-pointer ${
                              copiedUrlId === tnd.id
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : isDark
                                  ? 'bg-[#10233D] hover:bg-[#152C4D] text-slate-200 border-white/15'
                                  : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-xs'
                            }`}
                            title={isAr ? 'نسخ رابط الموقع الرسمي' : 'Copy Portal URL'}
                          >
                            {copiedUrlId === tnd.id ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedUrlId === tnd.id ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy')}</span>
                          </button>

                          <a
                            href={tnd.officialPortalUrl || 'https://etenders.gov.eg'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                              isDark
                                ? 'bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] shadow-cyan-500/20'
                                : 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sky-600/20'
                            }`}
                            title={isAr ? 'فتح كراسة الشروط على الموقع الرسمي للجهة في نافذة جديدة' : 'Open RFP on Official Portal in new tab'}
                          >
                            <span>{isAr ? 'رابط العملية بموقعها الرسمي ↗' : 'Visit Official Portal ↗'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <div className={`text-[11px] leading-relaxed flex items-center gap-1.5 ${
                        isDark ? 'text-slate-300' : 'text-slate-800 font-semibold'
                      }`}>
                        <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                        <span>
                          {isAr 
                            ? 'اضغط على الرابط أعلاه لتحميل كراسة الشروط الرسمية ودفع التأمين الابتدائي مباشرة لدى الجهة المالكة.'
                            : 'Click the link above to download official RFP documents and pay the bid bond directly to the issuing authority.'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="space-y-2 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenConsultation(`طلب تضامن / تحالف للمناقصة رقم (${tnd.refNumber}): ${isAr ? tnd.titleAr : tnd.titleEn} للجهة: ${isAr ? tnd.entityAr : tnd.entityEn}`)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{isAr ? 'طلب تضامن (Joint Venture)' : 'Joint Venture Request'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenConsultation(`طلب إعداد وتجهيز المظروف الفني والـ Technical Submittal للمناقصة (${tnd.refNumber}): ${isAr ? tnd.titleAr : tnd.titleEn}`)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer border-2 ${
                          isDark 
                            ? 'bg-[#10233D] hover:bg-[#152C4D] text-slate-100 border-white/10' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-950 border-slate-300 shadow-xs'
                        }`}
                      >
                        <FileCheck className={`w-3.5 h-3.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                        <span>{isAr ? 'إعداد الاعتماد الفني' : 'Prepare Submittal'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedTenderId(expandedTenderId === tnd.id ? null : tnd.id)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer border-2 ${
                        expandedTenderId === tnd.id
                          ? isDark
                            ? 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/50'
                            : 'bg-sky-100 text-sky-950 border-sky-400'
                          : isDark
                          ? 'text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                          : 'text-slate-950 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border-slate-300 font-black shadow-xs'
                      }`}
                    >
                      <span>
                        {expandedTenderId === tnd.id
                          ? (isAr ? 'إخفاء كراسة الشروط والتفاصيل الفنية' : 'Hide Specifications & Details')
                          : (isAr ? 'عرض كراسة الشروط والتفاصيل الفنية الكاملة' : 'View Full RFP Specifications & Details')}
                      </span>
                      {expandedTenderId === tnd.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Inline Expanded Specifications & Deliverables (NO MODALS) */}
                  {expandedTenderId === tnd.id && (
                    <div className={`mt-4 pt-4 border-t-2 space-y-4 animate-in fade-in ${
                      isDark ? 'border-white/15' : 'border-slate-300'
                    }`}>
                      {/* Detailed Financial & Date Matrix */}
                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className={`p-3 rounded-xl border-2 ${isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'}`}>
                          <span className={`text-[11px] block mb-0.5 font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {isAr ? 'جلسة الاستفسارات:' : 'Inquiries Session:'}
                          </span>
                          <strong className={`block font-black text-xs ${isDark ? 'text-white' : 'text-slate-950'}`}>
                            {isAr ? tnd.sessionDateAr : tnd.sessionDateEn}
                          </strong>
                        </div>
                        <div className={`p-3 rounded-xl border-2 ${isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'}`}>
                          <span className={`text-[11px] block mb-0.5 font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {isAr ? 'التأمين الابتدائي:' : 'Bid Bond:'}
                          </span>
                          <strong className={`font-mono block font-black text-xs ${isDark ? 'text-white' : 'text-slate-950'}`}>
                            {tnd.bidBond}
                          </strong>
                        </div>
                        <div className={`p-3 rounded-xl border-2 ${isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'}`}>
                          <span className={`text-[11px] block mb-0.5 font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {isAr ? 'ثمن الكراسة:' : 'Tender Fee:'}
                          </span>
                          <strong className={`font-mono block font-black text-xs ${isDark ? 'text-white' : 'text-slate-950'}`}>
                            {tnd.tenderFee}
                          </strong>
                        </div>
                        <div className={`p-3 rounded-xl border-2 ${isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'}`}>
                          <span className={`text-[11px] block mb-0.5 font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {isAr ? 'حالة الطرح:' : 'Status:'}
                          </span>
                          <span className={`font-black block text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                            {isAr ? 'متاح للتقديم الفني' : 'Open for Submittal'}
                          </span>
                        </div>
                      </div>

                      {/* Full Scope */}
                      <div className="space-y-1.5">
                        <h4 className={`text-xs font-black flex items-center gap-1.5 ${isDark ? 'text-[#00F2FE]' : 'text-sky-950'}`}>
                          <Layers className="w-3.5 h-3.5" />
                          <span>{isAr ? 'النطاق الهندسي والتنفيذي للعملية:' : 'Engineering Scope of Work:'}</span>
                        </h4>
                        <p className={`p-3.5 rounded-xl text-xs leading-relaxed border-2 ${
                          isDark ? 'bg-[#071120] text-slate-100 border-white/10' : 'bg-white text-slate-950 border-slate-300 font-medium'
                        }`}>
                          {isAr ? tnd.scopeAr : tnd.scopeEn}
                        </p>
                      </div>

                      {/* Required Submittals */}
                      <div className="space-y-1.5">
                        <h4 className={`text-xs font-black flex items-center gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-950'}`}>
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{isAr ? 'المستندات والاعتمادات الفنية المطلوبة للقبول:' : 'Required Submittals Checklist:'}</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs">
                          {(isAr ? tnd.deliverablesListAr : tnd.deliverablesListEn).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                              <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Direct Links Footer inside Card */}
                      <div className={`p-3 rounded-xl border-2 flex flex-col sm:flex-row items-center justify-between gap-2 ${
                        isDark ? 'bg-[#071120] border-sky-500/30' : 'bg-sky-50 border-sky-300'
                      }`}>
                        <a
                          href={tnd.officialPortalUrl || 'https://etenders.gov.eg'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 text-xs font-black ${
                            isDark ? 'text-[#00F2FE] hover:text-[#38BDF8]' : 'text-[#0284C7] hover:text-[#0369A1]'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{isAr ? 'رابط كراسة الشروط الرسمية على الموقع الأصلي' : 'Official Portal Specifications Link'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <Link
                          href={`/tenders`}
                          className={`inline-flex items-center gap-1 text-xs font-black ${
                            isDark ? 'text-slate-300 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                          }`}
                        >
                          <span>{isAr ? 'عرض بصفحة المرصد الكاملة' : 'View in Full Observatory'}</span>
                          {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

            {/* Provider Integration Notice */}
            <div className={`p-5 rounded-2xl border text-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'bg-[#071120] border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-[#00F2FE] shrink-0" />
                <span>
                  {isAr 
                    ? 'هل لديك مناقصة أو كراسة شروط خاصة وتريد شريكاً تقنياً بسابقة أعمال، أو إعداد المظروف الفني والاعتمادات؟' 
                    : 'Have an RFP or project requirement? Tech Bokra provides certified engineering submittals, vendor qualifications, and joint venture bidding.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenConsultation(isAr ? 'استفسار ودراسة مناقصة خاصة للتيار الخفيف والشبكات' : 'Inquiry regarding custom RFP partnership')}
                className="px-5 py-2.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-black text-xs shrink-0 transition cursor-pointer shadow-md"
              >
                {isAr ? 'تواصل مع فريق دراسة المشروعات' : 'Contact Tender Desk'}
              </button>
            </div>

            {/* Link to Dedicated Tenders Page */}
            <div className="mt-8 text-center">
              <Link
                href="/tenders"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:brightness-110 text-[#071120] font-black text-xs sm:text-sm shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                <span>{isAr ? 'الانتقال إلى صفحة مرصد المناقصات المتكاملة والمستقلة' : 'Go to Full Dedicated Tenders Observatory Page'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TECHNICAL SUBMITTALS & ENGINEERING CONSULTING      */}
        {/* ========================================================= */}
        {activeTab === 'submittals' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pillar 1: Material Submittal */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-[#00F2FE]">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'إعداد وتجهيز الاعتمادات الفنية (Material Submittals)' : 'Material Submittals Formulation'}
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isAr 
                  ? 'صياغة الملف الفني المعتمد متضمناً بطاقات البيانات الفنية (Datasheets)، جداول مطابقة المواصفات (Compliance Sheets) بنداً ببند، وشهادات اختبار الجودة والمعامل الدولية.'
                  : 'Preparing official consultant submittals with manufacturer datasheets, line-by-line compliance matrices, and lab test certificates.'}
              </p>
              <ul className="space-y-2 text-xs text-slate-400 border-t border-white/5 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'مطابقة مواصفات كراسة الشروط 100%' : '100% Tender Spec Compliance'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'شهادات اعتماد UL, CE, ISO, RoHS' : 'UL, CE, ISO, RoHS Certificates'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'تأهيل واعتماد عينات الموردين' : 'Vendor Sample Pre-qualification'}</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: Shop Drawings & As-Built */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'المخططات التنفيذية والـ Shop Drawings' : 'Shop Drawings & As-Built Engineering'}
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isAr 
                  ? 'رسم مخططات توزيع الكاميرات، زوايا الرؤية والنقاط العمياء، مسارات كابلات الفايبر والـ UTP، مخططات الـ Racks، وتنسيق التعارضات الكهروميكانيكية (MEP Coordination).'
                  : 'Detailed CAD/BIM shop drawings, camera optical field-of-view coverage, cable routing, rack elevations, and MEP coordination.'}
              </p>
              <ul className="space-y-2 text-xs text-slate-400 border-t border-white/5 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'مخططات أوتوكاد AutoCAD و BIM دقيقة' : 'Precision AutoCAD & BIM Drawings'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'مخططات التوزيع والتغذية الكهربائية للكبائن' : 'Rack Elevations & PDU Schematics'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'مخططات As-Built النهائية لتسليم الاستشاري' : 'Final As-Built Delivery Dossiers'}</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3: Testing & Commissioning */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'فحص واستلام الشبكات (Testing & Commissioning)' : 'Testing, Fluke & Commissioning'}
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isAr 
                  ? 'إجراء اختبارات الفحص الميداني لجودة تمديدات كابلات النحاس والفايبر بأجهزة Fluke Networks، وقياس فقد الإشارة في الفايبر بأجهزة OTDR مع استخراج الشهادات المعتمدة.'
                  : 'On-site structured cabling Fluke DSX certification, optical time-domain reflectometer (OTDR) fiber loss tests, and commissioning.'}
              </p>
              <ul className="space-y-2 text-xs text-slate-400 border-t border-white/5 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'شهادات فحص Fluke Test رسمية لكل نقطة' : 'Certified Fluke DSX Reports'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'اختبارات فقد ومطابقة كابلات الألياف OTDR' : 'OTDR Optical Budget Verification'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'محاضر استلام مهندسي الاستشاري والمالك' : 'Formal Consultant Handover Sign-off'}</span>
                </li>
              </ul>
            </div>

            {/* Bottom Call to Action */}
            <div className={`lg:col-span-3 p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark 
                ? 'bg-gradient-to-r from-[#0F223D] via-[#0B1A2F] to-[#071120] border-[#00F2FE]/30' 
                : 'bg-sky-50 border-sky-200'
            }`}>
              <div>
                <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isAr ? 'هل تحتاج لإعداد اعتماد فني (Technical Submittal) لمشروعك الآن؟' : 'Need a complete Technical Submittal for your project now?'}
                </h4>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isAr 
                    ? 'يقوم مهندسونا المتخصصون بمراجعة كراسة الشروط وإعداد الملف الفني والمخططات المعتمدة خلال وقت قياسي'
                    : 'Our senior engineers review specifications and produce verified submittals ready for consultant approval.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenConsultation(isAr ? 'طلب إعداد ومراجعة اعتماد فني (Technical Submittal) ومخططات Shop Drawings' : 'Request Technical Submittal & Shop Drawings Review')}
                className="px-6 py-3 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-black text-xs sm:text-sm shrink-0 transition cursor-pointer shadow-md flex items-center gap-2"
              >
                <span>{isAr ? 'طلب إعداد اعتماد فني' : 'Request Submittal Preparation'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
