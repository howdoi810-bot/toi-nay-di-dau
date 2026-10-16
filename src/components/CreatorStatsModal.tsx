import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Copy,
  Check,
  RefreshCw,
  Eye,
  PackageOpen,
  Share2,
  MapPin,
  X,
  Link2,
  Activity,
} from 'lucide-react';
import {
  fetchAllGlobalStats,
  getSavedGa4Id,
  GlobalStatsSnapshot,
  saveAndInitGa4,
} from '../utils/analytics';

interface CreatorStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalBagsRipped: number;
}

const PUBLIC_BASE_URL = 'https://howdoi810-bot.github.io/toi-nay-di-dau/';

const CAMPAIGN_LINKS = [
  {
    id: 'threads',
    label: 'Threads',
    emoji: '🧵',
    color: '#ffffff',
    url: `${PUBLIC_BASE_URL}?ref=threads`,
  },
  {
    id: 'tiktok',
    label: 'TikTok Bio / Comment',
    emoji: '🎵',
    color: '#2dd4bf',
    url: `${PUBLIC_BASE_URL}?ref=tiktok`,
  },
  {
    id: 'fb',
    label: 'Facebook / IG Story',
    emoji: '📘',
    color: '#38bdf8',
    url: `${PUBLIC_BASE_URL}?ref=fb`,
  },
  {
    id: 'zalo',
    label: 'Zalo Group',
    emoji: '💬',
    color: '#60a5fa',
    url: `${PUBLIC_BASE_URL}?ref=zalo`,
  },
];

export const CreatorStatsModal: React.FC<CreatorStatsModalProps> = ({
  isOpen,
  onClose,
  personalBagsRipped,
}) => {
  const [stats, setStats] = useState<GlobalStatsSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [gaId, setGaId] = useState(() => getSavedGa4Id());
  const [gaSaved, setGaSaved] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    const snapshot = await fetchAllGlobalStats();
    setStats(snapshot);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSourceHits = stats
    ? Math.max(
        1,
        stats.sources.threads +
          stats.sources.tiktok +
          stats.sources.fb +
          stats.sources.zalo +
          stats.sources.direct
      )
    : 1;

  const handleCopyUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
    } catch {
      // Ignore
    }
  };

  const handleSaveGa = (e: React.FormEvent) => {
    e.preventDefault();
    saveAndInitGa4(gaId);
    setGaSaved(true);
    setTimeout(() => setGaSaved(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-stats-title"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-white/20 p-5 sm:p-6 text-white shadow-2xl my-auto max-h-[92vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng bảng thống kê"
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="creator-stats-title" className="font-display text-xl text-white">
                Creator Live Traffic & Viral Stats
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Số liệu toàn cầu theo thời gian thực • Bookmark link:{' '}
              <code className="text-pink-300">?stats=1</code>
            </p>
          </div>
        </div>

        {/* 4 Live KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Lượt Truy Cập</span>
              <Eye className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-white mt-1">
              {loading && !stats ? '...' : (stats?.totalViews ?? 1).toLocaleString('vi-VN')}
            </div>
            <span className="text-[10px] text-cyan-300">Toàn bộ người xem</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Túi Đã Xé</span>
              <PackageOpen className="w-4 h-4 text-pink-400" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-pink-300 mt-1">
              {loading && !stats
                ? '...'
                : Math.max(stats?.bagsRipped ?? 0, personalBagsRipped).toLocaleString('vi-VN')}
            </div>
            <span className="text-[10px] text-slate-400">Bạn xé: {personalBagsRipped}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Chốt Kèo / Share</span>
              <Share2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-amber-300 mt-1">
              {loading && !stats ? '...' : (stats?.cardsShared ?? 0).toLocaleString('vi-VN')}
            </div>
            <span className="text-[10px] text-amber-200/80">Tải ảnh + Copy Zalo</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Mở Google Maps</span>
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-emerald-300 mt-1">
              {loading && !stats ? '...' : (stats?.mapsClicked ?? 0).toLocaleString('vi-VN')}
            </div>
            <span className="text-[10px] text-emerald-200/80">Đi thật ngoài đời</span>
          </div>
        </div>

        {/* Traffic Sources Breakdown (Threads vs TikTok vs FB vs Zalo) */}
        <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-pink-400" />
              <span>Nguồn Traffic (Threads · TikTok · Facebook · Zalo)</span>
            </span>

            <button
              type="button"
              onClick={loadStats}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-cyan-300 flex items-center gap-1 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              {
                key: 'threads',
                label: '🧵 Threads',
                val: stats?.sources.threads ?? 0,
                bar: 'bg-pink-500',
              },
              {
                key: 'tiktok',
                label: '🎵 TikTok',
                val: stats?.sources.tiktok ?? 0,
                bar: 'bg-teal-400',
              },
              {
                key: 'fb',
                label: '📘 Facebook / IG',
                val: stats?.sources.fb ?? 0,
                bar: 'bg-sky-400',
              },
              {
                key: 'zalo',
                label: '💬 Zalo',
                val: stats?.sources.zalo ?? 0,
                bar: 'bg-blue-500',
              },
              {
                key: 'direct',
                label: '🌐 Trực tiếp / Khác',
                val: stats?.sources.direct ?? 0,
                bar: 'bg-purple-400',
              },
            ].map((item) => {
              const pct = Math.round((item.val / totalSourceHits) * 100);
              return (
                <div key={item.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{item.label}</span>
                    <span className="font-mono text-slate-300">
                      <strong>{item.val}</strong> lượt ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.bar}`}
                      style={{ width: `${Math.max(pct, item.val > 0 ? 6 : 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1-Click Viral Tracking Link Generator */}
        <div className="mt-4 p-4 rounded-2xl bg-pink-500/10 border border-pink-400/30 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-200">
            <Link2 className="w-4 h-4 text-pink-400" />
            <span>Link Đi Viral Tự Động Phân Loại Nguồn (Copy để gắn Bio / Bài Đăng):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CAMPAIGN_LINKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCopyUrl(item.id, item.url)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 text-left transition group"
              >
                <div className="truncate pr-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{item.emoji}</span>
                    <span>Link cho {item.label}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                    {item.url}
                  </div>
                </div>
                <div className="shrink-0 px-2.5 py-1 rounded-lg bg-white/10 group-hover:bg-white/20 text-xs font-bold flex items-center gap-1">
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Đã Copy</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Copy</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Google Analytics 4 (GA4) Measurement ID Input */}
        <form
          onSubmit={handleSaveGa}
          className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2"
        >
          <div className="text-xs">
            <strong className="text-white block">Google Analytics 4 (Tùy chọn):</strong>
            <span className="text-slate-400 text-[11px]">
              Dán mã <code className="text-amber-300">G-XXXXXXXXXX</code> nếu muốn kết nối thêm GA4
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 text-xs font-mono text-white w-36 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition"
            >
              {gaSaved ? '✓ Đã Lưu' : 'Kết nối'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
