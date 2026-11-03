'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Workflow, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  PhoneCall, 
  FileCheck, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Clock, 
  Award, 
  ClipboardCheck, 
  Settings, 
  Search, 
  HelpCircle 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useCustomConfig } from '@/lib/useCustomConfig';

export default function ProcessView() {
  const { lang, isAr, toggleLanguage, data } = useLanguage();
  const { isDark } = useTheme();
  const [customConfig] = useCustomConfig();

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const steps = [
    {
      num: '01',
      titleAr: 'المعاينة الميدانية ودراسة الاحتياجات',
      titleEn: 'Site Survey & Technical Scoping',
      descAr: 'يقوم مهندسو ومستشارو تيك بكرة بزيارة موقع المنشأة لمعاينة المسارات، فحص البيئة المحيطة، ومراجعة كراسة الشروط (RFP) والمتطلبات الأمنية والشبكية.',
      descEn: 'Our certified engineers conduct on-site inspections, route verification, and RFP reviews to formulate exact technical specifications.',
      highlightsAr: [
        'معاينة مسارات الكابلات وغرف الخوادم (MDF/IDF)',
        'تحديد زوايا تغطية الكاميرات ومخارج الشبكة المطلوبة',
        'مراجعة شروط الدفاع المدني والأمن العام ذات الصلة',
        'المخرج: تقرير المعاينة الفنية المعتمد (Technical Survey Report)'
      ],
      highlightsEn: [
        'Detailed inspection of cable pathways and server rooms (MDF/IDF)',
        'Optical angle verification for CCTV and network drops calculation',
        'Civil defense and physical security compliance checks',
        'Deliverable: Certified Technical Survey Report'
      ],
      icon: Search,
      tagAr: 'الخطوة الأولى: الفحص والتحليل',
      tagEn: 'Step 1: Scoping & Inspection'
    },
    {
      num: '02',
      titleAr: 'التصميم الهندسي وإعداد المقايسات (BOQ)',
      titleEn: 'Engineering Design & BOQ Formulation',
      descAr: 'تحويل مخرجات المعاينة إلى مخططات تنفيذية وحسابات دقيقة لحجم السعات، مع إعداد جدول كميات معتمد بالمواصفات الفنية ومطابقة الأكواد القياسية.',
      descEn: 'Translating survey findings into certified engineering schematics, bandwidth/storage calculations, and comprehensive Bill of Quantities.',
      highlightsAr: [
        'مخططات الكابلات والتوزيع ومسارات التيار الخفيف (CAD Layouts)',
        'حسابات السعات التخزينية والباندويث وفق معايير H.265+ وRAID',
        'جدول كميات تفصيلي (BOQ) مع توصيف الأجهزة الأصلية بالماركات',
        'المخرج: مقايسة هندسية معتمدة وعرض فني متكامل (Technical Submittal)'
      ],
      highlightsEn: [
        'Architectural CAD routing and structured cabling schematics',
        'Bandwidth and storage calculations per H.265+ & RAID requirements',
        'Itemized BOQ with genuine brand specifications and datasheets',
        'Deliverable: Engineering Proposal & Technical Submittal'
      ],
      icon: Layers,
      tagAr: 'الخطوة الثانية: التصميم والمقايسة',
      tagEn: 'Step 2: Architecture & BOQ'
    },
    {
      num: '03',
      titleAr: 'التوريد المعتمد والتركيبات والبرمجة',
      titleEn: 'Certified Supply, Installation & Setup',
      descAr: 'توريد كافة الأجهزة والمهمات الأصلية من الوكلاء المعتمدين، وتمديد الكابلات وتثبيت الأجهزة بواسطة فنيين ومهندسين متخصصين مع الترقيم والبرمجة الاحترافية.',
      descEn: 'Sourcing authentic equipment with official agent warranties, organized cable dressing, precise rack mounting, and firmware configuration.',
      highlightsAr: [
        'توريد كاميرات، سويتشات، راكّات، وأجهزة أصلية مع سيريال نمبر رسمي',
        'تمديد الكابلات المنظمة داخل ترانكات ومسارات محمية طبقاً للأكواد',
        'ترقيم كامل لجميع النقاط (Labeling & Cable Management)',
        'برمجة أنظمة التحكم، السويتشات، الفايروول، وربط المنظومة بالكامل'
      ],
      highlightsEn: [
        'Supply of genuine enterprise hardware with official manufacturer serials',
        'Structured cabling laid in protected raceways per standard codes',
        'Universal labeling and rack cable management',
        'System configuration, VLAN setup, firewall policies, and VMS integration'
      ],
      icon: Settings,
      tagAr: 'الخطوة الثالثة: التنفيذ والبرمجة',
      tagEn: 'Step 3: Deployment & Cabling'
    },
    {
      num: '04',
      titleAr: 'الفحص والاختبار والتسليم وعقود الدعم (SLA)',
      titleEn: 'Testing, Commissioning, Handover & SLA',
      descAr: 'إجراء اختبارات الجودة الميدانية بأجهزة فحص الكابلات المعتمدة، التشغيل التجريبي بحضور ممثل العميل، تسليم المخططات النهائية، وتفعيل عقود الصيانة.',
      descEn: 'Field testing using certified cable certifiers (Fluke), live operational commissioning, handover of As-Built drawings, and SLA activation.',
      highlightsAr: [
        'اختبار كفاءة وتوصيل الكابلات بأجهزة الفحص واختبار الترددات',
        'التشغيل التجريبي ومراجعة تسجيلات الكاميرات وصلاحيات الدخول',
        'تسليم المخططات التنفيذية الواقعية (As-Built Drawings) وتدريب المشغلين',
        'تفعيل عقد الصيانة الوقائية والاستجابة السريعة للأعطال (SLA)'
      ],
      highlightsEn: [
        'Channel certification and signal verification using specialized testers',
        'Operational commissioning and failover drill validation',
        'Comprehensive As-Built documentation and operator training',
        'Preventative maintenance agreement and prioritized emergency SLA'
      ],
      icon: Award,
      tagAr: 'الخطوة الرابعة: التسليم والضمان',
      tagEn: 'Step 4: Quality & Handover'
    }
  ];

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
        showProjectsSection={customConfig.showProjectsSection}
        showProcessSection={customConfig.showProcessSection}
        showFaqSection={customConfig.showFaqSection}
        showEstimator={customConfig.showEstimator}
        showTenders={customConfig.showTenders}
        showEngineeringHub={customConfig.showEngineeringHub}
        customProjects={isAr ? customConfig.projectsList : (customConfig.projectsListEn || customConfig.projectsList)}
      />

      <main className="pt-28 pb-20">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/" className="hover:text-[#00F2FE] transition">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <span className={isDark ? 'text-white' : 'text-slate-900'}>
              {isAr ? 'آلية العمل' : 'Our Process'}
            </span>
          </nav>

          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
                isDark 
                  ? 'bg-[#10233D] border-[#00F2FE]/30 text-[#00F2FE]' 
                  : 'bg-sky-50 border-sky-200 text-[#0284C7]'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>{isAr ? 'منهجية معتمدة وفق المعايير الهندسية العالمية' : 'Engineering Methodology & Execution Lifecycle'}</span>
            </div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>{isAr ? 'آلية ومراحل العمل الهندسية' : 'Our End-to-End'}</span>{' '}
              <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>
                {isAr ? 'من الفحص حتى التسليم والدعم' : 'Engineering Process'}
              </span>
            </h1>

            <p className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isAr
                ? 'نلتزم في تيك بكرة بدورة حياة هندسية منضبطة في كل مشروع، تضمن أعلى مستويات الجودة والمطابقة للأكواد الدولية، مع الشفافية الكاملة في التوصيف وجدول الكميات.'
                : 'At Tech Bokra, we follow a rigorous 4-stage engineering lifecycle for every facility, guaranteeing strict compliance with global codes, authentic hardware, and full operational reliability.'}
            </p>
          </div>
        </div>

        {/* 4 Process Stages Detailed Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-20">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                  isDark 
                    ? 'bg-[#0B1A2F]/90 border-white/10 hover:border-[#00F2FE]/40' 
                    : 'bg-white border-slate-200 hover:border-[#0284C7]/40 shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-black text-xl shrink-0 ${
                      isDark ? 'bg-[#10233D] text-[#00F2FE] border border-[#00F2FE]/30' : 'bg-sky-50 text-[#0284C7] border border-sky-200'
                    }`}>
                      {step.num}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400">
                          {isAr ? step.tagAr : step.tagEn}
                        </span>
                      </div>
                      <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {isAr ? step.titleAr : step.titleEn}
                      </h2>
                    </div>
                  </div>

                  <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${
                    isDark ? 'bg-[#071120] border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <Icon className="w-4 h-4 text-[#00F2FE]" />
                    <span>{isAr ? 'مخرجات هندسية موثقة' : 'Verified Deliverables'}</span>
                  </div>
                </div>

                <div className="pt-6 grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-4">
                    <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {isAr ? step.descAr : step.descEn}
                    </p>
                  </div>

                  <div className={`lg:col-span-5 p-5 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`}>
                      {isAr ? 'أهم إجراءات ومخرجات المرحلة:' : 'Key Execution Points & Deliverables:'}
                    </h3>
                    <ul className="space-y-2">
                      {(isAr ? step.highlightsAr : step.highlightsEn).map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality Guarantees Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className={`p-8 rounded-3xl border ${
            isDark ? 'bg-[#10233D]/60 border-[#00F2FE]/25' : 'bg-sky-50 border-sky-200'
          }`}>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <ShieldCheck className="w-8 h-8 text-[#00F2FE] mx-auto" />
                <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isAr ? 'أجهزة أصلية بضمان رسمي' : 'Authentic Hardware Warranty'}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isAr ? 'توريد المهمات من قنوات التوزيع الرسمية والوكلاء المعتمدين حصراً' : 'Direct sourcing from official agency channels with full manufacturer warranty'}
                </p>
              </div>

              <div className="space-y-2">
                <FileCheck className="w-8 h-8 text-[#00F2FE] mx-auto" />
                <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isAr ? 'مطابقة الأكواد والمواصفات' : 'Code & Standard Compliance'}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isAr ? 'التنفيذ وفق مواصفات BICSI وNFPA وأكواد الكابلات المنظمة المعتمدة' : 'Strict alignment with BICSI, NFPA, and international structured cabling standards'}
                </p>
              </div>

              <div className="space-y-2">
                <Clock className="w-8 h-8 text-[#00F2FE] mx-auto" />
                <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isAr ? 'دعم فني واستجابة طوارئ SLA' : 'Structured SLA Response'}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isAr ? 'عقود صيانة دورية واستجابة سريعة لضمان استمرارية عمل المنظومات' : 'Preventative maintenance visits and rapid response protocols for mission-critical operations'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Bottom Banner */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`p-8 sm:p-12 rounded-3xl border space-y-6 ${
            isDark ? 'bg-gradient-to-br from-[#10233D] to-[#071120] border-white/10' : 'bg-white border-slate-200 shadow-lg'
          }`}>
            <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isAr ? 'هل لديك مشروع أو منشأة تحتاج لمعاينة هندسية؟' : 'Ready to Start with a Certified Engineering Survey?'}
            </h2>
            <p className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isAr
                ? 'فريقنا جاهز لتحديد موعد المعاينة، فحص المتطلبات الميدانية، وإعداد جدول كميات معتمد لمشروعك.'
                : 'Our consultants are ready to schedule an on-site survey, review your project scope, and prepare an itemized BOQ.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0369A1] text-[#071120] font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20 transition cursor-pointer"
              >
                <span>{isAr ? 'طلب معاينة واستفسار الآن' : 'Request Site Survey'}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>

              <Link
                href="/services"
                className={`px-6 py-3 rounded-xl border font-bold text-sm transition cursor-pointer ${
                  isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                {isAr ? 'استعراض دليل الخدمات' : 'Explore Services Catalog'}
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
        address={isAr ? customConfig.addressAr : customConfig.addressEn}
        workingHours={isAr ? customConfig.workingHoursAr : customConfig.workingHoursEn}
        linkedinUrl={customConfig.linkedinUrl}
        facebookUrl={customConfig.facebookUrl}
        logoEmblemStyle={customConfig.logoEmblemStyle}
        customLogoUrl={customConfig.customLogoUrl}
        brandBio={isAr ? customConfig.brandBioAr : customConfig.brandBioEn}
        commercialRegister={customConfig.commercialRegister}
        taxId={customConfig.taxId}
        footerRights={isAr ? customConfig.footerRightsAr : customConfig.footerRightsEn}
        customProjects={isAr ? customConfig.projectsList : (customConfig.projectsListEn || customConfig.projectsList)}
        showProjectsSection={customConfig.showProjectsSection}
        showProcessSection={customConfig.showProcessSection}
        showFaqSection={customConfig.showFaqSection}
        showEstimator={customConfig.showEstimator}
        showTenders={customConfig.showTenders}
        showEngineeringHub={customConfig.showEngineeringHub}
      />
    </div>
  );
}
