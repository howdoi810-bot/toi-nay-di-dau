import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { BUILTIN_HANGOUTS } from './data/hangouts';
import { THEMES } from './data/themes';
import {
  BudgetTier,
  CityPreset,
  GroupType,
  HangoutCard,
  ThemeId,
  UnboxMode,
  UnboxResult,
  VibeWish,
} from './types/hangout';
import { loadUserState, saveUserState, PersistedUserState } from './utils/storage';
import { soundEngine } from './utils/sound';
import { pickRandomTwist, rollBlindBag } from './utils/gachaEngine';
import { ThemeToolbar } from './components/ThemeToolbar';
import { FilterBar } from './components/FilterBar';
import { BlindBagStage } from './components/BlindBagStage';
import { HangoutCardModal } from './components/HangoutCardModal';
import { CollectionShelf } from './components/CollectionShelf';
import { CreatorStatsModal } from './components/CreatorStatsModal';
import { recordBagRip, recordPageVisit } from './utils/analytics';

export function App() {
  const [userState, setUserState] = useState<PersistedUserState>(() => loadUserState());
  const [isRipping, setIsRipping] = useState(false);
  const [activeResult, setActiveResult] = useState<UnboxResult | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return search.includes('stats') || hash.includes('stats');
    }
    return false;
  });
  const [globalBagsCount, setGlobalBagsCount] = useState(0);

  // Record page view and load live cloud bags count on mount
  useEffect(() => {
    recordPageVisit().then(({ bags }) => {
      if (bags > 0) setGlobalBagsCount(bags);
    });
  }, []);

  useEffect(() => {
    soundEngine.enabled = userState.soundEnabled;
    saveUserState(userState);
  }, [userState]);

  const activeTheme = THEMES[userState.theme] || THEMES.blindbox;

  const allCards = useMemo(() => {
    return [...userState.customCards, ...BUILTIN_HANGOUTS];
  }, [userState.customCards]);

  const fireCelebrationConfetti = (isMegaOrSecret: boolean) => {
    try {
      confetti({
        particleCount: isMegaOrSecret ? 120 : 70,
        spread: 85,
        origin: { y: 0.55 },
      });
    } catch {
      // Ignore in headless env
    }
  };

  const handleTriggerUnbox = () => {
    if (isRipping) return;
    setIsRipping(true);
    soundEngine.playBagRip();

    setTimeout(() => {
      const result = rollBlindBag({
        allCards,
        mode: userState.mode,
        group: userState.group,
        budget: userState.budget,
        wish: userState.wish,
        lastCardId: activeResult?.primaryCard.id,
      });

      soundEngine.playRevealCard(result.primaryCard.rarity);
      if (result.wishMatched) {
        soundEngine.playWishMatch();
      }

      const isHighRarity =
        result.primaryCard.rarity === 'secret' ||
        result.primaryCard.rarity === 'mega' ||
        result.wishMatched;

      if (isHighRarity) {
        fireCelebrationConfetti(
          result.primaryCard.rarity === 'secret' || result.primaryCard.rarity === 'mega'
        );
      }

      const newlyUnlocked = new Set(userState.unlockedCardIds);
      newlyUnlocked.add(result.primaryCard.id);
      if (result.tang1Card) newlyUnlocked.add(result.tang1Card.id);
      if (result.tang2Card) newlyUnlocked.add(result.tang2Card.id);
      if (result.bonusSecretCard) newlyUnlocked.add(result.bonusSecretCard.id);

      const bagsOpenedNow = userState.mode === 'combo' ? 3 : 1;

      // Increment live cloud bags ripped counter
      recordBagRip(bagsOpenedNow, result.primaryCard.rarity, result.wishMatched).then((latest) => {
        if (latest > 0) setGlobalBagsCount(latest);
      });

      setUserState((prev) => ({
        ...prev,
        totalBagsRipped: prev.totalBagsRipped + bagsOpenedNow,
        wishHitCount: result.wishMatched ? prev.wishHitCount + 1 : prev.wishHitCount,
        unlockedCardIds: Array.from(newlyUnlocked),
      }));

      setActiveResult(result);
      setIsRipping(false);
    }, 520);
  };

  const handleInspectCatalogCard = (card: HangoutCard) => {
    const now = new Date();
    const timestamp =
      now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
      ' · ' +
      now.toLocaleDateString('vi-VN');

    soundEngine.playRevealCard(card.rarity);

    setActiveResult({
      id: `inspect-${card.id}`,
      mode: 'single',
      timestamp,
      wishSelected: userState.wish,
      wishMatched: card.vibe === userState.wish,
      primaryCard: card,
      twistCard: pickRandomTwist(),
    });
  };

  const handleAddCustomCard = (newCard: HangoutCard) => {
    setUserState((prev) => ({
      ...prev,
      customCards: [newCard, ...prev.customCards],
      unlockedCardIds: Array.from(new Set([newCard.id, ...prev.unlockedCardIds])),
    }));
  };

  const handleDeleteCustomCard = (id: string) => {
    setUserState((prev) => ({
      ...prev,
      customCards: prev.customCards.filter((c) => c.id !== id),
      unlockedCardIds: prev.unlockedCardIds.filter((cid) => cid !== id),
    }));
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('collection-shelf');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="top"
      className="min-h-screen flex flex-col justify-between transition-colors duration-500 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 18%, ${activeTheme.colors.bgSecondary} 0%, ${activeTheme.colors.bgPrimary} 75%)`,
        color: activeTheme.colors.textPrimary,
      }}
    >
      {/* Ambient Background Glow Orbs */}
      <div
        className="pointer-events-none fixed -top-32 -left-32 w-96 h-96 rounded-full blur-[130px] opacity-25"
        style={{ backgroundColor: activeTheme.colors.accentPrimary }}
      />
      <div
        className="pointer-events-none fixed top-1/3 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-20"
        style={{ backgroundColor: activeTheme.colors.accentSecondary }}
      />

      {/* Top Navigation & Theme Switcher */}
      <ThemeToolbar
        activeTheme={activeTheme}
        onSelectTheme={(theme: ThemeId) => setUserState((p) => ({ ...p, theme }))}
        city={userState.city}
        onSelectCity={(city: CityPreset) => setUserState((p) => ({ ...p, city }))}
        soundEnabled={userState.soundEnabled}
        onToggleSound={() => setUserState((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
        totalBagsRipped={userState.totalBagsRipped}
        globalBagsCount={globalBagsCount}
        unlockedCount={userState.unlockedCardIds.length}
        totalCatalogCount={allCards.length}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onOpenStatsModal={() => setIsStatsModalOpen(true)}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* TOY-FIRST LAYOUT: 3D Blind Bag Stage First -> Compact Control Dock Second -> Art Gallery Third */}
      <main className="flex-1 z-10">
        {/* 1. 3D Blind Bag Carousel & Direct Seam Slicing Stage */}
        <BlindBagStage
          activeTheme={activeTheme}
          mode={userState.mode}
          wish={userState.wish}
          isRipping={isRipping}
          onTriggerUnbox={handleTriggerUnbox}
        />

        {/* 2. Compact Floating Icon Control Dock */}
        <FilterBar
          activeTheme={activeTheme}
          mode={userState.mode}
          onSelectMode={(mode: UnboxMode) => setUserState((p) => ({ ...p, mode }))}
          group={userState.group}
          onSelectGroup={(group: GroupType) => setUserState((p) => ({ ...p, group }))}
          budget={userState.budget}
          onSelectBudget={(budget: BudgetTier) => setUserState((p) => ({ ...p, budget }))}
          wish={userState.wish}
          onSelectWish={(wish: VibeWish) => setUserState((p) => ({ ...p, wish }))}
          wishHitCount={userState.wishHitCount}
        />

        {/* 3. Visual-First Collector Gallery */}
        <CollectionShelf
          allCards={allCards}
          unlockedIds={userState.unlockedCardIds}
          city={userState.city}
          isCustomModalOpen={isCustomModalOpen}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
          onCloseCustomModal={() => setIsCustomModalOpen(false)}
          onAddCustomCard={handleAddCustomCard}
          onDeleteCustomCard={handleDeleteCustomCard}
          onInspectCard={handleInspectCatalogCard}
        />
      </main>

      {/* 2-Sided 3D Flippable Full-Art Card Modal */}
      <HangoutCardModal
        result={activeResult}
        city={userState.city}
        onClose={() => setActiveResult(null)}
        onRipAgain={() => {
          setActiveResult(null);
          setTimeout(() => handleTriggerUnbox(), 120);
        }}
      />

      {/* Secret Creator Analytics Modal (?stats=1) */}
      <CreatorStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        personalBagsRipped={userState.totalBagsRipped}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-4 px-4 text-center text-xs text-slate-400 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-display text-white">TỐI NAY ĐI ĐÂU? · XÉ TÚI MÙ</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsStatsModalOpen(true)}
              className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
            >
              <span>📊 Thống kê live (?stats=1)</span>
            </button>
            <span className="text-white/20">|</span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Đặt lại bộ sưu tập túi mù từ đầu?')) {
                  window.localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-pink-400 hover:underline font-medium"
            >
              Reset Kệ Sưu Tập
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
