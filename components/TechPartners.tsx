'use client';

import React from 'react';
import { SiteLanguageData } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';

interface TechPartnersProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
}

export default function TechPartners({ lang, data }: TechPartnersProps) {
  const isAr = lang === 'ar';
  const { isDark } = useTheme();

  const partners = [
    { 
      name: 'Cisco Systems', 
      role: isAr ? 'سويتشات وشبكات رئيسية' : 'Enterprise Switches & Routing', 
      badge: isAr ? 'بنية شبكية' : 'Networking' 
    },
    { 
      name: 'Hikvision', 
      role: isAr ? 'كاميرات مراقبة رقمية 4K' : '4K IP Video Surveillance', 
      badge: isAr ? 'أمن مادي' : 'Surveillance' 
    },
    { 
      name: 'Schneider Electric', 
      role: isAr ? 'كابلات مهيكلة وحاويات خوادم' : 'Structured Cabling & Racks', 
      badge: isAr ? 'بنية تحتية' : 'Cabling & Racks' 
    },
    { 
      name: 'Dahua Technology', 
      role: isAr ? 'كاميرات ومراقبة محيطية' : 'Thermal & Perimeter Cameras', 
      badge: isAr ? 'أمن مادي' : 'Surveillance' 
    },
    { 
      name: 'Ubiquiti UniFi', 
      role: isAr ? 'روابط شبكية ولاسلكية' : 'Wireless Bridges & Mesh', 
      badge: isAr ? 'بنية شبكية' : 'Wireless' 
    },
    { 
      name: 'Legrand', 
      role: isAr ? 'مسارات كابلات وتجهيزات كبائن' : 'Cable Trays & Enclosures', 
      badge: isAr ? 'بنية تحتية' : 'Enclosures' 
    },
    { 
      name: 'Odoo Enterprise', 
      role: isAr ? 'منظومات ERP وتكامل الضرائب' : 'ERP & Tax System Integration', 
      badge: isAr ? 'برمجيات' : 'Enterprise ERP' 
    },
    { 
      name: 'Fluke Networks', 
      role: isAr ? 'أجهزة فحص واختبار الشبكات' : 'Structured Cable Testing Tools', 
      badge: isAr ? 'فحص واختبار' : 'Diagnostic Hardware' 
    },
  ];

  return (
    <section 
      className={`py-16 border-y relative transition-colors duration-300 ${
        isDark ? 'bg-[#071120] border-white/5' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {data.partners.title}
          </h3>
          <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {data.partners.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all text-center group ${
                isDark 
                  ? 'bg-[#0B1A2F]/80 border-white/5 hover:border-[#00F2FE]/30' 
                  : 'bg-white border-slate-200 hover:border-[#0284C7]/40 shadow-sm hover:shadow-md'
              }`}
            >
              <div 
                className={`text-sm sm:text-base font-bold font-mono transition-colors ${
                  isDark 
                    ? 'text-white group-hover:text-[#00F2FE]' 
                    : 'text-slate-900 group-hover:text-[#0284C7]'
                }`}
              >
                {partner.name}
              </div>
              <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {partner.role}
              </div>
              <span 
                className={`inline-block mt-2 text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${
                  isDark 
                    ? 'text-[#00F2FE] bg-[#00F2FE]/10 border-[#00F2FE]/20' 
                    : 'text-[#0284C7] bg-sky-50 border-sky-200'
                }`}
              >
                {partner.badge}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
