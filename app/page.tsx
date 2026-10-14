'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustStats from '@/components/TrustStats';
import ServicesSection from '@/components/ServicesSection';
import NetworkVisualizer from '@/components/NetworkVisualizer';
import ProjectEstimator from '@/components/ProjectEstimator';
import ProjectsSection from '@/components/ProjectsSection';
import ProcessSection from '@/components/ProcessSection';
import TechPartners from '@/components/TechPartners';
import FaqSection from '@/components/FaqSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import AdminSettingsModal, { EditableConfig, defaultEditableConfig } from '@/components/AdminSettingsModal';
import { contentAr, contentEn, siteConfig } from '@/lib/content';
import { MessageSquare, Settings, Sparkles, ArrowRight, ArrowLeft, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'tech_bokra_custom_config_v2';

export default function HomePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [prefilledService, setPrefilledService] = useState<string>('');
  const [prefilledNotes, setPrefilledNotes] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(false);

  const [customConfig, setCustomConfig] = useState<EditableConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          return { ...defaultEditableConfig, ...JSON.parse(saved) };
        }
      } catch {
        // Fallback to default
      }
    }
    return defaultEditableConfig;
  });

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
        ? 'تيك بكرة | Tech Bokra - حلول الأنظمة الأمنية، البنية التحتية، وبرمجيات الشركات'
        : 'Tech Bokra | Security & IT Infrastructure, ERP & Cloud Solutions';
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

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleSaveConfig = (newConfig: EditableConfig) => {
    setCustomConfig(newConfig);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // Ignore storage errors
    }
  };

  const handleResetDefault = () => {
    setCustomConfig(defaultEditableConfig);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
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
      className={`min-h-screen bg-[#071120] text-slate-100 selection:bg-[#00F2FE] selection:text-[#071120] ${
        isAr ? 'font-cairo' : 'font-inter'
      }`}
    >
      {/* Dynamic Top Announcement Banner */}
      {customConfig.showAnnouncement && !isAnnouncementDismissed && (
        <div className="relative z-50 bg-gradient-to-r from-[#071a33] via-[#092b4d] to-[#071a33] border-b border-[#00F2FE]/30 py-2.5 px-4 text-xs shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] font-bold text-[10px] shrink-0 border border-[#00F2FE]/40">
                <Sparkles className="w-3 h-3 text-[#00F2FE]" />
                <span>{isAr ? customConfig.announcementBadgeAr : customConfig.announcementBadgeEn}</span>
              </span>
              <p className="text-slate-200 truncate font-medium">
                {isAr ? customConfig.announcementTextAr : customConfig.announcementTextEn}
              </p>
              {customConfig.announcementLink && (
                <a
                  href={customConfig.announcementLink}
                  target={customConfig.announcementLink.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 text-[#00F2FE] hover:underline font-bold shrink-0 text-[11px]"
                >
                  <span>{isAr ? 'استكشف الآن' : 'Explore Now'}</span>
                  <ArrowIcon className="w-3 h-3" />
                </a>
              )}
            </div>

            <button
              onClick={() => setIsAnnouncementDismissed(true)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation with settings trigger & dynamic phone */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        data={data}
        onOpenSettings={() => setIsSettingsOpen(true)}
        whatsappNumber={customConfig.whatsappNumber}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with customizable messaging */}
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
          }}
        />

        {/* Real-world Trust & Milestone Metrics with live editable overrides */}
        <TrustStats
          lang={lang}
          data={data}
          statOverrides={{
            stat1Val: customConfig.stat1Val,
            stat2Val: customConfig.stat2Val,
            stat3Val: customConfig.stat3Val,
            stat4Val: customConfig.stat4Val,
          }}
        />

        {/* Comprehensive Engineering Solutions */}
        <ServicesSection
          lang={lang}
          data={data}
          onSelectService={handleSelectServiceForQuote}
        />

        {/* Interactive Architecture & Network Visualizer */}
        <NetworkVisualizer
          lang={lang}
          data={data}
          onOpenConsultation={scrollToContact}
        />

        {/* Interactive Project Cost & Scope Estimator */}
        <ProjectEstimator
          lang={lang}
          data={data}
          onBookSurveyWithScope={handleBookSurveyWithScope}
          whatsappNumber={customConfig.whatsappNumber}
          email={customConfig.email}
        />

        {/* Featured Real Projects & Case Studies with live dynamic links */}
        <ProjectsSection
          lang={lang}
          data={data}
          onConsultProject={handleSelectServiceForQuote}
          projectUrlOverrides={{
            'helio-property': customConfig.helioPropertyUrl,
            'alrehla': customConfig.alrehlaUrl,
          }}
        />

        {/* 4-Step Engineering Lifecycle */}
        <ProcessSection
          lang={lang}
          data={data}
          onBookSurvey={scrollToContact}
        />

        {/* Hardware & Cloud Vendors Ecosystem */}
        <TechPartners lang={lang} data={data} />

        {/* Frequently Asked Questions */}
        <FaqSection lang={lang} data={data} />

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

      {/* Corporate Footer with live custom contacts */}
      <Footer
        lang={lang}
        data={data}
        onOpenSettings={() => setIsSettingsOpen(true)}
        phone={customConfig.phone}
        whatsappNumber={customConfig.whatsappNumber}
        email={customConfig.email}
        address={isAr ? customConfig.addressAr : customConfig.addressEn}
        linkedinUrl={customConfig.linkedinUrl}
        facebookUrl={customConfig.facebookUrl}
      />

      {/* Floating Action Buttons */}
      <aside aria-label="Quick Actions" className="fixed bottom-6 left-6 rtl:left-6 rtl:right-auto ltr:right-6 ltr:left-auto z-40 flex flex-col gap-2.5">
        {/* Floating Quick Settings Trigger */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-12 h-12 rounded-full bg-[#10233D]/95 hover:bg-[#152C4D] text-[#00F2FE] border border-[#00F2FE]/50 shadow-[0_0_20px_rgba(0,242,254,0.3)] flex items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
          title={isAr ? 'لوحة ضبط وتعديل المحتوى' : 'Live Content & Settings'}
          aria-label={isAr ? 'فتح لوحة ضبط المحتوى' : 'Open Content Settings'}
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
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

      {/* Comprehensive Content & Settings Admin Modal */}
      <AdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        currentConfig={customConfig}
        onSaveConfig={handleSaveConfig}
        onResetDefault={handleResetDefault}
      />
    </div>
  );
}
