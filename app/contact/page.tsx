'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';
import { contentAr, contentEn } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';
import { useCustomConfig } from '@/lib/useCustomConfig';
import { useLanguage } from '@/components/LanguageProvider';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

function ContactContent() {
  const { lang, isAr, toggleLanguage, data } = useLanguage();
  const [customConfig] = useCustomConfig();
  const searchParams = useSearchParams();
  const { isDark } = useTheme();

  // Read URL parameters to prefill notes or service
  const paramService = searchParams.get('service') || '';
  const paramProject = searchParams.get('project') || '';
  const paramTender = searchParams.get('tender') || '';
  const paramType = searchParams.get('type') || '';
  const paramScope = searchParams.get('scope') || '';

  let initialService = paramService;
  let initialNotes = paramScope;

  if (paramProject && !initialNotes) {
    initialNotes = isAr 
      ? `طلب استشارة وتنفيذ مشروع مماثل لسابقة أعمال: ${paramProject}` 
      : `Inquiry regarding similar project implementation for: ${paramProject}`;
  }

  if (paramTender && !initialNotes) {
    if (paramType === 'jv') {
      initialNotes = isAr
        ? `طلب تضامن رسمي (Joint Venture) لتنفيذ المناقصة رقم: ${paramTender}`
        : `Joint Venture partnership inquiry for Tender Ref: ${paramTender}`;
    } else {
      initialNotes = isAr
        ? `طلب إعداد وتجهيز المظروف الفني والاعتمادات (Technical Submittal) للمناقصة: ${paramTender}`
        : `Technical Submittal preparation request for Tender Ref: ${paramTender}`;
    }
  }


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
        customProjects={customConfig.projectsList}
      />

      <main className="pt-28 pb-16">
        {/* Header Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center max-w-3xl">
          <div 
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 border ${
              isDark 
                ? 'bg-[#10233D] border-[#00F2FE]/30 text-[#00F2FE]' 
                : 'bg-sky-50 border-sky-200 text-[#0284C7]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? 'المكتب الفني وخدمة العملاء المؤسسية' : 'Engineering Desk & Corporate Support'}</span>
          </div>

          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span>{isAr ? 'تواصل معنا واطلب' : 'Connect with Our'}</span>{' '}
            <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>
              {isAr ? 'معاينة هندسية فورية' : 'Senior Engineering Team'}
            </span>
          </h1>

          <p className={`text-sm sm:text-base md:text-lg mt-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {isAr
              ? 'فريقنا من مهندسي واستشاريي التيار الخفيف والشبكات جاهز لزيارة موقع منشأتك، مراجعة كراسة الشروط، وإعداد المقايسات الفنية المعتمدة.'
              : 'Our senior low-current and network consultants are ready for on-site surveys, RFP reviews, and certified BOQ formulations.'}
          </p>
        </div>

        {/* Contact Section Form with Pre-fill Support */}
        <ContactSection
          lang={lang}
          data={data}
          prefilledService={initialService}
          prefilledNotes={initialNotes}
          whatsappNumber={customConfig.whatsappNumber}
          hotlinePhone={customConfig.phone}
          email={customConfig.email}
          address={isAr ? customConfig.addressAr : customConfig.addressEn}
        />
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

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#071120]" />}>
      <ContactContent />
    </Suspense>
  );
}
