import { RARITY_CONFIG } from '../data/themes';
import { TWIST_CARDS } from '../data/hangouts';
import {
  BudgetTier,
  GroupType,
  HangoutCard,
  RarityTier,
  TwistCard,
  UnboxMode,
  UnboxResult,
  VibeWish,
} from '../types/hangout';

function pickWeightedCard(
  pool: HangoutCard[],
  wish: VibeWish,
  budget: BudgetTier,
  excludeIds: Set<string> = new Set()
): HangoutCard {
  const available = pool.filter((c) => !excludeIds.has(c.id));
  const candidates = available.length > 0 ? available : pool;

  const weights = candidates.map((card) => {
    let w = RARITY_CONFIG[card.rarity].weight;

    // Budget matching weight multiplier
    if (card.budgetMax <= budget) {
      w *= 2.4;
    } else if (card.rarity === 'secret' || card.rarity === 'mega') {
      // Secret & Mega Secret can still appear as a surprise jackpot!
      w *= 0.85;
    } else {
      w *= 0.25;
    }

    // Wish Vibe ("Nguyện vọng") resonance boost (~38% hit rate)
    if (card.vibe === wish) {
      w *= 1.65;
    }

    // Custom cards created by the user get a friendly boost
    if (card.isCustom) {
      w *= 1.8;
    }

    return Math.max(w, 0.5);
  });

  const totalWeight = weights.reduce((acc, val) => acc + val, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < candidates.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return candidates[i];
    }
  }

  return candidates[candidates.length - 1];
}

export function pickRandomTwist(): TwistCard {
  const idx = Math.floor(Math.random() * TWIST_CARDS.length);
  return TWIST_CARDS[idx];
}

export function filterPoolByGroup(allCards: HangoutCard[], group: GroupType): HangoutCard[] {
  if (group === 'all') return allCards;
  const filtered = allCards.filter((c) => c.groups.includes(group) || c.groups.includes('all'));
  return filtered.length >= 4 ? filtered : allCards;
}

const RARITY_ORDER: Record<RarityTier, number> = {
  basic: 1,
  rare: 2,
  sr: 3,
  secret: 4,
  mega: 5,
};

export function rollBlindBag(params: {
  allCards: HangoutCard[];
  mode: UnboxMode;
  group: GroupType;
  budget: BudgetTier;
  wish: VibeWish;
  lastCardId?: string;
}): UnboxResult {
  const { allCards, mode, group, budget, wish, lastCardId } = params;
  const groupPool = filterPoolByGroup(allCards, group);
  const exclude = new Set<string>(lastCardId ? [lastCardId] : []);

  const now = new Date();
  const timestamp = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }) + ' · ' + now.toLocaleDateString('vi-VN');

  const twistCard = pickRandomTwist();

  if (mode === 'combo') {
    const tang1Pool = groupPool.filter((c) => c.stage === 'tang1' || c.stage === 'both');
    const tang2Pool = groupPool.filter((c) => c.stage === 'tang2' || c.stage === 'both');

    const tang1Card = pickWeightedCard(
      tang1Pool.length > 0 ? tang1Pool : groupPool,
      wish,
      budget,
      exclude
    );
    exclude.add(tang1Card.id);

    const tang2Card = pickWeightedCard(
      tang2Pool.length > 0 ? tang2Pool : groupPool,
      wish,
      budget,
      exclude
    );
    exclude.add(tang2Card.id);

    // Primary card is the higher-rarity one between Tăng 1 and Tăng 2
    const primaryCard =
      RARITY_ORDER[tang1Card.rarity] > RARITY_ORDER[tang2Card.rarity] ? tang1Card : tang2Card;

    const wishMatched = tang1Card.vibe === wish || tang2Card.vibe === wish;

    let bonusSecretCard: HangoutCard | undefined;
    if (wishMatched) {
      const secretPool = groupPool.filter(
        (c) => (c.rarity === 'secret' || c.rarity === 'mega' || c.rarity === 'sr') && !exclude.has(c.id)
      );
      if (secretPool.length > 0) {
        bonusSecretCard = secretPool[Math.floor(Math.random() * secretPool.length)];
      }
    }

    return {
      id: `unbox-${Date.now()}`,
      mode: 'combo',
      timestamp,
      wishSelected: wish,
      wishMatched,
      primaryCard,
      tang1Card,
      tang2Card,
      twistCard,
      bonusSecretCard,
    };
  }

  // Single bag mode
  const primaryCard = pickWeightedCard(groupPool, wish, budget, exclude);
  exclude.add(primaryCard.id);
  const wishMatched = primaryCard.vibe === wish;

  let bonusSecretCard: HangoutCard | undefined;
  if (wishMatched) {
    const highPool = groupPool.filter(
      (c) => (c.rarity === 'secret' || c.rarity === 'mega' || c.rarity === 'sr') && !exclude.has(c.id)
    );
    if (highPool.length > 0) {
      bonusSecretCard = highPool[Math.floor(Math.random() * highPool.length)];
    }
  }

  return {
    id: `unbox-${Date.now()}`,
    mode: 'single',
    timestamp,
    wishSelected: wish,
    wishMatched,
    primaryCard,
    twistCard,
    bonusSecretCard,
  };
}
