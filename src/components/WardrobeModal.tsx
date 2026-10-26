import React, { useState } from 'react';
import { CosmeticCategory, PlayerCustomization, Rarity } from '../types/game';
import { COSMETIC_CATEGORIES, ALL_COSMETICS } from '../data/cosmetics';
import { FIGURE_MAP } from '../data/figures';
import { RARITIES } from '../data/rarities';
import { CharacterAvatar } from './CharacterAvatar';
import { soundEngine } from '../audio/soundEngine';
import { X, Check, Sparkles, User, Shirt } from 'lucide-react';
import { CategoryIcon, FigureSilhouetteIcon } from './icons/GameIcons';

interface WardrobeModalProps {
  customization: PlayerCustomization;
  unlockedFigures: Record<string, Rarity[]>;
  unlockedCosmetics: string[];
  onUpdateCustomization: (newCustomization: PlayerCustomization) => void;
  onClose: () => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  customization,
  unlockedFigures,
  unlockedCosmetics,
  onUpdateCustomization,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'figure' | 'cosmetics'>('figure');
  const [selectedCategory, setSelectedCategory] = useState<CosmeticCategory>('hat');

  // Local state for avatar editing
  const [currentCustom, setCurrentCustom] = useState<PlayerCustomization>({ ...customization });

  const handleSelectFigure = (figureId: string, rarity: Rarity) => {
    soundEngine.playClick();
    const updated = {
      ...currentCustom,
      figureId,
      figureRarity: rarity,
    };
    setCurrentCustom(updated);
    onUpdateCustomization(updated);
  };

  const handleToggleCosmetic = (cosmeticId: string, category: CosmeticCategory) => {
    soundEngine.playClick();
    const isCurrentlyEquipped = currentCustom.cosmetics[category] === cosmeticId;
    const updated = {
      ...currentCustom,
      cosmetics: {
        ...currentCustom.cosmetics,
        [category]: isCurrentlyEquipped ? null : cosmeticId,
      },
    };
    setCurrentCustom(updated);
    onUpdateCustomization(updated);
  };

  const ownedFigureIds = Object.keys(unlockedFigures).filter(
    (id) => (unlockedFigures[id] || []).length > 0
  );

  const categoryCosmetics = ALL_COSMETICS.filter(
    (c) => c.category === selectedCategory && unlockedCosmetics.includes(c.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-4xl h-[85vh] bg-zinc-950 border-2 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-900/90 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Shirt className="w-5 h-5 text-yellow-400" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-display">
                Avatar Dressing Room
              </h3>
              <p className="text-[11px] text-zinc-400">
                Swap your base figure & equip collected cosmetics
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

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Live Avatar Preview */}
          <div className="w-full md:w-72 bg-zinc-900/50 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800">
            <div className="relative p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-inner flex flex-col items-center">
              <CharacterAvatar customization={currentCustom} size="md" interactive={false} />
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                const resetCosmetics: Record<CosmeticCategory, string | null> = {
                  hat: null,
                  hair: null,
                  glasses: null,
                  shirt: null,
                  pants: null,
                  shoes: null,
                  gloves: null,
                  belt: null,
                  wearable: null,
                  item: null,
                  sfx: null,
                };
                const updated = { ...currentCustom, cosmetics: resetCosmetics };
                setCurrentCustom(updated);
                onUpdateCustomization(updated);
              }}
              className="mt-3 text-[11px] font-bold text-zinc-400 hover:text-red-400 transition-colors uppercase tracking-wider"
            >
              Clear All Cosmetics
            </button>
          </div>

          {/* Right Column: Customization Tabs & Grids */}
          <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
            {/* Main Tabs */}
            <div className="flex border-b border-zinc-800 px-4 pt-2.5 gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('figure');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all ${
                  activeTab === 'figure'
                    ? 'bg-zinc-800 text-yellow-400 border-t-2 border-yellow-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <User className="w-4 h-4" /> Base Figure ({ownedFigureIds.length})
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('cosmetics');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all ${
                  activeTab === 'cosmetics'
                    ? 'bg-zinc-800 text-yellow-400 border-t-2 border-yellow-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Shirt className="w-4 h-4" /> Cosmetics ({unlockedCosmetics.length})
              </button>
            </div>

            {/* TAB 1: BASE FIGURES */}
            {activeTab === 'figure' && (
              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ownedFigureIds.map((figId) => {
                  const fig = FIGURE_MAP[figId];
                  if (!fig) return null;
                  const ownedRarities = unlockedFigures[figId] || [];

                  return (
                    <div
                      key={figId}
                      className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FigureSilhouetteIcon
                          silhouette={fig.silhouette}
                          size={28}
                          color="#fbbf24"
                        />
                        <div className="overflow-hidden">
                          <span className="text-[10px] text-zinc-400 font-bold block">
                            Tier {fig.tier}
                          </span>
                          <h4 className="text-xs font-black text-white truncate">{fig.name}</h4>
                        </div>
                      </div>

                      {/* Rarity Variant Selector Buttons */}
                      <div className="flex items-center gap-1 mt-2">
                        {ownedRarities.map((rarity) => {
                          const rConfig = RARITIES[rarity];
                          const isEquipped =
                            currentCustom.figureId === figId && currentCustom.figureRarity === rarity;

                          return (
                            <button
                              key={rarity}
                              onClick={() => handleSelectFigure(figId, rarity)}
                              className={`flex-1 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border flex items-center justify-center gap-0.5 transition-all ${
                                isEquipped
                                  ? 'border-white bg-white text-black font-extrabold shadow-md'
                                  : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
                              }`}
                              style={{
                                color: isEquipped ? '#000' : rConfig.hexColor,
                              }}
                              title={rConfig.name}
                            >
                              {isEquipped && <Check className="w-2 h-2" />}
                              {rConfig.name[0]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: COSMETICS */}
            {activeTab === 'cosmetics' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Category Selector Bar */}
                <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-2.5 border-b border-zinc-800 bg-zinc-900/40">
                  {COSMETIC_CATEGORIES.map((cat) => {
                    const isCatSelected = selectedCategory === cat.id;
                    const countInCat = ALL_COSMETICS.filter(
                      (c) => c.category === cat.id && unlockedCosmetics.includes(c.id)
                    ).length;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedCategory(cat.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          isCatSelected
                            ? 'bg-yellow-400 text-black shadow-md'
                            : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
                        }`}
                      >
                        <CategoryIcon
                          category={cat.id}
                          size={14}
                          color={isCatSelected ? '#000' : 'currentColor'}
                        />
                        <span>{cat.label}</span>
                        <span className="text-[10px] opacity-75 font-black">({countInCat})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Cosmetic Items Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  {categoryCosmetics.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                      <Sparkles className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-xs sm:text-sm font-bold text-zinc-400">
                        No cosmetics unlocked in this slot yet
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
                        Open more lootboxes to unbox rare cosmetics for your avatar.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categoryCosmetics.map((cosmetic) => {
                        const rConfig = RARITIES[cosmetic.rarity];
                        const isEquipped = currentCustom.cosmetics[selectedCategory] === cosmetic.id;

                        return (
                          <div
                            key={cosmetic.id}
                            onClick={() => handleToggleCosmetic(cosmetic.id, selectedCategory)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                              isEquipped
                                ? 'bg-yellow-400/10 border-yellow-400 shadow-lg shadow-yellow-500/20 scale-102'
                                : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border"
                                style={{
                                  borderColor: rConfig.hexColor,
                                  color: rConfig.hexColor,
                                  backgroundColor: 'rgba(0,0,0,0.5)',
                                }}
                              >
                                {rConfig.name}
                              </span>
                              {isEquipped && (
                                <span className="p-0.5 rounded-full bg-yellow-400 text-black">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              )}
                            </div>

                            <div className="my-2.5 flex items-center justify-center">
                              <CategoryIcon category={cosmetic.category} size={32} color={rConfig.hexColor} />
                            </div>

                            <div>
                              <div className="text-xs font-black text-white truncate">
                                {cosmetic.name}
                              </div>
                              <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                                {cosmetic.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="py-2 px-5 rounded-xl font-black text-xs uppercase tracking-wider bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-500/20 transition-all hover:scale-105 active:scale-95"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
