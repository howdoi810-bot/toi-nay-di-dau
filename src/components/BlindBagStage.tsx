import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Scissors, Sparkles, Eye } from 'lucide-react';
import { VIBE_WISHES } from '../data/themes';
import { ThemeConfig, UnboxMode, VibeWish } from '../types/hangout';
import { soundEngine } from '../utils/sound';
import { THEME_BAG_QUADRANT } from './CardArtwork';

interface BlindBagStageProps {
  activeTheme: ThemeConfig;
  mode: UnboxMode;
  wish: VibeWish;
  isRipping: boolean;
  onTriggerUnbox: () => void;
}

const BAG_PACKS = [
  { id: 0, code: 'BOX #01', luckTag: '✨ Hào Quang Tím', silhouette: '🍸 🎳 📸' },
  { id: 1, code: 'BOX #02', luckTag: '🔥 Nặng Tay Lắm', silhouette: '🥩 🍲 🍢' },
  { id: 2, code: 'BOX #03', luckTag: '🔮 Vía Secret 1:144', silhouette: '🏙️ ⛺ 🚀' },
  { id: 3, code: 'BOX #04', luckTag: '💘 Đỏ Tình Duyên', silhouette: '🎸 🚲 🍨' },
  { id: 4, code: 'BOX #05', luckTag: '🎲 Hệ Tâm Linh', silhouette: '🃏 🎭 📚' },
];

export const BlindBagStage: React.FC<BlindBagStageProps> = ({
  activeTheme,
  mode,
  wish,
  isRipping,
  onTriggerUnbox,
}) => {
  const [selectedPackIdx, setSelectedPackIdx] = useState(2);
  const [isSquished, setIsSquished] = useState(false);
  const [xrayActive, setXrayActive] = useState(false);
  const [sliceProgress, setSliceProgress] = useState(0);
  const [isSlicing, setIsSlicing] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });

  const bagRef = useRef<HTMLDivElement | null>(null);
  const lastTickRef = useRef(0);

  const selectedWishInfo = VIBE_WISHES.find((w) => w.id === wish) || VIBE_WISHES[0];
  const bagQuadrant = THEME_BAG_QUADRANT[activeTheme.id];
  const currentPack = BAG_PACKS[selectedPackIdx];

  const rotateCarousel = (dir: -1 | 1) => {
    if (isRipping) return;
    soundEngine.playBagShake();
    setXrayActive(false);
    setSliceProgress(0);
    setSelectedPackIdx((prev) => (prev + dir + BAG_PACKS.length) % BAG_PACKS.length);
  };

  const handlePokeBag = () => {
    if (isRipping || isSlicing) return;
    soundEngine.playBagShake();
    setIsSquished(true);
    setXrayActive((prev) => !prev);
    setTimeout(() => setIsSquished(false), 380);
  };

  const handleBagPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!bagRef.current) return;
    const rect = bagRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    // 3D Foil Tilt
    const rotY = (relX - 0.5) * 22;
    const rotX = (0.5 - relY) * 18;
    setTilt({
      x: rotX,
      y: rotY,
      glareX: Math.round(relX * 100),
      glareY: Math.round(relY * 100),
    });

    // If slicing across the bag
    if (isSlicing && !isRipping) {
      const clamped = Math.max(0, Math.min(1, relX));
      setSliceProgress(clamped);

      if (clamped - lastTickRef.current > 0.1) {
        soundEngine.playTearTick(clamped);
        lastTickRef.current = clamped;
      }

      if (clamped >= 0.68) {
        setIsSlicing(false);
        setSliceProgress(1);
        lastTickRef.current = 0;
        onTriggerUnbox();
        setTimeout(() => setSliceProgress(0), 950);
      }
    }
  };

  const handleBagPointerLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
    if (isSlicing) {
      setIsSlicing(false);
      if (sliceProgress < 0.68) setSliceProgress(0);
    }
  };

  const handleStartSlice = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (isRipping) return;
    setIsSlicing(true);
    lastTickRef.current = 0;
    if (bagRef.current) {
      const rect = bagRef.current.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setSliceProgress(relX);
    }
  };

  const handleEndSlice = () => {
    if (!isSlicing) return;
    setIsSlicing(false);
    if (sliceProgress < 0.68) {
      setSliceProgress(0);
    }
  };

  const visualTearAmount = isRipping ? 1 : sliceProgress;

  return (
    <section
      aria-label="Sân khấu 3D Xé Túi Mù"
      className="w-full max-w-4xl mx-auto px-3 pt-3 pb-1 flex flex-col items-center select-none relative"
    >
      {/* Minimal Visual Status Pill */}
      <div className="flex items-center gap-2 mb-2">
        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono font-bold text-white flex items-center gap-1.5 shadow">
          <span>{selectedWishInfo.emoji}</span>
          <span>Nguyện vọng: {selectedWishInfo.label}</span>
        </span>
        <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-[11px] font-mono font-bold text-amber-300">
          {currentPack.code} · {currentPack.luckTag}
        </span>
      </div>

      {/* 3D Blind Bag Carousel Stage */}
      <div className="relative w-full h-[380px] sm:h-[420px] flex items-center justify-center perspective-[1200px]">
        {/* Left Carousel Button */}
        <button
          type="button"
          onClick={() => rotateCarousel(-1)}
          aria-label="Túi trước"
          className="absolute left-1 sm:left-8 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/75 border border-white/25 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Carousel Button */}
        <button
          type="button"
          onClick={() => rotateCarousel(1)}
          aria-label="Túi tiếp theo"
          className="absolute right-1 sm:right-8 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/75 border border-white/25 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition active:scale-90"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 5-Bag 3D Fan Carousel */}
        {BAG_PACKS.map((pack, idx) => {
          let offset = idx - selectedPackIdx;
          if (offset > 2) offset -= BAG_PACKS.length;
          if (offset < -2) offset += BAG_PACKS.length;

          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);

          return (
            <motion.div
              key={pack.id}
              animate={{
                x: offset * (typeof window !== 'undefined' && window.innerWidth < 640 ? 92 : 145),
                scale: isCenter ? (isSquished ? 0.93 : 1) : 1 - absOffset * 0.18,
                rotateY: isCenter ? tilt.y : offset * -24,
                rotateX: isCenter ? tilt.x : 0,
                zIndex: 20 - absOffset * 5,
                opacity: absOffset > 1 ? 0.35 : isCenter ? 1 : 0.68,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={() => {
                if (!isCenter) {
                  soundEngine.playBagShake();
                  setSelectedPackIdx(idx);
                }
              }}
              className={`absolute ${
                isCenter ? 'w-[256px] sm:w-[284px]' : 'w-[220px] sm:w-[240px] cursor-pointer'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* If Center Bag AND Combo Mode, show 2 stacked shadow bags behind it */}
              {isCenter && mode === 'combo' && (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 -rotate-6 -translate-x-5 translate-y-2 rounded-[30px] border-2 border-cyan-300/60 opacity-80 shadow-xl"
                    style={{ background: activeTheme.colors.bagGradient }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rotate-6 translate-x-5 translate-y-2 rounded-[30px] border-2 border-amber-300/60 opacity-80 shadow-xl"
                    style={{ background: activeTheme.colors.bagGradient }}
                  />
                </>
              )}

              {/* Active Center Bag Interactive Container */}
              <div
                ref={isCenter ? bagRef : undefined}
                onPointerMove={isCenter ? handleBagPointerMove : undefined}
                onPointerUp={isCenter ? handleEndSlice : undefined}
                onPointerLeave={isCenter ? handleBagPointerLeave : undefined}
                className="relative w-full h-[350px] sm:h-[385px] select-none"
              >
                {/* Ambient Foil Aura */}
                {isCenter && (
                  <div
                    className={`pointer-events-none absolute -inset-4 rounded-[38px] blur-2xl transition-opacity duration-300 ${
                      visualTearAmount > 0.1 ? 'opacity-100 scale-110' : 'opacity-65'
                    }`}
                    style={{ background: activeTheme.colors.bagGradient }}
                  />
                )}

                {/* RISING COLLECTOR CARD PEERING OUT FROM INSIDE THE BAG WHEN SLICING/RIPPING */}
                {isCenter && (
                  <motion.div
                    animate={{
                      y: isRipping ? -78 : visualTearAmount > 0.05 ? -28 * visualTearAmount : 20,
                      scale: isRipping ? 1.04 : 0.92,
                      opacity: visualTearAmount > 0.05 || isRipping ? 1 : 0,
                    }}
                    className="pointer-events-none absolute inset-x-5 top-6 h-48 rounded-2xl border-2 border-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.9)] overflow-hidden z-10 flex items-center justify-center"
                    style={{
                      backgroundImage: 'url(/art/hangouts-sheet-1.png)',
                      backgroundSize: '300% 300%',
                      backgroundPosition: '50% 50%',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-amber-300/30 animate-pulse" />
                    <Sparkles className="w-10 h-10 text-amber-200 drop-shadow-lg animate-spin" />
                  </motion.div>
                )}

                {/* TOP SERRATED FOIL CAP (Physically slices & flies off!) */}
                <motion.div
                  onPointerDown={isCenter ? handleStartSlice : undefined}
                  animate={
                    isRipping
                      ? { y: -95, x: 65, rotate: 24, opacity: 0 }
                      : {
                          y: -visualTearAmount * 22,
                          x: visualTearAmount * 14,
                          rotate: visualTearAmount * 9,
                          opacity: 1,
                        }
                  }
                  transition={{ duration: isRipping ? 0.38 : 0.08 }}
                  className={`relative z-20 h-[68px] rounded-t-[28px] overflow-hidden border-2 border-b-0 shadow-lg ${
                    isCenter ? 'cursor-ew-resize' : ''
                  }`}
                  style={{
                    background: activeTheme.colors.bagGradient,
                    borderColor: activeTheme.colors.bagBorder,
                  }}
                >
                  {/* Zig-Zag Foil Top Crimp Ridges */}
                  <div
                    className="w-full h-3 opacity-45"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(90deg, rgba(255,255,255,0.45) 0px, rgba(255,255,255,0.45) 4px, rgba(0,0,0,0.3) 4px, rgba(0,0,0,0.3) 8px)',
                    }}
                  />

                  <div className="px-4 pt-1.5 flex items-center justify-between text-[10px] font-mono font-bold text-white">
                    <span className="px-2 py-0.5 rounded bg-black/40 border border-white/20">
                      {pack.code}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/40 text-amber-300">
                      {mode === 'combo' ? '3-PACK COMBO' : 'BLIND BOX'}
                    </span>
                  </div>

                  {/* Interactive Glowing Cut Line across the Seam */}
                  {isCenter && (
                    <div className="absolute bottom-0 inset-x-0 h-7 flex items-center px-3 bg-black/45 border-t border-dashed border-white/80">
                      {/* Neon Laser Slice Beam */}
                      <div
                        className="absolute left-0 inset-y-0 bg-gradient-to-r from-pink-500 via-amber-300 to-cyan-300 opacity-85 transition-all duration-75"
                        style={{ width: `${Math.max(visualTearAmount * 100, 12)}%` }}
                      />

                      <div
                        className="relative z-10 w-6 h-6 rounded-full bg-white text-pink-600 shadow-lg flex items-center justify-center animate-pulse"
                        style={{
                          transform: `translateX(${visualTearAmount * 210}px)`,
                        }}
                      >
                        <Scissors className="w-3.5 h-3.5" />
                      </div>

                      <span className="relative z-10 flex-1 text-center text-[10px] font-mono font-extrabold tracking-wider text-white uppercase drop-shadow">
                        {visualTearAmount > 0.1
                          ? `XÉ ${Math.round(visualTearAmount * 100)}%`
                          : 'VUỐT NGANG ĐỂ XÉ BAO ➔'}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* MAIN FOIL BAG POUCH WITH 3D POP-MART ARTWORK */}
                <div
                  onClick={isCenter ? handlePokeBag : undefined}
                  onPointerDown={isCenter ? handleStartSlice : undefined}
                  className="relative z-20 h-[282px] sm:h-[315px] rounded-b-[30px] overflow-hidden border-2 border-t-0 shadow-2xl cursor-pointer group"
                  style={{
                    borderColor: activeTheme.colors.bagBorder,
                    background: activeTheme.colors.bagGradient,
                  }}
                >
                  {/* Full-Bleed 3D Pop-Mart Blind Bag Cover Art */}
                  <div
                    className="absolute inset-2 rounded-[22px] overflow-hidden border border-white/30 shadow-inner bg-slate-900"
                    style={{
                      backgroundImage: 'url(/art/blindbags-grid.png)',
                      backgroundSize: '200% 200%',
                      backgroundPosition: `${bagQuadrant.x} ${bagQuadrant.y}`,
                    }}
                  >
                    {/* Dynamic 3D Foil Specular Glare that tracks Mouse/Finger */}
                    {isCenter && (
                      <div
                        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-75 transition-opacity"
                        style={{
                          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.85) 0%, rgba(255,192,203,0.35) 32%, transparent 68%)`,
                        }}
                      />
                    )}

                    {/* X-RAY SILHOUETTE PEEK OVERLAY WHEN POKED */}
                    <AnimatePresence>
                      {isCenter && xrayActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute inset-4 rounded-2xl bg-slate-950/88 backdrop-blur-md border-2 border-cyan-400/80 flex flex-col items-center justify-center p-3 text-center shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                        >
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 mb-1 flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> X-RAY SOI TÚI MÙ
                          </span>
                          <div className="text-3xl sm:text-4xl tracking-widest my-2 animate-bounce filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                            {pack.silhouette}
                          </div>
                          <span className="text-[11px] font-bold text-amber-300">
                            {pack.luckTag}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom Foil Toy Series Stamp */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent flex items-end justify-between">
                      <div>
                        <span className="block text-[9px] font-mono font-bold uppercase tracking-widest text-pink-300">
                          {activeTheme.bagEditionTag}
                        </span>
                        <span className="font-display text-sm sm:text-base text-white tracking-wide drop-shadow">
                          {activeTheme.name}
                        </span>
                      </div>

                      {isCenter && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTriggerUnbox();
                          }}
                          data-spin-trigger="true"
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-300 text-slate-950 font-display text-xs tracking-wide shadow-xl flex items-center gap-1 transition transform hover:scale-105 active:scale-95"
                        >
                          <Scissors className="w-3.5 h-3.5 text-pink-600" />
                          <span>XÉ NGAY</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Micro Interactive Controls Hint */}
      <div className="flex items-center gap-3 mt-1">
        <button
          type="button"
          onClick={handlePokeBag}
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-cyan-200 flex items-center gap-1.5 transition"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>{xrayActive ? 'Tắt X-Ray Soi Túi' : 'Bấm Soi X-Ray Túi'}</span>
        </button>

        <button
          type="button"
          onClick={onTriggerUnbox}
          disabled={isRipping}
          className="px-5 py-2 rounded-full font-display text-xs sm:text-sm text-white shadow-xl flex items-center gap-1.5 transition hover:scale-105 active:scale-95"
          style={{
            background: activeTheme.colors.bagGradient,
            border: `1.5px solid ${activeTheme.colors.bagBorder}`,
          }}
        >
          <Scissors className="w-4 h-4" />
          <span>{mode === 'combo' ? 'XÉ COMBO 3 TÚI' : 'XÉ TÚI MÙ NÀY'}</span>
        </button>
      </div>
    </section>
  );
};
