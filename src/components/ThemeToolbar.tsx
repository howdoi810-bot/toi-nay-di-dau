import React from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  MapPin,
  Trophy,
  PlusCircle,
  PackageOpen,
  Flame,
  Compass,
  Heart,
} from 'lucide-react';
import { CITY_OPTIONS, THEMES } from '../data/themes';
import { CityPreset, ThemeConfig, ThemeId } from '../types/hangout';

interface ThemeToolbarProps {
  activeTheme: ThemeConfig;
  onSelectTheme: (theme: ThemeId) => void;
  city: CityPreset;
  onSelectCity: (city: CityPreset) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  totalBagsRipped: number;
  unlockedCount: number;
  totalCatalogCount: number;
  onOpenCustomModal: () => void;
  onScrollToCatalog: () => void;
}

const THEME_ICONS: Record<ThemeId, React.ReactNode> = {
  blindbox: <PackageOpen className="w-4 h-4" />,
  saigon_retro: <Flame className="w-4 h-4" />,
  tarot_night: <Sparkles className="w-4 h-4" />,
  city_pop: <Heart className="w-4 h-4" />,
};

export const ThemeToolbar: React.FC<ThemeToolbarProps> = ({
  activeTheme,
  onSelectTheme,
  city,
  onSelectCity,
  soundEnabled,
  onToggleSound,
  totalBagsRipped,
  unlockedCount,
  totalCatalogCount,
  onOpenCustomModal,
  onScrollToCatalog,
}) => {
  // Base community counter + user's personal unboxings for social proof
  const globalSimulatedCount = 148920 + totalBagsRipped;

  return (
    <header className="w-full border-b border-white/10 backdrop-blur-md bg-black/25 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-3">
        {/* Top Row: Brand & Utility Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <a
            href="#top"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Tối Nay Đi Đâu — Xé Túi Mù"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
              style={{ background: activeTheme.colors.bagGradient }}
            >
              <span className="text-xl" role="img" aria-label="Blind bag">
                🎁
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg sm:text-xl tracking-wide text-white">
                  TỐI NAY ĐI ĐÂU?
                </span>
                <span
                  className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border"
                  style={{
                    color: activeTheme.colors.accentSecondary,
                    borderColor: `${activeTheme.colors.accentSecondary}55`,
                    backgroundColor: `${activeTheme.colors.accentSecondary}15`,
                  }}
                >
                  XÉ TÚI MÙ
                </span>
              </div>
              <p className="text-xs text-slate-300/80 hidden sm:block">
                Đã khui{' '}
                <strong className="text-white font-mono">
                  {globalSimulatedCount.toLocaleString('vi-VN')}
                </strong>{' '}
                túi mù trên toàn quốc • Bạn đã xé:{' '}
                <strong className="text-amber-300 font-mono">{totalBagsRipped}</strong>
              </p>
            </div>
          </a>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-2">
            {/* City Selector */}
            <div className="relative flex items-center bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white transition">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-pink-400 shrink-0" />
              <label htmlFor="city-select" className="sr-only">
                Chọn thành phố
              </label>
              <select
                id="city-select"
                value={city}
                onChange={(e) => onSelectCity(e.target.value as CityPreset)}
                className="bg-transparent font-medium text-white focus:outline-none cursor-pointer pr-1"
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.short}
                  </option>
                ))}
              </select>
            </div>

            {/* Collection Shelf Counter Button */}
            <button
              type="button"
              onClick={onScrollToCatalog}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition"
              title="Xem kệ trưng bày bộ sưu tập thẻ đi chơi"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Kệ sưu tập:{' '}
                <strong className="text-amber-300 font-mono">
                  {unlockedCount}/{totalCatalogCount}
                </strong>
              </span>
            </button>

            {/* Custom Bag Creator Trigger */}
            <button
              type="button"
              onClick={onOpenCustomModal}
              className="flex items-center gap-1 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-pink-200 transition"
              title="Tự thêm quán tủ hoặc kèo riêng vào túi mù"
            >
              <PlusCircle className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden md:inline">Tự tạo túi</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              title={soundEnabled ? 'Đang bật hiệu ứng âm thanh xé túi' : 'Đang tắt âm thanh'}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Row: 4 Switchable Cultural Themes (Just like truanayangi's Theme Choice) */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <div
            role="group"
            aria-label="Chọn chủ đề giao diện"
            className="flex items-center gap-1.5"
          >
            {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
              const t = THEMES[tId];
              const isSelected = activeTheme.id === tId;
              return (
                <button
                  key={tId}
                  type="button"
                  onClick={() => onSelectTheme(tId)}
                  aria-pressed={isSelected}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'text-white shadow-md scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                  style={
                    isSelected
                      ? {
                          background: t.colors.bagGradient,
                          border: `1px solid ${t.colors.bagBorder}`,
                        }
                      : undefined
                  }
                >
                  {THEME_ICONS[tId]}
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-300/80 shrink-0">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Không cần đăng nhập • Lưu tự động trên trình duyệt</span>
          </div>
        </div>
      </div>
    </header>
  );
};
