'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Network, 
  Layers, 
  Cpu, 
  FileCheck, 
  PhoneCall, 
  CheckCircle2,
  Sparkles 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useCustomConfig } from '@/lib/useCustomConfig';

interface FaqCategoryItem {
  id: string;
  categoryAr: string;
  categoryEn: string;
  icon: any;
  items: {
    qAr: string;
    qEn: string;
    aAr: string;
    aEn: string;
  }[];
}

export default function FaqView() {
  const { lang, isAr, toggleLanguage, data } = useLanguage();
  const { isDark } = useTheme();
  const [customConfig] = useCustomConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'item-0-0': true,
    'item-1-0': true,
  });

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const toggleAccordion = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const faqData: FaqCategoryItem[] = [
    {
      id: 'general',
      categoryAr: 'نطاق الخدمات والتوريد',
      categoryEn: 'Scope & Supply',
      icon: ShieldCheck,
      items: [
        {
          qAr: 'ما هي منظومة الخدمات والحلول التي تقدمها شركة تيك بكرة؟',
          qEn: 'What engineering solutions and services does Tech Bokra provide?',
          aAr: 'تقدم تيك بكرة حلولاً هندسية وتقنية متكاملة للمنشآت والمؤسسات تشمل: أنظمة الأمن المادي (كاميرات مراقبة CCTV، بوابات وتحكم بالدخول)، البنية التحتية والشبكات ومراكز البيانات، أنظمة التيار الخفيف (الإنذار الصوتي والحريق)، بالإضافة إلى تطوير البرمجيات المؤسسية وحلول تكامل الأنظمة.',
          aEn: 'Tech Bokra delivers integrated turnkey engineering solutions for enterprises: physical security systems (CCTV, access control, speed gates), network infrastructure and data centers, low current systems (fire alarm, public address), and custom enterprise software development.'
        },
        {
          qAr: 'هل يقتصر دوركم على توريد الأجهزة فقط، أم تتولون دورة المشروع كاملة؟',
          qEn: 'Do you only supply equipment or provide full turnkey delivery?',
          aAr: 'نقدم خدمات المشروعات المتكاملة (Turnkey Projects) بدءاً من المعاينة الميدانية وإعداد المخططات الهندسية والمقايسات (BOQ)، مروراً بالتوريد المعتمد من الوكلاء، والتركيبات وتمديد الكابلات، والبرمجة، وصولاً للاختبارات والتسليم الرسمي والتدريب.',
          aEn: 'We deliver complete turnkey projects: from initial site surveys, architectural CAD design, and BOQ formulation, to authorized supply, certified structured cabling, configuration, commissioning, and handover.'
        },
        {
          qAr: 'هل تقدمون خدماتكم للشركات الصغيرة والمتوسطة أم للمؤسسات الكبرى فقط؟',
          qEn: 'Do you serve SMEs or only large-scale enterprises?',
          aAr: 'نصمم حلولنا وفق حجم المنشأة والميزانية المعتمدة. ننفذ مشروعات تبدأ من الفروع التجارية والمقرات الإدارية وصولاً إلى المجمعات اللوجستية والمصانع ومراكز البيانات الكبرى.',
          aEn: 'We tailor each solution to facility scale and operational budget—serving projects from single corporate branches to sprawling industrial compounds and enterprise data centers.'
        }
      ]
    },
    {
      id: 'security-elv',
      categoryAr: 'أنظمة الأمن المادي والتيار الخفيف',
      categoryEn: 'Physical Security & ELV',
      icon: Layers,
      items: [
        {
          qAr: 'هل كاميرات المراقبة الموردة معتمدة وتتوافق مع اشتراطات الأمن والدفاع المدني؟',
          qEn: 'Are CCTV systems compliant with civil defense and security standards?',
          aAr: 'نعم، نلتزم في مشروعاتنا بتوريد كاميرات معتمدة ومطابقة لمواصفات الأمن العام والدفاع المدني من حيث الدقة (Resolution)، سعات وأيام التخزين (Retention Period)، والرؤية الليلية وخاصية WDR ومقاومة العوامل الجوية (IP67/IK10).',
          aEn: 'Yes, all supplied surveillance systems strictly comply with regulatory standards regarding resolution, storage retention periods, low-light imaging, WDR, and environmental ratings (IP67/IK10).'
        },
        {
          qAr: 'كيف يتم حساب سعات التخزين والباندويث لكاميرات المراقبة؟',
          qEn: 'How are video storage capacities and bandwidth calculated?',
          aAr: 'تُحسب هندسياً وفق عدد الكاميرات، الدقة، معدل الإطارات (FPS)، تقنية الضغط (H.265 / Smart Codec)، ونسبة الحركة اليومية، مع تطبيق مصفوفات حماية الأقراص (RAID 5 / RAID 6) لضمان عدم فقدان التسجيلات.',
          aEn: 'Calculations are engineered based on channel count, frame rate (FPS), compression standards (H.265/H.265+), motion duty cycle, and storage resilience matrices (RAID 5/6) to prevent data loss.'
        },
        {
          qAr: 'ما هي أنظمة التيار الخفيف (ELV) التي تقومون بتصميمها وتركيبها؟',
          qEn: 'What low current (ELV) systems do you design and install?',
          aAr: 'تشمل أنظمة إنذار الحريق المعنونة (Addressable Fire Alarm)، الإذاعة الداخلية والصوتيات (Public Address & BGM)، بوابات الأفراد الدوارة (Speed Gates / Turnstiles)، أجهزة الحضور والانصراف البيومترية، والإنتركم المرئي الشبكي.',
          aEn: 'We deliver addressable fire alarm networks, public address systems (PA/BGM), speed gates and optical turnstiles, biometric time attendance, and IP video intercoms.'
        }
      ]
    },
    {
      id: 'network',
      categoryAr: 'الشبكات ومراكز البيانات',
      categoryEn: 'Network & Data Centers',
      icon: Network,
      items: [
        {
          qAr: 'ما المعايير المتبعة في تمديد وتنظيم كابلات الشبكات (Structured Cabling)؟',
          qEn: 'What standards govern your structured cabling installations?',
          aAr: 'نتبع المعايير القياسية العالمية (TIA/EIA-568 وBICSI)، باستخدام كابلات Cat6 / Cat6A أصلية وخيوط ألياف بصرية (Single-mode / Multi-mode)، مع الترقيم المنظم (Patch Panels & Labels) والفحص بأجهزة الفحص المتخصصة.',
          aEn: 'We adhere strictly to ANSI/TIA-568 and BICSI standards using authentic Cat6/Cat6A copper and optical fiber, organized patch panel termination, universal cable labeling, and channel certification testing.'
        },
        {
          qAr: 'هل تقومون بتجهيز غرف السيرفرات ومراكز البيانات؟',
          qEn: 'Do you equip and build server rooms and data centers?',
          aAr: 'نعم، نتولى تجهيز غرف الخوادم بالكامل: تثبيت الراكّات (Server Racks)، أنظمة التبريد الدقيق (Precision Cooling)، وحدات الطاقة غير المنقطعة (UPS)، مسارات كابلات السقف المرتفعة والأرضيات المرفوعة (Raised Floor).',
          aEn: 'Yes, we handle complete server room fit-outs: rack enclosures, precision air conditioning, centralized UPS systems, overhead cable trays, and raised access flooring.'
        }
      ]
    },
    {
      id: 'contracts',
      categoryAr: 'التعاقد والضمان والدعم الفني (SLA)',
      categoryEn: 'Contracts, Warranty & SLA',
      icon: FileCheck,
      items: [
        {
          qAr: 'ما هي شروط وضمانات التوريد للأجهزة والبرمجيات؟',
          qEn: 'What are the hardware and software warranty terms?',
          aAr: 'كافة الأجهزة والمعدات مشمولة بالضمان الرسمي المعتمد من الوكيل المحلي والمصنّع (من عام إلى 3 أعوام حسب نوع الجهاز). ونقدم وثائق الضمان الأصلية وسيريال الأجهزة مع محضر التسليم الابتدائي.',
          aEn: 'All hardware comes with official authorized agent warranties (typically 1 to 3 years depending on vendor). Official warranty certificates and serial lists are provided upon provisional handover.'
        },
        {
          qAr: 'هل توفرون عقود صيانة دورية واستجابة طوارئ بعد انتهاء المشروع؟',
          qEn: 'Do you provide preventative maintenance and emergency SLA contracts?',
          aAr: 'نعم، نقدم عقود صيانة سنوية مخصصة (SLA Contracts) تشمل زيارات الفحص الدوري الوقائي، تنظيف وضبط الأجهزة، وتحديثات الفيرموير، مع التزام بأوقات استجابة سريعة ومحددة لبلاغات الطوارئ والأعطال.',
          aEn: 'Yes, we provide structured annual maintenance agreements (SLA) covering periodic preventative maintenance visits, firmware upgrades, and guaranteed rapid response SLAs for critical system outages.'
        },
        {
          qAr: 'ما هي الخطوة الأولى لبدء مشروع أو طلب مقايسة من تيك بكرة؟',
          qEn: 'What is the first step to request a site survey or project quotation?',
          aAr: 'الخطوة الأولى هي التواصل معنا عبر نموذج "طلب معاينة واستفسار" في الموقع أو عبر الواتساب/الهاتف، حيث يقوم مهندسونا بمراجعة المتطلبات الأولية وتحديد موعد لزيارة الموقع أو جلسة دراسة النطاق الفني.',
          aEn: 'The easiest first step is submitting our "Request Survey & Quote" form or connecting via WhatsApp/phone. Our team will review your initial scope and schedule an on-site survey or technical consultation.'
        }
      ]
    }
  ];

  // Filtering based on search query and category
  const filteredCategories = faqData.map((cat) => {
    if (activeCategory !== 'all' && cat.id !== activeCategory) {
      return null;
    }

    const matchedItems = cat.items.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = isAr ? item.qAr : item.qEn;
      const ans = isAr ? item.aAr : item.aEn;
      return title.toLowerCase().includes(q) || ans.toLowerCase().includes(q);
    });

    if (matchedItems.length === 0) return null;

    return {
      ...cat,
      items: matchedItems,
    };
  }).filter(Boolean) as FaqCategoryItem[];

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
        showProjectsSection={customConfig.showProjectsSection}
        showProcessSection={customConfig.showProcessSection}
        showFaqSection={customConfig.showFaqSection}
        showEstimator={customConfig.showEstimator}
        showTenders={customConfig.showTenders}
        showEngineeringHub={customConfig.showEngineeringHub}
        customProjects={customConfig.projectsList}
      />

      <main className="pt-28 pb-20">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/" className="hover:text-[#00F2FE] transition">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <span className={isDark ? 'text-white' : 'text-slate-900'}>
              {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
            </span>
          </nav>

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${
                isDark 
                  ? 'bg-[#10233D] border-[#00F2FE]/30 text-[#00F2FE]' 
                  : 'bg-sky-50 border-sky-200 text-[#0284C7]'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{isAr ? 'مركز الأسئلة الشائعة والمعلومات الفنية' : 'Knowledge Base & Technical FAQs'}</span>
            </div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>{isAr ? 'إجابات واضحة وشفافة' : 'Frequently Asked'}</span>{' '}
              <span className={isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'}>
                {isAr ? 'حول خدماتنا ومشاريعنا' : 'Questions & Specs'}
              </span>
            </h1>

            <p className={`text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isAr
                ? 'إجابات مفصلة ومباشرة تغطي كافة استفسارات التوريد، التركيبات، الضمان، وعقود الصيانة للمشروعات الهندسية.'
                : 'Direct, clear answers covering our supply models, engineering codes, hardware warranties, and SLA support agreements.'}
            </p>

            {/* Interactive Search Bar */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute top-3.5 left-4 rtl:left-auto rtl:right-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'ابحث في الأسئلة (مثال: كاميرات، كابلات، ضمان، صيانة)...' : 'Search questions (e.g., CCTV, cabling, SLA, warranty)...'}
                  className={`w-full py-3.5 px-12 rounded-2xl text-xs sm:text-sm border outline-none transition ${
                    isDark 
                      ? 'bg-[#0B1A2F] border-white/10 text-white placeholder-slate-500 focus:border-[#00F2FE]' 
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0284C7] shadow-sm'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute top-3.5 right-4 rtl:right-auto rtl:left-4 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    {isAr ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  activeCategory === 'all'
                    ? isDark
                      ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE]'
                      : 'bg-[#0284C7] text-white border-[#0284C7]'
                    : isDark
                      ? 'bg-[#0B1A2F] text-slate-300 hover:bg-[#10233D] border-white/5'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {isAr ? 'جميع الأسئلة' : 'All Topics'}
              </button>

              {faqData.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    activeCategory === cat.id
                      ? isDark
                        ? 'bg-[#00F2FE] text-[#071120] border-[#00F2FE]'
                        : 'bg-[#0284C7] text-white border-[#0284C7]'
                      : isDark
                        ? 'bg-[#0B1A2F] text-slate-300 hover:bg-[#10233D] border-white/5'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {isAr ? cat.categoryAr : cat.categoryEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Accordion Lists by Category */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mb-20">
          {filteredCategories.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${
              isDark ? 'bg-[#0B1A2F] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'لم يتم العثور على نتائج تطابق بحثك' : 'No matching questions found'}
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {isAr ? 'جرب البحث بكلمات أخرى أو تواصل مباشرة مع فريقنا الهندسي' : 'Try different keywords or contact our engineering desk'}
              </p>
            </div>
          ) : (
            filteredCategories.map((category, catIdx) => {
              const CategoryIcon = category.icon;
              return (
                <div key={category.id} className="space-y-4">
                  {/* Category Title */}
                  <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                    <CategoryIcon className="w-5 h-5 text-[#00F2FE]" />
                    <h2 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isAr ? category.categoryAr : category.categoryEn}
                    </h2>
                  </div>

                  {/* Category Items Accordion */}
                  <div className="space-y-3">
                    {category.items.map((item, itemIdx) => {
                      const itemKey = `item-${catIdx}-${itemIdx}`;
                      const isOpen = !!openItems[itemKey];

                      return (
                        <div
                          key={itemIdx}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            isDark
                              ? isOpen
                                ? 'bg-[#0B1A2F] border-[#00F2FE]/40 shadow-lg'
                                : 'bg-[#0B1A2F]/60 border-white/5 hover:border-white/15'
                              : isOpen
                                ? 'bg-white border-[#0284C7]/40 shadow-md'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleAccordion(itemKey)}
                            className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-start cursor-pointer focus:outline-none"
                          >
                            <span className={`text-sm sm:text-base font-bold ${
                              isOpen
                                ? isDark ? 'text-[#00F2FE]' : 'text-[#0284C7]'
                                : isDark ? 'text-slate-200' : 'text-slate-900'
                            }`}>
                              {isAr ? item.qAr : item.qEn}
                            </span>
                            <div className={`p-1.5 rounded-lg shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 bg-[#00F2FE]/20 text-[#00F2FE]' : 'text-slate-400'
                            }`}>
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </button>

                          {isOpen && (
                            <div className={`px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t ${
                              isDark ? 'text-slate-300 border-white/5' : 'text-slate-600 border-slate-100'
                            }`}>
                              {isAr ? item.aAr : item.aEn}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Direct Ask Question CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`p-8 sm:p-10 rounded-3xl border space-y-4 ${
            isDark ? 'bg-[#10233D]/70 border-[#00F2FE]/25' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isAr ? 'هل لديك استفسار فني خاص بمشروعك لم تجده هنا؟' : 'Have a Specific Engineering Question for Your Facility?'}
            </h2>
            <p className={`text-xs sm:text-sm max-w-lg mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isAr
                ? 'فريقنا الهندسي متاح للرد على أي مواصفات أو استشارات فنية تتعلق بمشروعك فوراً.'
                : 'Our consultants are available to provide technical scoping and direct answers for your project.'}
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0369A1] text-[#071120] font-black text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                <span>{isAr ? 'تواصل مع مستشار هندسي الآن' : 'Consult an Engineer'}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
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
        footerRights={isAr ? customConfig.footerRightsAr : customConfig.footerRightsEn}
        customProjects={customConfig.projectsList}
        showProjectsSection={customConfig.showProjectsSection}
        showProcessSection={customConfig.showProcessSection}
        showFaqSection={customConfig.showFaqSection}
        showEstimator={customConfig.showEstimator}
        showTenders={customConfig.showTenders}
        showEngineeringHub={customConfig.showEngineeringHub}
      />
    </div>
  );
}
