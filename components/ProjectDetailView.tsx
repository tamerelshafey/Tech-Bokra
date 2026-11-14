'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  Smartphone, 
  Globe, 
  ExternalLink,
  CheckCircle2,
  PhoneCall,
  Award,
  Lock,
  ChevronRight,
  Check,
  Cpu,
  Layers
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageProvider';
import { useCustomConfig } from '@/lib/useCustomConfig';
import { Project, getProjectStatus, getVerifiedMetrics, isBlockedLegacyProject } from '@/lib/content';

export default function ProjectDetailView({ slug }: { slug: string }) {
  const { lang, isAr, toggleLanguage, data } = useLanguage();
  const [customConfig] = useCustomConfig();

  // If projects section is globally toggled off, return 404
  if (customConfig.showProjectsSection === false) {
    notFound();
  }

  // 1. Locate project from the authoritative portal version (Ar) and localized list (En/Ar)
  // Filter first to published, verified, non-blocked projects only
  const rawListAr = customConfig.projectsList || [];
  const rawListEn = customConfig.projectsListEn || [];

  const publishedListAr = rawListAr.filter(
    (p) => !isBlockedLegacyProject(p) && p.isDraft !== true && p.verified === true && p.showOnSite !== false
  );

  const cleanSlug = slug.toLowerCase();
  const portalProjectAr =
    publishedListAr.find((p) => p.slug && p.slug.toLowerCase() === cleanSlug) ||
    publishedListAr.find((p) => p.id && p.id.toLowerCase() === cleanSlug);

  // If not found in published projects, 404
  if (!portalProjectAr) {
    notFound();
  }

  // 2. Select language-specific content
  const localizedCandidate = isAr 
    ? portalProjectAr 
    : rawListEn.find((p) => p.id === portalProjectAr.id && !isBlockedLegacyProject(p)) || portalProjectAr;

  // 3. Merge live cloud overrides from portal version for both languages
  const project: Project = {
    ...localizedCandidate,
    image: portalProjectAr.image || localizedCandidate.image,
    liveUrl: portalProjectAr.liveUrl || localizedCandidate.liveUrl,
    isDraft: portalProjectAr.isDraft,
    isUpcoming: portalProjectAr.isUpcoming,
    projectStatus: portalProjectAr.projectStatus,
    status: portalProjectAr.status,
    showOnSite: portalProjectAr.showOnSite,
    verified: portalProjectAr.verified,
  };



  const status = getProjectStatus(project);
  const isPlayStore = project.liveUrl?.includes('play.google.com');
  const verifiedMetrics = getVerifiedMetrics(project);

  return (
    <div 
      className={`min-h-screen bg-[#071120] text-slate-100 ${isAr ? 'font-cairo' : 'font-inter'}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        data={data}
        whatsappNumber={customConfig.whatsappNumber}
        logoEmblemStyle={customConfig.logoEmblemStyle}
        customLogoUrl={customConfig.customLogoUrl}
        logoScale={customConfig.logoScale}
        showLogoSubtitle={customConfig.showLogoSubtitle}
        showLogoArabicBadge={customConfig.showLogoArabicBadge}
        customLogoHeight={customConfig.customLogoHeight}
        customProjects={customConfig.projectsList}
        showProjectsSection={customConfig.showProjectsSection}
        showProcessSection={customConfig.showProcessSection}
        showFaqSection={customConfig.showFaqSection}
        showEstimator={customConfig.showEstimator}
        showTenders={customConfig.showTenders}
        showEngineeringHub={customConfig.showEngineeringHub}
      />

      <main className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link href="/" className="hover:text-[#00F2FE] transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-600" />
            <Link href="/projects" className="hover:text-[#00F2FE] transition-colors">
              {isAr ? 'سابقة الأعمال والمشاريع' : 'Projects & Portfolio'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-600" />
            <span className="text-[#00F2FE] font-semibold truncate max-w-xs">{project.title}</span>
          </nav>

          {/* Project Header Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-[#00F2FE]/20 bg-gradient-to-b from-[#0F223D] to-[#0A1A2F] shadow-2xl p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              {/* Status Badge */}
              {status === 'in_development' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>{isAr ? 'مشروع نعمل عليه حالياً (قيد التطوير)' : 'Active In-Development'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'منجز ومطلق رسمياً' : 'Delivered & Live'}</span>
                </span>
              )}

              {/* Tag / Category Badge */}
              <span className="px-3 py-1 rounded-full text-xs font-bold text-sky-300 bg-sky-950/80 border border-sky-500/30">
                {project.tag}
              </span>

              {/* NDA Badge if applicable */}
              {project.isNDA && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-slate-300 bg-slate-800/80 border border-slate-600/40">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>{isAr ? 'اتفاقية سرية بيانات (NDA)' : 'Confidential (NDA Protected)'}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 mb-6">
              <span className="font-semibold text-[#00F2FE]">
                {isAr ? `الجهة المستفيدة: ${project.client}` : `Client: ${project.client}`}
              </span>
              {project.sector && (
                <span className="text-slate-400">
                  • {isAr ? `القطاع: ${project.sector}` : `Sector: ${project.sector}`}
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
              {project.summary}
            </p>

            {/* Action Links */}
            <div className="flex flex-wrap items-center gap-3.5 pt-6 mt-6 border-t border-white/10">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                    isPlayStore
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120]'
                  }`}
                >
                  {isPlayStore ? <Smartphone className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                  <span>
                    {isPlayStore
                      ? (isAr ? 'تنزيل من متجر Google Play' : 'Get on Google Play')
                      : (status === 'in_development'
                          ? (isAr ? 'معاينة المنصة الحية (Staging)' : 'Preview Staging')
                          : (isAr ? 'زيارة المنصة الرسمية' : 'Visit Live Platform'))}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <Link
                href={`/contact?project=${encodeURIComponent(project.title)}`}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#152C4D] hover:bg-[#1E3E6B] text-white border border-[#00F2FE]/30 flex items-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#00F2FE]" />
                <span>{isAr ? 'طلب دراسة أو تنفيذ مماثل' : 'Inquire About Similar Project'}</span>
              </Link>
            </div>
          </div>

          {/* Project Media Photography */}
          <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0B1A2F]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover object-center"
              referrerPolicy="no-referrer"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071120] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 right-4 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs text-slate-300">
              <span>{project.tag}</span>
            </div>
          </div>

          {/* Verified Metrics (Shown ONLY if backed by source and asOf) */}
          {verifiedMetrics.length > 0 && (
            <div className="p-6 rounded-3xl border border-[#00F2FE]/30 bg-[#0B1A2F]/90 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00F2FE]">
                <Award className="w-4 h-4" />
                <span>{isAr ? 'مؤشرات وإحصاءات معتمدة وموثقة:' : 'Verified Operational Milestones:'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {verifiedMetrics.map((metric, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#10233D] border border-white/5 space-y-1">
                    <div className="text-xs text-slate-400">{metric.label}</div>
                    <div className="text-xl font-black text-white font-mono">{metric.value}</div>
                    <div className="text-[10px] text-slate-500 pt-1">
                      <span>{isAr ? `المصدر: ${metric.source}` : `Source: ${metric.source}`}</span>
                      {metric.asOf && <span> • {isAr ? `التاريخ: ${metric.asOf}` : `As of: ${metric.asOf}`}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Content Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* The Operational Challenge / Need */}
            <div className="p-6 sm:p-7 rounded-3xl border border-white/10 bg-[#0A1A2F] space-y-4 shadow-lg">
              <h2 className="text-lg font-bold text-rose-400 flex items-center gap-2">
                <span>⚠️</span>
                <span>{isAr ? 'التحدي التقني والاحتياج التشغيلي' : 'Technical Challenge & Operational Need'}</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.challengeNeed || project.summary}
              </p>
              {project.challenges && project.challenges.length > 0 && (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pt-2 border-t border-white/5">
                  {project.challenges.map((ch, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 mt-1">•</span>
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Implemented Engineering Scope & Solution */}
            <div className="p-6 sm:p-7 rounded-3xl border border-white/10 bg-[#0A1A2F] space-y-4 shadow-lg">
              <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                <span>💡</span>
                <span>{isAr ? 'نطاق العمل والحل المنفذ' : 'Implemented Engineering Scope & Solution'}</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.description}
              </p>
              {project.scopeOfWork && project.scopeOfWork.length > 0 && (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pt-2 border-t border-white/5">
                  {project.scopeOfWork.map((scope, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{scope}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Technologies & Systems Deployed */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0A1A2F] space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-[#00F2FE] flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                <span>{isAr ? 'الأنظمة والمواصفات والتقنيات المستخدمة' : 'Technologies & Systems Deployed'}</span>
              </h2>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-[#10233D] border border-[#00F2FE]/20 text-sky-200 text-xs sm:text-sm font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA & Back Link */}
          <div className="p-8 rounded-3xl border border-[#00F2FE]/30 bg-gradient-to-r from-[#0F223D] to-[#0A1A2F] text-center space-y-5">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isAr ? 'هل تبحث عن تنفيذ مشروع تقني أو هندسي مماثل؟' : 'Looking for a Similar Engineering Solution?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              {isAr
                ? 'فريقنا الهندسي مستعد لدراسة متطلبات منشأتك وتقديم عرض فني وتجاري مفصل ومطابق للمواصفات.'
                : 'Our engineering consultants are ready to assess your facility requirements and formulate certified technical submittals.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href={`/contact?project=${encodeURIComponent(project.title)}`}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-black text-sm shadow-xl hover:brightness-110 transition-all"
              >
                {isAr ? 'تواصل مع مستشارنا التقني' : 'Consult Our Engineers'}
              </Link>
              <Link
                href="/projects"
                className="px-6 py-3.5 rounded-xl bg-[#152C4D] text-white font-bold text-sm border border-white/10 hover:bg-[#1E3E6B] transition-colors"
              >
                {isAr ? 'استعراض باقي المشاريع' : 'Explore All Projects'}
              </Link>
            </div>
          </div>

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
        showProjectsSection={customConfig.showProjectsSection}
        showProcessSection={customConfig.showProcessSection}
        showFaqSection={customConfig.showFaqSection}
        showEstimator={customConfig.showEstimator}
        showTenders={customConfig.showTenders}
        showEngineeringHub={customConfig.showEngineeringHub}
        customProjects={customConfig.projectsList}
      />
    </div>
  );
}
