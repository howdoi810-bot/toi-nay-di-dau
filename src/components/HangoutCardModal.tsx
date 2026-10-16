import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  X,
  RotateCw,
  Gift,
} from 'lucide-react';
import { CITY_OPTIONS, RARITY_CONFIG, VIBE_WISHES } from '../data/themes';
import { CityPreset, HangoutCard, UnboxResult } from '../types/hangout';
import { generateShareCardDataUrl } from '../utils/shareCardGenerator';
import { CardArtwork } from './CardArtwork';
import { soundEngine } from '../utils/sound';

interface HangoutCardModalProps {
  result: UnboxResult | null;
  city: CityPreset;
  onClose: () => void;
  onRipAgain: () => void;
}

export const HangoutCardModal: React.FC<HangoutCardModalProps> = ({
  result,
  city,
  onClose,
  onRipAgain,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<'primary' | 'tang1' | 'tang2' | 'bonus'>('primary');
  const [copiedText, setCopiedText] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });

  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  if (!result) return null;

  let activeCard: HangoutCard = result.primaryCard;
  if (selectedSlot === 'tang1' && result.tang1Card) activeCard = result.tang1Card;
  if (selectedSlot === 'tang2' && result.tang2Card) activeCard = result.tang2Card;
  if (selectedSlot === 'bonus' && result.bonusSecretCard) activeCard = result.bonusSecretCard;

  const rarityInfo = RARITY_CONFIG[activeCard.rarity];
  const cityLabel = CITY_OPTIONS.find((c) => c.id === city)?.short || 'Toàn quốc';
  const wishInfo = VIBE_WISHES.find((w) => w.id === result.wishSelected);
  const spots = activeCard.citySpots[city] || activeCard.citySpots.any;

  const getGoogleMapsUrl = (query: string) => {
    const citySuffix =
      city === 'saigon'
        ? ' TP.HCM'
        : city === 'hanoi'
        ? ' Hà Nội'
        : city === 'danang'
        ? ' Đà Nẵng'
        : '';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query + citySuffix
    )}`;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    setCardTilt({
      x: (0.5 - relY) * 16,
      y: (relX - 0.5) * 18,
      glareX: Math.round(relX * 100),
      glareY: Math.round(relY * 100),
    });
  };

  const handlePointerLeave = () => {
    setCardTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleFlipCard = () => {
    soundEngine.playBagShake();
    setIsFlipped((prev) => !prev);
  };

  const handleCopyShareMessage = async () => {
    const lines = [
      `🎁 [CHỐT KÈO TỐI NAY • ${rarityInfo.label}]`,
      `${activeCard.emoji} ${activeCard.title} (${activeCard.priceEstimate})`,
      `📍 ${cityLabel}: ${spots.join(', ')}`,
      `${result.twistCard.emoji} Luật ngầm: ${result.twistCard.title} — ${result.twistCard.penalty}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2400);
    } catch {
      // Ignore
    }
  };

  const handleDownloadShareCard = async () => {
    setIsGeneratingImg(true);
    try {
      const dataUrl = await generateShareCardDataUrl(result, city);
      const link = document.createElement('a');
      link.download = `the-chot-keo-${activeCard.id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl select-none overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Thẻ Kèo Đi Chơi"
      >
        {/* Top Floating Switcher for Combo 3 Bags or Bonus Secret Card */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3 z-20">
          {result.wishMatched && (
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-lg animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRÚNG NGUYỆN VỌNG {wishInfo?.emoji}!</span>
            </span>
          )}

          {result.mode === 'combo' && result.tang1Card && result.tang2Card && (
            <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/20 backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  setSelectedSlot('tang1');
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  selectedSlot === 'tang1' || (selectedSlot === 'primary' && activeCard.id === result.tang1Card.id)
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                🥢 Tăng 1
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedSlot('tang2');
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  selectedSlot === 'tang2' || (selectedSlot === 'primary' && activeCard.id === result.tang2Card.id)
                    ? 'bg-pink-500 text-white'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                🌙 Tăng 2
              </button>
            </div>
          )}

          {result.bonusSecretCard && (
            <button
              type="button"
              onClick={() => {
                setSelectedSlot(selectedSlot === 'bonus' ? 'primary' : 'bonus');
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition shadow-lg ${
                selectedSlot === 'bonus'
                  ? 'bg-amber-400 text-slate-950 border-white'
                  : 'bg-amber-400/20 text-amber-300 border-amber-400/50 hover:bg-amber-400/30'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{selectedSlot === 'bonus' ? 'Đang xem Thẻ Thưởng' : '+1 Thẻ Secret Thưởng'}</span>
            </button>
          )}
        </div>

        {/* 3D FLIPPABLE FULL-ART COLLECTOR CARD */}
        <div
          ref={cardContainerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative w-full max-w-[360px] sm:max-w-[390px] h-[510px] sm:h-[545px]"
          style={{ perspective: '1400px' }}
        >
          {/* Close X */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute -top-3 -right-3 z-40 w-9 h-9 rounded-full bg-slate-900 border-2 border-white/30 text-white flex items-center justify-center shadow-xl hover:scale-110 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <motion.div
            animate={{
              rotateY: isFlipped ? 180 + cardTilt.y : cardTilt.y,
              rotateX: cardTilt.x,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="w-full h-full relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* ===================================== */}
            {/* FRONT FACE: 70% FULL-ART VISUAL CARD  */}
            {/* ===================================== */}
            <div
              className="absolute inset-0 rounded-[32px] p-1.5 shadow-2xl flex flex-col justify-between overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                background: rarityInfo.gradient,
                boxShadow: `0 0 60px -10px ${rarityInfo.borderGlow}`,
              }}
            >
              <div className="w-full h-full rounded-[27px] bg-slate-950 flex flex-col overflow-hidden relative">
                {/* Dynamic Holographic Foil Glare */}
                <div
                  className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay opacity-70"
                  style={{
                    background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.15) 35%, transparent 65%)`,
                  }}
                />

                {/* Top Floating Rarity & Flip Bar */}
                <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-mono font-extrabold tracking-wider uppercase backdrop-blur-md border shadow-lg"
                    style={{
                      color: '#fff',
                      borderColor: rarityInfo.color,
                      backgroundColor: 'rgba(15, 23, 42, 0.78)',
                    }}
                  >
                    ★ {rarityInfo.label} · {rarityInfo.viLabel}
                  </span>

                  <button
                    type="button"
                    onClick={handleFlipCard}
                    className="px-2.5 py-1 rounded-full bg-black/65 hover:bg-black/85 border border-white/30 text-[11px] font-bold text-amber-300 flex items-center gap-1 backdrop-blur-md shadow-lg transition"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Lật Thẻ</span>
                  </button>
                </div>

                {/* Giant 3D Pop-Mart Illustration (Takes 66% of the Card!) */}
                <div
                  onClick={handleFlipCard}
                  className="relative w-full h-[64%] cursor-pointer group overflow-hidden"
                >
                  <CardArtwork card={activeCard} size="lg" className="w-full h-full" />
                </div>

                {/* Compact Visual Bottom Panel (Minimal Text!) */}
                <div className="flex-1 p-4 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-between relative z-30">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded-lg border border-amber-300/30">
                        💰 {activeCard.priceEstimate}
                      </span>
                      <span className="text-[11px] font-bold text-pink-300">
                        {activeCard.category}
                      </span>
                    </div>

                    <h2 className="font-display text-lg sm:text-xl text-white leading-tight line-clamp-2 mt-1">
                      {activeCard.title}
                    </h2>
                  </div>

                  {/* Location Chip + 1-Tap Maps CTA */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-cyan-300 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                      <span className="truncate font-semibold">{spots[0]}</span>
                    </div>

                    <a
                      href={getGoogleMapsUrl(activeCard.mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-md transition"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Mở Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================== */}
            {/* BACK FACE: TWIST RULE & PRO-TIP       */}
            {/* ===================================== */}
            <div
              onClick={handleFlipCard}
              className="absolute inset-0 rounded-[32px] p-1.5 shadow-2xl cursor-pointer overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: rarityInfo.gradient,
              }}
            >
              <div className="w-full h-full rounded-[27px] bg-slate-950 p-5 flex flex-col justify-between text-white relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono font-bold text-pink-400 uppercase">
                    🃏 MẶT SAU · LUẬT NGẦM & BÍ KÍP
                  </span>
                  <span className="text-xs text-amber-300 flex items-center gap-1 font-bold">
                    <RotateCw className="w-3.5 h-3.5" /> Lật lại
                  </span>
                </div>

                {/* Twist Rule Centerpiece */}
                <div className="my-auto space-y-4">
                  <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-center space-y-2">
                    <div className="text-4xl">{result.twistCard.emoji}</div>
                    <div className="text-xs font-mono font-bold uppercase text-rose-300">
                      THẺ LUẬT NGẦM ĐÊM NAY
                    </div>
                    <h3 className="font-display text-lg text-white">
                      {result.twistCard.title}
                    </h3>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {result.twistCard.description}
                    </p>
                    <div className="p-2 rounded-xl bg-black/40 text-amber-300 text-xs font-bold">
                      ⚠️ {result.twistCard.penalty}
                    </div>
                  </div>

                  {/* Pro Tip & All Spots */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <p className="text-cyan-200">
                      <strong>💡 Bí kíp:</strong> {activeCard.proTip}
                    </p>
                    <p className="text-slate-300">
                      <strong>📍 Gợi ý tại {cityLabel}:</strong> {spots.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="text-center text-[11px] font-mono text-slate-400">
                  Chạm vào thẻ để lật về mặt trước
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Compact Action Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 z-20">
          <button
            type="button"
            onClick={handleFlipCard}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <RotateCw className="w-4 h-4 text-amber-300" />
            <span>{isFlipped ? 'Lật Mặt Trước (Ảnh)' : 'Lật Mặt Sau (Luật Ngầm)'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadShareCard}
            disabled={isGeneratingImg}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingImg ? 'Đang xuất...' : 'Tải Ảnh Chốt Kèo'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyShareMessage}
            className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Đã Copy!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-300" />
                <span>Copy Zalo</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFlipped(false);
              setSelectedSlot('primary');
              onRipAgain();
            }}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display text-xs flex items-center gap-1.5 shadow-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>XÉ TÚI TIẾP</span>
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
};
