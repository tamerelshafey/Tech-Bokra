'use client';

import React from 'react';
import { ArrowUp, Phone, Mail, MapPin, Settings } from 'lucide-react';
import { SiteLanguageData, siteConfig } from '@/lib/content';

interface FooterProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  onOpenSettings?: () => void;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
}

export default function Footer({ 
  lang, 
  data,
  onOpenSettings,
  phone = siteConfig.phone,
  whatsappNumber = siteConfig.whatsappNumber,
  email = siteConfig.email,
  address,
  linkedinUrl = siteConfig.linkedinUrl,
  facebookUrl = siteConfig.facebookUrl,
}: FooterProps) {
  const isAr = lang === 'ar';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleNavClick = (sectionId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const displayAddress = address || data.footer.addressVal;

  return (
    <footer className="bg-[#050D19] border-t border-white/10 pt-16 pb-12 relative z-10 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Bio (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <button 
              type="button" 
              onClick={() => scrollToTop()} 
              className="flex items-center gap-3 text-start cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0B1A2F] to-[#10233D] border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE] font-black text-lg group-hover:border-[#00F2FE] transition">
                TB
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                <span>تيك</span> <span className="text-[#00F2FE]">بكرة</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#00F2FE]/15 text-[#00F2FE] font-mono border border-[#00F2FE]/30 font-normal mr-2 rtl:mr-2 rtl:ml-0 ltr:ml-2">
                  Tech Bokra
                </span>
              </div>
            </button>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {data.footer.brandBio}
            </p>

            <div className="pt-2 text-xs font-mono text-slate-500">
              {data.footer.taxId}
            </div>
          </div>

          {/* Quick Links (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {data.footer.quickLinksTitle}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={(e) => handleNavClick('services', e)}
                  className="hover:text-[#00F2FE] transition text-start cursor-pointer"
                >
                  {data.nav.services}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleNavClick('projects', e)}
                  className="hover:text-[#00F2FE] transition text-start cursor-pointer"
                >
                  {data.nav.projects}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleNavClick('architecture', e)}
                  className="hover:text-[#00F2FE] transition text-start cursor-pointer"
                >
                  {data.nav.architecture}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleNavClick('estimator', e)}
                  className="hover:text-[#00F2FE] transition text-start cursor-pointer"
                >
                  {data.nav.estimator}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleNavClick('process', e)}
                  className="hover:text-[#00F2FE] transition text-start cursor-pointer"
                >
                  {data.nav.process}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleNavClick('faq', e)}
                  className="hover:text-[#00F2FE] transition text-start cursor-pointer"
                >
                  {data.nav.faq}
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {data.footer.contactTitle}
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00F2FE] shrink-0" />
                <a href={`tel:${whatsappNumber}`} className="font-mono hover:text-[#00F2FE] transition">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00F2FE] shrink-0" />
                <a href={`mailto:${email}`} className="font-mono hover:text-[#00F2FE] transition">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00F2FE] shrink-0 mt-0.5" />
                <span>{displayAddress}</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#10233D] hover:bg-[#00F2FE] text-slate-300 hover:text-[#071120] text-xs font-semibold font-mono transition"
              >
                LinkedIn
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#10233D] hover:bg-[#00F2FE] text-slate-300 hover:text-[#071120] text-xs font-semibold font-mono transition"
              >
                Facebook
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Rights, Admin Editor trigger & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <p>{data.footer.rights}</p>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#00F2FE] transition px-2 py-0.5 rounded bg-white/5 hover:bg-[#10233D] border border-white/5"
              >
                <Settings className="w-3 h-3 text-[#00F2FE]" />
                <span>{isAr ? 'لوحة ضبط المحتوى والإعدادات' : 'Content & Settings'}</span>
              </button>
            )}
          </div>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10233D] hover:bg-[#152C4D] border border-white/5 text-slate-300 hover:text-[#00F2FE] transition"
            aria-label="Back to top"
          >
            <span>{isAr ? 'العودة للأعلى' : 'Back to top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
