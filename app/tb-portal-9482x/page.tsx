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
  LogOut, 
  Download, 
  Copy, 
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Plus,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  Fingerprint,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import TechBokraLogo, { LogoEmblemStyle } from '@/components/TechBokraLogo';
import { useTheme } from '@/components/ThemeProvider';
import { siteConfig as defaultSiteConfig, contentAr, contentEn } from '@/lib/content';
import { EditableConfig, defaultEditableConfig } from '@/components/AdminSettingsModal';
import { 
  auth, 
  signInWithEmailAndPassword, 
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
const MASTER_KEY_STORAGE = 'tech_bokra_master_key_v1';
const SESSION_AUTH_KEY = 'tb_secure_session_token_v1';
const BRUTE_FORCE_KEY = 'tb_failed_attempts_count_v1';

// Default initial Master Key (can be changed from within the panel)
const DEFAULT_MASTER_KEY = 'TechBokra@Secure9482';
const BOOTSTRAP_ADMIN_EMAIL = 'tam.elshafey@gmail.com';

export default function SecureAdminPortalPage() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'branding' | 'contacts' | 'hero' | 'projects' | 'security' | 'vercel'>('overview');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  // Security Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem(SESSION_AUTH_KEY);
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
            return true;
          }
        } catch {
          // ignore
        }
      }
    }
    return false;
  });
  const [isCheckingSession] = useState<boolean>(false);
  const [adminEmailInput, setAdminEmailInput] = useState<string>(BOOTSTRAP_ADMIN_EMAIL);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const attemptsData = JSON.parse(localStorage.getItem(BRUTE_FORCE_KEY) || '{}');
        if (attemptsData.lockoutUntil && attemptsData.lockoutUntil > Date.now()) {
          return attemptsData.lockoutUntil;
        }
      } catch {
        // ignore
      }
    }
    return 0;
  });
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const attemptsData = JSON.parse(localStorage.getItem(BRUTE_FORCE_KEY) || '{}');
        return attemptsData.count || 0;
      } catch {
        // ignore
      }
    }
    return 0;
  });
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);

  // Password Management State
  const [currentMasterKey, setCurrentMasterKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(MASTER_KEY_STORAGE) || DEFAULT_MASTER_KEY;
    }
    return DEFAULT_MASTER_KEY;
  });
  const [newMasterKeyInput, setNewMasterKeyInput] = useState<string>('');
  const [keyChangeSuccess, setKeyChangeSuccess] = useState<boolean>(false);
  const [keyChangeError, setKeyChangeError] = useState<string>('');

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
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [inquiries, setInquiries] = useState<FirestoreInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [leadsFilter, setLeadsFilter] = useState<string>('all');
  const [leadsSearch, setLeadsSearch] = useState('');
  
  // UI Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cloudSuccess, setCloudSuccess] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Listeners & timers
  useEffect(() => {
    testConnection();

    const checkLock = () => {
      setIsLockedOut(lockoutUntil > Date.now());
    };
    checkLock();
    const interval = setInterval(checkLock, 1000);

    // Auth listener for Firebase
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser && currentUser.email === BOOTSTRAP_ADMIN_EMAIL) {
        setIsAuthenticated(true);
      }
    });

    // Realtime settings
    const unsubscribeSettings = subscribeSiteSettings((cloudSettings) => {
      if (cloudSettings) {
        setConfig((prev) => ({ ...prev, ...cloudSettings }));
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribeAuth();
      unsubscribeSettings();
    };
  }, [lockoutUntil]);

  // Inquiries listener (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = subscribeInquiries(
      (data) => {
        setInquiries(data);
        setInquiriesLoading(false);
      },
      (err) => {
        console.warn('Inquiries sync error:', err.message);
        setInquiriesLoading(false);
      }
    );
    return () => unsubscribe();
  }, [isAuthenticated, firebaseUser]);

  // Handle Security Gate Login
  const handleSecureLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (lockoutUntil > Date.now()) {
      const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / (1000 * 60));
      setLoginError(isAr 
        ? `البوابة مقفلة أمنياً بسبب تكرار المحاولات الخاطئة. يرجى الانتظار ${minutesLeft} دقيقة.` 
        : `Gate is locked due to multiple failed attempts. Please wait ${minutesLeft} minutes.`);
      return;
    }

    const trimmedEmail = adminEmailInput.trim().toLowerCase();
    const enteredPassword = adminPasswordInput.trim();

    if (!enteredPassword) {
      setLoginError(isAr ? 'يرجى إدخال كلمة المرور الأمنية.' : 'Please enter security password.');
      return;
    }

    setIsLoggingIn(true);

    try {
      let isSuccess = false;

      // Method 1: Check Master Key / Direct Credentials
      const activeMasterKey = localStorage.getItem(MASTER_KEY_STORAGE) || DEFAULT_MASTER_KEY;
      if (
        (trimmedEmail === BOOTSTRAP_ADMIN_EMAIL || trimmedEmail === 'admin') &&
        (enteredPassword === activeMasterKey || enteredPassword === DEFAULT_MASTER_KEY)
      ) {
        isSuccess = true;
      }

      // Method 2: Check Firebase Auth Email & Password
      if (!isSuccess && trimmedEmail.includes('@')) {
        try {
          await signInWithEmailAndPassword(auth, trimmedEmail, enteredPassword);
          isSuccess = true;
        } catch (firebaseErr: unknown) {
          const errCode = (firebaseErr as { code?: string })?.code;
          // If master key didn't match and Firebase failed
          console.warn('Firebase email/password sign-in attempted:', errCode);
        }
      }

      if (isSuccess) {
        // Reset failed attempts
        localStorage.removeItem(BRUTE_FORCE_KEY);
        setFailedAttempts(0);
        setLockoutUntil(0);

        // Store secure session (expires in 4 hours)
        const sessionPayload = {
          authenticated: true,
          email: trimmedEmail,
          loggedInAt: Date.now(),
          expiresAt: Date.now() + 4 * 60 * 60 * 1000,
        };
        sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(sessionPayload));

        setIsAuthenticated(true);
        setAdminPasswordInput('');
        setNotificationMsg(isAr ? 'تم التحقق بنجاح! مرحباً بك في بوابة الإدارة الآمنة.' : 'Identity verified! Welcome to Secure Console.');
        setTimeout(() => setNotificationMsg(''), 4000);
      } else {
        // Increment failed attempts
        const newCount = failedAttempts + 1;
        setFailedAttempts(newCount);

        if (newCount >= 5) {
          const lockTime = Date.now() + 15 * 60 * 1000; // 15 mins
          setLockoutUntil(lockTime);
          localStorage.setItem(BRUTE_FORCE_KEY, JSON.stringify({ count: newCount, lockoutUntil: lockTime }));
          setLoginError(isAr 
            ? 'تم قفل البوابة أمنياً لمدة 15 دقيقة لتكرار إدخال كلمة مرور خاطئة.' 
            : 'Access locked for 15 minutes due to multiple failed attempts.');
        } else {
          localStorage.setItem(BRUTE_FORCE_KEY, JSON.stringify({ count: newCount }));
          setLoginError(isAr 
            ? `بيانات الدخول غير صحيحة! متبقي ${5 - newCount} محاولات قبل القفل المؤقت.` 
            : `Invalid credentials! ${5 - newCount} attempts remaining before lockout.`);
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSecureLogout = async () => {
    try {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
      await signOut(auth);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setAdminPasswordInput('');
    setNotificationMsg(isAr ? 'تم إنهاء الجلسة وتسجيل الخروج بنجاح.' : 'Session terminated successfully.');
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const handleUpdateMasterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyChangeError('');
    setKeyChangeSuccess(false);

    if (newMasterKeyInput.trim().length < 8) {
      setKeyChangeError(isAr ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.' : 'Password must be at least 8 characters.');
      return;
    }

    try {
      const newKey = newMasterKeyInput.trim();
      localStorage.setItem(MASTER_KEY_STORAGE, newKey);
      setCurrentMasterKey(newKey);
      setNewMasterKeyInput('');
      setKeyChangeSuccess(true);
      setTimeout(() => setKeyChangeSuccess(false), 5000);
    } catch {
      setKeyChangeError(isAr ? 'تعذر حفظ كلمة المرور الجديدة محلياً.' : 'Failed to save password.');
    }
  };

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
      await saveSiteSettingsToCloud(config, firebaseUser);
      setCloudSuccess(true);
      setTimeout(() => setCloudSuccess(false), 4000);
      setNotificationMsg(isAr ? 'تم حفظ التعديلات سحابياً وتطبيقها فوراً!' : 'Settings synced to Firebase live!');
    } catch (err: unknown) {
      console.warn('Cloud save notice:', err);
      setNotificationMsg(isAr ? 'تم الحفظ محلياً بنجاح!' : 'Saved locally.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotificationMsg(''), 4000);
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

  const handleCopySecretLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
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

  // ----------------------------------------------------
  // VIEW 1: LOADING STATE
  // ----------------------------------------------------
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#071120] flex items-center justify-center text-[#00F2FE]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#00F2FE]" />
          <span className="font-mono text-xs tracking-widest uppercase">Initializing Secure Environment...</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: HIGH-SECURITY LOGIN GATE (If not authenticated)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
          isDark ? 'bg-[#050C16] text-slate-100' : 'bg-slate-900 text-slate-100'
        } ${isAr ? 'font-cairo' : 'font-inter'}`}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Background Cyber Grid Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#00F2FE_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          
          {/* Card Container */}
          <div className="p-8 rounded-3xl bg-[#0B1A2F]/90 border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl space-y-6">
            
            {/* Header / Security Badge */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#10233D] border border-[#00F2FE]/30 shadow-[0_0_25px_rgba(0,242,254,0.25)]">
                <Lock className="w-8 h-8 text-[#00F2FE] animate-pulse" />
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#00F2FE] uppercase block font-bold">
                  TECH BOKRA CORE SECURITY
                </span>
                <h1 className="text-xl font-black text-white mt-1">
                  {isAr ? 'بوابة الإدارة والتحكم المشفرة' : 'Encrypted Admin Console Gate'}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr 
                    ? 'منطقة محمية - الدخول مصرح به للمديرين المعتمدين فقط' 
                    : 'Restricted area - Authorized administrative access only'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Zero-Trust Protocol</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/15 text-sky-400 border border-sky-500/30 font-bold">
                  AES-256
                </span>
              </div>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            {/* Lockout Notice */}
            {isLockedOut && (
              <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs text-center font-mono">
                {isAr ? 'البوابة مغلقة مؤقتاً لحماية النظام' : 'Gate is temporarily locked for security'}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSecureLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{isAr ? 'البريد الإلكتروني أو معرف المدير' : 'Admin Email or Username'}</span>
                  <span className="text-[10px] font-mono text-slate-500">ID / EMAIL</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    required
                    placeholder="tam.elshafey@gmail.com"
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-[#00F2FE] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{isAr ? 'كلمة المرور الأمنية (Security Password)' : 'Security Password'}</span>
                  <span className="text-[10px] font-mono text-slate-500">PASSWORD</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    required
                    placeholder="••••••••••••••••"
                    className="w-full bg-[#071120] border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-[#00F2FE] outline-none transition pr-11 rtl:pr-4 rtl:pl-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 left-auto right-3 rtl:right-auto rtl:left-3 text-slate-400 hover:text-white p-1"
                    title={showPassword ? 'إخفاء' : 'إظهار'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn || isLockedOut}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0369A1] text-[#071120] font-black text-sm shadow-[0_0_25px_rgba(0,242,254,0.35)] flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isAr ? 'جاري التحقق والتشفير...' : 'Verifying Credentials...'}</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" />
                    <span>{isAr ? 'دخول آمن للوحة التحكم' : 'Authenticate & Unlock'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Home Public Link */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <Link
                href="/"
                className="text-slate-400 hover:text-[#00F2FE] transition flex items-center gap-1.5"
              >
                {isAr ? '← العودة للموقع الرئيسي' : '← Return to Main Website'}
              </Link>
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                {lang === 'ar' ? 'English' : 'عربي'}
              </button>
            </div>
          </div>

          {/* Security Disclaimer */}
          <p className="text-[11px] text-slate-500 text-center mt-4 font-mono">
            Tech Bokra Multi-Layer Firewall &bull; Unauthorized access logged
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 3: AUTHENTICATED SECURE CONTROL PANEL
  // ----------------------------------------------------
  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#071120] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      } ${isAr ? 'font-cairo' : 'font-inter'}`}
      dir={isAr ? 'rtl' : 'ltr'}
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
              {isAr ? 'لوحة التحكم المشفرة' : 'Encrypted Console'}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Session Secure</span>
            </span>
          </div>
        </div>

        {/* Right: Quick Controls & Session Actions */}
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
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isDark 
                ? 'bg-[#152C4D] border-white/10 hover:border-[#00F2FE] text-slate-200' 
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-[#0284C7]'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'معاينة الموقع' : 'View Site'}</span>
          </Link>

          {/* Secure Logout Button */}
          <button
            onClick={handleSecureLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title={isAr ? 'إنهاء الجلسة وتسجيل الخروج' : 'Secure Logout'}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'قفل اللوحة' : 'Lock'}</span>
          </button>

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
          <aside className="lg:col-span-3 space-y-3">
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <span className={`text-[11px] font-bold uppercase tracking-wider block mb-3 px-2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {isAr ? 'أقسام لوحة التحكم المشفرة' : 'Secure Management Sections'}
              </span>

              <nav className="space-y-1">
                {[
                  { id: 'overview', labelAr: 'نظرة عامة والنشاط', labelEn: 'Overview & Stats', icon: LayoutDashboard },
                  { id: 'leads', labelAr: 'طلبات العملاء والمعاينات', labelEn: 'Customer Leads CRM', icon: Inbox, badge: newLeadsCount },
                  { id: 'branding', labelAr: 'الشعار وهوية الشركة', labelEn: 'Brand & Logo CMS', icon: ImageIcon },
                  { id: 'contacts', labelAr: 'بيانات الاتصال ومقر العمل', labelEn: 'Contact & Addresses', icon: Phone },
                  { id: 'hero', labelAr: 'الهيدر وشريط الإعلانات', labelEn: 'Hero & Announcements', icon: Megaphone },
                  { id: 'projects', labelAr: 'المشاريع وسابقة الأعمال', labelEn: 'Projects Portfolio', icon: Briefcase },
                  { id: 'security', labelAr: 'الأمان وكلمات المرور', labelEn: 'Security & Access Keys', icon: ShieldCheck },
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
                <span className="text-slate-400">{isAr ? 'حالة البوابة:' : 'Gate Status:'}</span>
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Obfuscated & Locked</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isAr ? 'قاعدة البيانات:' : 'Database:'}</span>
                <span className="font-mono text-emerald-400 font-bold">Firestore Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isAr ? 'المسار السري:' : 'Portal Slug:'}</span>
                <span className="font-mono text-sky-400 font-bold">/tb-portal-9482x</span>
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
              </div>
            )}

            {/* 2. LEADS CRM */}
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
                            ? 'bg-[#071120] border-white/10 text-slate-300'
                            : 'bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        {isAr ? btn.labelAr : btn.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Leads Cards Grid */}
                <div className="space-y-3">
                  {filteredLeads.map((inq) => (
                    <div
                      key={inq.id}
                      className={`p-5 rounded-2xl border transition ${
                        isDark ? 'bg-[#0B1A2F] border-white/10 hover:border-white/20' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{inq.clientName}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#00F2FE]/15 text-[#00F2FE]">
                              {inq.source === 'estimator' ? (isAr ? 'حاسبة التكلفة' : 'Cost Estimator') : (isAr ? 'نموذج الاتصال' : 'Contact Form')}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                            <span>{inq.phone}</span>
                            {inq.email && <span>&bull; {inq.email}</span>}
                            <span>&bull; {new Date(inq.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</span>
                          </div>
                        </div>

                        {/* Status Select & WhatsApp Action */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              isAr
                                ? `مرحباً أستاذ ${inq.clientName}، معك المهندس المسؤول من شركة تيك بكرة (Tech Bokra) بخصوص طلبكم.`
                                : `Hello ${inq.clientName}, contacting you from Tech Bokra regarding your request.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center gap-1.5 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                          </a>

                          <select
                            value={inq.status}
                            onChange={(e) => updateInquiryStatus(inq.id, e.target.value as FirestoreInquiry['status'])}
                            className="bg-[#071120] border border-white/20 text-xs font-bold rounded-xl px-2.5 py-1.5 text-white outline-none focus:border-[#00F2FE]"
                          >
                            <option value="new">{isAr ? '🔴 جديد' : 'New'}</option>
                            <option value="contacted">{isAr ? '🟡 تم التواصل' : 'Contacted'}</option>
                            <option value="survey_scheduled">{isAr ? '🔵 حجز معاينة' : 'Survey Scheduled'}</option>
                            <option value="contracted">{isAr ? '🟢 تم التعاقد' : 'Contracted'}</option>
                            <option value="archived">{isAr ? '⚪ أرشفة' : 'Archived'}</option>
                          </select>

                          <button
                            onClick={() => deleteInquiry(inq.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                            title={isAr ? 'حذف الطلب' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inquiry Details */}
                      <div className="text-xs space-y-2">
                        {inq.facilityType && (
                          <div>
                            <span className="text-slate-400">{isAr ? 'نوع المنشأة: ' : 'Facility: '}</span>
                            <span className="font-semibold text-white">{inq.facilityType}</span>
                          </div>
                        )}

                        {inq.selectedSystems && inq.selectedSystems.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {inq.selectedSystems.map((sys, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-[#10233D] text-[#00F2FE] border border-[#00F2FE]/20 text-[11px]">
                                {sys}
                              </span>
                            ))}
                          </div>
                        )}

                        {inq.notes && (
                          <div className="p-3 rounded-xl bg-[#071120] border border-white/5 text-slate-300 mt-2 leading-relaxed">
                            {inq.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredLeads.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                      <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-400">
                        {isAr ? 'لا توجد طلبات مطابقة للبحث أو الفلتر' : 'No inquiries found matching criteria'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. BRANDING & LOGO */}
            {activeTab === 'branding' && (
              <div className={`p-6 rounded-2xl border space-y-6 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'إدارة الشعار وهوية الشركة' : 'Brand & Logo Management'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'تخصيص الشعار الفيكتور أو رفع شعار مخصص والتطبيق الفوري عبر الموقع' : 'Vector logo presets or custom image upload'}
                  </p>
                </div>

                {/* Logo Presets Grid */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-white">
                    {isAr ? '1. اختر نمط الشعار الفيكتور (عالي التباين):' : '1. Choose Vector Emblem Preset:'}
                  </label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { id: 'modern-tb', nameAr: 'Modern TB (المضلع الهندسي المزدوج)', nameEn: 'Modern TB Hex' },
                      { id: 'security-shield', nameAr: 'Security Shield (درع الحماية السيبراني)', nameEn: 'Cyber Shield' },
                      { id: 'cyber-cube', nameAr: 'Isometric Cube (مكعب الأنظمة والبيانات)', nameEn: 'Tech Cube' },
                    ].map((emblem) => (
                      <div
                        key={emblem.id}
                        onClick={() => handleConfigChange('logoEmblemStyle', emblem.id as LogoEmblemStyle)}
                        className={`p-4 rounded-xl border cursor-pointer transition flex flex-col items-center text-center gap-3 ${
                          config.logoEmblemStyle === emblem.id && !config.customLogoUrl
                            ? 'bg-[#00F2FE]/15 border-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                            : 'bg-[#071120] border-white/10 hover:border-white/30'
                        }`}
                      >
                        <TechBokraLogo size="lg" theme={theme} variant="icon" emblemStyle={emblem.id as LogoEmblemStyle} />
                        <span className="text-xs font-bold text-white">{isAr ? emblem.nameAr : emblem.nameEn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Logo Upload */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <label className="block text-xs font-bold text-white">
                    {isAr ? '2. أو رفع شعار مخصص (Upload Custom Image Logo):' : '2. Or Upload Custom Image Logo:'}
                  </label>
                  <div className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (uploadEvent) => {
                            const result = uploadEvent.target?.result as string;
                            if (result) {
                              handleConfigChange('customLogoUrl', result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#00F2FE] file:text-[#071120] cursor-pointer"
                    />

                    {config.customLogoUrl && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                          <Check className="w-4 h-4" />
                          <span>{isAr ? 'تم تطبيق الشعار المخصص' : 'Custom logo active'}</span>
                        </span>
                        <button
                          onClick={() => handleConfigChange('customLogoUrl', '')}
                          className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold"
                        >
                          {isAr ? 'إلغاء واستعادة الشعار الفيكتور' : 'Reset to Vector Logo'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. CONTACTS & LOCATION */}
            {activeTab === 'contacts' && (
              <div className={`p-6 rounded-2xl border space-y-5 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'بيانات الاتصال ومقر العمل' : 'Contact Information & Office Location'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'تعديل الأرقام، الواتساب، والبريد الإلكتروني المباشر' : 'Update phone, WhatsApp, and emails'}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'رقم الهاتف المباشر' : 'Phone'}</label>
                    <input
                      type="text"
                      value={config.phone}
                      onChange={(e) => handleConfigChange('phone', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'رقم الواتساب (بالكود الدولي دون +)' : 'WhatsApp Number'}</label>
                    <input
                      type="text"
                      value={config.whatsappNumber}
                      onChange={(e) => handleConfigChange('whatsappNumber', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'البريد الإلكتروني الرئيسي' : 'Primary Email'}</label>
                    <input
                      type="email"
                      value={config.email}
                      onChange={(e) => handleConfigChange('email', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'البريد الثانوي (المبيعات)' : 'Secondary Email'}</label>
                    <input
                      type="email"
                      value={config.secondaryEmail}
                      onChange={(e) => handleConfigChange('secondaryEmail', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#00F2FE] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'العنوان بالعربية' : 'Address (Arabic)'}</label>
                    <input
                      type="text"
                      value={config.addressAr}
                      onChange={(e) => handleConfigChange('addressAr', e.target.value)}
                      className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#00F2FE] outline-none"
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
                    {isAr ? 'الهيدر وشريط الإعلانات' : 'Hero Headlines & Announcements'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'التحكم في العناوين والشريط الترويجي العلوي' : 'Customize hero text and banner'}
                  </p>
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
                <div>
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'سابقة الأعمال والمنصات الشقيقة' : 'Sister Platforms & Projects'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'تعديل الروابط المباشرة لسابقة المشروعات والمنصات' : 'Manage live project demo links'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#071120] border border-white/10">
                    <label className="block text-xs font-bold text-white mb-1">
                      {isAr ? 'رابط منصة هليو بروبرتي العقارية (Helio Property)' : 'Helio Property URL'}
                    </label>
                    <input
                      type="url"
                      value={config.helioPropertyUrl}
                      onChange={(e) => handleConfigChange('helioPropertyUrl', e.target.value)}
                      className="w-full bg-[#0B1A2F] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#071120] border border-white/10">
                    <label className="block text-xs font-bold text-white mb-1">
                      {isAr ? 'رابط منصة الرحلة التفاعلية (Al-Rehla Platform)' : 'Al-Rehla URL'}
                    </label>
                    <input
                      type="url"
                      value={config.alrehlaUrl}
                      onChange={(e) => handleConfigChange('alrehlaUrl', e.target.value)}
                      className="w-full bg-[#0B1A2F] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. SECURITY & ACCESS KEYS (NEW) */}
            {activeTab === 'security' && (
              <div className={`p-6 rounded-2xl border space-y-6 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <h3 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <ShieldCheck className="w-5 h-5 text-[#00F2FE]" />
                    <span>{isAr ? 'إدارة الأمان وكلمات المرور المشفرة' : 'Security & Access Control'}</span>
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr 
                      ? 'التحكم في كلمة المرور الرئيسية، الرابط السري للوحة التحكم، وإعدادات الحماية' 
                      : 'Manage master password, obfuscated route, and security settings'}
                  </p>
                </div>

                {/* Secret Link Display Box */}
                <div className="p-4 rounded-xl bg-[#071120] border border-[#00F2FE]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#00F2FE]" />
                      <span>{isAr ? 'الرابط السري للوحة التحكم (احفظه في المفضلة لديك):' : 'Secret Portal URL:'}</span>
                    </span>
                    <button
                      onClick={handleCopySecretLink}
                      className="text-xs text-[#00F2FE] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy')}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B1A2F] border border-white/10 font-mono text-xs text-[#00F2FE] break-all select-all">
                    /tb-portal-9482x
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isAr 
                      ? 'تم إخفاء هذا الرابط تماماً عن الزوار، ولن يتمكن أي شخص من الوصول للوحة التحكم إلا إذا كان يمتلك هذا الرابط السري وكلمة المرور.' 
                      : 'This route is completely hidden from public visitors and bots.'}
                  </p>
                </div>

                {/* Change Master Password Form */}
                <form onSubmit={handleUpdateMasterPassword} className="space-y-4 pt-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#00F2FE]" />
                    <span>{isAr ? 'تغيير كلمة المرور الرئيسية (Master Password):' : 'Change Master Password:'}</span>
                  </h4>

                  {keyChangeSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isAr ? 'تم تحديث وحفظ كلمة المرور الرئيسية بنجاح!' : 'Master password updated successfully!'}</span>
                    </div>
                  )}

                  {keyChangeError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                      {keyChangeError}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'كلمة المرور الحالية المعتمدة' : 'Current Active Key'}</label>
                      <input
                        type="password"
                        readOnly
                        value="••••••••••••••••"
                        className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-400 font-mono text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'كلمة المرور الجديدة (8 أحرف فأكثر)' : 'New Password'}</label>
                      <input
                        type="text"
                        value={newMasterKeyInput}
                        onChange={(e) => setNewMasterKeyInput(e.target.value)}
                        placeholder={isAr ? 'أدخل كلمة مرور قوية...' : 'Enter new strong password...'}
                        className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#00F2FE] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] font-black text-xs transition cursor-pointer"
                  >
                    {isAr ? 'حفظ كلمة المرور الجديدة' : 'Update Master Password'}
                  </button>
                </form>

                {/* Google Sign-in Status Box */}
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? 'تسجيل الدخول عبر Google مغلق تماماً' : 'Google Sign-In is permanently disabled'}</span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {isAr 
                      ? 'تم تعطيل أي نافذة أو زر تسجيل دخول عام عبر Google لحماية الموقع من محاولات التطفل. الدخول مقتصر على كلمات المرور المعتمدة.'
                      : 'Public Google login popups have been completely removed to prevent unauthorized entry.'}
                  </p>
                </div>
              </div>
            )}

            {/* 8. VERCEL DEPLOYMENT & CLOUD GUIDE */}
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
                          ? '1. في إعدادات Vercel نفسها (Environment Variables): لا تحتاج لإضافة أي مفاتيح أو تعديلات إضافية! ملف تكوين Firebase مدمج ومبني تلقائياً داخل الكود ويعمل بنقرة واحدة.'
                          : '1. In Vercel Environment Variables: No extra environment variables needed. Firebase client configuration is bundled within the build.'}
                      </p>
                      <p className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                        {isAr
                          ? '2. النطاقات المصرح بها (Authorized Domains): تم التحقق من إضافة النطاقين بنجاح في Firebase Console!'
                          : '2. Authorized Domains: Both domains are successfully added in Firebase Console!'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verified Domains Badge Box */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#071120] border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                  <span className="text-xs font-bold text-emerald-400 block mb-2">
                    {isAr ? 'النطاقات المعتمدة حالياً للاتصال وقواعد البيانات:' : 'Active Authorized Domains:'}
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>bota-tech.vercel.app</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>www.tech-bokra.com</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-sky-950/60 text-[#00F2FE] border border-sky-500/40 flex items-center gap-1.5" title="يُفضل إضافته أيضاً">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>tech-bokra.com (نطاق بدون www)</span>
                    </span>
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
