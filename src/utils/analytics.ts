const NAMESPACE = 'toinaydidau-howdoi810';
const API_BASE = `https://abacus.jasoncameron.dev`;
const GA_STORAGE_KEY = 'toinaydidau_ga4_id';

export type TrafficSource = 'threads' | 'tiktok' | 'fb' | 'zalo' | 'direct';

export interface GlobalStatsSnapshot {
  totalViews: number;
  bagsRipped: number;
  cardsShared: number;
  mapsClicked: number;
  sources: {
    threads: number;
    tiktok: number;
    fb: number;
    zalo: number;
    direct: number;
  };
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function detectTrafficSource(): TrafficSource {
  if (typeof window === 'undefined') return 'direct';
  const params = new URLSearchParams(window.location.search);
  const refParam = (
    params.get('ref') ||
    params.get('utm_source') ||
    params.get('source') ||
    ''
  ).toLowerCase();

  if (refParam.includes('thread')) return 'threads';
  if (refParam.includes('tiktok') || refParam.includes('tt')) return 'tiktok';
  if (refParam.includes('fb') || refParam.includes('facebook') || refParam.includes('ig')) return 'fb';
  if (refParam.includes('zalo')) return 'zalo';

  const referrer = (document.referrer || '').toLowerCase();
  if (referrer.includes('threads.net') || referrer.includes('threads.com')) return 'threads';
  if (referrer.includes('tiktok.com')) return 'tiktok';
  if (
    referrer.includes('facebook.com') ||
    referrer.includes('fb.com') ||
    referrer.includes('messenger.com') ||
    referrer.includes('instagram.com')
  ) {
    return 'fb';
  }
  if (referrer.includes('zalo.me') || referrer.includes('chat.zalo.me')) return 'zalo';

  return 'direct';
}

async function hitKey(key: string): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/hit/${NAMESPACE}/${key}`);
    if (!res.ok) return 0;
    const data = (await res.json()) as { value?: number };
    return typeof data.value === 'number' ? data.value : 0;
  } catch {
    return 0;
  }
}

async function getKey(key: string): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/get/${NAMESPACE}/${key}`);
    if (!res.ok) return 0;
    const data = (await res.json()) as { value?: number };
    return typeof data.value === 'number' ? data.value : 0;
  } catch {
    return 0;
  }
}

export function getSavedGa4Id(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(GA_STORAGE_KEY) || '';
}

export function saveAndInitGa4(measurementId: string): void {
  if (typeof window === 'undefined') return;
  const cleanId = measurementId.trim().toUpperCase();
  window.localStorage.setItem(GA_STORAGE_KEY, cleanId);
  if (!cleanId.startsWith('G-')) return;

  if (!document.getElementById('ga4-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', cleanId);
  }
}

export function sendGaEvent(eventName: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

let sessionTracked = false;

export async function recordPageVisit(): Promise<{ views: number; bags: number }> {
  const savedGa = getSavedGa4Id();
  if (savedGa) {
    saveAndInitGa4(savedGa);
  }

  if (sessionTracked) {
    const [views, bags] = await Promise.all([getKey('total_views'), getKey('bags_ripped')]);
    return { views, bags };
  }
  sessionTracked = true;

  const source = detectTrafficSource();
  sendGaEvent('page_visit_source', { traffic_source: source });

  const [views, bags] = await Promise.all([
    hitKey('total_views'),
    getKey('bags_ripped'),
    hitKey(`src_${source}`),
  ]);

  return { views, bags };
}

export async function recordBagRip(count: number, rarity: string, wishMatched: boolean): Promise<number> {
  sendGaEvent('unbox_blind_bag', {
    bag_count: count,
    rarity,
    wish_matched: wishMatched,
  });

  // Hit the global bags_ripped counter
  let latest = await hitKey('bags_ripped');
  if (count > 1) {
    // Also increment for combo bags
    latest = await hitKey('bags_ripped');
    latest = await hitKey('bags_ripped');
  }
  return latest;
}

export async function recordCardShare(method: 'download_png' | 'copy_zalo', cardId: string): Promise<void> {
  sendGaEvent('share_card', { method, card_id: cardId });
  await hitKey('cards_shared');
}

export async function recordMapsClick(cardId: string, city: string): Promise<void> {
  sendGaEvent('click_google_maps', { card_id: cardId, city });
  await hitKey('maps_clicked');
}

export async function fetchAllGlobalStats(): Promise<GlobalStatsSnapshot> {
  const [
    totalViews,
    bagsRipped,
    cardsShared,
    mapsClicked,
    threads,
    tiktok,
    fb,
    zalo,
    direct,
  ] = await Promise.all([
    getKey('total_views'),
    getKey('bags_ripped'),
    getKey('cards_shared'),
    getKey('maps_clicked'),
    getKey('src_threads'),
    getKey('src_tiktok'),
    getKey('src_fb'),
    getKey('src_zalo'),
    getKey('src_direct'),
  ]);

  return {
    totalViews,
    bagsRipped,
    cardsShared,
    mapsClicked,
    sources: {
      threads,
      tiktok,
      fb,
      zalo,
      direct,
    },
  };
}
