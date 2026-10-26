export type Rarity = 'common' | 'uncommon' | 'rare' | 'mythic' | 'legendary';

export interface RarityConfig {
  id: Rarity;
  name: string;
  colorName: string;
  hexColor: string;
  glowColor: string;
  accentColor: string;
  dropRate: number; // probability between 0 and 1
  duplicateMultiplier: number; // of tier base cost
  stingerFrequency: number;
}

export type CosmeticCategory = 
  | 'hat'
  | 'hair'
  | 'glasses'
  | 'shirt'
  | 'pants'
  | 'shoes'
  | 'gloves'
  | 'belt'
  | 'wearable'
  | 'item'
  | 'sfx';

export interface CosmeticItem {
  id: string;
  name: string;
  category: CosmeticCategory;
  rarity: Rarity;
  tier: number;
  description: string;
  icon: string; // SVG path or SVG identifier
  styleProps: {
    color?: string;
    secondaryColor?: string;
    auraEffect?: string;
    particleCount?: number;
  };
}

export interface FigureVariant {
  rarity: Rarity;
  title: string;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  effect: 'none' | 'sparkle' | 'flames' | 'lightning' | 'cosmic-halo';
}

export interface Figure {
  id: string;
  name: string;
  tier: number; // 1 to 10
  archetype: string;
  silhouette: string; // Base shape definition
  description: string;
  variants: Record<Rarity, FigureVariant>;
}

export interface LootCrateTier {
  tier: number; // 1 to 10
  name: string;
  subtitle: string;
  cost: number;
  boxColor: string;
  accentColor: string;
  glowColor: string;
  bgGradient: string;
  bgRoomStyle: string;
  meshStyle: 'cardboard' | 'rusty' | 'alloy' | 'cyber' | 'gilded' | 'cryo' | 'obsidian' | 'plasma' | 'astral' | 'singularity';
  description: string;
  figureIds: string[];
}

export type DropType = 'figure' | 'cosmetic';

export interface DroppedItem {
  slotIndex: number; // 0, 1, 2, 3
  type: DropType;
  figure?: Figure;
  cosmetic?: CosmeticItem;
  rarity: Rarity;
  isDuplicate: boolean;
  duplicatePayout: number;
}

export interface PlayerCustomization {
  figureId: string;
  figureRarity: Rarity;
  cosmetics: Record<CosmeticCategory, string | null>;
}

export interface GameState {
  coins: number;
  currentTier: number;
  unlockedFigures: Record<string, Rarity[]>; // figureId -> array of owned rarities
  unlockedCosmetics: string[]; // cosmetic IDs owned
  avatar: PlayerCustomization;
  stats: {
    cratesOpened: number;
    duplicatesCashed: number;
    totalCoinsEarned: number;
    doodleJumpBestScore: number;
    doodleJumpTotalCoins: number;
    rarityCounts: Record<Rarity, number>;
  };
  soundMuted: boolean;
  soundVolume: number;
}
