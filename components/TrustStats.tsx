'use client';

import React from 'react';
import { Award, Building, HardDrive, ShieldCheck } from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';

interface TrustStatsProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  showSection?: boolean;
  statOverrides?: {
    stat1Val?: string;
    stat2Val?: string;
    stat3Val?: string;
    stat4Val?: string;
  };
}

export default function TrustStats({ lang, data, statOverrides, showSection = false }: TrustStatsProps) {
  const isAr = lang === 'ar';
  const { isDark } = useTheme();

  // If section is disabled (default false pending official evidence audit), do not render
  if (!showSection) {
    return null;
  }

  const stats = [
    {
      val: statOverrides?.stat1Val || data.stats.stat1Val,
      label: data.stats.stat1Label,
      desc: data.stats.stat1Desc,
      icon: Award,
    },
    {
      val: statOverrides?.stat2Val || data.stats.stat2Val,
      label: data.stats.stat2Label,
      desc: data.stats.stat2Desc,
      icon: Building,
    },
    {
      val: statOverrides?.stat3Val || data.stats.stat3Val,
      label: data.stats.stat3Label,
      desc: data.stats.stat3Desc,
      icon: HardDrive,
    },
    {
      val: statOverrides?.stat4Val || data.stats.stat4Val,
      label: data.stats.stat4Label,
      desc: data.stats.stat4Desc,
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative z-20 -mt-6 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 group overflow-hidden border ${
                isDark
                  ? 'bg-[#0B1A2F]/90 backdrop-blur-md border-[#00F2FE]/20 hover:border-[#00F2FE]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                  : 'bg-white border-slate-200 hover:border-[#0284C7]/40 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-lg'
              }`}
            >
              {/* Subtle corner highlight */}
              <div 
                className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none transition-all ${
                  isDark 
                    ? 'bg-[#00F2FE]/5 group-hover:bg-[#00F2FE]/15' 
                    : 'bg-sky-50 group-hover:bg-sky-100'
                }`} 
              />
              
              <div className="flex items-center justify-between mb-3">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border ${
                    isDark
                      ? 'bg-[#10233D] border-white/5 text-[#00F2FE]'
                      : 'bg-sky-50 border-sky-100 text-[#0284C7]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className={`text-3xl sm:text-4xl font-black tracking-tight font-mono ${
                isDark ? 'text-white text-glow' : 'text-slate-900'
              }`}>
                {stat.val}
              </div>

              <h3 className={`text-sm sm:text-base font-bold mt-1 ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
                {stat.label}
              </h3>

              <p className={`text-xs mt-0.5 leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {stat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
