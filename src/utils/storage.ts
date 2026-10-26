import { GameState } from '../types/game';

const STORAGE_KEY = 'caseGamba_save_v1';

export const INITIAL_GAME_STATE: GameState = {
  coins: 150, // Starting coins to immediately open 3 Tier 1 crates
  currentTier: 1,
  unlockedFigures: {
    't1_fig_01': ['common'], // Starting starter figure: Cardboard Bob
  },
  unlockedCosmetics: [
    'hat_c_01', // Starting starter cosmetic: Cardboard Crown
  ],
  avatar: {
    figureId: 't1_fig_01',
    figureRarity: 'common',
    cosmetics: {
      hat: 'hat_c_01',
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
    },
  },
  stats: {
    cratesOpened: 0,
    duplicatesCashed: 0,
    totalCoinsEarned: 150,
    doodleJumpBestScore: 0,
    doodleJumpTotalCoins: 0,
    rarityCounts: {
      common: 0,
      uncommon: 0,
      rare: 0,
      mythic: 0,
      legendary: 0,
    },
  },
  soundMuted: false,
  soundVolume: 0.75,
};

export function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_GAME_STATE };
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_GAME_STATE,
      ...parsed,
      avatar: {
        ...INITIAL_GAME_STATE.avatar,
        ...(parsed.avatar || {}),
        cosmetics: {
          ...INITIAL_GAME_STATE.avatar.cosmetics,
          ...(parsed.avatar?.cosmetics || {}),
        },
      },
      stats: {
        ...INITIAL_GAME_STATE.stats,
        ...(parsed.stats || {}),
        rarityCounts: {
          ...INITIAL_GAME_STATE.stats.rarityCounts,
          ...(parsed.stats?.rarityCounts || {}),
        },
      },
    };
  } catch (err) {
    console.warn('Failed to load caseGamba save from localStorage:', err);
    return { ...INITIAL_GAME_STATE };
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save caseGamba state to localStorage:', err);
  }
}

export function resetGameState(): GameState {
  localStorage.removeItem(STORAGE_KEY);
  return { ...INITIAL_GAME_STATE };
}

export function exportSaveJSON(state: GameState): string {
  return JSON.stringify(state, null, 2);
}

export function importSaveJSON(jsonStr: string): GameState | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed.coins === 'number' && parsed.unlockedFigures) {
      saveGameState(parsed);
      return parsed;
    }
  } catch (err) {
    console.error('Invalid JSON import:', err);
  }
  return null;
}
