import React from 'react';
import { LootCrateTier } from '../types/game';
import { CRATE_TIERS } from '../data/tiers';
import { soundEngine } from '../audio/soundEngine';
import { ChevronLeft, ChevronRight, Lock, Check } from 'lucide-react';
import { getTierIcon } from './icons/GameIcons';

interface TierSelectorProps {
  currentTier: number;
  userCoins: number;
  unlockedFigures: Record<string, string[]>;
  onSelectTier: (tierNumber: number) => void;
}

export const TierSelector: React.FC<TierSelectorProps> = ({
  currentTier,
  userCoins,
  unlockedFigures,
  onSelectTier,
}) => {
  const handlePrev = () => {
    if (currentTier > 1) {
      soundEngine.playTierChange();
      onSelectTier(currentTier - 1);
    }
  };

  const handleNext = () => {
    if (currentTier < 10) {
      soundEngine.playTierChange();
      onSelectTier(currentTier + 1);
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-1 select-none px-4">
      <div className="w-full flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          disabled={currentTier <= 1}
          className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed border border-zinc-800 transition-colors text-white"
          title="Previous Tier"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Tier Cards */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 py-1 px-1">
          {CRATE_TIERS.map((tier: LootCrateTier) => {
            const isSelected = tier.tier === currentTier;
            const canAfford = userCoins >= tier.cost;

            const tierFigureIds = tier.figureIds;
            const ownedInTier = tierFigureIds.filter((id) => (unlockedFigures[id] || []).length > 0).length;

            return (
              <button
                key={tier.tier}
                onClick={() => {
                  soundEngine.playTierChange();
                  onSelectTier(tier.tier);
                }}
                className={`relative flex-shrink-0 flex flex-col items-center justify-between p-2 rounded-xl border transition-all duration-200 min-w-[85px] sm:min-w-[98px] ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-400/10 scale-105 shadow-lg shadow-yellow-500/20'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-850'
                }`}
                style={{
                  borderTopColor: isSelected ? tier.accentColor : undefined,
                  borderTopWidth: isSelected ? '3px' : undefined,
                }}
              >
                {/* Header: Tier Number & Status */}
                <div className="w-full flex items-center justify-between">
                  <span className={`text-[10px] font-black ${isSelected ? 'text-yellow-400' : 'text-zinc-400'}`}>
                    T{tier.tier}
                  </span>
                  {!canAfford ? (
                    <Lock className="w-2.5 h-2.5 text-red-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </div>

                {/* Vector Tier Emblem */}
                <div className="my-1">
                  {getTierIcon(tier.tier, {
                    size: 20,
                    color: isSelected ? tier.accentColor : '#94a3b8',
                  })}
                </div>

                {/* Name */}
                <div className="text-[10px] font-bold text-white truncate max-w-[78px] text-center">
                  {tier.name.split(' ')[0]}
                </div>

                {/* Price */}
                <div className="text-[10px] font-extrabold text-amber-400 mt-0.5">
                  {tier.cost >= 1000000
                    ? `${(tier.cost / 1000000).toFixed(1)}M`
                    : tier.cost >= 1000
                    ? `${(tier.cost / 1000).toFixed(0)}k`
                    : tier.cost}
                </div>

                {/* Figure count badge */}
                <div className="text-[9px] text-zinc-400 mt-0.5 flex items-center gap-0.5">
                  {ownedInTier === 20 && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                  {ownedInTier}/20
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentTier >= 10}
          className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed border border-zinc-800 transition-colors text-white"
          title="Next Tier"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
