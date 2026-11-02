import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
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
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  PhoneCall,
  Calendar,
  Award,
  Lock,
  ChevronRight,
  Check
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { contentAr, contentEn, Project, siteConfig, getProjectStatus, getProjectType, getVerifiedMetrics } from '@/lib/content';
import { defaultEditableConfig } from '@/lib/siteConfig';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allProjects = contentAr.projects.list;
  const params: { slug: string }[] = [];

  for (const p of allProjects) {
    if (p.slug) params.push({ slug: p.slug });
    if (p.id && p.id !== p.slug) params.push({ slug: p.id });
  }

  return params;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = contentAr.projects.list.find((p) => p.slug === slug || p.id === slug);
  const projectEn = contentEn.projects.list.find((p) => p.slug === slug || p.id === slug);

  if (!project) {
    return {
      title: 'المشروع غير موجود | Tech Bokra',
    };
  }

  const title = `${project.title} | سابقة الأعمال والحلول التقنية | تيك بكرة`;
  const description = project.summary || project.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.image],
    },
    alternates: {
      canonical: `/projects/${project.slug || project.id}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projectAr = contentAr.projects.list.find((p) => p.slug === slug || p.id === slug);
  const projectEn = contentEn.projects.list.find((p) => p.slug === slug || p.id === slug);

  if (!projectAr) {
    notFound();
  }

  const project = projectAr;
  const verifiedMetrics = getVerifiedMetrics(project);
  const status = getProjectStatus(project);
  const type = getProjectType(project);
  const isPlayStore = project.liveUrl?.includes('play.google.com') || false;

  // Schema.org JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'mobile' ? 'SoftwareApplication' : 'Service',
    name: project.title,
    description: project.description,
    image: project.image,
    provider: {
      '@type': 'Organization',
      name: 'Tech Bokra',
      url: 'https://techbokra.com',
    },
    ...(isPlayStore && {
      applicationCategory: 'MobileApplication',
      operatingSystem: 'Android',
      installUrl: project.liveUrl,
    }),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://techbokra.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'المشاريع وسابقة الأعمال',
        item: 'https://techbokra.com/projects',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `https://techbokra.com/projects/${project.slug || project.id}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#071120] text-slate-100 font-cairo">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar
        lang="ar"
        data={contentAr}
        whatsappNumber={siteConfig.whatsappNumber}
        logoEmblemStyle={defaultEditableConfig.logoEmblemStyle}
        customLogoUrl={defaultEditableConfig.customLogoUrl}
        showProjectsSection={true}
        showProcessSection={true}
        showFaqSection={true}
        showEstimator={false}
        showTenders={false}
        showEngineeringHub={false}
        customProjects={contentAr.projects.list}
      />

      <main className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link href="/" className="hover:text-[#00F2FE] transition-colors">الرئيسية</Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-600" />
            <Link href="/projects" className="hover:text-[#00F2FE] transition-colors">سابقة الأعمال والمشاريع</Link>
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
                  <span>مشروع نعمل عليه حالياً (قيد التطوير)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>منجز ومطلق رسمياً</span>
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
                  <span>اتفاقية سرية بيانات (NDA)</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 mb-6">
              <span className="font-semibold text-[#00F2FE]">الجهة المستفيدة: {project.client}</span>
              {project.sector && (
                <span className="text-slate-400">• القطاع: {project.sector}</span>
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
                      ? 'تنزيل من متجر Google Play'
                      : (status === 'in_development' ? 'معاينة المنصة الحية (Staging)' : 'زيارة المنصة الرسمية')}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <Link
                href={`/contact?project=${encodeURIComponent(project.title)}`}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#152C4D] hover:bg-[#1E3E6B] text-white border border-[#00F2FE]/30 flex items-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#00F2FE]" />
                <span>طلب دراسة أو تنفيذ مماثل</span>
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
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs text-slate-300">
              <span>{project.tag}</span>
            </div>
          </div>

          {/* Verified Metrics (Shown ONLY if backed by source and asOf) */}
          {verifiedMetrics.length > 0 && (
            <div className="p-6 rounded-3xl border border-[#00F2FE]/30 bg-[#0B1A2F]/90 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00F2FE]">
                <Award className="w-4 h-4" />
                <span>مؤشرات وإحصاءات معتمدة وموثقة:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {verifiedMetrics.map((metric, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#10233D] border border-white/5 space-y-1">
                    <div className="text-xs text-slate-400">{metric.label}</div>
                    <div className="text-xl font-black text-white font-mono">{metric.value}</div>
                    <div className="text-[10px] text-slate-500 pt-1">
                      <span>المصدر: {metric.source}</span>
                      {metric.asOf && <span> • تاريخ الاعتماد: {metric.asOf}</span>}
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
                <span>التحدي التقني والاحتياج التشغيلي</span>
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
                <span>نطاق العمل والحل المنفذ</span>
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
                <span>الأنظمة والمواصفات والتقنيات المستخدمة</span>
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
              هل تبحث عن تنفيذ مشروع تقني أو هندسي مماثل؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              فريقنا الهندسي مستعد لدراسة متطلبات منشأتك وتقديم عرض فني وتجاري مفصل ومطابق للمواصفات.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href={`/contact?project=${encodeURIComponent(project.title)}`}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-black text-sm shadow-xl hover:brightness-110 transition-all"
              >
                تواصل مع مستشارنا التقني
              </Link>
              <Link
                href="/projects"
                className="px-6 py-3.5 rounded-xl bg-[#152C4D] text-white font-bold text-sm border border-white/10 hover:bg-[#1E3E6B] transition-colors"
              >
                استعراض باقي المشاريع
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer
        lang="ar"
        data={contentAr}
        phone={siteConfig.phone}
        whatsappNumber={siteConfig.whatsappNumber}
        email={siteConfig.email}
        address={siteConfig.addressAr}
        linkedinUrl={siteConfig.linkedinUrl}
        facebookUrl={siteConfig.facebookUrl}
        logoEmblemStyle={defaultEditableConfig.logoEmblemStyle}
        customLogoUrl={defaultEditableConfig.customLogoUrl}
        brandBio={contentAr.footer.brandBio}
        commercialRegister={siteConfig.commercialRegister}
        taxId={siteConfig.taxId}
        footerRights={contentAr.footer.rights}
        customProjects={contentAr.projects.list}
        showProjectsSection={true}
        showProcessSection={true}
        showFaqSection={true}
        showEstimator={false}
        showTenders={false}
        showEngineeringHub={false}
      />
    </div>
  );
}
