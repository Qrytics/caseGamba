import React from 'react';
import { PlayerCustomization } from '../types/game';
import { FIGURE_MAP } from '../data/figures';
import { COSMETIC_MAP } from '../data/cosmetics';
import { RARITIES } from '../data/rarities';

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

  const sizePixels = size === 'sm' ? 120 : size === 'md' ? 220 : 320;

  return (
    <div
      onClick={interactive ? onClick : undefined}
      className={`relative flex flex-col items-center justify-center transition-transform ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
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

      {/* SVG Paperdoll Avatar */}
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        style={{ filter: `drop-shadow(0 8px 16px ${rarityConfig.hexColor}40)` }}
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
        </defs>

        {/* --- LAYER 1: BACK WEARABLE (WINGS, JETPACK, BACKPACK) --- */}
        {wearable && (
          <g className="animate-pulse origin-center">
            {wearable.icon === '🪽' && (
              <path
                d="M 50 110 C 10 70, 0 20, 45 40 C 65 50, 75 90, 80 110 M 150 110 C 190 70, 200 20, 155 40 C 135 50, 125 90, 120 110"
                fill={wearable.styleProps.color || '#FFF'}
                opacity="0.85"
                filter={`url(#glow-${customization.figureId})`}
              />
            )}
            {wearable.icon === '🦇' && (
              <path
                d="M 40 120 C 5 60, -10 30, 40 60 C 60 70, 75 95, 80 120 M 160 120 C 195 60, 210 30, 160 60 C 140 70, 125 95, 120 120"
                fill="#880e4f"
                stroke="#ff1744"
                strokeWidth="2"
              />
            )}
            {wearable.icon === '🚀' && (
              <g>
                <rect x="75" y="90" width="16" height="40" rx="6" fill="#546e7a" />
                <rect x="109" y="90" width="16" height="40" rx="6" fill="#546e7a" />
                <path d="M 78 130 L 83 145 L 88 130 Z M 112 130 L 117 145 L 122 130 Z" fill="#ff7043" />
              </g>
            )}
            {wearable.icon === '📦' && (
              <rect x="74" y="90" width="52" height="45" rx="4" fill="#8d6e63" stroke="#5d4037" strokeWidth="3" />
            )}
          </g>
        )}

        {/* --- LAYER 2: SHADOW ON PEDESTAL --- */}
        <ellipse cx="100" cy="225" rx="45" ry="12" fill="rgba(0,0,0,0.5)" />

        {/* --- LAYER 3: BASE FIGURE BODY --- */}
        <g className="animate-avatar-idle origin-bottom">
          {/* LEGS & SHOES */}
          {/* Base Legs */}
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

          {/* HELD ITEM (FRONT HAND) */}
          {item && (
            <g transform="translate(145, 120)">
              {item.icon === '⚔️' && (
                <path d="M 0 0 L 25 -35 L 30 -30 L 5 5 Z M -3 3 L 8 -5" stroke="#00e5ff" strokeWidth="3" fill="#fff" />
              )}
              {item.icon === '🔧' && (
                <rect x="0" y="-30" width="10" height="40" rx="3" fill="#78909c" stroke="#37474f" strokeWidth="2" />
              )}
              {item.icon === '🔨' && (
                <g>
                  <rect x="0" y="-35" width="8" height="45" fill="#8d6e63" />
                  <rect x="-10" y="-45" width="28" height="18" rx="4" fill="#ffd700" stroke="#ff8f00" strokeWidth="2" />
                </g>
              )}
              {item.icon === '🪄' && (
                <path d="M 0 5 L 20 -30 M 15 -35 L 25 -25" stroke="#ff4081" strokeWidth="4" />
              )}
              {item.icon === '🪓' && (
                <g>
                  <rect x="0" y="-35" width="8" height="45" fill="#3e2723" />
                  <path d="M 4 -35 C 20 -40, 25 -10, 4 -15 Z" fill="#ff1744" stroke="#d50000" strokeWidth="2" />
                </g>
              )}
            </g>
          )}

          {/* HEAD & FACE */}
          {/* Neck */}
          <rect x="92" y="80" width="16" height="18" rx="4" fill={variant.primaryColor} />

          {/* Head Shape */}
          <circle
            cx="100"
            cy="60"
            r="32"
            fill="url(#bodyGrad)"
            stroke={variant.accentColor}
            strokeWidth="2.5"
          />

          {/* Eyes based on silhouette */}
          <g>
            <circle cx="90" cy="58" r="5" fill="#FFFFFF" />
            <circle cx="91" cy="58" r="2.5" fill={rarityConfig.hexColor} />
            <circle cx="110" cy="58" r="5" fill="#FFFFFF" />
            <circle cx="109" cy="58" r="2.5" fill={rarityConfig.hexColor} />
            {/* Friendly smile */}
            <path d="M 94 72 Q 100 78 106 72" stroke="#212121" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>

          {/* HAIR COSMETIC */}
          {hair && (
            <g>
              {hair.id === 'hair_r_01' ? (
                <path
                  d="M 68 50 L 75 25 L 85 40 L 98 15 L 110 40 L 122 25 L 132 50 Z"
                  fill={hair.styleProps.color || '#ff9100'}
                  filter={`url(#glow-${customization.figureId})`}
                />
              ) : hair.id === 'hair_u_01' ? (
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

          {/* GLASSES / EYEWEAR COSMETIC */}
          {glasses && (
            <g>
              {glasses.id === 'glasses_r_01' ? (
                // 8-bit Deal With It shades
                <path
                  d="M 75 52 H 125 V 64 H 115 V 60 H 85 V 64 H 75 Z"
                  fill="#111111"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ) : glasses.id === 'glasses_l_01' ? (
                // Cyber HUD Visor
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
                // Round spectacles
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
              {hat.id === 'hat_c_01' && (
                // Cardboard Crown
                <path
                  d="M -26 0 L -18 -22 L -5 -6 L 0 -26 L 5 -6 L 18 -22 L 26 0 Z"
                  fill="#bcaaa4"
                  stroke="#8d6e63"
                  strokeWidth="2"
                />
              )}
              {hat.id === 'hat_l_01' && (
                // Golden Halo
                <g filter={`url(#glow-${customization.figureId})`}>
                  <ellipse cx="0" cy="-20" rx="30" ry="9" fill="none" stroke="#ffd700" strokeWidth="4" />
                  <circle cx="0" cy="-20" r="3" fill="#fff" />
                </g>
              )}
              {hat.id === 'hat_m_01' && (
                // Brimstone Horns
                <g fill="#ff1744" stroke="#b71c1c" strokeWidth="2">
                  <path d="M -22 2 C -35 -15, -25 -35, -40 -40 C -30 -30, -18 -15, -15 2 Z" />
                  <path d="M 22 2 C 35 -15, 25 -35, 40 -40 C 30 -30, 18 -15, 15 2 Z" />
                </g>
              )}
              {hat.id === 'hat_u_01' && (
                // Beanie
                <path d="M -28 5 C -28 -25, 28 -25, 28 5 Z" fill="#00b0ff" stroke="#01579b" strokeWidth="2" />
              )}
              {hat.id === 'hat_r_01' && (
                // Oni Visor
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
      <div className="mt-2 flex flex-col items-center">
        <span
          className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full border shadow-md"
          style={{
            borderColor: rarityConfig.hexColor,
            color: rarityConfig.hexColor,
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        >
          {rarityConfig.name}
        </span>
        <span className="text-white font-bold text-sm tracking-wide mt-1 truncate max-w-[190px]">
          {figure.name}
        </span>
        {interactive && (
          <span className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1 group-hover:text-yellow-400">
            <span>⚙️</span> Edit Avatar
          </span>
        )}
      </div>
    </div>
  );
};
