'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Camera, 
  Network, 
  Layers, 
  Activity, 
  Radio, 
  Calculator,
  Lock,
  Headphones,
  FileCheck,
  Globe,
  Server
} from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';

interface HeroProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onOpenEstimator: () => void;
  onOpenContact: () => void;
  heroOverrides?: {
    badge?: string;
    titleLine1?: string;
    titleLine2?: string;
    sub?: string;
    cctvImage?: string;
    networkImage?: string;
    accessImage?: string;
    cloudImage?: string;
  };
}

export default function Hero({ lang, data, onOpenEstimator, onOpenContact, heroOverrides }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'cctv' | 'network' | 'software' | 'erp' | 'consulting' | 'access'>('cctv');
  const [heroImageError, setHeroImageError] = useState(false);
  const { isDark } = useTheme();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const telemetryData = {
    cctv: {
      titleAr: 'منظومة المراقبة المركزية والذكاء الاصطناعي (CCTV & AI Video)',
      titleEn: 'Centralized Surveillance & AI Video Analytics',
      status: 'VIDEO TELEMETRY',
      image: heroOverrides?.cctvImage || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'كاميرات رقمية 4K', labelEn: '4K IP Cameras', val: '4K / IP / ColorVu' },
        { labelAr: 'تحليل الذكاء الاصطناعي', labelEn: 'AI Perimeter Guard', val: 'Active Analytics' },
        { labelAr: 'تخزين سحابي ومحلي', labelEn: 'RAID 5/6 Storage', val: 'Standard RAID' },
        { labelAr: 'زمن استجابة التنبيه', labelEn: 'Alarm Response Latency', val: 'Sub-second' },
      ],
      descAr: 'بث فائق الدقة 4K مع تتبع فوري للأجسام، قراءة لوحات السيارات (LPR)، كشف التسلل الليلي، وحسابات سعات التخزين الهندسية المعتمدة.',
      descEn: 'Ultra HD 4K video feeds with edge AI tracking, ANPR plate recognition, 24/7 Full-Color night vision, and certified storage sizing.',
      icon: Camera,
    },
    network: {
      titleAr: 'كابلات UTP والفايبر وتجهيز مراكز البيانات (DCIM & Mini Data Centers)',
      titleEn: 'UTP/Fiber Cabling, Data Center Fit-out & DCIM',
      status: 'INFRASTRUCTURE LINK',
      image: heroOverrides?.networkImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'كابلات UTP المهيكلة', labelEn: 'UTP Structured Cabling', val: 'Cat6A / Cat7' },
        { labelAr: 'مسار الألياف الضوئية', labelEn: 'Fiber Backbone', val: 'Single / Multimode' },
        { labelAr: 'تجهيزات الداتا سنتر', labelEn: 'Data Center Fit-out', val: '42U & Precision' },
        { labelAr: 'مراقبة بيئية ذكية', labelEn: 'DCIM Environmental', val: 'Active Sensors' },
      ],
      descAr: 'تمديدات كابلات نحاسية UTP/STP وفايبر معتمدة، كبائن خوادم 42U/48U، تبريد دقيق In-Row، مراقبة بيئية ذكية DCIM، ومراكز بيانات مصغرة (Mini Data Centers).',
      descEn: 'Structured UTP/STP & optical fiber cabling, full server room fit-out, In-Row precision cooling, DCIM environmental telemetry, and modular mini data centers.',
      icon: Server,
    },
    software: {
      titleAr: 'المواقع والمنصات المتخصصة ذات العمليات المتراكمة',
      titleEn: 'Specialized Web Platforms with Complex Workflows',
      status: 'WEB PLATFORMS',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'منصات عقارية PropTech', labelEn: 'PropTech Portals', val: 'Helio Property' },
        { labelAr: 'منصات حجز وسياحة', labelEn: 'Logistics & Booking', val: 'Al-Rehla Platform' },
        { labelAr: 'بوابات معاملات B2B/B2C', labelEn: 'Transactional Logic', val: 'Custom Engine' },
        { labelAr: 'معمارية سحابية متقدمة', labelEn: 'Next.js & Cloud Core', val: 'Edge Network' },
      ],
      descAr: 'تطوير المنصات متعددة الأطراف وبوابات الويب التي تدير عمليات حسابية ومالية ولوجستية متراكمة ومعقدة مع لوحات تحكم ومؤشرات لحظية.',
      descEn: 'Engineering complex multi-sided web platforms and enterprise portals with accumulated business logic, real-time analytics, and high concurrency resilience.',
      icon: Globe,
    },
    erp: {
      titleAr: 'التطبيقات المتخصصة ومنظومات ERP والربط الضريبي ETA',
      titleEn: 'Specialized Enterprise Apps & Custom ERP',
      status: 'ERP & ETA INTEGRATION',
      image: heroOverrides?.cloudImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'الفاتورة الإلكترونية ETA', labelEn: 'Egypt Tax API', val: 'Official Direct API' },
        { labelAr: 'تطبيقات الجوال الميدانية', labelEn: 'Mobile Apps (iOS/And)', val: 'Native / Hybrid' },
        { labelAr: 'إدارة المخازن وسلاسل الإمداد', labelEn: 'Barcode & RFID POS', val: 'Full Inventory' },
        { labelAr: 'تخصيص محركات الـ ERP', labelEn: 'Odoo & Tailored Core', val: 'Custom Workflow' },
      ],
      descAr: 'تطبيقات هواتف ذكية متخصصة لفرق العمل وخدمة العملاء، مع تخصيص أنظمة ERP للمخازن والحسابات والربط الرسمي مع بوابة الضرائب المصرية.',
      descEn: 'Field team mobile applications combined with customized ERP modules for inventory, general ledger, and certified Egyptian Tax Authority e-invoicing.',
      icon: Layers,
    },
    consulting: {
      titleAr: 'الاستشارات الهندسية والاعتمادات الفنية (Technical Submittals)',
      titleEn: 'Technical Submittals & Engineering Consultation',
      status: 'ENGINEERING SPECS',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'اعتمادات فنية للمواد', labelEn: 'Material Submittals', val: 'Consultant Ready' },
        { labelAr: 'جداول مطابقة الشروط', labelEn: 'Compliance Sheets', val: 'Line-by-Line' },
        { labelAr: 'مخططات تنفيذية', labelEn: 'Shop / As-Built CAD', val: 'Full Sets' },
        { labelAr: 'فحص واستلام الأجهزة', labelEn: 'Fluke DSX & OTDR', val: 'Calibration Reports' },
      ],
      descAr: 'إعداد ومراجعة ملفات الاعتماد الفني للمواد، صياغة جداول المطابقة الفنية لكراسات شروط المناقصات، إعداد Shop Drawings، واختبارات فلوك المعتمدة.',
      descEn: 'Formulation and review of technical submittals, line-by-line compliance sheets for RFPs, CAD shop drawings, and certified Fluke DSX/OTDR commissioning.',
      icon: FileCheck,
    },
    access: {
      titleAr: 'بوابات المرور السريعة والتحكم في الدخول البيومتري',
      titleEn: 'Smart Access Control & Speed Gates',
      status: 'MONITORED',
      image: heroOverrides?.accessImage || 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'بوابات ذكية مجهزة', labelEn: 'Access Turnstiles', val: 'Optical / Flap' },
        { labelAr: 'سعة التعرف على الوجه', labelEn: 'Facial Capacity', val: 'Enterprise' },
        { labelAr: 'سرعة التحقق البيومتري', labelEn: 'Auth Latency', val: 'Sub-second' },
        { labelAr: 'تكامل إنذار الحريق', labelEn: 'Fire Alarm Fail-Safe', val: 'Integrated' },
      ],
      descAr: 'أجهزة بصمة وجه وبصمة إصبع لا تلامسية، بوابات مرور أفراد زجاجية، بوابات سيارات آلية، وقفل مغناطيسي مرتبط بنظام الإخلاء.',
      descEn: 'Biometric face recognition readers, motorized optical speed gates, automated vehicle boom barriers, and fire alarm interlock.',
      icon: Lock,
    },
  };

  const currentTel = telemetryData[activeTab];

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-24 sm:pt-28 pb-16 overflow-hidden cyber-grid">
      {/* Background ambient lighting */}
      <div 
        className={`absolute top-1/4 -right-40 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-opacity duration-300 ${
          isDark ? 'bg-[#00F2FE]/15 opacity-100' : 'bg-sky-200/50 opacity-60'
        }`} 
      />
      <div 
        className={`absolute bottom-10 -left-40 w-96 h-96 rounded-full blur-[160px] pointer-events-none transition-opacity duration-300 ${
          isDark ? 'bg-[#0284C7]/20 opacity-100' : 'bg-blue-200/40 opacity-60'
        }`} 
      />
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b rounded-full blur-[180px] pointer-events-none ${
          isDark ? 'from-[#00F2FE]/5 to-transparent' : 'from-sky-100/40 to-transparent'
        }`} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Value Proposition Column */}
          <div className="lg:col-span-7 space-y-6 text-start">
            
            {/* Live Engineer Availability Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm shadow-sm transition-colors ${
                isDark
                  ? 'bg-[#10233D] border-[#00F2FE]/30 text-slate-200 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                  : 'bg-sky-50 border-sky-200 text-sky-900 shadow-sm'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDark ? 'bg-[#00F2FE]' : 'bg-sky-500'}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isDark ? 'bg-[#00F2FE]' : 'bg-sky-600'}`} />
              </span>
              <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {heroOverrides?.badge || data.hero.badge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span>{heroOverrides?.titleLine1 || data.hero.titleLine1}</span>{' '}
              <br className="hidden sm:inline" />
              <span className={`text-transparent bg-clip-text ${
                isDark
                  ? 'bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#0284C7] text-glow'
                  : 'bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#075985]'
              }`}>
                {heroOverrides?.titleLine2 || data.hero.titleLine2}
              </span>
            </h1>

            {/* Subheading / Value explanation */}
            <p className={`text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-normal ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {heroOverrides?.sub || data.hero.sub}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0369A1] text-[#071120] font-black text-base shadow-[0_0_25px_rgba(0,242,254,0.4)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] transition-all transform active:scale-95 group cursor-pointer"
              >
                <Headphones className="w-5 h-5 text-[#071120]" />
                <span>{data.hero.btnContact}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onOpenEstimator}
                className={`inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl border font-bold text-base transition-all transform active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-[#10233D] hover:bg-[#152C4D] border-[#00F2FE]/30 text-white hover:border-[#00F2FE]'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm hover:border-[#0284C7]'
                }`}
              >
                <Calculator className={`w-5 h-5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <span>{data.hero.btnEstimate}</span>
              </button>
            </div>

            {/* Guarantee Checkmarks */}
            <div className={`pt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm ${
              isDark ? 'text-slate-300' : 'text-slate-700 font-medium'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <span>{data.hero.guarantee1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <span>{data.hero.guarantee2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <span>{data.hero.guarantee3}</span>
              </div>
            </div>
          </div>

          {/* Interactive Operations Console / Telemetry Column with Live Preview Image */}
          <div className="lg:col-span-5">
            <div 
              className={`relative rounded-3xl p-5 sm:p-6 backdrop-blur-xl group overflow-hidden border transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-b from-[#10233D] to-[#0B1A2F] border-[#00F2FE]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
                  : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)]'
              }`}
            >
              
              {/* Header of Console */}
              <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-emerald-500 uppercase tracking-wider">
                    {currentTel.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>SPECS:</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    isDark
                      ? 'text-[#00F2FE] bg-[#00F2FE]/10 border-[#00F2FE]/20'
                      : 'text-[#0284C7] bg-sky-50 border-sky-200'
                  }`}>
                    {isAr ? 'معايير هندسية معتمدة' : 'ENGINEERED SPEC'}
                  </span>
                </div>
              </div>

              {/* Sub-system Selector Tabs */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 py-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('cctv')}
                  className={`p-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'cctv'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold shadow-md'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                  title={isAr ? 'كاميرات المراقبة والذكاء الاصطناعي' : 'CCTV & AI Video'}
                >
                  <Camera className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isAr ? 'كاميرات' : 'CCTV'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('network')}
                  className={`p-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'network'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold shadow-md'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                  title={isAr ? 'كابلات UTP وفايبر وتجهيز مراكز البيانات DCIM' : 'UTP, Fiber & Data Center / DCIM'}
                >
                  <Server className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isAr ? 'UTP وداتا سنتر' : 'UTP & DC'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('software')}
                  className={`p-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'software'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold shadow-md'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                  title={isAr ? 'المواقع والمنصات المتخصصة ذات العمليات المتراكمة' : 'Specialized Web Platforms'}
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isAr ? 'منصات متخصصة' : 'Portals'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('erp')}
                  className={`p-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'erp'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold shadow-md'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                  title={isAr ? 'تطبيقات الجوال الميدانية ومنظومات ERP والربط الضريبي' : 'Mobile Apps & Custom ERP'}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isAr ? 'تطبيقات & ERP' : 'ERP & Apps'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('consulting')}
                  className={`p-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'consulting'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold shadow-md'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                  title={isAr ? 'الاستشارات الهندسية والاعتمادات الفنية Technical Submittals' : 'Technical Submittals & Consulting'}
                >
                  <FileCheck className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isAr ? 'اعتمادات فنية' : 'Submittals'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('access')}
                  className={`p-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'access'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold shadow-md'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                  title={isAr ? 'بوابات المرور السريعة والتحكم في الدخول البيومتري' : 'Speed Gates & Access'}
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isAr ? 'بوابات وبصمة' : 'Access'}</span>
                </button>
              </div>

              {/* Real Imagery Banner for Selected System */}
              <div 
                className={`relative w-full h-36 rounded-2xl overflow-hidden mb-4 border shadow-inner group ${
                  isDark ? 'border-[#00F2FE]/20 bg-[#071120]' : 'border-slate-200 bg-slate-100'
                }`}
              >
                {heroImageError ? (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-[#10233D] to-[#071120] text-[#00F2FE]/40' : 'bg-slate-100 text-[#0284C7]/40'}`}>
                    <currentTel.icon className="w-12 h-12" />
                  </div>
                ) : (
                  <Image
                    src={currentTel.image}
                    alt={isAr ? currentTel.titleAr : currentTel.titleEn}
                    fill
                    priority
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 768px) 100vw, 500px"
                    onError={() => setHeroImageError(true)}
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${isDark ? 'from-[#071120] via-transparent to-transparent opacity-80' : 'from-slate-900/60 via-transparent to-transparent opacity-60'}`} />
                <div className={`absolute bottom-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto text-xs font-mono font-bold px-2 py-0.5 rounded backdrop-blur-sm border ${
                  isDark
                    ? 'text-[#00F2FE] bg-[#071120]/80 border-[#00F2FE]/30'
                    : 'text-white bg-slate-900/80 border-white/20'
                }`}>
                  {currentTel.status}
                </div>
              </div>

              {/* Selected System Details */}
              <div className="space-y-4 pt-1">
                <div>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#00F2FE]' : 'bg-[#0284C7]'}`} />
                    {isAr ? currentTel.titleAr : currentTel.titleEn}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
                    {isAr ? currentTel.descAr : currentTel.descEn}
                  </p>
                </div>

                {/* 4 Live Metrics in Box */}
                <div className="grid grid-cols-2 gap-2.5">
                  {currentTel.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        isDark
                          ? 'bg-[#071120]/80 border-white/5 hover:border-[#00F2FE]/30'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {isAr ? metric.labelAr : metric.labelEn}
                      </div>
                      <div className={`text-sm font-mono font-black mt-0.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`}>
                        {metric.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Terminal Status Line */}
                <div 
                  className={`p-2.5 rounded-xl border font-mono text-[11px] flex items-center justify-between ${
                    isDark
                      ? 'bg-[#071120] border-[#00F2FE]/15 text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-700 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Radio className={`w-3.5 h-3.5 animate-pulse ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                    <span>SYSTEM CORE: READY</span>
                  </div>
                  <span className="text-emerald-500 font-bold">ONLINE</span>
                </div>
              </div>

              {/* Micro interactive button to trigger direct quote for this specific sub-system */}
              <button
                type="button"
                onClick={onOpenContact}
                className={`mt-4 w-full py-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                  isDark
                    ? 'bg-[#152C4D] hover:bg-[#1A3760] border-[#00F2FE]/30 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-900 text-white shadow-sm'
                }`}
              >
                <span>{isAr ? 'طلب أو استفسار عن هذا النظام' : 'Inquire About this System'}</span>
                <ArrowIcon className={`w-3.5 h-3.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#00F2FE]'}`} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
