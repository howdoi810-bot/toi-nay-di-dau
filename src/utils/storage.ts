import {
  BudgetTier,
  CityPreset,
  GroupType,
  HangoutCard,
  ThemeId,
  UnboxMode,
  VibeWish,
} from '../types/hangout';

const STORAGE_KEY = 'toinaydidau_state_v1';

export interface PersistedUserState {
  theme: ThemeId;
  city: CityPreset;
  group: GroupType;
  budget: BudgetTier;
  wish: VibeWish;
  mode: UnboxMode;
  soundEnabled: boolean;
  totalBagsRipped: number;
  wishHitCount: number;
  unlockedCardIds: string[];
  customCards: HangoutCard[];
}

const DEFAULT_STATE: PersistedUserState = {
  theme: 'blindbox',
  city: 'saigon',
  group: 'all',
  budget: 150,
  wish: 'chill',
  mode: 'single',
  soundEnabled: true,
  totalBagsRipped: 0,
  wishHitCount: 0,
  unlockedCardIds: [],
  customCards: [],
};

export function loadUserState(): PersistedUserState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...parsed };
    }
    // Fallback to cookie if localStorage was cleared
    const match = document.cookie.match(new RegExp('(^| )' + STORAGE_KEY + '=([^;]+)'));
    if (match) {
      const parsed = JSON.parse(decodeURIComponent(match[2]));
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_STATE;
}

export function saveUserState(state: PersistedUserState): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, serialized);

    // Save compact preferences + unlocked IDs to cookie (365 days) like truanayangi
    const compactCookie = JSON.stringify({
      theme: state.theme,
      city: state.city,
      group: state.group,
      budget: state.budget,
      wish: state.wish,
      mode: state.mode,
      soundEnabled: state.soundEnabled,
      totalBagsRipped: state.totalBagsRipped,
      wishHitCount: state.wishHitCount,
      unlockedCardIds: state.unlockedCardIds.slice(0, 60),
    });
    const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(compactCookie)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {
    // Ignore storage quota errors
  }
}
