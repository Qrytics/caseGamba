import React, { useState } from 'react';
import { Rarity } from '../types/game';
import { CRATE_TIERS } from '../data/tiers';
import { FIGURES_BY_TIER } from '../data/figures';
import { RARITIES, RARITY_LIST } from '../data/rarities';
import { soundEngine } from '../audio/soundEngine';
import { X, Trophy, Sparkles } from 'lucide-react';
import { getTierIcon, FigureSilhouetteIcon } from './icons/GameIcons';

interface CollectionModalProps {
  unlockedFigures: Record<string, Rarity[]>;
  onClose: () => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  unlockedFigures,
  onClose,
}) => {
  const [selectedTier, setSelectedTier] = useState<number>(1);

  let totalVariantSlots = 200 * 5;
  let ownedVariantCount = 0;

  Object.values(unlockedFigures).forEach((rarities) => {
    ownedVariantCount += rarities.length;
  });

  const tierFigures = FIGURES_BY_TIER[selectedTier] || [];
  const tierTotalVariants = tierFigures.length * 5;
  let tierOwnedVariants = 0;

  tierFigures.forEach((fig) => {
    const owned = unlockedFigures[fig.id] || [];
    tierOwnedVariants += owned.length;
  });

  const overallPercent = ((ownedVariantCount / totalVariantSlots) * 100).toFixed(1);
  const tierPercent = ((tierOwnedVariants / tierTotalVariants) * 100).toFixed(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-4xl h-[85vh] bg-zinc-950 border-2 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-900/90 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-display">
                Figures Codex (200 Figures / 1,000 Variants)
              </h3>
              <p className="text-[11px] text-zinc-400">
                Collect all 5 rarity variants (Common, Uncommon, Rare, Mythic, Legendary) for every figure
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-zinc-900 px-6 py-2.5 border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold text-zinc-300">Codex Completion:</span>
            <span className="text-xs sm:text-sm font-black text-yellow-400">
              {ownedVariantCount} / {totalVariantSlots} ({overallPercent}%)
            </span>
          </div>
          <div className="w-full sm:w-64 bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-yellow-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* Tier Tabs Strip */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-2.5 border-b border-zinc-800 bg-zinc-900/40">
          {CRATE_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.tier;
            return (
              <button
                key={tier.tier}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedTier(tier.tier);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-yellow-400 text-black shadow-md scale-102'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {getTierIcon(tier.tier, { size: 14, color: isSelected ? '#000' : 'currentColor' })}
                <span>T{tier.tier}</span>
                <span className="truncate max-w-[70px]">{tier.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Tier Completion Sub-Header */}
        <div className="px-6 py-2 bg-zinc-900/60 flex items-center justify-between text-xs border-b border-zinc-800">
          <span className="text-zinc-300 font-bold">
            Tier {selectedTier}: {tierOwnedVariants} / {tierTotalVariants} variants unlocked ({tierPercent}%)
          </span>
          <span className="text-zinc-500 text-[11px]">
            20 Figures in pool
          </span>
        </div>

        {/* 20 Figures Grid for Selected Tier */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tierFigures.map((fig) => {
            const ownedRarities = unlockedFigures[fig.id] || [];
            const hasAny = ownedRarities.length > 0;

            return (
              <div
                key={fig.id}
                className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                  hasAny
                    ? 'bg-zinc-900/80 border-zinc-700'
                    : 'bg-zinc-950/40 border-zinc-850 opacity-40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold mb-1.5">
                    <span>#{fig.id.split('_')[2]}</span>
                    <FigureSilhouetteIcon
                      silhouette={fig.silhouette}
                      size={20}
                      color={hasAny ? '#fbbf24' : '#64748b'}
                    />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white truncate">{fig.name}</h4>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5">
                    {fig.description}
                  </p>
                </div>

                {/* 5 Rarity Variant Slots */}
                <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-zinc-800">
                  {RARITY_LIST.map((rarity) => {
                    const isOwned = ownedRarities.includes(rarity);
                    const rConfig = RARITIES[rarity];

                    return (
                      <div
                        key={rarity}
                        className={`flex-1 py-0.5 rounded text-center text-[9px] font-black uppercase tracking-wider border transition-all ${
                          isOwned
                            ? 'shadow-sm font-extrabold'
                            : 'opacity-20 border-zinc-800 bg-zinc-900 text-zinc-600'
                        }`}
                        style={{
                          borderColor: isOwned ? rConfig.hexColor : undefined,
                          backgroundColor: isOwned ? `${rConfig.hexColor}25` : undefined,
                          color: isOwned ? rConfig.hexColor : undefined,
                        }}
                        title={`${fig.variants[rarity].title} (${rConfig.name})`}
                      >
                        {rConfig.name[0]}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[11px]">Duplicates automatically cash out for bonus coins.</span>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="py-1.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
