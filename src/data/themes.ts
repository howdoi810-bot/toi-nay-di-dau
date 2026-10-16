import { RarityTier, ThemeConfig, ThemeId, VibeWish, GroupType, BudgetTier, CityPreset } from '../types/hangout';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  blindbox: {
    id: 'blindbox',
    name: 'Tiệm Túi Mù',
    shortName: 'Tiệm Túi Mù',
    badge: 'POP-ART SERIES · VOL. 01',
    tagline: 'Chọn nguyện vọng, xé túi mù — Hết cảnh chạy xe vòng vòng hỏi "Tối nay đi đâu?"',
    ctaSingle: 'XÉ 1 TÚI MÙ NGAY',
    ctaCombo: 'XÉ COMBO 3 TÚI (NGUYÊN ĐÊM)',
    bagSeriesTitle: 'NIGHT OUT! BLIND BOX',
    bagEditionTag: 'SECRET RATIO 1:144',
    colors: {
      bgPrimary: '#0f0b1d',
      bgSecondary: '#1b1435',
      cardSurface: 'rgba(30, 22, 58, 0.82)',
      textPrimary: '#fdf8ff',
      textSecondary: '#c4b5fd',
      accentPrimary: '#ff3b9a',
      accentSecondary: '#00f2fe',
      bagGradient: 'linear-gradient(135deg, #ff3b9a 0%, #7928ca 50%, #00d2ff 100%)',
      bagBorder: '#ff85c0',
    },
  },
  saigon_retro: {
    id: 'saigon_retro',
    name: 'Hẻm Đêm Sài Gòn',
    shortName: 'Hẻm Đêm',
    badge: 'ĐÈN NEON & GHẾ NHỰA ĐỎ',
    tagline: 'Lên đồ dạo phố đêm — Xé bao mù tìm kèo vỉa hè tới nóc cùng đồng bọn.',
    ctaSingle: 'KHUI BAO MÙ ĐÊM NAY',
    ctaCombo: 'KHUI NGUYÊN SET TĂNG 1 - 2 - 3',
    bagSeriesTitle: 'HẺM ĐÊM ĐẶC BIỆT',
    bagEditionTag: 'CHÍNH HIỆU VỈA HÈ',
    colors: {
      bgPrimary: '#140c08',
      bgSecondary: '#26150d',
      cardSurface: 'rgba(42, 24, 15, 0.85)',
      textPrimary: '#fff7ed',
      textSecondary: '#fdba74',
      accentPrimary: '#f97316',
      accentSecondary: '#facc15',
      bagGradient: 'linear-gradient(135deg, #dc2626 0%, #ea580c 55%, #facc15 100%)',
      bagBorder: '#fde047',
    },
  },
  tarot_night: {
    id: 'tarot_night',
    name: 'Tiệm Tarot Đêm',
    shortName: 'Tarot Đêm',
    badge: 'TÍN HIỆU TỪ VŨ TRỤ',
    tagline: 'Vũ trụ không để bạn tối nay nằm nhà lướt điện thoại — Hãy rút túi mù định mệnh.',
    ctaSingle: 'KHAI MỞ TÚI ĐỊNH MỆNH',
    ctaCombo: 'TRẢI BÀI 3 TÚI NGUYÊN ĐÊM',
    bagSeriesTitle: 'ARCANA OF THE NIGHT',
    bagEditionTag: 'MYSTIC EDITION',
    colors: {
      bgPrimary: '#070913',
      bgSecondary: '#11162d',
      cardSurface: 'rgba(20, 26, 52, 0.85)',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      accentPrimary: '#eab308',
      accentSecondary: '#a855f7',
      bagGradient: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #ca8a04 100%)',
      bagBorder: '#facc15',
    },
  },
  city_pop: {
    id: 'city_pop',
    name: 'Duyên Đêm City-Pop',
    shortName: 'Duyên Đêm',
    badge: 'TRẠM HẸN HÒ 80s FM',
    tagline: 'Gió đêm mát rượi, nhạc bật vừa tai — Xé túi mù xem tối nay đưa người ấy đi đâu.',
    ctaSingle: 'XÉ TÚI HẸN HÒ NGAY',
    ctaCombo: 'XÉ COMBO HẸN HÒ TRỌN ĐÊM',
    bagSeriesTitle: 'LOVER’S MIDNIGHT FM',
    bagEditionTag: 'ROMANCE COLLECTIBLE',
    colors: {
      bgPrimary: '#13091f',
      bgSecondary: '#241136',
      cardSurface: 'rgba(43, 19, 64, 0.82)',
      textPrimary: '#fff1f2',
      textSecondary: '#fbcfe8',
      accentPrimary: '#fb7185',
      accentSecondary: '#38bdf8',
      bagGradient: 'linear-gradient(135deg, #fb7185 0%, #c084fc 50%, #38bdf8 100%)',
      bagBorder: '#fda4af',
    },
  },
};

export const RARITY_CONFIG: Record<
  RarityTier,
  {
    label: string;
    viLabel: string;
    oddsLabel: string;
    weight: number;
    color: string;
    bgBadge: string;
    borderGlow: string;
    gradient: string;
  }
> = {
  basic: {
    label: 'BASIC',
    viLabel: 'THƯỜNG',
    oddsLabel: '48%',
    weight: 48,
    color: '#94a3b8',
    bgBadge: 'rgba(148, 163, 184, 0.2)',
    borderGlow: 'rgba(148, 163, 184, 0.45)',
    gradient: 'linear-gradient(135deg, #475569 0%, #94a3b8 100%)',
  },
  rare: {
    label: 'RARE',
    viLabel: 'HIẾM',
    oddsLabel: '30%',
    weight: 30,
    color: '#2dd4bf',
    bgBadge: 'rgba(45, 212, 191, 0.2)',
    borderGlow: 'rgba(45, 212, 191, 0.65)',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 50%, #38bdf8 100%)',
  },
  sr: {
    label: 'SUPER RARE',
    viLabel: 'CỰC PHẨM',
    oddsLabel: '15%',
    weight: 15,
    color: '#c084fc',
    bgBadge: 'rgba(192, 132, 252, 0.22)',
    borderGlow: 'rgba(192, 132, 252, 0.75)',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #ec4899 55%, #c084fc 100%)',
  },
  secret: {
    label: 'SECRET',
    viLabel: 'BÍ ẨN',
    oddsLabel: '6%',
    weight: 6,
    color: '#fbbf24',
    bgBadge: 'rgba(251, 191, 36, 0.24)',
    borderGlow: 'rgba(251, 191, 36, 0.85)',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #fde047 100%)',
  },
  mega: {
    label: 'MEGA SECRET 1:144',
    viLabel: 'THẦN THOẠI',
    oddsLabel: '1%',
    weight: 1,
    color: '#f43f5e',
    bgBadge: 'rgba(244, 63, 94, 0.28)',
    borderGlow: 'rgba(244, 63, 94, 0.95)',
    gradient: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 33%, #40e0d0 66%, #7928ca 100%)',
  },
};

export const VIBE_WISHES: { id: VibeWish; label: string; emoji: string; desc: string; color: string }[] = [
  {
    id: 'chill',
    label: 'Chill Chữa Lành',
    emoji: '🌿',
    desc: 'Nhẹ nhàng, hóng gió, tâm sự mỏng',
    color: '#34d399',
  },
  {
    id: 'chaos',
    label: 'Quẩy & Náo Nhiệt',
    emoji: '🔥',
    desc: 'Vận động, cười banh nóc, giải tỏa stress',
    color: '#fb923c',
  },
  {
    id: 'romance',
    label: 'Lãng Mạn Tình Cảm',
    emoji: '💘',
    desc: 'Gắn kết tình cảm, góc tối ấm áp',
    color: '#f472b6',
  },
  {
    id: 'mystic',
    label: 'Độc Lạ Tâm Linh',
    emoji: '🔮',
    desc: 'Bất ngờ, ngẫu hứng, trải nghiệm mới',
    color: '#a78bfa',
  },
];

export const GROUP_OPTIONS: { id: GroupType; label: string; emoji: string }[] = [
  { id: 'all', label: 'Mọi đội hình', emoji: '✨' },
  { id: 'couple', label: 'Cặp đôi / Crush', emoji: '👩‍❤️‍👨' },
  { id: 'friends', label: 'Hội bạn thân', emoji: '🍻' },
  { id: 'solo', label: 'Đi một mình', emoji: '🎧' },
  { id: 'latenight', label: 'Cú đêm (Sau 21h)', emoji: '🦉' },
];

export const BUDGET_OPTIONS: { id: BudgetTier; label: string; desc: string }[] = [
  { id: 50, label: '≤ 50k', desc: 'Cuối tháng rỗng túi · Vẫn vui hết nấc' },
  { id: 150, label: '≤ 150k', desc: 'Vừa tầm sinh viên & dân văn phòng' },
  { id: 350, label: '≤ 350k', desc: 'Lương mới về · Đi chill sang xịn' },
  { id: 999, label: 'Tổng tài', desc: 'Không nhìn giá · Miễn là cháy phố' },
];

export const CITY_OPTIONS: { id: CityPreset; label: string; short: string }[] = [
  { id: 'saigon', label: 'TP.HCM (Sài Gòn)', short: 'Sài Gòn' },
  { id: 'hanoi', label: 'Hà Nội', short: 'Hà Nội' },
  { id: 'danang', label: 'Đà Nẵng', short: 'Đà Nẵng' },
  { id: 'any', label: 'Mọi tỉnh thành', short: 'Toàn quốc' },
];
