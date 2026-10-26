import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// --- TIER VECTOR EMBLEMS ---

export const ScrapCrateIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
    <path d="m7 4.5 10 5.8" strokeDasharray="2 2" />
  </svg>
);

export const RustyLockerIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <circle cx="9" cy="12" r="1" fill={color} />
    <circle cx="15" cy="12" r="1" fill={color} />
    <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
    <line x1="18" y1="6" x2="18.01" y2="6" strokeWidth="3" />
    <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
    <line x1="18" y1="18" x2="18.01" y2="18" strokeWidth="3" />
  </svg>
);

export const AlloySafeIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8v8M8 12h8" />
    <path d="M5 7l2 2M19 7l-2 2M5 17l2-2M19 17l-2-2" />
  </svg>
);

export const CyberPodIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" />
    <path d="M12 6l-5 2.8v6.4l5 2.8 5-2.8V8.8L12 6z" strokeWidth="1.5" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

export const GildedVaultIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 17l3-11 5 6 4-6 5 6 3-11v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
    <circle cx="12" cy="16" r="1.5" fill={color} />
    <circle cx="7" cy="16" r="1.5" fill={color} />
    <circle cx="17" cy="16" r="1.5" fill={color} />
  </svg>
);

export const CryoCapsuleIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="7" y="2" width="10" height="20" rx="5" />
    <line x1="10" y1="6" x2="14" y2="6" />
    <line x1="10" y1="18" x2="14" y2="18" />
    <path d="M12 9v6M10 11l4 2M14 11l-4 2" />
  </svg>
);

export const ObsidianRelicIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L4 12l8 10 8-10L12 2z" />
    <path d="M12 2v20" strokeDasharray="2 2" />
    <path d="M4 12h16" />
    <circle cx="12" cy="12" r="3" fill={color} fillOpacity="0.3" />
  </svg>
);

export const PlasmaCoreIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" fill={color} />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)" />
  </svg>
);

export const AstralSanctumIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

export const SingularityMatrixIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" strokeDasharray="3 2" />
    <circle cx="12" cy="12" r="5" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="2.5" fill={color} />
    <path d="M12 2a10 10 0 0 1 8.66 15M2 12a10 10 0 0 1 15-8.66M12 22a10 10 0 0 1-8.66-15M22 12a10 10 0 0 1-15 8.66" strokeWidth="1.5" />
  </svg>
);

// Map tier number to its SVG icon
export const getTierIcon = (tier: number, props: IconProps = {}) => {
  switch (tier) {
    case 1: return <ScrapCrateIcon {...props} />;
    case 2: return <RustyLockerIcon {...props} />;
    case 3: return <AlloySafeIcon {...props} />;
    case 4: return <CyberPodIcon {...props} />;
    case 5: return <GildedVaultIcon {...props} />;
    case 6: return <CryoCapsuleIcon {...props} />;
    case 7: return <ObsidianRelicIcon {...props} />;
    case 8: return <PlasmaCoreIcon {...props} />;
    case 9: return <AstralSanctumIcon {...props} />;
    case 10: return <SingularityMatrixIcon {...props} />;
    default: return <ScrapCrateIcon {...props} />;
  }
};

// --- SILHOUETTE VECTOR ART FOR FIGURES ---

export const FigureSilhouetteIcon: React.FC<{ silhouette: string } & IconProps> = ({ silhouette, className = '', size = 48, color = 'currentColor' }) => {
  switch (silhouette) {
    case 'robot':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="14" y="10" width="20" height="16" rx="4" fill={color} fillOpacity="0.15" />
          <circle cx="20" cy="18" r="2.5" fill={color} />
          <circle cx="28" cy="18" r="2.5" fill={color} />
          <line x1="24" y1="4" x2="24" y2="10" />
          <circle cx="24" cy="4" r="2" fill={color} />
          <line x1="18" y1="22" x2="30" y2="22" />
          <rect x="12" y="26" width="24" height="14" rx="4" fill={color} fillOpacity="0.1" />
          <line x1="8" y1="30" x2="12" y2="30" />
          <line x1="36" y1="30" x2="40" y2="30" />
          <line x1="18" y1="40" x2="18" y2="46" />
          <line x1="30" y1="40" x2="30" y2="46" />
        </svg>
      );
    case 'beast':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M10 12 L16 22 L32 22 L38 12 L36 28 L24 38 L12 28 Z" fill={color} fillOpacity="0.15" />
          <circle cx="18" cy="24" r="2" fill={color} />
          <circle cx="30" cy="24" r="2" fill={color} />
          <path d="M22 30 L24 33 L26 30" />
          <path d="M8 20 L4 26 L10 28" />
          <path d="M40 20 L44 26 L38 28" />
          <line x1="24" y1="38" x2="24" y2="46" />
        </svg>
      );
    case 'winged':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="24" cy="12" r="6" fill={color} fillOpacity="0.15" />
          <path d="M20 20 L28 20 L30 36 L18 36 Z" fill={color} fillOpacity="0.1" />
          <path d="M18 22 C8 16, 2 24, 6 34 C10 32, 14 30, 18 30" fill={color} fillOpacity="0.2" />
          <path d="M30 22 C40 16, 46 24, 42 34 C38 32, 34 30, 30 30" fill={color} fillOpacity="0.2" />
          <line x1="20" y1="36" x2="18" y2="46" />
          <line x1="28" y1="36" x2="30" y2="46" />
        </svg>
      );
    case 'hover':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <ellipse cx="24" cy="20" rx="16" ry="8" fill={color} fillOpacity="0.2" />
          <ellipse cx="24" cy="18" rx="8" ry="4" fill={color} fillOpacity="0.4" />
          <circle cx="24" cy="18" r="3" fill={color} />
          <path d="M12 28 C16 34, 32 34, 36 28" strokeDasharray="3 2" />
          <line x1="24" y1="32" x2="24" y2="42" strokeDasharray="2 2" />
        </svg>
      );
    case 'elemental':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M24 4 C14 16, 10 26, 14 36 C18 44, 30 44, 34 36 C38 26, 34 16, 24 4 Z" fill={color} fillOpacity="0.2" />
          <path d="M24 16 C20 22, 18 28, 20 34 C22 38, 26 38, 28 34 C30 28, 28 22, 24 16 Z" fill={color} fillOpacity="0.4" />
          <circle cx="24" cy="28" r="2.5" fill={color} />
        </svg>
      );
    case 'ninja':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="24" cy="12" r="7" fill={color} fillOpacity="0.2" />
          <path d="M18 12 L30 12" strokeWidth="3" />
          <circle cx="21" cy="11" r="1.5" fill={color} />
          <circle cx="27" cy="11" r="1.5" fill={color} />
          <path d="M16 20 L32 20 L28 36 L20 36 Z" fill={color} fillOpacity="0.15" />
          <line x1="32" y1="16" x2="42" y2="8" />
          <line x1="20" y1="36" x2="18" y2="46" />
          <line x1="28" y1="36" x2="30" y2="46" />
        </svg>
      );
    default: // 'biped'
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="24" cy="10" r="6" fill={color} fillOpacity="0.2" />
          <rect x="16" y="18" width="16" height="18" rx="4" fill={color} fillOpacity="0.15" />
          <circle cx="21" cy="9" r="1.5" fill={color} />
          <circle cx="27" cy="9" r="1.5" fill={color} />
          <line x1="12" y1="20" x2="12" y2="32" />
          <line x1="36" y1="20" x2="36" y2="32" />
          <line x1="20" y1="36" x2="20" y2="46" />
          <line x1="28" y1="36" x2="28" y2="46" />
        </svg>
      );
  }
};

// --- COSMETIC CATEGORY VECTOR ICONS ---

export const CategoryIcon: React.FC<{ category: string } & IconProps> = ({ category, className = '', size = 20, color = 'currentColor' }) => {
  switch (category) {
    case 'hat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2 18h20" />
          <path d="M5 18V10a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v8" />
          <path d="M5 14h14" strokeWidth="1.5" />
        </svg>
      );
    case 'hair':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M6 16c-1-3 0-8 3-10 4-3 9-1 10 3 1 3 0 7-1 9" />
          <path d="M9 10c2-2 5-2 7 0" />
          <path d="M7 6l2 3" />
        </svg>
      );
    case 'glasses':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="6" cy="14" r="4" />
          <circle cx="18" cy="14" r="4" />
          <line x1="10" y1="14" x2="14" y2="14" />
          <line x1="2" y1="14" x2="2" y2="10" />
          <line x1="22" y1="14" x2="22" y2="10" />
        </svg>
      );
    case 'shirt':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.5a2 2 0 0 0 2 1.67h1.14v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-9h1.14a2 2 0 0 0 2-1.67l.58-3.5a2 2 0 0 0-1.34-2.23z" />
        </svg>
      );
    case 'pants':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 4h16v3l-2 13h-4l-2-9-2 9H6L4 7V4z" />
          <line x1="4" y1="7" x2="20" y2="7" />
        </svg>
      );
    case 'shoes':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 17h18v3H3z" />
          <path d="M3 17l2-7 4-1 3 3h6l3 5" />
        </svg>
      );
    case 'gloves':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M8 20V8a2 2 0 0 1 4 0v4a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v6a4 4 0 0 1-4 4H10a4 4 0 0 1-2-4z" />
          <path d="M8 14H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 4 0" />
        </svg>
      );
    case 'belt':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="9" width="20" height="6" rx="2" />
          <rect x="9" y="8" width="6" height="8" rx="1" strokeWidth="2.5" />
          <line x1="12" y1="8" x2="12" y2="16" strokeWidth="2" />
        </svg>
      );
    case 'wearable':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 4C8 2, 2 8, 4 16C6 14, 8 13, 12 14" />
          <path d="M12 4C16 2, 22 8, 20 16C18 14, 16 13, 12 14" />
          <circle cx="12" cy="14" r="2" fill={color} />
        </svg>
      );
    case 'item':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M14.5 4l5.5 5.5-12 12-4-1 1-4 9.5-9.5z" />
          <path d="M11.5 7L17 12.5" />
          <path d="M17 3l4 4" />
        </svg>
      );
    case 'sfx':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" strokeDasharray="3 3" />
          <circle cx="12" cy="12" r="3" fill={color} />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
};
