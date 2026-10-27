'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { contentAr, contentEn, SiteLanguageData } from '@/lib/content';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  lang: Language;
  isAr: boolean;
  isEn: boolean;
  toggleLanguage: () => void;
  setLanguage: (newLang: Language) => void;
  data: SiteLanguageData;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'tech_bokra_language_pref_v2';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default language is 'en' (English) as requested
  const [lang, setLangState] = useState<Language>('en');
  const [mounted, setMounted] = useState<boolean>(false);

  // Sync saved user preference on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      try {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === 'en' || stored === 'ar') {
          setLangState(stored);
        } else {
          setLangState('en');
        }
      } catch {
        // Ignore storage errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update HTML attributes whenever language changes
  useEffect(() => {
    if (!mounted) return;
    const isArabic = lang === 'ar';
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', isArabic ? 'rtl' : 'ltr');

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  }, [lang, mounted]);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      document.documentElement.setAttribute('lang', newLang);
      document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    } catch {
      // Ignore storage errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(lang === 'ar' ? 'en' : 'ar');
  };

  const isAr = lang === 'ar';
  const isEn = lang === 'en';
  const data = isAr ? contentAr : contentEn;

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isAr,
        isEn,
        toggleLanguage,
        setLanguage,
        data,
        mounted,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if accessed outside provider
    return {
      lang: 'ar',
      isAr: true,
      isEn: false,
      toggleLanguage: () => {},
      setLanguage: () => {},
      data: contentAr,
      mounted: false,
    };
  }
  return context;
}
