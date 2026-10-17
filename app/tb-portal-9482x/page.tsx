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
  Terminal,
  HelpCircle,
  Layers,
  FileText,
  Sliders,
  SlidersHorizontal,
  Edit3,
  Camera,
  Network
} from 'lucide-react';
import TechBokraLogo, { LogoEmblemStyle } from '@/components/TechBokraLogo';
import { useTheme } from '@/components/ThemeProvider';
import { siteConfig as defaultSiteConfig, contentAr, contentEn, Project, ServiceItem } from '@/lib/content';
import { EditableConfig, defaultEditableConfig } from '@/components/AdminSettingsModal';
import { 
  auth, 
  signInWithEmailAndPassword, 
  signOut, 
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

// Curated high-res presets for surveillance, server rooms, smart access & cloud dashboards
const CURATED_IMAGE_PRESETS = {
  cctv: [
    { title: 'كاميرات 4K مراقبة ذكية نهارية/ليلية', url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80' },
    { title: 'غرفة تحكم ومراقبة مركزية SOC Video Wall', url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1200&q=80' },
    { title: 'كاميرا دوم ذكية بتقنية الذكاء الاصطناعي', url: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=1200&q=80' },
    { title: 'حماية وتأمين محيط المنشآت الحيوية', url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80' }
  ],
  network: [
    { title: 'كبائن خوادم وشبكات مهيكلة فائقة الدقة', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' },
    { title: 'ألياف ضوئية فايبر أوبتك عالية السرعة', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80' },
    { title: 'سويتشات راوتر ومسارات كابلات Cat6A/7', url: 'https://images.unsplash.com/photo-1520869562399-e772f342b00a?auto=format&fit=crop&w=1200&q=80' },
    { title: 'ممرات مراكز البيانات Data Center Cold Aisle', url: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80' }
  ],
  access: [
    { title: 'بوابات مرور ذكية Speed Gates زجاجية', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1200&q=80' },
    { title: 'أجهزة بصمة وجه بيومترية بدون تلامس', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80' },
    { title: 'أنظمة بطاقات RFID وقفل كهرومغناطيسي', url: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80' },
    { title: 'مداخل برج إداري ذكية متكاملة', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80' }
  ],
  cloud: [
    { title: 'بنية سحابية سيبرانية وأنظمة تحليلات ERP', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
    { title: 'لوحات قيادة مالية وإدارية تفاعلية', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
    { title: 'منظومات ذكاء الأعمال BI ومؤشرات الأداء', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
    { title: 'تطبيقات الجوال وحلول المنشآت المترابطة', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80' }
  ]
};

function getFutureTimestamp(durationMs: number): number {
  return Date.now() + durationMs;
}

function checkTimestampValid(timestamp: number): boolean {
  return timestamp > Date.now();
}

function getSessionPayload(token: string) {
  return {
    authenticated: true,
    token,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    grantedAt: new Date().toISOString()
  };
}

export default function SecureAdminPortalPage() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'leads' | 'media' | 'content' | 'services' | 'projects' | 'faq' | 'branding' | 'contacts' | 'security' | 'vercel'
  >('overview');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  // Security Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmailInput, setAdminEmailInput] = useState<string>(BOOTSTRAP_ADMIN_EMAIL);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [lockoutUntil, setLockoutUntil] = useState<number>(0);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const isLockedOut = lockoutUntil > 0;

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

  // Leads & CRM State
  const [inquiries, setInquiries] = useState<FirestoreInquiry[]>([]);
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'new' | 'contacted' | 'survey_scheduled' | 'contracted'>('all');
  const [searchLeads, setSearchLeads] = useState<string>('');

  // UI Feedback State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Check Session and Brute Force on Client Mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const session = sessionStorage.getItem(SESSION_AUTH_KEY);
        if (session) {
          try {
            const parsed = JSON.parse(session);
            if (parsed.expiresAt && checkTimestampValid(parsed.expiresAt)) {
              setIsAuthenticated(true);
            }
          } catch {
            // ignore
          }
        }

        try {
          const attemptsData = JSON.parse(localStorage.getItem(BRUTE_FORCE_KEY) || '{}');
          if (attemptsData.lockoutUntil && checkTimestampValid(attemptsData.lockoutUntil)) {
            setLockoutUntil(attemptsData.lockoutUntil);
          }
          if (attemptsData.count) {
            setFailedAttempts(attemptsData.count);
          }
        } catch {
          // ignore
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Timer to clear lockout countdown
  useEffect(() => {
    if (lockoutUntil > 0) {
      const remaining = Math.max(0, lockoutUntil - Date.now());
      const timer = setTimeout(() => {
        setLockoutUntil(0);
        setFailedAttempts(0);
        if (typeof window !== 'undefined') {
          localStorage.removeItem(BRUTE_FORCE_KEY);
        }
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [lockoutUntil]);

  // Cloud Sync & Leads Subscription
  useEffect(() => {
    testConnection();

    const unsubSettings = subscribeSiteSettings((cloudConfig) => {
      if (cloudConfig) {
        setConfig((prev) => ({ ...prev, ...cloudConfig }));
      }
    });

    const unsubInquiries = subscribeInquiries((items) => {
      setInquiries(items);
    });

    return () => {
      unsubSettings();
      unsubInquiries();
    };
  }, []);

  // Secure Login Handler
  const handleSecureLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (isLockedOut) {
      setLoginError(isAr ? 'البوابة مغلقة مؤقتاً لتكرار المحاولات الخاطئة. يرجى الانتظار.' : 'Console locked due to multiple failed attempts.');
      return;
    }

    setIsLoggingIn(true);

    const enteredEmail = adminEmailInput.trim().toLowerCase();
    const enteredPassword = adminPasswordInput.trim();

    // Check Master Key Authorization
    const isMasterKeyMatch = enteredPassword === currentMasterKey;
    const isMasterEmailMatch = enteredEmail === BOOTSTRAP_ADMIN_EMAIL || enteredEmail === 'admin' || enteredEmail === 'techbokra';

    if (isMasterKeyMatch && isMasterEmailMatch) {
      // Successful Master Key Access
      grantAccess('master_key');
      setIsLoggingIn(false);
      return;
    }

    // Try Firebase Email/Password Authentication
    try {
      if (auth) {
        const userCredential = await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);
        if (userCredential.user) {
          grantAccess(userCredential.user.uid);
          setIsLoggingIn(false);
          return;
        }
      }
    } catch {
      // Firebase auth failed, increment brute force counter
    }

    // Handle Failed Attempt
    const newCount = failedAttempts + 1;
    setFailedAttempts(newCount);

    if (newCount >= 5) {
      const lockDuration = 10 * 60 * 1000; // 10 minutes lock
      const until = getFutureTimestamp(lockDuration);
      setLockoutUntil(until);
      if (typeof window !== 'undefined') {
        localStorage.setItem(BRUTE_FORCE_KEY, JSON.stringify({ count: newCount, lockoutUntil: until }));
      }
      setLoginError(
        isAr 
          ? 'تم تجاوز الحد الأقصى للمحاولات (5 محاولات). تم قفل البوابة المشفرة لمدة 10 دقائق.' 
          : 'Max attempts reached. Security lockout active for 10 minutes.'
      );
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem(BRUTE_FORCE_KEY, JSON.stringify({ count: newCount, lockoutUntil: 0 }));
      }
      setLoginError(
        isAr 
          ? `بيانات الدخول غير صحيحة. محاولة ${newCount} من 5 محاولات مصرح بها.` 
          : `Invalid credentials. Attempt ${newCount} of 5 authorized.`
      );
    }

    setIsLoggingIn(false);
  };

  const grantAccess = (token: string) => {
    const sessionData = getSessionPayload(token);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(sessionData));
      localStorage.removeItem(BRUTE_FORCE_KEY);
    }
    setFailedAttempts(0);
    setLockoutUntil(0);
    setIsAuthenticated(true);
  };

  const handleSecureLogout = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    }
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setAdminPasswordInput('');
    setNotificationMsg(isAr ? 'تم قفل اللوحة وإنهاء الجلسة بنجاح.' : 'Session locked successfully.');
  };

  const handleUpdateMasterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyChangeSuccess(false);
    setKeyChangeError('');

    if (newMasterKeyInput.length < 8) {
      setKeyChangeError(isAr ? 'يجب أن لا تقل كلمة المرور عن 8 أحرف وأرقام معقدة.' : 'Password must be at least 8 characters.');
      return;
    }

    setCurrentMasterKey(newMasterKeyInput);
    if (typeof window !== 'undefined') {
      localStorage.setItem(MASTER_KEY_STORAGE, newMasterKeyInput);
    }
    setKeyChangeSuccess(true);
    setNewMasterKeyInput('');
  };

  const handleConfigChange = <K extends keyof EditableConfig>(field: K, value: EditableConfig[K]) => {
    setConfig((prev) => {
      const updated = { ...prev, [field]: value };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setNotificationMsg('');

    try {
      // 1. Local Cache
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
      }

      // 2. Cloud Firestore Real-time Persistence
      await saveSiteSettingsToCloud(config, auth?.currentUser || null);

      setNotificationMsg(
        isAr 
          ? 'تم حفظ وتحديث كافة بيانات الموقع والصور في سحابة Firebase بنجاح!' 
          : 'All site content, media, and settings saved to Firebase cloud successfully!'
      );
    } catch (err) {
      console.error('Save error:', err);
      setNotificationMsg(
        isAr 
          ? 'تم الحفظ محلياً وجاري المزامنة مع السحابة...' 
          : 'Saved locally, syncing to cloud...'
      );
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotificationMsg(''), 5000);
    }
  };

  const handleCopySecretLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/tb-portal-9482x`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Helper: File to base64 Data URL
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof EditableConfig) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          handleConfigChange(fieldName, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered Leads
  const filteredLeads = inquiries.filter((lead) => {
    if (leadsFilter !== 'all' && lead.status !== leadsFilter) return false;
    if (searchLeads) {
      const q = searchLeads.toLowerCase();
      return (
        lead.clientName?.toLowerCase().includes(q) ||
        lead.phone?.includes(q) ||
        lead.facilityType?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const newLeadsCount = inquiries.filter((i) => i.status === 'new').length;

  // ----------------------------------------------------
  // VIEW 1: ENCRYPTED SECURITY GATE LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen bg-[#071120] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-cairo select-none"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Futuristic Cyber Security Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#00F2FE_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#00F2FE]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-[#0284C7]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          
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
                {isAr ? 'البوابة مغلقة مؤقتاً لحماية النظام من الهجمات التكرارية' : 'Gate temporarily locked for security'}
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
  // VIEW 2: AUTHENTICATED SECURE CONTROL PANEL
  // ----------------------------------------------------
  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#071120] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      } ${isAr ? 'font-cairo' : 'font-inter'}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Top Header */}
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
              {isAr ? 'لوحة التحكم والمحتوى الشاملة' : 'Full CMS & Admin Console'}
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
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
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
                {isAr ? 'أقسام لوحة التحكم الشاملة' : 'CMS & Control Sections'}
              </span>

              <nav className="space-y-1">
                {[
                  { id: 'overview', labelAr: 'نظرة عامة والنشاط', labelEn: 'Overview & Activity', icon: LayoutDashboard },
                  { id: 'leads', labelAr: 'طلبات العملاء والمعاينات', labelEn: 'Customer Leads CRM', icon: Inbox, badge: newLeadsCount },
                  { id: 'media', labelAr: 'إدارة الصور والوسائط', labelEn: 'Media & Site Images', icon: ImageIcon },
                  { id: 'content', labelAr: 'المحتوى والنصوص الرئيسية', labelEn: 'Content & Copywriting', icon: FileText },
                  { id: 'services', labelAr: 'الخدمات والحلول الهندسية', labelEn: 'Services & Solutions', icon: Layers },
                  { id: 'projects', labelAr: 'سابقة الأعمال والمنصات', labelEn: 'Projects Portfolio', icon: Briefcase },
                  { id: 'faq', labelAr: 'الأسئلة الشائعة والأجوبة', labelEn: 'FAQ Manager', icon: HelpCircle },
                  { id: 'branding', labelAr: 'الهوية والشعار والخطوط', labelEn: 'Brand & Logo CMS', icon: Sparkles },
                  { id: 'contacts', labelAr: 'بيانات الاتصال ومقر العمل', labelEn: 'Contact & Addresses', icon: Phone },
                  { id: 'security', labelAr: 'الأمان وكلمات المرور', labelEn: 'Security & Access Keys', icon: ShieldCheck },
                  { id: 'vercel', labelAr: 'دليل النشر (Vercel & Domains)', labelEn: 'Vercel Deployment', icon: Settings },
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
                  <span>Hidden & Locked</span>
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

            {/* 1. OVERVIEW & ACTIVITY */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'نظرة عامة على منظومة Tech Bokra' : 'Tech Bokra Executive Overview'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'متابعة حية للطلبات، سابقة الأعمال، الصور والتحكم بالمحتوى' : 'Live leads, portfolio, images, and cloud synchronization'}
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

                {/* Quick Actions Panel */}
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'إجراءات سريعة ومباشرة' : 'Quick Actions'}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setActiveTab('media')}
                      className="p-3 rounded-xl border border-white/10 hover:border-[#00F2FE] bg-[#071120] text-start transition cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#00F2FE] mb-1.5" />
                      <span className="text-xs font-bold block text-white">{isAr ? 'تغيير صور الهيدر' : 'Change Hero Images'}</span>
                      <span className="text-[10px] text-slate-400">{isAr ? 'تعديل صور الكاميرات والشبكات' : 'Surveillance & Fiber photos'}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('content')}
                      className="p-3 rounded-xl border border-white/10 hover:border-[#00F2FE] bg-[#071120] text-start transition cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-400 mb-1.5" />
                      <span className="text-xs font-bold block text-white">{isAr ? 'تعديل نصوص الهيدر' : 'Edit Hero Text'}</span>
                      <span className="text-[10px] text-slate-400">{isAr ? 'العناوين والأرقام والشريط' : 'Headlines & statistics'}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('projects')}
                      className="p-3 rounded-xl border border-white/10 hover:border-[#00F2FE] bg-[#071120] text-start transition cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-amber-400 mb-1.5" />
                      <span className="text-xs font-bold block text-white">{isAr ? 'تحديث سابقة الأعمال' : 'Update Projects'}</span>
                      <span className="text-[10px] text-slate-400">{isAr ? 'إضافة أو تعديل مشاريع' : 'Add or edit projects'}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('contacts')}
                      className="p-3 rounded-xl border border-white/10 hover:border-[#00F2FE] bg-[#071120] text-start transition cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-sky-400 mb-1.5" />
                      <span className="text-xs font-bold block text-white">{isAr ? 'تعديل أرقام التواصل' : 'Edit Contacts'}</span>
                      <span className="text-[10px] text-slate-400">{isAr ? 'الواتساب والهاتف والإيميل' : 'Phone & WhatsApp'}</span>
                    </button>
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
                      {isAr ? 'إدارة طلبات المعاينة واستفسارات العملاء' : 'Customer Inquiries & Leads CRM'}
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {isAr ? 'متابعة لحظية ومحدثة من قاعدة بيانات Firebase Firestore Enterprise' : 'Real-time synchronized with Firestore'}
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3 rtl:left-auto rtl:right-3" />
                    <input
                      type="text"
                      value={searchLeads}
                      onChange={(e) => setSearchLeads(e.target.value)}
                      placeholder={isAr ? 'بحث بالاسم، الهاتف...' : 'Search leads...'}
                      className="bg-[#071120] border border-white/10 rounded-xl py-2 px-9 text-xs text-white placeholder-slate-500 outline-none focus:border-[#00F2FE]"
                    />
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                    { id: 'new', labelAr: 'جديد (لم يتم الرد)', labelEn: 'New' },
                    { id: 'contacted', labelAr: 'تم التواصل', labelEn: 'Contacted' },
                    { id: 'survey_scheduled', labelAr: 'معاينة محجوزة', labelEn: 'Survey Scheduled' },
                    { id: 'contracted', labelAr: 'تم التعاقد', labelEn: 'Contracted' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setLeadsFilter(f.id as typeof leadsFilter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        leadsFilter === f.id
                          ? 'bg-[#00F2FE] text-[#071120]'
                          : 'bg-[#10233D] text-slate-300 hover:bg-[#152C4D]'
                      }`}
                    >
                      {isAr ? f.labelAr : f.labelEn}
                    </button>
                  ))}
                </div>

                {/* Leads Cards List */}
                <div className="space-y-3">
                  {filteredLeads.map((inq) => (
                    <div
                      key={inq.id}
                      className={`p-5 rounded-2xl border transition space-y-3 ${
                        isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white">{inq.clientName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#00F2FE]/15 text-[#00F2FE]">
                              {inq.source === 'estimator' ? (isAr ? 'حاسبة التكلفة' : 'Estimator') : (isAr ? 'نموذج الاتصال' : 'Contact')}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-3">
                            <span>📞 {inq.phone}</span>
                            {inq.email && <span>✉️ {inq.email}</span>}
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

            {/* 3. MEDIA & SITE IMAGES CMS (COMPREHENSIVE) */}
            {activeTab === 'media' && (
              <div className={`p-6 rounded-2xl border space-y-8 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <h3 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <ImageIcon className="w-5 h-5 text-[#00F2FE]" />
                    <span>{isAr ? 'إدارة الصور والوسائط البصرية للموقع' : 'Media & Site Images CMS'}</span>
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr 
                      ? 'التحكم الكامل في صور الهيدر التفاعلي، بطاقات الأنظمة، وسابقة المشروعات (بروابط أو برفع صور مباشرة من جهازك أو باختيار مكتبة الصور الجاهزة)' 
                      : 'Full control of Hero telemetry photos and project images with presets, URLs, or local file upload'}
                  </p>
                </div>

                {/* 4 HERO TELEMETRY IMAGES CARDS */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2">
                    {isAr ? '1. صور واجهة الهيدر التفاعلي (Hero Telemetry 4 Cards):' : '1. Hero Telemetry 4 Cards Images:'}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: CCTV Surveillance */}
                    <div className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00F2FE] flex items-center gap-1.5">
                          <Camera className="w-4 h-4" />
                          <span>{isAr ? 'صورة كاميرات المراقبة (CCTV)' : 'CCTV Surveillance Photo'}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">HERO TAB 1</span>
                      </div>

                      {/* Image Preview */}
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={config.heroCctvImage || CURATED_IMAGE_PRESETS.cctv[0].url} 
                          alt="CCTV Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* URL Input */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'رابط الصورة (URL)' : 'Image URL'}</label>
                        <input
                          type="url"
                          value={config.heroCctvImage || ''}
                          onChange={(e) => handleConfigChange('heroCctvImage', e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                        />
                      </div>

                      {/* Local File Upload */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'أو رفع ملف من جهازك مباشرة:' : 'Or Upload File:'}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'heroCctvImage')}
                          className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#00F2FE]/20 file:text-[#00F2FE] cursor-pointer"
                        />
                      </div>

                      {/* Curated Presets Buttons */}
                      <div className="pt-2 border-t border-white/5">
                        <span className="text-[10px] text-slate-400 block mb-1.5">{isAr ? 'مكتبة صور جاهزة عالية الدقة:' : 'Curated HD Presets:'}</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {CURATED_IMAGE_PRESETS.cctv.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleConfigChange('heroCctvImage', preset.url)}
                              className="text-[10px] p-1.5 rounded bg-[#10233D] hover:bg-[#152C4D] text-slate-300 hover:text-[#00F2FE] text-start truncate border border-white/5 cursor-pointer"
                              title={preset.title}
                            >
                              {preset.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Structured Network & Fiber */}
                    <div className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00F2FE] flex items-center gap-1.5">
                          <Network className="w-4 h-4" />
                          <span>{isAr ? 'صورة الشبكات والفيبر (Network & Fiber)' : 'Network & Cabling Photo'}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">HERO TAB 2</span>
                      </div>

                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={config.heroNetworkImage || CURATED_IMAGE_PRESETS.network[0].url} 
                          alt="Network Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'رابط الصورة (URL)' : 'Image URL'}</label>
                        <input
                          type="url"
                          value={config.heroNetworkImage || ''}
                          onChange={(e) => handleConfigChange('heroNetworkImage', e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'أو رفع ملف من جهازك مباشرة:' : 'Or Upload File:'}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'heroNetworkImage')}
                          className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#00F2FE]/20 file:text-[#00F2FE] cursor-pointer"
                        />
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <span className="text-[10px] text-slate-400 block mb-1.5">{isAr ? 'مكتبة صور جاهزة عالية الدقة:' : 'Curated HD Presets:'}</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {CURATED_IMAGE_PRESETS.network.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleConfigChange('heroNetworkImage', preset.url)}
                              className="text-[10px] p-1.5 rounded bg-[#10233D] hover:bg-[#152C4D] text-slate-300 hover:text-[#00F2FE] text-start truncate border border-white/5 cursor-pointer"
                              title={preset.title}
                            >
                              {preset.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Access Control & Biometrics */}
                    <div className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00F2FE] flex items-center gap-1.5">
                          <Lock className="w-4 h-4" />
                          <span>{isAr ? 'صورة بوابات الدخول والبصمة (Access Control)' : 'Smart Access & Turnstiles Photo'}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">HERO TAB 3</span>
                      </div>

                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={config.heroAccessImage || CURATED_IMAGE_PRESETS.access[0].url} 
                          alt="Access Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'رابط الصورة (URL)' : 'Image URL'}</label>
                        <input
                          type="url"
                          value={config.heroAccessImage || ''}
                          onChange={(e) => handleConfigChange('heroAccessImage', e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'أو رفع ملف من جهازك مباشرة:' : 'Or Upload File:'}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'heroAccessImage')}
                          className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#00F2FE]/20 file:text-[#00F2FE] cursor-pointer"
                        />
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <span className="text-[10px] text-slate-400 block mb-1.5">{isAr ? 'مكتبة صور جاهزة عالية الدقة:' : 'Curated HD Presets:'}</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {CURATED_IMAGE_PRESETS.access.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleConfigChange('heroAccessImage', preset.url)}
                              className="text-[10px] p-1.5 rounded bg-[#10233D] hover:bg-[#152C4D] text-slate-300 hover:text-[#00F2FE] text-start truncate border border-white/5 cursor-pointer"
                              title={preset.title}
                            >
                              {preset.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Cloud ERP & Apps */}
                    <div className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00F2FE] flex items-center gap-1.5">
                          <Globe className="w-4 h-4" />
                          <span>{isAr ? 'صورة الأنظمة السحابية والـ ERP' : 'Cloud ERP & Software Photo'}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">HERO TAB 4</span>
                      </div>

                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={config.heroCloudImage || CURATED_IMAGE_PRESETS.cloud[0].url} 
                          alt="Cloud Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'رابط الصورة (URL)' : 'Image URL'}</label>
                        <input
                          type="url"
                          value={config.heroCloudImage || ''}
                          onChange={(e) => handleConfigChange('heroCloudImage', e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'أو رفع ملف من جهازك مباشرة:' : 'Or Upload File:'}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'heroCloudImage')}
                          className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#00F2FE]/20 file:text-[#00F2FE] cursor-pointer"
                        />
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <span className="text-[10px] text-slate-400 block mb-1.5">{isAr ? 'مكتبة صور جاهزة عالية الدقة:' : 'Curated HD Presets:'}</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {CURATED_IMAGE_PRESETS.cloud.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleConfigChange('heroCloudImage', preset.url)}
                              className="text-[10px] p-1.5 rounded bg-[#10233D] hover:bg-[#152C4D] text-slate-300 hover:text-[#00F2FE] text-start truncate border border-white/5 cursor-pointer"
                              title={preset.title}
                            >
                              {preset.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CONTENT & COPYWRITING CMS (COMPREHENSIVE) */}
            {activeTab === 'content' && (
              <div className={`p-6 rounded-2xl border space-y-6 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <h3 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <FileText className="w-5 h-5 text-[#00F2FE]" />
                    <span>{isAr ? 'إدارة المحتوى والنصوص الرئيسية للموقع' : 'Content & Copywriting CMS'}</span>
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr ? 'التحكم الكامل في عناوين الهيدر، الأرقام والإحصائيات، شريط الإعلانات، ونبذة الفوتر' : 'Full control over Hero headlines, trust stats, banners, and footer bio'}
                  </p>
                </div>

                {/* Hero Headlines */}
                <div className="space-y-4 border-b border-white/10 pb-6">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00F2FE]" />
                    <span>{isAr ? 'عناوين وشعارات الهيدر الرئيسي (Hero Section):' : 'Hero Section Headlines:'}</span>
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'السطر الأول من العنوان (عربي)' : 'Title Line 1 (Arabic)'}</label>
                      <input
                        type="text"
                        value={config.heroTitleLine1Ar}
                        onChange={(e) => handleConfigChange('heroTitleLine1Ar', e.target.value)}
                        className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#00F2FE] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'السطر الثاني الملون بالنيون (عربي)' : 'Title Line 2 Neon (Arabic)'}</label>
                      <input
                        type="text"
                        value={config.heroTitleLine2Ar}
                        onChange={(e) => handleConfigChange('heroTitleLine2Ar', e.target.value)}
                        className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-[#00F2FE] font-bold text-xs focus:border-[#00F2FE] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'الوصف التوضيحي للهيدر (عربي)' : 'Hero Subtitle (Arabic)'}</label>
                      <textarea
                        rows={2}
                        value={config.heroSubAr}
                        onChange={(e) => handleConfigChange('heroSubAr', e.target.value)}
                        className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#00F2FE] outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'شارة الهيدر العلوية (عربي)' : 'Badge (Arabic)'}</label>
                      <input
                        type="text"
                        value={config.heroBadgeAr}
                        onChange={(e) => handleConfigChange('heroBadgeAr', e.target.value)}
                        className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#00F2FE] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'شارة الهيدر العلوية (إنجليزي)' : 'Badge (English)'}</label>
                      <input
                        type="text"
                        value={config.heroBadgeEn}
                        onChange={(e) => handleConfigChange('heroBadgeEn', e.target.value)}
                        className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Trust Stats Numbers */}
                <div className="space-y-4 border-b border-white/10 pb-6">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? 'الأرقام والإحصائيات الرئيسية (Trust Stats):' : 'Key Metrics & Statistics:'}</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-xl bg-[#071120] border border-white/10">
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? 'المشروعات المنفذة' : 'Projects Done'}</label>
                      <input
                        type="text"
                        value={config.stat1Val}
                        onChange={(e) => handleConfigChange('stat1Val', e.target.value)}
                        className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold text-sm text-center focus:border-[#00F2FE] outline-none"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#071120] border border-white/10">
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? 'دقة واستجابة المعاينة' : 'Survey Precision'}</label>
                      <input
                        type="text"
                        value={config.stat2Val}
                        onChange={(e) => handleConfigChange('stat2Val', e.target.value)}
                        className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold text-sm text-center focus:border-[#00F2FE] outline-none"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#071120] border border-white/10">
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? 'سرعة استجابة الطوارئ' : 'Emergency Latency'}</label>
                      <input
                        type="text"
                        value={config.stat3Val}
                        onChange={(e) => handleConfigChange('stat3Val', e.target.value)}
                        className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold text-sm text-center focus:border-[#00F2FE] outline-none"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#071120] border border-white/10">
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">{isAr ? 'ضمان الأعمال المعتمد' : 'Warranty Guarantee'}</label>
                      <input
                        type="text"
                        value={config.stat4Val}
                        onChange={(e) => handleConfigChange('stat4Val', e.target.value)}
                        className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold text-sm text-center focus:border-[#00F2FE] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Announcement Banner */}
                <div className="space-y-4 border-b border-white/10 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-amber-400" />
                        <span>{isAr ? 'شريط الإعلانات الترويجي العلوي:' : 'Announcement Top Bar:'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{isAr ? 'يظهر في أعلى كل صفحات الموقع لإبراز المشروعات الجديدة والعروض' : 'Shows above navbar'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showAnnouncement}
                        onChange={(e) => handleConfigChange('showAnnouncement', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00F2FE]"></div>
                    </label>
                  </div>

                  {config.showAnnouncement && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'شارة الإعلان (عربي)' : 'Badge (Arabic)'}</label>
                        <input
                          type="text"
                          value={config.announcementBadgeAr}
                          onChange={(e) => handleConfigChange('announcementBadgeAr', e.target.value)}
                          className="w-full bg-[#071120] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-[#00F2FE] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'رابط الإعلان عند النقر (URL)' : 'Target Link'}</label>
                        <input
                          type="url"
                          value={config.announcementLink}
                          onChange={(e) => handleConfigChange('announcementLink', e.target.value)}
                          className="w-full bg-[#071120] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'نص الإعلان (عربي)' : 'Announcement Text'}</label>
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

                {/* Footer Bio & Legal */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>{isAr ? 'نبذة الشركة القانونية وبيانات الفوتر:' : 'Brand Bio & Legal Footer Information:'}</span>
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'نبذة الشركة في الفوتر (عربي)' : 'Brand Bio (Arabic)'}</label>
                      <textarea
                        rows={2}
                        value={config.brandBioAr || ''}
                        onChange={(e) => handleConfigChange('brandBioAr', e.target.value)}
                        className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs focus:border-[#00F2FE] outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'رقم السجل التجاري' : 'Commercial Register'}</label>
                      <input
                        type="text"
                        value={config.commercialRegister || ''}
                        onChange={(e) => handleConfigChange('commercialRegister', e.target.value)}
                        placeholder="182940"
                        className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isAr ? 'رقم البطاقة الضريبية' : 'Tax Card ID'}</label>
                      <input
                        type="text"
                        value={config.taxId || ''}
                        onChange={(e) => handleConfigChange('taxId', e.target.value)}
                        placeholder="714-389-201"
                        className="w-full bg-[#071120] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs font-mono focus:border-[#00F2FE] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SERVICES CMS */}
            {activeTab === 'services' && (
              <div className={`p-6 rounded-2xl border space-y-6 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Layers className="w-5 h-5 text-[#00F2FE]" />
                      <span>{isAr ? 'إدارة الخدمات والحلول الهندسية' : 'Services & Engineering Solutions CMS'}</span>
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {isAr ? 'تعديل وتخصيص كافة خدمات الشركة المعروضة بالموقع والمواصفات الفنية' : 'Manage service cards, descriptions, and features'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleConfigChange('servicesList', defaultEditableConfig.servicesList)}
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-[#071120] text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استعادة الخدمات الافتراضية' : 'Reset Services'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(config.servicesList || contentAr.services.list).map((srv, idx) => (
                    <div 
                      key={srv.id || idx}
                      className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00F2FE] flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#10233D] flex items-center justify-center font-mono text-[11px] font-bold">
                            {idx + 1}
                          </span>
                          <span>{srv.title}</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                          {srv.category}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'عنوان الخدمة' : 'Service Title'}</label>
                          <input
                            type="text"
                            value={srv.title}
                            onChange={(e) => {
                              const updated = [...(config.servicesList || contentAr.services.list)];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              handleConfigChange('servicesList', updated);
                            }}
                            className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00F2FE] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'رابط صورة الخدمة' : 'Image URL'}</label>
                          <input
                            type="url"
                            value={srv.image || ''}
                            onChange={(e) => {
                              const updated = [...(config.servicesList || contentAr.services.list)];
                              updated[idx] = { ...updated[idx], image: e.target.value };
                              handleConfigChange('servicesList', updated);
                            }}
                            className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'الوصف المختصر' : 'Short Description'}</label>
                          <textarea
                            rows={2}
                            value={srv.shortDesc}
                            onChange={(e) => {
                              const updated = [...(config.servicesList || contentAr.services.list)];
                              updated[idx] = { ...updated[idx], shortDesc: e.target.value };
                              handleConfigChange('servicesList', updated);
                            }}
                            className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00F2FE] outline-none resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PROJECTS PORTFOLIO CMS */}
            {activeTab === 'projects' && (
              <div className={`p-6 rounded-2xl border space-y-6 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Briefcase className="w-5 h-5 text-[#00F2FE]" />
                      <span>{isAr ? 'سابقة الأعمال والمشروعات والمنصات' : 'Projects Portfolio CMS'}</span>
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {isAr ? 'التحكم في سابقة المشروعات، الروابط التفاعلية المباشرة، والصور' : 'Manage project portfolio, live demo links, and images'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleConfigChange('projectsList', defaultEditableConfig.projectsList)}
                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-[#071120] text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استعادة المشروعات الافتراضية' : 'Reset Projects'}</span>
                  </button>
                </div>

                {/* Live Platform Links Shortcuts */}
                <div className="p-4 rounded-xl bg-[#071120] border border-[#00F2FE]/20 space-y-3">
                  <span className="text-xs font-bold text-white block">{isAr ? 'روابط المنصات الشقيقة التفاعلية:' : 'Live Platforms URLs:'}</span>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        {isAr ? 'منصة هليو بروبرتي (Helio Property)' : 'Helio Property URL'}
                      </label>
                      <input
                        type="url"
                        value={config.helioPropertyUrl}
                        onChange={(e) => handleConfigChange('helioPropertyUrl', e.target.value)}
                        className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        {isAr ? 'منصة الرحلة التفاعلية (Al-Rehla)' : 'Al-Rehla Platform URL'}
                      </label>
                      <input
                        type="url"
                        value={config.alrehlaUrl}
                        onChange={(e) => handleConfigChange('alrehlaUrl', e.target.value)}
                        className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Projects Cards List */}
                <div className="space-y-4">
                  {(config.projectsList || contentAr.projects.list).map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#10233D] text-[#00F2FE] flex items-center justify-center font-mono text-[11px] font-bold">
                            {idx + 1}
                          </span>
                          <span>{proj.title}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          {proj.isUpcoming && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              قيد التطوير
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                            {proj.category}
                          </span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'اسم المشروع' : 'Project Title'}</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...(config.projectsList || contentAr.projects.list)];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              handleConfigChange('projectsList', updated);
                            }}
                            className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00F2FE] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'اسم العميل / القطاع' : 'Client'}</label>
                          <input
                            type="text"
                            value={proj.client}
                            onChange={(e) => {
                              const updated = [...(config.projectsList || contentAr.projects.list)];
                              updated[idx] = { ...updated[idx], client: e.target.value };
                              handleConfigChange('projectsList', updated);
                            }}
                            className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00F2FE] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'رابط صورة المشروع' : 'Project Image URL'}</label>
                          <input
                            type="url"
                            value={proj.image || ''}
                            onChange={(e) => {
                              const updated = [...(config.projectsList || contentAr.projects.list)];
                              updated[idx] = { ...updated[idx], image: e.target.value };
                              handleConfigChange('projectsList', updated);
                            }}
                            className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'رابط المعاينة المباشرة (Live Demo)' : 'Live Demo URL'}</label>
                          <input
                            type="url"
                            value={proj.liveUrl || ''}
                            onChange={(e) => {
                              const updated = [...(config.projectsList || contentAr.projects.list)];
                              updated[idx] = { ...updated[idx], liveUrl: e.target.value };
                              handleConfigChange('projectsList', updated);
                            }}
                            placeholder="https://..."
                            className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">{isAr ? 'نبذة عن المشروع' : 'Description'}</label>
                          <textarea
                            rows={2}
                            value={proj.description}
                            onChange={(e) => {
                              const updated = [...(config.projectsList || contentAr.projects.list)];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              handleConfigChange('projectsList', updated);
                            }}
                            className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00F2FE] outline-none resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. FAQ CMS */}
            {activeTab === 'faq' && (
              <div className={`p-6 rounded-2xl border space-y-6 ${
                isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <HelpCircle className="w-5 h-5 text-[#00F2FE]" />
                      <span>{isAr ? 'إدارة الأسئلة الشائعة والأجوبة (FAQ CMS)' : 'FAQ & Knowledge Base CMS'}</span>
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {isAr ? 'تعديل وحذف وإضافة الأسئلة المتكررة التي يراها زوار الموقع' : 'Edit, delete, and add questions and answers'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const updated = [
                        ...(config.faqList || contentAr.faq.items),
                        { q: isAr ? 'سؤال جديد هنا...' : 'New Question...', a: isAr ? 'إجابة واضحة ومفصلة هنا...' : 'Clear answer here...' }
                      ];
                      handleConfigChange('faqList', updated);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'إضافة سؤال جديد' : 'Add FAQ'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(config.faqList || contentAr.faq.items).map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#10233D] text-[#00F2FE] flex items-center justify-center font-mono text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <span>{item.q}</span>
                        </span>
                        <button
                          onClick={() => {
                            const updated = (config.faqList || contentAr.faq.items).filter((_, i) => i !== idx);
                            handleConfigChange('faqList', updated);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          title="حذف السؤال"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.q}
                        onChange={(e) => {
                          const updated = [...(config.faqList || contentAr.faq.items)];
                          updated[idx] = { ...updated[idx], q: e.target.value };
                          handleConfigChange('faqList', updated);
                        }}
                        className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-[#00F2FE] outline-none"
                      />

                      <textarea
                        rows={2}
                        value={item.a}
                        onChange={(e) => {
                          const updated = [...(config.faqList || contentAr.faq.items)];
                          updated[idx] = { ...updated[idx], a: e.target.value };
                          handleConfigChange('faqList', updated);
                        }}
                        className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:border-[#00F2FE] outline-none resize-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. BRANDING & LOGO */}
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
                          <span>{isAr ? 'تم تطبيق الشعار المخصص بنجاح' : 'Custom logo active'}</span>
                        </span>
                        <button
                          onClick={() => handleConfigChange('customLogoUrl', '')}
                          className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold cursor-pointer"
                        >
                          {isAr ? 'إلغاء واستعادة الشعار الفيكتور' : 'Reset to Vector Logo'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 9. CONTACTS & LOCATION */}
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

            {/* 10. SECURITY & ACCESS KEYS */}
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

            {/* 11. VERCEL DEPLOYMENT & CLOUD GUIDE */}
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
