'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { SiteLanguageData, siteConfig } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';
import { submitInquiry } from '@/lib/dbService';
import { getContactSelectOptions, getServiceBySlug } from '@/lib/services';

function ContactQuerySync({
  onSync,
}: {
  onSync: (serviceParam: string | null, scopeParam: string | null) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const s = searchParams.get('service');
    const n = searchParams.get('scope') || searchParams.get('notes');
    if (s || n) {
      onSync(s, n);
    }
  }, [searchParams, onSync]);
  return null;
}

interface ContactSectionProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
  prefilledService?: string;
  prefilledNotes?: string;
  whatsappNumber?: string;
  hotlinePhone?: string;
  email?: string;
  address?: string;
}

export default function ContactSection({
  lang,
  data,
  prefilledService,
  prefilledNotes,
  whatsappNumber = siteConfig.whatsappNumber,
  hotlinePhone = siteConfig.phone,
  email = siteConfig.email,
  address,
}: ContactSectionProps) {
  const isAr = lang === 'ar';
  const { isDark } = useTheme();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('cctv');
  const [governorate, setGovernorate] = useState('cairo');
  const [timeline, setTimeline] = useState('planning');
  const [notes, setNotes] = useState(prefilledNotes || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const lastSubmitTimeRef = React.useRef<number>(0);

  const contactSelectData = getContactSelectOptions(lang);

  const handleSyncQuery = useCallback((paramService: string | null, paramNotes: string | null) => {
    if (paramService) {
      const normalized = paramService.toLowerCase().trim();
      const CATEGORY_MAP: Record<string, string> = {
        'security': 'cctv',
        'cctv': 'cctv',
        'physical-security-systems': 'cctv',
        'network': 'network',
        'networking-infrastructure': 'network',
        'elv': 'elv',
        'elv-systems': 'elv',
        'software': 'software',
        'software-digital-solutions': 'software',
        'turnkey': 'turnkey',
      };

      if (CATEGORY_MAP[normalized]) {
        setService(CATEGORY_MAP[normalized]);
      } else {
        const sub = getServiceBySlug(normalized);
        if (sub) {
          setService(sub.slug);
        } else if (paramService.includes('CCTV') || paramService.includes('مراقبة') || paramService.includes('أمن')) {
          setService('cctv');
        } else if (paramService.includes('ألياف') || paramService.includes('شبك') || paramService.includes('UTP') || paramService.includes('داتا سنتر') || paramService.includes('بنية')) {
          setService('network');
        } else if (paramService.includes('خفيف') || paramService.includes('إنذار') || paramService.includes('صوت') || paramService.includes('ELV')) {
          setService('elv');
        } else if (paramService.includes('برمج') || paramService.includes('تطبيق') || paramService.includes('منص') || paramService.includes('Software')) {
          setService('software');
        }
      }
    }
    if (paramNotes) {
      setNotes(paramNotes);
    }
  }, []);

  const [prevPrefilledService, setPrevPrefilledService] = useState(prefilledService);
  if (prefilledService !== prevPrefilledService) {
    setPrevPrefilledService(prefilledService);
    if (prefilledService) {
      handleSyncQuery(prefilledService, null);
    }
  }

  const [prevPrefilledNotes, setPrevPrefilledNotes] = useState(prefilledNotes);
  if (prefilledNotes !== prevPrefilledNotes) {
    setPrevPrefilledNotes(prefilledNotes);
    if (prefilledNotes) {
      setNotes(prefilledNotes);
    }
  }

  const governorateOptions = [
    { id: 'cairo', labelAr: 'القاهرة الكبرى والمدن الجديدة (التجمع، العاصمة، الشروق)', labelEn: 'Cairo & New Cities' },
    { id: 'giza', labelAr: 'الجيزة و 6 أكتوبر والشيخ زايد', labelEn: 'Giza, 6th of October & Zayed' },
    { id: 'alex', labelAr: 'الإسكندرية والساحل الشمالي ومطروح', labelEn: 'Alexandria & North Coast' },
    { id: 'canal', labelAr: 'مدن القناة (السويس، الإسماعيلية، بورسعيد)', labelEn: 'Canal Cities (Suez, Ismailia, Port Said)' },
    { id: 'delta', labelAr: 'محافظات الدلتا والمناطق الصناعية', labelEn: 'Delta & Industrial Zones' },
    { id: 'redsea', labelAr: 'البحر الأحمر والغردقة وجنوب سيناء', labelEn: 'Red Sea & South Sinai' },
    { id: 'upper', labelAr: 'محافظات الصعيد ومحاور التنمية', labelEn: 'Upper Egypt Governorates' },
  ];

  const serviceOptions = [
    { id: 'cctv', labelAr: 'أنظمة الأمن المادي (المراقبة بالكاميرات والتحكم في الدخول)', labelEn: 'Physical Security Systems (CCTV & Access Control)' },
    { id: 'network', labelAr: 'البنية التحتية والشبكات ومراكز البيانات (الكابلات المنظمة وغرف الخوادم)', labelEn: 'Networking & IT Infrastructure (Structured Cabling & Server Rooms)' },
    { id: 'elv', labelAr: 'أنظمة التيار الخفيف (الإنذار، الصوتيات، الاتصال الداخلي)', labelEn: 'Low Current / ELV Systems (Fire Alarm, PA/BGM, Intercom)' },
    { id: 'software', labelAr: 'البرمجيات والحلول الرقمية (تطبيقات مخصصة وتكامل الأنظمة)', labelEn: 'Software & Digital Solutions (Custom Apps, ERP & APIs)' },
    { id: 'turnkey', labelAr: 'مشروعات متكاملة (أمن مادي + شبكات وبنية تحتية)', labelEn: 'Integrated Turnkey Project (Security & Infrastructure)' },
  ];

  const getServiceLabel = (srvId: string) => {
    const top = serviceOptions.find((s) => s.id === srvId);
    if (top) return isAr ? top.labelAr : top.labelEn;
    const sub = getServiceBySlug(srvId);
    if (sub) return sub.title[lang];
    return srvId;
  };

  const timelineOptions = [
    { id: 'urgent', labelAr: 'عاجل (خلال أسبوعين)', labelEn: 'Urgent (Within 2 weeks)' },
    { id: 'month', labelAr: 'خلال شهر', labelEn: 'Within 1 month' },
    { id: 'planning', labelAr: 'مرحلة التخطيط والدراسة', labelEn: 'Planning & Feasibility Phase' },
  ];

  const validate = () => {
    // Bot Honeypot Trap
    if (honeypot.trim()) {
      return false;
    }

    // Rate limiting: 10 seconds cooldown
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 10000) {
      setErrorMsg(
        isAr 
          ? 'تم استلام طلبك مؤخراً. يرجى الانتظار بضع ثوانٍ قبل إرسال طلب جديد لمنع التكرار.' 
          : 'Your request was recently recorded. Please wait a few seconds before submitting again.'
      );
      return false;
    }

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg(isAr ? 'يرجى كتابة الاسم بالكامل (حرفان على الأقل)' : 'Please provide your full name (at least 2 characters)');
      return false;
    }
    if (!company.trim() || company.trim().length < 2) {
      setErrorMsg(isAr ? 'يرجى تحديد اسم الشركة أو الجهة' : 'Please provide company or organization name');
      return false;
    }
    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8 || !/^[+0-9]+$/.test(cleanPhone)) {
      setErrorMsg(isAr ? 'يرجى كتابة رقم هاتف أو واتساب صحيح للتواصل (أرقام فقط)' : 'Please provide a valid phone/WhatsApp number');
      return false;
    }
    if (workEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail.trim())) {
      setErrorMsg(isAr ? 'يرجى كتابة بريد إلكتروني صحيح' : 'Please provide a valid email address');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const getFormattedMessage = () => {
    const sName = getServiceLabel(service);
    const gName = governorateOptions.find((g) => g.id === governorate)?.[isAr ? 'labelAr' : 'labelEn'] || governorate;
    const tName = timelineOptions.find((t) => t.id === timeline)?.[isAr ? 'labelAr' : 'labelEn'] || timeline;

    return isAr
      ? `استفسار مشروع - تيك بكرة (Tech Bokra):\n` +
        `• الاسم: ${name}\n` +
        `• الشركة / الجهة: ${company}\n` +
        (workEmail ? `• البريد الإلكتروني: ${workEmail}\n` : '') +
        `• الهاتف / واتساب: ${phone}\n` +
        `• نوع الحل المطلوب: ${sName}\n` +
        `• موقع المشروع: ${gName}\n` +
        `• الإطار الزمني المتوقع: ${tName}\n` +
        (notes ? `• تفاصيل إضافية: ${notes}\n` : '') +
        `\nأرجو مراجعة المتطلبات والتواصل لتحديد الخطوة التالية.`
      : `Project Inquiry - Tech Bokra:\n` +
        `• Full Name: ${name}\n` +
        `• Company: ${company}\n` +
        (workEmail ? `• Work Email: ${workEmail}\n` : '') +
        `• Phone / WhatsApp: ${phone}\n` +
        `• Solution: ${sName}\n` +
        `• Location: ${gName}\n` +
        `• Timeline: ${tName}\n` +
        (notes ? `• Scope Details: ${notes}\n` : '') +
        `\nPlease review requirements and get in touch to discuss next steps.`;
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    lastSubmitTimeRef.current = Date.now();
    const ref = `TB-${Math.floor(1000 + Math.random() * 9000)}`;

    const mapServiceToFirestore = (srv: string): string[] => {
      if (srv === 'cctv') return ['cctv'];
      if (srv === 'network') return ['network'];
      if (srv === 'software') return ['software'];
      if (srv === 'elv') return ['elv'];
      if (srv === 'turnkey') return ['all'];
      const sub = getServiceBySlug(srv);
      if (sub) return [sub.category, sub.slug];
      return ['cctv'];
    };

    try {
      const gName = governorateOptions.find((g) => g.id === governorate)?.[isAr ? 'labelAr' : 'labelEn'] || governorate;
      const tName = timelineOptions.find((t) => t.id === timeline)?.[isAr ? 'labelAr' : 'labelEn'] || timeline;
      const sName = getServiceLabel(service);
      const combinedNotes = [
        `الخدمة: ${sName}`,
        `الموقع: ${gName}`,
        `الجدول الزمني: ${tName}`,
        workEmail ? `البريد: ${workEmail}` : '',
        notes ? `الوصف: ${notes}` : ''
      ].filter(Boolean).join(' | ');

      await submitInquiry({
        clientName: name,
        phone,
        facilityType: company,
        selectedSystems: mapServiceToFirestore(service),
        notes: combinedNotes,
        source: 'contact_form',
      });
      setSubmittedRef(ref);
      setErrorMsg('');
    } catch (err) {
      console.warn('Inquiry save error:', err);
      // Fallback: still show ref to user since local state captured it
      setSubmittedRef(ref);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    lastSubmitTimeRef.current = Date.now();
    const text = getFormattedMessage();
    const ref = `TB-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(ref);

    const mapServiceToFirestore = (srv: string): string[] => {
      if (srv === 'cctv') return ['cctv'];
      if (srv === 'network') return ['network'];
      if (srv === 'software') return ['software'];
      if (srv === 'elv') return ['security'];
      if (srv === 'turnkey') return ['all'];
      return ['cctv'];
    };

    // Persist lead to Firestore asynchronously
    const gName = governorateOptions.find((g) => g.id === governorate)?.[isAr ? 'labelAr' : 'labelEn'] || governorate;
    const tName = timelineOptions.find((t) => t.id === timeline)?.[isAr ? 'labelAr' : 'labelEn'] || timeline;
    const sName = serviceOptions.find((s) => s.id === service)?.[isAr ? 'labelAr' : 'labelEn'] || service;
    submitInquiry({
      clientName: name,
      phone,
      facilityType: company,
      selectedSystems: mapServiceToFirestore(service),
      notes: `واتساب | الخدمة: ${sName} | الموقع: ${gName} | الجدول: ${tName} | ${notes || ''}`,
      source: 'contact_form',
    }).catch((err) => console.warn('Inquiry auto-save error:', err));

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    lastSubmitTimeRef.current = Date.now();
    const text = getFormattedMessage();
    const ref = `TB-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(ref);

    const mapServiceToFirestore = (srv: string): string[] => {
      if (srv === 'cctv') return ['cctv'];
      if (srv === 'network') return ['network'];
      if (srv === 'software') return ['software'];
      if (srv === 'elv') return ['security'];
      if (srv === 'turnkey') return ['all'];
      return ['cctv'];
    };

    // Persist lead to Firestore asynchronously
    const gName = governorateOptions.find((g) => g.id === governorate)?.[isAr ? 'labelAr' : 'labelEn'] || governorate;
    const tName = timelineOptions.find((t) => t.id === timeline)?.[isAr ? 'labelAr' : 'labelEn'] || timeline;
    const sName = serviceOptions.find((s) => s.id === service)?.[isAr ? 'labelAr' : 'labelEn'] || service;
    submitInquiry({
      clientName: name,
      phone,
      facilityType: company,
      selectedSystems: mapServiceToFirestore(service),
      notes: `بريد | الخدمة: ${sName} | الموقع: ${gName} | الجدول: ${tName} | ${notes || ''}`,
      source: 'contact_form',
    }).catch((err) => console.warn('Inquiry auto-save error:', err));

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      isAr ? `استفسار مشروع جديد: ${company}` : `Project Inquiry: ${company}`
    )}&body=${encodeURIComponent(text)}`;
  };

  return (
    <section 
      id="contact" 
      className={`py-24 relative border-t transition-colors duration-300 ${
        isDark ? 'bg-[#071120] border-white/5 cyber-grid' : 'bg-white border-slate-200 cyber-grid'
      }`}
    >
      <Suspense fallback={null}>
        <ContactQuerySync onSync={handleSyncQuery} />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div 
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border ${
              isDark 
                ? 'bg-[#10233D] border-[#00F2FE]/25 text-[#00F2FE]' 
                : 'bg-sky-50 border-sky-200 text-[#0284C7]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{data.contact.quickResponseBadge}</span>
          </div>

          <h2 
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span>{data.contact.title}</span>
          </h2>

          <p 
            className={`text-base sm:text-lg mt-4 leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {data.contact.subtitle}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Interactive Form (7 Cols) */}
          <div 
            className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-xl relative ${
              isDark 
                ? 'bg-[#0B1A2F]/90 border-[#00F2FE]/30' 
                : 'bg-white border-slate-200 shadow-[0_4px_30px_rgba(15,23,42,0.08)]'
            }`}
          >
            
            {submittedRef && (
              <div 
                className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in ${
                  isDark 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {data.contact.successMessage}
                  </div>
                  <div className={`font-mono text-xs ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    {isAr ? 'رقم مرجع طلبك: ' : 'Reference ID: '} <strong>{submittedRef}</strong>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div 
                className={`mb-6 p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  isDark 
                    ? 'bg-red-950/60 border-red-500/40 text-red-200' 
                    : 'bg-red-50 border-red-300 text-red-800'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="space-y-4 text-start">
              {/* Invisible Bot Honeypot Field */}
              <div className="hidden sr-only pointer-events-none" style={{ display: 'none' }} aria-hidden="true">
                <label htmlFor="website_hp" className="sr-only">Do not fill this field</label>
                <input
                  id="website_hp"
                  type="text"
                  name="website_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              
              {/* Row 1: Name and Company */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {data.contact.nameLabel} <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={data.contact.namePlaceholder}
                    className={`w-full rounded-xl px-3.5 py-3 text-xs sm:text-sm outline-none transition border ${
                      isDark
                        ? 'bg-[#10233D] border-white/10 text-white placeholder-slate-500 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {data.contact.companyLabel} <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={data.contact.companyPlaceholder}
                    className={`w-full rounded-xl px-3.5 py-3 text-xs sm:text-sm outline-none transition border ${
                      isDark
                        ? 'bg-[#10233D] border-white/10 text-white placeholder-slate-500 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Row 2: Work Email and Phone/WhatsApp */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {data.contact.emailLabel || (isAr ? 'البريد الإلكتروني للعمل' : 'Work Email')}
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder={data.contact.emailPlaceholder || 'name@company.com'}
                    className={`w-full rounded-xl px-3.5 py-3 text-xs sm:text-sm outline-none transition border ${
                      isDark
                        ? 'bg-[#10233D] border-white/10 text-white placeholder-slate-500 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {data.contact.phoneLabel} <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={data.contact.phonePlaceholder}
                    className={`w-full rounded-xl px-3.5 py-3 text-xs sm:text-sm outline-none transition font-mono border ${
                      isDark
                        ? 'bg-[#10233D] border-white/10 text-white placeholder-slate-500 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Row 3: Solution Service and Project Location */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {data.contact.serviceLabel}
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-3 text-xs sm:text-sm outline-none transition cursor-pointer border ${
                      isDark
                        ? 'bg-[#10233D] border-white/10 text-white focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] focus:bg-white'
                    }`}
                  >
                    {serviceOptions.map((opt) => (
                      <option 
                        key={opt.id} 
                        value={opt.id} 
                        className={isDark ? 'bg-[#0B1A2F] text-white font-bold' : 'bg-white text-slate-900 font-bold'}
                      >
                        {isAr ? opt.labelAr : opt.labelEn}
                      </option>
                    ))}

                    <optgroup label={isAr ? '── أنظمة الأمن المادي والمراقبة ──' : '── Physical Security Solutions ──'}>
                      {contactSelectData.subServicesByCategory.security.map((sub) => (
                        <option 
                          key={sub.id} 
                          value={sub.id} 
                          className={isDark ? 'bg-[#0B1A2F] text-slate-200' : 'bg-white text-slate-800'}
                        >
                          {sub.label}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label={isAr ? '── البنية التحتية والشبكات ومراكز البيانات ──' : '── IT & Infrastructure Solutions ──'}>
                      {contactSelectData.subServicesByCategory.network.map((sub) => (
                        <option 
                          key={sub.id} 
                          value={sub.id} 
                          className={isDark ? 'bg-[#0B1A2F] text-slate-200' : 'bg-white text-slate-800'}
                        >
                          {sub.label}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label={isAr ? '── أنظمة التيار الخفيف (ELV) ──' : '── Low Current / ELV Systems ──'}>
                      {contactSelectData.subServicesByCategory.elv.map((sub) => (
                        <option 
                          key={sub.id} 
                          value={sub.id} 
                          className={isDark ? 'bg-[#0B1A2F] text-slate-200' : 'bg-white text-slate-800'}
                        >
                          {sub.label}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label={isAr ? '── البرمجيات والحلول الرقمية ──' : '── Software & Digital Solutions ──'}>
                      {contactSelectData.subServicesByCategory.software.map((sub) => (
                        <option 
                          key={sub.id} 
                          value={sub.id} 
                          className={isDark ? 'bg-[#0B1A2F] text-slate-200' : 'bg-white text-slate-800'}
                        >
                          {sub.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {data.contact.governorateLabel}
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-3 text-xs sm:text-sm outline-none transition cursor-pointer border ${
                      isDark
                        ? 'bg-[#10233D] border-white/10 text-white focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] focus:bg-white'
                    }`}
                  >
                    {governorateOptions.map((opt) => (
                      <option 
                        key={opt.id} 
                        value={opt.id} 
                        className={isDark ? 'bg-[#0B1A2F] text-white' : 'bg-white text-slate-900'}
                      >
                        {isAr ? opt.labelAr : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Expected Timeline */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {data.contact.timelineLabel || (isAr ? 'الإطار الزمني المتوقع للبدء' : 'Expected Project Timeline')}
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-3 text-xs sm:text-sm outline-none transition cursor-pointer border ${
                    isDark
                      ? 'bg-[#10233D] border-white/10 text-white focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] focus:bg-white'
                  }`}
                >
                  {timelineOptions.map((opt) => (
                    <option 
                      key={opt.id} 
                      value={opt.id} 
                      className={isDark ? 'bg-[#0B1A2F] text-white' : 'bg-white text-slate-900'}
                    >
                      {isAr ? opt.labelAr : opt.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 5: Notes & Brief Scope */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {data.contact.notesLabel}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={data.contact.notesPlaceholder}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none transition border ${
                    isDark
                      ? 'bg-[#10233D] border-white/10 text-white placeholder-slate-500 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] focus:bg-white'
                  }`}
                />
              </div>

              {/* Primary Direct Form Submit */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmitInquiry}
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-6 rounded-xl font-black text-xs sm:text-sm shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                    isDark
                      ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-[#071120] hover:brightness-110 shadow-[0_0_20px_rgba(0,242,254,0.3)]'
                      : 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md'
                  }`}
                >
                  <span>{isSubmitting ? (data.contact.btnSubmitting || (isAr ? 'جارٍ إرسال الاستفسار...' : 'Submitting...')) : (data.contact.btnSubmit || (isAr ? 'إرسال استفسار المشروع' : 'Send Project Inquiry'))}</span>
                </button>
              </div>

              {/* Secondary Options: WhatsApp and Email */}
              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-sm transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{data.contact.btnWhatsapp}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border ${
                    isDark
                      ? 'bg-[#10233D] hover:bg-[#152C4D] border-[#00F2FE]/40 text-[#00F2FE]'
                      : 'bg-sky-50 hover:bg-[#0284C7] hover:text-white border-sky-300 text-[#0284C7]'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>{data.contact.btnEmail}</span>
                </button>
              </div>

              {/* Disclaimer Note */}
              <div className={`pt-3 border-t text-[11px] leading-relaxed ${isDark ? 'border-white/5 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                {data.contact.disclaimer}
              </div>

            </form>
          </div>

          {/* Quick Direct Contacts & Office Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Direct Phone Card */}
            <div 
              className={`p-6 rounded-2xl border transition shadow-sm hover:shadow-md ${
                isDark 
                  ? 'bg-[#0B1A2F]/90 border-[#00F2FE]/20 hover:border-[#00F2FE]/40' 
                  : 'bg-white border-slate-200 hover:border-[#0284C7]/40'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-[#10233D] text-[#00F2FE]' : 'bg-sky-50 text-[#0284C7]'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'الخط الساخن والمكالمات الفورية' : 'Engineering Hotline'}
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isAr ? 'مهندسو الدعم في خدمتك' : 'Available for immediate consult'}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${whatsappNumber}`}
                className={`block text-xl font-bold font-mono hover:underline mt-2 ltr:text-left rtl:text-right ${
                  isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                }`}
              >
                {hotlinePhone}
              </a>
            </div>

            {/* Email Card */}
            <div 
              className={`p-6 rounded-2xl border transition shadow-sm hover:shadow-md ${
                isDark 
                  ? 'bg-[#0B1A2F]/90 border-[#00F2FE]/20 hover:border-[#00F2FE]/40' 
                  : 'bg-white border-slate-200 hover:border-[#0284C7]/40'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-[#10233D] text-[#00F2FE]' : 'bg-sky-50 text-[#0284C7]'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'البريد الإلكتروني المعتمد' : 'Official Support Email'}
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isAr ? 'لتلقي كراسات الشروط والـ BOQ' : 'Send RFP & Tender Documents'}
                  </p>
                </div>
              </div>
              <a
                href={`mailto:${email}`}
                className={`block text-base font-bold font-mono hover:underline mt-1 ${
                  isDark ? 'text-slate-200 hover:text-[#00F2FE]' : 'text-slate-800 hover:text-[#0284C7]'
                }`}
              >
                {email}
              </a>
            </div>

            {/* Address & Hours */}
            <div 
              className={`p-6 rounded-2xl border transition shadow-sm hover:shadow-md space-y-3 ${
                isDark 
                  ? 'bg-[#0B1A2F]/90 border-[#00F2FE]/20 hover:border-[#00F2FE]/40' 
                  : 'bg-white border-slate-200 hover:border-[#0284C7]/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-[#10233D] text-[#00F2FE]' : 'bg-sky-50 text-[#0284C7]'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAr ? 'المقر الرئيسي' : 'Headquarters'}
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {address || (isAr ? siteConfig.addressAr : siteConfig.addressEn)}
                  </p>
                </div>
              </div>

              <div className={`flex items-start gap-3 pt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-[#10233D] text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {isAr ? 'ساعات العمل الرسمية' : 'Operating Hours'}
                  </h4>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isAr ? siteConfig.workingHoursAr : siteConfig.workingHoursEn}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
