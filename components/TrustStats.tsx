'use client';

import React from 'react';
import { Award, Building, HardDrive, ShieldCheck } from 'lucide-react';
import { SiteLanguageData } from '@/lib/content';

interface TrustStatsProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  statOverrides?: {
    stat1Val?: string;
    stat2Val?: string;
    stat3Val?: string;
    stat4Val?: string;
  };
}

export default function TrustStats({ lang, data, statOverrides }: TrustStatsProps) {
  const isAr = lang === 'ar';

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
              className="relative rounded-2xl bg-[#0B1A2F]/90 backdrop-blur-md border border-[#00F2FE]/20 hover:border-[#00F2FE]/50 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group overflow-hidden"
            >
              {/* Subtle neon corner highlight */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#00F2FE]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00F2FE]/15 transition-all" />
              
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#10233D] border border-white/5 flex items-center justify-center text-[#00F2FE] group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                  VERIFIED
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono text-glow">
                {stat.val}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-200 mt-1">
                {stat.label}
              </h3>

              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {stat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
