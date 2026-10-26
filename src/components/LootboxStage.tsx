import React, { useState } from 'react';
import { LootCrateTier } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Coins, Sparkles, AlertCircle } from 'lucide-react';

interface LootboxStageProps {
  tier: LootCrateTier;
  coins: number;
  isOpening: boolean;
  onOpen: () => void;
  onOpenDoodleJump: () => void;
}

export const LootboxStage: React.FC<LootboxStageProps> = ({
  tier,
  coins,
  isOpening,
  onOpen,
  onOpenDoodleJump,
}) => {
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const canAfford = coins >= tier.cost;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpening) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -24;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 select-none">
      {/* 3D Crate Display Stage */}
      <div
        className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center cursor-pointer transition-transform duration-200"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (canAfford && !isOpening) {
            onOpen();
          }
        }}
        style={{
          perspective: '1000px',
        }}
      >
        {/* Glow Halo behind box */}
        <div
          className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full filter blur-3xl opacity-50 transition-all duration-700 pointer-events-none ${
            isHovered ? 'scale-125 opacity-70' : 'scale-100'
          }`}
          style={{ background: tier.glowColor }}
        />

        {/* 3D Box Mesh Container */}
        <div
          className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl transition-transform duration-300 preserve-3d flex items-center justify-center ${
            isOpening ? 'animate-crate-shake' : isHovered ? 'scale-105' : 'animate-crate-float'
          }`}
          style={{
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            backgroundColor: tier.boxColor,
            border: `4px solid ${tier.accentColor}`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 35px ${tier.glowColor}`,
          }}
        >
          {/* Mechanical Seams & Latches */}
          <div className="absolute inset-3 border-2 border-dashed rounded-2xl opacity-40 pointer-events-none" style={{ borderColor: tier.accentColor }} />
          
          {/* Top Latch Plate */}
          <div
            className="absolute -top-3 w-28 h-6 rounded-md shadow-md border flex items-center justify-center"
            style={{ backgroundColor: tier.accentColor, borderColor: '#fff' }}
          >
            <div className="w-12 h-1.5 rounded-full bg-black/40" />
          </div>

          {/* Center Emblem / Tier Sigil */}
          <div
            className="relative w-28 h-28 rounded-2xl flex flex-col items-center justify-center shadow-inner border-2"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderColor: tier.accentColor,
            }}
          >
            <div className="text-4xl filter drop-shadow">
              {tier.tier === 1 && '📦'}
              {tier.tier === 2 && '🧰'}
              {tier.tier === 3 && '🛡️'}
              {tier.tier === 4 && '⚡'}
              {tier.tier === 5 && '👑'}
              {tier.tier === 6 && '🧪'}
              {tier.tier === 7 && '🔮'}
              {tier.tier === 8 && '⚛️'}
              {tier.tier === 9 && '✨'}
              {tier.tier === 10 && '🌌'}
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-300 mt-1">
              Tier {tier.tier}
            </span>
          </div>

          {/* Left & Right Mechanical Clamps */}
          <div
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-16 rounded-l-md border"
            style={{ backgroundColor: tier.accentColor, borderColor: '#fff' }}
          />
          <div
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-16 rounded-r-md border"
            style={{ backgroundColor: tier.accentColor, borderColor: '#fff' }}
          />
        </div>

        {/* Reflective Pedestal Ground Ring */}
        <div
          className="absolute -bottom-8 w-72 sm:w-80 h-16 rounded-[100%] border-2 filter blur-[0.5px] pointer-events-none opacity-60"
          style={{
            borderColor: tier.accentColor,
            background: `radial-gradient(ellipse at center, ${tier.glowColor} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Crate Information & Action Controls */}
      <div className="flex flex-col items-center gap-3 mt-4 z-10 max-w-md w-full px-4">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-white font-display">
            {tier.name}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5 line-clamp-1">
            {tier.subtitle}
          </p>
        </div>

        {/* Primary Unbox Button or Insufficient Coins Alert */}
        {canAfford ? (
          <button
            onClick={() => {
              if (!isOpening) onOpen();
            }}
            disabled={isOpening}
            className="w-full sm:w-80 py-4 px-6 rounded-2xl font-black text-lg uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-yellow-500/25 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-black" />
            <span>Open Crate</span>
            <span className="flex items-center gap-1 bg-black/15 px-3 py-1 rounded-full text-sm font-extrabold">
              <Coins className="w-4 h-4 fill-black" />
              {tier.cost.toLocaleString()}
            </span>
          </button>
        ) : (
          <div className="w-full sm:w-88 flex flex-col items-center gap-2">
            <button
              disabled
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-base uppercase tracking-wider text-zinc-500 bg-zinc-800/80 border border-zinc-700/60 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span>Need {tier.cost.toLocaleString()} Coins</span>
              <span className="text-xs text-zinc-400">(Have {coins.toLocaleString()})</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenDoodleJump();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              <span>🎮</span> Play Doodle Jump to Earn Free Coins!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
