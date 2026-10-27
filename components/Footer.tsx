'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Phone, Mail, MapPin, Sun, Moon } from 'lucide-react';
import { SiteLanguageData, siteConfig } from '@/lib/content';
import TechBokraLogo, { LogoEmblemStyle } from '@/components/TechBokraLogo';
import { useTheme } from '@/components/ThemeProvider';

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
  logoEmblemStyle?: LogoEmblemStyle;
  customLogoUrl?: string;
  brandBio?: string;
  commercialRegister?: string;
  taxId?: string;
  footerRights?: string;
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
  logoEmblemStyle = 'modern-tb',
  customLogoUrl,
  brandBio,
  commercialRegister,
  taxId,
  footerRights,
}: FooterProps) {
  const isAr = lang === 'ar';
  const { theme, toggleTheme, isDark } = useTheme();

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
    <footer
      className={`border-t pt-16 pb-12 relative z-10 text-start transition-colors duration-300 ${
        isDark
          ? 'bg-[#050D19] border-white/10'
          : 'bg-slate-100 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b ${
            isDark ? 'border-white/5' : 'border-slate-200'
          }`}
        >
          {/* Brand Bio (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <button 
              type="button" 
              onClick={() => scrollToTop()} 
              className="flex items-center text-start cursor-pointer group focus:outline-none"
              aria-label="Tech Bokra Home"
            >
              <TechBokraLogo 
                size="lg" 
                theme={theme} 
                lang={lang} 
                emblemStyle={logoEmblemStyle}
                customImageUrl={customLogoUrl}
              />
            </button>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {brandBio || data.footer.brandBio}
            </p>

            <div className={`pt-2 text-xs font-mono space-y-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              {taxId && !taxId.includes('[TO_CONFIRM') && (
                <div>{isAr ? 'البطاقة الضريبية: ' : 'Tax ID: '}{taxId}</div>
              )}
              {commercialRegister && !commercialRegister.includes('[TO_CONFIRM') && (
                <div>{isAr ? 'السجل التجاري: ' : 'Commercial Reg: '}{commercialRegister}</div>
              )}
              {(!taxId || taxId.includes('[TO_CONFIRM')) && (!commercialRegister || commercialRegister.includes('[TO_CONFIRM')) && (
                <div className="text-[11px] opacity-75">{isAr ? 'البيانات الضريبية والسجل التجاري: قيد الاعتماد الرسمي' : 'Tax ID & CR: Under Official Certification'}</div>
              )}
            </div>
          </div>

          {/* Quick Links (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {data.footer.quickLinksTitle}
            </h4>
            <ul className={`space-y-2.5 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li>
                <Link
                  href="/services"
                  className={`transition text-start block ${
                    isDark ? 'hover:text-[#00F2FE]' : 'hover:text-[#0284C7]'
                  }`}
                >
                  {data.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href="/engineering-hub"
                  className={`transition text-start block ${
                    isDark ? 'hover:text-[#00F2FE]' : 'hover:text-[#0284C7]'
                  }`}
                >
                  {isAr ? 'أدوات وحاسبة المهندسين' : 'Engineering Hub & Tools'}
                </Link>
              </li>
              <li>
                <Link
                  href="/tenders"
                  className={`transition text-start block ${
                    isDark ? 'hover:text-[#00F2FE]' : 'hover:text-[#0284C7]'
                  }`}
                >
                  {isAr ? 'مرصد أحدث المناقصات' : 'Tenders Radar'}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className={`transition text-start block ${
                    isDark ? 'hover:text-[#00F2FE]' : 'hover:text-[#0284C7]'
                  }`}
                >
                  {data.nav.projects}
                </Link>
              </li>
              <li>
                <Link
                  href="/estimator"
                  className={`transition text-start block ${
                    isDark ? 'hover:text-[#00F2FE]' : 'hover:text-[#0284C7]'
                  }`}
                >
                  {data.nav.estimator}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`transition text-start block ${
                    isDark ? 'hover:text-[#00F2FE]' : 'hover:text-[#0284C7]'
                  }`}
                >
                  {data.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {data.footer.contactTitle}
            </h4>
            <div className={`space-y-2.5 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <div className="flex items-center gap-2.5">
                <Phone className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <a 
                  href={`tel:${phone}`} 
                  dir="ltr" 
                  className={`font-mono transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}
                >
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <a 
                  href={`mailto:${email}`} 
                  className={`font-mono transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}
                >
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                <span>{displayAddress}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition border ${
                  isDark
                    ? 'bg-[#10233D] hover:bg-[#00F2FE] border-white/5 text-slate-300 hover:text-[#071120]'
                    : 'bg-white hover:bg-[#0284C7] border-slate-300 text-slate-700 hover:text-white shadow-sm'
                }`}
              >
                LinkedIn
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition border ${
                  isDark
                    ? 'bg-[#10233D] hover:bg-[#00F2FE] border-white/5 text-slate-300 hover:text-[#071120]'
                    : 'bg-white hover:bg-[#0284C7] border-slate-300 text-slate-700 hover:text-white shadow-sm'
                }`}
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Rights, Theme switcher, Admin trigger & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <p>{footerRights || data.footer.rights}</p>

            {/* Quick Theme Switcher in Footer */}
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center gap-1.5 transition px-2.5 py-1 rounded-lg border text-xs font-medium cursor-pointer ${
                isDark
                  ? 'bg-[#10233D] border-white/10 text-slate-300 hover:text-[#00F2FE]'
                  : 'bg-white border-slate-300 text-slate-700 hover:text-[#0284C7] shadow-sm'
              }`}
              title={isDark ? 'التبديل إلى الثيم الفاتح' : 'التبديل إلى الثيم الداكن'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'الوضع الفاتح' : 'Light Theme'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>{isAr ? 'الوضع الداكن' : 'Dark Theme'}</span>
                </>
              )}
            </button>

          </div>
          
          <button
            onClick={scrollToTop}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              isDark
                ? 'bg-[#10233D] hover:bg-[#152C4D] border-white/5 text-slate-300 hover:text-[#00F2FE]'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:text-[#0284C7] shadow-sm'
            }`}
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
