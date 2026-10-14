'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  Radio
} from 'lucide-react';
import { Project, SiteLanguageData } from '@/lib/content';
import ProjectModal from '@/components/ProjectModal';

interface ProjectsSectionProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onConsultProject: (projectTitle: string) => void;
  projectUrlOverrides?: Record<string, string>;
}

type FilterCategory = 'all' | 'upcoming' | 'security' | 'network' | 'software' | 'erp';

export default function ProjectsSection({ lang, data, onConsultProject, projectUrlOverrides }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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

  const filteredProjects = data.projects.list.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return p.isUpcoming === true;
    return p.category === filter;
  });

  return (
    <section id="projects" className="py-24 relative bg-[#071120] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10233D] border border-[#00F2FE]/30 text-xs font-semibold text-[#00F2FE] mb-4 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'سجل الإنجازات والمنصات الذكية' : 'Proven Implementations & Platforms'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            <span>{data.projects.title}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            {data.projects.subtitle}
          </p>
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
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FilterCategory)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                filter === tab.id
                  ? 'bg-[#00F2FE] text-[#071120] shadow-[0_0_15px_rgba(0,242,254,0.35)] scale-105'
                  : tab.isSpecial
                  ? 'bg-[#10233D] text-[#00F2FE] hover:text-white hover:bg-[#152C4D] border border-[#00F2FE]/40'
                  : 'bg-[#10233D] text-slate-300 hover:text-white hover:bg-[#152C4D] border border-white/5'
              }`}
            >
              {tab.isSpecial && <Radio className="w-3.5 h-3.5 text-[#00F2FE] animate-pulse" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const Icon = getProjectIcon(project.icon);

            return (
              <div
                key={project.id}
                className="rounded-2xl bg-gradient-to-b from-[#0F223D] to-[#0A1A2F] border border-[#00F2FE]/20 hover:border-[#00F2FE]/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_15px_35px_rgba(0,0,0,0.4)] group overflow-hidden relative"
              >
                <div>
                  {/* Real Project Photography Banner */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-5 border border-[#00F2FE]/20 shadow-md bg-[#0B1A2F]">
                    {imageErrors[project.id] ? (
                      <div className="w-full h-full bg-gradient-to-br from-[#152C4D] to-[#071120] flex items-center justify-center text-[#00F2FE]/40">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F] via-[#0A1A2F]/30 to-transparent pointer-events-none" />
                    
                    <div className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto w-10 h-10 rounded-xl bg-[#071120]/80 backdrop-blur-md border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE] shadow-lg">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Tag / Category Badge */}
                    <span className="absolute bottom-2.5 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto text-[11px] font-mono font-bold text-[#00F2FE] bg-[#071120]/90 px-2.5 py-0.5 rounded border border-[#00F2FE]/30">
                      {project.tag}
                    </span>

                    {/* Prominent Status Badge if upcoming / sister platform */}
                    {project.statusBadge && (
                      <span className="absolute top-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-[10px] font-bold text-amber-300 bg-amber-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/40 flex items-center gap-1 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>{project.statusBadge}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Client */}
                  <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-[#00F2FE] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-[#00F2FE] font-medium mb-2.5">
                    {project.client}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {project.summary}
                  </p>

                  {/* 3 Quick Stat Badges */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/5 mb-5 text-center">
                    {project.stats.map((st, sIdx) => (
                      <div key={sIdx} className="bg-[#10233D]/60 p-2 rounded-lg">
                        <div className="text-[10px] text-slate-400 truncate">{st.label}</div>
                        <div className="text-xs font-bold font-mono text-[#00F2FE] mt-0.5 truncate">
                          {st.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                  {/* Inspect Details & Live Preview Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setSelectedProject({
                        ...project,
                        liveUrl: (projectUrlOverrides && projectUrlOverrides[project.id]) || project.liveUrl,
                      })}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#152C4D] hover:bg-[#00F2FE] text-white hover:text-[#071120] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>{data.projects.viewDetails}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {((projectUrlOverrides && projectUrlOverrides[project.id]) || project.liveUrl) && (
                      <a
                        href={(projectUrlOverrides && projectUrlOverrides[project.id]) || project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-[#00F2FE]/15 hover:bg-[#00F2FE] border border-[#00F2FE]/40 text-[#00F2FE] hover:text-[#071120] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        title={isAr ? 'فتح رابط المنصة المباشر' : 'Open Live Platform'}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{isAr ? 'زيارة المنصة' : 'Visit Live'}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Viewer */}
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            lang={lang}
            data={data}
            onConsultProject={onConsultProject}
          />

      </div>
    </section>
  );
}
