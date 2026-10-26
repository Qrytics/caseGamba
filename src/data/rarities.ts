import { Rarity, RarityConfig } from '../types/game';

export const RARITIES: Record<Rarity, RarityConfig> = {
  common: {
    id: 'common',
    name: 'Common',
    colorName: 'Grey',
    hexColor: '#9E9E9E',
    glowColor: 'rgba(158, 158, 158, 0.6)',
    accentColor: '#cfd8dc',
    dropRate: 0.58, // 58%
    duplicateMultiplier: 0.25, // 25% of crate cost
    stingerFrequency: 220, // Low thump
  },
  uncommon: {
    id: 'uncommon',
    name: 'Uncommon',
    colorName: 'Blue',
    hexColor: '#00B0FF',
    glowColor: 'rgba(0, 176, 255, 0.75)',
    accentColor: '#80d8ff',
    dropRate: 0.27, // 27%
    duplicateMultiplier: 0.50, // 50% of crate cost
    stingerFrequency: 330, // Pleasant ping
  },
  rare: {
    id: 'rare',
    name: 'Rare',
    colorName: 'Orange',
    hexColor: '#FF9100',
    glowColor: 'rgba(255, 145, 0, 0.85)',
    accentColor: '#ffd180',
    dropRate: 0.11, // 11%
    duplicateMultiplier: 1.25, // 125% of crate cost (profit!)
    stingerFrequency: 440, // Warm chord
  },
  mythic: {
    id: 'mythic',
    name: 'Mythic',
    colorName: 'Red',
    hexColor: '#FF1744',
    glowColor: 'rgba(255, 23, 68, 0.9)',
    accentColor: '#ff8a80',
    dropRate: 0.033, // 3.3%
    duplicateMultiplier: 3.5, // 350% of crate cost
    stingerFrequency: 660, // Heavy brass blast
  },
  legendary: {
    id: 'legendary',
    name: 'Legendary',
    colorName: 'Yellow',
    hexColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.95)',
    accentColor: '#fff59d',
    dropRate: 0.007, // 0.7%
    duplicateMultiplier: 10.0, // 1000% of crate cost (massive windfall!)
    stingerFrequency: 880, // Grand fanfare & choir
  },
};

export const RARITY_LIST: Rarity[] = ['common', 'uncommon', 'rare', 'mythic', 'legendary'];
