'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  Building2, 
  Factory, 
  Palmtree, 
  Landmark, 
  Store, 
  Check, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Layers,
  Camera,
  Network,
  Lock,
  Smartphone
} from 'lucide-react';
import { SiteLanguageData, siteConfig } from '@/lib/content';

interface ProjectEstimatorProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onBookSurveyWithScope: (scopeSummary: string) => void;
  whatsappNumber?: string;
  email?: string;
}

export default function ProjectEstimator({ 
  lang, 
  data, 
  onBookSurveyWithScope,
  whatsappNumber = siteConfig.whatsappNumber,
  email = siteConfig.email
}: ProjectEstimatorProps) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [facility, setFacility] = useState<string>('corporate');
  const [selectedSystems, setSelectedSystems] = useState<string[]>(['cctv', 'network']);
  const [scale, setScale] = useState<string>('medium');
  const [slaTier, setSlaTier] = useState<string>('premium');

  const facilityTypes = [
    { id: 'corporate', labelAr: 'مكاتب وشركات إدارية', labelEn: 'Corporate Offices', icon: Building2 },
    { id: 'industrial', labelAr: 'مصانع ومستودعات', labelEn: 'Factories & Depots', icon: Factory },
    { id: 'hospitality', labelAr: 'قرى سياحية وكمبوندات', labelEn: 'Resorts & Compounds', icon: Palmtree },
    { id: 'governmental', labelAr: 'جهات حكومية وصحية', labelEn: 'Government & Health', icon: Landmark },
    { id: 'retail', labelAr: 'محلات وسلاسل تجارية', labelEn: 'Retail & Commercial', icon: Store },
  ];

  const systemsList = [
    { id: 'cctv', labelAr: 'كاميرات مراقبة 4K وتحليل ذكي', labelEn: '4K CCTV & AI Analytics', icon: Camera },
    { id: 'network', labelAr: 'بنية شبكات وراكات وألياف ضوئية', labelEn: 'Structured Cabling & Fiber', icon: Network },
    { id: 'access', labelAr: 'بوابات دخول وبصمة حضور', labelEn: 'Speed Gates & Biometrics', icon: Lock },
    { id: 'erp', labelAr: 'نظام ERP وفاتورة إلكترونية (ETA)', labelEn: 'ERP System & Egypt Tax', icon: Layers },
    { id: 'mobile', labelAr: 'تطبيقات جوال ومنصات مخصصة', labelEn: 'Custom Mobile App / Portal', icon: Smartphone },
  ];

  const toggleSystem = (id: string) => {
    if (selectedSystems.includes(id)) {
      if (selectedSystems.length > 1) {
        setSelectedSystems(selectedSystems.filter((s) => s !== id));
      }
    } else {
      setSelectedSystems([...selectedSystems, id]);
    }
  };

  const getEstimatedDays = () => {
    let days = 5;
    if (scale === 'small') days = 4;
    if (scale === 'medium') days = 8;
    if (scale === 'enterprise') days = 16;
    if (selectedSystems.length >= 3) days += 5;
    if (selectedSystems.includes('erp') || selectedSystems.includes('mobile')) days += 7;
    return `${days} - ${days + 6} ${isAr ? 'يوم عمل' : 'business days'}`;
  };

  const generateSummaryString = () => {
    const facLabel = facilityTypes.find((f) => f.id === facility)?.[isAr ? 'labelAr' : 'labelEn'] || facility;
    const sysLabels = selectedSystems
      .map((s) => systemsList.find((item) => item.id === s)?.[isAr ? 'labelAr' : 'labelEn'])
      .filter(Boolean)
      .join(', ');
    const scaleLabel =
      scale === 'small'
        ? (isAr ? 'نطاق صغير (حتى 16 نقطة)' : 'Small (Up to 16 Nodes)')
        : scale === 'medium'
        ? (isAr ? 'نطاق متوسط (16 - 64 نقطة)' : 'Medium (16 - 64 Nodes)')
        : (isAr ? 'نطاق مؤسسي كبير (+64 نقطة ومساحات واسعة)' : 'Enterprise (+64 Nodes)');
    const slaLabel =
      slaTier === 'standard'
        ? (isAr ? 'ضمان الأجهزة القياسي' : 'Standard Warranty')
        : (isAr ? 'عقد صيانة متقدم 24/7 SLA مع استجابة طوارئ' : '24/7 Rapid Emergency SLA');

    return isAr
      ? `طلب استفسار وتواصل من تيك بكرة:\n- نوع المنشأة: ${facLabel}\n- الأنظمة المطلوبة: ${sysLabels}\n- الحجم والنطاق: ${scaleLabel}\n- مستوى الصيانة: ${slaLabel}\n- المدة التقديرية المتوقعة: ${getEstimatedDays()}`
      : `Tech Bokra Project Scope Inquiry:\n- Facility Type: ${facLabel}\n- Required Systems: ${sysLabels}\n- Scale: ${scaleLabel}\n- Support Level: ${slaLabel}\n- Estimated Delivery: ${getEstimatedDays()}`;
  };

  const handleWhatsAppShare = () => {
    const text = generateSummaryString();
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmailShare = () => {
    const text = generateSummaryString();
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      isAr ? 'طلب استفسار وتواصل بناءً على حاسبة تيك بكرة' : 'Tech Bokra Project Scope Inquiry'
    )}&body=${encodeURIComponent(text)}`;
  };

  return (
    <section id="estimator" className="py-24 relative bg-[#071120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10233D] border border-[#00F2FE]/25 text-xs font-semibold text-[#00F2FE] mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>{isAr ? 'أداة التخطيط الهندسي المباشر' : 'Instant Technical Configurator'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            <span>{data.estimator.title}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            {data.estimator.subtitle}
          </p>
        </div>

        {/* Configurator 2-Column Container */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 bg-[#0B1A2F]/80 p-6 sm:p-8 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
            
            {/* Step 1: Facility Type */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                {data.estimator.step1}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {facilityTypes.map((item) => {
                  const Icon = item.icon;
                  const isSelected = facility === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setFacility(item.id)}
                      className={`p-3 rounded-xl border text-start flex flex-col gap-2 transition-all ${
                        isSelected
                          ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                          : 'bg-[#10233D]/60 border-white/5 hover:border-white/20 text-slate-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[#00F2FE]' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold leading-tight text-white">
                        {isAr ? item.labelAr : item.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Required Systems */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                {data.estimator.step2}
              </label>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {systemsList.map((item) => {
                  const Icon = item.icon;
                  const isChecked = selectedSystems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleSystem(item.id)}
                      className={`p-3 rounded-xl border text-start flex items-center justify-between gap-2 transition-all ${
                        isChecked
                          ? 'bg-[#152C4D] border-[#00F2FE] text-white shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                          : 'bg-[#10233D]/60 border-white/5 hover:border-white/20 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isChecked ? 'text-[#00F2FE]' : 'text-slate-400'}`} />
                        <span className="text-xs font-semibold text-white">
                          {isAr ? item.labelAr : item.labelEn}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? 'bg-[#00F2FE] border-[#00F2FE] text-[#071120]'
                            : 'border-slate-600 bg-transparent'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Project Scale */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                {data.estimator.step3}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'small', labelAr: 'محدود (حتى 16 نقطة)', labelEn: 'Small (Up to 16)' },
                  { id: 'medium', labelAr: 'متوسط (16 - 64 نقطة)', labelEn: 'Medium (16 - 64)' },
                  { id: 'enterprise', labelAr: 'مؤسسي (+64 نقطة)', labelEn: 'Enterprise (+64)' },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setScale(sc.id)}
                    className={`py-3 px-2 rounded-xl border text-center text-xs font-bold transition-all ${
                      scale === sc.id
                        ? 'bg-[#152C4D] border-[#00F2FE] text-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                        : 'bg-[#10233D]/60 border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {isAr ? sc.labelAr : sc.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Maintenance & SLA */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                {data.estimator.step4}
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSlaTier('standard')}
                  className={`p-3.5 rounded-xl border text-start transition-all ${
                    slaTier === 'standard'
                      ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                      : 'bg-[#10233D]/60 border-white/5 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-white">
                    {isAr ? 'ضمان الوكيل القياسي' : 'Standard Agency Warranty'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {isAr ? 'ضمان سنتين إلى 3 سنوات على العتاد' : '2-3 Years Hardware Agency Coverage'}
                  </div>
                </button>

                <button
                  onClick={() => setSlaTier('premium')}
                  className={`p-3.5 rounded-xl border text-start transition-all ${
                    slaTier === 'premium'
                      ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                      : 'bg-[#10233D]/60 border-white/5 text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold text-[#00F2FE] flex items-center justify-between">
                    <span>{isAr ? 'عقد صيانة متقدم 24/7 SLA' : '24/7 Mission Critical SLA'}</span>
                    <span className="text-[9px] bg-[#00F2FE]/20 text-[#00F2FE] px-1.5 py-0.5 rounded font-mono">
                      RECOMMENDED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    {isAr ? 'زيارات شهرية واستجابة طوارئ خلال ساعتين' : 'Monthly preventative audits & 2-hr response'}
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Results & Actions Summary Column (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="rounded-2xl bg-gradient-to-b from-[#10233D] to-[#0A1A2F] border border-[#00F2FE]/30 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-[#00F2FE] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {data.estimator.resultTitle}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              {/* Delivery Timeline Card */}
              <div className="my-5 p-4 rounded-xl bg-[#071120] border border-[#00F2FE]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#152C4D] flex items-center justify-center text-[#00F2FE]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {data.estimator.estimatedDelivery}
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {getEstimatedDays()}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded font-mono font-bold border border-emerald-500/20">
                  READY TO DISPATCH
                </span>
              </div>

              {/* Selected Highlights */}
              <div className="space-y-3 mb-6 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{isAr ? 'القطاع المختار:' : 'Facility Sector:'}</span>
                  <span className="text-white font-bold">
                    {facilityTypes.find((f) => f.id === facility)?.[isAr ? 'labelAr' : 'labelEn']}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{isAr ? 'عدد الأنظمة المدمجة:' : 'Integrated Systems:'}</span>
                  <span className="text-[#00F2FE] font-bold font-mono">
                    {selectedSystems.length} {isAr ? 'أنظمة متكاملة' : 'Systems'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{isAr ? 'الاستشارة الفنية:' : 'Technical Consultation:'}</span>
                  <span className="text-emerald-400 font-bold">
                    {isAr ? 'متاحة وفورية' : 'Immediate & Available'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{isAr ? 'مستوى الضمان:' : 'SLA & Warranty:'}</span>
                  <span className="text-white font-medium">
                    {slaTier === 'standard' ? (isAr ? 'ضمان سنتين' : '2 Years Warranty') : (isAr ? 'عقد صيانة 24/7' : '24/7 SLA')}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-6 italic">
                {data.estimator.breakdownNote}
              </p>

              {/* Export Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.3)] transition transform active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{data.estimator.sendWhatsappBtn}</span>
                </button>

                <button
                  onClick={() => onBookSurveyWithScope(generateSummaryString())}
                  className="w-full py-3 px-4 rounded-xl bg-[#152C4D] hover:bg-[#1A3760] border border-[#00F2FE]/40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-[#00F2FE]" />
                  <span>{data.estimator.sendEmailBtn}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
