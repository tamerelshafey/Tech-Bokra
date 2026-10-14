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
import AdminSettingsModal, { EditableConfig } from '@/components/AdminSettingsModal';
import { contentAr, contentEn, siteConfig } from '@/lib/content';
import { MessageSquare, Settings } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'tech_bokra_custom_config_v1';

export default function HomePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [prefilledService, setPrefilledService] = useState<string>('');
  const [prefilledNotes, setPrefilledNotes] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Default initial configuration
  const defaultConfig: EditableConfig = {
    whatsappNumber: siteConfig.whatsappNumber,
    phone: siteConfig.phone,
    email: siteConfig.email,
    secondaryEmail: siteConfig.secondaryEmail,
    addressAr: siteConfig.addressAr,
    addressEn: siteConfig.addressEn,
    linkedinUrl: siteConfig.linkedinUrl,
    facebookUrl: siteConfig.facebookUrl,
    stat1Val: contentAr.stats.stat1Val,
    stat2Val: contentAr.stats.stat2Val,
    stat3Val: contentAr.stats.stat3Val,
    stat4Val: contentAr.stats.stat4Val,
  };

  const [customConfig, setCustomConfig] = useState<EditableConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          return { ...defaultConfig, ...JSON.parse(saved) };
        }
      } catch {
        // Ignore storage errors in restricted environments
      }
    }
    return defaultConfig;
  });

  const data = lang === 'ar' ? contentAr : contentEn;

  useEffect(() => {
    // Sync html root attributes with current language
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.title =
      lang === 'ar'
        ? 'تيك بكرة | Tech Bokra - حلول الأنظمة الأمنية، البنية التحتية، وبرمجيات الشركات'
        : 'Tech Bokra | Security & IT Infrastructure, ERP & Cloud Solutions';
  }, [lang]);

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
    setCustomConfig(defaultConfig);
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
        lang === 'ar' ? 'font-cairo' : 'font-inter'
      }`}
    >
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
        {/* Hero Section */}
        <Hero
          lang={lang}
          data={data}
          onOpenEstimator={scrollToEstimator}
          onOpenContact={scrollToContact}
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

        {/* Featured Real Projects & Case Studies */}
        <ProjectsSection
          lang={lang}
          data={data}
          onConsultProject={handleSelectServiceForQuote}
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
          address={lang === 'ar' ? customConfig.addressAr : customConfig.addressEn}
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
        address={lang === 'ar' ? customConfig.addressAr : customConfig.addressEn}
        linkedinUrl={customConfig.linkedinUrl}
        facebookUrl={customConfig.facebookUrl}
      />

      {/* Floating Action Buttons */}
      <aside aria-label="Quick Actions" className="fixed bottom-6 left-6 rtl:left-6 rtl:right-auto ltr:right-6 ltr:left-auto z-40 flex flex-col gap-2.5">
        {/* Floating Quick Settings Trigger */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#10233D] hover:bg-[#152C4D] border border-[#00F2FE]/40 text-[#00F2FE] flex items-center justify-center shadow-lg hover:scale-105 transition"
          title={lang === 'ar' ? 'تعديل الإعدادات والمحتوى' : 'Edit Settings & Content'}
          aria-label={lang === 'ar' ? 'تعديل الإعدادات والمحتوى' : 'Edit Settings & Content'}
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Floating WhatsApp Action Button */}
        <a
          href={`https://wa.me/${customConfig.whatsappNumber}?text=${encodeURIComponent(
            lang === 'ar'
              ? 'مرحباً مهندسي تيك بكرة، أود الاستفسار عن الأنظمة الأمنية والشبكات لمنشأتي.'
              : 'Hello Tech Bokra team, I would like to inquire about your IT and security solutions.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_25px_rgba(37,211,102,0.5)] hover:scale-110 active:scale-95 transition-all group"
          title={lang === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
          aria-label={lang === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
        >
          <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="sr-only">{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
        </a>
      </aside>

      {/* Live In-Browser Admin & Content Customizer Modal */}
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
