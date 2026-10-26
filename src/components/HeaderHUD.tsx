import React, { useState, useEffect } from 'react';
import { Coins, Volume2, VolumeX, Sparkles, Trophy, RotateCcw, Music, SkipForward, Play, Pause, Gamepad2 } from 'lucide-react';
import { soundEngine, BGMTrackInfo } from '../audio/soundEngine';

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
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<BGMTrackInfo>(soundEngine.getCurrentTrack());

  useEffect(() => {
    soundEngine.onTrackChange((track) => {
      setCurrentTrack(track);
    });
  }, []);

  const handleToggleMusic = () => {
    const active = soundEngine.toggleMusic();
    setIsMusicPlaying(active);
    setCurrentTrack(soundEngine.getCurrentTrack());
  };

  const handleNextTrack = () => {
    soundEngine.nextTrack();
    setCurrentTrack(soundEngine.getCurrentTrack());
  };

  return (
    <header className="w-full bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between z-30 select-none gap-2">
      {/* Brand / Logo (Vector Insignia, Zero Emojis) */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-500/20 border border-yellow-200">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M12 7v14" />
            <path d="M2 12h20" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black tracking-wider text-white uppercase font-display leading-none">
            case<span className="text-yellow-400">Gamba</span>
          </h1>
          <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold tracking-wider uppercase">
            Overwatch-Style Lootboxes
          </p>
        </div>
      </div>

      {/* Center: Calming Piano & Elevator BGM Player */}
      <div className="hidden lg:flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full text-xs">
        <button
          onClick={handleToggleMusic}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
            isMusicPlaying ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-300 hover:text-white'
          }`}
          title={isMusicPlaying ? 'Pause Ambient Music' : 'Play Calming Music'}
        >
          {isMusicPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>Music</span>
        </button>

        <div className="flex items-center gap-1 text-[11px] text-zinc-300 font-semibold max-w-[180px] truncate">
          <Music className="w-3 h-3 text-yellow-400 flex-shrink-0" />
          <span className="truncate">{currentTrack.title}</span>
        </div>

        {isMusicPlaying && (
          <button
            onClick={handleNextTrack}
            className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
            title="Next Track"
          >
            <SkipForward className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Right Controls: Coin Balance & Navigation Modals */}
      <div className="flex items-center gap-2">
        {/* Coin Balance Pill */}
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-amber-500/40 rounded-full px-3 py-1 shadow-inner">
          <Coins className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-black text-yellow-300 tracking-wide">
            {coins.toLocaleString()}
          </span>
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenDoodleJump();
            }}
            className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full ml-1 transition-colors flex items-center gap-0.5"
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
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
          title="Play Doodle Jump Minigame"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Arcade</span>
        </button>

        {/* Codex Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenCodex();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
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
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
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
          className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
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
          className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-red-400 transition-colors"
          title="Reset Save Data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
