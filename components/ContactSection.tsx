'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Sparkles
} from 'lucide-react';
import { SiteLanguageData, siteConfig } from '@/lib/content';

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

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('cctv');
  const [governorate, setGovernorate] = useState('cairo');
  const [notes, setNotes] = useState('');
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

  const serviceOptions = [
    { id: 'cctv', labelAr: 'أنظمة المراقبة الذكية وكاميرات 4K (CCTV)', labelEn: 'Intelligent CCTV & Video Analytics' },
    { id: 'network', labelAr: 'البنية التحتية للشبكات وكابلات الفايبر', labelEn: 'Structured Cabling & Fiber Optics' },
    { id: 'access', labelAr: 'أنظمة التحكم بالدخول وبوابات البصمة', labelEn: 'Biometric Access Control & Turnstiles' },
    { id: 'erp', labelAr: 'أنظمة ERP والفاتورة الإلكترونية المصرية', labelEn: 'ERP Systems & Egyptian ETA Tax API' },
    { id: 'mobile', labelAr: 'تطوير تطبيقات الجوال والمنصات السحابية', labelEn: 'Mobile App Development (iOS & Android)' },
    { id: 'consulting', labelAr: 'استشارات التحول الرقمي وعقود الصيانة SLA', labelEn: 'Digital Transformation & SLA Contracts' },
  ];

  const governorateOptions = [
    { id: 'cairo', labelAr: 'القاهرة (مدينة نصر، التجمع، المعادي، مصر الجديدة)', labelEn: 'Cairo (Nasr City, New Cairo, Maadi, Heliopolis)' },
    { id: 'giza', labelAr: 'الجيزة (6 أكتوبر، الشيخ زايد، الدقي، المهندسين)', labelEn: 'Giza (6th of October, Sheikh Zayed, Dokki)' },
    { id: 'new_capital', labelAr: 'العاصمة الإدارية الجديدة والمدن الجديدة', labelEn: 'New Administrative Capital & New Cities' },
    { id: 'alex', labelAr: 'الإسكندرية والساحل الشمالي', labelEn: 'Alexandria & North Coast' },
    { id: 'suez_sinai', labelAr: 'البحر الأحمر، السويس، ورأس سدر', labelEn: 'Red Sea, Suez, Ras Sedr' },
    { id: 'industrial_zones', labelAr: 'المدن والمناطق الصناعية (العاشر، السادات، الروبيكي)', labelEn: 'Industrial Hubs (10th of Ramadan, Sadat, etc.)' },
    { id: 'other', labelAr: 'محافظات ومناطق أخرى', labelEn: 'Other Governorates' },
  ];

  const validate = () => {
    if (!name.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name');
      return false;
    }
    if (!company.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال اسم المنشأة أو الشركة' : 'Please enter company/facility name');
      return false;
    }
    if (!phone.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال رقم الهاتف أو الواتساب' : 'Please enter your phone number');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const getFormattedMessage = () => {
    const sName = serviceOptions.find((s) => s.id === service)?.[isAr ? 'labelAr' : 'labelEn'] || service;
    const gName = governorateOptions.find((g) => g.id === governorate)?.[isAr ? 'labelAr' : 'labelEn'] || governorate;

    return isAr
      ? `طلب استفسار وتواصل مع تيك بكرة (Tech Bokra):\n` +
        `• الاسم: ${name}\n` +
        `• المنشأة: ${company}\n` +
        `• الهاتف: ${phone}\n` +
        `• الخدمة المطلوبة: ${sName}\n` +
        `• الموقع/المدينة: ${gName}\n` +
        (notes ? `• تفاصيل إضافية: ${notes}\n` : '') +
        `\nأرجو التواصل لمناقشة التفاصيل والرد على الاستفسار.`
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
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const text = getFormattedMessage();
    const ref = `TB-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(ref);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      isAr ? `طلب أو استفسار: ${company}` : `Inquiry & Quote Request: ${company}`
    )}&body=${encodeURIComponent(text)}`;
  };

  return (
    <section id="contact" className="py-24 relative bg-[#071120] border-t border-white/5 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10233D] border border-[#00F2FE]/25 text-xs font-semibold text-[#00F2FE] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{data.contact.quickResponseBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            <span>{data.contact.title}</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
            {data.contact.subtitle}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Interactive Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0B1A2F]/90 p-6 sm:p-8 rounded-3xl border border-[#00F2FE]/30 shadow-2xl backdrop-blur-xl relative">
            
            {submittedRef && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-1">
                    {data.contact.successMessage}
                  </div>
                  <div className="font-mono text-emerald-300 text-xs">
                    {isAr ? 'رقم مرجع طلبك: ' : 'Reference ID: '} <strong>{submittedRef}</strong>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="space-y-4 text-start">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {data.contact.nameLabel} <span className="text-[#00F2FE]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={data.contact.namePlaceholder}
                    className="w-full bg-[#10233D] border border-white/10 rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm placeholder-slate-500 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {data.contact.companyLabel} <span className="text-[#00F2FE]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={data.contact.companyPlaceholder}
                    className="w-full bg-[#10233D] border border-white/10 rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm placeholder-slate-500 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] outline-none transition"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {data.contact.phoneLabel} <span className="text-[#00F2FE]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={data.contact.phonePlaceholder}
                    className="w-full bg-[#10233D] border border-white/10 rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm placeholder-slate-500 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {data.contact.governorateLabel}
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-[#10233D] border border-white/10 rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] outline-none transition cursor-pointer"
                  >
                    {governorateOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#0B1A2F] text-white">
                        {isAr ? opt.labelAr : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {data.contact.serviceLabel}
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#10233D] border border-white/10 rounded-xl px-3.5 py-3 text-white text-xs sm:text-sm focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] outline-none transition cursor-pointer"
                >
                  {serviceOptions.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#0B1A2F] text-white">
                      {isAr ? opt.labelAr : opt.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {data.contact.notesLabel}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={data.contact.notesPlaceholder}
                  className="w-full bg-[#10233D] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm placeholder-slate-500 focus:border-[#00F2FE] focus:ring-1 focus:ring-[#00F2FE] outline-none transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(37,211,102,0.3)] transition transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{data.contact.btnWhatsapp}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#10233D] hover:bg-[#152C4D] border-2 border-[#00F2FE] text-[#00F2FE] font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
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
            <div className="p-6 rounded-2xl bg-[#0B1A2F]/90 border border-[#00F2FE]/20 hover:border-[#00F2FE]/40 transition shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#10233D] text-[#00F2FE] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isAr ? 'الخط الساخن والمكالمات الفورية' : 'Engineering Hotline'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'مهندسو الدعم في خدمتك' : 'Available for immediate consult'}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${whatsappNumber}`}
                className="block text-xl font-bold font-mono text-[#00F2FE] hover:underline mt-2 ltr:text-left rtl:text-right"
              >
                {hotlinePhone}
              </a>
            </div>

            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-[#0B1A2F]/90 border border-[#00F2FE]/20 hover:border-[#00F2FE]/40 transition shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#10233D] text-[#00F2FE] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isAr ? 'البريد الإلكتروني المعتمد' : 'Official Support Email'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'لتلقي كراسات الشروط والـ BOQ' : 'Send RFP & Tender Documents'}
                  </p>
                </div>
              </div>
              <a
                href={`mailto:${email}`}
                className="block text-base font-bold font-mono text-slate-200 hover:text-[#00F2FE] hover:underline mt-1"
              >
                {email}
              </a>
            </div>

            {/* Address & Hours */}
            <div className="p-6 rounded-2xl bg-[#0B1A2F]/90 border border-[#00F2FE]/20 hover:border-[#00F2FE]/40 transition shadow-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10233D] text-[#00F2FE] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isAr ? 'المقر الرئيسي' : 'Headquarters'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {address || (isAr ? siteConfig.addressAr : siteConfig.addressEn)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                <div className="w-10 h-10 rounded-xl bg-[#10233D] text-slate-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300">
                    {isAr ? 'ساعات العمل الرسمية' : 'Operating Hours'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
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
