'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  ChevronDown,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';

interface ServicesSectionProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onSelectService: (serviceTitle: string) => void;
}

export default function ServicesSection({ lang, data, onSelectService }: ServicesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'security' | 'network' | 'software' | 'erp'>('all');
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
      default:
        return Sparkles;
    }
  };

  const toggleSpecs = (id: string) => {
    setExpandedSpecs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredServices = data.services.list.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.category === activeFilter;
  });

  return (
    <section id="services" className="py-24 relative bg-[#071120]">
      {/* Background accents */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#00F2FE]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10233D] border border-[#00F2FE]/25 text-xs font-semibold text-[#00F2FE] mb-4">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isAr ? 'حلول هندسية وبرمجية متكاملة' : 'Full-Spectrum Engineering Solutions'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            <span>{isAr ? 'حلولنا وخدماتنا' : 'Our Integrated'}</span>{' '}
            <span className="text-[#00F2FE]">{isAr ? 'المتكاملة' : 'Solutions'}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            {data.services.subtitle}
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: data.services.allTab },
            { id: 'security', label: data.services.secTab },
            { id: 'network', label: data.services.netTab },
            { id: 'software', label: data.services.softTab },
            { id: 'erp', label: data.services.erpTab },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#00F2FE] text-[#071120] shadow-[0_0_15px_rgba(0,242,254,0.35)]'
                  : 'bg-[#10233D] text-slate-300 hover:text-white hover:bg-[#152C4D] border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const Icon = getServiceIcon(service.iconName);
            const isSpecsOpen = !!expandedSpecs[service.id];

            return (
              <div
                key={service.id}
                className="rounded-2xl bg-gradient-to-b from-[#0F223D] to-[#0A1A2F] border border-[#00F2FE]/20 hover:border-[#00F2FE]/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_15px_35px_rgba(0,0,0,0.4)] group overflow-hidden"
              >
                <div>
                  {/* Real Image Showcase */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-5 border border-[#00F2FE]/20 shadow-md bg-[#0B1A2F]">
                    {imageErrors[service.id] ? (
                      <div className="w-full h-full bg-gradient-to-br from-[#152C4D] to-[#071120] flex items-center justify-center text-[#00F2FE]/40">
                        <Icon className="w-12 h-12" />
                      </div>
                    ) : (
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        sizes="(max-width: 768px) 100vw, 400px"
                        onError={() => setImageErrors((prev) => ({ ...prev, [service.id]: true }))}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F] via-[#0A1A2F]/30 to-transparent pointer-events-none" />
                    <div className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto w-10 h-10 rounded-xl bg-[#071120]/80 backdrop-blur-md border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE] shadow-lg">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="absolute bottom-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto text-[11px] font-mono font-bold text-[#00F2FE] bg-[#071120]/90 px-2.5 py-0.5 rounded border border-[#00F2FE]/30">
                      {service.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00F2FE] transition-colors leading-snug">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Key Capabilities */}
                  <div className="space-y-2.5 mb-6 border-t border-white/5 pt-4">
                    {service.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <Check className="w-4 h-4 text-[#00F2FE] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Technical Specs Accordion */}
                  <div className="mb-6">
                    <button
                      onClick={() => toggleSpecs(service.id)}
                      className="w-full flex items-center justify-between py-2 text-xs font-semibold text-slate-300 hover:text-[#00F2FE] transition border-t border-dashed border-white/10"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-[#00F2FE]" />
                        {data.services.viewSpecs}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSpecsOpen ? 'rotate-180 text-[#00F2FE]' : ''
                        }`}
                      />
                    </button>

                    {isSpecsOpen && (
                      <div className="p-3.5 rounded-xl bg-[#071120]/90 border border-[#00F2FE]/20 mt-2 space-y-2 text-xs animate-in fade-in duration-200">
                        {service.specs.map((sp, sIdx) => (
                          <div key={sIdx} className="flex flex-col gap-0.5">
                            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">
                              {sp.title}:
                            </span>
                            <span className="text-[#00F2FE] font-medium">{sp.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card CTA Action */}
                <button
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#152C4D] hover:bg-[#00F2FE] text-white hover:text-[#071120] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]"
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
