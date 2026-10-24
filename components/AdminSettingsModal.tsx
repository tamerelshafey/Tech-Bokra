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
  ExternalLink,
  MessageSquare,
  Sun,
  Moon,
  Image as ImageIcon,
  Trash2,
  Inbox,
  UserCheck,
  LogOut,
  LogIn,
  Filter,
  Calendar,
  CloudCheck,
  CloudUpload,
  RefreshCw,
  ExternalLink as ExtLinkIcon,
  LayoutDashboard,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { siteConfig as defaultSiteConfig, contentAr, contentEn, Project, ServiceItem } from '@/lib/content';
import TechBokraLogo, { LogoEmblemStyle } from '@/components/TechBokraLogo';
import { useTheme } from '@/components/ThemeProvider';
import { 
  auth, 
  signOut, 
  onAuthStateChanged, 
  User 
} from '@/lib/firebase';
import { 
  FirestoreInquiry, 
  subscribeInquiries, 
  updateInquiryStatus, 
  deleteInquiry, 
  saveSiteSettingsToCloud 
} from '@/lib/dbService';
import { compressImageFile, uploadImageToServer } from '@/lib/storageHelper';
import { verifyAdminStatus } from '@/lib/authHelper';

import type { EditableConfig, MediaVaultItem } from '@/lib/siteConfig';
import { defaultEditableConfig } from '@/lib/siteConfig';
export type { EditableConfig, MediaVaultItem };
export { defaultEditableConfig };

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  currentConfig: EditableConfig;
  onSaveConfig: (newConfig: EditableConfig) => void;
  onResetDefault: () => void;
}

type TabType = 'contact' | 'logo' | 'leads' | 'hero' | 'announcement' | 'stats' | 'projects' | 'export';

export default function AdminSettingsModal({
  isOpen,
  onClose,
  lang,
  currentConfig,
  onSaveConfig,
  onResetDefault,
}: AdminSettingsModalProps) {
  const isAr = lang === 'ar';
  const { theme, toggleTheme, isDark } = useTheme();
  const [formData, setFormData] = useState<EditableConfig>(currentConfig);
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [cloudSavedSuccess, setCloudSavedSuccess] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  // Firebase Auth & Cloud Leads State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [inquiries, setInquiries] = useState<FirestoreInquiry[]>([]);
  const [leadsFilter, setLeadsFilter] = useState<string>('all');
  const [loginError, setLoginError] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Listen to Auth State
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Realtime Inquiries when modal is open and user is verified admin
  React.useEffect(() => {
    if (!isOpen || !user) {
      return;
    }

    let unsub: (() => void) | null = null;
    let isCancelled = false;

    verifyAdminStatus(user).then((res) => {
      if (isCancelled) return;
      if (res.isAdmin) {
        unsub = subscribeInquiries(
          (data) => setInquiries(data),
          (err) => console.warn('Inquiries sync notice:', err.message)
        );
      } else {
        setInquiries([]);
      }
    });

    return () => {
      isCancelled = true;
      if (unsub) unsub();
    };
  }, [isOpen, user]);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActionSuccessMsg(isAr ? 'تم تسجيل الخروج.' : 'Logged out.');
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err: unknown) {
      console.warn('Logout error:', err);
    }
  };

  const handleChange = <K extends keyof EditableConfig>(field: K, value: EditableConfig[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);

    // Save to Cloud Firestore
    setIsSavingCloud(true);
    try {
      const result = await saveSiteSettingsToCloud(formData, user);
      if (result.generalSaved) {
        setCloudSavedSuccess(true);
        setTimeout(() => setCloudSavedSuccess(false), 4000);
      }
    } catch (err: unknown) {
      console.warn('Cloud save skipped or warning:', err);
    } finally {
      setIsSavingCloud(false);
    }
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
        className={`relative w-full max-w-3xl rounded-3xl overflow-hidden my-6 border transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-[#10233D] to-[#071120] border-[#00F2FE]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)]'
            : 'bg-white border-slate-200 shadow-[0_25px_60px_rgba(15,23,42,0.18)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
          isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <TechBokraLogo size="sm" theme={theme} variant="icon" />
            <div>
              <h2 className={`text-lg sm:text-xl font-black flex items-center gap-2 flex-wrap ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <span>{isAr ? 'لوحة تحكم الموقع وقاعدة البيانات' : 'Cloud CMS & Database Manager'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono border font-bold flex items-center gap-1 ${
                  user
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : isDark ? 'bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/30' : 'bg-sky-50 text-[#0284C7] border-sky-200'
                }`}>
                  {user ? <UserCheck className="w-3 h-3 text-emerald-400" /> : <CloudCheck className="w-3 h-3 text-[#00F2FE]" />}
                  {user ? (user.email === 'tam.elshafey@gmail.com' ? 'SUPER ADMIN (tam.elshafey)' : 'ADMIN') : 'FIREBASE CONNECTED'}
                </span>
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {isAr
                  ? 'مزامنة فورية مع قاعدة بيانات Firebase: الشعار، بيانات الاتصال، واستقبال طلبات المعاينة'
                  : 'Instant Firebase Cloud Sync: branding, contacts, and real-time customer leads'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Google Admin Login / Logout */}
            {authLoading ? null : user ? (
              <div className="flex items-center gap-1.5">
                <span className="hidden lg:inline text-[11px] font-mono text-emerald-400 px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition cursor-pointer"
                  title={isAr ? 'تسجيل الخروج' : 'Log Out'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'خروج' : 'Logout'}</span>
                </button>
              </div>
            ) : null}

            {/* Direct Link to Full Dedicated Secret Portal Page */}
            <Link
              href="/tb-portal-9482x"
              onClick={onClose}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                isDark
                  ? 'bg-[#00F2FE]/15 hover:bg-[#00F2FE]/25 border-[#00F2FE]/40 text-[#00F2FE]'
                  : 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-[#0284C7]'
              }`}
              title={isAr ? 'فتح بوابة الإدارة المشفرة' : 'Open Encrypted Console'}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{isAr ? 'البوابة المشفرة' : 'Secure Portal'}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Link>

            {/* Quick theme toggle in admin modal */}
            <button
              onClick={toggleTheme}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                isDark 
                  ? 'bg-[#152C4D] border-white/10 text-slate-200 hover:border-[#00F2FE]' 
                  : 'bg-white border-slate-300 text-slate-700 hover:border-[#0284C7] shadow-sm'
              }`}
              title={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{isAr ? 'الوضع الفاتح' : 'Light Mode'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">{isAr ? 'الوضع الداكن' : 'Dark Mode'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-full transition cursor-pointer ${
                isDark 
                  ? 'bg-[#152C4D] text-slate-300 hover:text-white hover:bg-[#00F2FE] hover:text-[#071120]' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b px-4 sm:px-6 pt-3 gap-2 overflow-x-auto scrollbar-none ${
          isDark ? 'border-white/10 bg-[#071120]/70' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'contact'
                ? isDark ? 'border-[#00F2FE] text-[#00F2FE]' : 'border-[#0284C7] text-[#0284C7]'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{isAr ? 'الاتصال والعناوين' : 'Contact & Address'}</span>
          </button>

          <button
            onClick={() => setActiveTab('logo')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'logo'
                ? isDark ? 'border-[#00F2FE] text-[#00F2FE]' : 'border-[#0284C7] text-[#0284C7]'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isAr ? 'تخصيص الشعار والهوية' : 'Logo & Branding'}</span>
          </button>

          {/* New Leads & Inquiries CRM Tab */}
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer relative ${
              activeTab === 'leads'
                ? isDark ? 'border-[#00F2FE] text-[#00F2FE]' : 'border-[#0284C7] text-[#0284C7]'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>{isAr ? 'طلبات العملاء والمعاينات' : 'Customer Leads'}</span>
            {inquiries.filter((i) => i.status === 'new').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-mono font-bold">
                {inquiries.filter((i) => i.status === 'new').length}
              </span>
            )}
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
              <div>
                <span>
                  {isAr
                    ? 'تم حفظ الإعدادات بنجاح وتطبيقها على كامل الموقع فوراً!'
                    : 'Settings saved and applied live across the entire website!'}
                </span>
                {cloudSavedSuccess && (
                  <span className="block mt-0.5 text-emerald-300 font-bold">
                    {isAr ? '✓ تم تحديث قاعدة بيانات Firebase بنجاح لجميع زوار الموقع.' : '✓ Synced to Firebase Firestore successfully for all visitors.'}
                  </span>
                )}
              </div>
            </div>
          )}

          {actionSuccessMsg && (
            <div className="p-3 rounded-xl bg-sky-950/80 border border-sky-500/50 text-sky-200 text-xs flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-[#00F2FE] shrink-0" />
              <span>{actionSuccessMsg}</span>
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

          {/* Tab: Logo & Brand Identity */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isAr ? 'شعار وهوية Tech Bokra الرسمية' : 'Tech Bokra Official Brand Logo'}
                </h4>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isAr
                    ? 'اختر من نماذج الشعار الهندسية فائقة التباين، أو ارفع ملف صورة الشعار الخاص بك مباشرة من جهازك:'
                    : 'Choose from high-contrast vector brand emblems or upload your custom logo image:'}
                </p>
              </div>

              {/* Gemini Image Notice */}
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                isDark 
                  ? 'bg-[#00F2FE]/10 border-[#00F2FE]/30 text-sky-200' 
                  : 'bg-sky-50 border-sky-200 text-sky-900'
              }`}>
                <Sparkles className="w-5 h-5 text-[#00F2FE] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-1">
                    {isAr ? '💡 ملاحظة هامة بخصوص روابط صور Gemini:' : '💡 Note regarding Gemini conversation links:'}
                  </strong>
                  <p>
                    {isAr
                      ? 'الروابط التي تبدأ بـ https://gemini.google.com/app/... هي محادثات خاصة محمية بحسابك، ولا يمكن للمواقع الخارجية سحب الصورة منها مباشرة. لحل ذلك بسهولة: اضغط بالزر الأيمن على الصورة داخل Gemini واختر "حفظ الصورة باسم" (Save Image)، ثم اضغط على زر "رفع ملف صورة من جهازك" بالأسفل لتطبيقها فوراً وبأعلى دقة!'
                      : 'URLs starting with https://gemini.google.com/app/... are private chat sessions. To use your generated logo: Right-click the image in Gemini, select "Save Image", then click "Upload Image File from Device" below!'}
                  </p>
                </div>
              </div>

              {/* 1. Vector Emblem Style Selector */}
              <div>
                <label className={`block text-xs font-bold mb-2.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {isAr ? '1. نماذج ونمط الشعار (تصميمات هندسية فائقة الوضوح والتباين):' : '1. Brand Mark & Emblem Presets:'}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Preset 1: Modern TB Monogram */}
                  <div
                    onClick={() => {
                      handleChange('logoEmblemStyle', 'modern-tb');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.logoEmblemStyle === 'modern-tb' && !formData.customLogoUrl
                        ? isDark
                          ? 'bg-[#10233D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                          : 'bg-sky-50 border-[#0284C7] shadow-md ring-2 ring-[#0284C7]/20'
                        : isDark
                        ? 'bg-[#071120]/60 border-white/10 hover:border-white/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#00F2FE]/20 text-[#00F2FE]">
                        {isAr ? 'الموصى به' : 'Recommended'}
                      </span>
                      {formData.logoEmblemStyle === 'modern-tb' && !formData.customLogoUrl && (
                        <Check className="w-3.5 h-3.5 text-[#00F2FE]" />
                      )}
                    </div>
                    <div className="h-14 flex items-center justify-center py-1">
                      <TechBokraLogo variant="icon" emblemStyle="modern-tb" size="sm" theme={theme} />
                    </div>
                    <h5 className={`text-xs font-bold text-center mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isAr ? 'Modern TB' : 'Modern TB'}
                    </h5>
                  </div>

                  {/* Preset 2: Security Shield */}
                  <div
                    onClick={() => {
                      handleChange('logoEmblemStyle', 'security-shield');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.logoEmblemStyle === 'security-shield' && !formData.customLogoUrl
                        ? isDark
                          ? 'bg-[#10233D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                          : 'bg-sky-50 border-[#0284C7] shadow-md ring-2 ring-[#0284C7]/20'
                        : isDark
                        ? 'bg-[#071120]/60 border-white/10 hover:border-white/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400">
                        {isAr ? 'أنظمة أمنية' : 'Security'}
                      </span>
                      {formData.logoEmblemStyle === 'security-shield' && !formData.customLogoUrl && (
                        <Check className="w-3.5 h-3.5 text-[#00F2FE]" />
                      )}
                    </div>
                    <div className="h-14 flex items-center justify-center py-1">
                      <TechBokraLogo variant="icon" emblemStyle="security-shield" size="sm" theme={theme} />
                    </div>
                    <h5 className={`text-xs font-bold text-center mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isAr ? 'درع الأمان' : 'Security Shield'}
                    </h5>
                  </div>

                  {/* Preset 3: Cyber Cube */}
                  <div
                    onClick={() => {
                      handleChange('logoEmblemStyle', 'cyber-cube');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.logoEmblemStyle === 'cyber-cube' && !formData.customLogoUrl
                        ? isDark
                          ? 'bg-[#10233D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                          : 'bg-sky-50 border-[#0284C7] shadow-md ring-2 ring-[#0284C7]/20'
                        : isDark
                        ? 'bg-[#071120]/60 border-white/10 hover:border-white/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                        {isAr ? 'بنية تحتية' : 'Infrastructure'}
                      </span>
                      {formData.logoEmblemStyle === 'cyber-cube' && !formData.customLogoUrl && (
                        <Check className="w-3.5 h-3.5 text-[#00F2FE]" />
                      )}
                    </div>
                    <div className="h-14 flex items-center justify-center py-1">
                      <TechBokraLogo variant="icon" emblemStyle="cyber-cube" size="sm" theme={theme} />
                    </div>
                    <h5 className={`text-xs font-bold text-center mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isAr ? 'المكعب التقني' : 'Cyber Cube'}
                    </h5>
                  </div>

                  {/* Preset 4: Minimal Wordmark */}
                  <div
                    onClick={() => {
                      handleChange('logoEmblemStyle', 'minimal-text');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.logoEmblemStyle === 'minimal-text' && !formData.customLogoUrl
                        ? isDark
                          ? 'bg-[#10233D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                          : 'bg-sky-50 border-[#0284C7] shadow-md ring-2 ring-[#0284C7]/20'
                        : isDark
                        ? 'bg-[#071120]/60 border-white/10 hover:border-white/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {isAr ? 'نص فقط' : 'Wordmark'}
                      </span>
                      {formData.logoEmblemStyle === 'minimal-text' && !formData.customLogoUrl && (
                        <Check className="w-3.5 h-3.5 text-[#00F2FE]" />
                      )}
                    </div>
                    <div className="h-14 flex items-center justify-center py-1">
                      <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Tech<span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>Bokra</span>
                      </span>
                    </div>
                    <h5 className={`text-xs font-bold text-center mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isAr ? 'شعار نصي فائق البساطة' : 'Pure Wordmark'}
                    </h5>
                  </div>
                </div>
              </div>

              {/* 2. Logo Size & Fine Controls */}
              <div className={`p-4 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#071120]/80 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isAr ? '2. حجم ومقاس الشعار في الهيدر (Logo Scale):' : '2. Logo Scale in Navigation Bar:'}
                    </h4>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isAr ? 'تحكم في كبر أو صغر الشعار ليتناسب مع ذوقك ومقاس الشاشات' : 'Adjust logo visibility and dimensions'}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
                    isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-slate-200/70 border-slate-300'
                  }`}>
                    {[
                      { id: 'sm' as const, label: isAr ? 'صغير' : 'Small' },
                      { id: 'md' as const, label: isAr ? 'عادي' : 'Medium' },
                      { id: 'lg' as const, label: isAr ? 'كبير' : 'Large' },
                      { id: 'xl' as const, label: isAr ? 'بارز جداً' : 'Extra' },
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => handleChange('logoScale', sz.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          (formData.logoScale || 'md') === sz.id
                            ? isDark
                              ? 'bg-[#00F2FE] text-[#071120] shadow-sm'
                              : 'bg-slate-900 text-white shadow-sm'
                            : isDark
                            ? 'text-slate-300 hover:text-white'
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtitle & Badge Toggles */}
                <div className={`grid sm:grid-cols-2 gap-3 pt-2 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                    isDark ? 'bg-[#0B1A2F] border-white/5' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div>
                      <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {isAr ? 'إظهار الوصف التوضيحي' : 'Show Subtitle'}
                      </span>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isAr ? 'حلول الأنظمة الأمنية والبنية التحتية' : 'Security & IT Infrastructure'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showLogoSubtitle ?? true}
                        onChange={(e) => handleChange('showLogoSubtitle', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00F2FE]"></div>
                    </label>
                  </div>

                  <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                    isDark ? 'bg-[#0B1A2F] border-white/5' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div>
                      <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {isAr ? 'إظهار شارة (تيك بكرة)' : 'Show Arabic Badge'}
                      </span>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isAr ? 'شارة الاسم بالعربية بجوار اللوجو' : 'Bilingual badge'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showLogoArabicBadge ?? true}
                        onChange={(e) => handleChange('showLogoArabicBadge', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00F2FE]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. Custom Image Upload or URL */}
              <div className={`p-4 sm:p-5 rounded-2xl border ${
                isDark ? 'bg-[#071120]/80 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <label className={`block text-xs font-bold mb-2.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {isAr ? '3. رفع صورة شعار مخصصة (Custom Image):' : '3. Upload Custom Logo Image:'}
                </label>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* File Upload Button */}
                  <div>
                    <label 
                      htmlFor="logo-file-input"
                      className={`w-full py-4 px-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center ${
                        isDark 
                          ? 'border-[#00F2FE]/40 hover:border-[#00F2FE] bg-[#10233D]/50 hover:bg-[#10233D]' 
                          : 'border-slate-300 hover:border-[#0284C7] bg-white hover:bg-slate-50'
                      }`}
                    >
                      <Upload className={`w-6 h-6 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                      <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {isAr ? 'اضغط لاختيار صورة من جهازك' : 'Choose image file from device'}
                      </span>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        PNG, SVG, JPG, WebP
                      </span>
                    </label>
                    <input
                      id="logo-file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const result = await uploadImageToServer(file);
                            if (result?.url) {
                              handleChange('customLogoUrl', result.url);
                            }
                          } catch (err) {
                            console.error('Logo upload error:', err);
                          }
                        }
                      }}
                    />
                  </div>

                  {/* URL Input and Status */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <span className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {isAr ? 'أو أدخل رابط الصورة المباشر:' : 'Or enter direct image URL:'}
                      </span>
                      <input
                        type="url"
                        value={formData.customLogoUrl}
                        onChange={(e) => handleChange('customLogoUrl', e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none border transition ${
                          isDark
                            ? 'bg-[#0B1A2F] border-white/10 text-white focus:border-[#00F2FE]'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-[#0284C7]'
                        }`}
                      />
                    </div>

                    {formData.customLogoUrl && (
                      <div className="pt-3 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                          <Check className="w-3.5 h-3.5" />
                          {isAr ? 'تم تفعيل الصورة المخصصة' : 'Custom image active'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleChange('customLogoUrl', '')}
                          className="px-2.5 py-1 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-500/30 rounded-lg flex items-center gap-1 cursor-pointer transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{isAr ? 'إزالة الصورة المخصصة' : 'Remove Image'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Dual Theme Live Preview */}
              <div>
                <label className={`block text-xs font-bold mb-2.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {isAr ? '4. معاينة حية فورية للشعار في كلا الوضعين (Dark & Light):' : '4. Live Dual-Theme Preview:'}
                </label>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Dark Theme Preview */}
                  <div className="p-4 rounded-2xl bg-[#071120] border border-[#00F2FE]/30 shadow-inner">
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-[#00F2FE]" />
                        {isAr ? 'الوضع الليلي (Dark Mode)' : 'Dark Theme'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">bg: #071120</span>
                    </div>
                    <div className="py-2">
                      <TechBokraLogo
                        size={formData.logoScale || 'md'}
                        theme="dark"
                        lang={lang}
                        showSubtitle={formData.showLogoSubtitle ?? true}
                        showArabicBadge={formData.showLogoArabicBadge ?? true}
                        emblemStyle={formData.logoEmblemStyle}
                        customImageUrl={formData.customLogoUrl}
                        customHeight={formData.customLogoHeight}
                      />
                    </div>
                  </div>

                  {/* Light Theme Preview */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-md">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                      <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        {isAr ? 'الوضع الفاتح (Light Mode)' : 'Light Theme'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">bg: #FFFFFF</span>
                    </div>
                    <div className="py-2">
                      <TechBokraLogo
                        size={formData.logoScale || 'md'}
                        theme="light"
                        lang={lang}
                        showSubtitle={formData.showLogoSubtitle ?? true}
                        showArabicBadge={formData.showLogoArabicBadge ?? true}
                        emblemStyle={formData.logoEmblemStyle}
                        customImageUrl={formData.customLogoUrl}
                        customHeight={formData.customLogoHeight}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Realtime Customer Inquiries & CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span>{isAr ? 'طلبات العملاء والمعاينات الواردة (CRM)' : 'Customer Leads & Inquiries CRM'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#00F2FE]/20 text-[#00F2FE]">
                      {inquiries.length} {isAr ? 'طلب' : 'Leads'}
                    </span>
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr
                      ? 'مزامنة لحظية مباشرة مع Firebase: تتبع واستجابة فورية لطلبات الاستشارات والمعاينات'
                      : 'Real-time Firebase sync: manage customer quotes and survey requests'}
                  </p>
                </div>

                {!user && (
                  <Link
                    href="/tb-portal-9482x"
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الدخول للبوابة المشفرة' : 'Login to Secure Portal'}</span>
                  </Link>
                )}
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs">
                  {loginError}
                </div>
              )}

              {/* Status Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block">{isAr ? 'إجمالي الطلبات' : 'Total Leads'}</span>
                  <span className={`text-lg font-mono font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{inquiries.length}</span>
                </div>
                <div className="p-3 rounded-xl border bg-rose-950/30 border-rose-500/30">
                  <span className="text-[10px] text-rose-300 block">{isAr ? 'طلبات جديدة (تحتاج رد)' : 'New Leads'}</span>
                  <span className="text-lg font-mono font-black text-rose-400">
                    {inquiries.filter((i) => i.status === 'new').length}
                  </span>
                </div>
                <div className="p-3 rounded-xl border bg-sky-950/30 border-sky-500/30">
                  <span className="text-[10px] text-sky-300 block">{isAr ? 'تم التواصل' : 'Contacted'}</span>
                  <span className="text-lg font-mono font-black text-[#00F2FE]">
                    {inquiries.filter((i) => i.status === 'contacted').length}
                  </span>
                </div>
                <div className="p-3 rounded-xl border bg-emerald-950/30 border-emerald-500/30">
                  <span className="text-[10px] text-emerald-300 block">{isAr ? 'معاينة مجدولة / تعاقد' : 'Survey / Won'}</span>
                  <span className="text-lg font-mono font-black text-emerald-400">
                    {inquiries.filter((i) => i.status === 'survey_scheduled' || i.status === 'contracted').length}
                  </span>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                  { id: 'new', labelAr: 'جديد', labelEn: 'New' },
                  { id: 'contacted', labelAr: 'تم التواصل', labelEn: 'Contacted' },
                  { id: 'survey_scheduled', labelAr: 'حجز معاينة', labelEn: 'Survey' },
                  { id: 'contracted', labelAr: 'تم التعاقد', labelEn: 'Contracted' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLeadsFilter(tab.id)}
                    className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer border ${
                      leadsFilter === tab.id
                        ? isDark
                          ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE]'
                          : 'bg-[#0284C7] text-white border-[#0284C7]'
                        : isDark
                        ? 'bg-[#071120] text-slate-300 border-white/10 hover:border-white/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isAr ? tab.labelAr : tab.labelEn}
                  </button>
                ))}
              </div>

              {/* Inquiries Cards List */}
              <div className="space-y-3">
                {inquiries
                  .filter((item) => leadsFilter === 'all' || item.status === leadsFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        item.status === 'new'
                          ? isDark
                            ? 'bg-[#10233D]/90 border-[#00F2FE]/50 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                            : 'bg-sky-50/70 border-sky-300 shadow-sm'
                          : isDark
                          ? 'bg-[#071120]/80 border-white/10'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            item.status === 'new' ? 'bg-rose-500 animate-ping' : item.status === 'contracted' ? 'bg-emerald-400' : 'bg-sky-400'
                          }`} />
                          <h5 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {item.clientName}
                          </h5>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            item.source === 'estimator'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-[#00F2FE]/15 text-[#00F2FE]'
                          }`}>
                            {item.source === 'estimator' ? (isAr ? 'حاسبة التكلفة' : 'Estimator') : (isAr ? 'نموذج الاتصال' : 'Contact Form')}
                          </span>
                        </div>

                        {/* Status Dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            onChange={(e) => updateInquiryStatus(item.id, e.target.value as FirestoreInquiry['status'])}
                            className={`text-xs rounded-lg px-2.5 py-1 font-bold outline-none border cursor-pointer ${
                              item.status === 'new'
                                ? 'bg-rose-950/70 text-rose-300 border-rose-500/40'
                                : item.status === 'contracted'
                                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                                : 'bg-[#152C4D] text-slate-200 border-white/20'
                            }`}
                          >
                            <option value="new">{isAr ? '🔴 جديد' : '🔴 New'}</option>
                            <option value="contacted">{isAr ? '🟡 تم التواصل' : '🟡 Contacted'}</option>
                            <option value="survey_scheduled">{isAr ? '🔵 حجز معاينة' : '🔵 Survey Scheduled'}</option>
                            <option value="contracted">{isAr ? '🟢 تم التعاقد' : '🟢 Contracted'}</option>
                            <option value="archived">{isAr ? '⚪ مؤرشف' : '⚪ Archived'}</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(isAr ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Delete this inquiry?')) {
                                deleteInquiry(item.id);
                              }
                            }}
                            className="p-1 rounded-lg hover:bg-rose-950/40 text-rose-400 transition"
                            title={isAr ? 'حذف الطلب' : 'Delete lead'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Lead Contact & Details */}
                      <div className="pt-3 grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">
                            {isAr ? 'بيانات التواصل الفوري:' : 'Instant Contact:'}
                          </span>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-white bg-[#0B1A2F] px-2 py-1 rounded border border-white/10">
                              {item.phone}
                            </span>

                            {/* Direct WhatsApp Action */}
                            {item.phone && (
                              <a
                                href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  isAr
                                    ? `مرحباً أستاذ ${item.clientName}، نتواصل معك من شركة تيك بكرة (Tech Bokra) بخصوص طلبكم.`
                                    : `Hello ${item.clientName}, contacting you from Tech Bokra regarding your request.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold flex items-center gap-1 transition"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>{isAr ? 'مراسلة واتساب' : 'WhatsApp'}</span>
                              </a>
                            )}

                            {/* Direct Call Action */}
                            {item.phone && (
                              <a
                                href={`tel:${item.phone}`}
                                className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-400 font-bold flex items-center gap-1 transition"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{isAr ? 'اتصال' : 'Call'}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {item.facilityType && (
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">
                              {isAr ? 'المنشأة / القطاع:' : 'Facility Sector:'}
                            </span>
                            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                              {item.facilityType}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Systems Badges */}
                      {item.selectedSystems && item.selectedSystems.length > 0 && (
                        <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                          {item.selectedSystems.map((sys, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] font-medium"
                            >
                              {sys}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes / Message */}
                      {item.notes && (
                        <p className={`mt-2 p-2.5 rounded-xl text-xs leading-relaxed border ${
                          isDark ? 'bg-[#071120] border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                          {item.notes}
                        </p>
                      )}

                      {/* Timestamp */}
                      <span className="text-[10px] text-slate-500 font-mono mt-2 block">
                        {new Date(item.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                      </span>
                    </div>
                  ))}

                {inquiries.length === 0 && (
                  <div className={`p-8 rounded-2xl text-center border-2 border-dashed ${
                    isDark ? 'border-white/10 bg-[#071120]/40' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <Inbox className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {isAr ? 'لا توجد طلبات واردة حتى الآن' : 'No incoming leads yet'}
                    </p>
                    <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {isAr
                        ? 'عندما يقوم أي عميل بإرسال نموذج الاتصال أو حاسبة التكلفة، سيظهر طلبه هنا فوراً مع إمكانية الرد بضغطة زر.'
                        : 'When a customer submits a quote or uses the estimator, their request will appear here instantly.'}
                    </p>
                  </div>
                )}
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
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#071120] border border-white/10">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isAr ? 'إظهار قسم الإحصائيات بالصفحة الرئيسية' : 'Show Trust Stats on Homepage'}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isAr ? 'الافتراضي: مخفي لحين توثيق الأرقام والبيانات التعاقدية' : 'Default: hidden pending audited data'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showStatsSection ?? false}
                    onChange={(e) => handleChange('showStatsSection', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <p className="text-xs text-slate-400">
                {isAr
                  ? 'يمكنك تعديل نصوص وقيم المؤشرات الهندسية المعروضة:'
                  : 'Adjust metric values displayed when the section is enabled:'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {isAr ? 'حلول مخصصة للمشروع' : 'Tailored Solutions'}
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
                    {isAr ? 'أنظمة ومعدات معيارية' : 'Standard Hardware'}
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
                    {isAr ? 'مطابقة للمواصفات الفنية' : 'Spec Compliance'}
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
                    {isAr ? 'عقود صيانة ودعم مستمر' : 'SLA & Support'}
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
                disabled={isSavingCloud}
                className="px-6 py-2.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-black text-xs shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-60"
              >
                {isSavingCloud ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#071120]" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>
                  {isSavingCloud 
                    ? (isAr ? 'جاري المزامنة مع Firebase...' : 'Syncing with Firebase...')
                    : (isAr ? 'حفظ وتطبيق فوراً' : 'Save & Apply Live')}
                </span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
