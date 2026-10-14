'use client';

import React, { useState, useEffect } from 'react';
import { Shield, MessageSquare, Menu, X, Globe, Settings } from 'lucide-react';
import { SiteLanguageData, siteConfig } from '@/lib/content';

interface NavbarProps {
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  data: SiteLanguageData;
  onOpenSettings?: () => void;
  whatsappNumber?: string;
}

export default function Navbar({ 
  lang, 
  onToggleLang, 
  data, 
  onOpenSettings,
  whatsappNumber = siteConfig.whatsappNumber
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: data.nav.home },
    { href: '#services', label: data.nav.services },
    { href: '#projects', label: data.nav.projects },
    { href: '#architecture', label: data.nav.architecture },
    { href: '#estimator', label: data.nav.estimator },
    { href: '#process', label: data.nav.process },
    { href: '#faq', label: data.nav.faq },
    { href: '#contact', label: data.nav.contact },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#071120]/95 backdrop-blur-md border-b border-[#00F2FE]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3'
          : 'bg-[#071120]/75 backdrop-blur-sm border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B1A2F] to-[#10233D] border border-[#00F2FE]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.25)] group-hover:border-[#00F2FE] group-hover:shadow-[0_0_20px_rgba(0,242,254,0.5)] transition-all">
              <span className="text-[#00F2FE] font-black text-xl">TB</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00F2FE] animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00F2FE]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1 font-cairo">
                <span>تيك</span>
                <span className="text-[#00F2FE]">بكرة</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#00F2FE]/15 text-[#00F2FE] font-mono border border-[#00F2FE]/30 font-normal hidden sm:inline-block">
                  Tech Bokra
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                {lang === 'ar' ? 'حلول الأنظمة الأمنية والبنية التحتية' : 'Security & IT Infrastructure'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-[#00F2FE] transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00F2FE] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Settings Trigger */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#10233D] hover:bg-[#152C4D] border border-white/10 hover:border-[#00F2FE]/40 text-slate-300 hover:text-[#00F2FE] text-xs font-semibold transition shadow-sm"
                title={lang === 'ar' ? 'لوحة ضبط المحتوى والإعدادات' : 'Content & Settings Manager'}
                aria-label={lang === 'ar' ? 'لوحة ضبط المحتوى والإعدادات' : 'Content & Settings Manager'}
              >
                <Settings className="w-3.5 h-3.5 text-[#00F2FE]" />
                <span className="hidden 2xl:inline">{lang === 'ar' ? 'الضبط' : 'Settings'}</span>
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10233D] hover:bg-[#152C4D] border border-[#00F2FE]/25 text-slate-200 text-xs font-semibold hover:border-[#00F2FE] transition-all shadow-sm"
              title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span className="font-mono uppercase">{lang === 'ar' ? 'EN' : 'عربي'}</span>
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all shadow-[0_0_12px_rgba(37,211,102,0.15)]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'واتساب مباشر' : 'WhatsApp'}</span>
            </a>

            {/* Primary CTA */}
            <a
              href="#contact"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0369A1] text-[#071120] font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] transition-all transform active:scale-95"
            >
              <Shield className="w-4 h-4" />
              <span>{data.nav.surveyCta}</span>
            </a>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg bg-[#10233D] border border-white/10 text-[#00F2FE] text-xs"
                title={lang === 'ar' ? 'الضبط' : 'Settings'}
                aria-label={lang === 'ar' ? 'الضبط' : 'Settings'}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#10233D] border border-[#00F2FE]/25 text-slate-200 text-xs font-semibold"
              aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#10233D] text-slate-200 border border-white/10 hover:border-[#00F2FE]/40 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#00F2FE]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#071120]/98 border-b border-[#00F2FE]/20 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg bg-[#10233D]/60 hover:bg-[#10233D] border border-white/5 text-sm font-medium text-slate-200 hover:text-[#00F2FE] hover:border-[#00F2FE]/30 transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-lg bg-[#00F2FE] text-[#071120] font-bold text-sm shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>{data.nav.surveyCta}</span>
            </a>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-bold text-sm flex items-center justify-center gap-2"
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
