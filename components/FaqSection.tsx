'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';

interface FaqSectionProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  customFaq?: { q: string; a: string }[];
}

export default function FaqSection({ lang, data, customFaq }: FaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section 
      id="faq" 
      className={`py-24 relative transition-colors duration-300 ${
        isDark ? 'bg-[#071120]' : 'bg-[#F8FAFC]'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div 
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border ${
              isDark 
                ? 'bg-[#10233D] border-[#00F2FE]/25 text-[#00F2FE]' 
                : 'bg-sky-50 border-sky-200 text-[#0284C7]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'إجابات واضحة وشفافة' : 'Transparent Answers'}</span>
          </div>

          <h2 
            className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>{data.faq.title}</span>
          </h2>

          <p 
            className={`text-sm sm:text-base mt-3 leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {data.faq.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {((isAr && customFaq && customFaq.length > 0) ? customFaq : data.faq.items).map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isDark
                    ? 'bg-[#0B1A2F]/90 border-white/10'
                    : 'bg-white border-slate-200 shadow-sm hover:border-[#0284C7]/30'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className={`w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 focus:outline-none transition cursor-pointer ${
                    isDark ? 'hover:bg-[#10233D]/60' : 'hover:bg-slate-50'
                  }`}
                  aria-expanded={isOpen}
                >
                  <span 
                    className={`text-sm sm:text-base font-bold leading-snug ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? isDark 
                          ? 'rotate-180 bg-[#00F2FE] text-[#071120]' 
                          : 'rotate-180 bg-[#0284C7] text-white'
                        : isDark
                          ? 'bg-[#152C4D] text-[#00F2FE]'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div 
                    className={`px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed border-t animate-in fade-in duration-200 ${
                      isDark 
                        ? 'text-slate-300 border-white/5' 
                        : 'text-slate-700 border-slate-100'
                    }`}
                  >
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
