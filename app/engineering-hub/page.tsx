'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EngineeringHub from '@/components/EngineeringHub';
import { contentAr, contentEn } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';
import { useCustomConfig } from '@/lib/useCustomConfig';
import { useRouter } from 'next/navigation';

import { useLanguage } from '@/components/LanguageProvider';

export default function EngineeringHubPage() {
  const { lang, isAr, toggleLanguage, data } = useLanguage();
  const [customConfig] = useCustomConfig();
  const router = useRouter();
  const { isDark } = useTheme();

  const handleOpenConsultation = (scopeSummary?: string) => {
    if (scopeSummary) {
      router.push(`/contact?scope=${encodeURIComponent(scopeSummary)}`);
    } else {
      router.push('/contact');
    }
  };

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
      />

      <main className="pt-24 pb-16">
        <React.Suspense fallback={<div className="max-w-5xl mx-auto p-12 text-center text-slate-400">Loading Engineering Hub...</div>}>
          <EngineeringHub
            lang={lang}
            data={data}
            onOpenConsultation={handleOpenConsultation}
          />
        </React.Suspense>
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
      />
    </div>
  );
}
