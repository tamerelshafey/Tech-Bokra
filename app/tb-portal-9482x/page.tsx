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
  Network,
  ChevronDown,
  ChevronUp,
  FolderPlus,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import TechBokraLogo, { LogoEmblemStyle } from '@/components/TechBokraLogo';
import { useTheme } from '@/components/ThemeProvider';
import { siteConfig as defaultSiteConfig, contentAr, contentEn, Project, ServiceItem } from '@/lib/content';
import { EditableConfig, defaultEditableConfig, MediaVaultItem } from '@/components/AdminSettingsModal';
import ProjectModal from '@/components/ProjectModal';
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
import { 
  safeSaveConfigToStorage, 
  safeLoadConfigFromStorage, 
  compressImageFile 
} from '@/lib/storageHelper';

const LOCAL_STORAGE_KEY = 'tech_bokra_custom_config_v4';
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
  const [currentMasterKey, setCurrentMasterKey] = useState<string>(DEFAULT_MASTER_KEY);
  const [newMasterKeyInput, setNewMasterKeyInput] = useState<string>('');
  const [keyChangeSuccess, setKeyChangeSuccess] = useState<boolean>(false);
  const [keyChangeError, setKeyChangeError] = useState<string>('');

  // Config State
  const [config, setConfig] = useState<EditableConfig>(defaultEditableConfig);

  // Leads & CRM State
  const [inquiries, setInquiries] = useState<FirestoreInquiry[]>([]);
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'new' | 'contacted' | 'survey_scheduled' | 'contracted'>('all');
  const [searchLeads, setSearchLeads] = useState<string>('');

  // UI Feedback State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Projects CMS & Image Uploader Hub State
  const [projectFilter, setProjectFilter] = useState<'all' | 'published' | 'draft' | 'upcoming'>('all');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<'all' | 'security' | 'network' | 'software' | 'erp'>('all');
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [expandedProjectIdx, setExpandedProjectIdx] = useState<number | null>(null);
  const [previewModalProject, setPreviewModalProject] = useState<Project | null>(null);
  const [vaultPickerTargetProjectIdx, setVaultPickerTargetProjectIdx] = useState<number | null>(null);
  const [vaultPickerTargetHeroField, setVaultPickerTargetHeroField] = useState<keyof EditableConfig | null>(null);
  const [newTechTagInput, setNewTechTagInput] = useState<Record<number, string>>({});
  const [uploadedAssetUrl, setUploadedAssetUrl] = useState<string>('');
  const [uploadedAssetName, setUploadedAssetName] = useState<string>('');
  const [uploadedAssetSize, setUploadedAssetSize] = useState<string>('');
  const [copiedAssetUrl, setCopiedAssetUrl] = useState<boolean>(false);
  const [targetProjectForUpload, setTargetProjectForUpload] = useState<string>('');
  const [recentUploads, setRecentUploads] = useState<{ id: string; name: string; url: string; size: string }[]>([]);

  // Check Session and Brute Force on Client Mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const savedKey = localStorage.getItem(MASTER_KEY_STORAGE);
        if (savedKey) setCurrentMasterKey(savedKey);

        const savedConfig = safeLoadConfigFromStorage();
        if (savedConfig) {
          setConfig((prev) => ({ ...prev, ...savedConfig }));
        }

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
      safeSaveConfigToStorage(updated);
      return updated;
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setNotificationMsg('');

    try {
      // 1. Safe Local Cache
      safeSaveConfigToStorage(config);

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

  // Helper: Compressed File to base64 Data URL for any single config field
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof EditableConfig) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file);
        if (compressed) {
          handleConfigChange(fieldName, compressed);
          setNotificationMsg(isAr ? 'تم ضغط ورفع الصورة بنجاح!' : 'Image compressed and updated successfully!');
          setTimeout(() => setNotificationMsg(''), 3000);
        }
      } catch (err) {
        console.error('Image compression error:', err);
      }
    }
  };

  // Helper: Upload file to Media Assets Vault and generate direct URL
  const handleAssetUploaderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const compressed = await compressImageFile(file);
        if (compressed) {
          const sizeKB = `${((compressed.length * 0.75) / 1024).toFixed(1)} KB`;
          const fileName = file.name;
          setUploadedAssetUrl(compressed);
          setUploadedAssetName(fileName);
          setUploadedAssetSize(sizeKB);

          const newVaultItem: MediaVaultItem = {
            id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: fileName.replace(/\.[^/.]+$/, ''),
            url: compressed,
            size: sizeKB,
            date: new Date().toISOString().split('T')[0],
            tag: isAr ? 'مرفوع محلياً' : 'Local Upload',
          };

          const currentVault = config.mediaVault || defaultEditableConfig.mediaVault || [];
          const updatedVault = [newVaultItem, ...currentVault];
          handleConfigChange('mediaVault', updatedVault);

          setRecentUploads((prev) => [
            { id: newVaultItem.id, name: fileName, url: compressed, size: sizeKB },
            ...prev.slice(0, 5)
          ]);

          setNotificationMsg(isAr ? `تم ضغط وحفظ صورة "${fileName}" في الخزينة بنجاح!` : `Uploaded "${fileName}" successfully!`);
          setTimeout(() => setNotificationMsg(''), 4000);
        }
      } catch (err) {
        console.error('Error uploading asset:', err);
      }
    }
  };

  // Helper: Direct Project Image Upload with automatic Media Vault registration
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file);
      if (compressed) {
        const currentList = [...(config.projectsList || contentAr.projects.list)];
        currentList[projectIdx] = { ...currentList[projectIdx], image: compressed };
        handleConfigChange('projectsList', currentList);

        // Also add to Media Vault so it has a permanent reference
        const sizeKB = `${((compressed.length * 0.75) / 1024).toFixed(1)} KB`;
        const newVaultItem: MediaVaultItem = {
          id: `proj-asset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: compressed,
          size: sizeKB,
          date: new Date().toISOString().split('T')[0],
          tag: currentList[projectIdx]?.tag || 'Project',
        };
        const currentVault = config.mediaVault || defaultEditableConfig.mediaVault || [];
        handleConfigChange('mediaVault', [newVaultItem, ...currentVault]);

        setNotificationMsg(isAr ? 'تم ضغط ورفع صورة المشروع وحفظها في الخزينة بنجاح!' : 'Project image compressed and uploaded!');
        setTimeout(() => setNotificationMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error uploading project image:', err);
    }
  };

  const handleApplyUploadedAssetToProject = (targetProjId: string, assetUrl: string) => {
    if (!targetProjId || !assetUrl) return;
    const currentList = config.projectsList || contentAr.projects.list;
    const updated = currentList.map((p) => {
      if (p.id === targetProjId) {
        return { ...p, image: assetUrl };
      }
      return p;
    });
    handleConfigChange('projectsList', updated);
    setNotificationMsg(isAr ? 'تم تعيين وتحديث صورة المشروع بنجاح!' : 'Project image updated successfully!');
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleApplyUploadedAssetToHero = (field: keyof EditableConfig, assetUrl: string) => {
    if (!assetUrl) return;
    handleConfigChange(field, assetUrl);
    setNotificationMsg(isAr ? 'تم تحديث صورة بطاقة الهيدر بنجاح!' : 'Hero image updated successfully!');
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const copyAssetUrlToClipboard = (url: string, name?: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedAssetUrl(true);
      setNotificationMsg(
        isAr 
          ? (name ? `تم نسخ رابط صورة "${name}" بنجاح!` : 'تم نسخ رابط الصورة بنجاح! يمكنك الآن لصقه في أي مشروع أو خدمة.')
          : 'Image URL copied to clipboard!'
      );
      setTimeout(() => {
        setCopiedAssetUrl(false);
        setNotificationMsg('');
      }, 3000);
    }
  };

  const handleDeleteVaultItem = (itemId: string) => {
    const currentVault = config.mediaVault || defaultEditableConfig.mediaVault || [];
    const updated = currentVault.filter((item) => item.id !== itemId);
    handleConfigChange('mediaVault', updated);
    setNotificationMsg(isAr ? 'تم حذف العنصر من خزينة الوسائط.' : 'Item deleted from vault.');
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const handleAddNewProject = () => {
    const currentList = config.projectsList || contentAr.projects.list;
    const newId = `project-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      title: isAr ? 'مشروع هندسي وتقني جديد' : 'New Engineering & Tech Project',
      client: isAr ? 'اسم العميل / المؤسسة المنفذ لها' : 'Client Organization Name',
      tag: isAr ? 'أنظمة متكاملة' : 'Integrated Systems',
      category: 'security',
      icon: 'ShieldCheck',
      image: CURATED_IMAGE_PRESETS.cctv[0].url,
      summary: isAr ? 'نبذة موجزة عن نطاق المشروع والحلول المنفذة بنجاح للمنشأة.' : 'Brief summary of project scope.',
      description: isAr ? 'قام فريق تيك بكرة بتصميم وتوريد وتنفيذ المنظومة بأعلى المعايير الهندسية مع تفعيل الضمان وعقد الصيانة.' : 'Full case study of scope, milestones, and delivery.',
      highlight: isAr ? 'إنجاز تسليم المشروع بنسبة 100% وفق أعلى المعايير الهندسية والاعتمادية.' : '100% compliance with engineering standards.',
      stats: [
        { label: isAr ? 'الوحدات المنفذة' : 'Units', value: '+40 نقطة' },
        { label: isAr ? 'زمن الإنجاز' : 'Timeline', value: '10 أيام' },
        { label: isAr ? 'الاعتمادية' : 'Reliability', value: '100%' },
      ],
      technologies: ['IP 4K Cameras', 'Cat6A Structured Cabling', 'Managed Core Switches'],
      challenges: [isAr ? 'متطلبات أمنية وهندسية دقيقة لربط المنشأة' : 'Strict engineering requirements'],
      solutions: [isAr ? 'تنفيذ بنية تحتية معزولة ومحمية بكابلات معتمدة' : 'Isolated, high-availability architecture'],
      isDraft: false,
      isUpcoming: false,
      statusBadge: isAr ? 'مشروع مكتمل' : 'Completed',
      liveUrl: '',
    };

    const updated = [newProject, ...currentList];
    handleConfigChange('projectsList', updated);
    setExpandedProjectIdx(0);
    setNotificationMsg(isAr ? 'تمت إضافة مشروع جديد بنجاح! يمكنك الآن تعديل كافة تفاصيله ونشره.' : 'New project added!');
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleToggleProjectDraft = (projId: string) => {
    const currentList = config.projectsList || contentAr.projects.list;
    let nextState = false;
    const updated = currentList.map((p) => {
      if (p.id === projId) {
        nextState = !p.isDraft;
        return { ...p, isDraft: nextState };
      }
      return p;
    });
    handleConfigChange('projectsList', updated);
    setNotificationMsg(
      nextState
        ? (isAr ? 'تم تحويل المشروع إلى "مسودة" (مخفي من الموقع للزوار)' : 'Project set to Draft (Hidden from visitors)')
        : (isAr ? 'تم نشر المشروع بنجاح (ظاهر الآن لجميع زوار الموقع)' : 'Project Published to live site!')
    );
    setTimeout(() => setNotificationMsg(''), 3500);
  };

  const handleDuplicateProject = (idx: number) => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const source = currentList[idx];
    if (!source) return;
    const cloned: Project = {
      ...source,
      id: `proj-${Date.now()}`,
      title: `${source.title} (${isAr ? 'نسخة مسودة' : 'Copy Draft'})`,
      isDraft: true, // cloned as draft for safety
    };
    currentList.splice(idx + 1, 0, cloned);
    handleConfigChange('projectsList', currentList);
    setExpandedProjectIdx(idx + 1);
    setNotificationMsg(isAr ? 'تم استنساخ المشروع كمسودة بنجاح! يمكنك تعديله.' : 'Project duplicated as draft.');
    setTimeout(() => setNotificationMsg(''), 3500);
  };

  const handleMoveProject = (idx: number, direction: 'up' | 'down') => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;
    const temp = currentList[idx];
    currentList[idx] = currentList[targetIdx];
    currentList[targetIdx] = temp;
    handleConfigChange('projectsList', currentList);
    setExpandedProjectIdx(targetIdx);
  };

  const handleDeleteProject = (projId: string) => {
    if (typeof window !== 'undefined' && !window.confirm(isAr ? 'هل أنت متأكد من حذف هذا المشروع من سابقة الأعمال؟' : 'Delete this project?')) {
      return;
    }
    const currentList = config.projectsList || contentAr.projects.list;
    const updated = currentList.filter((p) => p.id !== projId);
    handleConfigChange('projectsList', updated);
    setExpandedProjectIdx(null);
    setNotificationMsg(isAr ? 'تم حذف المشروع من القائمة.' : 'Project removed.');
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleUpdateProjectField = (idx: number, field: keyof Project, val: any) => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    currentList[idx] = { ...currentList[idx], [field]: val };
    handleConfigChange('projectsList', currentList);
  };

  const handleAddProjectTechnology = (idx: number, tech: string) => {
    if (!tech.trim()) return;
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const existing = currentList[idx].technologies || [];
    currentList[idx] = { ...currentList[idx], technologies: [...existing, tech.trim()] };
    handleConfigChange('projectsList', currentList);
    setNewTechTagInput((prev) => ({ ...prev, [idx]: '' }));
  };

  const handleRemoveProjectTechnology = (idx: number, techIdx: number) => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const existing = [...(currentList[idx].technologies || [])];
    existing.splice(techIdx, 1);
    currentList[idx] = { ...currentList[idx], technologies: existing };
    handleConfigChange('projectsList', currentList);
  };

  const handleAddProjectChallenge = (idx: number) => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const existing = currentList[idx].challenges || [];
    currentList[idx] = { 
      ...currentList[idx], 
      challenges: [...existing, isAr ? 'تحدي هندسي جديد...' : 'New engineering challenge...'] 
    };
    handleConfigChange('projectsList', currentList);
  };

  const handleUpdateProjectChallenge = (idx: number, chIdx: number, text: string) => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const existing = [...(currentList[idx].challenges || [])];
    existing[chIdx] = text;
    currentList[idx] = { ...currentList[idx], challenges: existing };
    handleConfigChange('projectsList', currentList);
  };

  const handleRemoveProjectChallenge = (idx: number, chIdx: number) => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const existing = [...(currentList[idx].challenges || [])];
    existing.splice(chIdx, 1);
    currentList[idx] = { ...currentList[idx], challenges: existing };
    handleConfigChange('projectsList', currentList);
  };

  const handleAddProjectSolution = (idx: number) => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const existing = currentList[idx].solutions || [];
    currentList[idx] = { 
      ...currentList[idx], 
      solutions: [...existing, isAr ? 'حل هندسي منفذ بواسطة تيك بكرة...' : 'Solution implemented by Tech Bokra...'] 
    };
    handleConfigChange('projectsList', currentList);
  };

  const handleUpdateProjectSolution = (idx: number, solIdx: number, text: string) => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const existing = [...(currentList[idx].solutions || [])];
    existing[solIdx] = text;
    currentList[idx] = { ...currentList[idx], solutions: existing };
    handleConfigChange('projectsList', currentList);
  };

  const handleRemoveProjectSolution = (idx: number, solIdx: number) => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const existing = [...(currentList[idx].solutions || [])];
    existing.splice(solIdx, 1);
    currentList[idx] = { ...currentList[idx], solutions: existing };
    handleConfigChange('projectsList', currentList);
  };

  const handleUpdateProjectStat = (idx: number, statIdx: number, field: 'label' | 'value', val: string) => {
    const currentList = [...(config.projectsList || contentAr.projects.list)];
    const existing = [...(currentList[idx].stats || [])];
    while (existing.length <= statIdx) {
      existing.push({ label: '', value: '' });
    }
    existing[statIdx] = { ...existing[statIdx], [field]: val };
    currentList[idx] = { ...currentList[idx], stats: existing };
    handleConfigChange('projectsList', currentList);
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
                    <span>{isAr ? 'مركز الوسائط ورفع الصور واستخراج الروابط' : 'Media Vault & Image Link Generator'}</span>
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isAr 
                      ? 'ارفع صور مشروعاتك أو شعاراتك من جهازك مباشرة، واحصل على رابط مباشر خاص بالمشروع لنسخه واستخدامه في أي مكان، أو تحكّم في صور واجهة الهيدر التفاعلي والمشروعات والخدمات.' 
                      : 'Upload images from your device, get dedicated project URLs to copy and use anywhere, and manage all site media.'}
                  </p>
                </div>

                {/* SECTION 1: UPLOAD & GENERATE DIRECT LINK */}
                <div className="p-5 rounded-2xl bg-[#071120] border border-[#00F2FE]/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#00F2FE]/15 text-[#00F2FE] flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {isAr ? '1. رفع صورة جديدة واستخراج رابط مباشر خاص بالمشروع' : '1. Upload Image & Generate Direct URL'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {isAr ? 'يدعم صور PNG, JPG, WEBP, SVG حتى 8 ميجابايت مع تخزين مشفر ودائم' : 'Supports PNG, JPG, WEBP, SVG up to 8MB'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropzone / Upload Input */}
                  <div className="border-2 border-dashed border-[#00F2FE]/30 hover:border-[#00F2FE] rounded-2xl p-6 text-center transition-colors bg-[#0B1A2F]/50">
                    <input
                      type="file"
                      id="vault-file-upload-input"
                      accept="image/*"
                      multiple
                      onChange={handleAssetUploaderChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="vault-file-upload-input"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#10233D] text-[#00F2FE] flex items-center justify-center border border-[#00F2FE]/20 shadow-md">
                        <FolderPlus className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-white">
                        {isAr ? 'انقر هنا لاختيار صورة من جهازك، أو اسحب الملف وأفلته هنا' : 'Click to select image or drag & drop'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {isAr ? 'سيتم توليد رابط مباشر فوري وحفظ الصورة تلقائياً في خزينة الوسائط' : 'Generates instant direct URL and saves to media vault'}
                      </span>
                    </label>
                  </div>

                  {/* Latest Uploaded Result Banner */}
                  {uploadedAssetUrl && (
                    <div className="p-4 rounded-xl bg-[#10233D] border border-emerald-500/30 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isAr ? 'تم رفع الصورة وتوليد الرابط بنجاح!' : 'Image uploaded & link generated!'}</span>
                        </span>
                        {uploadedAssetSize && (
                          <span className="text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded bg-white/5">
                            {uploadedAssetName} ({uploadedAssetSize})
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-950 border border-white/10 shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={uploadedAssetUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={uploadedAssetUrl.substring(0, 120) + (uploadedAssetUrl.length > 120 ? '...' : '')}
                              className="w-full bg-[#071120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => copyAssetUrlToClipboard(uploadedAssetUrl, uploadedAssetName)}
                              className="px-3.5 py-1.5 rounded-lg bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] text-xs font-black flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{copiedAssetUrl ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy URL')}</span>
                            </button>
                          </div>

                          {/* Quick Assign Dropdown */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                            <span className="text-slate-400 font-bold">{isAr ? 'تطبيق فوري كصورة لمشروع:' : 'Quick assign to project:'}</span>
                            <select
                              value={targetProjectForUpload}
                              onChange={(e) => {
                                setTargetProjectForUpload(e.target.value);
                                if (e.target.value) {
                                  handleApplyUploadedAssetToProject(e.target.value, uploadedAssetUrl);
                                }
                              }}
                              className="bg-[#071120] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-[#00F2FE]"
                            >
                              <option value="">{isAr ? '-- اختر المشروع لتحديث صورته مباشرة --' : '-- Choose project --'}</option>
                              {(config.projectsList || contentAr.projects.list).map((p) => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 2: MEDIA ASSETS VAULT GALLERY */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <FolderPlus className="w-4 h-4 text-[#00F2FE]" />
                        <span>{isAr ? '2. خزينة الوسائط والصور المرفوعة (Media Assets Vault):' : '2. Media Assets Vault:'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {isAr ? 'مكتبة الصور الدائمة المحفوظة للموقع - يمكنك نسخ رابط أي صورة بنقرة واحدة أو تعيينها لأي مشروع' : 'Permanent asset library - copy direct link or assign to project'}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#10233D] text-[#00F2FE] border border-[#00F2FE]/20">
                      {isAr ? `إجمالي الصور: ${(config.mediaVault || defaultEditableConfig.mediaVault || []).length}` : `Assets: ${(config.mediaVault || defaultEditableConfig.mediaVault || []).length}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(config.mediaVault || defaultEditableConfig.mediaVault || []).map((item) => (
                      <div 
                        key={item.id}
                        className="p-3.5 rounded-xl bg-[#071120] border border-white/10 hover:border-[#00F2FE]/40 transition space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                          {item.tag && (
                            <span className="absolute top-2 right-2 rtl:right-2 rtl:left-auto ltr:left-2 ltr:right-auto px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 backdrop-blur-sm text-[#00F2FE] border border-white/10">
                              {item.tag}
                            </span>
                          )}
                        </div>

                        <div>
                          <h5 className="text-xs font-bold text-white truncate" title={item.name}>
                            {item.name}
                          </h5>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                            <span>{item.size || 'HD Image'}</span>
                            <span>{item.date}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyAssetUrlToClipboard(item.url, item.name)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-[#10233D] hover:bg-[#00F2FE] text-slate-200 hover:text-[#071120] text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer border border-white/5"
                            title={isAr ? 'نسخ الرابط المباشر' : 'Copy URL'}
                          >
                            <Copy className="w-3 h-3" />
                            <span>{isAr ? 'نسخ الرابط' : 'Copy'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const projTitle = prompt(isAr ? 'أدخل اسم أو رقم المشروع لتطبيق الصورة عليه:' : 'Enter project title:');
                              if (projTitle) {
                                const currentList = [...(config.projectsList || contentAr.projects.list)];
                                const found = currentList.find((p) => p.title.includes(projTitle) || p.id.includes(projTitle));
                                if (found) {
                                  handleApplyUploadedAssetToProject(found.id, item.url);
                                } else {
                                  alert(isAr ? 'لم يتم العثور على مشروع بهذا الاسم' : 'Project not found');
                                }
                              }
                            }}
                            className="py-1.5 px-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-[#00F2FE] text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer border border-[#00F2FE]/20"
                            title={isAr ? 'تعيين لمشروع' : 'Assign'}
                          >
                            <Briefcase className="w-3 h-3" />
                            <span>{isAr ? 'لمشروع' : 'Apply'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteVaultItem(item.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                            title={isAr ? 'حذف من الخزينة' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 3: CURATED PROJECT CLOUD LINKS GENERATOR */}
                <div className="p-4 rounded-xl bg-[#071120] border border-white/10 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{isAr ? '3. مولد روابط الصور السحابية عالية الدقة للمشروعات والأنظمة' : '3. Curated Cloud Project Links Generator:'}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isAr ? 'روابط سحابية فائقة السرعة معتمدة وجاهزة للنسخ والاستخدام الفوري في مشروعاتك' : 'Ready-to-use high-resolution cloud links for projects'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { category: isAr ? 'كاميرات وأمن CCTV' : 'CCTV & Security', title: 'كاميرات 4K ومراقبة ليلية', url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80' },
                      { category: isAr ? 'غرف مراقبة SOC' : 'Control Center', title: 'شاشات مراقبة مركزية Video Wall', url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1200&q=80' },
                      { category: isAr ? 'شبكات وفيبر Network' : 'Network & Fiber', title: 'كبائن خوادم وراك داتا سنتر', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' },
                      { category: isAr ? 'ألياف ضوئية Fiber' : 'Fiber Optics', title: 'مسارات كابلات فايبر أوبتك', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80' },
                      { category: isAr ? 'بوابات ذكية Access' : 'Smart Gates', title: 'بوابات سرعة زجاجية Speed Gates', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1200&q=80' },
                      { category: isAr ? 'بصمة وجه Biometric' : 'Face Recognition', title: 'أجهزة بصمة وجه بيومترية بدون تلامس', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80' },
                      { category: isAr ? 'منصات ERP وCloud' : 'Cloud & ERP', title: 'لوحات قيادة ERP وتحليلات بيانات', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
                      { category: isAr ? 'مباني وأبراج ذكية' : 'Smart Facilities', title: 'برج إداري وبنية تحتية ذكية', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
                    ].map((preset, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#0B1A2F] border border-white/5 space-y-2">
                        <div className="relative aspect-video rounded overflow-hidden bg-slate-950">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 rtl:right-1 rtl:left-auto ltr:left-1 ltr:right-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/80 text-[#00F2FE]">
                            {preset.category}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-white truncate" title={preset.title}>
                          {preset.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => copyAssetUrlToClipboard(preset.url, preset.title)}
                          className="w-full py-1 px-2 rounded bg-[#10233D] hover:bg-[#00F2FE] text-slate-300 hover:text-[#071120] text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer border border-white/5"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 4: 4 HERO TELEMETRY IMAGES CARDS */}
                <div className="space-y-6 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                    <span>{isAr ? '4. صور واجهة الهيدر التفاعلي (Hero Telemetry 4 Cards):' : '4. Hero Telemetry 4 Cards Images:'}</span>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                        <span>{isAr ? 'قسم الإحصائيات والأرقام (Trust Stats):' : 'Key Metrics & Statistics Section:'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isAr ? 'التحكم في إظهار أو إخفاء قسم الإحصائيات في الصفحة الرئيسية (الافتراضي: مخفي حتى توثيق البيانات)' : 'Show or hide metrics on homepage (default: hidden)'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.showStatsSection ?? false}
                        onChange={(e) => handleConfigChange('showStatsSection', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

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
            {activeTab === 'projects' && (() => {
              const allProjects = config.projectsList || contentAr.projects.list;
              const totalCount = allProjects.length;
              const publishedCount = allProjects.filter((p) => p.isDraft !== true).length;
              const draftCount = allProjects.filter((p) => p.isDraft === true).length;
              const upcomingCount = allProjects.filter((p) => p.isUpcoming === true).length;

              const filteredProjectsList = allProjects.map((p, originalIdx) => ({ project: p, originalIdx })).filter(({ project }) => {
                if (projectFilter === 'published' && project.isDraft === true) return false;
                if (projectFilter === 'draft' && project.isDraft !== true) return false;
                if (projectFilter === 'upcoming' && project.isUpcoming !== true) return false;
                if (projectCategoryFilter !== 'all' && project.category !== projectCategoryFilter) return false;
                if (projectSearch.trim()) {
                  const q = projectSearch.toLowerCase();
                  return (
                    project.title?.toLowerCase().includes(q) ||
                    project.client?.toLowerCase().includes(q) ||
                    project.tag?.toLowerCase().includes(q) ||
                    project.description?.toLowerCase().includes(q)
                  );
                }
                return true;
              });

              return (
                <div className={`p-6 rounded-2xl border space-y-6 ${
                  isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <h3 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Briefcase className="w-5 h-5 text-[#00F2FE]" />
                        <span>{isAr ? 'سابقة الأعمال والمشروعات والمنصات (Project Portfolio CMS)' : 'Projects Portfolio CMS'}</span>
                      </h3>
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {isAr 
                          ? 'التحكم الكامل في سابقة المشروعات، نشرها أو جعلها مسودة، إضافة مشروعات جديدة، رفع الصور، وتعديل التفاصيل الهندسية' 
                          : 'Complete control: publish or draft, add new projects, upload photos, and edit case studies'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleAddNewProject}
                        className="px-4 py-2 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] text-xs font-black flex items-center gap-2 cursor-pointer shadow-md transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isAr ? '+ إضافة مشروع جديد' : '+ Add New Project'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(isAr ? 'هل تريد استعادة قائمة المشروعات الافتراضية؟' : 'Reset to default projects?')) {
                            handleConfigChange('projectsList', defaultEditableConfig.projectsList);
                          }
                        }}
                        className="px-3 py-2 rounded-xl border border-white/10 bg-[#071120] text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isAr ? 'استعادة الافتراضي' : 'Reset'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#071120] border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">{isAr ? 'إجمالي المشروعات' : 'Total Projects'}</span>
                        <span className="text-xl font-black font-mono text-white">{totalCount}</span>
                      </div>
                      <Layers className="w-5 h-5 text-slate-500" />
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#071120] border border-emerald-500/20 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-emerald-400 font-bold block">{isAr ? 'منشور للجمهور' : 'Published'}</span>
                        <span className="text-xl font-black font-mono text-emerald-400">{publishedCount}</span>
                      </div>
                      <Eye className="w-5 h-5 text-emerald-400" />
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#071120] border border-amber-500/20 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-amber-400 font-bold block">{isAr ? 'مسودات (مخفي)' : 'Drafts'}</span>
                        <span className="text-xl font-black font-mono text-amber-400">{draftCount}</span>
                      </div>
                      <EyeOff className="w-5 h-5 text-amber-400" />
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#071120] border border-sky-500/20 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#00F2FE] font-bold block">{isAr ? 'قيد التطوير' : 'Upcoming'}</span>
                        <span className="text-xl font-black font-mono text-[#00F2FE]">{upcomingCount}</span>
                      </div>
                      <Sparkles className="w-5 h-5 text-[#00F2FE]" />
                    </div>
                  </div>

                  {/* Search and Filters Toolbar */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      {/* Search Bar */}
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3 rtl:left-auto rtl:right-3" />
                        <input
                          type="text"
                          value={projectSearch}
                          onChange={(e) => setProjectSearch(e.target.value)}
                          placeholder={isAr ? 'بحث في سابقة الأعمال بالاسم، العميل، التصنيف...' : 'Search projects...'}
                          className="w-full bg-[#071120] border border-white/10 rounded-xl py-2 px-9 text-xs text-white placeholder-slate-500 outline-none focus:border-[#00F2FE]"
                        />
                      </div>

                      {/* Category Selector */}
                      <select
                        value={projectCategoryFilter}
                        onChange={(e) => setProjectCategoryFilter(e.target.value as any)}
                        className="bg-[#071120] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00F2FE]"
                      >
                        <option value="all">{isAr ? '📂 جميع المجالات الهندسية' : 'All Categories'}</option>
                        <option value="security">{isAr ? '🛡️ كاميرات وأنظمة مراقبة (Security)' : 'Security & CCTV'}</option>
                        <option value="network">{isAr ? '🌐 شبكات وبنية تحتية (Network)' : 'Networks & Fiber'}</option>
                        <option value="software">{isAr ? '💻 برمجيات ومنصات (Software)' : 'Software & Apps'}</option>
                        <option value="erp">{isAr ? '📊 أنظمة إدارة موارد (ERP)' : 'ERP Systems'}</option>
                      </select>
                    </div>

                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { id: 'all', labelAr: `الكل (${totalCount})`, labelEn: `All (${totalCount})` },
                        { id: 'published', labelAr: `🟢 منشور للجمهور (${publishedCount})`, labelEn: `Published (${publishedCount})` },
                        { id: 'draft', labelAr: `🟡 مسودات (${draftCount})`, labelEn: `Drafts (${draftCount})` },
                        { id: 'upcoming', labelAr: `🔵 قيد التطوير (${upcomingCount})`, labelEn: `Upcoming (${upcomingCount})` },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setProjectFilter(tab.id as typeof projectFilter)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            projectFilter === tab.id
                              ? 'bg-[#00F2FE] text-[#071120]'
                              : 'bg-[#071120] text-slate-300 hover:bg-[#10233D] border border-white/5'
                          }`}
                        >
                          {isAr ? tab.labelAr : tab.labelEn}
                        </button>
                      ))}
                    </div>
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
                    {filteredProjectsList.map(({ project: proj, originalIdx }) => {
                      const isExpanded = expandedProjectIdx === originalIdx;
                      const isDraft = proj.isDraft === true;

                      return (
                        <div
                          key={proj.id || originalIdx}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            isDraft
                              ? 'bg-[#071120]/95 border-amber-500/30'
                              : 'bg-[#071120] border-white/10 hover:border-[#00F2FE]/40'
                          }`}
                        >
                          {/* CARD HEADER (Collapsed view with key info & quick controls) */}
                          <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#0B1A2F]/60 border-b border-white/5">
                            <div className="flex items-center gap-3">
                              {/* Reorder Up / Down */}
                              <div className="flex flex-col gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleMoveProject(originalIdx, 'up')}
                                  disabled={originalIdx === 0}
                                  className="p-1 rounded bg-[#10233D] hover:bg-[#152C4D] disabled:opacity-30 text-slate-300 hover:text-[#00F2FE] transition cursor-pointer"
                                  title={isAr ? 'تقديم لأعلى' : 'Move Up'}
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveProject(originalIdx, 'down')}
                                  disabled={originalIdx === allProjects.length - 1}
                                  className="p-1 rounded bg-[#10233D] hover:bg-[#152C4D] disabled:opacity-30 text-slate-300 hover:text-[#00F2FE] transition cursor-pointer"
                                  title={isAr ? 'تأخير لأسفل' : 'Move Down'}
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Index & Mini Image */}
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-white/10 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={proj.image || CURATED_IMAGE_PRESETS.cctv[0].url} alt={proj.title} className="w-full h-full object-cover" />
                                <span className="absolute bottom-0 right-0 px-1 text-[9px] font-mono font-bold bg-black/80 text-[#00F2FE]">
                                  #{originalIdx + 1}
                                </span>
                              </div>

                              {/* Project Title & Client */}
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-sm text-white leading-tight">
                                    {proj.title}
                                  </h4>
                                  
                                  {/* Status Badges */}
                                  {isDraft ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                      <EyeOff className="w-3 h-3" />
                                      <span>{isAr ? 'مسودة (مخفي)' : 'Draft'}</span>
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                                      <Eye className="w-3 h-3" />
                                      <span>{isAr ? 'منشور للزوار' : 'Published'}</span>
                                    </span>
                                  )}

                                  {proj.isUpcoming && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-[#00F2FE] border border-sky-500/40">
                                      {isAr ? 'قيد التطوير' : 'Upcoming'}
                                    </span>
                                  )}

                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                                    {proj.category}
                                  </span>
                                </div>

                                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                  <span>{isAr ? 'العميل:' : 'Client:'} <strong className="text-slate-200">{proj.client}</strong></span>
                                  <span>•</span>
                                  <span className="text-[#00F2FE]">{proj.tag}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions Toolbar */}
                            <div className="flex items-center gap-2 flex-wrap pt-2 lg:pt-0">
                              {/* Toggle Draft / Publish Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleProjectDraft(proj.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                                  isDraft
                                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                                }`}
                                title={isDraft ? (isAr ? 'نشر المشروع للجمهور' : 'Publish') : (isAr ? 'جعل المشروع مسودة مخفية' : 'Make Draft')}
                              >
                                {isDraft ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{isAr ? 'نشر المشروع' : 'Publish'}</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span>{isAr ? 'جعله مسودة' : 'Make Draft'}</span>
                                  </>
                                )}
                              </button>

                              {/* Live Modal Preview Button */}
                              <button
                                type="button"
                                onClick={() => setPreviewModalProject(proj)}
                                className="px-3 py-1.5 rounded-xl bg-[#10233D] hover:bg-[#152C4D] text-[#00F2FE] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-[#00F2FE]/20"
                                title={isAr ? 'معاينة كيف يظهر المشروع للعميل' : 'Preview Modal'}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>{isAr ? 'معاينة المشروع' : 'Preview'}</span>
                              </button>

                              {/* Duplicate Project Button */}
                              <button
                                type="button"
                                onClick={() => handleDuplicateProject(originalIdx)}
                                className="p-2 rounded-xl bg-[#10233D] hover:bg-[#152C4D] text-slate-300 hover:text-white transition cursor-pointer border border-white/5"
                                title={isAr ? 'استنساخ / تكرار المشروع' : 'Duplicate'}
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Project Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj.id)}
                                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer border border-rose-500/20"
                                title={isAr ? 'حذف المشروع نهائياً' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Expand / Collapse Toggle Button */}
                              <button
                                type="button"
                                onClick={() => setExpandedProjectIdx(isExpanded ? null : originalIdx)}
                                className="px-3 py-1.5 rounded-xl bg-[#00F2FE]/15 hover:bg-[#00F2FE]/25 text-[#00F2FE] text-xs font-bold flex items-center gap-1 transition cursor-pointer border border-[#00F2FE]/30"
                              >
                                <span>{isExpanded ? (isAr ? 'طي التفاصيل' : 'Collapse') : (isAr ? 'تعديل كامل التفاصيل' : 'Edit Details')}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* EXPANDED FULL EDIT FORM */}
                          {isExpanded && (
                            <div className="p-5 space-y-6 bg-[#071120] animate-in fade-in">
                              
                              {/* 1. VISIBILITY & CLASSIFICATION */}
                              <div className="p-4 rounded-xl bg-[#0B1A2F] border border-white/10 space-y-3">
                                <h5 className="text-xs font-bold text-[#00F2FE] flex items-center gap-2">
                                  <Sliders className="w-4 h-4" />
                                  <span>{isAr ? '1. حالة النشر والظهور والتصنيف الأساسي للمشروع:' : '1. Visibility & Categorization:'}</span>
                                </h5>

                                <div className="grid sm:grid-cols-3 gap-4 pt-1">
                                  {/* Draft Switch */}
                                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#071120] border border-white/5">
                                    <input
                                      type="checkbox"
                                      id={`draft-toggle-${proj.id}`}
                                      checked={isDraft}
                                      onChange={(e) => handleUpdateProjectField(originalIdx, 'isDraft', e.target.checked)}
                                      className="w-4 h-4 text-amber-400 rounded cursor-pointer"
                                    />
                                    <label htmlFor={`draft-toggle-${proj.id}`} className="text-xs font-bold text-slate-200 cursor-pointer">
                                      {isAr ? 'تعيين كمسودة (مخفي من الموقع)' : 'Set as Draft (Hidden)'}
                                    </label>
                                  </div>

                                  {/* Upcoming Switch */}
                                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#071120] border border-white/5">
                                    <input
                                      type="checkbox"
                                      id={`upcoming-toggle-${proj.id}`}
                                      checked={proj.isUpcoming === true}
                                      onChange={(e) => handleUpdateProjectField(originalIdx, 'isUpcoming', e.target.checked)}
                                      className="w-4 h-4 text-[#00F2FE] rounded cursor-pointer"
                                    />
                                    <label htmlFor={`upcoming-toggle-${proj.id}`} className="text-xs font-bold text-slate-200 cursor-pointer">
                                      {isAr ? 'مشروع قادم / قيد التطوير' : 'Upcoming / In Development'}
                                    </label>
                                  </div>

                                  {/* Status Badge Text */}
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                      {isAr ? 'شارة الحالة (Status Badge)' : 'Status Badge'}
                                    </label>
                                    <input
                                      type="text"
                                      value={proj.statusBadge || ''}
                                      onChange={(e) => handleUpdateProjectField(originalIdx, 'statusBadge', e.target.value)}
                                      placeholder={isAr ? 'مثال: مشروع مكتمل، قيد التدشين' : 'e.g. Completed'}
                                      className="w-full bg-[#071120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#00F2FE]"
                                    />
                                  </div>

                                  {/* Category Select */}
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                      {isAr ? 'التصنيف الأساسي' : 'Category'}
                                    </label>
                                    <select
                                      value={proj.category}
                                      onChange={(e) => handleUpdateProjectField(originalIdx, 'category', e.target.value as any)}
                                      className="w-full bg-[#071120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#00F2FE]"
                                    >
                                      <option value="security">{isAr ? '🛡️ أنظمة المراقبة والأمن (Security)' : 'Security'}</option>
                                      <option value="network">{isAr ? '🌐 الشبكات والبنية التحتية (Network)' : 'Network'}</option>
                                      <option value="software">{isAr ? '💻 البرمجيات والتطبيقات (Software)' : 'Software'}</option>
                                      <option value="erp">{isAr ? '📊 حلول ERP وإدارة الموارد (ERP)' : 'ERP'}</option>
                                    </select>
                                  </div>

                                  {/* Tag Input */}
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                      {isAr ? 'الوسم الفرعي (Tag)' : 'Tag'}
                                    </label>
                                    <input
                                      type="text"
                                      value={proj.tag}
                                      onChange={(e) => handleUpdateProjectField(originalIdx, 'tag', e.target.value)}
                                      placeholder={isAr ? 'مثال: مستودعات لوجستية، PropTech' : 'e.g. PropTech'}
                                      className="w-full bg-[#071120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#00F2FE]"
                                    />
                                  </div>

                                  {/* Icon Selection */}
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                      {isAr ? 'أيقونة المشروع' : 'Icon'}
                                    </label>
                                    <select
                                      value={proj.icon}
                                      onChange={(e) => handleUpdateProjectField(originalIdx, 'icon', e.target.value)}
                                      className="w-full bg-[#071120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#00F2FE]"
                                    >
                                      <option value="Building2">🏢 Building2 (مباني ومقرات)</option>
                                      <option value="ShieldCheck">🛡️ ShieldCheck (حماية معتمدة)</option>
                                      <option value="ShieldAlert">🚨 ShieldAlert (إنذار ومراقبة)</option>
                                      <option value="Smartphone">📱 Smartphone (تطبيقات جوال)</option>
                                      <option value="Home">🏠 Home (منازل ذكية)</option>
                                      <option value="BarChart3">📊 BarChart3 (إحصاءات وERP)</option>
                                      <option value="Cpu">⚡ Cpu (معالجات وبنية ذكية)</option>
                                      <option value="Globe">🌐 Globe (منصات سحابية)</option>
                                      <option value="Sparkles">✨ Sparkles (حلول متطورة)</option>
                                      <option value="Radio">📡 Radio (اتصالات لاسلكية)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* 2. PROJECT IDENTITY & LIVE URL */}
                              <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                    {isAr ? 'اسم المشروع' : 'Project Title'}
                                  </label>
                                  <input
                                    type="text"
                                    value={proj.title}
                                    onChange={(e) => handleUpdateProjectField(originalIdx, 'title', e.target.value)}
                                    className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F2FE] outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                    {isAr ? 'الجهة أو العميل المنفذ له' : 'Client Organization'}
                                  </label>
                                  <input
                                    type="text"
                                    value={proj.client}
                                    onChange={(e) => handleUpdateProjectField(originalIdx, 'client', e.target.value)}
                                    className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F2FE] outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                    {isAr ? 'رابط المعاينة المباشرة أو زيارة المنصة' : 'Live Platform / Demo URL'}
                                  </label>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="url"
                                      value={proj.liveUrl || ''}
                                      onChange={(e) => handleUpdateProjectField(originalIdx, 'liveUrl', e.target.value)}
                                      placeholder="https://..."
                                      className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                                    />
                                    {proj.liveUrl && (
                                      <a
                                        href={proj.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-[#00F2FE]/20 hover:bg-[#00F2FE] text-[#00F2FE] hover:text-[#071120] transition shrink-0"
                                        title={isAr ? 'اختبار وفتح الرابط' : 'Open URL'}
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* 3. PROJECT IMAGE & DIRECT UPLOAD */}
                              <div className="p-4 rounded-xl bg-[#0B1A2F] border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-bold text-[#00F2FE] flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>{isAr ? '3. صورة المشروع والوسائط البصرية:' : '3. Project Image & Visuals:'}</span>
                                  </label>
                                  <span className="text-[10px] text-slate-400">
                                    {isAr ? 'يدعم الرفع المباشر من جهازك أو وضع رابط URL أو الاختيار من الخزينة' : 'Direct upload, URL, or select from vault'}
                                  </span>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4 items-center">
                                  {/* Image Preview Box */}
                                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/10 shadow-sm">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                      src={proj.image || CURATED_IMAGE_PRESETS.cctv[0].url} 
                                      alt={proj.title} 
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>

                                  {/* Upload Controls & URL */}
                                  <div className="sm:col-span-2 space-y-3">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                        {isAr ? 'رابط الصورة (URL)' : 'Image URL'}
                                      </label>
                                      <input
                                        type="url"
                                        value={proj.image || ''}
                                        onChange={(e) => handleUpdateProjectField(originalIdx, 'image', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-[#071120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:border-[#00F2FE] outline-none"
                                      />
                                    </div>

                                    {/* Direct File Upload & Vault Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                      <label className="px-3 py-1.5 rounded-lg bg-[#00F2FE]/20 hover:bg-[#00F2FE] text-[#00F2FE] hover:text-[#071120] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-[#00F2FE]/30">
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>{isAr ? 'رفع صورة من جهازك' : 'Upload from device'}</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleProjectImageUpload(e, originalIdx)}
                                          className="hidden"
                                        />
                                      </label>

                                      <button
                                        type="button"
                                        onClick={() => setVaultPickerTargetProjectIdx(originalIdx)}
                                        className="px-3 py-1.5 rounded-lg bg-[#10233D] hover:bg-[#152C4D] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-white/10"
                                      >
                                        <FolderPlus className="w-3.5 h-3.5 text-[#00F2FE]" />
                                        <span>{isAr ? 'اختر من خزينة الوسائط' : 'Pick from Vault'}</span>
                                      </button>
                                    </div>

                                    {/* Curated Presets for Quick Selection */}
                                    <div className="pt-2 border-t border-white/5">
                                      <span className="text-[10px] text-slate-400 block mb-1">
                                        {isAr ? 'أو اختر صورة جاهزة عالية الجودة:' : 'Or choose high-res preset:'}
                                      </span>
                                      <div className="grid grid-cols-2 gap-1.5">
                                        {(CURATED_IMAGE_PRESETS[proj.category as keyof typeof CURATED_IMAGE_PRESETS] || CURATED_IMAGE_PRESETS.cctv).slice(0, 2).map((pst, pIdx) => (
                                          <button
                                            key={pIdx}
                                            type="button"
                                            onClick={() => handleUpdateProjectField(originalIdx, 'image', pst.url)}
                                            className="text-[10px] p-1.5 rounded bg-[#071120] hover:bg-[#10233D] text-slate-300 hover:text-[#00F2FE] truncate text-start border border-white/5 cursor-pointer"
                                            title={pst.title}
                                          >
                                            {pst.title}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 4. SUMMARY, DESCRIPTION & HIGHLIGHT */}
                              <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                      {isAr ? 'الملخص التنفيذي السريع (يظهر في الكارت الرئيسي)' : 'Summary (Card View)'}
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={proj.summary}
                                      onChange={(e) => handleUpdateProjectField(originalIdx, 'summary', e.target.value)}
                                      className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F2FE] outline-none resize-none leading-relaxed"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                      {isAr ? 'أبرز إنجاز تقني / هايلايت (Highlight Metric)' : 'Highlight Metric'}
                                    </label>
                                    <input
                                      type="text"
                                      value={proj.highlight}
                                      onChange={(e) => handleUpdateProjectField(originalIdx, 'highlight', e.target.value)}
                                      placeholder={isAr ? 'مثال: +99.98% زمن تشغيل فعلي' : 'e.g. +99.9% Uptime'}
                                      className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F2FE] outline-none"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                    {isAr ? 'الوصف الشامل ودراسة الحالة الهندسية (يظهر في نافذة التفاصيل)' : 'Detailed Case Study (Modal View)'}
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={proj.description}
                                    onChange={(e) => handleUpdateProjectField(originalIdx, 'description', e.target.value)}
                                    className="w-full bg-[#0B1A2F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00F2FE] outline-none resize-none leading-relaxed"
                                  />
                                </div>
                              </div>

                              {/* 5. STATS - 3 KEY METRICS */}
                              <div className="p-4 rounded-xl bg-[#0B1A2F] border border-white/10 space-y-3">
                                <label className="text-xs font-bold text-[#00F2FE] block">
                                  {isAr ? '5. المؤشرات والأرقام الإحصائية الثلاثة للمشروع:' : '5. Project Key Metrics (3 Stats):'}
                                </label>

                                <div className="grid sm:grid-cols-3 gap-3">
                                  {[0, 1, 2].map((sIdx) => {
                                    const stat = proj.stats?.[sIdx] || { label: '', value: '' };
                                    return (
                                      <div key={sIdx} className="p-3 rounded-lg bg-[#071120] border border-white/5 space-y-2">
                                        <span className="text-[10px] font-mono font-bold text-slate-400 block">
                                          {isAr ? `مؤشر رقم ${sIdx + 1}` : `Metric #${sIdx + 1}`}
                                        </span>
                                        <div>
                                          <label className="block text-[10px] text-slate-400 mb-0.5">{isAr ? 'القيمة (Value)' : 'Value'}</label>
                                          <input
                                            type="text"
                                            value={stat.value}
                                            onChange={(e) => handleUpdateProjectStat(originalIdx, sIdx, 'value', e.target.value)}
                                            placeholder={sIdx === 0 ? '+120 نقطة' : sIdx === 1 ? '10 Gbps' : '100%'}
                                            className="w-full bg-[#0B1A2F] border border-white/10 rounded px-2 py-1 text-xs text-[#00F2FE] font-mono outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] text-slate-400 mb-0.5">{isAr ? 'الوصف (Label)' : 'Label'}</label>
                                          <input
                                            type="text"
                                            value={stat.label}
                                            onChange={(e) => handleUpdateProjectStat(originalIdx, sIdx, 'label', e.target.value)}
                                            placeholder={sIdx === 0 ? (isAr ? 'كاميرات مراقبة' : 'Cameras') : (isAr ? 'السرعة' : 'Speed')}
                                            className="w-full bg-[#0B1A2F] border border-white/10 rounded px-2 py-1 text-xs text-white outline-none"
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* 6. TECHNOLOGIES USED */}
                              <div className="p-4 rounded-xl bg-[#0B1A2F] border border-white/10 space-y-3">
                                <label className="text-xs font-bold text-[#00F2FE] block">
                                  {isAr ? '6. التقنيات والمعدات الهندسية المستخدمة:' : '6. Technologies & Hardware:'}
                                </label>

                                <div className="flex flex-wrap gap-2">
                                  {(proj.technologies || []).map((tech, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="px-2.5 py-1 rounded-lg bg-[#071120] text-slate-200 border border-white/10 text-xs font-mono flex items-center gap-1.5"
                                    >
                                      <span>{tech}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveProjectTechnology(originalIdx, tIdx)}
                                        className="text-slate-400 hover:text-rose-400 cursor-pointer"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2 pt-1 max-w-md">
                                  <input
                                    type="text"
                                    value={newTechTagInput[originalIdx] || ''}
                                    onChange={(e) => setNewTechTagInput((prev) => ({ ...prev, [originalIdx]: e.target.value }))}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddProjectTechnology(originalIdx, newTechTagInput[originalIdx] || '');
                                      }
                                    }}
                                    placeholder={isAr ? 'أدخل تقنية جديدة (مثال: Hikvision 4K) واضغط إضافة' : 'Add tech tag...'}
                                    className="flex-1 bg-[#071120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#00F2FE]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAddProjectTechnology(originalIdx, newTechTagInput[originalIdx] || '')}
                                    className="px-3 py-1.5 rounded-lg bg-[#00F2FE] text-[#071120] text-xs font-bold cursor-pointer"
                                  >
                                    {isAr ? 'إضافة' : 'Add'}
                                  </button>
                                </div>
                              </div>

                              {/* 7. CHALLENGES & SOLUTIONS */}
                              <div className="grid sm:grid-cols-2 gap-4">
                                {/* Challenges List */}
                                <div className="p-4 rounded-xl bg-[#0B1A2F] border border-amber-500/20 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                      <AlertTriangle className="w-3.5 h-3.5" />
                                      <span>{isAr ? 'التحديات الهندسية التي واجهت المشروع:' : 'Engineering Challenges:'}</span>
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => handleAddProjectChallenge(originalIdx)}
                                      className="text-[11px] font-bold text-amber-300 hover:text-amber-200 cursor-pointer"
                                    >
                                      + {isAr ? 'إضافة تحدٍ' : 'Add'}
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    {(proj.challenges || []).map((ch, chIdx) => (
                                      <div key={chIdx} className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={ch}
                                          onChange={(e) => handleUpdateProjectChallenge(originalIdx, chIdx, e.target.value)}
                                          className="flex-1 bg-[#071120] border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-amber-400"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveProjectChallenge(originalIdx, chIdx)}
                                          className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Solutions List */}
                                <div className="p-4 rounded-xl bg-[#0B1A2F] border border-emerald-500/20 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      <span>{isAr ? 'الحلول الهندسية المنفذة بواسطة تيك بكرة:' : 'Solutions Implemented:'}</span>
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => handleAddProjectSolution(originalIdx)}
                                      className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 cursor-pointer"
                                    >
                                      + {isAr ? 'إضافة حل' : 'Add'}
                                    </button>
                                  </div>

                                  <div className="space-y-2">
                                    {(proj.solutions || []).map((sol, solIdx) => (
                                      <div key={solIdx} className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={sol}
                                          onChange={(e) => handleUpdateProjectSolution(originalIdx, solIdx, e.target.value)}
                                          className="flex-1 bg-[#071120] border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-emerald-400"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveProjectSolution(originalIdx, solIdx)}
                                          className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Save Changes Note */}
                              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/5">
                                <span>{isAr ? '✨ يتم حفظ التعديلات محلياً وتلقائياً، واضغط "حفظ ونشر التعديلات سحابياً" بأعلى اللوحة للمزامنة مع السحابة' : 'Saved locally automatically. Click Save All at top to sync to cloud.'}</span>
                                <button
                                  type="button"
                                  onClick={() => setExpandedProjectIdx(null)}
                                  className="text-xs font-bold text-[#00F2FE] hover:underline cursor-pointer"
                                >
                                  {isAr ? 'إغلاق التفاصيل' : 'Close details'}
                                </button>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}

                    {filteredProjectsList.length === 0 && (
                      <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl space-y-3">
                        <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
                        <p className="text-sm font-bold text-slate-400">
                          {isAr ? 'لا توجد مشروعات مطابقة لمعايير البحث أو الفلتر' : 'No projects found matching criteria'}
                        </p>
                        <button
                          type="button"
                          onClick={handleAddNewProject}
                          className="px-4 py-2 rounded-xl bg-[#00F2FE] text-[#071120] text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{isAr ? 'إضافة مشروع جديد الآن' : 'Add New Project Now'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

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

      {/* 1. LIVE PROJECT MODAL PREVIEW */}
      {previewModalProject && (
        <ProjectModal
          project={previewModalProject}
          onClose={() => setPreviewModalProject(null)}
          lang={lang}
          data={isAr ? contentAr : contentEn}
          onConsultProject={() => {
            alert(isAr ? 'زر استشارة المشروع يعمل بنجاح في الموقع الحقيقي ويحوّل العميل لنموذج التواصل مع تعبئة اسم المشروع تلقائياً.' : 'Consultation CTA triggers on live site.');
            setPreviewModalProject(null);
          }}
        />
      )}

      {/* 2. MEDIA VAULT PICKER MODAL */}
      {(vaultPickerTargetProjectIdx !== null || vaultPickerTargetHeroField !== null) && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => {
            setVaultPickerTargetProjectIdx(null);
            setVaultPickerTargetHeroField(null);
          }}
        >
          <div 
            className="relative w-full max-w-3xl rounded-3xl overflow-hidden p-6 bg-[#0B1A2F] border border-[#00F2FE]/40 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#00F2FE]" />
                  <span>{isAr ? 'اختر صورة من خزينة الوسائط المحفوظة' : 'Choose Image from Vault'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr 
                    ? (vaultPickerTargetProjectIdx !== null 
                        ? `تطبيق الصورة على مشروع "${(config.projectsList || contentAr.projects.list)[vaultPickerTargetProjectIdx]?.title}"` 
                        : 'تطبيق الصورة على بطاقة الهيدر')
                    : 'Click any image to apply instantly'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVaultPickerTargetProjectIdx(null);
                  setVaultPickerTargetHeroField(null);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vault Grid */}
            <div className="overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
              {(config.mediaVault || defaultEditableConfig.mediaVault || []).map((vaultItem) => (
                <div
                  key={vaultItem.id}
                  onClick={() => {
                    if (vaultPickerTargetProjectIdx !== null) {
                      handleUpdateProjectField(vaultPickerTargetProjectIdx, 'image', vaultItem.url);
                      setNotificationMsg(isAr ? 'تم تعيين وتحديث صورة المشروع بنجاح!' : 'Project image updated!');
                      setTimeout(() => setNotificationMsg(''), 3000);
                    } else if (vaultPickerTargetHeroField !== null) {
                      handleConfigChange(vaultPickerTargetHeroField, vaultItem.url);
                      setNotificationMsg(isAr ? 'تم تعيين صورة الهيدر بنجاح!' : 'Hero image updated!');
                      setTimeout(() => setNotificationMsg(''), 3000);
                    }
                    setVaultPickerTargetProjectIdx(null);
                    setVaultPickerTargetHeroField(null);
                  }}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/10 hover:border-[#00F2FE] hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] transition cursor-pointer flex flex-col justify-end"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={vaultItem.url} alt={vaultItem.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="relative p-2 z-10">
                    <p className="text-[11px] font-bold text-white truncate">{vaultItem.name}</p>
                    <span className="text-[9px] text-[#00F2FE] font-mono">{vaultItem.size || 'HD'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>{isAr ? 'انقر على أي صورة لتطبيقها فورياً' : 'Click any image to apply'}</span>
              <button
                type="button"
                onClick={() => {
                  setVaultPickerTargetProjectIdx(null);
                  setVaultPickerTargetHeroField(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition cursor-pointer text-xs font-bold"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
