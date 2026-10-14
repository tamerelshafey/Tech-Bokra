'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';

interface FaqSectionProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
}

export default function FaqSection({ lang, data }: FaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const isAr = lang === 'ar';

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#071120]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10233D] border border-[#00F2FE]/25 text-xs font-semibold text-[#00F2FE] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'إجابات واضحة وشفافة' : 'Transparent Answers'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            <span>{data.faq.title}</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            {data.faq.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {data.faq.items.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0B1A2F]/90 border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 focus:outline-none hover:bg-[#10233D]/60 transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {item.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#152C4D] flex items-center justify-center text-[#00F2FE] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#00F2FE] text-[#071120]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
