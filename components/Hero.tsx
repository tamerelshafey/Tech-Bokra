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
  Headphones
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
  const [activeTab, setActiveTab] = useState<'cctv' | 'network' | 'access' | 'cloud'>('cctv');
  const [heroImageError, setHeroImageError] = useState(false);
  const { isDark } = useTheme();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const telemetryData = {
    cctv: {
      titleAr: 'منظومة المراقبة المركزية والتحليل الذكي',
      titleEn: 'Centralized Surveillance & AI Video Analytics',
      status: 'ONLINE & SECURED',
      uptime: '99.98%',
      image: heroOverrides?.cctvImage || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'كاميرات 4K متصلة', labelEn: '4K Active Cameras', val: '128 Node' },
        { labelAr: 'تحليل الذكاء الاصطناعي', labelEn: 'AI Perimeter Guard', val: 'Active 24/7' },
        { labelAr: 'تخزين سحابي ومحلي', labelEn: 'RAID 6 Storage', val: '60 Days Loop' },
        { labelAr: 'زمن استجابة التنبيه', labelEn: 'Alarm Response Latency', val: '0.4 sec' },
      ],
      descAr: 'بث فائق الدقة 4K مع تتبع فوري للأجسام، قراءة لوحات السيارات، وكشف التسلل الليلي الملون.',
      descEn: 'Ultra HD 4K video feeds with edge AI tracking, ANPR plate recognition, and 24/7 Full-Color night vision.',
      icon: Camera,
    },
    network: {
      titleAr: 'البنية التحتية والشبكة المهيكلة',
      titleEn: 'Structured Network & Fiber Backbone',
      status: 'HIGH-SPEED LINK',
      uptime: '100.0%',
      image: heroOverrides?.networkImage || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'سرعة الربط الأساسي', labelEn: 'Backbone Throughput', val: '10 Gbps' },
        { labelAr: 'كبائن الخوادم المجهزة', labelEn: 'Rack Enclosures', val: '12 Rack' },
        { labelAr: 'نقاط الشبكة الفعالة', labelEn: 'Terminated Drops', val: '1,450 Node' },
        { labelAr: 'زمن الفقد بالفيبر', labelEn: 'Fiber Attenuation', val: '< 0.15 dB' },
      ],
      descAr: 'تمديدات فايبر أوبتك وكابلات Cat6A/Cat7 معتمدة، كبائن سيرفرات معزولة، ومفاتيح شبكة مدارة بالكامل.',
      descEn: 'Enterprise Cat6A/Cat7 structured cabling, certified fiber optic links, and high-availability core routing.',
      icon: Network,
    },
    access: {
      titleAr: 'التحكم بالأبواب والبوابات الذكية',
      titleEn: 'Smart Access Control & Turnstiles',
      status: 'MONITORED',
      uptime: '99.99%',
      image: heroOverrides?.accessImage || 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'بوابات ذكية مجهزة', labelEn: 'Access Turnstiles', val: '16 Gates' },
        { labelAr: 'سعة التعرف على الوجه', labelEn: 'Facial Capacity', val: '50,000 ID' },
        { labelAr: 'سرعة التحقق البيومتري', labelEn: 'Auth Latency', val: '0.2 sec' },
        { labelAr: 'تكامل إنذار الحريق', labelEn: 'Fire Alarm Fail-Safe', val: 'Integrated' },
      ],
      descAr: 'أجهزة بصمة وجه وبصمة إصبع لا تلامسية، بوابات دخول الموظفين، وقفل مغناطيسي مرتبط بنظام الإخلاء.',
      descEn: 'Biometric face recognition readers, tripod turnstiles, and emergency fail-safe magnetic locks.',
      icon: Lock,
    },
    cloud: {
      titleAr: 'تطبيقات الجوال وحلول ERP السحابية',
      titleEn: 'Enterprise Cloud ERP & Mobile Apps',
      status: 'SYNCED & BACKED UP',
      uptime: '99.95%',
      image: heroOverrides?.cloudImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'الفاتورة الإلكترونية (ETA)', labelEn: 'Egypt Tax Compliance', val: '100% Valid' },
        { labelAr: 'تطبيق الجوال المتصل', labelEn: 'Active App Users', val: '+8,000' },
        { labelAr: 'زمن استجابة قواعد البيانات', labelEn: 'Database Response', val: '18 ms' },
        { labelAr: 'النسخ الاحتياطي التلقائي', labelEn: 'Offsite Cloud Backup', val: 'Every 6 hrs' },
      ],
      descAr: 'إدارة متكاملة للمخازن، الحسابات، نقاط البيع، والموارد البشرية مع ربط معتمد لمصلحة الضرائب المصرية.',
      descEn: 'Unified warehouse, POS, accounting, and HR management integrated with official Egyptian Tax APIs.',
      icon: Layers,
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
              isDark ? 'text-slate-300' : 'text-slate-600'
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
                  <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>SLA:</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    isDark
                      ? 'text-[#00F2FE] bg-[#00F2FE]/10 border-[#00F2FE]/20'
                      : 'text-[#0284C7] bg-sky-50 border-sky-200'
                  }`}>
                    {currentTel.uptime}
                  </span>
                </div>
              </div>

              {/* Sub-system Selector Tabs */}
              <div className="grid grid-cols-4 gap-1.5 py-4">
                <button
                  onClick={() => setActiveTab('cctv')}
                  className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'cctv'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold shadow-md'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span className="truncate">{isAr ? 'كاميرات' : 'CCTV'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('network')}
                  className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'network'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold shadow-md'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Network className="w-4 h-4" />
                  <span className="truncate">{isAr ? 'الشبكة' : 'Network'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('access')}
                  className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'access'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold shadow-md'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span className="truncate">{isAr ? 'البصمة' : 'Access'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('cloud')}
                  className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'cloud'
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-bold shadow-md'
                      : isDark
                        ? 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span className="truncate">{isAr ? 'ERP' : 'ERP'}</span>
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
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
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
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isAr ? metric.labelAr : metric.labelEn}
                      </div>
                      <div className={`text-sm font-mono font-bold mt-0.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`}>
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
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Radio className={`w-3.5 h-3.5 animate-pulse ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                    <span>SYSTEM CORE: READY</span>
                  </div>
                  <span className="text-emerald-500 font-semibold">ONLINE</span>
                </div>
              </div>

              {/* Micro interactive button to trigger direct quote for this specific sub-system */}
              <button
                type="button"
                onClick={onOpenContact}
                className={`mt-4 w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  isDark
                    ? 'bg-[#152C4D] hover:bg-[#1A3760] border-[#00F2FE]/30 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}
              >
                <span>{isAr ? 'طلب أو استفسار عن هذا النظام' : 'Inquire About this System'}</span>
                <ArrowIcon className={`w-3.5 h-3.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
