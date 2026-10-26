import { DroppedItem, GameState, Rarity } from '../types/game';
import { RARITIES, RARITY_LIST } from '../data/rarities';
import { FIGURES_BY_TIER } from '../data/figures';
import { ALL_COSMETICS } from '../data/cosmetics';
import { CRATE_TIERS } from '../data/tiers';

/**
 * Rolls 1 of the 5 rarities based on probabilities:
 * common: 58%, uncommon: 27%, rare: 11%, mythic: 3.3%, legendary: 0.7%
 */
export function rollRarity(): Rarity {
  const rand = Math.random();
  let cumulative = 0;
  for (const rarity of RARITY_LIST) {
    cumulative += RARITIES[rarity].dropRate;
    if (rand <= cumulative) {
      return rarity;
    }
  }
  return 'common';
}

/**
 * Generates the 4 items that drop from an unboxed loot crate
 */
export function rollLootBox(currentTier: number, state: GameState): DroppedItem[] {
  const tierConfig = CRATE_TIERS.find((t) => t.tier === currentTier) || CRATE_TIERS[0];
  const tierFigures = FIGURES_BY_TIER[currentTier] || FIGURES_BY_TIER[1];
  const items: DroppedItem[] = [];

  for (let slotIndex = 0; slotIndex < 4; slotIndex++) {
    const rarity = rollRarity();
    const rarityConfig = RARITIES[rarity];

    // 70% chance of Figure, 30% chance of Cosmetic
    const isFigure = Math.random() < 0.7;

    if (isFigure) {
      // Pick random figure from current tier's 20 figures
      const randomFigure = tierFigures[Math.floor(Math.random() * tierFigures.length)];
      
      // Check duplicate status
      const ownedRarities = state.unlockedFigures[randomFigure.id] || [];
      const isDuplicate = ownedRarities.includes(rarity);
      const duplicatePayout = isDuplicate 
        ? Math.max(10, Math.round(tierConfig.cost * rarityConfig.duplicateMultiplier))
        : 0;

      items.push({
        slotIndex,
        type: 'figure',
        figure: randomFigure,
        rarity,
        isDuplicate,
        duplicatePayout,
      });
    } else {
      // Pick cosmetic matching rarity (or any cosmetic if no exact rarity match)
      const matchingCosmetics = ALL_COSMETICS.filter((c) => c.rarity === rarity);
      const pool = matchingCosmetics.length > 0 ? matchingCosmetics : ALL_COSMETICS;
      const randomCosmetic = pool[Math.floor(Math.random() * pool.length)];

      const isDuplicate = state.unlockedCosmetics.includes(randomCosmetic.id);
      const duplicatePayout = isDuplicate
        ? Math.max(10, Math.round(tierConfig.cost * rarityConfig.duplicateMultiplier))
        : 0;

      items.push({
        slotIndex,
        type: 'cosmetic',
        cosmetic: randomCosmetic,
        rarity,
        isDuplicate,
        duplicatePayout,
      });
    }
  }

  return items;
}
