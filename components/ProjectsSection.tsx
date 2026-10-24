'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building2, 
  ShieldAlert, 
  Smartphone, 
  Home, 
  BarChart3, 
  Cpu, 
  ExternalLink,
  Sparkles,
  Layers,
  Globe,
  Radio,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Project, SiteLanguageData } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';

interface ProjectsSectionProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onConsultProject: (projectTitle: string) => void;
  projectUrlOverrides?: Record<string, string>;
  customProjects?: Project[];
}

type FilterCategory = 'all' | 'upcoming' | 'security' | 'network' | 'software' | 'erp';

export default function ProjectsSection({ lang, data, onConsultProject, projectUrlOverrides, customProjects }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { isDark } = useTheme();

  const isAr = lang === 'ar';

  const getProjectIcon = (icon: string) => {
    switch (icon) {
      case 'Building2':
        return Building2;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Smartphone':
        return Smartphone;
      case 'Home':
        return Home;
      case 'BarChart3':
        return BarChart3;
      case 'Cpu':
        return Cpu;
      case 'Sparkles':
        return Sparkles;
      case 'Globe':
        return Globe;
      default:
        return Layers;
    }
  };

  // Language-aware project list resolution: preserve English text in English mode while syncing CMS images/drafts
  const baseProjects = isAr
    ? (customProjects && customProjects.length > 0 ? customProjects : data.projects.list)
    : data.projects.list;

  const rawProjects = baseProjects.map((p) => {
    if (customProjects && customProjects.length > 0) {
      const customMatch = customProjects.find((cp) => cp.id === p.id);
      if (customMatch) {
        return {
          ...p,
          image: customMatch.image || p.image,
          liveUrl: customMatch.liveUrl || p.liveUrl,
          isDraft: customMatch.isDraft !== undefined ? customMatch.isDraft : p.isDraft,
          isUpcoming: customMatch.isUpcoming !== undefined ? customMatch.isUpcoming : p.isUpcoming,
        };
      }
    }
    return p;
  });

  // Exclude projects marked as draft so only published projects appear to clients
  const activeProjects = rawProjects.filter((p) => p.isDraft !== true);

  const filteredProjects = activeProjects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return p.isUpcoming === true;
    return p.category === filter;
  });

  return (
    <section 
      id="projects" 
      className={`py-24 relative transition-colors duration-300 border-t ${
        isDark 
          ? 'bg-[#071120] border-white/5' 
          : 'bg-[#F8FAFC] border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div 
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border shadow-sm ${
              isDark 
                ? 'bg-[#10233D] border-[#00F2FE]/30 text-[#00F2FE]' 
                : 'bg-sky-50 border-sky-200 text-[#0284C7]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'سجل الإنجازات والمنصات الذكية' : 'Proven Implementations & Platforms'}</span>
          </div>

          <h2 
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>{data.projects.title}</span>
          </h2>

          <p 
            className={`text-base sm:text-lg mt-4 leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {data.projects.subtitle}
          </p>

          {data.projects.confidentialityNotice && (
            <div className={`text-xs mt-3 max-w-2xl mx-auto px-4 py-2 rounded-xl border ${
              isDark ? 'bg-[#0B1A2F]/80 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <span>🔒 {data.projects.confidentialityNotice}</span>
            </div>
          )}
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: data.projects.filterAll },
            { id: 'upcoming', label: data.projects.filterUpcoming || (isAr ? 'منصات قيد التجهيز / شقيقة' : 'Upcoming & Sister Platforms'), isSpecial: true },
            { id: 'security', label: data.projects.filterSecurity },
            { id: 'network', label: data.projects.filterNetwork },
            { id: 'software', label: data.projects.filterSoftware },
            { id: 'erp', label: data.projects.filterERP },
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as FilterCategory)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? isDark
                      ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.35)] scale-105'
                      : 'bg-[#0284C7] text-white border-[#0284C7] shadow-md scale-105'
                    : tab.isSpecial
                      ? isDark
                        ? 'bg-[#10233D] text-[#00F2FE] hover:text-white hover:bg-[#152C4D] border-[#00F2FE]/40'
                        : 'bg-sky-50 text-[#0284C7] hover:bg-sky-100 border-sky-300'
                      : isDark
                        ? 'bg-[#10233D] text-slate-300 hover:text-white hover:bg-[#152C4D] border-white/5'
                        : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {tab.isSpecial && (
                  <Radio className={`w-3.5 h-3.5 animate-pulse ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const Icon = getProjectIcon(project.icon);

            return (
              <div
                key={project.id}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative border ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0F223D] to-[#0A1A2F] border-[#00F2FE]/20 hover:border-[#00F2FE]/50 shadow-[0_15px_35px_rgba(0,0,0,0.4)]'
                    : 'bg-white border-slate-200 hover:border-[#0284C7]/40 shadow-[0_4px_25px_rgba(15,23,42,0.08)] hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Real Project Photography Banner */}
                  <div 
                    className={`relative w-full h-48 rounded-xl overflow-hidden mb-5 border shadow-md ${
                      isDark 
                        ? 'border-[#00F2FE]/20 bg-[#0B1A2F]' 
                        : 'border-slate-200 bg-slate-100'
                    }`}
                  >
                    {imageErrors[project.id] ? (
                      <div className="w-full h-full bg-slate-200 dark:bg-[#152C4D] flex items-center justify-center text-slate-400 dark:text-[#00F2FE]/40">
                        <Icon className="w-12 h-12" />
                      </div>
                    ) : (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        sizes="(max-width: 768px) 100vw, 400px"
                        onError={() => setImageErrors((prev) => ({ ...prev, [project.id]: true }))}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />
                    
                    <div className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto w-10 h-10 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                      <Icon className="w-5 h-5 text-sky-400" />
                    </div>

                    {/* Tag / Category Badge */}
                    <span className="absolute bottom-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto text-[11px] font-mono font-bold text-sky-300 bg-slate-950/90 px-2.5 py-0.5 rounded border border-sky-400/30">
                      {project.tag}
                    </span>

                    {/* Prominent Status Badge if upcoming / sister platform */}
                    {project.statusBadge && (
                      <span className="absolute top-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-[10px] font-bold text-amber-200 bg-amber-950/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/50 flex items-center gap-1 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>{project.statusBadge}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Client */}
                  <h3 
                    className={`text-xl font-bold mb-1.5 transition-colors leading-snug ${
                      isDark 
                        ? 'text-white group-hover:text-[#00F2FE]' 
                        : 'text-slate-900 group-hover:text-[#0284C7]'
                    }`}
                  >
                    {project.title}
                  </h3>

                  <p 
                    className={`text-xs font-semibold mb-2.5 ${
                      isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                    }`}
                  >
                    {project.client}
                  </p>

                  <p 
                    className={`text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {project.summary}
                  </p>

                  {/* 3 Quick Stat Badges */}
                  {project.stats && project.stats.length > 0 && (
                    <div 
                      className={`grid grid-cols-3 gap-2 py-3 border-t mb-5 text-center ${
                        isDark ? 'border-white/5' : 'border-slate-100'
                      }`}
                    >
                      {project.stats.map((st, sIdx) => (
                        <div 
                          key={sIdx} 
                          className={`p-2 rounded-lg border ${
                            isDark 
                              ? 'bg-[#10233D]/60 border-white/5' 
                              : 'bg-slate-50 border-slate-200/80'
                          }`}
                        >
                          <div 
                            className={`text-[10px] truncate ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {st.label}
                          </div>
                          <div 
                            className={`text-xs font-bold font-mono mt-0.5 truncate ${
                              isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                            }`}
                          >
                            {st.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* INLINE EXPANDED CASE STUDY DRAWER (NO POPUP!) */}
                  {expandedProjectId === project.id && (
                    <div className={`p-4 rounded-2xl border space-y-3 mb-4 animate-fadeIn ${
                      isDark ? 'bg-[#071120] border-[#00F2FE]/30' : 'bg-sky-50/70 border-sky-200'
                    }`}>
                      {project.challenges && project.challenges.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                            <span>⚠️</span>
                            <span>{isAr ? 'التحدي التقني والهندسي:' : 'The Challenge:'}</span>
                          </h4>
                          <ul className="space-y-1 text-xs text-slate-300">
                            {project.challenges.map((ch, chIdx) => (
                              <li key={chIdx} className="leading-relaxed">• {ch}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {project.solutions && project.solutions.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                            <span>💡</span>
                            <span>{isAr ? 'الحل الهندسي المنفذ:' : 'The Engineering Solution:'}</span>
                          </h4>
                          <ul className="space-y-1 text-xs text-slate-300">
                            {project.solutions.map((sol, solIdx) => (
                              <li key={solIdx} className="flex items-start gap-1.5 leading-relaxed">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{sol}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Inline Toggle Details & Live Preview Buttons */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedProjectId(expandedProjectId === project.id ? null : project.id)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer border ${
                        expandedProjectId === project.id
                          ? isDark ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE]' : 'bg-[#0284C7] text-white border-[#0284C7]'
                          : isDark
                            ? 'bg-[#152C4D] hover:bg-[#00F2FE] text-white hover:text-[#071120] border-transparent'
                            : 'bg-sky-50 hover:bg-[#0284C7] text-[#0284C7] hover:text-white border-sky-200 hover:border-[#0284C7]'
                      }`}
                    >
                      <span>{expandedProjectId === project.id ? (isAr ? 'إخفاء التفاصيل' : 'Hide Case Study') : (isAr ? 'عرض دراسة الحالة كاملة' : 'View Case Study')}</span>
                      {expandedProjectId === project.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {((projectUrlOverrides && projectUrlOverrides[project.id]) || project.liveUrl) && (
                      <a
                        href={(projectUrlOverrides && projectUrlOverrides[project.id]) || project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm border ${
                          isDark
                            ? 'bg-[#00F2FE]/15 hover:bg-[#00F2FE] border-[#00F2FE]/40 text-[#00F2FE] hover:text-[#071120]'
                            : 'bg-[#0284C7] hover:bg-[#0369A1] border-[#0284C7] text-white'
                        }`}
                        title={isAr ? 'فتح رابط المنصة المباشر' : 'Open Live Platform'}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{isAr ? 'زيارة المنصة' : 'Visit Live'}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link to Dedicated Full Projects Page */}
        <div className="mt-14 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:brightness-110 text-[#071120] font-black text-sm shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            <span>{isAr ? 'استعرض كافة المشاريع وسابقة الأعمال المتكاملة' : 'Explore All Projects & Technical Case Studies'}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>

      </div>
    </section>
  );
}
