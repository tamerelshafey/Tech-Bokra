'use client';

import React from 'react';

export type LogoEmblemStyle = 'modern-tb' | 'security-shield' | 'cyber-cube' | 'minimal-text';

export interface TechBokraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'stacked';
  theme?: 'dark' | 'light';
  showSubtitle?: boolean;
  showArabicBadge?: boolean;
  lang?: 'ar' | 'en';
  emblemStyle?: LogoEmblemStyle;
  customImageUrl?: string;
  customHeight?: number;
}

export default function TechBokraLogo({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'dark',
  showSubtitle = true,
  showArabicBadge = true,
  lang = 'ar',
  emblemStyle = 'modern-tb',
  customImageUrl,
  customHeight,
}: TechBokraLogoProps) {
  const isLight = theme === 'light';

  // Dimension scaling configuration
  const dimensions = {
    sm: { icon: 34, textTech: 'text-base sm:text-lg', textBokra: 'text-base sm:text-lg', sub: 'text-[10px]', badge: 'text-[9px] px-1.5 py-0.2' },
    md: { icon: 42, textTech: 'text-xl sm:text-2xl', textBokra: 'text-xl sm:text-2xl', sub: 'text-xs', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 54, textTech: 'text-2xl sm:text-3xl', textBokra: 'text-2xl sm:text-3xl', sub: 'text-xs', badge: 'text-xs px-2.5 py-0.5' },
    xl: { icon: 68, textTech: 'text-3xl sm:text-4xl', textBokra: 'text-3xl sm:text-4xl', sub: 'text-sm', badge: 'text-xs px-3 py-1' },
  }[size];

  const iconSize = customHeight ? customHeight : dimensions.icon;

  // SVG Unique IDs
  const idSuffix = isLight ? 'lt' : 'dk';
  const gradPrimary = `tb-primary-${idSuffix}`;
  const gradAccent = `tb-accent-${idSuffix}`;
  const gradPlate = `tb-plate-${idSuffix}`;
  const filterGlow = `tb-glow-${idSuffix}`;

  // 1. Clean Bold Modern TB Monogram (High contrast, luminous in dark theme)
  const renderModernTBEmblem = () => (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full overflow-visible transition-all duration-300 ${
        isLight ? 'drop-shadow-sm' : 'drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]'
      }`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradPrimary} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#0284C7' : '#FFFFFF'} />
          <stop offset="25%" stopColor={isLight ? '#0284C7' : '#00F2FE'} />
          <stop offset="100%" stopColor={isLight ? '#0369A1' : '#0284C7'} />
        </linearGradient>
        <linearGradient id={gradAccent} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#0EA5E9' : '#38BDF8'} />
          <stop offset="100%" stopColor={isLight ? '#0284C7' : '#00F2FE'} />
        </linearGradient>
        <linearGradient id={gradPlate} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#F8FAFC' : '#0E223D'} />
          <stop offset="100%" stopColor={isLight ? '#E2E8F0' : '#061324'} />
        </linearGradient>
        <filter id={filterGlow} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00F2FE" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Hexagonal Base Plate with crisp luminous edge */}
      <polygon
        points="50,6 88,28 88,72 50,94 12,72 12,28"
        fill={`url(#${gradPlate})`}
        stroke={isLight ? '#0284C7' : '#00F2FE'}
        strokeWidth={isLight ? '2.5' : '2.8'}
        strokeOpacity={isLight ? '0.7' : '1'}
        strokeLinejoin="round"
      />

      {/* Futuristic Inner Accent Rings for Dark Theme */}
      {!isLight && (
        <>
          <polygon
            points="50,13 82,31 82,69 50,87 18,69 18,31"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="0.75"
            strokeOpacity="0.3"
            strokeDasharray="4 2"
          />
          {/* Subtle Corner Dots */}
          <circle cx="50" cy="13" r="1.5" fill="#00F2FE" opacity="0.8" />
          <circle cx="82" cy="31" r="1.5" fill="#00F2FE" opacity="0.8" />
          <circle cx="82" cy="69" r="1.5" fill="#00F2FE" opacity="0.8" />
          <circle cx="50" cy="87" r="1.5" fill="#00F2FE" opacity="0.8" />
          <circle cx="18" cy="69" r="1.5" fill="#00F2FE" opacity="0.8" />
          <circle cx="18" cy="31" r="1.5" fill="#00F2FE" opacity="0.8" />
        </>
      )}

      {/* Stylized Interlocking 'T' and 'B' Monogram */}
      {/* 'T' Top Bar & Stem */}
      <path
        d="M 28 32 L 72 32 M 50 32 L 50 70"
        stroke={`url(#${gradPrimary})`}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={!isLight ? `url(#${filterGlow})` : undefined}
      />

      {/* 'B' Right Double Loop connected to stem */}
      <path
        d="M 50 34 H 65 C 72 34, 76 38, 76 45 C 76 51, 71 53, 64 53 M 50 53 H 66 C 74 53, 78 57, 78 63 C 78 70, 72 70, 64 70 H 50"
        stroke={`url(#${gradAccent})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* White Edge Highlight on 'T' Top Bar for Crisp Contrast */}
      {!isLight && (
        <path
          d="M 32 30.5 L 68 30.5"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.9"
        />
      )}

      {/* Precision Center Core Notch */}
      <circle
        cx="50"
        cy="53"
        r="4"
        fill={isLight ? '#0284C7' : '#00F2FE'}
        stroke={isLight ? '#FFFFFF' : '#FFFFFF'}
        strokeWidth="1"
      />
    </svg>
  );

  // 2. High-Contrast Security Shield Emblem
  const renderSecurityShieldEmblem = () => (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full overflow-visible transition-all duration-300 ${
        isLight ? 'drop-shadow-sm' : 'drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]'
      }`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${gradPrimary}-shield`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#0284C7' : '#00F2FE'} />
          <stop offset="100%" stopColor={isLight ? '#0369A1' : '#0284C7'} />
        </linearGradient>
        <linearGradient id={`${gradPlate}-shield`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#F8FAFC' : '#0E223D'} />
          <stop offset="100%" stopColor={isLight ? '#E2E8F0' : '#061324'} />
        </linearGradient>
      </defs>
      {/* Outer Shield Path */}
      <path
        d="M 50 8 L 86 22 C 86 62, 66 86, 50 94 C 34 86, 14 62, 14 22 Z"
        fill={`url(#${gradPlate}-shield)`}
        stroke={isLight ? '#0284C7' : '#00F2FE'}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Aperture Optical Ring */}
      <circle cx="50" cy="48" r="18" stroke={isLight ? '#0284C7' : '#00F2FE'} strokeWidth="2.5" />
      <circle cx="50" cy="48" r="11" fill={`url(#${gradPrimary}-shield)`} />
      <circle cx="50" cy="48" r="4.5" fill={isLight ? '#FFFFFF' : '#FFFFFF'} />
    </svg>
  );

  // 3. Crisp Isometric Cyber Cube
  const renderCyberCubeEmblem = () => (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full overflow-visible transition-all duration-300 ${
        isLight ? 'drop-shadow-sm' : 'drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]'
      }`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top Facet */}
      <polygon
        points="50,14 84,32 50,50 16,32"
        fill={isLight ? '#38BDF8' : '#00F2FE'}
        stroke={isLight ? '#0284C7' : '#FFFFFF'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left Facet */}
      <polygon
        points="16,32 50,50 50,86 16,68"
        fill={isLight ? '#0284C7' : '#0284C7'}
        stroke={isLight ? '#0369A1' : '#00F2FE'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right Facet */}
      <polygon
        points="84,32 50,50 50,86 84,68"
        fill={isLight ? '#0F172A' : '#0B2342'}
        stroke={isLight ? '#0284C7' : '#00F2FE'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Emblem Container
  const Emblem = emblemStyle === 'minimal-text' && !customImageUrl ? null : (
    <div
      className="relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
      style={{ width: iconSize, height: iconSize }}
    >
      {customImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={customImageUrl}
          alt="Tech Bokra Logo"
          className="w-full h-full object-contain rounded-lg drop-shadow-sm"
        />
      ) : emblemStyle === 'security-shield' ? (
        renderSecurityShieldEmblem()
      ) : emblemStyle === 'cyber-cube' ? (
        renderCyberCubeEmblem()
      ) : (
        renderModernTBEmblem()
      )}
    </div>
  );

  // Variant: Just the icon
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {Emblem}
      </div>
    );
  }

  // Variant: Stacked (Emblem on top of text)
  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center gap-2 select-none ${className}`}>
        {Emblem}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 flex-nowrap">
            <span
              className={`font-black tracking-tight font-sans ${dimensions.textTech} ${
                isLight ? 'text-slate-950 font-black' : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]'
              }`}
            >
              Tech
            </span>
            <span
              className={`font-black tracking-tight font-sans ${dimensions.textBokra} ${
                isLight ? 'text-[#0284C7]' : 'text-[#00F2FE] drop-shadow-[0_0_12px_rgba(0,242,254,0.4)]'
              }`}
            >
              Bokra
            </span>
            {showArabicBadge && (
              <span
                className={`rounded-md font-bold font-cairo border ${dimensions.badge} ${
                  isLight
                    ? 'bg-sky-50 text-sky-950 border-sky-300 font-black'
                    : 'bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/40 font-bold shadow-[0_0_8px_rgba(0,242,254,0.18)]'
                }`}
              >
                تيك بكرة
              </span>
            )}
          </div>
          {showSubtitle && (
            <span
              className={`mt-1 font-semibold tracking-wide ${dimensions.sub} ${
                isLight ? 'text-slate-700' : 'text-slate-300 drop-shadow-sm'
              }`}
            >
              {lang === 'ar' ? 'حلول الأنظمة الأمنية والبنية التحتية' : 'Security & IT Infrastructure'}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default Variant: Full (Horizontal inline)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none min-w-0 ${className}`}>
      {Emblem}

      {/* Typography Stack */}
      <div className="flex flex-col text-start leading-tight justify-center min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
          <span
            className={`font-black tracking-tight font-sans transition-colors ${dimensions.textTech} ${
              isLight ? 'text-slate-950 font-black' : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]'
            }`}
          >
            Tech
          </span>
          <span
            className={`font-black tracking-tight font-sans transition-colors ${dimensions.textBokra} ${
              isLight ? 'text-[#0284C7]' : 'text-[#00F2FE] drop-shadow-[0_0_12px_rgba(0,242,254,0.4)]'
            }`}
          >
            Bokra
          </span>

          {/* Bilingual Arabic Badge */}
          {showArabicBadge && (
            <span
              className={`rounded-md font-bold font-cairo border shrink-0 transition-all ${dimensions.badge} ${
                isLight
                  ? 'bg-sky-50 text-sky-950 border-sky-300 font-black'
                  : 'bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/40 font-bold shadow-[0_0_8px_rgba(0,242,254,0.18)]'
              }`}
            >
              تيك بكرة
            </span>
          )}
        </div>

        {/* Subtitle - Responsively hidden on extra small screens so it never breaks navbar */}
        {showSubtitle && (
          <span
            className={`mt-0.5 font-semibold tracking-wide hidden sm:inline-block truncate ${dimensions.sub} ${
              isLight ? 'text-slate-700' : 'text-slate-300 drop-shadow-sm'
            }`}
          >
            {lang === 'ar' ? 'حلول الأنظمة الأمنية والبنية التحتية والبرمجيات' : 'Security, Infrastructure & Software'}
          </span>
        )}
      </div>
    </div>
  );
}
