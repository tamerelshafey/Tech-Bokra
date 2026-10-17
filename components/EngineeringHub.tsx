'use client';

import React, { useState, useMemo } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';

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
// TENDERS & RFPs RADAR DATA
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
  status: 'open' | 'under_review' | 'clarification' | 'awarded';
  scopeAr: string;
  scopeEn: string;
  estimatedBudget?: string;
  submittalRequired: boolean;
}

export const DEFAULT_TENDERS_RADAR: TenderItem[] = [
  {
    id: 'tnd-2025-01',
    refNumber: 'RFP-NC-2025/084',
    titleAr: 'توريد وتركيب منظومة مراقبة ذكية 4K وبوابات دخول للمباني الإدارية',
    titleEn: 'Supply & Installation of 4K CCTV & Access Control for HQ Facilities',
    entityAr: 'هيئة المجتمعات العمرانية الجديدة - جهاز مدينة بدر',
    entityEn: 'New Urban Communities Authority - Badr City',
    category: 'security',
    locationAr: 'مدينة بدر، القاهرة',
    locationEn: 'Badr City, Cairo',
    deadline: '2025-04-15',
    status: 'open',
    scopeAr: 'توريد عدد 85 كاميرا مراقبة IP بدقة 4K مع شبكة كابلات UTP Cat6A، كبائن خوادم، منظومة تسجيل NVR 128ch مع RAID 6 وتخزين 90 يوماً، وعدد 6 بوابات مرور Flap Barrier.',
    scopeEn: 'Supply 85 IP 4K cameras with Cat6A structured cabling, server racks, 128ch NVR with RAID 6 and 90-day retention, plus 6 motorized flap barrier turnstiles.',
    estimatedBudget: 'تقديري 4.5 مليون ج.م',
    submittalRequired: true,
  },
  {
    id: 'tnd-2025-02',
    refNumber: 'TEN-DAT-2025/112',
    titleAr: 'تجهيز مركز بيانات مصغر (Mini Data Center) وحلول مراقبة البنية التحتية DCIM',
    titleEn: 'Fit-out of Modular Mini Data Center & DCIM Environmental Monitoring',
    entityAr: 'الشركة القابضة لمياه الشرب والصرف الصحي',
    entityEn: 'Holding Company for Water and Wastewater',
    category: 'datacenter',
    locationAr: 'القاهرة الكبرى',
    locationEn: 'Greater Cairo',
    deadline: '2025-04-22',
    status: 'open',
    scopeAr: 'توريد وتركيب كبائن راك 42U مدمجة بنظام تبريد In-Row دقيق، وحدات UPS ثلاثية الأطوار 40kVA، حساسات حرارة ورطوبة وتسريب مياه مع لوحة DCIM لإدارة البنية التحتية عن بعد.',
    scopeEn: 'Supply 42U smart modular server racks with in-row precision cooling, 40kVA 3-phase modular UPS, environmental monitoring (temp/humidity/leak), and central DCIM software.',
    estimatedBudget: 'تقديري 6.8 مليون ج.م',
    submittalRequired: true,
  },
  {
    id: 'tnd-2025-03',
    refNumber: 'RFP-FIB-2025/309',
    titleAr: 'تنفيذ شبكة كابلات ألياف ضوئية (Backbone) وتحديث كابلات النحاس UTP للمقر',
    titleEn: 'Campus Optical Fiber Backbone & Structured Cabling Modernization',
    entityAr: 'جامعة حلوان - المجمع الهندسي والتكنولوجي',
    entityEn: 'Helwan University - Engineering & Tech Complex',
    category: 'network',
    locationAr: 'حلوان، القاهرة',
    locationEn: 'Helwan, Cairo',
    deadline: '2025-05-02',
    status: 'clarification',
    scopeAr: 'مد وتوصيل كابلات فايبر Single-Mode 24 Core مدرعة بطول 4 كم بين كليات المجمع، وتأسيس 650 نقطة كابلات UTP Cat6A مع مسارات Cable Trays واختبارات فلوك Fluke Test معتمدة.',
    scopeEn: 'Installation of 4km armored 24-core single-mode fiber backbone, plus 650 UTP Cat6A drops with galvanized cable trays and official Fluke DSX calibration certificates.',
    estimatedBudget: 'تقديري 3.9 مليون ج.م',
    submittalRequired: true,
  },
  {
    id: 'tnd-2025-04',
    refNumber: 'TEN-SUB-2025/047',
    titleAr: 'إعداد ومراجعة المظروف الفني والاعتمادات (Technical Submittal) لمشروع مجمع إداري',
    titleEn: 'Preparation & Engineering Review of Low-Current Technical Submittals',
    entityAr: 'إحدى كبرى شركات المقاولات العامة - العاصمة الإدارية',
    entityEn: 'General Contracting Consortium - New Capital',
    category: 'consulting',
    locationAr: 'العاصمة الإدارية الجديدة',
    locationEn: 'New Administrative Capital',
    deadline: '2025-04-18',
    status: 'open',
    scopeAr: 'مطلوب مكتب استشاري / جهة متخصصة لإعداد ملف الاعتماد الفني المتكامل (المواصفات، الكتالوجات، الـ Compliance Sheet، المخططات التنفيذية Shop Drawings) لكافة أعمال التيار الخفيف والشبكات.',
    scopeEn: 'Seeking specialist low-current engineering firm to formulate complete Material Submittal, Compliance Matrix, Shop Drawings, and Vendor Qualifications for consultant approval.',
    estimatedBudget: 'استشارات هندسية متخصصة',
    submittalRequired: true,
  },
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
  // TENDERS RADAR STATE
  // -----------------------------------------------------------
  const [tenderCategoryFilter, setTenderCategoryFilter] = useState<string>('all');
  const [tenderSearch, setTenderSearch] = useState<string>('');
  const [selectedTender, setSelectedTender] = useState<TenderItem | null>(null);

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
          <div className="space-y-6">
            {/* Radar Header & Filter Bar */}
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-lg sm:text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Radio className="w-5 h-5 text-amber-400" />
                    <span>{isAr ? 'مرصد أحدث مناقصات وممارسات التيار الخفيف والشبكات' : 'Security & IT Tenders Radar'}</span>
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr 
                      ? 'فرص حية للمقاولين والشركات للمشاركة، طلب التضامن (Joint Venture)، أو إعداد وتجهيز المظروف الفني المعتمد' 
                      : 'Live tender tracking: collaborate, request submittals, or joint venture bidding'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span>{isAr ? 'محدّث دورياً' : 'Live Synced'}</span>
                  </span>
                </div>
              </div>

              {/* Filter Tabs & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3 rtl:left-auto rtl:right-3" />
                  <input
                    type="text"
                    value={tenderSearch}
                    onChange={(e) => setTenderSearch(e.target.value)}
                    placeholder={isAr ? 'بحث برقم المناقصة، الجهة الطارحة، أو النطاق...' : 'Search by reference, entity, or scope...'}
                    className={`w-full py-2 px-9 text-xs rounded-xl border outline-none ${
                      isDark 
                        ? 'bg-[#071120] border-white/10 text-white placeholder-slate-500 focus:border-[#00F2FE]' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0284C7]'
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
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setTenderCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        tenderCategoryFilter === cat.id
                          ? isDark
                            ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE]'
                            : 'bg-[#0284C7] text-white border-[#0284C7]'
                          : isDark
                            ? 'bg-[#071120] text-slate-300 hover:bg-[#10233D] border-white/5'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                      }`}
                    >
                      {isAr ? cat.labelAr : cat.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tenders Cards Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredTenders.map((tnd) => (
                <div
                  key={tnd.id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 ${
                    isDark 
                      ? 'bg-[#0B1A2F]/80 border-white/10 hover:border-[#00F2FE]/40' 
                      : 'bg-white border-slate-200 hover:border-[#0284C7]/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-[#00F2FE] border border-sky-500/30">
                        {tnd.refNumber}
                      </span>
                      <h4 className={`text-sm sm:text-base font-bold mt-2 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {isAr ? tnd.titleAr : tnd.titleEn}
                      </h4>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      {isAr ? 'طرح ساري' : 'Open'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#00F2FE]" />
                      <span>{isAr ? 'الجهة الطارحة:' : 'Entity:'} <strong className="text-slate-200">{isAr ? tnd.entityAr : tnd.entityEn}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? 'آخر موعد لتقديم العروض:' : 'Submission Deadline:'} <strong className="text-amber-300 font-mono">{tnd.deadline}</strong></span>
                    </div>

                    {tnd.estimatedBudget && (
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isAr ? 'القيمة التقديرية:' : 'Estimate:'} <span className="font-mono text-emerald-300">{tnd.estimatedBudget}</span></span>
                      </div>
                    )}
                  </div>

                  <p className={`text-xs leading-relaxed line-clamp-3 p-3 rounded-xl ${
                    isDark ? 'bg-[#071120] text-slate-300' : 'bg-slate-50 text-slate-700'
                  }`}>
                    {isAr ? tnd.scopeAr : tnd.scopeEn}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenConsultation(`طلب تضامن / تحالف للمناقصة رقم (${tnd.refNumber}): ${isAr ? tnd.titleAr : tnd.titleEn} للجهة: ${isAr ? tnd.entityAr : tnd.entityEn}`)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{isAr ? 'طلب تضامن لتنفيذ المناقصة' : 'Joint Venture Request'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenConsultation(`طلب إعداد وتجهيز المظروف الفني والـ Technical Submittal للمناقصة (${tnd.refNumber}): ${isAr ? tnd.titleAr : tnd.titleEn}`)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                        isDark 
                          ? 'bg-[#10233D] hover:bg-[#152C4D] text-slate-200 border-white/10' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5 text-[#00F2FE]" />
                      <span>{isAr ? 'إعداد الاعتماد الفني' : 'Prepare Submittal'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Provider Integration Notice */}
            <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
              isDark ? 'bg-[#071120] border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00F2FE] shrink-0" />
                <span>
                  {isAr 
                    ? 'هل لديك مناقصة أو مشروع خاص وتريد مقاول باطن متخصص أو اعتماداً فنياً معتمداً؟' 
                    : 'Do you have an RFP or need a specialized subcontractor for your project?'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenConsultation(isAr ? 'استفسار بخصوص مناقصات وتوريدات تيار خفيف وشبكات' : 'Inquiry regarding Low-Current RFPs')}
                className="px-3 py-1.5 rounded-lg bg-[#00F2FE]/20 hover:bg-[#00F2FE] text-[#00F2FE] hover:text-[#071120] font-bold text-xs shrink-0 transition cursor-pointer"
              >
                {isAr ? 'تواصل مع فريق المناقصات' : 'Contact Tender Team'}
              </button>
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
