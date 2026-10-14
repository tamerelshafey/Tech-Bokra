'use client';

import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Save, 
  RotateCcw, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  BarChart3, 
  Sliders, 
  FileCode,
  Sparkles,
  Megaphone,
  Type,
  Link as LinkIcon,
  Download,
  Upload,
  ExternalLink
} from 'lucide-react';
import { siteConfig as defaultSiteConfig, contentAr, contentEn } from '@/lib/content';

export interface EditableConfig {
  // Contact & Social
  whatsappNumber: string;
  phone: string;
  email: string;
  secondaryEmail: string;
  addressAr: string;
  addressEn: string;
  workingHoursAr: string;
  workingHoursEn: string;
  linkedinUrl: string;
  facebookUrl: string;

  // Hero & Brand Headlines
  heroBadgeAr: string;
  heroBadgeEn: string;
  heroTitleLine1Ar: string;
  heroTitleLine1En: string;
  heroTitleLine2Ar: string;
  heroTitleLine2En: string;
  heroSubAr: string;
  heroSubEn: string;

  // Announcement Banner
  showAnnouncement: boolean;
  announcementBadgeAr: string;
  announcementBadgeEn: string;
  announcementTextAr: string;
  announcementTextEn: string;
  announcementLink: string;

  // Trust Stats
  stat1Val: string;
  stat2Val: string;
  stat3Val: string;
  stat4Val: string;

  // Live Project URLs
  helioPropertyUrl: string;
  alrehlaUrl: string;
}

export const defaultEditableConfig: EditableConfig = {
  // Contact
  whatsappNumber: defaultSiteConfig.whatsappNumber,
  phone: defaultSiteConfig.phone,
  email: defaultSiteConfig.email,
  secondaryEmail: defaultSiteConfig.secondaryEmail,
  addressAr: defaultSiteConfig.addressAr,
  addressEn: defaultSiteConfig.addressEn,
  workingHoursAr: defaultSiteConfig.workingHoursAr,
  workingHoursEn: defaultSiteConfig.workingHoursEn,
  linkedinUrl: defaultSiteConfig.linkedinUrl,
  facebookUrl: defaultSiteConfig.facebookUrl,

  // Hero
  heroBadgeAr: contentAr.hero.badge,
  heroBadgeEn: contentEn.hero.badge,
  heroTitleLine1Ar: contentAr.hero.titleLine1,
  heroTitleLine1En: contentEn.hero.titleLine1,
  heroTitleLine2Ar: contentAr.hero.titleLine2,
  heroTitleLine2En: contentEn.hero.titleLine2,
  heroSubAr: contentAr.hero.sub,
  heroSubEn: contentEn.hero.sub,

  // Announcement
  showAnnouncement: true,
  announcementBadgeAr: 'مشروعات جديدة',
  announcementBadgeEn: 'New Projects',
  announcementTextAr: 'نعمل حالياً على تجهيز منصة هليو بروبرتي العقارية ومنصة الرحلة التفاعلية',
  announcementTextEn: 'Currently engineering Helio Property PropTech and Al-Rehla Interactive Platform',
  announcementLink: 'https://helio-property.vercel.app/',

  // Stats
  stat1Val: contentAr.stats.stat1Val,
  stat2Val: contentAr.stats.stat2Val,
  stat3Val: contentAr.stats.stat3Val,
  stat4Val: contentAr.stats.stat4Val,

  // Live Projects
  helioPropertyUrl: 'https://helio-property.vercel.app/',
  alrehlaUrl: 'https://www.alrehla.org/',
};

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  currentConfig: EditableConfig;
  onSaveConfig: (newConfig: EditableConfig) => void;
  onResetDefault: () => void;
}

type TabType = 'contact' | 'hero' | 'announcement' | 'stats' | 'projects' | 'export';

export default function AdminSettingsModal({
  isOpen,
  onClose,
  lang,
  currentConfig,
  onSaveConfig,
  onResetDefault,
}: AdminSettingsModalProps) {
  const isAr = lang === 'ar';
  const [formData, setFormData] = useState<EditableConfig>(currentConfig);
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  // Sync if currentConfig changes from outside
  const [prevConfig, setPrevConfig] = useState(currentConfig);
  if (currentConfig !== prevConfig) {
    setPrevConfig(currentConfig);
    setFormData(currentConfig);
  }

  // Handle Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = <K extends keyof EditableConfig>(field: K, value: EditableConfig[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyTypeScript = () => {
    const configSnippet = `// Updated Configuration for lib/content.ts
export const siteConfig = ${JSON.stringify(
      {
        phone: formData.phone,
        whatsappNumber: formData.whatsappNumber,
        email: formData.email,
        secondaryEmail: formData.secondaryEmail,
        addressAr: formData.addressAr,
        addressEn: formData.addressEn,
        workingHoursAr: formData.workingHoursAr,
        workingHoursEn: formData.workingHoursEn,
        linkedinUrl: formData.linkedinUrl,
        facebookUrl: formData.facebookUrl,
      },
      null,
      2
    )};`;

    navigator.clipboard.writeText(configSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-bokra-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    try {
      setImportError('');
      const parsed = JSON.parse(importJsonText);
      const merged = { ...defaultEditableConfig, ...parsed };
      setFormData(merged);
      onSaveConfig(merged);
      setImportJsonText('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      setImportError(isAr ? 'صيغة JSON غير صحيحة، يرجى التأكد من الكود المنسوخ.' : 'Invalid JSON format. Please verify the copied structure.');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-b from-[#10233D] to-[#071120] border border-[#00F2FE]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0B1A2F] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#071120] border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE]">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{isAr ? 'لوحة ضبط وتعديل المحتوى المتطورة' : 'Advanced Live Content Manager'}</span>
                <span className="text-[10px] bg-[#00F2FE]/15 text-[#00F2FE] px-2 py-0.5 rounded font-mono border border-[#00F2FE]/30">
                  NO-DB READY
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr
                  ? 'تحكم فوري بالهواتف، الإعلانات، النصوص، روابط المشاريع، وتصدير الكود لـ Vercel / GitHub'
                  : 'Instant control over phone numbers, hero copy, project URLs, and direct Git export'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#152C4D] text-slate-300 hover:text-white hover:bg-[#00F2FE] hover:text-[#071120] transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#071120]/70 px-4 sm:px-6 pt-3 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'border-[#00F2FE] text-[#00F2FE]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{isAr ? 'الاتصال والعناوين' : 'Contact & Address'}</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'hero'
                ? 'border-[#00F2FE] text-[#00F2FE]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>{isAr ? 'الهيدر والشعار' : 'Hero & Slogans'}</span>
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'announcement'
                ? 'border-[#00F2FE] text-[#00F2FE]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>{isAr ? 'شريط الإعلانات العلوي' : 'Top Banner'}</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'border-[#00F2FE] text-[#00F2FE]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isAr ? 'الأرقام والإحصائيات' : 'Stats & Metrics'}</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'border-[#00F2FE] text-[#00F2FE]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{isAr ? 'روابط المنصات' : 'Project Links'}</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-[#00F2FE] text-[#00F2FE]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{isAr ? 'تصدير / نسخ الكود' : 'Export & Git'}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto text-start">
          
          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isAr
                  ? 'تم حفظ الإعدادات بنجاح وتطبيقها على كامل الموقع فوراً!'
                  : 'Settings saved and applied live across the entire website!'}
              </span>
            </div>
          )}

          {/* Tab 1: Contact & Address */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'رقم الواتساب (للاستلام الفوري)' : 'WhatsApp Number (for leads)'}
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    placeholder="201012345678"
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isAr ? 'اكتب الرقم بدون علامة + (مثال: 201012345678)' : 'Without plus sign (e.g. 201012345678)'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'رقم الهاتف المعروض للاتصال المباشر' : 'Displayed Phone Hotline'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+20 101 234 5678"
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'البريد الإلكتروني الرئيسي' : 'Primary Official Email'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Support@tech-bokra.com"
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'بريد المبيعات والطلبات' : 'Sales Email'}
                  </label>
                  <input
                    type="email"
                    value={formData.secondaryEmail}
                    onChange={(e) => handleChange('secondaryEmail', e.target.value)}
                    placeholder="sales@tech-bokra.com"
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'العنوان بالعربية' : 'Address (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.addressAr}
                    onChange={(e) => handleChange('addressAr', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'العنوان بالإنجليزية' : 'Address (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.addressEn}
                    onChange={(e) => handleChange('addressEn', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'مواعيد العمل (بالعربية)' : 'Working Hours (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.workingHoursAr}
                    onChange={(e) => handleChange('workingHoursAr', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'مواعيد العمل (بالإنجليزية)' : 'Working Hours (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.workingHoursEn}
                    onChange={(e) => handleChange('workingHoursEn', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'رابط صفحة LinkedIn' : 'LinkedIn URL'}
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'رابط صفحة Facebook' : 'Facebook URL'}
                  </label>
                  <input
                    type="url"
                    value={formData.facebookUrl}
                    onChange={(e) => handleChange('facebookUrl', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Hero & Brand Headlines */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'يمكنك تعديل نصوص الشعار والهيدر الرئيسي في أول الصفحة وملاحظة التغيير فوراً:'
                  : 'Customize the main hero title, slogans, and value proposition live:'}
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'شارة الهيدر العلوية (عربي)' : 'Hero Badge (Arabic)'}
                </label>
                <input
                  type="text"
                  value={formData.heroBadgeAr}
                  onChange={(e) => handleChange('heroBadgeAr', e.target.value)}
                  className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'السطر الأول من العنوان الرئيسي (عربي)' : 'Headline Line 1 (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitleLine1Ar}
                    onChange={(e) => handleChange('heroTitleLine1Ar', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'السطر الثاني الملون بالنيون (عربي)' : 'Headline Line 2 Glowing (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitleLine2Ar}
                    onChange={(e) => handleChange('heroTitleLine2Ar', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-[#00F2FE] font-bold text-xs focus:border-[#00F2FE] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'فقرة الشرح الرئيسية للهيدر (عربي)' : 'Hero Subtitle Paragraph (Arabic)'}
                </label>
                <textarea
                  rows={3}
                  value={formData.heroSubAr}
                  onChange={(e) => handleChange('heroSubAr', e.target.value)}
                  className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none leading-relaxed"
                />
              </div>

              <div className="border-t border-white/10 pt-4">
                <span className="text-[11px] font-bold text-slate-400 block mb-3">
                  {isAr ? 'إصدار اللغة الإنجليزية (اختياري للواجهة الإنجليزية):' : 'English Version Copies:'}
                </span>

                <div className="grid sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Title Line 1 (En)</label>
                    <input
                      type="text"
                      value={formData.heroTitleLine1En}
                      onChange={(e) => handleChange('heroTitleLine1En', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Title Line 2 (En)</label>
                    <input
                      type="text"
                      value={formData.heroTitleLine2En}
                      onChange={(e) => handleChange('heroTitleLine2En', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-[#00F2FE] text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Subtitle (En)</label>
                  <input
                    type="text"
                    value={formData.heroSubEn}
                    onChange={(e) => handleChange('heroSubEn', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#00F2FE] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Announcement Top Banner */}
          {activeTab === 'announcement' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#071120] border border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isAr ? 'تفعيل شريط التنبيهات والإعلانات العلوي' : 'Enable Top Announcement Banner'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isAr
                      ? 'يظهر شريط أنيق أعلى الموقع للإعلان عن المشاريع الجديدة أو العروض الخاصة'
                      : 'Displays a modern notification banner above the navbar'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showAnnouncement}
                    onChange={(e) => handleChange('showAnnouncement', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00F2FE]"></div>
                </label>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'شارة الإعلان (عربي)' : 'Badge Label (Ar)'}
                  </label>
                  <input
                    type="text"
                    value={formData.announcementBadgeAr}
                    onChange={(e) => handleChange('announcementBadgeAr', e.target.value)}
                    placeholder="مشروعات جديدة"
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'نص الإعلان المعروض (عربي)' : 'Announcement Text (Ar)'}
                  </label>
                  <input
                    type="text"
                    value={formData.announcementTextAr}
                    onChange={(e) => handleChange('announcementTextAr', e.target.value)}
                    placeholder="نعمل حالياً على تجهيز منصة هليو بروبرتي العقارية ومنصة الرحلة"
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'رابط الزر أو الانتقال عند الضغط' : 'Action Target URL'}
                </label>
                <input
                  type="text"
                  value={formData.announcementLink}
                  onChange={(e) => handleChange('announcementLink', e.target.value)}
                  placeholder="https://helio-property.vercel.app/"
                  className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 4: Stats & Metrics */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'يمكنك تعديل الأرقام الإحصائية المعروضة في شريط الثقة وأعلى الموقع:'
                  : 'Adjust trust metrics displayed across the top banner:'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {isAr ? 'سنوات الخبرة' : 'Experience Years'}
                  </label>
                  <input
                    type="text"
                    value={formData.stat1Val}
                    onChange={(e) => handleChange('stat1Val', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3 py-2 text-white font-mono font-bold text-center text-sm focus:border-[#00F2FE] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {isAr ? 'عدد المشاريع' : 'Projects Done'}
                  </label>
                  <input
                    type="text"
                    value={formData.stat2Val}
                    onChange={(e) => handleChange('stat2Val', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3 py-2 text-white font-mono font-bold text-center text-sm focus:border-[#00F2FE] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {isAr ? 'الكاميرات والأنظمة' : 'Cameras/Nodes'}
                  </label>
                  <input
                    type="text"
                    value={formData.stat3Val}
                    onChange={(e) => handleChange('stat3Val', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3 py-2 text-white font-mono font-bold text-center text-sm focus:border-[#00F2FE] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {isAr ? 'نسبة الاعتمادية' : 'Reliability'}
                  </label>
                  <input
                    type="text"
                    value={formData.stat4Val}
                    onChange={(e) => handleChange('stat4Val', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3 py-2 text-white font-mono font-bold text-center text-sm focus:border-[#00F2FE] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Live Project URLs */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'تحكم بالروابط المباشرة للمشروعات والمنصات الشقيقة التي تعملون عليها حالياً:'
                  : 'Manage live direct URLs for sister platforms currently in development:'}
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'رابط منصة هليو بروبرتي العقارية (Helio Property)' : 'Helio Property Live URL'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.helioPropertyUrl}
                    onChange={(e) => handleChange('helioPropertyUrl', e.target.value)}
                    className="flex-1 bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                  />
                  <a
                    href={formData.helioPropertyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#152C4D] text-slate-200 hover:text-white hover:bg-[#00F2FE] hover:text-[#071120] flex items-center justify-center transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'رابط منصة الرحلة (Al-Rehla)' : 'Al-Rehla Live URL'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.alrehlaUrl}
                    onChange={(e) => handleChange('alrehlaUrl', e.target.value)}
                    className="flex-1 bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                  />
                  <a
                    href={formData.alrehlaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#152C4D] text-slate-200 hover:text-white hover:bg-[#00F2FE] hover:text-[#071120] flex items-center justify-center transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Export for Git/Vercel */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#071120] border border-white/10 text-xs text-slate-300 leading-relaxed">
                <span className="text-[#00F2FE] font-bold block mb-1">
                  {isAr ? '💡 كيف يعمل النظام بدون قاعدة بيانات؟' : '💡 How does it work without a database?'}
                </span>
                {isAr
                  ? 'عندما تضغط على "حفظ وتطبيق فوراً"، يتم حفظ التعديلات محلياً في متصفحك (LocalStorage) وتطبيقها في ثانية واحدة. ولتثبيتها في الكود المرفوع على جيت هب (GitHub) أو فيرسيل (Vercel) ليراها كافة الزوار حول العالم، يمكنك نسخ الكود البرمجي بالأسفل، أو تنزيل ملف الإعدادات كـ JSON واستعادته في أي وقت!'
                  : 'Changes apply immediately in your browser via LocalStorage. To make it permanent for all global visitors on Vercel, copy the configuration snippet below or download your JSON backup.'}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyTypeScript}
                  className="px-4 py-2 rounded-xl bg-[#152C4D] hover:bg-[#00F2FE] hover:text-[#071120] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ كود TypeScript' : 'Copy TypeScript Code')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  className="px-4 py-2 rounded-xl bg-[#071120] border border-white/20 hover:border-[#00F2FE] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4 text-[#00F2FE]" />
                  <span>{isAr ? 'تنزيل ملف الإعدادات (JSON)' : 'Download Settings (JSON)'}</span>
                </button>
              </div>

              {/* Import JSON Area */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'استيراد أو استعادة إعدادات من ملف/نص JSON:' : 'Import or Restore settings from JSON:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='{"phone": "+20...", "whatsappNumber": "..."}'
                    className="flex-1 bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleImportJSON}
                    className="px-4 py-2 rounded-xl bg-[#00F2FE]/20 hover:bg-[#00F2FE] text-[#00F2FE] hover:text-[#071120] text-xs font-bold transition flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استيراد' : 'Import'}</span>
                  </button>
                </div>
                {importError && (
                  <p className="text-rose-400 text-[11px] mt-1">{importError}</p>
                )}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onResetDefault}
              className="px-4 py-2 rounded-xl bg-transparent border border-rose-500/30 hover:border-rose-500 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'استعادة الإعدادات الأصلية' : 'Reset to Default'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#10233D] hover:bg-[#152C4D] text-slate-300 text-xs font-semibold"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-black text-xs shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center justify-center gap-1.5 transition"
              >
                <Save className="w-4 h-4" />
                <span>{isAr ? 'حفظ وتطبيق فوراً' : 'Save & Apply Live'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
