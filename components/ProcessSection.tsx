'use client';

import React from 'react';
import { CheckCircle2, Workflow, ArrowRight, ArrowLeft } from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';

interface ProcessSectionProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onBookSurvey: () => void;
}

export default function ProcessSection({ lang, data, onBookSurvey }: ProcessSectionProps) {
  const isAr = lang === 'ar';
  const { isDark } = useTheme();
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section 
      id="process" 
      className={`py-24 relative border-t transition-colors duration-300 ${
        isDark ? 'bg-[#071120] border-white/5' : 'bg-white border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border ${
              isDark 
                ? 'bg-[#10233D] border-[#00F2FE]/25 text-[#00F2FE]' 
                : 'bg-sky-50 border-sky-200 text-[#0284C7]'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>{isAr ? 'آلية العمل ومنهجية التنفيذ' : 'Work Methodology'}</span>
          </div>

          <h2 
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>{data.process.title}</span>
          </h2>

          <p 
            className={`text-base sm:text-lg mt-4 leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {data.process.subtitle}
          </p>
        </div>

        {/* 4 Process Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {data.process.steps.map((step, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group border ${
                isDark
                  ? 'bg-gradient-to-b from-[#10233D] to-[#0A1A2F] border-[#00F2FE]/20 hover:border-[#00F2FE]/50 shadow-lg'
                  : 'bg-white border-slate-200 hover:border-[#0284C7]/40 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-xl'
              }`}
            >
              <div>
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span 
                    className={`w-12 h-12 rounded-xl font-mono font-black text-xl flex items-center justify-center transition-all border ${
                      isDark
                        ? 'bg-[#071120] border-[#00F2FE]/40 text-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.2)] group-hover:scale-105 group-hover:bg-[#00F2FE] group-hover:text-[#071120]'
                        : 'bg-sky-50 border-sky-200 text-[#0284C7] shadow-sm group-hover:scale-105 group-hover:bg-[#0284C7] group-hover:text-white'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span 
                    className={`text-[10px] font-mono uppercase tracking-widest ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    STAGE {idx + 1}
                  </span>
                </div>

                <h3 
                  className={`text-base font-bold mb-2 leading-snug transition-colors ${
                    isDark 
                      ? 'text-white group-hover:text-[#00F2FE]' 
                      : 'text-slate-900 group-hover:text-[#0284C7]'
                  }`}
                >
                  {step.title}
                </h3>

                <p 
                  className={`text-xs leading-relaxed mb-5 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {step.desc}
                </p>

                {/* Micro checklist of deliverables */}
                <div 
                  className={`space-y-2 border-t pt-4 ${
                    isDark ? 'border-white/5' : 'border-slate-100'
                  }`}
                >
                  {step.features.map((feat, fIdx) => (
                    <div 
                      key={fIdx} 
                      className={`flex items-start gap-2 text-[11px] font-medium ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      <CheckCircle2 
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                        }`} 
                      />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Action Prompt */}
        <div 
          className={`mt-14 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-start border shadow-xl ${
            isDark
              ? 'bg-gradient-to-r from-[#10233D] via-[#0B1A2F] to-[#10233D] border-[#00F2FE]/30'
              : 'bg-gradient-to-r from-sky-50 via-white to-sky-50 border-sky-200'
          }`}
        >
          <div>
            <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isAr ? 'جاهز للتواصل والاستفسار حول مشروعك؟' : 'Ready to inquire about your project?'}
            </h4>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isAr
                ? 'فريقنا الهندسي متاح للإجابة على كافة الاستفسارات وتقديم التوصيات الفنية.'
                : 'Our engineering team is available to answer inquiries and deliver technical recommendations.'}
            </p>
          </div>

          <button
            onClick={onBookSurvey}
            className={`shrink-0 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              isDark
                ? 'bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] shadow-[0_0_20px_rgba(0,242,254,0.35)]'
                : 'bg-[#0284C7] hover:bg-[#0369A1] text-white'
            }`}
          >
            <span>{isAr ? 'تواصل مع مستشارينا الآن' : 'Contact Our Consultants Now'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
