import React from 'react';
import { LootCrateTier } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Coins, Sparkles, AlertCircle, Play } from 'lucide-react';
import { ThreeLootbox } from './ThreeLootbox';

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
  const canAfford = coins >= tier.cost;

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none py-2">
      {/* 3D WebGL Lootbox Canvas */}
      <ThreeLootbox
        tier={tier}
        isOpening={isOpening}
        onOpenClick={() => {
          if (canAfford && !isOpening) {
            onOpen();
          }
        }}
      />

      {/* Crate Information & Action Controls */}
      <div className="flex flex-col items-center gap-3 mt-2 z-10 max-w-md w-full px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span
              className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full border shadow-sm"
              style={{
                borderColor: tier.accentColor,
                color: tier.accentColor,
                backgroundColor: 'rgba(0,0,0,0.6)',
              }}
            >
              Tier {tier.tier} Crate
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-white font-display">
            {tier.name}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5 line-clamp-1 max-w-sm">
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
            className="w-full sm:w-80 py-3.5 px-6 rounded-2xl font-black text-base uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-yellow-500/25 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-black" />
            <span>Open Crate</span>
            <span className="flex items-center gap-1 bg-black/15 px-3 py-1 rounded-full text-xs font-black">
              <Coins className="w-4 h-4 fill-black" />
              {tier.cost.toLocaleString()}
            </span>
          </button>
        ) : (
          <div className="w-full sm:w-88 flex flex-col items-center gap-2">
            <button
              disabled
              className="w-full py-3 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider text-zinc-500 bg-zinc-800/80 border border-zinc-700/60 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>Need {tier.cost.toLocaleString()} Coins</span>
              <span className="text-xs text-zinc-400">(Have {coins.toLocaleString()})</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenDoodleJump();
              }}
              className="w-full py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-400" />
              Play Doodle Jump to Earn Free Coins
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
