'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustStats from '@/components/TrustStats';
import ServicesSection from '@/components/ServicesSection';
import { EditableConfig, defaultEditableConfig } from '@/lib/siteConfig';
import { contentAr, contentEn, siteConfig } from '@/lib/content';
import { MessageSquare, Sparkles, ArrowRight, ArrowLeft, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { testConnection } from '@/lib/firebase';
import { subscribeSiteSettings } from '@/lib/dbService';
import { safeLoadConfigFromStorage } from '@/lib/storageHelper';

import EngineeringHub from '@/components/EngineeringHub';
import ProjectEstimator from '@/components/ProjectEstimator';
import ProjectsSection from '@/components/ProjectsSection';
import ProcessSection from '@/components/ProcessSection';
import TechPartners from '@/components/TechPartners';
import FaqSection from '@/components/FaqSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [prefilledService, setPrefilledService] = useState<string>('');
  const [prefilledNotes, setPrefilledNotes] = useState<string>('');
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  // Initialize with deterministic default configuration for 100% hydration match
  const [customConfig, setCustomConfig] = useState<EditableConfig>(defaultEditableConfig);

  const isAr = lang === 'ar';
  const data = isAr ? contentAr : contentEn;
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    // Sync html root attributes with current language
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.title =
      isAr
        ? 'تيك بكرة | Tech Bokra - حلول تقنية متكاملة وهندسة البنية التحتية والأمن المادي'
        : 'Tech Bokra | Integrated Technology Solutions, IT Infrastructure & Physical Security';
  }, [lang, isAr]);

  useEffect(() => {
    // Automatically eliminate '#' and hash fragments (like #home) from address bar on page load
    if (typeof window !== 'undefined' && window.location.hash) {
      const rawHash = window.location.hash.replace('#', '');
      if (rawHash && rawHash !== 'home') {
        const targetElement = document.getElementById(rawHash);
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      } else if (rawHash === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // Remove hash from browser URL without page reload
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    // 1. Sync local cache after mount safely without causing SSR mismatch
    const timer = setTimeout(() => {
      const saved = safeLoadConfigFromStorage();
      if (saved) {
        setCustomConfig((prev) => ({ ...prev, ...saved }));
      }
    }, 0);

    // 2. Validate connection on boot as mandated by Firebase integration guidelines
    testConnection();

    // 3. Real-time subscription to global cloud settings from Firestore
    const unsubscribe = subscribeSiteSettings((cloudConfig) => {
      if (cloudConfig) {
        setCustomConfig((prev) => ({ ...prev, ...cloudConfig }));
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const cleanUrl = () => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleSelectServiceForQuote = (serviceTitle: string) => {
    setPrefilledService(serviceTitle);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
    cleanUrl();
  };

  const handleBookSurveyWithScope = (scopeSummary: string) => {
    setPrefilledNotes(scopeSummary);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
    cleanUrl();
  };

  const scrollToContact = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
    cleanUrl();
  };

  const scrollToEstimator = () => {
    const estElem = document.getElementById('estimator');
    if (estElem) {
      estElem.scrollIntoView({ behavior: 'smooth' });
    }
    cleanUrl();
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#071120] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      } selection:bg-[#00F2FE] selection:text-[#071120] ${
        isAr ? 'font-cairo' : 'font-inter'
      }`}
    >
      {/* Dynamic Top Announcement Banner */}
      {customConfig.showAnnouncement && !isAnnouncementDismissed && (
        <div 
          className={`relative z-50 border-b py-2.5 px-4 text-xs shadow-md transition-colors ${
            isDark
              ? 'bg-gradient-to-r from-[#071a33] via-[#092b4d] to-[#071a33] border-[#00F2FE]/30'
              : 'bg-gradient-to-r from-sky-50 via-cyan-50 to-sky-50 border-sky-200 text-slate-800'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span 
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 border ${
                  isDark
                    ? 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/40'
                    : 'bg-sky-100 text-sky-800 border-sky-300'
                }`}
              >
                <Sparkles className={`w-3 h-3 ${isDark ? 'text-[#00F2FE]' : 'text-sky-600'}`} />
                <span>{isAr ? customConfig.announcementBadgeAr : customConfig.announcementBadgeEn}</span>
              </span>
              <p className={`truncate font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {isAr ? customConfig.announcementTextAr : customConfig.announcementTextEn}
              </p>
              {customConfig.announcementLink && (
                <a
                  href={customConfig.announcementLink}
                  target={customConfig.announcementLink.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className={`hidden sm:inline-flex items-center gap-1 hover:underline font-bold shrink-0 text-[11px] ${
                    isDark ? 'text-[#00F2FE]' : 'text-sky-600'
                  }`}
                >
                  <span>{isAr ? 'استكشف الآن' : 'Explore Now'}</span>
                  <ArrowIcon className="w-3 h-3" />
                </a>
              )}
            </div>

            <button
              onClick={() => setIsAnnouncementDismissed(true)}
              className={`p-1 rounded-full transition shrink-0 ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation with theme toggle & dynamic phone */}
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
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with customizable messaging and images */}
        <Hero
          lang={lang}
          data={data}
          onOpenEstimator={scrollToEstimator}
          onOpenContact={scrollToContact}
          heroOverrides={{
            badge: isAr ? customConfig.heroBadgeAr : customConfig.heroBadgeEn,
            titleLine1: isAr ? customConfig.heroTitleLine1Ar : customConfig.heroTitleLine1En,
            titleLine2: isAr ? customConfig.heroTitleLine2Ar : customConfig.heroTitleLine2En,
            sub: isAr ? customConfig.heroSubAr : customConfig.heroSubEn,
            cctvImage: customConfig.heroCctvImage,
            networkImage: customConfig.heroNetworkImage,
            accessImage: customConfig.heroAccessImage,
            cloudImage: customConfig.heroCloudImage,
          }}
        />

        {/* Real-world Trust & Milestone Metrics with live editable overrides */}
        <TrustStats
          lang={lang}
          data={data}
          showSection={customConfig.showStatsSection ?? false}
          statOverrides={{
            stat1Val: customConfig.stat1Val,
            stat1Label: isAr ? customConfig.stat1LabelAr : customConfig.stat1LabelEn,
            stat1Desc: isAr ? customConfig.stat1DescAr : customConfig.stat1DescEn,
            stat2Val: customConfig.stat2Val,
            stat2Label: isAr ? customConfig.stat2LabelAr : customConfig.stat2LabelEn,
            stat2Desc: isAr ? customConfig.stat2DescAr : customConfig.stat2DescEn,
            stat3Val: customConfig.stat3Val,
            stat3Label: isAr ? customConfig.stat3LabelAr : customConfig.stat3LabelEn,
            stat3Desc: isAr ? customConfig.stat3DescAr : customConfig.stat3DescEn,
            stat4Val: customConfig.stat4Val,
            stat4Label: isAr ? customConfig.stat4LabelAr : customConfig.stat4LabelEn,
            stat4Desc: isAr ? customConfig.stat4DescAr : customConfig.stat4DescEn,
          }}
        />

        {/* Comprehensive Engineering Solutions with CMS override */}
        <ServicesSection
          lang={lang}
          data={data}
          onSelectService={handleSelectServiceForQuote}
          customServices={customConfig.servicesList}
        />

        {/* Practical Engineering Hub, CCTV Storage & Bandwidth Calculator & Tenders Radar */}
        <EngineeringHub
          lang={lang}
          data={data}
          onOpenConsultation={(scopeSummary?: string) => {
            if (scopeSummary) {
              handleBookSurveyWithScope(scopeSummary);
            } else {
              scrollToContact();
            }
          }}
        />

        {/* Interactive Project Cost & Scope Estimator */}
        <ProjectEstimator
          lang={lang}
          data={data}
          onBookSurveyWithScope={handleBookSurveyWithScope}
          whatsappNumber={customConfig.whatsappNumber}
          email={customConfig.email}
        />

        {/* Featured Real Projects & Case Studies with live dynamic links and CMS */}
        <ProjectsSection
          lang={lang}
          data={data}
          onConsultProject={handleSelectServiceForQuote}
          projectUrlOverrides={{
            'helio-property': customConfig.helioPropertyUrl,
            'alrehla': customConfig.alrehlaUrl,
          }}
          customProjects={customConfig.projectsList}
        />

        {/* 4-Step Engineering Lifecycle */}
        <ProcessSection
          lang={lang}
          data={data}
          onBookSurvey={scrollToContact}
        />

        {/* Hardware & Cloud Vendors Ecosystem */}
        <TechPartners lang={lang} data={data} />

        {/* Frequently Asked Questions with CMS */}
        <FaqSection
          lang={lang}
          data={data}
          customFaq={customConfig.faqList}
        />

        {/* Smart Quote & Inquiry Request with live custom contacts */}
        <ContactSection
          lang={lang}
          data={data}
          prefilledService={prefilledService}
          prefilledNotes={prefilledNotes}
          whatsappNumber={customConfig.whatsappNumber}
          hotlinePhone={customConfig.phone}
          email={customConfig.email}
          address={isAr ? customConfig.addressAr : customConfig.addressEn}
        />
      </main>

      {/* Corporate Footer with live custom contacts and CMS bio */}
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

      {/* Floating Action Buttons */}
      <aside aria-label="Quick Actions" className="fixed bottom-6 left-6 rtl:left-6 rtl:right-auto ltr:right-6 ltr:left-auto z-40 flex flex-col gap-2.5">
        {/* Floating Quick Theme Switcher */}
        <button
          onClick={toggleTheme}
          className={`w-12 h-12 rounded-full border shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer ${
            isDark
              ? 'bg-[#10233D]/95 hover:bg-[#152C4D] text-amber-400 border-[#00F2FE]/40 shadow-[0_0_20px_rgba(0,242,254,0.25)]'
              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)]'
          }`}
          title={isAr ? (isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن') : (isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
          aria-label={isAr ? 'تبديل الثيم' : 'Toggle Theme'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>

        {/* Floating WhatsApp Quick Action */}
        <a
          href={`https://wa.me/${customConfig.whatsappNumber}?text=${encodeURIComponent(
            isAr
              ? 'مرحباً تيك بكرة، أود الاستفسار عن الأنظمة الأمنية والشبكات لمنشأتي.'
              : 'Hello Tech Bokra, I would like to inquire about surveillance and network systems.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
          title={isAr ? 'محادثة فورية عبر واتساب' : 'Chat on WhatsApp'}
          aria-label={isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
        >
          <MessageSquare className="w-7 h-7 group-hover:animate-pulse" />
        </a>
      </aside>
    </div>
  );
}
