import React from 'react';
import { Coins, Volume2, VolumeX, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface HeaderHUDProps {
  coins: number;
  soundMuted: boolean;
  onToggleSound: () => void;
  onOpenDoodleJump: () => void;
  onOpenWardrobe: () => void;
  onOpenCodex: () => void;
  onResetSave: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  coins,
  soundMuted,
  onToggleSound,
  onOpenDoodleJump,
  onOpenWardrobe,
  onOpenCodex,
  onResetSave,
}) => {
  return (
    <header className="w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between z-30 select-none">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-xl shadow-lg shadow-yellow-500/20 border border-yellow-200">
          🎁
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-display leading-none">
            case<span className="text-yellow-400">Gamba</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold tracking-wider uppercase">
            Overwatch-Style Lootboxes
          </p>
        </div>
      </div>

      {/* Center / Right: Coins Balance & Quick Modals */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Coin Balance Pill */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-amber-500/40 rounded-full px-3.5 py-1.5 shadow-inner">
          <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="text-sm sm:text-base font-black text-yellow-300 tracking-wide">
            {coins.toLocaleString()}
          </span>
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenDoodleJump();
            }}
            className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full ml-1 transition-colors flex items-center gap-1"
            title="Play Doodle Jump to Earn Free Coins"
          >
            <span>+</span> Earn
          </button>
        </div>

        {/* Doodle Jump Minigame Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenDoodleJump();
          }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
          title="Play Doodle Jump Minigame"
        >
          <span>🦘</span>
          <span>Doodle Jump</span>
        </button>

        {/* Codex Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenCodex();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
          title="View Figures Codex"
        >
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span className="hidden sm:inline">Codex</span>
        </button>

        {/* Wardrobe Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenWardrobe();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
          title="Customize Avatar & Wardrobe"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span className="hidden sm:inline">Avatar</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            onToggleSound();
          }}
          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
          title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Reset Save Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all saved progress and start fresh with 150 starter coins?')) {
              onResetSave();
            }
          }}
          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-red-400 transition-colors"
          title="Reset Save Data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
