import React from 'react';
import { PlayerCustomization } from '../types/game';
import { FIGURE_MAP } from '../data/figures';
import { COSMETIC_MAP } from '../data/cosmetics';
import { RARITIES } from '../data/rarities';
import { Sliders } from 'lucide-react';

interface CharacterAvatarProps {
  customization: PlayerCustomization;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  customization,
  size = 'md',
  interactive = true,
  onClick,
}) => {
  const figure = FIGURE_MAP[customization.figureId] || FIGURE_MAP['t1_fig_01'];
  const variant = figure.variants[customization.figureRarity] || figure.variants.common;
  const rarityConfig = RARITIES[customization.figureRarity] || RARITIES.common;

  // Resolve equipped cosmetics
  const hat = customization.cosmetics.hat ? COSMETIC_MAP[customization.cosmetics.hat] : null;
  const hair = customization.cosmetics.hair ? COSMETIC_MAP[customization.cosmetics.hair] : null;
  const glasses = customization.cosmetics.glasses ? COSMETIC_MAP[customization.cosmetics.glasses] : null;
  const shirt = customization.cosmetics.shirt ? COSMETIC_MAP[customization.cosmetics.shirt] : null;
  const pants = customization.cosmetics.pants ? COSMETIC_MAP[customization.cosmetics.pants] : null;
  const shoes = customization.cosmetics.shoes ? COSMETIC_MAP[customization.cosmetics.shoes] : null;
  const gloves = customization.cosmetics.gloves ? COSMETIC_MAP[customization.cosmetics.gloves] : null;
  const belt = customization.cosmetics.belt ? COSMETIC_MAP[customization.cosmetics.belt] : null;
  const wearable = customization.cosmetics.wearable ? COSMETIC_MAP[customization.cosmetics.wearable] : null;
  const item = customization.cosmetics.item ? COSMETIC_MAP[customization.cosmetics.item] : null;
  const sfx = customization.cosmetics.sfx ? COSMETIC_MAP[customization.cosmetics.sfx] : null;

  const sizePixels = size === 'sm' ? 120 : size === 'md' ? 200 : 280;

  return (
    <div
      onClick={interactive ? onClick : undefined}
      className={`relative flex flex-col items-center justify-center transition-transform ${
        interactive ? 'cursor-pointer hover:scale-102 active:scale-98' : ''
      }`}
      style={{ width: sizePixels, height: sizePixels + 40 }}
      title={interactive ? 'Click to Customize Avatar' : figure.name}
    >
      {/* Outer ambient aura / glow based on rarity and SFX */}
      <div
        className="absolute inset-0 rounded-full filter blur-xl opacity-40 transition-all duration-700 pointer-events-none"
        style={{
          background: sfx?.styleProps?.color || variant.glowColor || rarityConfig.glowColor,
          transform: 'scale(0.85)',
        }}
      />

      {/* SVG Paperdoll Avatar Model */}
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        style={{ filter: `drop-shadow(0 8px 16px ${rarityConfig.hexColor}35)` }}
      >
        <defs>
          <filter id={`glow-${customization.figureId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={variant.primaryColor} />
            <stop offset="100%" stopColor={variant.accentColor} />
          </linearGradient>
          <linearGradient id="armorShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* --- LAYER 1: BACK WEARABLE (WINGS, JETPACK, BACKPACK) --- */}
        {wearable && (
          <g className="animate-pulse origin-center">
            {wearable.iconName === 'seraphim-wings' && (
              <path
                d="M 50 110 C 10 70, 0 20, 45 40 C 65 50, 75 90, 80 110 M 150 110 C 190 70, 200 20, 155 40 C 135 50, 125 90, 120 110"
                fill={wearable.styleProps.color || '#FFF'}
                opacity="0.85"
                filter={`url(#glow-${customization.figureId})`}
              />
            )}
            {wearable.iconName === 'dragon-wings' && (
              <path
                d="M 40 120 C 5 60, -10 30, 40 60 C 60 70, 75 95, 80 120 M 160 120 C 195 60, 210 30, 160 60 C 140 70, 125 95, 120 120"
                fill="#880e4f"
                stroke="#ff1744"
                strokeWidth="2"
              />
            )}
            {wearable.iconName === 'blade-wings' && (
              <g stroke="#00e5ff" strokeWidth="2.5" fill="none">
                <path d="M 40 110 L 10 70 L 45 80 L 15 50 L 55 60 L 75 95" />
                <path d="M 160 110 L 190 70 L 155 80 L 185 50 L 145 60 L 125 95" />
              </g>
            )}
            {wearable.iconName === 'jet-turbine' && (
              <g>
                <rect x="74" y="90" width="16" height="40" rx="6" fill="#546e7a" />
                <rect x="110" y="90" width="16" height="40" rx="6" fill="#546e7a" />
                <path d="M 77 130 L 82 145 L 87 130 Z M 113 130 L 118 145 L 123 130 Z" fill="#ff7043" />
              </g>
            )}
            {wearable.iconName === 'box-backpack' && (
              <rect x="74" y="90" width="52" height="45" rx="4" fill="#8d6e63" stroke="#5d4037" strokeWidth="3" />
            )}
          </g>
        )}

        {/* --- LAYER 2: SHADOW ON PEDESTAL --- */}
        <ellipse cx="100" cy="225" rx="45" ry="12" fill="rgba(0,0,0,0.5)" />

        {/* --- LAYER 3: BASE FIGURE BODY --- */}
        <g className="animate-avatar-idle origin-bottom">
          {/* LEGS & SHOES */}
          <rect x="80" y="150" width="16" height="45" rx="6" fill={variant.primaryColor} />
          <rect x="104" y="150" width="16" height="45" rx="6" fill={variant.primaryColor} />

          {/* Pants Cosmetic Layer */}
          {pants ? (
            <g>
              <rect
                x="78"
                y="145"
                width="20"
                height="40"
                rx="4"
                fill={pants.styleProps.color || '#37474f'}
                stroke="#263238"
                strokeWidth="1.5"
              />
              <rect
                x="102"
                y="145"
                width="20"
                height="40"
                rx="4"
                fill={pants.styleProps.color || '#37474f'}
                stroke="#263238"
                strokeWidth="1.5"
              />
            </g>
          ) : null}

          {/* Shoes Cosmetic Layer */}
          {shoes ? (
            <g>
              <rect
                x="75"
                y="185"
                width="24"
                height="16"
                rx="6"
                fill={shoes.styleProps.color || '#212121'}
                stroke="#424242"
                strokeWidth="2"
              />
              <rect
                x="101"
                y="185"
                width="24"
                height="16"
                rx="6"
                fill={shoes.styleProps.color || '#212121'}
                stroke="#424242"
                strokeWidth="2"
              />
            </g>
          ) : (
            <g>
              <ellipse cx="88" cy="195" rx="10" ry="6" fill="#37474f" />
              <ellipse cx="112" cy="195" rx="10" ry="6" fill="#37474f" />
            </g>
          )}

          {/* TORSO / SHIRT */}
          <rect
            x="72"
            y="95"
            width="56"
            height="58"
            rx="12"
            fill="url(#bodyGrad)"
            stroke={variant.accentColor}
            strokeWidth="2"
          />
          <rect x="72" y="95" width="56" height="58" rx="12" fill="url(#armorShine)" />

          {/* Shirt Cosmetic */}
          {shirt && (
            <rect
              x="70"
              y="93"
              width="60"
              height="55"
              rx="10"
              fill={shirt.styleProps.color || '#3949ab'}
              stroke="#1a237e"
              strokeWidth="2"
            />
          )}

          {/* Belt Cosmetic */}
          {belt && (
            <g>
              <rect x="70" y="142" width="60" height="10" rx="3" fill={belt.styleProps.color || '#4e342e'} />
              <rect x="94" y="140" width="12" height="14" rx="2" fill="#ffd700" stroke="#ffb300" strokeWidth="1" />
            </g>
          )}

          {/* ARMS & GLOVES */}
          {/* Left Arm */}
          <rect
            x="52"
            y="100"
            width="16"
            height="42"
            rx="8"
            fill={variant.primaryColor}
            transform="rotate(8 60 100)"
          />
          {/* Right Arm */}
          <rect
            x="132"
            y="100"
            width="16"
            height="42"
            rx="8"
            fill={variant.primaryColor}
            transform="rotate(-8 140 100)"
          />

          {/* Gloves Cosmetic */}
          {gloves ? (
            <g>
              <ellipse cx="52" cy="144" rx="10" ry="10" fill={gloves.styleProps.color || '#ffb300'} />
              <ellipse cx="148" cy="144" rx="10" ry="10" fill={gloves.styleProps.color || '#ffb300'} />
            </g>
          ) : (
            <g>
              <circle cx="53" cy="142" r="7" fill={variant.accentColor} />
              <circle cx="147" cy="142" r="7" fill={variant.accentColor} />
            </g>
          )}

          {/* HELD WEAPON / RELIC */}
          {item && (
            <g transform="translate(145, 120)">
              {item.iconName === 'neon-katana' && (
                <path d="M 0 0 L 25 -35 L 30 -30 L 5 5 Z M -3 3 L 8 -5" stroke="#00e5ff" strokeWidth="3" fill="#fff" />
              )}
              {item.iconName === 'pipe-wrench' && (
                <rect x="0" y="-30" width="10" height="40" rx="3" fill="#78909c" stroke="#37474f" strokeWidth="2" />
              )}
              {item.iconName === 'banhammer' && (
                <g>
                  <rect x="0" y="-35" width="8" height="45" fill="#8d6e63" />
                  <rect x="-10" y="-45" width="28" height="18" rx="4" fill="#ffd700" stroke="#ff8f00" strokeWidth="2" />
                </g>
              )}
              {item.iconName === 'crowbar' && (
                <path d="M 0 5 L 20 -30 M 15 -35 L 25 -25" stroke="#90a4ae" strokeWidth="4" />
              )}
              {item.iconName === 'blood-scythe' && (
                <g>
                  <rect x="0" y="-35" width="8" height="45" fill="#3e2723" />
                  <path d="M 4 -35 C 20 -40, 25 -10, 4 -15 Z" fill="#ff1744" stroke="#d50000" strokeWidth="2" />
                </g>
              )}
            </g>
          )}

          {/* HEAD & FACE */}
          <rect x="92" y="80" width="16" height="18" rx="4" fill={variant.primaryColor} />

          <circle
            cx="100"
            cy="60"
            r="32"
            fill="url(#bodyGrad)"
            stroke={variant.accentColor}
            strokeWidth="2.5"
          />

          {/* Eyes / Face visor */}
          <g>
            <circle cx="90" cy="58" r="5" fill="#FFFFFF" />
            <circle cx="91" cy="58" r="2.5" fill={rarityConfig.hexColor} />
            <circle cx="110" cy="58" r="5" fill="#FFFFFF" />
            <circle cx="109" cy="58" r="2.5" fill={rarityConfig.hexColor} />
            <path d="M 94 72 Q 100 78 106 72" stroke="#212121" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>

          {/* HAIR COSMETIC */}
          {hair && (
            <g>
              {hair.iconName === 'hair-spikes' ? (
                <path
                  d="M 68 50 L 75 25 L 85 40 L 98 15 L 110 40 L 122 25 L 132 50 Z"
                  fill={hair.styleProps.color || '#ff9100'}
                  filter={`url(#glow-${customization.figureId})`}
                />
              ) : hair.iconName === 'hair-pompadour' ? (
                <path
                  d="M 66 55 C 65 20, 135 20, 134 55 C 130 35, 70 35, 66 55 Z"
                  fill={hair.styleProps.color || '#00b0ff'}
                />
              ) : (
                <path
                  d="M 70 58 C 70 30, 130 30, 130 58 C 120 40, 80 40, 70 58 Z"
                  fill={hair.styleProps.color || '#795548'}
                />
              )}
            </g>
          )}

          {/* GLASSES / VISOR COSMETIC */}
          {glasses && (
            <g>
              {glasses.iconName === 'pixel-shades' ? (
                <path
                  d="M 75 52 H 125 V 64 H 115 V 60 H 85 V 64 H 75 Z"
                  fill="#111111"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ) : glasses.iconName === 'omni-visor' ? (
                <rect
                  x="74"
                  y="50"
                  width="52"
                  height="16"
                  rx="6"
                  fill="rgba(0, 229, 255, 0.7)"
                  stroke="#00e5ff"
                  strokeWidth="2"
                  filter={`url(#glow-${customization.figureId})`}
                />
              ) : (
                <g stroke="#ffd700" strokeWidth="2" fill="none">
                  <circle cx="89" cy="58" r="9" />
                  <circle cx="111" cy="58" r="9" />
                  <line x1="98" y1="58" x2="102" y2="58" />
                </g>
              )}
            </g>
          )}

          {/* HAT / HELMET COSMETIC */}
          {hat && (
            <g transform="translate(100, 32)">
              {hat.iconName === 'crown' && (
                <path
                  d="M -26 0 L -18 -22 L -5 -6 L 0 -26 L 5 -6 L 18 -22 L 26 0 Z"
                  fill="#bcaaa4"
                  stroke="#8d6e63"
                  strokeWidth="2"
                />
              )}
              {hat.iconName === 'astral-halo' && (
                <g filter={`url(#glow-${customization.figureId})`}>
                  <ellipse cx="0" cy="-20" rx="30" ry="9" fill="none" stroke="#ffd700" strokeWidth="4" />
                  <circle cx="0" cy="-20" r="3" fill="#fff" />
                </g>
              )}
              {hat.iconName === 'brimstone-horns' && (
                <g fill="#ff1744" stroke="#b71c1c" strokeWidth="2">
                  <path d="M -22 2 C -35 -15, -25 -35, -40 -40 C -30 -30, -18 -15, -15 2 Z" />
                  <path d="M 22 2 C 35 -15, 25 -35, 40 -40 C 30 -30, 18 -15, 15 2 Z" />
                </g>
              )}
              {hat.iconName === 'beanie' && (
                <path d="M -28 5 C -28 -25, 28 -25, 28 5 Z" fill="#00b0ff" stroke="#01579b" strokeWidth="2" />
              )}
              {hat.iconName === 'oni-visor' && (
                <path
                  d="M -30 -5 L 30 -5 L 24 -22 L 0 -12 L -24 -22 Z"
                  fill="#ff9100"
                  stroke="#ff3d00"
                  strokeWidth="2"
                />
              )}
            </g>
          )}
        </g>
      </svg>

      {/* Name and Rarity Tag Badge */}
      <div className="mt-1 flex flex-col items-center">
        <span
          className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full border shadow-sm"
          style={{
            borderColor: rarityConfig.hexColor,
            color: rarityConfig.hexColor,
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        >
          {rarityConfig.name}
        </span>
        <span className="text-white font-bold text-xs tracking-wide mt-0.5 truncate max-w-[170px]">
          {figure.name}
        </span>
        {interactive && (
          <span className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1 hover:text-yellow-400">
            <Sliders className="w-3 h-3" /> Customize
          </span>
        )}
      </div>
    </div>
  );
};
