import React, { useEffect, useState } from 'react';
import { DroppedItem } from '../types/game';
import { RARITIES } from '../data/rarities';
import { soundEngine } from '../audio/soundEngine';
import { LootItemCard } from './LootItemCard';
import confetti from 'canvas-confetti';
import { Coins, CheckCircle, ChevronRight } from 'lucide-react';

interface OpeningOverlayProps {
  items: DroppedItem[];
  tierCost: number;
  onFinish: () => void;
}

type AnimationPhase = 'windup' | 'blast' | 'ascend' | 'land' | 'reveal';

export const OpeningOverlay: React.FC<OpeningOverlayProps> = ({ items, onFinish }) => {
  const [phase, setPhase] = useState<AnimationPhase>('windup');
  const [revealedCards, setRevealedCards] = useState<boolean[]>([false, false, false, false]);

  const totalDuplicateEarnings = items.reduce((sum, item) => sum + (item.isDuplicate ? item.duplicatePayout : 0), 0);

  useEffect(() => {
    // Phase 1: Windup (0 - 1200ms)
    soundEngine.playWindup(1.2);

    // Phase 2: Detonation / Blast (1200ms)
    const blastTimer = setTimeout(() => {
      setPhase('blast');
      soundEngine.playExplosion();
    }, 1200);

    // Phase 3: Ascend (1500ms)
    const ascendTimer = setTimeout(() => {
      setPhase('ascend');
      items.forEach((item, idx) => {
        soundEngine.playAscendWhoosh(idx, item.rarity);
      });
    }, 1500);

    // Phase 4: Land on pedestals (2400ms)
    const landTimer = setTimeout(() => {
      setPhase('land');
      // Staggered card landings
      items.forEach((item, idx) => {
        const delay = idx * 220;
        soundEngine.playCardLand(item.rarity, delay);
        setTimeout(() => {
          setRevealedCards((prev) => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        }, delay + 80);
      });
    }, 2400);

    // Phase 5: Final Reveal & Confetti (3600ms)
    const revealTimer = setTimeout(() => {
      setPhase('reveal');

      // Trigger confetti celebration if any Rare, Mythic, or Legendary dropped
      const hasHighRarity = items.some((item) => ['rare', 'mythic', 'legendary'].includes(item.rarity));
      if (hasHighRarity) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00B0FF', '#FF9100', '#FF1744', '#FFD700'],
        });
      }

      if (totalDuplicateEarnings > 0) {
        soundEngine.playDuplicateCoin(totalDuplicateEarnings);
      }
    }, 3600);

    return () => {
      clearTimeout(blastTimer);
      clearTimeout(ascendTimer);
      clearTimeout(landTimer);
      clearTimeout(revealTimer);
    };
  }, [items, totalDuplicateEarnings]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-black/85 backdrop-blur-xl select-none overflow-hidden animate-fade-in">
      {/* Dynamic Screen Shake on Blast */}
      <div
        className={`absolute inset-0 pointer-events-none transition-transform duration-75 ${
          phase === 'blast' ? 'scale-105 translate-y-2' : ''
        }`}
      />

      {/* ASCENSION PHASE: 4 Colored Light Beams Shooting Up */}
      {(phase === 'blast' || phase === 'ascend') && (
        <div className="absolute inset-0 flex justify-around items-end pointer-events-none pb-24">
          {items.map((item, idx) => {
            const rarityConfig = RARITIES[item.rarity];
            return (
              <div
                key={idx}
                className="relative flex flex-col items-center"
                style={{
                  animation: `shootUp 0.9s cubic-bezier(0.1, 0.9, 0.2, 1) ${idx * 0.08}s forwards`,
                }}
              >
                {/* Vertical Light Pillar */}
                <div
                  className="w-16 h-[80vh] rounded-t-full opacity-80 filter blur-md"
                  style={{
                    background: `linear-gradient(to top, ${rarityConfig.hexColor}, transparent)`,
                    boxShadow: `0 0 40px ${rarityConfig.hexColor}`,
                  }}
                />
                {/* Glowing Core Puck / Disc */}
                <div
                  className="w-20 h-20 rounded-full border-4 shadow-2xl flex items-center justify-center font-black text-2xl"
                  style={{
                    borderColor: '#FFFFFF',
                    backgroundColor: rarityConfig.hexColor,
                    boxShadow: `0 0 35px ${rarityConfig.hexColor}`,
                    color: '#000',
                  }}
                >
                  ★
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TOP BAR: Title & Phase Feedback */}
      <div className="w-full max-w-6xl flex items-center justify-between z-20 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-widest text-white uppercase font-display">
            Loot Unboxing
          </span>
          <span className="text-xs uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold border border-zinc-700">
            {phase.toUpperCase()}
          </span>
        </div>

        {totalDuplicateEarnings > 0 && phase === 'reveal' && (
          <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 px-4 py-1.5 rounded-full animate-bounce">
            <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-black text-yellow-300">
              +{totalDuplicateEarnings.toLocaleString()} Coins Auto-Cashed
            </span>
          </div>
        )}
      </div>

      {/* CENTER: The 4 Dropped Item Cards on Pedestals */}
      <div className="w-full max-w-6xl my-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center z-20">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-center">
            <LootItemCard item={item} revealed={revealedCards[idx]} />
          </div>
        ))}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="w-full max-w-md flex flex-col items-center gap-3 z-30 pb-4">
        {phase === 'reveal' ? (
          <button
            onClick={() => {
              soundEngine.playClick();
              onFinish();
            }}
            className="w-full py-4 px-8 rounded-xl font-black text-base uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-yellow-500/30 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Claim & Continue
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        ) : (
          <div className="text-zinc-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            Cracking Crate Locks...
          </div>
        )}
      </div>
    </div>
  );
};
