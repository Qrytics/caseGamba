import React, { useState, useEffect, useCallback } from 'react';
import { GameState, DroppedItem, PlayerCustomization } from './types/game';
import { loadGameState, saveGameState, resetGameState } from './utils/storage';
import { rollLootBox } from './utils/lootRoller';
import { CRATE_TIERS } from './data/tiers';
import { soundEngine } from './audio/soundEngine';

import { HeaderHUD } from './components/HeaderHUD';
import { LootboxStage } from './components/LootboxStage';
import { TierSelector } from './components/TierSelector';
import { CharacterAvatar } from './components/CharacterAvatar';
import { OpeningOverlay } from './components/OpeningOverlay';
import { WardrobeModal } from './components/WardrobeModal';
import { CollectionModal } from './components/CollectionModal';
import { DoodleJumpModal } from './components/DoodleJumpModal';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());
  const [isOpeningCrate, setIsOpeningCrate] = useState<boolean>(false);
  const [activeDropItems, setActiveDropItems] = useState<DroppedItem[] | null>(null);

  // Modals visibility
  const [showWardrobe, setShowWardrobe] = useState<boolean>(false);
  const [showCodex, setShowCodex] = useState<boolean>(false);
  const [showDoodleJump, setShowDoodleJump] = useState<boolean>(false);

  // Auto-save game state on modifications
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Sync mute state with sound engine
  useEffect(() => {
    soundEngine.setMuted(gameState.soundMuted);
  }, [gameState.soundMuted]);

  const currentTierConfig =
    CRATE_TIERS.find((t) => t.tier === gameState.currentTier) || CRATE_TIERS[0];

  // --- ACTIONS ---

  const handleToggleSound = useCallback(() => {
    setGameState((prev) => {
      const nextMuted = !prev.soundMuted;
      soundEngine.setMuted(nextMuted);
      return { ...prev, soundMuted: nextMuted };
    });
  }, []);

  const handleSelectTier = useCallback((tierNumber: number) => {
    setGameState((prev) => ({
      ...prev,
      currentTier: tierNumber,
    }));
  }, []);

  const handleOpenCrate = useCallback(() => {
    if (gameState.coins < currentTierConfig.cost || isOpeningCrate) return;

    // Deduct tier cost
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - currentTierConfig.cost,
    }));

    setIsOpeningCrate(true);

    // Roll 4 items based on current tier and current inventory
    const droppedItems = rollLootBox(gameState.currentTier, gameState);
    setActiveDropItems(droppedItems);
  }, [gameState, currentTierConfig, isOpeningCrate]);

  const handleFinishUnboxing = useCallback(() => {
    if (!activeDropItems) return;

    setGameState((prev) => {
      let updatedCoins = prev.coins;
      const updatedFigures = { ...prev.unlockedFigures };
      const updatedCosmetics = [...prev.unlockedCosmetics];
      let duplicatesCashed = prev.stats.duplicatesCashed;
      const newRarityCounts = { ...prev.stats.rarityCounts };

      activeDropItems.forEach((item) => {
        // Increment rarity stats
        newRarityCounts[item.rarity] = (newRarityCounts[item.rarity] || 0) + 1;

        if (item.isDuplicate) {
          updatedCoins += item.duplicatePayout;
          duplicatesCashed += 1;
        } else {
          if (item.type === 'figure' && item.figure) {
            const currentOwned = updatedFigures[item.figure.id] || [];
            if (!currentOwned.includes(item.rarity)) {
              updatedFigures[item.figure.id] = [...currentOwned, item.rarity];
            }
          } else if (item.type === 'cosmetic' && item.cosmetic) {
            if (!updatedCosmetics.includes(item.cosmetic.id)) {
              updatedCosmetics.push(item.cosmetic.id);
            }
          }
        }
      });

      return {
        ...prev,
        coins: updatedCoins,
        unlockedFigures: updatedFigures,
        unlockedCosmetics: updatedCosmetics,
        stats: {
          ...prev.stats,
          cratesOpened: prev.stats.cratesOpened + 1,
          duplicatesCashed,
          totalCoinsEarned: prev.stats.totalCoinsEarned + (updatedCoins - prev.coins),
          rarityCounts: newRarityCounts,
        },
      };
    });

    setIsOpeningCrate(false);
    setActiveDropItems(null);
  }, [activeDropItems]);

  const handleUpdateAvatar = useCallback((newAvatar: PlayerCustomization) => {
    setGameState((prev) => ({
      ...prev,
      avatar: newAvatar,
    }));
  }, []);

  const handleAwardDoodleJumpCoins = useCallback((coinsEarned: number, score: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + coinsEarned,
      stats: {
        ...prev.stats,
        totalCoinsEarned: prev.stats.totalCoinsEarned + coinsEarned,
        doodleJumpTotalCoins: prev.stats.doodleJumpTotalCoins + coinsEarned,
        doodleJumpBestScore: Math.max(prev.stats.doodleJumpBestScore, score),
      },
    }));
  }, []);

  const handleResetSave = useCallback(() => {
    const fresh = resetGameState();
    setGameState(fresh);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden transition-all duration-1000"
      style={{
        background: currentTierConfig.bgGradient,
      }}
    >
      {/* Dynamic Background Room & Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radial ambient glow corresponding to tier */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full filter blur-[120px] opacity-25 transition-all duration-1000"
          style={{ backgroundColor: currentTierConfig.glowColor }}
        />

        {/* Dynamic Tier Backdrop Overlay Patterns */}
        {currentTierConfig.tier >= 4 && (
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ffff_1px,transparent_1px)] [background-size:24px_24px]" />
        )}
        {currentTierConfig.tier >= 7 && (
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ff0055_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
        )}
      </div>

      {/* Header HUD */}
      <HeaderHUD
        coins={gameState.coins}
        soundMuted={gameState.soundMuted}
        onToggleSound={handleToggleSound}
        onOpenDoodleJump={() => setShowDoodleJump(true)}
        onOpenWardrobe={() => setShowWardrobe(true)}
        onOpenCodex={() => setShowCodex(true)}
        onResetSave={handleResetSave}
      />

      {/* Main Gameplay Screen Area */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 py-4 z-10 gap-6">
        {/* Left Side: Player's Little Customizable Character Guy */}
        <aside className="w-full lg:w-72 flex flex-col items-center bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-5 shadow-2xl">
          <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-zinc-800 text-xs font-bold text-zinc-400">
            <span className="uppercase tracking-wider">Your Character</span>
            <span className="text-[10px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-2 py-0.5 rounded-full">
              Customizable
            </span>
          </div>

          <CharacterAvatar
            customization={gameState.avatar}
            size="md"
            interactive={true}
            onClick={() => {
              soundEngine.playClick();
              setShowWardrobe(true);
            }}
          />

          <button
            onClick={() => {
              soundEngine.playClick();
              setShowWardrobe(true);
            }}
            className="w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 transition-all hover:scale-102 flex items-center justify-center gap-2"
          >
            <span>👔</span> Open Fitting Room
          </button>
        </aside>

        {/* Center: The Big Overwatch Lootbox Stage */}
        <section className="flex-1 w-full flex flex-col items-center justify-center my-auto">
          <LootboxStage
            tier={currentTierConfig}
            coins={gameState.coins}
            isOpening={isOpeningCrate}
            onOpen={handleOpenCrate}
            onOpenDoodleJump={() => setShowDoodleJump(true)}
          />
        </section>

        {/* Right Side: Quick Stats / Anti-Softlock Banner */}
        <aside className="hidden xl:flex w-72 flex-col gap-3 bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-5 shadow-2xl text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 font-bold text-zinc-400 uppercase tracking-wider">
            <span>Career Overview</span>
            <span className="text-yellow-400">★</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-zinc-400">Crates Opened:</span>
            <span className="text-white font-black">{gameState.stats.cratesOpened}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-zinc-400">Duplicates Sold:</span>
            <span className="text-amber-400 font-black">{gameState.stats.duplicatesCashed}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-zinc-400">Doodle Jump Record:</span>
            <span className="text-emerald-400 font-black">{gameState.stats.doodleJumpBestScore} pts</span>
          </div>

          <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Rarity Unboxed:
            </div>
            <div className="grid grid-cols-5 gap-1 text-center font-black text-[10px]">
              <div className="p-1 rounded bg-zinc-800 text-zinc-400" title="Common">
                C: {gameState.stats.rarityCounts.common || 0}
              </div>
              <div className="p-1 rounded bg-blue-950 text-blue-400" title="Uncommon">
                U: {gameState.stats.rarityCounts.uncommon || 0}
              </div>
              <div className="p-1 rounded bg-amber-950 text-amber-400" title="Rare">
                R: {gameState.stats.rarityCounts.rare || 0}
              </div>
              <div className="p-1 rounded bg-red-950 text-red-400" title="Mythic">
                M: {gameState.stats.rarityCounts.mythic || 0}
              </div>
              <div className="p-1 rounded bg-yellow-950 text-yellow-300" title="Legendary">
                L: {gameState.stats.rarityCounts.legendary || 0}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              setShowDoodleJump(true);
            }}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 font-black text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
          >
            <span>🦘</span> Play Doodle Jump
          </button>
        </aside>
      </main>

      {/* Bottom Dock: 10 Crate Tiers Selector */}
      <footer className="w-full z-20 pb-4 pt-1 flex justify-center">
        <TierSelector
          currentTier={gameState.currentTier}
          userCoins={gameState.coins}
          unlockedFigures={gameState.unlockedFigures}
          onSelectTier={handleSelectTier}
        />
      </footer>

      {/* OVERLAY: Full Overwatch Unboxing Sequence */}
      {isOpeningCrate && activeDropItems && (
        <OpeningOverlay
          items={activeDropItems}
          tierCost={currentTierConfig.cost}
          onFinish={handleFinishUnboxing}
        />
      )}

      {/* MODAL: Wardrobe & Fitting Room */}
      {showWardrobe && (
        <WardrobeModal
          customization={gameState.avatar}
          unlockedFigures={gameState.unlockedFigures}
          unlockedCosmetics={gameState.unlockedCosmetics}
          onUpdateCustomization={handleUpdateAvatar}
          onClose={() => setShowWardrobe(false)}
        />
      )}

      {/* MODAL: Codex Collection */}
      {showCodex && (
        <CollectionModal
          unlockedFigures={gameState.unlockedFigures}
          onClose={() => setShowCodex(false)}
        />
      )}

      {/* MODAL: Scrappy Doodle Jump Minigame */}
      {showDoodleJump && (
        <DoodleJumpModal
          onClose={() => setShowDoodleJump(false)}
          onAwardCoins={handleAwardDoodleJumpCoins}
          highScore={gameState.stats.doodleJumpBestScore}
        />
      )}
    </div>
  );
};

export default App;
