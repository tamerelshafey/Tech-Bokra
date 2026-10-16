'use client';

import React from 'react';

interface TechBokraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'stacked';
  theme?: 'dark' | 'light';
  showSubtitle?: boolean;
  lang?: 'ar' | 'en';
}

export default function TechBokraLogo({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'dark',
  showSubtitle = true,
  lang = 'ar',
}: TechBokraLogoProps) {
  const isLight = theme === 'light';

  // Dimension scaling
  const dimensions = {
    sm: { icon: 32, height: 36, textTech: 'text-base', textBokra: 'text-base', sub: 'text-[9px]' },
    md: { icon: 42, height: 44, textTech: 'text-xl', textBokra: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 54, height: 56, textTech: 'text-2xl', textBokra: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, height: 76, textTech: 'text-4xl', textBokra: 'text-4xl', sub: 'text-sm' },
  }[size];

  // SVG unique gradient IDs based on instance
  const gradIdCyan = `tb-cyan-${isLight ? 'lt' : 'dk'}`;
  const gradIdTeal = `tb-teal-${isLight ? 'lt' : 'dk'}`;
  const gradIdNavy = `tb-navy-${isLight ? 'lt' : 'dk'}`;

  // Emblem Vector: Straightened frontal orthographic projection
  const Emblem = (
    <div
      className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
      style={{ width: dimensions.icon, height: dimensions.icon }}
    >
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyan Fold Gradient */}
          <linearGradient id={gradIdCyan} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#00B4D8' : '#00F2FE'} />
            <stop offset="50%" stopColor={isLight ? '#0096C7' : '#00C4EE'} />
            <stop offset="100%" stopColor={isLight ? '#0077B6' : '#0088B5'} />
          </linearGradient>

          {/* Bottom-left Origami Facet Gradient */}
          <linearGradient id={gradIdTeal} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#48CAE4' : '#00F5D4'} />
            <stop offset="100%" stopColor={isLight ? '#0096C7' : '#00B4D8'} />
          </linearGradient>

          {/* Deep Navy Block Gradient */}
          <linearGradient id={gradIdNavy} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#1E293B' : '#0F2744'} />
            <stop offset="60%" stopColor={isLight ? '#0F172A' : '#091A30'} />
            <stop offset="100%" stopColor={isLight ? '#020617' : '#050D19'} />
          </linearGradient>

          <filter id={`tb-glow-${isLight ? 'lt' : 'dk'}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow 
              dx="0" 
              dy="2" 
              stdDeviation={isLight ? "1.5" : "3"} 
              floodColor={isLight ? "#0284C7" : "#00F2FE"} 
              floodOpacity={isLight ? "0.2" : "0.4"} 
            />
          </filter>
        </defs>

        {/* 1. Upper Geometric Ribbon Fold (Cyan/Turquoise arch) */}
        <path
          d="M 30 32 
             C 30 20, 42 14, 56 14 
             L 112 14 
             C 120 14, 124 19, 122 26 
             L 104 74 
             C 101 82, 92 88, 84 88 
             L 66 88 
             C 55 88, 48 78, 51 68 
             L 57 44 
             C 58 38, 52 34, 46 34 
             C 38 34, 33 40, 30 48 
             L 16 88 
             C 13 96, 7 100, 2 100 
             L 0 100 
             C 0 94, 2 86, 6 78 
             Z"
          fill={`url(#${gradIdCyan})`}
          filter={`url(#tb-glow-${isLight ? 'lt' : 'dk'})`}
        />

        {/* Crisp Bevel Highlight along top fold */}
        <path
          d="M 32 24 L 62 18 L 56 46 L 46 36 Z"
          fill="#FFFFFF"
          opacity={isLight ? "0.35" : "0.5"}
        />

        {/* 2. Lower-Left Prism Fold (Faceted Diamond in Vibrant Cyan) */}
        <g>
          {/* Main front facet */}
          <path
            d="M 4 104 L 52 104 L 28 142 Z"
            fill={`url(#${gradIdTeal})`}
          />
          {/* Side shadow facet */}
          <path
            d="M 28 142 L 52 104 L 62 130 L 38 148 Z"
            fill={isLight ? '#0077B6' : '#007A99'}
          />
          {/* Crease line */}
          <line
            x1="28"
            y1="142"
            x2="52"
            y2="104"
            stroke="#FFFFFF"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
        </g>

        {/* 3. Right Monolithic Navy Block with 45° Pill-cutout */}
        <g>
          {/* Outer angled block */}
          <path
            d="M 80 68 
               L 130 74 
               C 138 75, 142 82, 140 88 
               L 128 144 
               C 126 150, 120 156, 112 156 
               L 68 150 
               C 60 149, 56 142, 58 136 
               L 68 82 
               C 70 74, 74 68, 80 68 
               Z"
            fill={`url(#${gradIdNavy})`}
            stroke={isLight ? '#0284C7' : '#00F2FE'}
            strokeWidth="1.25"
            strokeOpacity={isLight ? "0.35" : "0.4"}
          />

          {/* Precision Diagonal Pill Cutout (Negative space aligned straight) */}
          <rect
            x="86"
            y="94"
            width="17"
            height="48"
            rx="8.5"
            transform="rotate(-36 94 118)"
            fill={isLight ? '#F8FAFC' : '#071120'}
            stroke={isLight ? '#0284C7' : '#00F2FE'}
            strokeWidth="1.5"
            strokeOpacity={isLight ? "0.6" : "0.65"}
          />
        </g>
      </svg>

      {/* Futuristic status pulse dot in dark mode */}
      {!isLight && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" />
      )}
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {Emblem}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {Emblem}

      {/* Typography Stack */}
      <div className="flex flex-col text-start leading-none justify-center">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight font-sans ${dimensions.textTech} ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Tech
          </span>
          <span
            className={`font-black tracking-tight font-sans ${dimensions.textBokra} ${
              isLight ? 'text-[#0284C7]' : 'text-[#00F2FE]'
            }`}
          >
            Bokra
          </span>

          {/* Bilingual Arabic Pill */}
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-cairo border ${
              isLight
                ? 'bg-sky-50 text-sky-700 border-sky-200'
                : 'bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/30'
            }`}
          >
            تيك بكرة
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`mt-1 font-medium tracking-wide ${dimensions.sub} ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            {lang === 'ar' ? 'حلول الأنظمة الأمنية والبنية التحتية' : 'Security & IT Infrastructure'}
          </span>
        )}
      </div>
    </div>
  );
}
