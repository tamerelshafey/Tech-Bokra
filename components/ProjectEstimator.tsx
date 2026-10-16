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
  Sparkles,
  Layers,
  Camera,
  Network,
  Lock,
  Smartphone
} from 'lucide-react';
import { SiteLanguageData, siteConfig } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';
import { submitInquiry } from '@/lib/dbService';

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
}: ProjectEstimatorProps) {
  const isAr = lang === 'ar';
  const { isDark } = useTheme();

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

    return (
      (isAr ? `تخطيط مقايسة هندسية مبدئية - تيك بكرة:\n` : `Tech Bokra Project Scope Config:\n`) +
      `• ${isAr ? 'القطاع' : 'Sector'}: ${facLabel}\n` +
      `• ${isAr ? 'الأنظمة المطلوبة' : 'Required Systems'}: ${sysLabels}\n` +
      `• ${isAr ? 'حجم المنشأة' : 'Scale'}: ${scaleLabel}\n` +
      `• ${isAr ? 'مستوى الصيانة' : 'SLA'}: ${slaLabel}\n` +
      `• ${isAr ? 'المدة التقديرية' : 'Estimated Duration'}: ${getEstimatedDays()}`
    );
  };

  const handleWhatsAppShare = () => {
    const summary = generateSummaryString();
    const encoded = encodeURIComponent(
      summary + `\n\n${isAr ? 'أرجو التواصل لتحديد موعد المعاينة الفنية الميدانية.' : 'Please arrange a technical survey appointment.'}`
    );

    // Persist estimator lead into Firestore
    submitInquiry({
      clientName: isAr ? 'استفسار من حاسبة التكلفة' : 'Estimator Inquiry Lead',
      phone: 'طلب فوري عبر واتساب',
      facilityType: facilityTypes.find((f) => f.id === facility)?.[isAr ? 'labelAr' : 'labelEn'] || facility,
      selectedSystems: selectedSystems,
      notes: `حجم المنشأة: ${scale} | الضمان: ${slaTier === 'standard' ? 'سنتين' : '24/7 SLA'} | مدة تقديرية: ${getEstimatedDays()}`,
      source: 'estimator',
    }).catch((err) => console.warn('Estimator lead save warning:', err));

    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
  };

  return (
    <section 
      id="estimator" 
      className={`py-24 relative transition-colors duration-300 ${
        isDark ? 'bg-[#071120]' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div 
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border ${
              isDark 
                ? 'bg-[#10233D] border-[#00F2FE]/25 text-[#00F2FE]' 
                : 'bg-sky-50 border-sky-200 text-[#0284C7]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{isAr ? 'أداة التخطيط الهندسي المباشر' : 'Instant Technical Configurator'}</span>
          </div>

          <h2 
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>{data.estimator.title}</span>
          </h2>

          <p 
            className={`text-base sm:text-lg mt-4 leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {data.estimator.subtitle}
          </p>
        </div>

        {/* Configurator 2-Column Container */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 Cols) */}
          <div 
            className={`lg:col-span-7 space-y-8 p-6 sm:p-8 rounded-2xl border backdrop-blur-md shadow-xl ${
              isDark 
                ? 'bg-[#0B1A2F]/80 border-white/10' 
                : 'bg-white border-slate-200 shadow-[0_4px_25px_rgba(15,23,42,0.06)]'
            }`}
          >
            
            {/* Step 1: Facility Type */}
            <div>
              <label 
                className={`block text-sm font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
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
                      className={`p-3.5 rounded-xl border text-start flex flex-col gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                            : 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                          : isDark
                            ? 'bg-[#10233D]/60 border-white/5 hover:border-white/20 text-slate-300'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Icon 
                        className={`w-5 h-5 ${
                          isSelected 
                            ? isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]' 
                            : isDark ? 'text-slate-400' : 'text-slate-500'
                        }`} 
                      />
                      <span 
                        className={`text-xs font-bold leading-tight ${
                          isSelected
                            ? isDark ? 'text-white' : 'text-[#0284C7]'
                            : isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        {isAr ? item.labelAr : item.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Required Systems */}
            <div>
              <label 
                className={`block text-sm font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
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
                      className={`p-3.5 rounded-xl border text-start flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isChecked
                          ? isDark
                            ? 'bg-[#152C4D] border-[#00F2FE] text-white shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                            : 'bg-sky-50 border-[#0284C7] text-slate-900 ring-2 ring-[#0284C7]/20 shadow-sm'
                          : isDark
                            ? 'bg-[#10233D]/60 border-white/5 hover:border-white/20 text-slate-400'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon 
                          className={`w-4 h-4 ${
                            isChecked 
                              ? isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]' 
                              : isDark ? 'text-slate-400' : 'text-slate-500'
                          }`} 
                        />
                        <span 
                          className={`text-xs font-semibold ${
                            isChecked
                              ? isDark ? 'text-white' : 'text-[#0284C7] font-bold'
                              : isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {isAr ? item.labelAr : item.labelEn}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? isDark
                              ? 'bg-[#00F2FE] border-[#00F2FE] text-[#071120]'
                              : 'bg-[#0284C7] border-[#0284C7] text-white'
                            : isDark
                              ? 'border-slate-600 bg-transparent'
                              : 'border-slate-300 bg-white'
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
              <label 
                className={`block text-sm font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {data.estimator.step3}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'small', labelAr: 'محدود (حتى 16 نقطة)', labelEn: 'Small (Up to 16)' },
                  { id: 'medium', labelAr: 'متوسط (16 - 64 نقطة)', labelEn: 'Medium (16 - 64)' },
                  { id: 'enterprise', labelAr: 'مؤسسي (+64 نقطة)', labelEn: 'Enterprise (+64)' },
                ].map((sc) => {
                  const isSelected = scale === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => setScale(sc.id)}
                      className={`py-3 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-[#152C4D] border-[#00F2FE] text-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                            : 'bg-sky-50 border-[#0284C7] text-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                          : isDark
                            ? 'bg-[#10233D]/60 border-white/5 text-slate-300 hover:border-white/20'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {isAr ? sc.labelAr : sc.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Maintenance & SLA */}
            <div>
              <label 
                className={`block text-sm font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {data.estimator.step4}
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSlaTier('standard')}
                  className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer ${
                    slaTier === 'standard'
                      ? isDark
                        ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                        : 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                      : isDark
                        ? 'bg-[#10233D]/60 border-white/5 text-slate-400'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div 
                    className={`text-xs font-bold ${
                      slaTier === 'standard'
                        ? isDark ? 'text-white' : 'text-[#0284C7]'
                        : isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {isAr ? 'ضمان الوكيل القياسي' : 'Standard Agency Warranty'}
                  </div>
                  <div 
                    className={`text-[11px] mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {isAr ? 'ضمان سنتين إلى 3 سنوات على العتاد' : '2-3 Years Hardware Agency Coverage'}
                  </div>
                </button>

                <button
                  onClick={() => setSlaTier('premium')}
                  className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer ${
                    slaTier === 'premium'
                      ? isDark
                        ? 'bg-[#152C4D] border-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                        : 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-sm'
                      : isDark
                        ? 'bg-[#10233D]/60 border-white/5 text-slate-400'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>
                      {isAr ? 'عقد صيانة متقدم 24/7 SLA' : '24/7 Mission Critical SLA'}
                    </span>
                    <span 
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        isDark 
                          ? 'bg-[#00F2FE]/20 text-[#00F2FE]' 
                          : 'bg-sky-100 text-[#0284C7]'
                      }`}
                    >
                      RECOMMENDED
                    </span>
                  </div>
                  <div 
                    className={`text-[11px] mt-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {isAr ? 'زيارات شهرية واستجابة طوارئ خلال ساعتين' : 'Monthly preventative audits & 2-hr response'}
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Results & Actions Summary Column (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div 
              className={`rounded-2xl p-6 sm:p-7 shadow-xl border backdrop-blur-xl ${
                isDark 
                  ? 'bg-gradient-to-b from-[#10233D] to-[#0A1A2F] border-[#00F2FE]/30' 
                  : 'bg-white border-slate-200 shadow-[0_4px_30px_rgba(15,23,42,0.08)]'
              }`}
            >
              
              <div 
                className={`flex items-center justify-between pb-4 border-b ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}
              >
                <span 
                  className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {data.estimator.resultTitle}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              {/* Delivery Timeline Card */}
              <div 
                className={`my-5 p-4 rounded-xl flex items-center justify-between border ${
                  isDark 
                    ? 'bg-[#071120] border-[#00F2FE]/20' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                      isDark 
                        ? 'bg-[#152C4D] text-[#00F2FE] border-transparent' 
                        : 'bg-sky-50 text-[#0284C7] border-sky-100'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span 
                      className={`text-[11px] block font-medium ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {data.estimator.estimatedDelivery}
                    </span>
                    <span 
                      className={`text-sm font-bold font-mono ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {getEstimatedDays()}
                    </span>
                  </div>
                </div>
                <span 
                  className={`text-[10px] px-2 py-1 rounded font-mono font-bold border ${
                    isDark 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  }`}
                >
                  READY TO DISPATCH
                </span>
              </div>

              {/* Selected Highlights */}
              <div 
                className={`space-y-3 mb-6 text-xs ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                <div 
                  className={`flex items-center justify-between py-1.5 border-b ${
                    isDark ? 'border-white/5' : 'border-slate-100'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {isAr ? 'القطاع المختار:' : 'Facility Sector:'}
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {facilityTypes.find((f) => f.id === facility)?.[isAr ? 'labelAr' : 'labelEn']}
                  </span>
                </div>

                <div 
                  className={`flex items-center justify-between py-1.5 border-b ${
                    isDark ? 'border-white/5' : 'border-slate-100'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {isAr ? 'عدد الأنظمة المدمجة:' : 'Integrated Systems:'}
                  </span>
                  <span 
                    className={`font-bold font-mono ${
                      isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                    }`}
                  >
                    {selectedSystems.length} {isAr ? 'أنظمة متكاملة' : 'Systems'}
                  </span>
                </div>

                <div 
                  className={`flex items-center justify-between py-1.5 border-b ${
                    isDark ? 'border-white/5' : 'border-slate-100'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {isAr ? 'الاستشارة الفنية:' : 'Technical Consultation:'}
                  </span>
                  <span className={isDark ? 'text-emerald-400 font-bold' : 'text-emerald-600 font-bold'}>
                    {isAr ? 'متاحة وفورية' : 'Immediate & Available'}
                  </span>
                </div>

                <div 
                  className={`flex items-center justify-between py-1.5 border-b ${
                    isDark ? 'border-white/5' : 'border-slate-100'
                  }`}
                >
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {isAr ? 'مستوى الضمان:' : 'SLA & Warranty:'}
                  </span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {slaTier === 'standard' ? (isAr ? 'ضمان سنتين' : '2 Years Warranty') : (isAr ? 'عقد صيانة 24/7' : '24/7 SLA')}
                  </span>
                </div>
              </div>

              <p 
                className={`text-[11px] leading-relaxed mb-6 italic ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {data.estimator.breakdownNote}
              </p>

              {/* Export Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition transform active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{data.estimator.sendWhatsappBtn}</span>
                </button>

                <button
                  onClick={() => onBookSurveyWithScope(generateSummaryString())}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer border ${
                    isDark
                      ? 'bg-[#152C4D] hover:bg-[#1A3760] border-[#00F2FE]/40 text-white'
                      : 'bg-sky-50 hover:bg-[#0284C7] hover:text-white border-sky-300 text-[#0284C7]'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-[#00F2FE]' : 'text-current'}`} />
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
