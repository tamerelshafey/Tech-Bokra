'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Camera, 
  Server, 
  Globe, 
  Layers, 
  Headphones, 
  Briefcase,
  ExternalLink,
  Sparkles,
  Calculator
} from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';

interface HeroProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onOpenEstimator: () => void;
  onOpenContact: () => void;
  onOpenProjects?: () => void;
  showEstimator?: boolean;
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

export default function Hero({ 
  lang, 
  data, 
  onOpenEstimator, 
  onOpenContact, 
  onOpenProjects,
  showEstimator = false,
  heroOverrides 
}: HeroProps) {
  const [activeTab, setActiveTab] = useState<'cctv' | 'network' | 'software' | 'erp'>('cctv');
  const [heroImageError, setHeroImageError] = useState(false);
  const { isDark } = useTheme();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const handleTabChange = (tab: 'cctv' | 'network' | 'software' | 'erp') => {
    setActiveTab(tab);
    setHeroImageError(false);
  };

  const showcasePillars = {
    cctv: {
      categoryAr: 'الأمن المادي والمراقبة',
      categoryEn: 'Physical Security & Video',
      titleAr: 'كاميرات المراقبة المركزية والتحليل الذكي (CCTV & AI)',
      titleEn: 'Surveillance & AI Video Analytics',
      descAr: 'كاميرات 4K IP ورؤية ليلية ColorVu مع تتبع فوري للأجسام وقراءة لوحات السيارات وحسابات سعات تخزين هندسية معتمدة.',
      descEn: 'Ultra HD 4K feeds with edge AI tracking, ANPR plate recognition, 24/7 Full-Color vision, and certified storage sizing.',
      image: heroOverrides?.cctvImage || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      highlights: isAr 
        ? ['كاميرات 4K IP', 'تحليل ذكاء اصطناعي', 'تخزين RAID معتمد']
        : ['4K IP Cameras', 'AI Video Analytics', 'Certified Storage'],
      link: '/services/security',
      icon: Camera,
    },
    network: {
      categoryAr: 'البنية التحتية ومراكز البيانات',
      categoryEn: 'Infrastructure & DCIM',
      titleAr: 'شبكات UTP والفايبر وتجهيز غرف الخوادم (Data Centers)',
      titleEn: 'Structured Cabling & Server Rooms',
      descAr: 'كابلات نحاسية Cat6A/Cat7 ومسارات فايبر معتمدة، كبائن خوادم 42U، وتجهيزات تبريد ومراقبة بيئية ذكية.',
      descEn: 'Structured Cat6A/7 & fiber backbones, 42U server racks, precision cooling, and environmental DCIM monitoring.',
      image: heroOverrides?.networkImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      highlights: isAr
        ? ['كابلات Cat6A/Cat7', 'ألياف فايبر ضوئية', 'كبائن خوادم 42U']
        : ['Cat6A/7 Structured', 'Optical Fiber', '42U Server Racks'],
      link: '/services/network',
      icon: Server,
    },
    software: {
      categoryAr: 'المنصات الرقمية وحلول الويب',
      categoryEn: 'Digital Platforms & Web',
      titleAr: 'منصات الويب المتخصصة ذات العمليات المتراكمة',
      titleEn: 'Specialized Enterprise Web Platforms',
      descAr: 'تطوير المنصات متعددة الأطراف وبوابات B2B/B2C التي تدير عمليات مالية ولوجستية وحسابية متراكمة ومعقدة.',
      descEn: 'Engineering complex multi-sided web platforms with accumulated business logic, real-time analytics, and high concurrency resilience.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      highlights: isAr
        ? ['منصات عقارية PropTech', 'بوابات حجز ولوجستيات', 'معمارية سحابية مرنة']
        : ['PropTech Portals', 'Logistics Engines', 'Cloud-Native Core'],
      link: '/services/software',
      icon: Globe,
    },
    erp: {
      categoryAr: 'تطبيقات الأعمال والربط المؤسسي',
      categoryEn: 'Business Apps & ERP',
      titleAr: 'تطبيقات الجوال الميدانية ومنظومات ERP والربط الضريبي',
      titleEn: 'Field Apps, Custom ERP & Tax API',
      descAr: 'تطبيقات ذكية لفرق العمل وخدمة العملاء، مع تخصيص أنظمة المخازن والحسابات والربط الرسمي مع منظومة الفاتورة الإلكترونية.',
      descEn: 'Tailored mobile applications combined with customized ERP modules and certified Egyptian Tax Authority e-invoicing.',
      image: heroOverrides?.cloudImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      highlights: isAr
        ? ['الفاتورة الإلكترونية ETA', 'تطبيقات الجوال الميدانية', 'إدارة المخازن والـ ERP']
        : ['ETA Tax e-Invoicing', 'Field Mobile Apps', 'Inventory & ERP'],
      link: '/services/software',
      icon: Layers,
    },
  };

  const currentPillar = showcasePillars[activeTab];

  return (
    <section id="home" className="relative min-h-[86vh] flex items-center pt-24 sm:pt-28 pb-14 overflow-hidden cyber-grid">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
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
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.2] tracking-tight ${
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

            {/* Subheading / Value explanation - Concise and focused */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl font-normal ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {heroOverrides?.sub || data.hero.sub}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0369A1] text-[#071120] font-black text-sm sm:text-base shadow-[0_0_25px_rgba(0,242,254,0.4)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] transition-all transform active:scale-95 group cursor-pointer"
              >
                <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-[#071120]" />
                <span>{data.hero.btnContact}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <Link
                href="/services"
                className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl border font-bold text-sm sm:text-base transition-all transform active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-[#10233D] hover:bg-[#152C4D] border-[#00F2FE]/30 text-white hover:border-[#00F2FE]'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm hover:border-[#0284C7]'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <span>{isAr ? 'استكشف الخدمات' : 'Explore Services'}</span>
              </Link>

              <Link
                href="/projects"
                className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl border font-bold text-sm sm:text-base transition-all transform active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-transparent hover:bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                    : 'bg-transparent hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
              >
                <Briefcase className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span>{isAr ? 'سابقة الأعمال' : 'Projects'}</span>
              </Link>

              {showEstimator && (
                <button
                  type="button"
                  onClick={onOpenEstimator}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                    isDark
                      ? 'bg-transparent border-slate-700 text-slate-400 hover:text-white'
                      : 'bg-transparent border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>{data.hero.btnEstimate}</span>
                </button>
              )}
            </div>

            {/* Guarantee Checkmarks */}
            <div className={`pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm ${
              isDark ? 'text-slate-300' : 'text-slate-700 font-medium'
            }`}>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <span>{data.hero.guarantee1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <span>{data.hero.guarantee2}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <span>{data.hero.guarantee3}</span>
              </div>
            </div>
          </div>

          {/* Streamlined Interactive Solution Showcase (Cleaner & directly links to internal pages) */}
          <div className="lg:col-span-5">
            <div 
              className={`relative rounded-3xl p-5 backdrop-blur-xl group overflow-hidden border transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-b from-[#10233D] to-[#0B1A2F] border-[#00F2FE]/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                  : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)]'
              }`}
            >
              {/* Header & Pillar Selectors */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 dark:border-white/10 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-emerald-500 uppercase">
                    {isAr ? 'قطاعات الحلول الهندسية' : 'CORE SOLUTION PILLARS'}
                  </span>
                </div>
                <Link
                  href="/services"
                  className={`text-xs font-bold flex items-center gap-1 transition ${
                    isDark ? 'text-[#00F2FE] hover:underline' : 'text-[#0284C7] hover:underline'
                  }`}
                >
                  <span>{isAr ? 'كافة الخدمات' : 'All Services'}</span>
                  <ArrowIcon className="w-3 h-3" />
                </Link>
              </div>

              {/* 4 Core Pillar Tabs */}
              <div className="grid grid-cols-4 gap-1.5 mb-3.5">
                <button
                  type="button"
                  onClick={() => handleTabChange('cctv')}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'cctv'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] shadow-sm'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  title={isAr ? 'كاميرات المراقبة والذكاء الاصطناعي' : 'CCTV & Surveillance'}
                >
                  <Camera className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isAr ? 'مراقبة ذكية' : 'CCTV'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('network')}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'network'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] shadow-sm'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  title={isAr ? 'الشبكات ومراكز البيانات' : 'Networks & Data Centers'}
                >
                  <Server className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isAr ? 'داتا سنتر' : 'Networks'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('software')}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'software'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] shadow-sm'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  title={isAr ? 'المنصات الرقمية المتخصصة' : 'Web Platforms'}
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isAr ? 'منصات ويب' : 'Platforms'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('erp')}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'erp'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] shadow-sm'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  title={isAr ? 'تطبيقات الأعمال ومنظومات ERP' : 'Apps & ERP'}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isAr ? 'تطبيقات & ERP' : 'ERP & Apps'}</span>
                </button>
              </div>

              {/* Visual Preview Image */}
              <div 
                className={`relative w-full h-40 rounded-2xl overflow-hidden mb-3.5 border shadow-inner group ${
                  isDark ? 'border-[#00F2FE]/20 bg-[#071120]' : 'border-slate-200 bg-slate-100'
                }`}
              >
                {heroImageError ? (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-[#10233D] to-[#071120] text-[#00F2FE]/40' : 'bg-slate-100 text-[#0284C7]/40'}`}>
                    <currentPillar.icon className="w-12 h-12" />
                  </div>
                ) : (
                  <Image
                    src={currentPillar.image}
                    alt={isAr ? currentPillar.titleAr : currentPillar.titleEn}
                    fill
                    priority
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 768px) 100vw, 500px"
                    onError={() => setHeroImageError(true)}
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${isDark ? 'from-[#071120] via-transparent to-transparent opacity-85' : 'from-slate-950/70 via-transparent to-transparent opacity-70'}`} />
                <span className="absolute bottom-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto text-[11px] font-mono font-bold text-sky-200 bg-slate-950/80 px-2.5 py-0.5 rounded border border-sky-400/30">
                  {isAr ? currentPillar.categoryAr : currentPillar.categoryEn}
                </span>
              </div>

              {/* Title & 1-line clean summary */}
              <div className="space-y-2 mb-3">
                <h3 className={`text-sm sm:text-base font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isAr ? currentPillar.titleAr : currentPillar.titleEn}
                </h3>
                <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isAr ? currentPillar.descAr : currentPillar.descEn}
                </p>
              </div>

              {/* 3 Concise Feature Highlights */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {currentPillar.highlights.map((h, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                      isDark
                        ? 'bg-[#071120] border-white/10 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className={`w-3 h-3 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                    <span>{h}</span>
                  </span>
                ))}
              </div>

              {/* Dual Action: Go to internal page OR request consultation */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={currentPillar.link}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isDark
                      ? 'bg-[#10233D] hover:bg-[#152C4D] border-[#00F2FE]/30 text-[#00F2FE]'
                      : 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-[#0284C7]'
                  }`}
                >
                  <span>{isAr ? 'تفاصيل الخدمة' : 'View Service'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={onOpenContact}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isDark
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120]'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                  }`}
                >
                  <span>{isAr ? 'طلب استشارة' : 'Get Quote'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
