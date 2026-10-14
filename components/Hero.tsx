'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Camera, 
  Network, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  Calculator, 
  CheckCircle2, 
  Radio, 
  Lock,
  Headphones
} from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';

interface HeroProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onOpenEstimator: () => void;
  onOpenContact: () => void;
}

export default function Hero({ lang, data, onOpenEstimator, onOpenContact }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'cctv' | 'network' | 'access' | 'cloud'>('cctv');
  const [heroImageError, setHeroImageError] = useState(false);
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const telemetryData = {
    cctv: {
      titleAr: 'منظومة المراقبة المركزية والتحليل الذكي',
      titleEn: 'Centralized Surveillance & AI Video Analytics',
      status: 'ONLINE & SECURED',
      uptime: '99.98%',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'سرعة خط الألياف الضوئية', labelEn: 'Fiber Trunkline Speed', val: '10 Gbps' },
        { labelAr: 'كابلات Cat6A معتمدة', labelEn: 'Certified Drops', val: '350+ Points' },
        { labelAr: 'فقد الحزم (Packet Loss)', labelEn: 'Packet Loss Rate', val: '0.00%' },
        { labelAr: 'أجهزة التوزيع المركزية', labelEn: 'Core Managed Switches', val: 'Cisco PoE+' },
      ],
      descAr: 'شبكات بيانات مهيكلة ومحمية من التداخل الكهرومغناطيسي لضمان استقرار العمليات دون انقطاع.',
      descEn: 'Low-latency structured cabling shielded from electromagnetic interference ensuring non-stop operations.',
      icon: Network,
    },
    access: {
      titleAr: 'أنظمة التحكم بالدخول والبوابات الذكية',
      titleEn: 'Biometric Access Control & Speed Gates',
      status: 'FAIL-SAFE ARMED',
      uptime: '99.99%',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      metrics: [
        { labelAr: 'بوابات دوارة وهيدروليكية', labelEn: 'Speed Gates & Turnstiles', val: '8 Units' },
        { labelAr: 'سرعة التحقق البيومتري', labelEn: 'Biometric Auth Time', val: '0.18 sec' },
        { labelAr: 'حساب الحضور والانصراف', labelEn: 'HR Attendance Sync', val: 'Real-time' },
        { labelAr: 'الفتح التلقائي في الطوارئ', labelEn: 'Fire Interlock Status', val: 'Ready' },
      ],
      descAr: 'تحكم ذكي في صلاحيات الموظفين والزوار مع بوابات مرور سريعة ومزامنة لحظية مع نظام الرواتب.',
      descEn: 'Granular access authorization for personnel and visitors with automated fire interlock and HR sync.',
      icon: Lock,
    },
    cloud: {
      titleAr: 'أنظمة ERP وتطبيقات الأعمال السحابية',
      titleEn: 'Enterprise Cloud ERP & Mobile Apps',
      status: 'SYNCED & BACKED UP',
      uptime: '99.95%',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
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
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#00F2FE]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#0284C7]/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#00F2FE]/5 to-transparent rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Value Proposition Column */}
          <div className="lg:col-span-7 space-y-6 text-start">
            
            {/* Live Engineer Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10233D] border border-[#00F2FE]/30 text-xs sm:text-sm text-slate-200 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F2FE]" />
              </span>
              <span className="font-medium text-slate-300">
                {data.hero.badge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight">
              <span>{data.hero.titleLine1}</span>{' '}
              <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#0284C7] text-glow">
                {data.hero.titleLine2}
              </span>
            </h1>

            {/* Subheading / Value explanation */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              {data.hero.sub}
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
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-[#10233D] hover:bg-[#152C4D] border border-[#00F2FE]/40 hover:border-[#00F2FE] text-[#00F2FE] font-bold text-base transition-all shadow-sm cursor-pointer"
              >
                <Calculator className="w-5 h-5 text-[#00F2FE]" />
                <span>{data.hero.btnEstimate}</span>
              </button>
            </div>

            {/* Quick Guarantees Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00F2FE] shrink-0" />
                <span>{data.hero.guarantee1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00F2FE] shrink-0" />
                <span>{data.hero.guarantee2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00F2FE] shrink-0" />
                <span>{data.hero.guarantee3}</span>
              </div>
            </div>
          </div>

          {/* Interactive Operations Console / Telemetry Column with Live Preview Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-[#10233D] to-[#0B1A2F] border border-[#00F2FE]/30 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl group overflow-hidden">
              
              {/* Header of Console */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {currentTel.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">SLA:</span>
                  <span className="text-xs font-mono font-bold text-[#00F2FE] bg-[#00F2FE]/10 px-2 py-0.5 rounded border border-[#00F2FE]/20">
                    {currentTel.uptime}
                  </span>
                </div>
              </div>

              {/* Sub-system Selector Tabs */}
              <div className="grid grid-cols-4 gap-1.5 py-4">
                <button
                  onClick={() => setActiveTab('cctv')}
                  className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    activeTab === 'cctv'
                      ? 'bg-[#00F2FE] text-[#071120] font-bold shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                      : 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span className="truncate">{isAr ? 'كاميرات' : 'CCTV'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('network')}
                  className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    activeTab === 'network'
                      ? 'bg-[#00F2FE] text-[#071120] font-bold shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                      : 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                  }`}
                >
                  <Network className="w-4 h-4" />
                  <span className="truncate">{isAr ? 'الشبكة' : 'Network'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('access')}
                  className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    activeTab === 'access'
                      ? 'bg-[#00F2FE] text-[#071120] font-bold shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                      : 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span className="truncate">{isAr ? 'البصمة' : 'Access'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('cloud')}
                  className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    activeTab === 'cloud'
                      ? 'bg-[#00F2FE] text-[#071120] font-bold shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                      : 'bg-[#152C4D]/60 text-slate-400 hover:text-slate-200 hover:bg-[#152C4D]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span className="truncate">{isAr ? 'ERP' : 'ERP'}</span>
                </button>
              </div>

              {/* Real Imagery Banner for Selected System */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-4 border border-[#00F2FE]/20 shadow-inner group bg-[#071120]">
                {heroImageError ? (
                  <div className="w-full h-full bg-gradient-to-br from-[#10233D] to-[#071120] flex items-center justify-center text-[#00F2FE]/40">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#071120] via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute bottom-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto text-xs font-mono font-bold text-[#00F2FE] bg-[#071120]/80 px-2 py-0.5 rounded backdrop-blur-sm border border-[#00F2FE]/30">
                  {currentTel.status}
                </div>
              </div>

              {/* Selected System Details */}
              <div className="space-y-4 pt-1">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00F2FE]" />
                    {isAr ? currentTel.titleAr : currentTel.titleEn}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {isAr ? currentTel.descAr : currentTel.descEn}
                  </p>
                </div>

                {/* 4 Live Metrics in Box */}
                <div className="grid grid-cols-2 gap-2.5">
                  {currentTel.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#071120]/80 border border-white/5 hover:border-[#00F2FE]/30 transition-colors"
                    >
                      <div className="text-[10px] text-slate-400 font-medium">
                        {isAr ? metric.labelAr : metric.labelEn}
                      </div>
                      <div className="text-sm font-mono font-bold text-[#00F2FE] mt-0.5">
                        {metric.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Terminal Status Line */}
                <div className="p-2.5 rounded-lg bg-[#071120] border border-[#00F2FE]/15 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-[#00F2FE] animate-pulse" />
                    <span>SYSTEM CORE: READY</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">ONLINE</span>
                </div>
              </div>

              {/* Micro interactive button to trigger direct quote for this specific sub-system */}
              <a
                href="#contact"
                onClick={onOpenContact}
                className="mt-4 w-full py-2.5 rounded-lg bg-[#152C4D] hover:bg-[#1A3760] border border-[#00F2FE]/30 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <span>{isAr ? 'طلب أو استفسار عن هذا النظام' : 'Inquire About this System'}</span>
                <ArrowIcon className="w-3.5 h-3.5 text-[#00F2FE]" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
