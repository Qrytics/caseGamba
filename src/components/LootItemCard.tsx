import React from 'react';
import { DroppedItem } from '../types/game';
import { RARITIES } from '../data/rarities';
import { Coins, Sparkles, RefreshCw } from 'lucide-react';

interface LootItemCardProps {
  item: DroppedItem;
  revealed: boolean;
  onInspect?: () => void;
}

export const LootItemCard: React.FC<LootItemCardProps> = ({ item, revealed, onInspect }) => {
  const rarityConfig = RARITIES[item.rarity];
  const isFigure = item.type === 'figure' && item.figure;
  const isCosmetic = item.type === 'cosmetic' && item.cosmetic;

  const title = isFigure ? item.figure!.name : isCosmetic ? item.cosmetic!.name : 'Unknown Item';
  const subtitle = isFigure
    ? item.figure!.variants[item.rarity].title
    : isCosmetic
    ? item.cosmetic!.category.toUpperCase()
    : '';

  const iconEmoji = isFigure
    ? (item.figure!.silhouette === 'beast' ? '🐺' : item.figure!.silhouette === 'robot' ? '🤖' : item.figure!.silhouette === 'winged' ? '🦅' : item.figure!.silhouette === 'hover' ? '🛸' : '👤')
    : isCosmetic
    ? item.cosmetic!.icon
    : '🎁';

  return (
    <div
      onClick={onInspect}
      className={`relative w-64 md:w-72 h-96 rounded-2xl flex flex-col justify-between p-5 transition-all duration-700 select-none overflow-hidden border-2 shadow-2xl ${
        revealed
          ? 'opacity-100 scale-100 translate-y-0 cursor-pointer hover:-translate-y-2'
          : 'opacity-0 scale-75 translate-y-20 pointer-events-none'
      }`}
      style={{
        borderColor: rarityConfig.hexColor,
        background: `radial-gradient(circle at 50% 20%, ${rarityConfig.hexColor}25 0%, #10141e 75%, #080a10 100%)`,
        boxShadow: `0 12px 32px -8px ${rarityConfig.glowColor}, inset 0 0 20px ${rarityConfig.hexColor}20`,
      }}
    >
      {/* Background Rarity Watermark */}
      <div
        className="absolute -right-8 -bottom-10 text-9xl font-black opacity-10 pointer-events-none uppercase tracking-tighter"
        style={{ color: rarityConfig.hexColor }}
      >
        {rarityConfig.name[0]}
      </div>

      {/* Top Header: Rarity Banner & Type Badge */}
      <div className="flex items-center justify-between z-10">
        <span
          className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow"
          style={{
            borderColor: rarityConfig.hexColor,
            color: rarityConfig.hexColor,
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        >
          {rarityConfig.name}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
          {item.type}
        </span>
      </div>

      {/* Center Figure / Cosmetic Artwork Slot */}
      <div className="relative flex flex-col items-center justify-center my-auto z-10">
        {/* Ambient Rarity Light Burst */}
        <div
          className="absolute w-36 h-36 rounded-full filter blur-2xl opacity-60 animate-pulse pointer-events-none"
          style={{ background: rarityConfig.hexColor }}
        />

        {/* Big Icon / Artwork */}
        <div
          className="relative text-7xl md:text-8xl p-6 rounded-2xl border transition-transform duration-300 hover:scale-110 flex items-center justify-center"
          style={{
            borderColor: `${rarityConfig.hexColor}50`,
            backgroundColor: 'rgba(10, 15, 25, 0.65)',
            boxShadow: `0 0 25px ${rarityConfig.hexColor}40`,
          }}
        >
          {iconEmoji}
          {item.rarity === 'legendary' && (
            <Sparkles className="absolute -top-2 -right-2 w-7 h-7 text-yellow-300 animate-spin" />
          )}
        </div>
      </div>

      {/* Bottom Information Details */}
      <div className="z-10 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-zinc-800/80">
        <div className="text-zinc-400 text-xs font-semibold truncate tracking-wider uppercase">
          {subtitle}
        </div>
        <div className="text-white text-lg font-black tracking-wide truncate mt-0.5">
          {title}
        </div>

        {/* Duplicate Payout Alert or New Item Tag */}
        {item.isDuplicate ? (
          <div className="mt-2 flex items-center justify-between bg-amber-500/15 border border-amber-500/40 rounded-lg px-2.5 py-1.5 animate-pulse">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> DUPLICATE
            </span>
            <span className="text-xs font-black text-yellow-300 flex items-center gap-1">
              +<Coins className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> {item.duplicatePayout.toLocaleString()}
            </span>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-center bg-emerald-500/15 border border-emerald-500/40 rounded-lg py-1">
            <span className="text-xs font-black text-emerald-400 tracking-wider">
              ★ UNLOCKED NEW ★
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
