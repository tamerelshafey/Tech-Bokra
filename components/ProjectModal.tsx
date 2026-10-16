'use client';

import React from 'react';
import Image from 'next/image';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Globe, ExternalLink } from 'lucide-react';
import { Project, SiteLanguageData } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onConsultProject: (projectTitle: string) => void;
}

export default function ProjectModal({ project, onClose, lang, data, onConsultProject }: ProjectModalProps) {
  const [modalImageError, setModalImageError] = React.useState(false);
  const { isDark } = useTheme();
  const isAr = lang === 'ar';

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-3xl rounded-3xl overflow-hidden my-8 border shadow-2xl transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-[#10233D] to-[#071120] border-[#00F2FE]/40'
            : 'bg-white border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.18)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner with Real Project Image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900">
          {modalImageError ? (
            <div className="w-full h-full bg-gradient-to-br from-[#10233D] to-[#071120] flex items-center justify-center text-[#00F2FE]/30">
              <ShieldCheck className="w-16 h-16" />
            </div>
          ) : (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover object-center"
              referrerPolicy="no-referrer"
              sizes="(max-width: 768px) 100vw, 800px"
              onError={() => setModalImageError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors backdrop-blur-sm z-10 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-5 right-6 rtl:right-6 rtl:left-auto ltr:left-6 ltr:right-auto z-10 flex flex-col items-start">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 rounded-md bg-sky-500/30 backdrop-blur-md border border-sky-400 text-sky-200 text-xs font-mono font-bold">
                {project.tag}
              </span>
              {project.statusBadge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950/85 backdrop-blur-md border border-amber-400/60 text-amber-200 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span>{project.statusBadge}</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
              <span className="text-sky-300 font-bold">{isAr ? 'الجهة:' : 'Entity:'}</span> {project.client}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
          
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-3">
            {project.stats.map((st, idx) => (
              <div 
                key={idx} 
                className={`p-3.5 rounded-xl text-center border ${
                  isDark 
                    ? 'bg-[#071120] border-white/5' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {st.label}
                </div>
                <div 
                  className={`text-lg sm:text-xl font-bold font-mono mt-0.5 ${
                    isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                  }`}
                >
                  {st.value}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isAr ? 'نظرة عامة على المشروع:' : 'Project Overview:'}
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {project.description}
            </p>
          </div>

          {/* Engineering Challenges */}
          <div 
            className={`p-4 rounded-2xl border ${
              isDark 
                ? 'bg-[#071120]/80 border-amber-500/20' 
                : 'bg-amber-50/60 border-amber-200'
            }`}
          >
            <h4 
              className={`text-xs font-bold mb-3 flex items-center gap-2 ${
                isDark ? 'text-amber-400' : 'text-amber-800'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              <span>{data.projects.challengeTitle}</span>
            </h4>
            <div className="space-y-2">
              {project.challenges.map((ch, idx) => (
                <div 
                  key={idx} 
                  className={`text-xs flex items-start gap-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>•</span>
                  <span>{ch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Bokra Implemented Solutions */}
          <div 
            className={`p-4 rounded-2xl border ${
              isDark 
                ? 'bg-[#071120]/80 border-emerald-500/20' 
                : 'bg-emerald-50/60 border-emerald-200'
            }`}
          >
            <h4 
              className={`text-xs font-bold mb-3 flex items-center gap-2 ${
                isDark ? 'text-emerald-400' : 'text-emerald-800'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>{data.projects.solutionTitle}</span>
            </h4>
            <div className="space-y-2">
              {project.solutions.map((sol, idx) => (
                <div 
                  key={idx} 
                  className={`text-xs flex items-start gap-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`} />
                  <span>{sol}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hardware & Technologies */}
          <div>
            <h4 
              className={`text-xs font-bold mb-2.5 flex items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <Cpu className={`w-3.5 h-3.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
              <span>{data.projects.techTitle}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${
                    isDark
                      ? 'bg-[#152C4D] text-slate-200 border-white/5'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div 
          className={`p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {isAr ? 'تريد تنفيذ حلول مماثلة لمنشأتك؟' : 'Interested in a similar deployment?'}
          </p>
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border ${
                  isDark
                    ? 'bg-[#00F2FE]/15 hover:bg-[#00F2FE] border-[#00F2FE]/40 text-[#00F2FE] hover:text-[#071120]'
                    : 'bg-sky-100 hover:bg-[#0284C7] border-sky-300 text-[#0284C7] hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{isAr ? 'زيارة المنصة الحالية' : 'Open Live Platform'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                isDark
                  ? 'border-slate-600 hover:border-slate-400 text-slate-300'
                  : 'border-slate-300 hover:border-slate-400 text-slate-700 bg-white'
              }`}
            >
              {data.projects.closeModal}
            </button>
            <button
              onClick={() => {
                onClose();
                onConsultProject(project.title);
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md transition cursor-pointer ${
                isDark
                  ? 'bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120]'
                  : 'bg-[#0284C7] hover:bg-[#0369A1] text-white'
              }`}
            >
              {isAr ? 'طلب استفسار حول هذا المشروع' : 'Inquire About this Project'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
