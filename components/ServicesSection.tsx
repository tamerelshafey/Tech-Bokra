'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Camera, 
  Network, 
  ShieldCheck, 
  Smartphone, 
  Layers, 
  Headphones, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  SlidersHorizontal,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { SiteLanguageData, ServiceItem } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';
import { getServiceBySlug, LEGACY_SERVICE_ID_MAP } from '@/lib/services';

interface ServicesSectionProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onSelectService: (serviceTitle: string) => void;
  customServices?: ServiceItem[];
}

export default function ServicesSection({ lang, data, onSelectService, customServices }: ServicesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'security-infra' | 'digital-software' | 'security' | 'network' | 'software' | 'erp' | 'consulting'>('all');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { isDark } = useTheme();

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera':
        return Camera;
      case 'Network':
        return Network;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Smartphone':
        return Smartphone;
      case 'Layers':
        return Layers;
      case 'Headphones':
        return Headphones;
      case 'FileCheck':
        return FileCheck;
      default:
        return Sparkles;
    }
  };

  // Language-aware services resolution: preserve English text in English mode while syncing CMS images
  const baseServices = isAr
    ? (customServices && customServices.length > 0 ? customServices : data.services.list)
    : data.services.list;

  const activeList = baseServices.map((s) => {
    if (customServices && customServices.length > 0) {
      const match = customServices.find((cs) => cs.id === s.id);
      if (match && match.image) {
        return { ...s, image: match.image };
      }
    }
    return s;
  });

  const getServiceTargetUrl = (srv: ServiceItem) => {
    const slug = LEGACY_SERVICE_ID_MAP[srv.id];
    if (slug) {
      const sub = getServiceBySlug(slug);
      if (sub) {
        return `/services/${sub.category}/${sub.slug}`;
      }
    }
    const catMap: Record<string, string> = {
      'security': '/services/security',
      'network': '/services/network',
      'elv': '/services/elv',
      'software': '/services/software',
      'erp': '/services/software',
      'consulting': '/services/security',
    };
    return catMap[srv.category] || `/services/${srv.category || 'security'}`;
  };

  const filteredServices = activeList.filter((s) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'security-infra') {
      return s.category === 'security' || s.category === 'network' || s.category === 'consulting';
    }
    if (activeFilter === 'digital-software') {
      return s.category === 'software' || s.category === 'erp';
    }
    return s.category === activeFilter;
  });

  return (
    <section 
      id="services" 
      className={`py-24 relative transition-colors duration-300 ${
        isDark ? 'bg-[#071120]' : 'bg-white'
      }`}
    >
      {/* Background accents */}
      {isDark && (
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#00F2FE]/10 rounded-full blur-[140px] pointer-events-none" />
      )}

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
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isAr ? 'حلول هندسية وبرمجية متكاملة' : 'Full-Spectrum Engineering Solutions'}</span>
          </div>

          <h2 
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>{isAr ? 'حلولنا وخدماتنا' : 'Our Integrated'}</span>{' '}
            <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>
              {isAr ? 'المتكاملة' : 'Solutions'}
            </span>
          </h2>

          <p 
            className={`text-base sm:text-lg mt-4 leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {data.services.subtitle}
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: data.services.allTab },
            { id: 'security-infra', label: isAr ? 'أنظمة الأمن المادي والبنية التحتية' : 'Physical Security & Infrastructure' },
            { id: 'digital-software', label: isAr ? 'الحلول الرقمية والبرمجيات' : 'Digital Solutions & Software' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  isActive
                    ? isDark
                      ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.35)]'
                      : 'bg-[#0284C7] text-white border-[#0284C7] shadow-md'
                    : isDark
                      ? 'bg-[#10233D] text-slate-300 hover:text-white hover:bg-[#152C4D] border-white/5'
                      : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const Icon = getServiceIcon(service.iconName);
            const targetUrl = getServiceTargetUrl(service);

            return (
              <div
                key={service.id}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group overflow-hidden border ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0F223D] to-[#0A1A2F] border-[#00F2FE]/20 hover:border-[#00F2FE]/50 shadow-[0_15px_35px_rgba(0,0,0,0.4)]'
                    : 'bg-white border-slate-200 hover:border-[#0284C7]/40 shadow-[0_4px_25px_rgba(15,23,42,0.08)] hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Real Image Showcase Linking to Service/Category */}
                  <Link href={targetUrl} className="block group/img">
                    <div 
                      className={`relative w-full h-44 rounded-xl overflow-hidden mb-5 border shadow-md cursor-pointer ${
                        isDark 
                          ? 'border-[#00F2FE]/20 bg-[#0B1A2F]' 
                          : 'border-slate-200 bg-slate-100'
                      }`}
                    >
                      {imageErrors[service.id] ? (
                        <div className="w-full h-full bg-slate-200 dark:bg-[#152C4D] flex items-center justify-center text-slate-400 dark:text-[#00F2FE]/40">
                          <Icon className="w-12 h-12" />
                        </div>
                      ) : (
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          sizes="(max-width: 768px) 100vw, 400px"
                          onError={() => setImageErrors((prev) => ({ ...prev, [service.id]: true }))}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                      
                      <div className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto w-10 h-10 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                        <Icon className="w-5 h-5 text-sky-400" />
                      </div>
                      <span className="absolute bottom-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto text-[11px] font-mono font-bold text-sky-300 bg-slate-950/90 px-2.5 py-0.5 rounded border border-sky-400/30">
                        {service.category}
                      </span>
                    </div>
                  </Link>

                  {/* Title Linking to Service/Category */}
                  <Link href={targetUrl} className="block group/title">
                    <h3 
                      className={`text-xl font-bold mb-2 transition-colors leading-snug cursor-pointer ${
                        isDark 
                          ? 'text-white group-hover/title:text-[#00F2FE]' 
                          : 'text-slate-900 group-hover/title:text-[#0284C7]'
                      }`}
                    >
                      {service.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p 
                    className={`text-xs sm:text-sm mb-5 leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {service.shortDesc}
                  </p>

                  {/* Key Capabilities */}
                  <div 
                    className={`space-y-2.5 mb-6 border-t pt-4 ${
                      isDark ? 'border-white/5' : 'border-slate-100'
                    }`}
                  >
                    {service.points.map((pt, pIdx) => (
                      <div 
                        key={pIdx} 
                        className={`flex items-start gap-2.5 text-xs ${
                          isDark ? 'text-slate-200' : 'text-slate-700 font-medium'
                        }`}
                      >
                        <Check 
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                          }`} 
                        />
                        <span className="leading-relaxed">{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technical Specs & Deliverables Direct Link Button */}
                  <div className="mb-6">
                    <Link
                      href={targetUrl}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-bold transition border group/specs cursor-pointer ${
                        isDark
                          ? 'bg-[#10233D] hover:bg-[#152C4D] text-slate-200 hover:text-[#00F2FE] border-white/10'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#0284C7] border-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-bold">
                        <FileCheck 
                          className={`w-3.5 h-3.5 ${
                            isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                          }`} 
                        />
                        {data.services.viewSpecs}
                      </span>
                      <ArrowIcon className="w-3.5 h-3.5 group-hover/specs:translate-x-1 rtl:group-hover/specs:-translate-x-1 transition" />
                    </Link>
                  </div>
                </div>

                {/* Card CTA Action */}
                <button
                  onClick={() => onSelectService(service.title)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer border ${
                    isDark
                      ? 'bg-[#152C4D] hover:bg-[#00F2FE] text-white hover:text-[#071120] border-transparent hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                      : 'bg-sky-50 hover:bg-[#0284C7] text-[#0284C7] hover:text-white border-sky-200 hover:border-[#0284C7]'
                  }`}
                >
                  <span>{data.services.orderCta}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
