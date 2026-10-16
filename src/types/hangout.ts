export type RarityTier = 'basic' | 'rare' | 'sr' | 'secret' | 'mega';

export type GroupType = 'all' | 'couple' | 'friends' | 'solo' | 'latenight';

export type BudgetTier = 50 | 150 | 350 | 999;

export type VibeWish = 'chill' | 'chaos' | 'romance' | 'mystic';

export type CityPreset = 'saigon' | 'hanoi' | 'danang' | 'any';

export type ThemeId = 'blindbox' | 'saigon_retro' | 'tarot_night' | 'city_pop';

export type UnboxMode = 'single' | 'combo';

export type StageKind = 'tang1' | 'tang2' | 'both';

export interface HangoutCard {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  stage: StageKind; // 'tang1' (Ăn/Ấm bụng), 'tang2' (Đi chơi/Chill), or 'both'
  rarity: RarityTier;
  priceEstimate: string;
  budgetMax: BudgetTier;
  groups: GroupType[];
  vibe: VibeWish;
  emoji: string;
  oracleQuote: string; // Lời phán từ túi mù
  proTip: string;
  mapQuery: string;
  citySpots: {
    saigon: string[];
    hanoi: string[];
    danang: string[];
    any: string[];
  };
  isCustom?: boolean;
}

export interface TwistCard {
  id: string;
  title: string;
  description: string;
  penalty: string;
  emoji: string;
  rarity: RarityTier;
}

export interface UnboxResult {
  id: string;
  mode: UnboxMode;
  timestamp: string;
  wishSelected: VibeWish;
  wishMatched: boolean;
  primaryCard: HangoutCard;
  tang1Card?: HangoutCard;
  tang2Card?: HangoutCard;
  twistCard: TwistCard;
  bonusSecretCard?: HangoutCard;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  shortName: string;
  badge: string;
  tagline: string;
  ctaSingle: string;
  ctaCombo: string;
  bagSeriesTitle: string;
  bagEditionTag: string;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    cardSurface: string;
    textPrimary: string;
    textSecondary: string;
    accentPrimary: string;
    accentSecondary: string;
    bagGradient: string;
    bagBorder: string;
  };
}
