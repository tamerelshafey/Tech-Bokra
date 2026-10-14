'use client';

import React from 'react';
import { SiteLanguageData } from '@/lib/content';

interface TechPartnersProps {
  lang: 'ar' | 'en';
  data: SiteLanguageData;
}

export default function TechPartners({ lang, data }: TechPartnersProps) {
  const isAr = lang === 'ar';

  const partners = [
    { name: 'Cisco Systems', role: 'Core Switches & Firewalls', badge: 'Certified Partner' },
    { name: 'Hikvision', role: '4K CCTV & AI Analytics', badge: 'Official Dist.' },
    { name: 'Schneider Electric', role: 'Structured Cabling & Racks', badge: 'Tier 1 Standard' },
    { name: 'Dahua Technology', role: 'Thermal & Perimeter Optics', badge: 'Enterprise Line' },
    { name: 'Ubiquiti UniFi', role: 'Enterprise Mesh & Bridges', badge: 'Long Range' },
    { name: 'Legrand', role: 'Cabinets & Cable Trays', badge: 'Certified Specs' },
    { name: 'Odoo Enterprise', role: 'ERP & ETA Tax Integration', badge: 'Custom Solutions' },
    { name: 'Fluke Networks', role: 'Structured Cable Testing', badge: 'DSX Certified' },
  ];

  return (
    <section className="py-16 bg-[#071120] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {data.partners.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {data.partners.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0B1A2F]/80 border border-white/5 hover:border-[#00F2FE]/30 transition-all text-center group"
            >
              <div className="text-sm sm:text-base font-bold text-white font-mono group-hover:text-[#00F2FE] transition-colors">
                {partner.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {partner.role}
              </div>
              <span className="inline-block mt-2 text-[9px] font-mono text-[#00F2FE] bg-[#00F2FE]/10 px-2 py-0.5 rounded border border-[#00F2FE]/20">
                {partner.badge}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
