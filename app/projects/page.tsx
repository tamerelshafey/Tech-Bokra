'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { contentAr, contentEn, Project } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';
import { useCustomConfig } from '@/lib/useCustomConfig';
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
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import Image from 'next/image';

type FilterCategory = 'all' | 'upcoming' | 'security' | 'network' | 'software' | 'erp';

export default function ProjectsPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [customConfig] = useCustomConfig();
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { isDark } = useTheme();

  const isAr = lang === 'ar';
  const data = isAr ? contentAr : contentEn;

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const getProjectIcon = (icon: string) => {
    switch (icon) {
      case 'Building2': return Building2;
      case 'ShieldAlert': return ShieldAlert;
      case 'Smartphone': return Smartphone;
      case 'Home': return Home;
      case 'BarChart3': return BarChart3;
      case 'Cpu': return Cpu;
      case 'Sparkles': return Sparkles;
      case 'Globe': return Globe;
      default: return Layers;
    }
  };

  const rawProjects = customConfig.projectsList && customConfig.projectsList.length > 0 
    ? customConfig.projectsList 
    : data.projects.list;
  const activeProjects = rawProjects.filter((p) => p.isDraft !== true);

  const filteredProjects = activeProjects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return p.isUpcoming === true;
    return p.category === filter;
  });

  const toggleProjectExpand = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                isDark 
                  ? 'bg-[#10233D] border-[#00F2FE]/30 text-[#00F2FE]' 
                  : 'bg-sky-50 border-sky-200 text-[#0284C7]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'نماذج مشروعات وحلول هندسية' : 'Engineering Projects & Solutions'}</span>
            </div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>{data.projects.title}</span>
            </h1>

            <p className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {data.projects.subtitle}
            </p>

            {data.projects.confidentialityNotice && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm text-center max-w-3xl mx-auto ${
                isDark ? 'bg-[#0B1A2F]/80 border-white/10 text-slate-300' : 'bg-sky-50/80 border-sky-200 text-slate-700'
              }`}>
                <span className="font-bold text-amber-500">🔒 {isAr ? 'تنويه السرية التعاقدية: ' : 'Confidentiality Note: '}</span>
                <span>{data.projects.confidentialityNotice}</span>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              {[
                { id: 'all', label: data.projects.filterAll },
                { id: 'security', label: data.projects.filterSecurity },
                { id: 'network', label: data.projects.filterNetwork },
                { id: 'software', label: data.projects.filterSoftware },
                { id: 'upcoming', label: data.projects.filterUpcoming },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id as FilterCategory)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer border ${
                    filter === tab.id
                      ? isDark
                        ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE] shadow-[0_0_20px_rgba(0,242,254,0.3)]'
                        : 'bg-[#0284C7] text-white border-[#0284C7] shadow-md'
                      : isDark
                        ? 'bg-[#0B1A2F] text-slate-300 hover:bg-[#10233D] border-white/5'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Cards Grid with INLINE Expandable Case Studies (NO POPUPS!) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const Icon = getProjectIcon(project.icon);
              const isExpanded = expandedProjectId === project.id;
              const liveUrl = (customConfig.helioPropertyUrl && project.id === 'helio-property') 
                ? customConfig.helioPropertyUrl 
                : (customConfig.alrehlaUrl && project.id === 'alrehla') 
                  ? customConfig.alrehlaUrl 
                  : project.liveUrl;

              return (
                <div
                  key={project.id}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border overflow-hidden relative ${
                    isDark
                      ? 'bg-gradient-to-b from-[#0F223D] to-[#0A1A2F] border-[#00F2FE]/20 hover:border-[#00F2FE]/50 shadow-[0_15px_35px_rgba(0,0,0,0.4)]'
                      : 'bg-white border-slate-200 hover:border-[#0284C7]/40 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Project Photography Banner */}
                    <div 
                      className={`relative w-full h-52 rounded-2xl overflow-hidden mb-5 border shadow-md ${
                        isDark ? 'border-[#00F2FE]/20 bg-[#0B1A2F]' : 'border-slate-200 bg-slate-100'
                      }`}
                    >
                      {imageErrors[project.id] ? (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
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

                      {/* Status Badge */}
                      {project.statusBadge && (
                        <span className="absolute top-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-[10px] font-bold text-amber-200 bg-amber-950/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/50 flex items-center gap-1 shadow-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          <span>{project.statusBadge}</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Client */}
                    <h2 className={`text-xl font-bold mb-1 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {project.title}
                    </h2>

                    <p className={`text-xs font-semibold mb-2.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`}>
                      {project.client}
                    </p>

                    <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {project.summary}
                    </p>

                    {/* Quick Stats Grid */}
                    {project.stats && project.stats.length > 0 && (
                      <div className={`grid grid-cols-3 gap-2 py-3 border-t mb-4 text-center ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        {project.stats.map((st, sIdx) => (
                          <div 
                            key={sIdx} 
                            className={`p-2 rounded-xl border ${isDark ? 'bg-[#10233D]/60 border-white/5' : 'bg-slate-50 border-slate-200/80'}`}
                          >
                            <div className="text-[10px] truncate text-slate-400">{st.label}</div>
                            <div className={`text-xs font-bold font-mono mt-0.5 truncate ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`}>{st.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* INLINE EXPANDED CASE STUDY DRAWER (NO POPUPS!) */}
                    {isExpanded && (
                      <div className={`p-4 rounded-2xl border space-y-4 mb-4 animate-fadeIn ${
                        isDark ? 'bg-[#071120] border-[#00F2FE]/30' : 'bg-sky-50/70 border-sky-200'
                      }`}>
                        {/* Challenge */}
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

                        {/* Solution */}
                        {project.solutions && project.solutions.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                              <span>💡</span>
                              <span>{isAr ? 'الحل الهندسي المنفذ:' : 'The Engineering Solution:'}</span>
                            </h4>
                            <ul className="space-y-1 text-xs text-slate-300">
                              {project.solutions.map((sol, solIdx) => (
                                <li key={solIdx} className="flex items-start gap-2 leading-relaxed">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{sol}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-[#00F2FE] mb-2 flex items-center gap-1.5">
                              <Cpu className="w-3.5 h-3.5" />
                              <span>{isAr ? 'التقنيات والمواصفات المستخدمة:' : 'Technologies & Hardware:'}</span>
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {project.technologies.map((tech, techIdx) => (
                                <span key={techIdx} className="px-2 py-0.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[#00F2FE] text-[11px] font-mono">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleProjectExpand(project.id)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer border ${
                          isExpanded
                            ? isDark ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE]' : 'bg-[#0284C7] text-white border-[#0284C7]'
                            : isDark ? 'bg-[#152C4D] hover:bg-[#00F2FE] text-white hover:text-[#071120] border-transparent' : 'bg-sky-50 hover:bg-[#0284C7] text-[#0284C7] hover:text-white border-sky-200'
                        }`}
                      >
                        <span>{isExpanded ? (isAr ? 'إخفاء التفاصيل' : 'Hide Case Study') : (isAr ? 'عرض التفاصيل الهندسية الكاملة' : 'View Full Case Study')}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm border bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400"
                          title={isAr ? 'فتح رابط المنصة المباشر' : 'Open Live Platform'}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{isAr ? 'زيارة المنصة' : 'Visit Live'}</span>
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/contact?project=${encodeURIComponent(project.title)}`}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#00F2FE]" />
                      <span>{isAr ? 'طلب تنفيذ مشروع مماثل' : 'Request Similar Project Implementation'}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

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
