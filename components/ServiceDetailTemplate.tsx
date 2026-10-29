'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  PhoneCall, 
  Calculator, 
  HardDrive, 
  FileCheck, 
  SlidersHorizontal, 
  Layers, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Cpu, 
  Network, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  Check
} from 'lucide-react';
import { SubService, ServiceCategory, getRelatedServices, LEGACY_SERVICE_ID_MAP } from '@/lib/services';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useCustomConfig } from '@/lib/useCustomConfig';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ServiceDetailTemplateProps {
  service: SubService;
  category: ServiceCategory;
}

export default function ServiceDetailTemplate({ service, category }: ServiceDetailTemplateProps) {
  const { lang, isAr, toggleLanguage, data } = useLanguage();
  const { isDark } = useTheme();
  const [customConfig] = useCustomConfig();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Determine if there is a customConfig override for this service
  const customOverride = customConfig.servicesList?.find(
    (item) => item.id === service.slug || LEGACY_SERVICE_ID_MAP[item.id] === service.slug
  );

  // Apply override conservatively:
  // - Custom image applies to both languages
  // - Arabic text only overrides if current language is Arabic
  const displayImage = customOverride?.image || service.image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80';
  const displayTitle = (isAr && customOverride?.title) ? customOverride.title : service.title[lang];
  const displaySummary = (isAr && customOverride?.shortDesc) ? customOverride.shortDesc : service.summary[lang];

  const relatedServicesList = getRelatedServices(service.slug);

  // Construct Tool Link
  let toolUrl = '/contact';
  let toolLabel = isAr ? 'طلب استشارة ومقايسة فنية' : 'Request Consultation';

  if (service.relatedTool === 'storage-calculator') {
    const params = new URLSearchParams();
    params.set('tool', 'calculator');
    if (service.toolPreset) {
      Object.entries(service.toolPreset).forEach(([k, v]) => params.set(k, String(v)));
    }
    toolUrl = `/engineering-hub?${params.toString()}`;
    toolLabel = isAr ? 'حاسبة سعات التخزين والباندويث' : 'Storage & Bandwidth Calculator';
  } else if (service.relatedTool === 'estimator') {
    toolUrl = service.estimatorGroup ? `/estimator?system=${service.estimatorGroup}` : '/estimator';
    toolLabel = isAr ? 'حساب التكلفة التقديرية' : 'Scope Cost Estimator';
  }

  // Standards are filtered authoritatively on the server before being passed to this component
  const isAdminSession = false;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#071120] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      } ${isAr ? 'font-cairo' : 'font-inter'}`}
    >
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        data={data}
        whatsappNumber={customConfig.whatsappNumber}
        logoEmblemStyle={customConfig.logoEmblemStyle}
        customLogoUrl={customConfig.customLogoUrl}
        showProjectsSection={customConfig.showProjectsSection}
        showProcessSection={customConfig.showProcessSection}
        showFaqSection={customConfig.showFaqSection}
        showEstimator={customConfig.showEstimator}
        showTenders={customConfig.showTenders}
        showEngineeringHub={customConfig.showEngineeringHub}
        customProjects={customConfig.projectsList}
      />

      <main className="pt-28 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-400 flex-wrap">
            <Link href="/" className="hover:text-[#00F2FE] transition">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-[#00F2FE] transition">
              {isAr ? 'الخدمات والحلول' : 'Services'}
            </Link>
            <span>/</span>
            <Link href={`/services/${category.slug}`} className="hover:text-[#00F2FE] transition">
              {category.title[lang]}
            </Link>
            <span>/</span>
            <span className={isDark ? 'text-white font-bold' : 'text-slate-900 font-bold'}>
              {displayTitle}
            </span>
          </nav>
        </div>

        {/* COMING SOON BANNER / STATE */}
        {service.status === 'coming-soon' ? (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                {isAr ? 'قيد التطوير والتوثيق الهندسي' : 'Under Engineering Documentation'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black">{displayTitle}</h1>
              <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {displaySummary}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1A2F] border border-white/10 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              {isAr
                ? 'فريق تيك بكرة الهندسي يقوم حالياً بتحديث جداول الكميات والمواصفات الفنية التفصيلية لهذه الخدمة. يمكنك التواصل مباشرة لطلب دراسة فنية مخصصة لمشروعك.'
                : 'Our engineering desk is currently finalizing technical submittal standards for this service. You can request a preliminary site consultation below.'}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href={`/contact?service=${encodeURIComponent(service.slug)}`}
                className="px-6 py-3 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-black text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isAr ? 'طلب دراسة أو تسعير لهذا النظام' : 'Request Study for this System'}</span>
              </Link>
              <Link
                href={`/services/${category.slug}`}
                className="px-6 py-3 rounded-xl bg-[#10233D] hover:bg-[#152C4D] text-slate-200 text-sm font-bold transition flex items-center gap-2 cursor-pointer border border-white/10"
              >
                <span>{isAr ? 'استعراض خدمات القسم الأخرى' : 'Explore Category Services'}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* FULL LIVE SERVICE DETAIL CONTENT */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* HERO SECTION */}
            <section className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border bg-[#10233D] text-[#00F2FE] border-[#00F2FE]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{category.title[lang]}</span>
                </div>

                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {displayTitle}
                </h1>

                <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {displaySummary}
                </p>

                {/* Problem Solved Callout */}
                {service.problemSolved && (
                  <div className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'bg-[#0B1A2F]/90 border-sky-500/20 text-slate-300' : 'bg-sky-50/70 border-sky-200 text-slate-800'
                  }`}>
                    <strong className="block font-bold text-[#00F2FE] mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>{isAr ? 'التحدي الهندسي والقيمة المضافة:' : 'Engineering Challenge & Core Value:'}</span>
                    </strong>
                    <p>{service.problemSolved[lang]}</p>
                  </div>
                )}

                {/* Top Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.slug)}`}
                    className="px-6 py-3.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-black text-sm transition cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{isAr ? 'طلب معاينة وتسعير فوري' : 'Request Site Survey & BOQ'}</span>
                  </Link>

                  {service.relatedTool !== 'none' && (
                    <Link
                      href={toolUrl}
                      className={`px-5 py-3.5 rounded-xl text-sm font-bold transition cursor-pointer border flex items-center gap-2 ${
                        isDark 
                          ? 'bg-[#10233D] hover:bg-[#152C4D] text-slate-200 border-white/10' 
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                      }`}
                    >
                      <Calculator className="w-4 h-4 text-[#00F2FE]" />
                      <span>{toolLabel}</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Service Hero Image */}
              <div className="lg:col-span-5">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                  <Image
                    src={displayImage}
                    alt={displayTitle}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Status Tag */}
                  <span className="absolute bottom-4 right-4 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto px-3 py-1 rounded-full text-xs font-bold bg-black/80 backdrop-blur-md text-[#00F2FE] border border-white/10">
                    {category.slug.toUpperCase()} • B2B TURNKEY
                  </span>
                </div>
              </div>
            </section>

            {/* SECTION 1: CAPABILITIES & SECTORS */}
            <section className="grid md:grid-cols-12 gap-8 pt-6 border-t border-white/10">
              {/* Capabilities (8 cols) */}
              <div className="md:col-span-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-[#00F2FE]" />
                  <span>{isAr ? 'القدرات والمواصفات التشغيلية للمنظومة' : 'Core Engineering Capabilities'}</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {service.capabilities[lang].map((cap, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex items-start gap-3 ${
                        isDark ? 'bg-[#0B1A2F] border-white/5' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <span className="text-xs sm:text-sm leading-relaxed">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Sectors (4 cols) */}
              <div className="md:col-span-4 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  {isAr ? 'القطاعات والمنشآت المستفيدة' : 'Key Industry Sectors'}
                </h3>
                <div className="space-y-2">
                  {service.sectors[lang].map((sector, idx) => (
                    <div
                      key={idx}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                        isDark ? 'bg-[#071120] border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#00F2FE]" />
                      <span>{sector}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 2: COMPONENTS & HARDWARE SPECIFICATIONS */}
            <section className="space-y-6 pt-6 border-t border-white/10">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-amber-400" />
                  <span>{isAr ? 'المكونات والتجهيزات التقنية للحل (Components)' : 'Technical Components & Hardware'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {isAr ? 'نعتمد فقط على توريدات ومعدات قياسية معتمدة مع ضمان رسمي واختبارات تشغيل كاملة' : 'Turnkey hardware sourced through authorized distributions with comprehensive factory warranties'}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.components[lang].map((comp, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-2 ${
                      isDark ? 'bg-[#0B1A2F] border-white/10 hover:border-[#00F2FE]/40' : 'bg-white border-slate-200 shadow-sm'
                    } transition`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>MODULE #{idx + 1}</span>
                      <ShieldCheck className="w-4 h-4 text-[#00F2FE]" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold leading-relaxed">{comp}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 3: DESIGN INPUTS & DELIVERABLES (BOQ & AS-BUILT) */}
            <section className="grid lg:grid-cols-2 gap-8 pt-6 border-t border-white/10">
              {/* Design Inputs Needed */}
              <div className={`p-6 rounded-3xl border space-y-4 ${
                isDark ? 'bg-[#0B1A2F]/80 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-lg font-black flex items-center gap-2 text-sky-400">
                  <SlidersHorizontal className="w-5 h-5 text-sky-400" />
                  <span>{isAr ? 'المدخلات الهندسية المطلوبة للتصميم والمعاينة' : 'Required Engineering Design Inputs'}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr ? 'لإعداد المقايسة الفنية وجدول الكميات (BOQ) بأعلى دقة، يقوم مهندسونا بمراجعة المدخلات التالية:' : 'To engineer precise BOQs and proposal submittals, our technical team evaluates:'}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {service.designInputs[lang].map((input, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{input}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engineering Deliverables */}
              <div className={`p-6 rounded-3xl border space-y-4 ${
                isDark ? 'bg-[#0B1A2F]/80 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-lg font-black flex items-center gap-2 text-emerald-400">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  <span>{isAr ? 'مستندات ومخرجات التسليم الهندسي (Deliverables)' : 'Engineering Project Deliverables'}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr ? 'المستندات والمخططات الرسمية التي يتسلمها العميل عند إنهاء واستلام المشروع:' : 'Standard documentation package handed over upon project commissioning:'}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {service.deliverables[lang].map((del, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>


            {/* SECTION 4: INTEGRATIONS & TECHNICAL STANDARDS */}
            {(() => {
              const visibleStandards = service.standards.filter((std) => std.confirmed || isAdminSession);
              return (
                <section className={`grid ${visibleStandards.length > 0 ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-8 pt-6 border-t border-white/10`}>
                  {/* Integrations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#00F2FE]" />
                      <span>{isAr ? 'التكامل والربط مع الأنظمة الأخرى' : 'Cross-System Integrations'}</span>
                    </h3>
                    <div className="space-y-2.5">
                      {service.integrations[lang].map((integ, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                            isDark ? 'bg-[#0B1A2F] border-white/5 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-[#00F2FE] shrink-0 mt-1.5" />
                          <span>{integ}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Engineering Standards (Zero leakage for visitors when unconfirmed) */}
                  {visibleStandards.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-black flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-sky-400" />
                        <span>{isAr ? 'الأكواد والمعايير الهندسية (Standards)' : 'Compliance & Technical Standards'}</span>
                      </h3>
                      <div className="space-y-2.5">
                        {visibleStandards.map((std, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
                              isDark ? 'bg-[#071120] border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <span className="font-semibold">{std.name}</span>
                            {!std.confirmed && isAdminSession && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                [TO_CONFIRM]
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* SECTION 5: INTERACTIVE FAQ ACCORDION */}
            {service.faq && service.faq.length > 0 && (
              <section className="space-y-6 pt-6 border-t border-white/10">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-[#00F2FE]" />
                    <span>{isAr ? 'الأسئلة الفنية المتكررة' : 'Technical Frequently Asked Questions'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {isAr ? 'إجابات مباشرة من فريقنا الهندسي عن تساؤلات المواصفات والتنفيذ' : 'Direct answers regarding site implementation and design specs'}
                  </p>
                </div>

                <div className="space-y-3">
                  {service.faq.map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border transition overflow-hidden ${
                          isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between text-start gap-4 cursor-pointer"
                        >
                          <span className="font-bold text-xs sm:text-sm">{item.q[lang]}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-[#00F2FE] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                        </button>
                        {isOpen && (
                          <div className={`p-4 sm:p-5 pt-0 text-xs sm:text-sm leading-relaxed border-t ${
                            isDark ? 'border-white/5 text-slate-300' : 'border-slate-100 text-slate-600'
                          }`}>
                            {item.a[lang]}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SECTION 6: RELATED SERVICES */}
            {relatedServicesList.length > 0 && (
              <section className="space-y-6 pt-6 border-t border-white/10">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                    <Network className="w-6 h-6 text-sky-400" />
                    <span>{isAr ? 'حلول ومنظومات هندسية ذات صلة' : 'Related Engineering Solutions'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {isAr ? 'خدمات تتكامل وتعمل سوياً في المشروعات المتكاملة' : 'Complementary systems commonly integrated in turnkey packages'}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedServicesList.map((rel) => {
                    const isLive = rel.status === 'live';
                    if (isLive) {
                      return (
                        <Link
                          key={rel.slug}
                          href={`/services/${rel.category}/${rel.slug}`}
                          className={`p-5 rounded-2xl border transition group ${
                            isDark ? 'bg-[#0B1A2F] border-white/10 hover:border-[#00F2FE]/50' : 'bg-white border-slate-200 hover:shadow-md'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-[#00F2FE] uppercase block mb-1">
                            {rel.category}
                          </span>
                          <h3 className="font-bold text-sm group-hover:text-[#00F2FE] transition mb-2">
                            {rel.title[lang]}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {rel.summary[lang]}
                          </p>
                          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#00F2FE]">
                            <span>{isAr ? 'استعراض المنظومة' : 'Explore System'}</span>
                            <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition" />
                          </div>
                        </Link>
                      );
                    }
                    return (
                      <div
                        key={rel.slug}
                        className={`p-5 rounded-2xl border ${
                          isDark ? 'bg-[#0B1A2F]/60 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                            {rel.category}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {isAr ? 'قريباً' : 'Coming Soon'}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm mb-2 text-slate-300">
                          {rel.title[lang]}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                          {rel.summary[lang]}
                        </p>
                        <Link
                          href={`/contact?service=${encodeURIComponent(rel.slug)}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:underline"
                        >
                          <span>{isAr ? 'طلب دراسة لهذا النظام' : 'Inquire About System'}</span>
                          <ArrowIcon className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* BOTTOM CALL TO ACTION BANNER */}
            <section className={`p-8 sm:p-10 rounded-3xl border text-center space-y-6 ${
              isDark 
                ? 'bg-gradient-to-b from-[#10233D] to-[#071120] border-[#00F2FE]/30 shadow-[0_0_50px_rgba(0,242,254,0.1)]' 
                : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F2FE]">
                  {isAr ? 'جاهزون لبدء دراسة مشروعك' : 'Ready to Engineer Your Facility'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {isAr ? 'احجز موعد معاينة ميدانية مع مهندس المشروع' : 'Schedule a Technical Site Survey with Our Engineers'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isAr
                    ? 'يقوم فريقنا بزيارة موقع منشأتك، مراجعة اشتراطات كراسة الشروط، وإعداد المقايسة الفنية وجدول الكميات بدون أي التزام مسبق.'
                    : 'Our senior engineers will survey your facility, review architectural layouts, and formulate an official BOQ with zero initial commitment.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/contact?service=${encodeURIComponent(service.slug)}`}
                  className="px-8 py-3.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-black text-sm transition cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{isAr ? 'طلب معاينة وتسعير فوري' : 'Request Site Survey'}</span>
                </Link>

                {service.relatedTool !== 'none' && (
                  <Link
                    href={toolUrl}
                    className={`px-6 py-3.5 rounded-xl text-sm font-bold transition cursor-pointer border flex items-center gap-2 ${
                      isDark 
                        ? 'bg-[#0B1A2F] hover:bg-[#152C4D] text-slate-200 border-white/10' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    <Calculator className="w-4 h-4 text-[#00F2FE]" />
                    <span>{toolLabel}</span>
                  </Link>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer
        lang={lang}
        data={data}
        phone={customConfig.phone}
        whatsappNumber={customConfig.whatsappNumber}
        email={customConfig.email}
        address={isAr ? customConfig.addressAr : customConfig.addressEn}
        linkedinUrl={customConfig.linkedinUrl}
        facebookUrl={customConfig.facebookUrl}
        logoEmblemStyle={customConfig.logoEmblemStyle}
        customLogoUrl={customConfig.customLogoUrl}
        brandBio={isAr ? customConfig.brandBioAr : customConfig.brandBioEn}
        commercialRegister={customConfig.commercialRegister}
        taxId={customConfig.taxId}
        footerRights={isAr ? customConfig.footerRightsAr : customConfig.footerRightsEn}
        showProjectsSection={customConfig.showProjectsSection}
        showProcessSection={customConfig.showProcessSection}
        showFaqSection={customConfig.showFaqSection}
        showEstimator={customConfig.showEstimator}
        showTenders={customConfig.showTenders}
        showEngineeringHub={customConfig.showEngineeringHub}
        customProjects={customConfig.projectsList}
      />
    </div>
  );
}
