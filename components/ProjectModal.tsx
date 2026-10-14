'use client';

import React from 'react';
import Image from 'next/image';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { Project, SiteLanguageData } from '@/lib/content';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onConsultProject: (projectTitle: string) => void;
}

export default function ProjectModal({ project, onClose, lang, data, onConsultProject }: ProjectModalProps) {
  const [modalImageError, setModalImageError] = React.useState(false);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-b from-[#10233D] to-[#071120] border border-[#00F2FE]/40 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner with Real Project Image */}
        <div className="relative h-56 sm:h-64 w-full bg-[#0B1A2F]">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2F] via-[#0B1A2F]/60 to-transparent pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-full bg-[#071120]/80 text-slate-300 hover:text-white hover:bg-[#00F2FE] hover:text-[#071120] transition-colors backdrop-blur-sm z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-5 right-6 rtl:right-6 rtl:left-auto ltr:left-6 ltr:right-auto z-10">
            <span className="inline-block px-3 py-1 rounded-md bg-[#00F2FE]/20 backdrop-blur-md border border-[#00F2FE]/40 text-[#00F2FE] text-xs font-mono font-bold mb-2">
              {project.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              <span className="text-[#00F2FE] font-bold">{isAr ? 'الجهة:' : 'Entity:'}</span> {project.client}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
          
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-3">
            {project.stats.map((st, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#071120] border border-white/5 text-center">
                <div className="text-xs text-slate-400 font-medium">{st.label}</div>
                <div className="text-lg sm:text-xl font-bold font-mono text-[#00F2FE] mt-0.5">
                  {st.value}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2">
              {isAr ? 'نظرة عامة على المشروع:' : 'Project Overview:'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Engineering Challenges */}
          <div className="p-4 rounded-2xl bg-[#071120]/80 border border-amber-500/20">
            <h4 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{data.projects.challengeTitle}</span>
            </h4>
            <div className="space-y-2">
              {project.challenges.map((ch, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{ch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Bokra Implemented Solutions */}
          <div className="p-4 rounded-2xl bg-[#071120]/80 border border-emerald-500/20">
            <h4 className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{data.projects.solutionTitle}</span>
            </h4>
            <div className="space-y-2">
              {project.solutions.map((sol, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{sol}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hardware & Technologies */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>{data.projects.techTitle}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#152C4D] text-slate-200 text-xs font-mono border border-white/5"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#0B1A2F] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            {isAr ? 'تريد تنفيذ حلول مماثلة لمنشأتك؟' : 'Interested in a similar deployment?'}
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 text-xs font-semibold"
            >
              {data.projects.closeModal}
            </button>
            <button
              onClick={() => {
                onClose();
                onConsultProject(project.title);
              }}
              className="px-5 py-2 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] text-xs font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)] transition"
            >
              {isAr ? 'طلب استفسار حول هذا المشروع' : 'Inquire About this Project'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
