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
  Sparkles
} from 'lucide-react';
import { siteConfig as defaultSiteConfig } from '@/lib/content';

export interface EditableConfig {
  whatsappNumber: string;
  phone: string;
  email: string;
  secondaryEmail: string;
  addressAr: string;
  addressEn: string;
  linkedinUrl: string;
  facebookUrl: string;
  stat1Val: string;
  stat2Val: string;
  stat3Val: string;
  stat4Val: string;
}

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  currentConfig: EditableConfig;
  onSaveConfig: (newConfig: EditableConfig) => void;
  onResetDefault: () => void;
}

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
  const [activeTab, setActiveTab] = useState<'contact' | 'stats' | 'export'>('contact');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  const handleChange = (field: keyof EditableConfig, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyJSON = () => {
    const configSnippet = `export const siteConfig = ${JSON.stringify(
      {
        phone: formData.phone,
        whatsappNumber: formData.whatsappNumber,
        email: formData.email,
        secondaryEmail: formData.secondaryEmail,
        addressAr: formData.addressAr,
        addressEn: formData.addressEn,
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#10233D] to-[#071120] border border-[#00F2FE]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#0B1A2F] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#071120] border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE]">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>{isAr ? 'لوحة ضبط المحتوى والإعدادات السريعة' : 'Live Content & Settings Manager'}</span>
                <span className="text-[10px] bg-[#00F2FE]/15 text-[#00F2FE] px-2 py-0.5 rounded font-mono border border-[#00F2FE]/30">
                  NO-DB READY
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr
                  ? 'عدّل أرقام الهواتف، الواتساب، والبيانات وشاهد التحديث فورياً في الموقع مع إمكانية تصدير الكود'
                  : 'Customize phone, WhatsApp, and stats with instant live preview and zero-database export'}
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
        <div className="flex border-b border-white/10 bg-[#071120]/60 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'border-[#00F2FE] text-[#00F2FE]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{isAr ? 'بيانات الاتصال والتواصل' : 'Contact & Social'}</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'border-[#00F2FE] text-[#00F2FE]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isAr ? 'الأرقام والإحصائيات' : 'Stats & Metrics'}</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-[#00F2FE] text-[#00F2FE]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{isAr ? 'تصدير الكود لـ Vercel/Git' : 'Export for Vercel/Git'}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[60vh] overflow-y-auto text-start">
          
          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isAr
                  ? 'تم حفظ الإعدادات وتطبيقها بنجاح على الموقع فورياً!'
                  : 'Settings saved and applied to the site instantly!'}
              </span>
            </div>
          )}

          {/* Tab 1: Contact & Social */}
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
                    {isAr ? 'اكتب الرقم بدون أصفار أو علامة زائد (مثال: 201012345678)' : 'Without plus sign (e.g. 201012345678)'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'رقم الهاتف المعروض للاتصال' : 'Displayed Phone Hotline'}
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
                    {isAr ? 'بريد المبيعات الإضافي' : 'Sales Email'}
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
                    {isAr ? 'رابط LinkedIn' : 'LinkedIn URL'}
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
                    {isAr ? 'رابط Facebook' : 'Facebook URL'}
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

          {/* Tab 2: Stats & Metrics */}
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

          {/* Tab 3: Export for Git/Vercel */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#071120] border border-white/10 text-xs text-slate-300 leading-relaxed">
                <span className="text-[#00F2FE] font-bold block mb-1">
                  {isAr ? '💡 كيف يعمل النظام بدون قاعدة بيانات؟' : '💡 How does it work without a database?'}
                </span>
                {isAr
                  ? 'عندما تضغط على "حفظ وتطبيق فوراً"، يتم حفظ التعديلات في متصفحك محلياً (LocalStorage) وتطبيقها في ثانية واحدة على الموقع بالكامل. ولتثبيت هذه البيانات في الكود ليراها كافة الزوار حول العالم عبر Vercel، يمكنك نسخ الكود البرمجي أدناه ولصقه في ملف lib/content.ts، أو إرساله في أي وقت هنا لنقوم بتثبيته لك!'
                  : 'When you click "Apply & Save", changes update immediately in your browser via LocalStorage. To make it permanent for all global visitors on Vercel, copy the configuration snippet below into lib/content.ts!'}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">siteConfig (TypeScript):</span>
                  <button
                    type="button"
                    onClick={handleCopyJSON}
                    className="px-3 py-1 rounded-lg bg-[#152C4D] hover:bg-[#00F2FE] hover:text-[#071120] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-[#071120] border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48">
{`export const siteConfig = {
  phone: "${formData.phone}",
  whatsappNumber: "${formData.whatsappNumber}",
  email: "${formData.email}",
  secondaryEmail: "${formData.secondaryEmail}",
  addressAr: "${formData.addressAr}",
  addressEn: "${formData.addressEn}",
  linkedinUrl: "${formData.linkedinUrl}",
  facebookUrl: "${formData.facebookUrl}",
};`}
                </pre>
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
