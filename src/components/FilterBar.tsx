import React from 'react';
import { BUDGET_OPTIONS, GROUP_OPTIONS, VIBE_WISHES } from '../data/themes';
import {
  BudgetTier,
  GroupType,
  ThemeConfig,
  UnboxMode,
  VibeWish,
} from '../types/hangout';

interface FilterBarProps {
  activeTheme: ThemeConfig;
  mode: UnboxMode;
  onSelectMode: (mode: UnboxMode) => void;
  group: GroupType;
  onSelectGroup: (group: GroupType) => void;
  budget: BudgetTier;
  onSelectBudget: (budget: BudgetTier) => void;
  wish: VibeWish;
  onSelectWish: (wish: VibeWish) => void;
  wishHitCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeTheme,
  mode,
  onSelectMode,
  group,
  onSelectGroup,
  budget,
  onSelectBudget,
  wish,
  onSelectWish,
  wishHitCount,
}) => {
  return (
    <section
      aria-label="Thanh điều khiển túi mù"
      className="w-full max-w-3xl mx-auto px-3 mt-3"
    >
      <div
        className="rounded-3xl p-3 border border-white/15 backdrop-blur-xl shadow-2xl space-y-2.5"
        style={{ backgroundColor: activeTheme.colors.cardSurface }}
      >
        {/* Row 1: Visual Wish Vibe Pills ("Nguyện Vọng") + Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* 4 Visual Wish Vibe Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {VIBE_WISHES.map((w) => {
              const isSelected = wish === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onSelectWish(w.id)}
                  aria-pressed={isSelected}
                  title={`Nguyện vọng: ${w.label} (${w.desc})`}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                    isSelected
                      ? 'bg-white text-slate-950 border-white shadow-lg scale-105'
                      : 'bg-white/5 hover:bg-white/15 text-white border-white/10 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="text-base">{w.emoji}</span>
                  <span>{w.label.split(' ')[0]}</span>
                </button>
              );
            })}
            {wishHitCount > 0 && (
              <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                🎉 ×{wishHitCount}
              </span>
            )}
          </div>

          {/* 1 Bag vs 3-Bag Combo Visual Switch */}
          <div className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => onSelectMode('single')}
              aria-pressed={mode === 'single'}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                mode === 'single'
                  ? 'bg-pink-500 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🎁 1 Túi</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectMode('combo')}
              aria-pressed={mode === 'combo'}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                mode === 'combo'
                  ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🔥 3 Túi</span>
            </button>
          </div>
        </div>

        {/* Row 2: Compact Icon Chips for Group & Budget */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
          {/* Group Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {GROUP_OPTIONS.map((g) => {
              const active = group === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onSelectGroup(g.id)}
                  aria-pressed={active}
                  title={g.label}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    active
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span>{g.emoji}</span>
                  <span className="hidden sm:inline">{g.label}</span>
                </button>
              );
            })}
          </div>

          {/* Budget Chips */}
          <div className="flex items-center gap-1">
            {BUDGET_OPTIONS.map((b) => {
              const active = budget === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onSelectBudget(b.id)}
                  aria-pressed={active}
                  title={b.desc}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                    active
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
