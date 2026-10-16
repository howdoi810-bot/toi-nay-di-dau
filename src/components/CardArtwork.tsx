import React from 'react';
import { RARITY_CONFIG } from '../data/themes';
import { HangoutCard, RarityTier, ThemeId } from '../types/hangout';

// Maps each HangoutCard ID (or fallback index) to a specific cell in our 3x3 Pop-Mart sprite sheets
const CARD_SPRITE_MAP: Record<string, { sheet: 1 | 2; col: 0 | 1 | 2; row: 0 | 1 | 2 }> = {
  // Sheet 1 (3x3)
  'tra-chanh-via-he': { sheet: 1, col: 0, row: 0 },
  'luon-ho-hong-gio': { sheet: 1, col: 1, row: 0 },
  'dap-xe-dem-kham-pha-pho': { sheet: 1, col: 1, row: 0 },
  'xiên-ban-xe-day': { sheet: 1, col: 2, row: 0 },
  'banh-trang-nuong-da-lat-via-he': { sheet: 1, col: 2, row: 0 },
  'circle-k-cu-dem': { sheet: 1, col: 0, row: 1 },
  'di-sieu-thi-mua-do-nau-an-dem': { sheet: 1, col: 0, row: 1 },
  'oc-binh-dan-dau-hem': { sheet: 1, col: 1, row: 1 },
  'chao-suon-xoi-dem': { sheet: 1, col: 1, row: 1 },
  'ca-phe-bet-acoustic-duong-pho': { sheet: 1, col: 2, row: 1 },
  'ca-phe-nhac-song-acoustic': { sheet: 1, col: 2, row: 1 },
  'cafe-24h-chay-deadline-doc-sach': { sheet: 1, col: 2, row: 1 },
  'photobooth-han-quoc': { sheet: 1, col: 0, row: 2 },
  'san-anh-dem-may-anh-kts': { sheet: 1, col: 0, row: 2 },
  'boardgame-cafe-chien-thuat': { sheet: 1, col: 1, row: 2 },
  'workshop-lam-nen-to-tuong': { sheet: 1, col: 1, row: 2 },
  'nha-sach-dem-tang-sach-mu': { sheet: 1, col: 1, row: 2 },
  'bida-lo-giai-tri': { sheet: 1, col: 2, row: 2 },

  // Sheet 2 (3x3)
  'rap-phim-suat-dem': { sheet: 2, col: 0, row: 0 },
  'xem-hai-doc-thoai-hoac-kich-dem': { sheet: 2, col: 0, row: 0 },
  'khu-arcade-gap-thu': { sheet: 2, col: 1, row: 0 },
  'karaoke-box-han-quoc': { sheet: 2, col: 1, row: 0 },
  'xien-nuong-bia-thu-cong-via-he': { sheet: 2, col: 2, row: 0 },
  'nuong-han-quoc-hoac-bbq-ngoai-troi': { sheet: 2, col: 2, row: 0 },
  'dimsum-pho-nguoi-hoa': { sheet: 2, col: 2, row: 0 },
  'cafe-boi-tarot': { sheet: 2, col: 0, row: 1 },
  'lau-mini-hoac-mi-cay': { sheet: 2, col: 1, row: 1 },
  'che-mam-sua-dau-nanh': { sheet: 2, col: 1, row: 1 },
  'di-an-kem-gelato-thu-cong': { sheet: 2, col: 1, row: 1 },
  'hidden-speakeasy-bar': { sheet: 2, col: 2, row: 1 },
  'bia-thu-cong-craft-beer-chill': { sheet: 2, col: 2, row: 1 },
  'bowling-hoac-ban-cung': { sheet: 2, col: 0, row: 2 },
  'picnic-mini-bo-song-dem': { sheet: 2, col: 1, row: 2 },
  'glamping-hoac-staycation-bat-chot': { sheet: 2, col: 1, row: 2 },
  'xach-xe-di-tron-ngay-trong-dem': { sheet: 2, col: 1, row: 2 },
  'rooftop-skybar-ngam-toan-thanh-pho': { sheet: 2, col: 2, row: 2 },
  'bus-2-tang-hoac-waterbus-dem': { sheet: 2, col: 2, row: 2 },
  'tau-hoa-dem-hoac-ngam-may-bay': { sheet: 2, col: 2, row: 2 },
};

export const THEME_BAG_QUADRANT: Record<ThemeId, { x: string; y: string }> = {
  blindbox: { x: '0%', y: '0%' },
  saigon_retro: { x: '100%', y: '0%' },
  tarot_night: { x: '0%', y: '100%' },
  city_pop: { x: '100%', y: '100%' },
};

export function getCardSpriteStyle(cardId: string): React.CSSProperties {
  const mapping = CARD_SPRITE_MAP[cardId] || {
    sheet: ((cardId.length % 2) + 1) as 1 | 2,
    col: (cardId.length % 3) as 0 | 1 | 2,
    row: ((cardId.charCodeAt(0) || 0) % 3) as 0 | 1 | 2,
  };

  const posX = mapping.col === 0 ? '0%' : mapping.col === 1 ? '50%' : '100%';
  const posY = mapping.row === 0 ? '0%' : mapping.row === 1 ? '50%' : '100%';

  return {
    backgroundImage: `url(/art/hangouts-sheet-${mapping.sheet}.png)`,
    backgroundSize: '300% 300%',
    backgroundPosition: `${posX} ${posY}`,
    backgroundRepeat: 'no-repeat',
  };
}

interface CardArtworkProps {
  card: HangoutCard;
  size?: 'sm' | 'md' | 'lg';
  locked?: boolean;
  className?: string;
}

export const CardArtwork: React.FC<CardArtworkProps> = ({
  card,
  size = 'md',
  locked = false,
  className = '',
}) => {
  const rarityInfo = RARITY_CONFIG[card.rarity as RarityTier];
  const spriteStyle = getCardSpriteStyle(card.id);

  return (
    <div
      className={`relative overflow-hidden select-none bg-slate-900 ${className}`}
      style={{
        boxShadow: locked ? undefined : `inset 0 0 28px ${rarityInfo.borderGlow}`,
      }}
    >
      {/* Pop-Mart 3D Illustrated Sprite Layer */}
      <div
        className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${
          locked ? 'brightness-[0.18] contrast-150 saturate-0 blur-[1px]' : ''
        }`}
        style={spriteStyle}
      />

      {/* Holographic Foil Rainbow Shimmer for SR / Secret / Mega */}
      {!locked && (card.rarity === 'sr' || card.rarity === 'secret' || card.rarity === 'mega') && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-color-dodge opacity-40 animate-shimmer"
          style={{
            backgroundImage:
              'linear-gradient(125deg, transparent 15%, rgba(255, 0, 128, 0.45) 35%, rgba(0, 242, 254, 0.5) 50%, rgba(250, 204, 21, 0.45) 65%, transparent 85%)',
            backgroundSize: '250% 250%',
          }}
        />
      )}

      {/* Vignette & Floating Corner Emoji Stamp */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />

      {locked ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
          <span className="text-3xl sm:text-4xl mb-1">❓</span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
            TÚI MÙ
          </span>
        </div>
      ) : (
        <div
          className={`absolute bottom-2 right-2 rounded-2xl bg-black/55 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg ${
            size === 'lg'
              ? 'w-12 h-12 text-2xl'
              : size === 'md'
              ? 'w-9 h-9 text-lg'
              : 'w-7 h-7 text-sm'
          }`}
        >
          {card.emoji}
        </div>
      )}
    </div>
  );
};
