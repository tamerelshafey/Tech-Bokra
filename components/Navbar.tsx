'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, MessageSquare, Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { SiteLanguageData, siteConfig } from '@/lib/content';
import TechBokraLogo, { LogoEmblemStyle } from '@/components/TechBokraLogo';
import { useTheme } from '@/components/ThemeProvider';

interface NavbarProps {
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  data: SiteLanguageData;
  onOpenSettings?: () => void;
  whatsappNumber?: string;
  logoEmblemStyle?: LogoEmblemStyle;
  customLogoUrl?: string;
}

export default function Navbar({ 
  lang, 
  onToggleLang, 
  data, 
  onOpenSettings,
  whatsappNumber = siteConfig.whatsappNumber,
  logoEmblemStyle = 'modern-tb',
  customLogoUrl,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const pathname = usePathname();
  const isAr = lang === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', href: '/', label: data.nav.home },
    { id: 'services', href: '/services', label: data.nav.services },
    { id: 'architecture', href: '/engineering-hub', label: isAr ? 'أدوات وحاسبة المهندسين' : 'Engineering Hub' },
    { id: 'tenders', href: '/tenders', label: isAr ? 'مرصد المناقصات' : 'Tenders Radar' },
    { id: 'projects', href: '/projects', label: data.nav.projects },
    { id: 'estimator', href: '/estimator', label: data.nav.estimator },
    { id: 'contact', href: '/contact', label: data.nav.contact },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-[#071120]/95 backdrop-blur-md border-b border-[#00F2FE]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2.5'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-2.5'
          : isDark
            ? 'bg-[#071120]/80 backdrop-blur-sm border-b border-white/5 py-3.5'
            : 'bg-white/85 backdrop-blur-sm border-b border-slate-200/80 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Official Straightened Brand Logo linking to Home */}
          <Link 
            href="/"
            className="flex items-center group focus:outline-none cursor-pointer"
            aria-label="Tech Bokra Home"
          >
            <TechBokraLogo 
              size="md" 
              theme={theme} 
              lang={lang} 
              showSubtitle={true}
              emblemStyle={logoEmblemStyle}
              customImageUrl={customLogoUrl}
            />
          </Link>

          {/* Desktop Navigation Links (Routes & Internal Pages) */}
          <div className="hidden xl:flex items-center gap-4 2xl:gap-6 mx-3 sm:mx-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`text-xs sm:text-sm transition-colors relative py-1 group ${
                    isActive
                      ? isDark
                        ? 'text-[#00F2FE] font-black'
                        : 'text-[#0284C7] font-black'
                      : isDark
                        ? 'text-slate-200 hover:text-[#00F2FE] font-bold'
                        : 'text-slate-900 hover:text-[#0284C7] font-bold'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                      isActive 
                        ? 'w-full ' + (isDark ? 'bg-[#00F2FE]' : 'bg-[#0284C7]') 
                        : 'w-0 group-hover:w-full ' + (isDark ? 'bg-[#00F2FE]' : 'bg-[#0284C7]')
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all shadow-sm cursor-pointer border flex items-center justify-center ${
                isDark
                  ? 'bg-[#10233D] hover:bg-[#152C4D] border-[#00F2FE]/25 text-[#00F2FE] hover:border-[#00F2FE]'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-500 hover:text-amber-600'
              }`}
              title={
                lang === 'ar'
                  ? isDark
                    ? 'تفعيل الثيم الفاتح (Light Mode)'
                    : 'تفعيل الثيم الداكن (Dark Mode)'
                  : isDark
                    ? 'Switch to Light Theme'
                    : 'Switch to Dark Theme'
              }
              aria-label={
                lang === 'ar'
                  ? isDark
                    ? 'تفعيل الثيم الفاتح'
                    : 'تفعيل الثيم الداكن'
                  : 'Toggle dark and light theme'
              }
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-180 duration-300" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer border ${
                isDark
                  ? 'bg-[#10233D] hover:bg-[#152C4D] border-[#00F2FE]/25 text-slate-200 hover:border-[#00F2FE]'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 hover:border-[#0284C7]'
              }`}
              title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
              <span className="font-mono uppercase font-bold">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Direct WhatsApp Call */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                lang === 'ar'
                  ? 'مرحباً مهندسي تيك بكرة، أود الاستفسار عن الأنظمة الأمنية والشبكات لمنشأتي.'
                  : 'Hello Tech Bokra team, I would like to inquire about your security and IT solutions.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
            </a>

            {/* Primary CTA button linking to /contact */}
            <Link
              href="/contact"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0369A1] text-[#071120] font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.45)] transition-all transform active:scale-95 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>{data.nav.surveyCta}</span>
            </Link>
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex items-center gap-2 xl:hidden">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border text-xs cursor-pointer ${
                isDark
                  ? 'bg-[#10233D] border-[#00F2FE]/30 text-[#00F2FE]'
                  : 'bg-slate-100 border-slate-300 text-amber-500'
              }`}
              aria-label="Toggle dark/light theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Language Toggle Mobile */}
            <button
              onClick={onToggleLang}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                isDark
                  ? 'bg-[#10233D] border-[#00F2FE]/25 text-slate-200'
                  : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
              aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#10233D] text-slate-200 border-white/10 hover:border-[#00F2FE]/40'
                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:border-[#0284C7]'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#00F2FE]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className={`xl:hidden px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200 border-b ${
            isDark
              ? 'bg-[#071120]/98 border-[#00F2FE]/20'
              : 'bg-white/98 border-slate-200 shadow-xl'
          }`}
        >
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-bold transition text-start ${
                    isActive
                      ? isDark
                        ? 'bg-[#00F2FE]/20 border-[#00F2FE]/40 text-[#00F2FE]'
                        : 'bg-sky-100 border-sky-300 text-[#0284C7]'
                      : isDark
                        ? 'bg-[#10233D]/60 hover:bg-[#10233D] border-white/5 text-slate-200 hover:text-[#00F2FE]'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-[#0284C7]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] font-black text-sm shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>{data.nav.surveyCta}</span>
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] font-bold text-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تحدث مباشرة عبر واتساب' : 'Chat via WhatsApp'}</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
