import React from 'react';

interface BottleSvgProps {
  type: 'santal' | 'blackopium' | 'libre' | 'bleu' | 'missdior' | 'aventus' | 'generic';
  width?: number | string;
  height?: number | string;
}

export const BottleSvg: React.FC<BottleSvgProps> = ({ type, width = '100%', height = '100%' }) => {
  switch (type) {
    case 'santal':
      return (
        <svg width={width} height={height} viewBox="0 0 220 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bottleGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2D3F57" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#92400E" stopOpacity="0.9" />
            </linearGradient>
            <clipPath id="bottleClip">
              <rect x="30" y="100" width="160" height="200" rx="14" />
            </clipPath>
          </defs>
          {/* Base */}
          <rect x="30" y="100" width="160" height="200" rx="14" fill="url(#bottleGrad)" />
          {/* Liquid */}
          <rect x="30" y="200" width="160" height="100" fill="url(#liquidGrad)" clipPath="url(#bottleClip)" />
          {/* Shine */}
          <rect x="30" y="100" width="60" height="200" rx="14" fill="url(#glassShine)" clipPath="url(#bottleClip)" />
          {/* Neck */}
          <rect x="82" y="56" width="56" height="52" rx="6" fill="url(#bottleGrad)" />
          {/* Cap */}
          <rect x="72" y="30" width="76" height="34" rx="8" fill="#D97706" />
          <rect x="72" y="30" width="76" height="10" rx="8" fill="#F59E0B" />
          {/* Sprayer line */}
          <rect x="107" y="18" width="6" height="16" rx="3" fill="#D97706" />
          <rect x="100" y="12" width="20" height="8" rx="4" fill="#D97706" />
          {/* Label */}
          <rect
            x="50"
            y="140"
            width="120"
            height="80"
            rx="4"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
          <text
            x="110"
            y="168"
            textAnchor="middle"
            fontFamily="Cormorant Garamond"
            fontSize="14"
            fill="rgba(255,255,255,0.9)"
            fontWeight="300"
            letterSpacing="3"
          >
            SCENT
          </text>
          <text
            x="110"
            y="190"
            textAnchor="middle"
            fontFamily="Cormorant Garamond"
            fontSize="22"
            fill="#D97706"
            fontWeight="400"
            letterSpacing="2"
          >
            Atelier
          </text>
          <text
            x="110"
            y="208"
            textAnchor="middle"
            fontFamily="DM Sans"
            fontSize="8"
            fill="rgba(255,255,255,0.3)"
            letterSpacing="4"
          >
            EAU DE PARFUM
          </text>
          {/* Dots decoration */}
          <circle cx="68" cy="168" r="2" fill="rgba(217,119,6,0.4)" />
          <circle cx="152" cy="168" r="2" fill="rgba(217,119,6,0.4)" />
          {/* Bottom edge highlight */}
          <rect x="30" y="296" width="160" height="4" rx="2" fill="rgba(217,119,6,0.15)" clipPath="url(#bottleClip)" />
        </svg>
      );
    case 'blackopium':
      return (
        <svg width={width} height={height} viewBox="0 0 80 140">
          <rect x="10" y="38" width="60" height="90" rx="30" fill="#7C3AED" opacity="0.6" />
          <rect x="22" y="18" width="36" height="24" rx="6" fill="#7C3AED" opacity="0.5" />
          <rect x="18" y="10" width="44" height="12" rx="6" fill="#D97706" />
          <rect x="36" y="5" width="8" height="8" rx="4" fill="#D97706" />
        </svg>
      );
    case 'libre':
      return (
        <svg width={width} height={height} viewBox="0 0 60 100">
          <rect x="10" y="25" width="40" height="65" rx="4" fill="#D97706" opacity="0.6" />
          <rect x="18" y="12" width="24" height="16" rx="4" fill="#D97706" opacity="0.5" />
          <rect x="14" y="5" width="32" height="10" rx="5" fill="#1E293B" />
        </svg>
      );
    case 'bleu':
      return (
        <svg width={width} height={height} viewBox="0 0 80 145">
          <rect x="10" y="35" width="60" height="98" rx="10" fill="#0284C7" opacity="0.5" />
          <rect x="22" y="16" width="36" height="23" rx="5" fill="#0284C7" opacity="0.4" />
          <rect x="18" y="8" width="44" height="12" rx="6" fill="#1E293B" />
          <rect x="18" y="85" width="44" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        </svg>
      );
    case 'missdior':
      return (
        <svg width={width} height={height} viewBox="0 0 85 145">
          <rect x="12" y="38" width="61" height="95" rx="6" fill="#DB2777" opacity="0.4" />
          <rect x="23" y="16" width="39" height="26" rx="5" fill="#DB2777" opacity="0.35" />
          <rect x="20" y="8" width="45" height="12" rx="6" fill="#D97706" />
          <circle cx="42" cy="95" r="18" fill="rgba(219,39,119,0.2)" />
        </svg>
      );
    case 'aventus':
      return (
        <svg width={width} height={height} viewBox="0 0 60 100">
          <rect x="10" y="30" width="40" height="60" rx="8" fill="#059669" opacity="0.5" />
          <rect x="18" y="16" width="24" height="17" rx="5" fill="#059669" opacity="0.4" />
          <rect x="16" y="8" width="28" height="10" rx="5" fill="#D97706" />
        </svg>
      );
    case 'generic':
    default:
      return (
        <svg width={width} height={height} viewBox="0 0 70 100">
          <rect x="15" y="20" width="40" height="65" rx="6" fill="#2D3F57" />
          <rect x="24" y="10" width="22" height="16" rx="4" fill="#2D3F57" />
          <rect x="20" y="4" width="30" height="10" rx="5" fill="#D97706" />
          <rect x="15" y="55" width="40" height="30" rx="0" fill="rgba(217,119,6,0.3)" />
        </svg>
      );
  }
};
