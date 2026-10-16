'use client';

import React, { useState } from 'react';
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
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('cctv');
  const [governorate, setGovernorate] = useState('cairo');
  const [notes, setNotes] = useState(prefilledNotes || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const [prevPrefilledService, setPrevPrefilledService] = useState(prefilledService);
  if (prefilledService !== prevPrefilledService) {
    setPrevPrefilledService(prefilledService);
    if (prefilledService) {
      if (prefilledService.includes('CCTV') || prefilledService.includes('مراقبة')) setService('cctv');
      else if (prefilledService.includes('ألياف') || prefilledService.includes('شبك')) setService('network');
      else if (prefilledService.includes('بصمة') || prefilledService.includes('بوابات') || prefilledService.includes('Access')) setService('access');
      else if (prefilledService.includes('ERP') || prefilledService.includes('فاتورة')) setService('erp');
      else if (prefilledService.includes('تطبيق') || prefilledService.includes('Mobile')) setService('mobile');
      else setService('consulting');
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
    { id: 'cairo', labelAr: 'القاهرة الكبرى والتجمع والمدن الجديدة', labelEn: 'Cairo & New Cities' },
    { id: 'giza', labelAr: 'الجيزة و 6 أكتوبر والشيخ زايد', labelEn: 'Giza, 6th of October & Zayed' },
    { id: 'alex', labelAr: 'الإسكندرية والساحل الشمالي', labelEn: 'Alexandria & North Coast' },
    { id: 'redsea', labelAr: 'البحر الأحمر والغردقة والجونة', labelEn: 'Red Sea & Hurghada' },
    { id: 'delta', labelAr: 'محافظات الدلتا والقناة', labelEn: 'Delta & Canal Governorates' },
    { id: 'upper', labelAr: 'محافظات الصعيد ومحاور الطاقة', labelEn: 'Upper Egypt Governorates' },
  ];

  const serviceOptions = [
    { id: 'cctv', labelAr: 'كاميرات المراقبة الذكية 4K وتحليلات AI', labelEn: '4K CCTV & AI Analytics' },
    { id: 'network', labelAr: 'بنية الشبكات المتطورة وكوابل الفايبر والراكات', labelEn: 'Structured Cabling & Fiber' },
    { id: 'access', labelAr: 'بوابات المرور السريعة والتحكم في الدخول البيومتري', labelEn: 'Biometric Access & Turnstiles' },
    { id: 'erp', labelAr: 'منظومات تخطيط الموارد ERP والربط الضريبي ETA', labelEn: 'Odoo ERP & Egyptian Tax API' },
    { id: 'mobile', labelAr: 'برمجيات ومنصات الويب وتطبيقات الجوال المخصصة', labelEn: 'Custom Software & Mobile Apps' },
    { id: 'consulting', labelAr: 'استشارة فنية متكاملة وتوريدات مشاريع عامة', labelEn: 'Full Integrated Engineering Scope' },
  ];

  const validate = () => {
    if (!name.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة الاسم بالكامل' : 'Please provide your full name');
      return false;
    }
    if (!company.trim()) {
      setErrorMsg(isAr ? 'يرجى تحديد اسم المنشأة أو الشركة' : 'Please provide facility / company name');
      return false;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg(isAr ? 'يرجى كتابة رقم هاتف صحيح للتواصل' : 'Please provide a valid phone number');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const getFormattedMessage = () => {
    const sName = serviceOptions.find((s) => s.id === service)?.[isAr ? 'labelAr' : 'labelEn'] || service;
    const gName = governorateOptions.find((g) => g.id === governorate)?.[isAr ? 'labelAr' : 'labelEn'] || governorate;

    return isAr
      ? `طلب استشارة ومعاينة فنية هندسية - تيك بكرة:\n` +
        `• الاسم: ${name}\n` +
        `• المنشأة / الشركة: ${company}\n` +
        `• الهاتف: ${phone}\n` +
        `• التخصص المطلوب: ${sName}\n` +
        `• النطاق الجغرافي: ${gName}\n` +
        (notes ? `• تفاصيل إضافية: ${notes}\n` : '') +
        `\nأرجو التكرم بالتواصل لتحديد موعد المعاينة.`
      : `Tech Bokra Inquiry & Quote Request:\n` +
        `• Full Name: ${name}\n` +
        `• Facility: ${company}\n` +
        `• Phone: ${phone}\n` +
        `• Solution: ${sName}\n` +
        `• Location: ${gName}\n` +
        (notes ? `• Details: ${notes}\n` : '') +
        `\nPlease get back to me regarding this inquiry.`;
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const text = getFormattedMessage();
    const ref = `TB-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(ref);

    // Persist lead to Firestore asynchronously
    submitInquiry({
      clientName: name,
      phone,
      facilityType: company,
      selectedSystems: service ? [service] : [],
      notes: notes ? `المحافظة: ${governorate} | ${notes}` : `المحافظة: ${governorate}`,
      source: 'contact_form',
    }).catch((err) => console.warn('Inquiry auto-save error:', err));

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const text = getFormattedMessage();
    const ref = `TB-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(ref);

    // Persist lead to Firestore asynchronously
    submitInquiry({
      clientName: name,
      phone,
      facilityType: company,
      selectedSystems: service ? [service] : [],
      notes: notes ? `المحافظة: ${governorate} | ${notes}` : `المحافظة: ${governorate}`,
      source: 'contact_form',
    }).catch((err) => console.warn('Inquiry auto-save error:', err));

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      isAr ? `طلب أو استفسار: ${company}` : `Inquiry & Quote Request: ${company}`
    )}&body=${encodeURIComponent(text)}`;
  };

  return (
    <section 
      id="contact" 
      className={`py-24 relative border-t transition-colors duration-300 ${
        isDark ? 'bg-[#071120] border-white/5 cyber-grid' : 'bg-white border-slate-200 cyber-grid'
      }`}
    >
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

              <div className="grid sm:grid-cols-2 gap-4">
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
                      className={isDark ? 'bg-[#0B1A2F] text-white' : 'bg-white text-slate-900'}
                    >
                      {isAr ? opt.labelAr : opt.labelEn}
                    </option>
                  ))}
                </select>
              </div>

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

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{data.contact.btnWhatsapp}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer border-2 ${
                    isDark
                      ? 'bg-[#10233D] hover:bg-[#152C4D] border-[#00F2FE] text-[#00F2FE]'
                      : 'bg-sky-50 hover:bg-[#0284C7] hover:text-white border-[#0284C7] text-[#0284C7]'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>{data.contact.btnEmail}</span>
                </button>
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
