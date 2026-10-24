'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider';
import { useCustomConfig } from '@/lib/useCustomConfig';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  PhoneCall, 
  Cpu, 
  FileCheck, 
  Layers, 
  Network, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';
import { 
  SUB_SERVICES, 
  SERVICE_CATEGORIES, 
  ServiceCategoryKey, 
  getServicesByCategory,
  LEGACY_SERVICE_ID_MAP 
} from '@/lib/services';

export default function ServicesPage() {
  const { lang, isAr, toggleLanguage, data } = useLanguage();
  const [customConfig] = useCustomConfig();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { isDark } = useTheme();

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const baseList = isAr
    ? ((customConfig.servicesList && customConfig.servicesList.length > 0) ? customConfig.servicesList : data.services.list)
    : data.services.list;

  const servicesList = baseList.map((s) => {
    if (customConfig.servicesList && customConfig.servicesList.length > 0) {
      const match = customConfig.servicesList.find((cs) => cs.id === s.id);
      if (match && match.image) return { ...s, image: match.image };
    }
    return s;
  });

  const categories = [
    { id: 'all', labelAr: 'كافة الحلول الهندسية', labelEn: 'All Solutions' },
    { id: 'security', labelAr: 'أنظمة الأمن المادي (CCTV والتحكم بالدخول)', labelEn: 'Physical Security Systems' },
    { id: 'network', labelAr: 'البنية التحتية والشبكات ومراكز البيانات', labelEn: 'IT & Infrastructure' },
    { id: 'elv', labelAr: 'أنظمة التيار الخفيف', labelEn: 'Low Current / ELV Systems' },
    { id: 'software', labelAr: 'البرمجيات والحلول الرقمية', labelEn: 'Software & Digital Solutions' },
  ];

  const filteredServices = servicesList.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

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
        {/* Page Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
                isDark 
                  ? 'bg-[#10233D] border-[#00F2FE]/30 text-[#00F2FE]' 
                  : 'bg-sky-50 border-sky-200 text-[#0284C7]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'حلول هندسية وتقنية للأعمال' : 'Engineering & Technology Solutions for Business'}</span>
            </div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>{isAr ? 'حلول تقنية متكاملة،' : 'Integrated Technology Solutions,'}</span>{' '}
              <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>
                {isAr ? 'مصممة وفق احتياجات أعمالك' : 'Engineered for Business'}
              </span>
            </h1>

            <p className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isAr
                ? 'نقدم حلول الأمن المادي والبنية التحتية التقنية والبرمجيات للشركات والمؤسسات، بدءًا من تحديد الاحتياجات والتصميم، وصولًا إلى التنفيذ والدعم المستمر.'
                : 'We deliver physical security systems, technology infrastructure, and software solutions tailored to business needs — from requirements and design to implementation and ongoing support.'}
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer border ${
                    activeCategory === cat.id
                      ? isDark
                        ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE] shadow-[0_0_20px_rgba(0,242,254,0.3)]'
                        : 'bg-[#0284C7] text-white border-[#0284C7] shadow-md'
                      : isDark
                        ? 'bg-[#0B1A2F] text-slate-300 hover:bg-[#10233D] border-white/5'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {isAr ? cat.labelAr : cat.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Services Vertical List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {filteredServices.map((service, idx) => {
            const catKey = service.category as ServiceCategoryKey;
            const subServicesForCat = getServicesByCategory(catKey);

            return (
              <article
                key={service.id || idx}
                id={service.id}
                className={`rounded-3xl border overflow-hidden p-6 sm:p-8 lg:p-10 transition-all ${
                  isDark 
                    ? 'bg-gradient-to-b from-[#0B1A2F] to-[#071120] border-white/10 hover:border-[#00F2FE]/30' 
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  {/* Left/Right Text Content (7 cols) */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-sky-500/20 text-[#00F2FE] border border-sky-500/30 flex items-center justify-center font-bold text-base">
                        0{idx + 1}
                      </span>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                        {service.category.toUpperCase()} SOLUTION
                      </span>
                      <Link
                        href={`/services/${service.category}`}
                        className="text-xs font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 ml-auto"
                      >
                        <span>{isAr ? 'صفحة القطاع' : 'Category Hub'}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {service.title}
                    </h2>

                    <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {service.shortDesc}
                    </p>

                    {/* Sub-Services Explorer Chips */}
                    {subServicesForCat.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`}>
                            {isAr ? 'الأنظمة والحلول التخصصية المتاحة:' : 'Specialized Sub-Systems Available:'}
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            {subServicesForCat.length} {isAr ? 'أنظمة' : 'systems'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {subServicesForCat.map((sub) => {
                            const isLive = sub.status === 'live';
                            return (
                              <Link
                                key={sub.slug}
                                href={`/services/${sub.category}/${sub.slug}`}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                                  isLive
                                    ? isDark
                                      ? 'bg-slate-800/80 hover:bg-[#10233D] text-slate-200 border-slate-700 hover:border-[#00F2FE]/50'
                                      : 'bg-sky-50/70 hover:bg-sky-100 text-slate-700 border-sky-200'
                                    : isDark
                                      ? 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-300'
                                      : 'bg-slate-100/60 text-slate-500 border-slate-200'
                                }`}
                              >
                                <span>{sub.title[lang]}</span>
                                {isLive ? (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                ) : (
                                  <span className="text-[10px] text-amber-400/80 font-normal">
                                    {isAr ? 'قريباً' : 'soon'}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Highlights Bullet List */}
                    {service.points && service.points.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`}>
                          {isAr ? 'أبرز مميزات المنظومة والتنفيذ:' : 'Key Engineering Highlights:'}
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                          {service.points.map((point: string, pIdx: number) => (
                            <div key={pIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technical Specifications Matrix */}
                    {service.specs && service.specs.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-white/5">
                        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          {isAr ? 'المواصفات والمعايير الهندسية (Engineering Standards):' : 'Technical Specifications:'}
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3 text-xs">
                          {service.specs.map((sp: { title: string; desc: string }, spIdx: number) => (
                            <div 
                              key={spIdx} 
                              className={`p-3 rounded-xl border ${
                                isDark ? 'bg-[#071120] border-white/5' : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <strong className={`block mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {sp.title}
                              </strong>
                              <span className="text-slate-400 leading-relaxed block">
                                {sp.desc}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/services/${service.category}`}
                        className="px-6 py-3 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-black text-xs sm:text-sm transition cursor-pointer shadow-md flex items-center gap-2"
                      >
                        <span>{isAr ? 'استعراض أنظمة هذا القطاع' : 'Explore All Systems'}</span>
                        <ArrowIcon className="w-4 h-4" />
                      </Link>

                      <Link
                        href={`/contact?service=${encodeURIComponent(service.id)}`}
                        className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer border flex items-center gap-2 ${
                          isDark 
                            ? 'bg-[#10233D] hover:bg-[#152C4D] text-slate-200 border-white/10' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        <PhoneCall className="w-4 h-4 text-[#00F2FE]" />
                        <span>{isAr ? 'طلب معاينة وتسعير' : 'Request RFQ & Survey'}</span>
                      </Link>

                      {service.category === 'security' && (
                        <Link
                          href="/engineering-hub?tool=calculator"
                          className={`p-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer border flex items-center gap-2 ${
                            isDark 
                              ? 'bg-[#10233D] hover:bg-[#152C4D] text-slate-200 border-white/10' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          }`}
                          title={isAr ? 'حاسبة التخزين الهندسية' : 'Storage Calculator'}
                        >
                          <HardDrive className="w-4 h-4 text-[#00F2FE]" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right/Left Image & Deliverables Box (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover object-center"
                        referrerPolicy="no-referrer"
                        sizes="(max-width: 1024px) 100vw, 500px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Deliverables Box */}
                    {service.deliverables && service.deliverables.length > 0 && (
                      <div className={`p-5 rounded-2xl border ${
                        isDark ? 'bg-[#071120] border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                          isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                        }`}>
                          <FileCheck className="w-4 h-4" />
                          <span>{isAr ? 'مخرجات ومستندات التسليم (Deliverables):' : 'Project Deliverables:'}</span>
                        </h4>
                        <ul className="space-y-2 text-xs">
                          {service.deliverables.map((del: string, dIdx: number) => (
                            <li key={dIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
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
      />
    </div>
  );
}
