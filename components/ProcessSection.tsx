'use client';

import React from 'react';
import { CheckCircle2, Workflow, ArrowRight, ArrowLeft } from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';

interface ProcessSectionProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onBookSurvey: () => void;
}

export default function ProcessSection({ lang, data, onBookSurvey }: ProcessSectionProps) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section id="process" className="py-24 relative bg-[#071120] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10233D] border border-[#00F2FE]/25 text-xs font-semibold text-[#00F2FE] mb-4">
            <Workflow className="w-3.5 h-3.5" />
            <span>{isAr ? 'آلية العمل ومنهجية التنفيذ' : 'Work Methodology'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            <span>{data.process.title}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            {data.process.subtitle}
          </p>
        </div>

        {/* 4 Process Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {data.process.steps.map((step, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl bg-gradient-to-b from-[#10233D] to-[#0A1A2F] border border-[#00F2FE]/20 hover:border-[#00F2FE]/50 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg group"
            >
              <div>
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="w-12 h-12 rounded-xl bg-[#071120] border border-[#00F2FE]/40 text-[#00F2FE] font-mono font-black text-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.2)] group-hover:scale-105 group-hover:bg-[#00F2FE] group-hover:text-[#071120] transition-all">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    STAGE {idx + 1}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-[#00F2FE] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  {step.desc}
                </p>

                {/* Micro checklist of deliverables */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  {step.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00F2FE] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Action Prompt */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#10233D] via-[#0B1A2F] to-[#10233D] border border-[#00F2FE]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-start shadow-xl">
          <div>
            <h4 className="text-lg font-bold text-white">
              {isAr ? 'جاهز للتواصل والاستفسار حول مشروعك؟' : 'Ready to inquire about your project?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {isAr
                ? 'فريقنا الهندسي متاح للإجابة على كافة الاستفسارات وتقديم التوصيات الفنية.'
                : 'Our engineering team is available to answer inquiries and deliver technical recommendations.'}
            </p>
          </div>

          <button
            onClick={onBookSurvey}
            className="shrink-0 px-6 py-3 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all flex items-center gap-2"
          >
            <span>{isAr ? 'تواصل مع مستشارينا الآن' : 'Contact Our Consultants Now'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
