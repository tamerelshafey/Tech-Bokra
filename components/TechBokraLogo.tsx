'use client';

import React from 'react';

export type LogoEmblemStyle = 'modern-tb' | 'security-shield' | 'cyber-cube';

export interface TechBokraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'stacked';
  theme?: 'dark' | 'light';
  showSubtitle?: boolean;
  lang?: 'ar' | 'en';
  emblemStyle?: LogoEmblemStyle;
  customImageUrl?: string;
}

export default function TechBokraLogo({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'dark',
  showSubtitle = true,
  lang = 'ar',
  emblemStyle = 'modern-tb',
  customImageUrl,
}: TechBokraLogoProps) {
  const isLight = theme === 'light';

  // Dimension scaling configuration
  const dimensions = {
    sm: { icon: 34, textTech: 'text-base', textBokra: 'text-base', sub: 'text-[9px]', badge: 'text-[9px] px-1 py-0.2' },
    md: { icon: 44, textTech: 'text-lg sm:text-xl', textBokra: 'text-lg sm:text-xl', sub: 'text-[10px]', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { icon: 56, textTech: 'text-2xl sm:text-3xl', textBokra: 'text-2xl sm:text-3xl', sub: 'text-xs', badge: 'text-xs px-2 py-0.5' },
    xl: { icon: 72, textTech: 'text-3xl sm:text-4xl', textBokra: 'text-3xl sm:text-4xl', sub: 'text-sm', badge: 'text-xs px-2.5 py-1' },
  }[size];

  // SVG unique gradient IDs based on instance to prevent conflicts
  const idSuffix = isLight ? 'lt' : 'dk';
  const gradCyan = `tb-cyan-grad-${idSuffix}`;
  const gradAzure = `tb-azure-grad-${idSuffix}`;
  const gradNavy = `tb-navy-grad-${idSuffix}`;
  const gradGlow = `tb-glow-${idSuffix}`;

  // 1. Vector Emblem: Modern Straightened Origami "TB" Monogram
  const renderModernTBEmblem = () => (
    <svg
      viewBox="0 0 120 120"
      className="w-full h-full drop-shadow-md overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Luminous Cyan to Sky Blue Gradient */}
        <linearGradient id={gradCyan} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#00B4D8' : '#00F2FE'} />
          <stop offset="50%" stopColor={isLight ? '#0096C7' : '#00D5F7'} />
          <stop offset="100%" stopColor={isLight ? '#0284C7' : '#0099C7'} />
        </linearGradient>

        {/* Luminous Teal to Emerald Azure Gradient */}
        <linearGradient id={gradAzure} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#48CAE4' : '#00F5D4'} />
          <stop offset="100%" stopColor={isLight ? '#0096C7' : '#00B4D8'} />
        </linearGradient>

        {/* Deep Tech Block Gradient - Fully visible in both dark & light modes */}
        <linearGradient id={gradNavy} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#1E293B' : '#143153'} />
          <stop offset="50%" stopColor={isLight ? '#0F172A' : '#0E243E'} />
          <stop offset="100%" stopColor={isLight ? '#020617' : '#0A1B2F'} />
        </linearGradient>

        {/* Neon Ambient Glow Filter */}
        <filter id={gradGlow} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow 
            dx="0" 
            dy="2" 
            stdDeviation={isLight ? "1" : "3"} 
            floodColor={isLight ? "#0284C7" : "#00F2FE"} 
            floodOpacity={isLight ? "0.2" : "0.55"} 
          />
        </filter>
      </defs>

      {/* Background Tech Hexagon Glow / Shield Frame */}
      <polygon
        points="60,6 106,32 106,88 60,114 14,88 14,32"
        fill={isLight ? '#F1F5F9' : '#0B1C30'}
        stroke={isLight ? '#CBD5E1' : '#00F2FE'}
        strokeWidth={isLight ? '1.5' : '1.5'}
        strokeOpacity={isLight ? '0.8' : '0.4'}
        className="transition-colors duration-300"
      />

      {/* Tech Grid Accents inside Hexagon */}
      <line x1="14" y1="60" x2="106" y2="60" stroke={isLight ? '#94A3B8' : '#00F2FE'} strokeWidth="0.75" strokeDasharray="3 3" strokeOpacity={isLight ? '0.35' : '0.25'} />
      <line x1="60" y1="6" x2="60" y2="114" stroke={isLight ? '#94A3B8' : '#00F2FE'} strokeWidth="0.75" strokeDasharray="3 3" strokeOpacity={isLight ? '0.35' : '0.25'} />

      {/* 1. Upper Origami Ribbon Fold (T-Top Arch) */}
      <path
        d="M 28 34 
           C 28 24, 38 18, 50 18 
           L 86 18 
           C 93 18, 97 22, 95 28 
           L 82 64 
           C 79 70, 72 75, 65 75 
           L 54 75 
           C 46 75, 41 68, 43 60 
           L 47 42 
           C 48 38, 43 35, 38 35 
           C 32 35, 29 40, 27 46 
           L 20 68 
           C 18 73, 14 76, 9 76 
           Z"
        fill={`url(#${gradCyan})`}
        filter={`url(#${gradGlow})`}
      />

      {/* 3D Bevel Edge Highlight on Top Fold */}
      <path
        d="M 30 26 L 54 20 L 48 40 L 40 34 Z"
        fill="#FFFFFF"
        opacity={isLight ? '0.45' : '0.65'}
      />

      {/* 2. Lower-Left Origami Prism Facets */}
      <g>
        <path
          d="M 12 80 L 46 80 L 28 106 Z"
          fill={`url(#${gradAzure})`}
        />
        <path
          d="M 28 106 L 46 80 L 54 98 L 36 109 Z"
          fill={isLight ? '#0077B6' : '#0085A8'}
        />
        <line
          x1="28"
          y1="106"
          x2="46"
          y2="80"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
      </g>

      {/* 3. Right Monolithic Tech Block with 45° Precision Pill Cutout */}
      <g>
        {/* Outer angled block with high-contrast electric rim */}
        <path
          d="M 64 54 
             L 98 58 
             C 103 59, 106 64, 104 69 
             L 96 104 
             C 94 109, 89 113, 83 113 
             L 53 108 
             C 47 107, 44 102, 46 97 
             L 54 64 
             C 55 58, 59 54, 64 54 
             Z"
          fill={`url(#${gradNavy})`}
          stroke={isLight ? '#0284C7' : '#00F2FE'}
          strokeWidth={isLight ? '1.75' : '2'}
          strokeOpacity={isLight ? '0.85' : '0.95'}
        />

        {/* Luminous Inner Bevel */}
        <path
          d="M 65 57 L 96 61 L 94 72 L 67 67 Z"
          fill={isLight ? '#38BDF8' : '#00F2FE'}
          opacity={isLight ? '0.35' : '0.45'}
        />

        {/* Precision Diagonal Pill Cutout (Optical Core Aperture) */}
        <rect
          x="68"
          y="72"
          width="13"
          height="34"
          rx="6.5"
          transform="rotate(-34 74 89)"
          fill={isLight ? '#FFFFFF' : '#071120'}
          stroke={isLight ? '#0284C7' : '#00F2FE'}
          strokeWidth={isLight ? '1.75' : '2'}
        />

        {/* Glowing Center Core Pulse inside cutout */}
        <circle
          cx="74"
          cy="89"
          r="3"
          fill={isLight ? '#0284C7' : '#00F2FE'}
          className={!isLight ? 'animate-pulse' : ''}
        />
      </g>

      {/* Corner Status Beacon */}
      <circle
        cx="100"
        cy="20"
        r="3.5"
        fill={isLight ? '#0284C7' : '#00F2FE'}
        filter={!isLight ? `url(#${gradGlow})` : undefined}
      />
    </svg>
  );

  // 2. Vector Emblem: Cyber Security Shield & Aperture
  const renderSecurityShieldEmblem = () => (
    <svg
      viewBox="0 0 120 120"
      className="w-full h-full drop-shadow-md overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${gradCyan}-s`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#0284C7' : '#00F2FE'} />
          <stop offset="100%" stopColor={isLight ? '#0369A1' : '#0284C7'} />
        </linearGradient>
      </defs>
      {/* Outer Shield Path */}
      <path
        d="M 60 10 L 102 26 C 102 70, 78 100, 60 112 C 42 100, 18 70, 18 26 Z"
        fill={isLight ? '#F8FAFC' : '#0B1C30'}
        stroke={isLight ? '#0284C7' : '#00F2FE'}
        strokeWidth="2.5"
      />
      {/* Inner Camera / Network Node Aperture */}
      <circle cx="60" cy="56" r="22" stroke={isLight ? '#0284C7' : '#00F2FE'} strokeWidth="2" strokeDasharray="4 2" />
      <circle cx="60" cy="56" r="14" fill={`url(#${gradCyan}-s)`} />
      <circle cx="60" cy="56" r="6" fill={isLight ? '#FFFFFF' : '#071120'} />
      {/* Circuit Nodes */}
      <line x1="60" y1="18" x2="60" y2="34" stroke={isLight ? '#0284C7' : '#00F2FE'} strokeWidth="2" />
      <line x1="60" y1="78" x2="60" y2="102" stroke={isLight ? '#0284C7' : '#00F2FE'} strokeWidth="2" />
      <line x1="30" y1="56" x2="38" y2="56" stroke={isLight ? '#0284C7' : '#00F2FE'} strokeWidth="2" />
      <line x1="82" y1="56" x2="90" y2="56" stroke={isLight ? '#0284C7' : '#00F2FE'} strokeWidth="2" />
    </svg>
  );

  // 3. Vector Emblem: Cyber Isometric Cube
  const renderCyberCubeEmblem = () => (
    <svg
      viewBox="0 0 120 120"
      className="w-full h-full drop-shadow-md overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top Facet */}
      <polygon points="60,16 98,38 60,60 22,38" fill={isLight ? '#38BDF8' : '#00F2FE'} opacity={isLight ? '0.9' : '0.85'} />
      {/* Left Facet */}
      <polygon points="22,38 60,60 60,104 22,82" fill={isLight ? '#0284C7' : '#0096C7'} />
      {/* Right Facet */}
      <polygon points="98,38 60,60 60,104 98,82" fill={isLight ? '#0F172A' : '#0B2342'} stroke={isLight ? '#0284C7' : '#00F2FE'} strokeWidth="1.5" />
      {/* Inner Glowing TB letter cut */}
      <path d="M 40 46 L 80 46 M 60 46 L 60 76 M 60 62 L 74 62 C 78 62, 80 65, 80 69 C 80 73, 78 76, 60 76" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );

  // Emblem Container
  const Emblem = (
    <div
      className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
      style={{ width: dimensions.icon, height: dimensions.icon }}
    >
      {customImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={customImageUrl}
          alt="Tech Bokra Logo"
          className="w-full h-full object-contain rounded-lg drop-shadow-md"
        />
      ) : emblemStyle === 'security-shield' ? (
        renderSecurityShieldEmblem()
      ) : emblemStyle === 'cyber-cube' ? (
        renderCyberCubeEmblem()
      ) : (
        renderModernTBEmblem()
      )}

      {/* Futuristic status pulse dot in dark mode */}
      {!isLight && !customImageUrl && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]" />
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
            <span
              className={`rounded font-bold font-cairo border ${dimensions.badge} ${
                isLight
                  ? 'bg-sky-100 text-sky-950 border-sky-300 font-black'
                  : 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/40 font-bold'
              }`}
            >
              تيك بكرة
            </span>
          </div>
          {showSubtitle && (
            <span
              className={`mt-1 font-medium tracking-wide ${dimensions.sub} ${
                isLight ? 'text-slate-600' : 'text-slate-400'
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
      <div className="flex flex-col text-start leading-none justify-center min-w-0">
        <div className="flex items-center gap-1.5 flex-nowrap">
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

          {/* Bilingual Arabic Badge */}
          <span
            className={`rounded font-bold font-cairo border shrink-0 ${dimensions.badge} ${
              isLight
                ? 'bg-sky-100 text-sky-950 border-sky-300 font-black'
                : 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/40 font-bold'
            }`}
          >
            تيك بكرة
          </span>
        </div>

        {/* Subtitle - Responsively hidden on extra small screens so it never breaks navbar */}
        {showSubtitle && (
          <span
            className={`mt-1 font-medium tracking-wide hidden sm:inline-block truncate ${dimensions.sub} ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            {lang === 'ar' ? 'حلول الأنظمة الأمنية والبنية التحتية' : 'Security & IT Infrastructure'}
          </span>
        )}
      </div>
    </div>
  );
}
