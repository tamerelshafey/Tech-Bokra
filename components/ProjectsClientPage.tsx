'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { contentAr, contentEn, Project, getProjectStatus, getProjectType, getVerifiedMetrics, isBlockedLegacyProject } from '@/lib/content';
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
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  PhoneCall,
  Lock,
  Clock
} from 'lucide-react';
import Image from 'next/image';

import { useLanguage } from '@/components/LanguageProvider';

type FilterType = 'all' | 'web' | 'mobile' | 'ai' | 'infrastructure';
type StatusView = 'all' | 'delivered' | 'in_development';

export default function ProjectsClientPage() {
  const { lang, isAr, toggleLanguage, data } = useLanguage();
  const [customConfig] = useCustomConfig();
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusView>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { isDark } = useTheme();

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

  const baseProjects = isAr
    ? ((customConfig.projectsList && customConfig.projectsList.length > 0) ? customConfig.projectsList : contentAr.projects.list)
    : ((customConfig.projectsListEn && customConfig.projectsListEn.length > 0) ? customConfig.projectsListEn : contentEn.projects.list);

  const rawProjects = baseProjects.map((p) => {
    if (customConfig.projectsList && customConfig.projectsList.length > 0) {
      const customMatch = customConfig.projectsList.find((cp) => cp.id === p.id);
      if (customMatch) {
        return {
          ...p,
          image: customMatch.image || p.image,
          liveUrl: customMatch.liveUrl || p.liveUrl,
          isDraft: customMatch.isDraft !== undefined ? customMatch.isDraft : p.isDraft,
          isUpcoming: customMatch.isUpcoming !== undefined ? customMatch.isUpcoming : p.isUpcoming,
          projectStatus: customMatch.projectStatus || p.projectStatus,
          status: customMatch.status || p.status,
          showOnSite: customMatch.showOnSite !== undefined ? customMatch.showOnSite : p.showOnSite,
          verified: customMatch.verified !== undefined ? customMatch.verified : p.verified,
        };
      }
    }
    return p;
  });

  const activeProjects = rawProjects.filter(
    (p) => !isBlockedLegacyProject(p) && p.isDraft !== true && p.verified === true && p.showOnSite !== false
  );

  if (activeProjects.length === 0 || customConfig.showProjectsSection === false) {
    notFound();
  }

  const resolvedProjects = activeProjects;

  const filteredProjects = resolvedProjects.filter((p) => {
    const pStatus = getProjectStatus(p);
    const pType = getProjectType(p);

    if (statusFilter !== 'all' && pStatus !== statusFilter) return false;
    if (typeFilter !== 'all' && pType !== typeFilter) return false;
    return true;
  });

  const deliveredProjects = filteredProjects.filter((p) => getProjectStatus(p) === 'delivered');
  const inDevProjects = filteredProjects.filter((p) => getProjectStatus(p) === 'in_development');

  const typeFilterTabs = [
    { id: 'all', label: isAr ? 'كافة الحلول والأنظمة' : 'All Solutions' },
    { id: 'web', label: isAr ? 'المنصات وحلول الويب' : 'Web Platforms' },
    { id: 'mobile', label: isAr ? 'تطبيقات الهواتف' : 'Mobile Apps' },
    { id: 'ai', label: isAr ? 'الذكاء الاصطناعي والأتمتة' : 'AI & Automation' },
    { id: 'infrastructure', label: isAr ? 'الأمن المادي والشبكات' : 'Physical Security & Infra' },
  ];

  const renderProjectCard = (project: Project) => {
    const Icon = getProjectIcon(project.icon);
    const projectSlug = project.slug || project.id;
    const isExpanded = expandedProjectId === project.id;
    const pStatus = getProjectStatus(project);
    const verifiedMetrics = getVerifiedMetrics(project);
    const isPlayStore = project.liveUrl?.includes('play.google.com') || false;

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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            
            <div className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto w-10 h-10 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
              <Icon className="w-5 h-5 text-sky-400" />
            </div>

            {/* Tag / Category Badge */}
            <span className="absolute bottom-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto text-[11px] font-mono font-bold text-sky-300 bg-slate-950/90 px-2.5 py-0.5 rounded border border-sky-400/30">
              {project.tag}
            </span>

            {/* Status Badge */}
            {pStatus === 'in_development' ? (
              <span className="absolute top-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-[10px] font-bold text-amber-200 bg-amber-950/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/60 flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{isAr ? 'قيد التطوير - معاينة حية' : 'Under Development'}</span>
              </span>
            ) : project.isNDA ? (
              <span className="absolute top-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-[10px] font-bold text-slate-200 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-600/60 flex items-center gap-1 shadow-lg">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>{isAr ? 'سابقة أعمال (NDA)' : 'Portfolio (NDA)'}</span>
              </span>
            ) : (
              <span className="absolute top-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-[10px] font-bold text-emerald-200 bg-emerald-950/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/60 flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'منجز ومطلق رسمياً' : 'Delivered & Live'}</span>
              </span>
            )}
          </div>

          {/* Title & Client */}
          <h2 className={`text-xl font-bold mb-1 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Link href={`/projects/${projectSlug}`} className="hover:underline">
              {project.title}
            </Link>
          </h2>

          <p className="text-xs font-semibold text-[#00F2FE] mb-2">
            {project.client}
          </p>

          <p className={`text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {project.summary}
          </p>

          {/* Verified Metrics or General Stats */}
          {verifiedMetrics.length > 0 ? (
            <div className={`grid grid-cols-2 gap-2 py-3 border-t mb-4 text-center ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
              {verifiedMetrics.slice(0, 2).map((m, mIdx) => (
                <div key={mIdx} className={`p-2 rounded-lg border ${isDark ? 'bg-[#10233D]/60 border-white/5' : 'bg-slate-50 border-slate-200/80'}`}>
                  <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.label}</div>
                  <div className={`text-xs font-bold font-mono mt-0.5 truncate ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`}>{m.value}</div>
                </div>
              ))}
            </div>
          ) : project.stats && project.stats.length > 0 ? (
            <div className={`grid grid-cols-3 gap-2 py-3 border-t mb-4 text-center ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
              {project.stats.slice(0, 3).map((st, sIdx) => (
                <div key={sIdx} className={`p-2 rounded-lg border ${isDark ? 'bg-[#10233D]/60 border-white/5' : 'bg-slate-50 border-slate-200/80'}`}>
                  <div className={`text-[9px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{st.label}</div>
                  <div className={`text-xs font-bold font-mono mt-0.5 truncate ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`}>{st.value}</div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Inline Case Study Drawer */}
          {isExpanded && (
            <div className={`p-4 rounded-2xl border space-y-3 mb-4 animate-fadeIn ${
              isDark ? 'bg-[#071120] border-[#00F2FE]/30' : 'bg-sky-50/70 border-sky-200'
            }`}>
              {project.challenges && project.challenges.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>{isAr ? 'التحدي الفعلي:' : 'The Challenge:'}</span>
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
                    <span>{isAr ? 'الحل الهندسي المنفذ:' : 'The Solution:'}</span>
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

        {/* Actions Bar */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Link
              href={`/projects/${projectSlug}`}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer border ${
                isDark
                  ? 'bg-[#152C4D] hover:bg-[#00F2FE] text-white hover:text-[#071120] border-transparent'
                  : 'bg-sky-50 hover:bg-[#0284C7] text-[#0284C7] hover:text-white border-sky-200'
              }`}
            >
              <span>{isAr ? 'دراسة الحالة والمواصفات الكاملة' : 'Full Case Study & Specs'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>

            {project.liveUrl && !project.isNDA && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm border ${
                  isPlayStore
                    ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white'
                    : 'bg-[#00F2FE]/15 hover:bg-[#00F2FE] border-[#00F2FE]/40 text-[#00F2FE] hover:text-[#071120]'
                }`}
                title={isPlayStore ? 'Google Play' : (pStatus === 'in_development' ? 'Live Staging' : 'Live Platform')}
              >
                {isPlayStore ? <Smartphone className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                <span>
                  {isPlayStore
                    ? 'Google Play'
                    : (pStatus === 'in_development' ? (isAr ? 'معاينة Staging' : 'Staging') : (isAr ? 'زيارة المنصة' : 'Visit Live'))}
                </span>
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
            <span>{isAr ? 'طلب استشارة أو تنفيذ مشروع مماثل' : 'Request Similar Project Implementation'}</span>
          </Link>
        </div>
      </div>
    );
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
        showProjectsSection={customConfig.showProjectsSection ?? true}
        showProcessSection={customConfig.showProcessSection ?? true}
        showFaqSection={customConfig.showFaqSection ?? true}
        showEstimator={customConfig.showEstimator ?? false}
        showTenders={customConfig.showTenders ?? false}
        showEngineeringHub={customConfig.showEngineeringHub ?? false}
        customProjects={isAr ? customConfig.projectsList : (customConfig.projectsListEn || customConfig.projectsList)}
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
              <span>{isAr ? 'المنتجات الرقمية والمشاريع الهندسية' : 'Digital Products & Engineering Works'}</span>
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

            {/* Status Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer border ${
                  statusFilter === 'all'
                    ? isDark ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE]' : 'bg-[#0284C7] text-white border-[#0284C7]'
                    : isDark ? 'bg-[#10233D] text-slate-300 border-white/5' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {isAr ? 'جميع المنتجات والمشاريع' : 'All Products & Works'}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('delivered')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer border flex items-center gap-1.5 ${
                  statusFilter === 'delivered'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : isDark ? 'bg-[#10233D] text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'منتجات أطلقناها وسابقة أعمال' : 'Delivered Products & Works'}</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('in_development')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer border flex items-center gap-1.5 ${
                  statusFilter === 'in_development'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                    : isDark ? 'bg-[#10233D] text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>{isAr ? 'منتجات نعمل عليها حالياً (قيد التطوير)' : 'In Development (Live Staging)'}</span>
              </button>
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {typeFilterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTypeFilter(tab.id as FilterType)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                    typeFilter === tab.id
                      ? isDark ? 'bg-sky-500/20 text-[#00F2FE] border-[#00F2FE]/50 font-bold' : 'bg-sky-100 text-[#0284C7] border-sky-300 font-bold'
                      : isDark ? 'bg-[#0B1A2F] text-slate-400 hover:text-white border-white/5' : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Cards Grid */}
          {statusFilter === 'all' && typeFilter === 'all' ? (
            <div className="space-y-16">
              
              {/* 1. Delivered Products */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isAr ? 'منتجات أطلقناها وسابقة الأعمال المنفذة' : 'Delivered Products & Handed-Over Works'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'منتجات وتطبيقات منشورة رسمياً على المتاجر والويب، ومشروعات بنية تحتية منفذة.' : 'Official apps and platforms launched on app stores and web.'}
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {deliveredProjects.map(renderProjectCard)}
                </div>
              </div>

              {/* 2. In-Development Products */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isAr ? 'منتجات نعمل عليها حالياً (بيئات تجريبية حية)' : 'Active Products Under Development'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'منصات سحابية في مرحلة التطوير والاختبار المباشر (Live Staging) مع شركائنا وعملائنا.' : 'Cloud platforms under active development and real-time collaborative staging.'}
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {inDevProjects.map(renderProjectCard)}
                </div>
              </div>

            </div>
          ) : filteredProjects.length === 0 ? (
            <div className={`text-center py-16 px-6 rounded-2xl border max-w-2xl mx-auto ${
              isDark ? 'bg-[#0B1A2F]/60 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
            }`}>
              <p className="font-bold text-base mb-2">
                {isAr ? 'لا توجد مشروعات مطابقة للفلتر المحدد' : 'No projects match the selected filter'}
              </p>
              <p className="text-xs text-slate-400">
                {isAr ? 'اختر تصنيفاً آخر أو اضغط على "جميع المنتجات والمشاريع" لعرض كافة الأعمال.' : 'Select another category or view all products.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map(renderProjectCard)}
            </div>
          )}

        </div>
      </main>

      <Footer
        lang={lang}
        data={data}
        phone={customConfig.phone}
        whatsappNumber={customConfig.whatsappNumber}
        email={customConfig.email}
        secondaryEmail={customConfig.secondaryEmail}
        workingHours={isAr ? customConfig.workingHoursAr : customConfig.workingHoursEn}
        address={isAr ? customConfig.addressAr : customConfig.addressEn}
        linkedinUrl={customConfig.linkedinUrl}
        facebookUrl={customConfig.facebookUrl}
        logoEmblemStyle={customConfig.logoEmblemStyle}
        customLogoUrl={customConfig.customLogoUrl}
        brandBio={isAr ? customConfig.brandBioAr : customConfig.brandBioEn}
        commercialRegister={customConfig.commercialRegister}
        taxId={customConfig.taxId}
        footerRights={isAr ? customConfig.footerRightsAr : customConfig.footerRightsEn}
        customProjects={isAr ? customConfig.projectsList : (customConfig.projectsListEn || customConfig.projectsList)}
        showProjectsSection={customConfig.showProjectsSection ?? true}
        showProcessSection={customConfig.showProcessSection ?? true}
        showFaqSection={customConfig.showFaqSection ?? true}
        showEstimator={customConfig.showEstimator ?? false}
        showTenders={customConfig.showTenders ?? false}
        showEngineeringHub={customConfig.showEngineeringHub ?? false}
      />
    </div>
  );
}
