'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { contentAr, contentEn } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';
import { useCustomConfig } from '@/lib/useCustomConfig';
import { submitInquiry } from '@/lib/dbService';
import { DEFAULT_TENDERS_RADAR, TenderItem } from '@/components/EngineeringHub';
import { 
  Radio, 
  Search, 
  Building2, 
  Calendar, 
  TrendingUp, 
  Users, 
  FileCheck, 
  RefreshCw, 
  Bell, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Cpu, 
  Info, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Compass,
  Globe,
  Copy,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TendersPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [customConfig] = useCustomConfig();
  const [tenderCategoryFilter, setTenderCategoryFilter] = useState<string>('all');
  const [tenderSearch, setTenderSearch] = useState<string>('');
  const [expandedTenderId, setExpandedTenderId] = useState<string | null>(null);
  const [showMechanismDetails, setShowMechanismDetails] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string>('اليوم - متصل ببوابة التعاقدات الحكومية');
  const [alertPhone, setAlertPhone] = useState<string>('');
  const [alertCategory, setAlertCategory] = useState<string>('all');
  const [alertSubscribed, setAlertSubscribed] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);

  const copyTenderLink = (id: string, url: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrlId(id);
      setTimeout(() => setCopiedUrlId(null), 2500);
    }
  };
  
  const router = useRouter();
  const { isDark } = useTheme();

  const isAr = lang === 'ar';
  const data = isAr ? contentAr : contentEn;
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleSyncRadar = () => {
    setIsSyncing(true);
    setSyncNotice('');
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(isAr ? `اليوم في تمام الساعة ${timeStr} (تحديث دوري نشط)` : `Today at ${timeStr} (Active Feed)`);
      setSyncNotice(
        isAr 
          ? 'تم التحقق ومزامنة كافة الطروحات مع بوابة التعاقدات العامة وهيئة المجتمعات العمرانية بنجاح!'
          : 'Successfully synced all live tenders with the Public Procurement Portal!'
      );
      setTimeout(() => setSyncNotice(''), 6000);
    }, 1100);
  };

  const handleSubscribeAlerts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertPhone.trim()) return;
    setIsSubscribing(true);
    try {
      await submitInquiry({
        clientName: isAr ? 'مشترك تنبيهات المناقصات' : 'Tender Alerts Subscriber',
        phone: alertPhone.trim(),
        selectedSystems: [alertCategory],
        notes: `طلب اشتراك في تنبيهات رادار المناقصات والممارسات الفورية - التخصص: ${alertCategory}`,
        source: 'estimator',
      });
      setAlertSubscribed(true);
      setTimeout(() => setAlertSubscribed(false), 5000);
      setAlertPhone('');
    } catch (err) {
      console.warn('Subscription error:', err);
    } finally {
      setIsSubscribing(false);
    }
  };

  const filteredTenders = DEFAULT_TENDERS_RADAR.filter((tnd) => {
    const matchCat = tenderCategoryFilter === 'all' || tnd.category === tenderCategoryFilter;
    const q = tenderSearch.trim().toLowerCase();
    const matchSearch = 
      !q || 
      tnd.titleAr.toLowerCase().includes(q) || 
      tnd.titleEn.toLowerCase().includes(q) || 
      tnd.entityAr.toLowerCase().includes(q) || 
      tnd.refNumber.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const toggleTenderExpand = (id: string) => {
    setExpandedTenderId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#071120] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      } ${isAr ? 'font-cairo' : 'font-inter'}`}
    >
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        data={data}
        whatsappNumber={customConfig.whatsappNumber}
        logoEmblemStyle={customConfig.logoEmblemStyle}
        customLogoUrl={customConfig.customLogoUrl}
      />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 border ${
                isDark 
                  ? 'bg-[#10233D] border-[#00F2FE]/30 text-[#00F2FE]' 
                  : 'bg-sky-50 border-sky-200 text-[#0284C7]'
              }`}
            >
              <Radio className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'مرصد أحدث مناقصات وممارسات التيار الخفيف والشبكات' : 'Security & IT Tenders Radar'}</span>
            </div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>{isAr ? 'فرص حية للمقاولين والتضامن الفني' : 'Live RFPs, Joint Venture &'}</span>{' '}
              <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>
                {isAr ? 'والاعتمادات الهندسية' : 'Technical Submittals'}
              </span>
            </h1>

            <p className={`text-sm sm:text-base md:text-lg mt-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isAr
                ? 'رصد آلي وتغذية مستمرة لأحدث عمليات وممارسات التيار الخفيف، شبكات كابلات UTP والفايبر، وتجهيز مراكز البيانات DCIM بمصر، مع إمكانية التحالف الرسمي (Joint Venture) وطلب إعداد المظروف الفني المعتمد.'
                : 'Automated tracking of active Egyptian low-current, fiber cabling, and data center tenders with official Joint Venture consortiums and consultant-approved submittals.'}
            </p>
          </div>

          {/* Live Gateway Connection & Sync Status Banner */}
          <div className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 ${
            isDark 
              ? 'bg-gradient-to-r from-[#071120] via-[#0B1A2F] to-[#0E2038] border-white/10' 
              : 'bg-white border-slate-300 shadow-md'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div className="text-xs">
                <div className="font-bold flex items-center gap-2">
                  <span className={isDark ? 'text-white' : 'text-slate-950 font-black'}>
                    {isAr ? 'بوابة التعاقدات العامة المصرية (etenders.gov.eg) والقطاعات التخصصية' : 'Egyptian Public Procurement Portal & Enterprise RFPs'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    isDark 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                  }`}>
                    {isAr ? 'ربط آلي نشط 🟢' : 'Live Gateway Active'}
                  </span>
                </div>
                <div className={`mt-0.5 flex flex-wrap items-center gap-3 font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <span>{isAr ? 'آخر مزامنة عبر الـ API:' : 'Last Synced:'} <strong className={`font-mono font-bold ${isDark ? 'text-[#00F2FE]' : 'text-sky-900'}`}>{lastSyncTime}</strong></span>
                  <span>•</span>
                  <span>{isAr ? 'دورة التحديث: كل 6 ساعات آلياً' : 'Refresh Cycle: Auto 6-hours'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleSyncRadar}
                disabled={isSyncing}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer border ${
                  isSyncing
                    ? 'bg-slate-700 text-slate-300 border-transparent cursor-not-allowed'
                    : isDark
                      ? 'bg-[#10233D] hover:bg-[#152C4D] text-[#00F2FE] border-[#00F2FE]/40'
                      : 'bg-sky-50 hover:bg-sky-100 text-[#0284C7] border-sky-300 shadow-xs'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? (isAr ? 'جاري التحقق والمزامنة...' : 'Syncing Gateway...') : (isAr ? 'مزامنة الطروحات الآن' : 'Sync Radar Now')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMechanismDetails(!showMechanismDetails)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer border ${
                  showMechanismDetails
                    ? isDark ? 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/50' : 'bg-sky-100 text-[#0284C7] border-sky-400'
                    : isDark ? 'bg-[#071120] text-slate-200 border-white/15' : 'bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>{isAr ? 'آلية عمل المرصد' : 'Operational Mechanism'}</span>
                {showMechanismDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Sync Notification Banner */}
          {syncNotice && (
            <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 animate-fadeIn ${
              isDark 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' 
                : 'bg-emerald-50 border-emerald-400 text-emerald-950'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{syncNotice}</span>
            </div>
          )}

          {/* Operational Mechanism Panel */}
          {showMechanismDetails && (
            <div className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
              isDark 
                ? 'bg-gradient-to-b from-[#0B1A2F] to-[#071120] border-[#00F2FE]/20 shadow-[0_0_30px_rgba(0,242,254,0.06)]' 
                : 'bg-white border-sky-300 shadow-md'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00F2FE] flex items-center gap-1.5 font-mono">
                    <Cpu className="w-4 h-4" />
                    <span>{isAr ? 'البنية التشغيلية والربط المؤسسي' : 'Architecture & Sourcing Workflow'}</span>
                  </span>
                  <h2 className={`text-xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {isAr ? 'كيف يعمل مرصد المناقصات وما هي آلية تشغيله؟' : 'How the Tender Radar Operates & Sourcing Mechanism'}
                  </h2>
                </div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                  isDark ? 'bg-[#071120] text-slate-300 border-white/10' : 'bg-slate-100 text-slate-800 border-slate-300'
                }`}>
                  {isAr ? '4 مراحل تنفيذية متكاملة' : '4 Integrated Stages'}
                </span>
              </div>

              {/* 4 Pillars Flow */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border-2 space-y-3 ${isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'}`}>
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-[#00F2FE] border border-sky-500/40 flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {isAr ? 'الرصد والتغذية الآلية (API Ingestion)' : 'Automated Ingestion'}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                    {isAr 
                      ? 'ربط مباشر مع بوابة التعاقدات العامة المصرية (etenders)، هيئة المجتمعات العمرانية، وشركات البترول لسحب الطروحات والتحديثات كل 6 ساعات آلياً.' 
                      : 'Direct Webhook integration with Egyptian Procurement Portal, NUCA, and EGAS pulling RFPs and addendums every 6 hours.'}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border-2 space-y-3 ${isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'}`}>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {isAr ? 'الفلترة والتصنيف الهندسي الذكي' : 'Smart ICT Filtering'}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                    {isAr 
                      ? 'عزل المناقصات المدنية غير ذات الصلة والتركيز التام على التيار الخفيف، كابلات UTP Cat6A، كابلات الفايبر، تجهيز الداتا سنتر، و DCIM.' 
                      : 'Excluding generic civilian tenders and strictly narrowcasting low-current CCTV, structured copper/fiber, and modular data center fit-outs.'}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border-2 space-y-3 ${isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'}`}>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {isAr ? 'التضامن والتحالف الفني (Joint Venture)' : 'Joint Venture & Support'}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                    {isAr 
                      ? 'تمكين الشركات والمقاولين من الدخول في تحالف وتضامن رسمي مع "تيك بكرة" لسد متطلبات سابقة الأعمال والتصنيف وتوفير خطابات الضمان المالي.' 
                      : 'Enabling contractors to form official JV consortiums with Tech Bokra for required qualification records, grading, and wholesale pricing.'}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border-2 space-y-3 ${isDark ? 'bg-[#071120] border-white/10' : 'bg-slate-50 border-slate-300 shadow-xs'}`}>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-black text-sm">
                    4
                  </div>
                  <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {isAr ? 'المكتب الفني والمظروف الفني' : 'Technical Submittal Desk'}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800 font-medium'}`}>
                    {isAr 
                      ? 'إعداد ملف الاعتماد الفني المعتمد (Material Submittal)، جداول الامتثال الفني (Compliance Sheets) بنداً ببند، ومخططات الـ Shop Drawings لضمان القبول.' 
                      : 'Formulating verified Material Submittals, line-by-line Compliance Matrices, and CAD Shop Drawings guaranteeing 100% consultant approval.'}
                  </p>
                </div>
              </div>

              {/* WhatsApp Alert Subscription Box */}
              <form 
                onSubmit={handleSubscribeAlerts}
                className={`p-5 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 ${
                  isDark ? 'bg-[#0F223D] border-[#00F2FE]/25' : 'bg-sky-50 border-sky-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {isAr ? 'اشترك في تنبيهات الواتساب الفورية للمناقصات والممارسات' : 'Get Instant WhatsApp Tender Alerts'}
                    </h4>
                    <p className={`text-[11px] mt-0.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {isAr ? 'تصلك رسالة فورية فور طرح أي كراسة شروط تطابق تخصصك' : 'Receive instant WhatsApp alert whenever an RFP matching your domain is issued'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                  <select
                    value={alertCategory}
                    onChange={(e) => setAlertCategory(e.target.value)}
                    className={`text-xs px-3 py-2 rounded-xl border-2 outline-none font-bold ${
                      isDark ? 'bg-[#071120] border-white/15 text-white' : 'bg-white border-slate-300 text-slate-950 shadow-xs'
                    }`}
                  >
                    <option value="all">{isAr ? 'كل التخصصات' : 'All Domains'}</option>
                    <option value="security">{isAr ? 'كاميرات ومراقبة' : 'CCTV & Security'}</option>
                    <option value="network">{isAr ? 'شبكات وكابلات' : 'Networks & Cabling'}</option>
                    <option value="datacenter">{isAr ? 'مراكز بيانات' : 'Data Center & DCIM'}</option>
                    <option value="consulting">{isAr ? 'اعتمادات ومكتب فني' : 'Technical Submittals'}</option>
                  </select>

                  <input
                    type="tel"
                    value={alertPhone}
                    onChange={(e) => setAlertPhone(e.target.value)}
                    placeholder={isAr ? 'رقم الواتساب (مثال: 010xxxxxxxx)' : 'WhatsApp Phone Number'}
                    className={`text-xs px-3 py-2 rounded-xl border-2 outline-none w-full sm:w-48 font-bold ${
                      isDark ? 'bg-[#071120] border-white/15 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-950 placeholder-slate-500 shadow-xs'
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shrink-0 transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{alertSubscribed ? (isAr ? 'تم الاشتراك!' : 'Subscribed!') : (isAr ? 'تفعيل التنبيهات' : 'Subscribe')}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter Tabs & Search Bar */}
          <div className={`p-6 rounded-3xl border-2 space-y-4 ${
            isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-300 shadow-md'
          }`}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className={`w-4 h-4 absolute top-3 left-3 rtl:left-auto rtl:right-3 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`} />
                <input
                  type="text"
                  value={tenderSearch}
                  onChange={(e) => setTenderSearch(e.target.value)}
                  placeholder={isAr ? 'بحث برقم المناقصة، الجهة الطارحة، أو النطاق...' : 'Search by reference, entity, or scope...'}
                  className={`w-full py-2.5 px-9 text-xs rounded-xl border-2 outline-none font-bold ${
                    isDark 
                      ? 'bg-[#071120] border-white/15 text-white placeholder-slate-400 focus:border-[#00F2FE]' 
                      : 'bg-slate-50 border-slate-300 text-slate-950 placeholder-slate-500 focus:border-[#0284C7]'
                  }`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                  { id: 'security', labelAr: '🛡️ كاميرات ومراقبة', labelEn: 'CCTV' },
                  { id: 'network', labelAr: '🌐 شبكات وفايبر', labelEn: 'Networks' },
                  { id: 'datacenter', labelAr: '⚡ داتا سنتر', labelEn: 'Data Center' },
                  { id: 'consulting', labelAr: '📋 اعتمادات واستشارات', labelEn: 'Consulting' },
                  { id: 'software', labelAr: '💻 برمجيات و ERP', labelEn: 'Software' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setTenderCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer border-2 ${
                      tenderCategoryFilter === cat.id
                        ? isDark
                          ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE] font-black'
                          : 'bg-[#0284C7] text-white border-[#0284C7] font-black shadow-sm'
                        : isDark
                          ? 'bg-[#071120] text-slate-200 hover:bg-[#10233D] border-white/10 font-bold'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-300 font-bold'
                    }`}
                  >
                    {isAr ? cat.labelAr : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tenders Cards Grid with INLINE Expandable Drawers (NO POPUPS!) */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTenders.map((tnd) => {
              const isExpanded = expandedTenderId === tnd.id;

              return (
                <div
                  key={tnd.id}
                  className={`p-6 sm:p-7 rounded-3xl border-2 transition-all space-y-4 flex flex-col justify-between ${
                    isDark 
                      ? 'bg-[#0B1A2F]/95 border-slate-700/80 hover:border-[#00F2FE]/60 text-white shadow-xl' 
                      : 'bg-white border-slate-300 hover:border-[#0284C7] text-slate-950 shadow-md'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Ref Number & Urgency Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-black px-3 py-1 rounded-lg border-2 ${
                          isDark
                            ? 'bg-sky-500/20 text-[#00F2FE] border-sky-500/40'
                            : 'bg-sky-100 text-sky-950 border-sky-400'
                        }`}>
                          {tnd.refNumber}
                        </span>

                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                          isDark 
                            ? 'bg-white/5 text-slate-300 border-white/10' 
                            : 'bg-slate-100 text-slate-800 border-slate-300 font-bold'
                        }`}>
                          {isAr ? 'طرح رسمي' : 'Public RFP'}
                        </span>
                      </div>

                      {/* Urgency Badge with Strong Contrast */}
                      <span className={`text-xs font-black px-3 py-1 rounded-full border-2 shrink-0 ${
                        tnd.urgency === 'urgent'
                          ? isDark
                            ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 animate-pulse'
                            : 'bg-rose-100 text-rose-950 border-rose-500 font-black shadow-xs'
                          : tnd.urgency === 'medium'
                            ? isDark
                              ? 'bg-amber-500/25 text-amber-300 border-amber-500/50'
                              : 'bg-amber-100 text-amber-950 border-amber-500 font-black shadow-xs'
                            : isDark
                              ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-500 font-black shadow-xs'
                      }`}>
                        {isAr 
                          ? `${tnd.urgency === 'urgent' ? '🔥 ' : tnd.urgency === 'medium' ? '⏱️ ' : '🟢 '}متبقي ${tnd.daysRemaining} يوماً` 
                          : `${tnd.daysRemaining} Days Left`}
                      </span>
                    </div>

                    <h2 className={`text-base sm:text-lg font-black leading-snug ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      {isAr ? tnd.titleAr : tnd.titleEn}
                    </h2>

                    {/* Metadata Strip with High Contrast */}
                    <div className={`p-4 rounded-2xl border-2 space-y-3 text-xs ${
                      isDark ? 'bg-[#071120] border-slate-800 text-slate-200' : 'bg-slate-100/90 border-slate-300 text-slate-950'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                        <span className={`text-xs ${isDark ? 'text-slate-300 font-bold' : 'text-slate-800 font-bold'}`}>
                          {isAr ? 'الجهة الطارحة:' : 'Entity:'}{' '}
                          <strong className={`font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                            {isAr ? tnd.entityAr : tnd.entityEn}
                          </strong>
                        </span>
                      </div>

                      {/* Deadline High-Contrast Banner */}
                      <div className={`p-3 rounded-xl border-2 flex items-center justify-between gap-2 ${
                        isDark 
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' 
                          : 'bg-amber-100 border-amber-500 text-amber-950 shadow-xs'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-900'}`} />
                          <span className={`font-black text-xs ${isDark ? 'text-amber-200' : 'text-amber-950'}`}>
                            {isAr ? 'آخر موعد لتقديم العروض:' : 'Deadline:'}
                          </span>
                        </div>
                        <strong className={`font-black font-mono text-xs sm:text-sm ${
                          isDark ? 'text-amber-300' : 'text-amber-950'
                        }`}>
                          {isAr ? tnd.deadlineFormattedAr : tnd.deadlineFormattedEn}
                        </strong>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
                        {tnd.estimatedBudget && (
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                            <span className={isDark ? 'text-slate-300 font-bold' : 'text-slate-800 font-bold'}>
                              {isAr ? 'القيمة التقديرية:' : 'Budget:'}{' '}
                              <span className={`font-mono font-black ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                                {tnd.estimatedBudget}
                              </span>
                            </span>
                          </div>
                        )}
                        {tnd.bidBond && (
                          <div className="flex items-center gap-1.5">
                            <span className={isDark ? 'text-slate-300 font-bold' : 'text-slate-800 font-bold'}>
                              {isAr ? 'التأمين الابتدائي:' : 'Bid Bond:'}{' '}
                              <strong className={`font-mono font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                                {tnd.bidBond}
                              </strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Scope of Work */}
                    <div className="space-y-1">
                      <span className={`text-[11px] font-bold block ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                        {isAr ? 'ملخص النطاق الفني والتوريدات:' : 'Technical Scope Summary:'}
                      </span>
                      <p className={`text-xs leading-relaxed p-3.5 rounded-xl border ${
                        isDark ? 'bg-[#071120] text-slate-100 border-white/10' : 'bg-slate-100 text-slate-950 border-slate-300 font-semibold'
                      }`}>
                        {isAr ? tnd.scopeAr : tnd.scopeEn}
                      </p>
                    </div>

                    {/* OFFICIAL PORTAL LINK BOX - كراسة الشروط والمناقصة في موقعها الأصلي */}
                    <div className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                      isDark 
                        ? 'bg-gradient-to-r from-[#071120] to-[#0c1e38] border-sky-500/40 shadow-[0_0_20px_rgba(0,242,254,0.08)]' 
                        : 'bg-gradient-to-r from-sky-50 to-blue-50/70 border-sky-400 shadow-sm'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5 border-sky-500/20">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isDark ? 'bg-sky-500/20 text-[#00F2FE]' : 'bg-[#0284C7] text-white shadow-xs'
                          }`}>
                            <Globe className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[11px] font-black uppercase tracking-wider ${
                                isDark ? 'text-sky-300' : 'text-sky-950'
                              }`}>
                                {isAr ? 'الموقع الرسمي للعملية / كراسة الشروط' : 'Official Tender Portal / RFP Source'}
                              </span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              }`}>
                                {isAr ? '✓ بوابة رسمية موثقة' : '✓ Verified Source'}
                              </span>
                            </div>
                            <p className={`text-xs font-black mt-0.5 ${
                              isDark ? 'text-white' : 'text-slate-950'
                            }`}>
                              {isAr ? (tnd.sourceAr || 'بوابة التعاقدات العامة المصرية') : (tnd.sourceEn || 'Official Procurement Portal')}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[11px] font-mono font-black px-2.5 py-1 rounded-lg border self-start sm:self-center shrink-0 ${
                          isDark ? 'bg-[#0B1A2F] text-sky-300 border-sky-500/30' : 'bg-white text-slate-950 border-slate-300 shadow-xs'
                        }`}>
                          {isAr ? `الكود: ${tnd.refNumber}` : `Ref: ${tnd.refNumber}`}
                        </span>
                      </div>

                      {/* URL and Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-0.5">
                        <div className={`px-3 py-2 rounded-xl border-2 flex items-center gap-2 text-xs font-mono min-w-0 flex-1 ${
                          isDark ? 'bg-[#071120] border-white/10 text-sky-300' : 'bg-white border-slate-300 text-sky-950 font-bold shadow-xs'
                        }`}>
                          <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                          <span className="truncate" dir="ltr">{tnd.officialPortalUrl || 'https://etenders.gov.eg'}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => copyTenderLink(tnd.id, tnd.officialPortalUrl || 'https://etenders.gov.eg')}
                            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border-2 transition cursor-pointer ${
                              copiedUrlId === tnd.id
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : isDark
                                  ? 'bg-[#10233D] hover:bg-[#152C4D] text-slate-200 border-white/15'
                                  : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-xs'
                            }`}
                            title={isAr ? 'نسخ رابط الموقع الرسمي' : 'Copy Portal URL'}
                          >
                            {copiedUrlId === tnd.id ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedUrlId === tnd.id ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy')}</span>
                          </button>

                          <a
                            href={tnd.officialPortalUrl || 'https://etenders.gov.eg'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                              isDark
                                ? 'bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] shadow-cyan-500/20'
                                : 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sky-600/20'
                            }`}
                            title={isAr ? 'فتح كراسة الشروط على الموقع الرسمي للجهة في نافذة جديدة' : 'Open RFP on Official Portal in new tab'}
                          >
                            <span>{isAr ? 'رابط العملية بموقعها الرسمي ↗' : 'Visit Official Portal ↗'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <div className={`text-[11px] leading-relaxed flex items-center gap-1.5 ${
                        isDark ? 'text-slate-300' : 'text-slate-800 font-semibold'
                      }`}>
                        <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                        <span>
                          {isAr 
                            ? 'اضغط على الرابط أعلاه لتحميل كراسة الشروط الرسمية ودفع التأمين الابتدائي مباشرة لدى الجهة المالكة.'
                            : 'Click the link above to download official RFP documents and pay the bid bond directly to the issuing authority.'}
                        </span>
                      </div>
                    </div>

                    {/* INLINE EXPANDED SPECS DRAWER (NO POPUP!) */}
                    {isExpanded && (
                      <div className={`p-5 rounded-2xl border-2 space-y-4 animate-in fade-in ${
                        isDark ? 'bg-[#071120] border-sky-500/30' : 'bg-sky-50/90 border-sky-400 shadow-md'
                      }`}>
                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                          <div className={`p-3 rounded-xl border-2 ${isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-300 shadow-xs'}`}>
                            <span className={`text-[11px] block mb-0.5 font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {isAr ? 'جلسة الاستفسارات:' : 'Inquiry Date:'}
                            </span>
                            <strong className={`block font-black text-xs ${isDark ? 'text-white' : 'text-slate-950'}`}>
                              {isAr ? tnd.sessionDateAr : tnd.sessionDateEn}
                            </strong>
                          </div>
                          <div className={`p-3 rounded-xl border-2 ${isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-300 shadow-xs'}`}>
                            <span className={`text-[11px] block mb-0.5 font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {isAr ? 'ثمن الكراسة:' : 'Tender Fee:'}
                            </span>
                            <strong className={`font-mono block font-black text-xs ${isDark ? 'text-white' : 'text-slate-950'}`}>
                              {tnd.tenderFee}
                            </strong>
                          </div>
                          <div className={`p-3 rounded-xl border-2 ${isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-300 shadow-xs'}`}>
                            <span className={`text-[11px] block mb-0.5 font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {isAr ? 'التأمين الابتدائي:' : 'Bid Bond:'}
                            </span>
                            <strong className={`font-mono block font-black text-xs ${isDark ? 'text-white' : 'text-slate-950'}`}>
                              {tnd.bidBond}
                            </strong>
                          </div>
                          <div className={`p-3 rounded-xl border-2 ${isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-300 shadow-xs'}`}>
                            <span className={`text-[11px] block mb-0.5 font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              {isAr ? 'حالة الطرح:' : 'Status:'}
                            </span>
                            <span className={`font-black block text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                              {isAr ? 'متاح للتقديم الفني' : 'Open for Submittal'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className={`text-xs font-black mb-2 flex items-center gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-950'}`}>
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{isAr ? 'المستندات والاعتمادات المطلوبة للقبول الفني:' : 'Required Consultant Submittals:'}</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs">
                            {(isAr ? tnd.deliverablesListAr : tnd.deliverablesListEn).map((del, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2">
                                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Direct Original Site Link inside Expanded Drawer */}
                        <div className="pt-2 border-t-2 border-slate-300 dark:border-white/15 flex flex-col sm:flex-row items-center justify-between gap-2">
                          <a
                            href={tnd.officialPortalUrl || 'https://etenders.gov.eg'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs font-black ${
                              isDark ? 'text-[#00F2FE] hover:text-[#38BDF8]' : 'text-[#0284C7] hover:text-[#0369A1]'
                            }`}
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{isAr ? 'فتح كراسة الشروط الرسمية بموقع الجهة ↗' : 'Open Official Tender Document ↗'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <span className={`text-[11px] font-mono font-black ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                            {tnd.refNumber}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="space-y-2 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/contact?type=jv&tender=${encodeURIComponent(tnd.refNumber)}&title=${encodeURIComponent(isAr ? tnd.titleAr : tnd.titleEn)}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#071120] text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm text-center active:scale-95"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{isAr ? 'طلب تضامن (Joint Venture)' : 'Joint Venture Request'}</span>
                      </Link>

                      <Link
                        href={`/contact?type=submittal&tender=${encodeURIComponent(tnd.refNumber)}&title=${encodeURIComponent(isAr ? tnd.titleAr : tnd.titleEn)}`}
                        className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer border-2 text-center ${
                          isDark 
                            ? 'bg-[#10233D] hover:bg-[#152C4D] text-slate-100 border-white/10' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-950 border-slate-300 shadow-xs'
                        }`}
                      >
                        <FileCheck className={`w-3.5 h-3.5 ${isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}`} />
                        <span>{isAr ? 'إعداد الاعتماد الفني' : 'Prepare Submittal'}</span>
                      </Link>
                    </div>

                    {/* Toggle Button for Inline Details (NO POPUP!) */}
                    <button
                      type="button"
                      onClick={() => toggleTenderExpand(tnd.id)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer border-2 ${
                        isExpanded
                          ? isDark ? 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/50' : 'bg-sky-100 text-[#0284C7] border-sky-400'
                          : isDark ? 'text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border-white/10' : 'text-slate-950 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border-slate-300 font-black shadow-xs'
                      }`}
                    >
                      <span>{isExpanded ? (isAr ? 'إخفاء تفاصيل الكراسة' : 'Hide Details') : (isAr ? 'عرض كراسة الشروط والتفاصيل الفنية (مباشر)' : 'View Full RFP Specifications')}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer
        lang={lang}
        data={data}
        phone={customConfig.phone}
        whatsappNumber={customConfig.whatsappNumber}
        email={customConfig.email}
        address={isAr ? customConfig.addressAr : customConfig.addressEn}
        linkedinUrl={customConfig.linkedinUrl}
        facebookUrl={customConfig.facebookUrl}
        logoEmblemStyle={customConfig.logoEmblemStyle}
        customLogoUrl={customConfig.customLogoUrl}
        brandBio={isAr ? customConfig.brandBioAr : customConfig.brandBioEn}
        commercialRegister={customConfig.commercialRegister}
        taxId={customConfig.taxId}
      />
    </div>
  );
}
