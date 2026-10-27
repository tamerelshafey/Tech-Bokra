'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  PhoneCall, 
  Calculator, 
  Layers, 
  Network, 
  Cpu, 
  Clock, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { ServiceCategory, SubService, ServiceCategoryKey, LEGACY_SERVICE_ID_MAP } from '@/lib/services';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useCustomConfig } from '@/lib/useCustomConfig';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CategoryViewProps {
  category: ServiceCategory;
  subServices: SubService[];
}

export default function CategoryView({ category, subServices }: CategoryViewProps) {
  const { lang, isAr, toggleLanguage, data } = useLanguage();
  const { isDark } = useTheme();
  const [customConfig] = useCustomConfig();

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const categoryIcons: Record<ServiceCategoryKey, React.ReactNode> = {
    security: <ShieldCheck className="w-8 h-8 text-[#00F2FE]" />,
    network: <Network className="w-8 h-8 text-[#00F2FE]" />,
    elv: <Layers className="w-8 h-8 text-[#00F2FE]" />,
    software: <Cpu className="w-8 h-8 text-[#00F2FE]" />,
  };

  const liveServices = subServices.filter((s) => s.status === 'live');
  const comingSoonServices = subServices.filter((s) => s.status === 'coming-soon');

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
      />

      <main className="pt-28 pb-20">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link href="/" className="hover:text-sky-400 transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-sky-400 transition-colors">
              {isAr ? 'الخدمات الهندسية' : 'Engineering Services'}
            </Link>
            <span>/</span>
            <span className={isDark ? 'text-slate-200 font-bold' : 'text-slate-800 font-bold'}>
              {category.title[lang]}
            </span>
          </nav>
        </div>

        {/* Category Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div
            className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-br from-[#0c1a2e] to-[#071120] border-slate-800'
                : 'bg-gradient-to-br from-white to-sky-50/50 border-slate-200 shadow-sm'
            }`}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F2FE]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-2xl border ${
                    isDark ? 'bg-[#10233D] border-[#00F2FE]/30' : 'bg-sky-100 border-sky-300'
                  }`}
                >
                  {categoryIcons[category.id] || <ShieldCheck className="w-8 h-8 text-[#00F2FE]" />}
                </div>
                <span
                  className={`text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${
                    isDark
                      ? 'bg-[#10233D] border-[#00F2FE]/30 text-[#00F2FE]'
                      : 'bg-sky-50 border-sky-200 text-[#0284C7]'
                  }`}
                >
                  {isAr ? 'قطاع هندسي متكامل' : 'Engineering Division'}
                </span>
              </div>

              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {category.title[lang]}
              </h1>

              <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {category.summary[lang]}
              </p>

              {/* Quick Category Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#071120] font-bold text-sm hover:shadow-lg hover:shadow-[#00F2FE]/20 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{isAr ? 'طلب استشارة ومقايسة' : 'Request RFQ & Survey'}</span>
                </Link>

                <Link
                  href="/estimator"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-semibold transition-all ${
                    isDark
                      ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <Calculator className="w-4 h-4 text-[#00F2FE]" />
                  <span>{isAr ? 'حاسبة التكلفة المبدئية' : 'Project Estimator'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Live Sub-Services Section */}
        {liveServices.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-[#00F2FE]" />
              <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'الأنظمة والحلول الجاهزة للتنفيذ' : 'Ready Engineering Solutions'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveServices.map((service) => {
                const customOverride = customConfig.servicesList?.find(
                  (item) => item.id === service.slug || LEGACY_SERVICE_ID_MAP[item.id] === service.slug
                );
                const displayImage = customOverride?.image || service.image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';
                const displayTitle = (isAr && customOverride?.title) ? customOverride.title : service.title[lang];
                const displaySummary = (isAr && customOverride?.shortDesc) ? customOverride.shortDesc : service.summary[lang];

                return (
                  <div
                    key={service.slug}
                    className={`rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      isDark
                        ? 'bg-[#0E1E36] border-slate-800 hover:border-[#00F2FE]/40'
                        : 'bg-white border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    {/* Card Media */}
                    <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={displayImage}
                        alt={displayTitle}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#00F2FE] text-[#071120]">
                          {isAr ? 'مواصفات كاملة' : 'Full Specs'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {displayTitle}
                        </h3>
                        <p className={`text-sm leading-relaxed line-clamp-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {displaySummary}
                        </p>
                      </div>

                      {/* Capabilities Highlights */}
                      {service.capabilities[lang].length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-700/40">
                          {service.capabilities[lang].slice(0, 3).map((cap, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#00F2FE] shrink-0" />
                              <span className="truncate">{cap}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-700/40">
                        <Link
                          href={`/services/${category.id}/${service.slug}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#071120] font-bold text-xs sm:text-sm hover:opacity-95 transition-all"
                        >
                          <span>{isAr ? 'التفاصيل والـ BOQ' : 'Specs & Deliverables'}</span>
                          <ArrowIcon className="w-4 h-4" />
                        </Link>

                        {service.relatedTool === 'storage-calculator' && (
                          <Link
                            href="/engineering-hub?tool=calculator"
                            title={isAr ? 'حاسبة التخزين' : 'Storage Calculator'}
                            className={`p-2.5 rounded-xl border text-slate-300 hover:text-white transition-all ${
                              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
                            }`}
                          >
                            <HardDrive className="w-4 h-4 text-[#00F2FE]" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Coming Soon Services Section */}
        {comingSoonServices.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'أنظمة قيد التطوير والتوسيع' : 'Solutions Under Expansion'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {comingSoonServices.map((service) => (
                <div
                  key={service.slug}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDark
                      ? 'bg-[#0B1728]/70 border-slate-800/80 hover:border-slate-700'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {service.title[lang]}
                    </h3>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {isAr ? 'قريباً' : 'Coming Soon'}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed line-clamp-3 mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {service.summary[lang]}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-700/30">
                    <Link
                      href={`/services/${category.id}/${service.slug}`}
                      className="text-slate-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>{isAr ? 'نظرة سريعة' : 'Quick overview'}</span>
                      <ArrowIcon className="w-3 h-3" />
                    </Link>

                    <Link
                      href={`/contact?service=${service.slug}`}
                      className="text-sky-400 hover:text-sky-300 transition-colors font-medium inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>{isAr ? 'طلب استفسار' : 'Inquire now'}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Category Bottom CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`p-8 sm:p-10 rounded-3xl border text-center relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-r from-[#0C1A2E] to-[#10233D] border-[#00F2FE]/20'
                : 'bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200 shadow-sm'
            }`}
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'هل تحتاج إلى استشارة هندسية في هذا القطاع؟' : 'Need Engineering Consulting for This Division?'}
              </h3>
              <p className={`text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isAr
                  ? 'يقوم فريقنا الهندسي بمعاينة الموقع الميدانية وإعداد المخططات والمقايسات (BOQ) طبقاً لأعلى المعايير.'
                  : 'Our engineering team conducts site surveys, prepares CAD drawings, and provides BOQs according to certified standards.'}
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#071120] font-bold text-sm hover:shadow-lg transition-all"
                >
                  {isAr ? 'تواصل مع المهندس المختص' : 'Contact Division Engineer'}
                </Link>
                <Link
                  href="/services"
                  className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all ${
                    isDark
                      ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {isAr ? 'استعراض كافة القطاعات' : 'Browse All Divisions'}
                </Link>
              </div>
            </div>
          </div>
        </div>
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
      />
    </div>
  );
}
