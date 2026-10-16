'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Inbox, 
  Image as ImageIcon, 
  Phone, 
  Megaphone, 
  Briefcase, 
  Settings, 
  Save, 
  RotateCcw, 
  Check, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Sun, 
  Moon, 
  Search, 
  Filter, 
  MessageSquare, 
  Trash2, 
  Upload, 
  Sparkles, 
  UserCheck, 
  LogIn, 
  LogOut, 
  Download, 
  Copy, 
  RefreshCw,
  ShieldCheck,
  Globe,
  Plus,
  AlertCircle
} from 'lucide-react';
import TechBokraLogo, { LogoEmblemStyle } from '@/components/TechBokraLogo';
import { useTheme } from '@/components/ThemeProvider';
import { siteConfig as defaultSiteConfig, contentAr, contentEn } from '@/lib/content';
import { EditableConfig, defaultEditableConfig } from '@/components/AdminSettingsModal';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  testConnection 
} from '@/lib/firebase';
import { 
  FirestoreInquiry, 
  subscribeInquiries, 
  updateInquiryStatus, 
  deleteInquiry, 
  saveSiteSettingsToCloud,
  subscribeSiteSettings 
} from '@/lib/dbService';

const LOCAL_STORAGE_KEY = 'tech_bokra_custom_config_v2';

export default function AdminDashboardPage() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'branding' | 'contacts' | 'hero' | 'projects' | 'vercel'>('overview');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  // Config State
  const [config, setConfig] = useState<EditableConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) return { ...defaultEditableConfig, ...JSON.parse(saved) };
      } catch {
        // ignore
      }
    }
    return defaultEditableConfig;
  });

  // Auth & Cloud State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [inquiries, setInquiries] = useState<FirestoreInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [leadsFilter, setLeadsFilter] = useState<string>('all');
  const [leadsSearch, setLeadsSearch] = useState('');
  
  // UI Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cloudSuccess, setCloudSuccess] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [copiedConfig, setCopiedConfig] = useState(false);

  // New Project Form State in CMS
  const [newProject, setNewProject] = useState({
    title: '',
    client: '',
    category: 'security',
    tag: '',
    summary: '',
    liveUrl: '',
    isUpcoming: false
  });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // Auth Listener
  useEffect(() => {
    testConnection();
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    // Listen to real-time cloud settings
    const unsubscribeSettings = subscribeSiteSettings((cloudSettings) => {
      if (cloudSettings) {
        setConfig((prev) => ({ ...prev, ...cloudSettings }));
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSettings();
    };
  }, []);

  // Inquiries Realtime Listener
  useEffect(() => {
    const unsubscribe = subscribeInquiries(
      (data) => {
        setInquiries(data);
        setInquiriesLoading(false);
      },
      (err) => {
        console.warn('Inquiries sync:', err.message);
        setInquiriesLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const handleConfigChange = <K extends keyof EditableConfig>(field: K, value: EditableConfig[K]) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);

    // 1. Local Storage fallback
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }

    // 2. Cloud Firestore Save
    try {
      await saveSiteSettingsToCloud(config, user);
      setCloudSuccess(true);
      setTimeout(() => setCloudSuccess(false), 4000);
      setNotificationMsg(isAr ? 'تم حفظ التعديلات سحابياً وتطبيقها فوراً!' : 'Settings synced to Firebase live!');
    } catch (err: unknown) {
      console.warn('Cloud save notice:', err);
      setNotificationMsg(isAr ? 'تم الحفظ محلياً (يرجى تسجيل الدخول كمسؤول للحفظ السحابي العام)' : 'Saved locally.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotificationMsg(''), 4000);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setNotificationMsg(isAr ? 'تم تسجيل الدخول بنجاح كمسؤول معتمد!' : 'Signed in successfully as Admin!');
      setTimeout(() => setNotificationMsg(''), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setNotificationMsg(msg);
      setTimeout(() => setNotificationMsg(''), 5000);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await signOut(auth);
      setNotificationMsg(isAr ? 'تم تسجيل الخروج بنجاح.' : 'Logged out.');
      setTimeout(() => setNotificationMsg(''), 3000);
    } catch {
      // ignore
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ['ID', 'Client Name', 'Phone', 'Facility', 'Systems', 'Status', 'Date', 'Notes'];
    const rows = inquiries.map((inq) => [
      inq.id,
      `"${inq.clientName.replace(/"/g, '""')}"`,
      `"${inq.phone}"`,
      `"${(inq.facilityType || '').replace(/"/g, '""')}"`,
      `"${(inq.selectedSystems || []).join('; ')}"`,
      inq.status,
      `"${inq.createdAt}"`,
      `"${(inq.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tech_bokra_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads
  const filteredLeads = inquiries.filter((inq) => {
    const matchesFilter = leadsFilter === 'all' || inq.status === leadsFilter;
    const matchesSearch = 
      !leadsSearch ||
      inq.clientName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      inq.phone.includes(leadsSearch) ||
      (inq.facilityType || '').toLowerCase().includes(leadsSearch.toLowerCase()) ||
      (inq.notes || '').toLowerCase().includes(leadsSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const newLeadsCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#071120] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      } ${isAr ? 'font-cairo' : 'font-inter'}`}
    >
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 ${
        isDark 
          ? 'bg-[#071120]/90 border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.4)]' 
          : 'bg-white/90 border-slate-200 shadow-sm'
      }`}>
        {/* Left: Brand & Dashboard Tag */}
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:opacity-90 transition">
            <TechBokraLogo 
              size="md" 
              theme={theme} 
              lang={lang} 
              emblemStyle={config.logoEmblemStyle}
              customImageUrl={config.customLogoUrl}
            />
          </Link>
          <div className="h-6 w-px bg-slate-700/40 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border font-mono ${
              isDark 
                ? 'bg-[#10233D] text-[#00F2FE] border-[#00F2FE]/30' 
                : 'bg-sky-50 text-[#0284C7] border-sky-200'
            }`}>
              {isAr ? 'لوحة التحكم الإدارية' : 'Admin Console'}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firebase Active</span>
            </span>
          </div>
        </div>

        {/* Right: Quick Controls & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
              isDark ? 'bg-[#10233D] border-white/10 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
            title="Toggle Language"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isDark ? 'bg-[#10233D] border-[#00F2FE]/30 text-amber-400' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
            title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Back to Site Button */}
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isDark 
                ? 'bg-[#152C4D] border-white/10 hover:border-[#00F2FE] text-slate-200' 
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-[#0284C7]'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'زيارة الموقع' : 'View Site'}</span>
          </Link>

          {/* Admin User / Auth Button */}
          {authLoading ? null : user ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-end leading-tight">
                <span className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{user.email === 'tam.elshafey@gmail.com' ? 'Super Admin' : (user.displayName || 'Admin')}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{user.email}</span>
              </div>
              <button
                onClick={handleGoogleLogout}
                className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition cursor-pointer"
                title={isAr ? 'تسجيل الخروج' : 'Sign Out'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="px-3.5 py-1.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isAr ? 'دخول المدير (Google)' : 'Admin Sign In'}</span>
            </button>
          )}

          {/* Global Save Button */}
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0369A1] text-[#071120] font-black text-xs sm:text-sm shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ وتحديث فوري' : 'Save Live')}</span>
          </button>
        </div>
      </header>

      {/* Global Notification Banner */}
      {notificationMsg && (
        <div className="bg-sky-950 border-b border-sky-500/40 text-sky-200 px-6 py-2.5 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F2FE]" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg('')} className="p-1 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar (3 Cols) */}
          <aside className="lg:col-span-3 space-y-2">
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className={`text-[11px] font-bold uppercase tracking-wider block mb-3 px-2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {isAr ? 'أقسام لوحة التحكم' : 'Management Sections'}
              </span>

              <nav className="space-y-1">
                {[
                  { id: 'overview', labelAr: 'نظرة عامة والنشاط', labelEn: 'Overview & Stats', icon: LayoutDashboard },
                  { id: 'leads', labelAr: 'طلبات العملاء والمعاينات', labelEn: 'Customer Leads CRM', icon: Inbox, badge: newLeadsCount },
                  { id: 'branding', labelAr: 'الشعار وهوية الشركة', labelEn: 'Brand & Logo CMS', icon: ImageIcon },
                  { id: 'contacts', labelAr: 'بيانات الاتصال ومقر العمل', labelEn: 'Contact & Addresses', icon: Phone },
                  { id: 'hero', labelAr: 'الهيدر وشريط الإعلانات', labelEn: 'Hero & Announcements', icon: Megaphone },
                  { id: 'projects', labelAr: 'المشاريع وسابقة الأعمال', labelEn: 'Projects Portfolio', icon: Briefcase },
                  { id: 'vercel', labelAr: 'دليل النشر (Vercel & Cloud)', labelEn: 'Vercel Deployment', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-start cursor-pointer ${
                        isActive
                          ? isDark
                            ? 'bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/30'
                            : 'bg-sky-50 text-[#0284C7] border border-sky-200'
                          : isDark
                          ? 'text-slate-300 hover:bg-white/5'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? (isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]') : 'text-slate-400'}`} />
                        <span>{isAr ? item.labelAr : item.labelEn}</span>
                      </div>
                      {typeof item.badge === 'number' && item.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500 text-white font-bold animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Status Card */}
            <div className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
              isDark ? 'bg-[#0B1A2F]/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isAr ? 'قاعدة البيانات:' : 'Database:'}</span>
                <span className="font-mono text-emerald-400 font-bold">Firestore Enterprise</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isAr ? 'مشروع Firebase:' : 'Project ID:'}</span>
                <span className="font-mono text-slate-300 text-[11px]">eng-inverter-8jmtp</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isAr ? 'صلاحية المدير:' : 'Access Level:'}</span>
                <span className="font-bold text-[#00F2FE]">
                  {user?.email === 'tam.elshafey@gmail.com' ? 'Super Admin' : user ? 'Admin' : (isAr ? 'وضع المعاينة' : 'Preview Mode')}
                </span>
              </div>
            </div>
          </aside>

          {/* Main Workspace (9 Cols) */}
          <main className="lg:col-span-9 space-y-6">

            {/* 1. OVERVIEW & QUICK STATS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'نظرة عامة على منظومة Tech Bokra' : 'Tech Bokra Executive Overview'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'متابعة حية للطلبات، سابقة الأعمال، وحالة التكامل السحابي' : 'Real-time monitoring for leads, portfolio, and cloud integration'}
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <span className="text-xs text-slate-400 block mb-1">{isAr ? 'إجمالي طلبات المعاينة' : 'Total Leads'}</span>
                    <span className={`text-2xl font-mono font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{inquiries.length}</span>
                  </div>

                  <div className="p-4 rounded-2xl border bg-rose-950/30 border-rose-500/30">
                    <span className="text-xs text-rose-300 block mb-1">{isAr ? 'طلبات جديدة (تحتاج رد)' : 'New Inquiries'}</span>
                    <span className="text-2xl font-mono font-black text-rose-400">{newLeadsCount}</span>
                  </div>

                  <div className="p-4 rounded-2xl border bg-sky-950/30 border-sky-500/30">
                    <span className="text-xs text-sky-300 block mb-1">{isAr ? 'تم التواصل / حجز معاينة' : 'In Progress'}</span>
                    <span className="text-2xl font-mono font-black text-[#00F2FE]">
                      {inquiries.filter((i) => i.status === 'contacted' || i.status === 'survey_scheduled').length}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl border bg-emerald-950/30 border-emerald-500/30">
                    <span className="text-xs text-emerald-300 block mb-1">{isAr ? 'تم التعاقد والتنفيذ' : 'Won Deals'}</span>
                    <span className="text-2xl font-mono font-black text-emerald-400">
                      {inquiries.filter((i) => i.status === 'contracted').length}
                    </span>
                  </div>
                </div>

                {/* Recent Leads Preview */}
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                    <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Inbox className="w-4 h-4 text-[#00F2FE]" />
                      <span>{isAr ? 'أحدث طلبات المعاينة الواردة' : 'Recent Incoming Leads'}</span>
                    </h4>
                    <button
                      onClick={() => setActiveTab('leads')}
                      className="text-xs text-[#00F2FE] hover:underline font-bold"
                    >
                      {isAr ? 'عرض كافة الطلبات ⬅️' : 'View All Leads ➡️'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {inquiries.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isDark ? 'bg-[#071120] border-white/5' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{item.clientName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#00F2FE]/15 text-[#00F2FE]">
                              {item.source === 'estimator' ? (isAr ? 'حاسبة التكلفة' : 'Estimator') : (isAr ? 'نموذج الاتصال' : 'Contact')}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono mt-0.5 block">{item.phone}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              isAr
                                ? `مرحباً أستاذ ${item.clientName}، نتواصل معك من شركة تيك بكرة (Tech Bokra) بخصوص طلبكم.`
                                : `Hello ${item.clientName}, contacting you from Tech Bokra regarding your request.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center gap-1.5 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{isAr ? 'واتساب فوري' : 'WhatsApp'}</span>
                          </a>

                          <span className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border ${
                            item.status === 'new'
                              ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {item.status === 'new' ? (isAr ? 'جديد' : 'New') : item.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {inquiries.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-4">
                        {isAr ? 'لا توجد طلبات جديدة حتى الآن.' : 'No recent leads yet.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Controls Card */}
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'إجراءات سريعة ومباشرة' : 'Quick Actions'}
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveTab('branding')}
                      className={`p-3 rounded-xl border text-start transition cursor-pointer ${
                        isDark ? 'bg-[#071120] border-white/10 hover:border-[#00F2FE]' : 'bg-slate-50 border-slate-200 hover:border-[#0284C7]'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 text-[#00F2FE] mb-1.5" />
                      <span className="block text-xs font-bold text-white">{isAr ? 'تغيير الشعار' : 'Change Logo'}</span>
                      <span className="text-[10px] text-slate-400">{isAr ? 'رفع ملف أو اختيار فيكتور' : 'Upload or preset'}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('contacts')}
                      className={`p-3 rounded-xl border text-start transition cursor-pointer ${
                        isDark ? 'bg-[#071120] border-white/10 hover:border-[#00F2FE]' : 'bg-slate-50 border-slate-200 hover:border-[#0284C7]'
                      }`}
                    >
                      <Phone className="w-4 h-4 text-[#00F2FE] mb-1.5" />
                      <span className="block text-xs font-bold text-white">{isAr ? 'تعديل رقم الواتساب' : 'Edit WhatsApp'}</span>
                      <span className="text-[10px] text-slate-400">{config.whatsappNumber}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('vercel')}
                      className={`p-3 rounded-xl border text-start transition cursor-pointer ${
                        isDark ? 'bg-[#071120] border-white/10 hover:border-[#00F2FE]' : 'bg-slate-50 border-slate-200 hover:border-[#0284C7]'
                      }`}
                    >
                      <Settings className="w-4 h-4 text-[#00F2FE] mb-1.5" />
                      <span className="block text-xs font-bold text-white">{isAr ? 'دليل إعداد Vercel' : 'Vercel Deployment'}</span>
                      <span className="text-[10px] text-slate-400">{isAr ? 'إعداد النطاق المصرح' : 'Authorized domains'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. LEADS & INQUIRIES CRM */}
            {activeTab === 'leads' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isAr ? 'إدارة طلبات المعاينة والعملاء (Leads & CRM)' : 'Customer Leads & Inquiries CRM'}
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {isAr ? 'مزامنة لحظية مباشرة مع قاعدة بيانات Firebase' : 'Live real-time sync directly with Firebase'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCSV}
                      disabled={inquiries.length === 0}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تصدير إكسيل (CSV)' : 'Export CSV'}</span>
                    </button>
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute top-3 right-3 text-slate-400 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
                    <input
                      type="text"
                      value={leadsSearch}
                      onChange={(e) => setLeadsSearch(e.target.value)}
                      placeholder={isAr ? 'ابحث بالاسم، رقم الهاتف، أو المنشأة...' : 'Search leads by name, phone, notes...'}
                      className={`w-full rounded-xl py-2 px-9 text-xs outline-none border transition ${
                        isDark 
                          ? 'bg-[#071120] border-white/10 text-white focus:border-[#00F2FE]' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0284C7]'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                    {[
                      { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                      { id: 'new', labelAr: '🔴 جديد', labelEn: 'New' },
                      { id: 'contacted', labelAr: '🟡 تم التواصل', labelEn: 'Contacted' },
                      { id: 'survey_scheduled', labelAr: '🔵 حجز معاينة', labelEn: 'Survey' },
                      { id: 'contracted', labelAr: '🟢 تم التعاقد', labelEn: 'Contracted' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setLeadsFilter(btn.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer border ${
                          leadsFilter === btn.id
                            ? isDark
                              ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE]'
                              : 'bg-[#0284C7] text-white border-[#0284C7]'
                            : isDark
                            ? 'bg-[#071120] text-slate-300 border-white/10'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {isAr ? btn.labelAr : btn.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Leads Cards */}
                <div className="space-y-3">
                  {filteredLeads.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        item.status === 'new'
                          ? isDark
                            ? 'bg-[#10233D]/90 border-[#00F2FE]/40 shadow-[0_0_20px_rgba(0,242,254,0.12)]'
                            : 'bg-sky-50 border-sky-300 shadow-sm'
                          : isDark
                          ? 'bg-[#0B1A2F] border-white/10'
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${
                            item.status === 'new' ? 'bg-rose-500 animate-ping' : item.status === 'contracted' ? 'bg-emerald-400' : 'bg-sky-400'
                          }`} />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {item.clientName}
                              </h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                                item.source === 'estimator'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/30'
                              }`}>
                                {item.source === 'estimator' ? (isAr ? 'حاسبة التكلفة' : 'Estimator Lead') : (isAr ? 'نموذج الاتصال' : 'Contact Lead')}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(item.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                            </span>
                          </div>
                        </div>

                        {/* Status Select & Delete */}
                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            onChange={(e) => updateInquiryStatus(item.id, e.target.value as FirestoreInquiry['status'])}
                            className={`text-xs rounded-xl px-3 py-1.5 font-bold outline-none border cursor-pointer ${
                              item.status === 'new'
                                ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                                : item.status === 'contracted'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
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
                            onClick={() => {
                              if (confirm(isAr ? 'هل أنت متأكد من حذف هذا السجل نهائياً؟' : 'Permanently delete this inquiry?')) {
                                deleteInquiry(item.id);
                              }
                            }}
                            className="p-1.5 rounded-xl hover:bg-rose-950 text-rose-400 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Phone & Contact Buttons */}
                      <div className="pt-3 grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">{isAr ? 'الهاتف والتواصل:' : 'Phone & Action:'}</span>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-white bg-[#071120] px-2.5 py-1 rounded-lg border border-white/10">
                              {item.phone}
                            </span>
                            <a
                              href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                isAr
                                  ? `مرحباً أستاذ ${item.clientName}، نتواصل معك من شركة تيك بكرة (Tech Bokra) بخصوص طلبكم.`
                                  : `Hello ${item.clientName}, contacting you from Tech Bokra regarding your request.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold flex items-center gap-1.5 transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                            </a>
                            <a
                              href={`tel:${item.phone}`}
                              className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-400 font-bold flex items-center gap-1.5 transition"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{isAr ? 'اتصال' : 'Call'}</span>
                            </a>
                          </div>
                        </div>

                        {item.facilityType && (
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">{isAr ? 'المنشأة / القطاع:' : 'Sector:'}</span>
                            <span className="font-bold text-white">{item.facilityType}</span>
                          </div>
                        )}
                      </div>

                      {/* Systems Badges */}
                      {item.selectedSystems && item.selectedSystems.length > 0 && (
                        <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                          {item.selectedSystems.map((s, idx) => (
                            <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE]">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <p className={`mt-2.5 p-3 rounded-xl text-xs leading-relaxed border ${
                          isDark ? 'bg-[#071120] border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                          {item.notes}
                        </p>
                      )}
                    </div>
                  ))}

                  {filteredLeads.length === 0 && (
                    <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-2xl">
                      <Inbox className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-300">{isAr ? 'لا توجد طلبات تطابق البحث' : 'No matching leads'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. BRAND & LOGO CMS */}
            {activeTab === 'branding' && (
              <div className={`p-6 rounded-2xl border space-y-6 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'إدارة وهوية الشعار الرسمي لـ Tech Bokra' : 'Official Brand Logo CMS'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'تحكم بالشعار، رفع الصور، وتغيير النمط المتجهي مع مزامنة سحابية فورية' : 'Manage official logo, upload custom files, and switch vector styles live'}
                  </p>
                </div>

                {/* 1. Vector Presets */}
                <div>
                  <label className="block text-xs font-bold mb-3 text-slate-200">
                    {isAr ? '1. نماذج الشعار الفيكتور (أشكال هندسية مستقيمة عالية الدقة والتباين):' : '1. Vector Brand Mark Presets:'}
                  </label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { id: 'modern-tb', nameAr: 'أوريجامي التكنولوجيا TB', nameEn: 'TB Origami Hexagon', descAr: 'هندسة مستقيمة تجمع T و B بسيان متوهج وزجاج تقني منير عالي التباين.' },
                      { id: 'security-shield', nameAr: 'درع الأمان والمراقبة', nameEn: 'Security & Aperture Shield', descAr: 'درع حماية سيبراني مع عدسة كاميرا ذكية ومسارات شبكية مترابطة.' },
                      { id: 'cyber-cube', nameAr: 'المكعب التكنولوجي 3D', nameEn: 'Cyber Isometric Cube', descAr: 'مكعب تقني يرمز لتكامل الأجهزة والبرمجيات وشبكات السيرفرات.' },
                    ].map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => handleConfigChange('logoEmblemStyle', preset.id as LogoEmblemStyle)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          config.logoEmblemStyle === preset.id && !config.customLogoUrl
                            ? isDark
                              ? 'bg-[#10233D] border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                              : 'bg-sky-50 border-[#0284C7] shadow-md ring-2 ring-[#0284C7]/20'
                            : isDark
                            ? 'bg-[#071120] border-white/10 hover:border-white/20'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="h-16 flex items-center justify-center mb-2">
                          <TechBokraLogo variant="icon" emblemStyle={preset.id as LogoEmblemStyle} size="md" theme={theme} />
                        </div>
                        <h5 className="text-xs font-bold text-white text-center">{isAr ? preset.nameAr : preset.nameEn}</h5>
                        <p className="text-[10px] text-slate-400 mt-1 text-center">{preset.descAr}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Custom Image Upload */}
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#071120]' : 'bg-slate-50'}`}>
                  <label className="block text-xs font-bold mb-3 text-slate-200">
                    {isAr ? '2. رفع صورة شعار مخصصة (Upload Custom Logo):' : '2. Upload Custom Image:'}
                  </label>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label 
                        htmlFor="dashboard-logo-upload"
                        className={`w-full py-6 px-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition text-center ${
                          isDark 
                            ? 'border-[#00F2FE]/40 hover:border-[#00F2FE] bg-[#10233D]/50 hover:bg-[#10233D]' 
                            : 'border-slate-300 hover:border-[#0284C7] bg-white hover:bg-slate-50'
                        }`}
                      >
                        <Upload className="w-6 h-6 text-[#00F2FE]" />
                        <span className="text-xs font-bold text-white">{isAr ? 'اضغط لاختيار صورة من جهازك' : 'Choose image file'}</span>
                        <span className="text-[10px] text-slate-400">PNG, SVG, JPG, WebP</span>
                      </label>
                      <input
                        id="dashboard-logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const dataUrl = event.target?.result as string;
                              handleConfigChange('customLogoUrl', dataUrl);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="block text-xs text-slate-300 mb-1">{isAr ? 'أو أدخل رابط الصورة المباشر:' : 'Direct Image URL:'}</span>
                        <input
                          type="url"
                          value={config.customLogoUrl}
                          onChange={(e) => handleConfigChange('customLogoUrl', e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="w-full bg-[#0B1A2F] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                        />
                      </div>

                      {config.customLogoUrl && (
                        <div className="pt-3 flex items-center justify-between">
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {isAr ? 'الصورة المخصصة مفعّلة' : 'Custom image active'}
                          </span>
                          <button
                            onClick={() => handleConfigChange('customLogoUrl', '')}
                            className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{isAr ? 'إزالة الصورة' : 'Remove Image'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Dual Theme Live Preview */}
                <div>
                  <label className="block text-xs font-bold mb-3 text-slate-200">
                    {isAr ? '3. معاينة حية فورية للشعار في كلا الوضعين:' : '3. Live Dual-Theme Preview:'}
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#071120] border border-[#00F2FE]/30">
                      <span className="text-[11px] font-bold text-slate-400 block mb-2">{isAr ? 'الوضع الليلي (Dark Mode)' : 'Dark Mode'}</span>
                      <TechBokraLogo size="md" theme="dark" lang={lang} emblemStyle={config.logoEmblemStyle} customImageUrl={config.customLogoUrl} />
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-md">
                      <span className="text-[11px] font-bold text-slate-700 block mb-2">{isAr ? 'الوضع الفاتح (Light Mode)' : 'Light Mode'}</span>
                      <TechBokraLogo size="md" theme="light" lang={lang} emblemStyle={config.logoEmblemStyle} customImageUrl={config.customLogoUrl} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CONTACTS & OPERATIONS */}
            {activeTab === 'contacts' && (
              <div className={`p-6 rounded-2xl border space-y-5 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'بيانات الاتصال ومقر العمل الرسمية' : 'Contact & Headquarters Settings'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'تحديث أرقام الواتساب، الخط الساخن، العنوان، وساعات العمل في كامل الموقع' : 'Update phone numbers, address, and SLA hours across the site'}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAr ? 'رقم الواتساب للاستقبال الفوري' : 'WhatsApp Number'}
                    </label>
                    <input
                      type="text"
                      value={config.whatsappNumber}
                      onChange={(e) => handleConfigChange('whatsappNumber', e.target.value)}
                      placeholder="201012345678"
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAr ? 'رقم الخط الساخن / المكالمات' : 'Hotline Phone'}
                    </label>
                    <input
                      type="text"
                      value={config.phone}
                      onChange={(e) => handleConfigChange('phone', e.target.value)}
                      placeholder="+20 101 234 5678"
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAr ? 'البريد الإلكتروني الرئيسي' : 'Primary Email'}
                    </label>
                    <input
                      type="email"
                      value={config.email}
                      onChange={(e) => handleConfigChange('email', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAr ? 'البريد الإلكتروني للمبيعات' : 'Sales Email'}
                    </label>
                    <input
                      type="email"
                      value={config.secondaryEmail}
                      onChange={(e) => handleConfigChange('secondaryEmail', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAr ? 'العنوان والمقر (عربي)' : 'Address (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={config.addressAr}
                      onChange={(e) => handleConfigChange('addressAr', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAr ? 'العنوان والمقر (إنجليزي)' : 'Address (English)'}
                    </label>
                    <input
                      type="text"
                      value={config.addressEn}
                      onChange={(e) => handleConfigChange('addressEn', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAr ? 'مواعيد العمل وخدمة الطوارئ' : 'Working Hours (Ar)'}
                    </label>
                    <input
                      type="text"
                      value={config.workingHoursAr}
                      onChange={(e) => handleConfigChange('workingHoursAr', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAr ? 'صفحة لينكد إن (LinkedIn URL)' : 'LinkedIn URL'}
                    </label>
                    <input
                      type="url"
                      value={config.linkedinUrl}
                      onChange={(e) => handleConfigChange('linkedinUrl', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. HERO & ANNOUNCEMENTS */}
            {activeTab === 'hero' && (
              <div className={`p-6 rounded-2xl border space-y-5 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'نصوص الهيدر وشريط الإعلانات' : 'Hero Headlines & Announcement Banner'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'تعديل شعار الهيدر والعناوين التسويقية الرئيسية' : 'Customize main marketing slogans and notification banners'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'شارة الهيدر العلوية (Badge)' : 'Hero Badge'}
                  </label>
                  <input
                    type="text"
                    value={config.heroBadgeAr}
                    onChange={(e) => handleConfigChange('heroBadgeAr', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAr ? 'السطر الأول من العنوان الرئيسي' : 'Headline Line 1'}
                    </label>
                    <input
                      type="text"
                      value={config.heroTitleLine1Ar}
                      onChange={(e) => handleConfigChange('heroTitleLine1Ar', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isAr ? 'السطر الثاني الملون بالنيون' : 'Headline Line 2 Glowing'}
                    </label>
                    <input
                      type="text"
                      value={config.heroTitleLine2Ar}
                      onChange={(e) => handleConfigChange('heroTitleLine2Ar', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-[#00F2FE] font-bold text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isAr ? 'فقرة الشرح الرئيسية في الهيدر' : 'Hero Subtitle'}
                  </label>
                  <textarea
                    rows={3}
                    value={config.heroSubAr}
                    onChange={(e) => handleConfigChange('heroSubAr', e.target.value)}
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none leading-relaxed"
                  />
                </div>

                {/* Announcement Banner */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-white">{isAr ? 'تفعيل شريط التنبيهات العلوي' : 'Top Banner Active'}</span>
                      <span className="text-[11px] text-slate-400">{isAr ? 'يظهر أعلى النافبار للإعلان عن المشروعات والعروض' : 'Announcement strip'}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showAnnouncement}
                      onChange={(e) => handleConfigChange('showAnnouncement', e.target.checked)}
                      className="w-5 h-5 accent-[#00F2FE] cursor-pointer"
                    />
                  </div>

                  {config.showAnnouncement && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'شارة الإعلان' : 'Banner Badge'}</label>
                        <input
                          type="text"
                          value={config.announcementBadgeAr}
                          onChange={(e) => handleConfigChange('announcementBadgeAr', e.target.value)}
                          className="w-full bg-[#071120] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-[#00F2FE] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'نص الإعلان' : 'Banner Text'}</label>
                        <input
                          type="text"
                          value={config.announcementTextAr}
                          onChange={(e) => handleConfigChange('announcementTextAr', e.target.value)}
                          className="w-full bg-[#071120] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-[#00F2FE] outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. PROJECTS PORTFOLIO */}
            {activeTab === 'projects' && (
              <div className={`p-6 rounded-2xl border space-y-5 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isAr ? 'سابقة الأعمال والمنصات الشقيقة' : 'Sister Platforms & Projects'}
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {isAr ? 'تعديل الروابط المباشرة لسابقة المشروعات والمنصات' : 'Manage live project demo links'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#071120] border border-white/10">
                    <label className="block text-xs font-bold text-white mb-1">
                      {isAr ? 'رابط منصة هليو بروبرتي العقارية (Helio Property)' : 'Helio Property URL'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={config.helioPropertyUrl}
                        onChange={(e) => handleConfigChange('helioPropertyUrl', e.target.value)}
                        className="flex-1 bg-[#0B1A2F] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                      />
                      <a
                        href={config.helioPropertyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-[#152C4D] text-[#00F2FE] hover:bg-[#00F2FE] hover:text-[#071120] transition flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#071120] border border-white/10">
                    <label className="block text-xs font-bold text-white mb-1">
                      {isAr ? 'رابط منصة الرحلة التفاعلية (Al-Rehla Platform)' : 'Al-Rehla URL'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={config.alrehlaUrl}
                        onChange={(e) => handleConfigChange('alrehlaUrl', e.target.value)}
                        className="flex-1 bg-[#0B1A2F] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                      />
                      <a
                        href={config.alrehlaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-[#152C4D] text-[#00F2FE] hover:bg-[#00F2FE] hover:text-[#071120] transition flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. VERCEL DEPLOYMENT & CLOUD GUIDE */}
            {activeTab === 'vercel' && (
              <div className={`p-6 rounded-2xl border space-y-6 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'دليل النشر والاستضافة على Vercel و Firebase' : 'Vercel Deployment & Cloud Guide'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'إجابة كاملة وواضحة: هل تحتاج لتعديل أي إعداد في Vercel؟' : 'Clear deployment guide for Vercel'}
                  </p>
                </div>

                {/* Direct Answer Callout */}
                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#00F2FE]/10 border-[#00F2FE]/30' : 'bg-sky-50 border-sky-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[#00F2FE] shrink-0 mt-0.5" />
                    <div className="space-y-2 text-xs leading-relaxed">
                      <h4 className="text-sm font-bold text-white">
                        {isAr ? 'الإجابة المباشرة: هل تحتاج لإضافة أي شيء في Vercel؟' : 'Do you need to add anything in Vercel?'}
                      </h4>
                      <p className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                        {isAr
                          ? '1. في إعدادات Vercel نفسها (Environment Variables): لا تحتاج لإضافة أي مفاتيح أو تعديلات إضافية! ملف تكوين Firebase مدمج ومبني تلقائياً داخل الكود.'
                          : '1. In Vercel Environment Variables: No extra environment variables needed. Firebase client configuration is bundled within the build.'}
                      </p>
                      <p className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                        {isAr
                          ? '2. الخطوة الوحيدة المهمة (في Firebase Console): للسماح بتسجيل الدخول بـ Google على رابط موقعك في Vercel، يجب إضافة دومين Vercel إلى النطاقات المصرح بها (Authorized Domains).'
                          : '2. The only step required in Firebase Console: Add your Vercel URL to Authorized Domains for Google Sign-In.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step-by-step instructions */}
                <div className="space-y-4 text-xs">
                  <h4 className="text-sm font-bold text-white">{isAr ? 'خطوات تفعيل نطاق Vercel في دقيقة واحدة:' : 'Steps to authorize Vercel domain in 1 minute:'}</h4>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-1">
                      <span className="w-6 h-6 rounded-full bg-[#00F2FE] text-[#071120] font-bold flex items-center justify-center text-xs mb-2">1</span>
                      <h5 className="font-bold text-white">{isAr ? 'افتح Firebase Console' : 'Open Firebase'}</h5>
                      <p className="text-[11px] text-slate-400">
                        {isAr ? 'ادخل على مشروع eng-inverter-8jmtp ثم اختر Authentication' : 'Go to project eng-inverter-8jmtp -> Authentication'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-1">
                      <span className="w-6 h-6 rounded-full bg-[#00F2FE] text-[#071120] font-bold flex items-center justify-center text-xs mb-2">2</span>
                      <h5 className="font-bold text-white">{isAr ? 'تبويب Settings' : 'Settings Tab'}</h5>
                      <p className="text-[11px] text-slate-400">
                        {isAr ? 'اختر تبويب Settings ثم انزل لقسم Authorized Domains' : 'Select Settings -> Authorized Domains'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-1">
                      <span className="w-6 h-6 rounded-full bg-[#00F2FE] text-[#071120] font-bold flex items-center justify-center text-xs mb-2">3</span>
                      <h5 className="font-bold text-white">{isAr ? 'إضافة الدومين' : 'Add Domain'}</h5>
                      <p className="text-[11px] text-slate-400">
                        {isAr ? 'اضغط Add Domain واكتب دومين فيرسيل (مثال: tech-bokra.vercel.app)' : 'Click Add Domain and paste your Vercel URL'}
                      </p>
                    </div>
                  </div>

                  {/* Direct Link to Firebase Settings */}
                  <div className="pt-2">
                    <a
                      href="https://console.firebase.google.com/project/eng-inverter-8jmtp/authentication/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-bold text-xs transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{isAr ? 'فتح إعدادات النطاقات في Firebase Console مباشرة' : 'Open Firebase Authorized Domains Settings'}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
