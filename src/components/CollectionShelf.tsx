import React, { useState } from 'react';
import { Trophy, PlusCircle, Trash2, X } from 'lucide-react';
import { RARITY_CONFIG, VIBE_WISHES } from '../data/themes';
import {
  BudgetTier,
  CityPreset,
  HangoutCard,
  RarityTier,
  StageKind,
  VibeWish,
} from '../types/hangout';
import { CardArtwork } from './CardArtwork';

interface CollectionShelfProps {
  allCards: HangoutCard[];
  unlockedIds: string[];
  city: CityPreset;
  isCustomModalOpen: boolean;
  onOpenCustomModal: () => void;
  onCloseCustomModal: () => void;
  onAddCustomCard: (card: HangoutCard) => void;
  onDeleteCustomCard: (id: string) => void;
  onInspectCard: (card: HangoutCard) => void;
}

type ShelfFilter = 'all' | 'unlocked' | 'rare_plus' | 'tang1' | 'tang2';

export const CollectionShelf: React.FC<CollectionShelfProps> = ({
  allCards,
  unlockedIds,
  isCustomModalOpen,
  onOpenCustomModal,
  onCloseCustomModal,
  onAddCustomCard,
  onDeleteCustomCard,
  onInspectCard,
}) => {
  const [filter, setFilter] = useState<ShelfFilter>('all');

  // Custom Card Form State
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🍹');
  const [priceEstimate, setPriceEstimate] = useState('50k – 120k');
  const [budgetMax, setBudgetMax] = useState<BudgetTier>(150);
  const [rarity, setRarity] = useState<RarityTier>('sr');
  const [vibe, setVibe] = useState<VibeWish>('chill');
  const [stage, setStage] = useState<StageKind>('tang2');
  const [spotText, setSpotText] = useState('');

  const unlockedSet = new Set(unlockedIds);

  const filteredCards = allCards.filter((card) => {
    switch (filter) {
      case 'unlocked':
        return unlockedSet.has(card.id);
      case 'rare_plus':
        return card.rarity === 'sr' || card.rarity === 'secret' || card.rarity === 'mega';
      case 'tang1':
        return card.stage === 'tang1' || card.stage === 'both';
      case 'tang2':
        return card.stage === 'tang2' || card.stage === 'both';
      default:
        return true;
    }
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const spotList = spotText.trim()
      ? spotText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : ['Quán tủ của hội mình'];

    const newCard: HangoutCard = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      subtitle: 'Kèo tự tạo trong hộp mù',
      category: 'Tự Tạo',
      stage,
      rarity,
      priceEstimate: priceEstimate.trim() || '50k – 150k',
      budgetMax,
      groups: ['all', 'couple', 'friends', 'solo', 'latenight'],
      vibe,
      emoji: emoji.trim() || '🌟',
      oracleQuote: 'Kèo độc quyền do chính bạn bỏ vào túi mù!',
      proTip: 'Đã rút trúng kèo tự tạo là phải đi ngay tối nay!',
      mapQuery: `${title.trim()} ${spotList[0]}`,
      citySpots: {
        saigon: spotList,
        hanoi: spotList,
        danang: spotList,
        any: spotList,
      },
      isCustom: true,
    };

    onAddCustomCard(newCard);
    setTitle('');
    setSpotText('');
    onCloseCustomModal();
  };

  return (
    <section
      id="collection-shelf"
      aria-labelledby="shelf-heading"
      className="w-full max-w-5xl mx-auto px-3 mt-8 mb-14 select-none"
    >
      {/* Compact Visual Header & Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 id="shelf-heading" className="font-display text-lg sm:text-xl text-white">
            KỆ TRƯNG BÀY ({unlockedIds.length}/{allCards.length})
          </h2>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'unlocked', label: `Đã mở (${unlockedIds.length})` },
            { id: 'rare_plus', label: '★ Secret & SR' },
            { id: 'tang1', label: '🥢 Tăng 1' },
            { id: 'tang2', label: '🌙 Tăng 2' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as ShelfFilter)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                filter === tab.id
                  ? 'bg-white text-slate-950 shadow'
                  : 'bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            type="button"
            onClick={onOpenCustomModal}
            className="px-3 py-1 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Tự Tạo</span>
          </button>
        </div>
      </div>

      {/* Visual-First Art-Toy Collector Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredCards.map((card) => {
          const isUnlocked = unlockedSet.has(card.id);
          const rInfo = RARITY_CONFIG[card.rarity];

          return (
            <article
              key={card.id}
              onClick={() => onInspectCard(card)}
              className="group relative rounded-3xl p-1 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden shadow-xl"
              style={{
                background: isUnlocked ? rInfo.gradient : 'rgba(255,255,255,0.12)',
                boxShadow: isUnlocked ? `0 8px 25px -8px ${rInfo.borderGlow}` : undefined,
              }}
            >
              <div className="rounded-[20px] bg-slate-950 overflow-hidden h-full flex flex-col">
                {/* Rarity Badge Overlay */}
                <div className="relative h-36 sm:h-40 w-full overflow-hidden">
                  <CardArtwork
                    card={card}
                    size="sm"
                    locked={!isUnlocked}
                    className="w-full h-full"
                  />

                  <span
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase backdrop-blur-md border"
                    style={{
                      color: '#fff',
                      borderColor: rInfo.color,
                      backgroundColor: 'rgba(15,23,42,0.75)',
                    }}
                  >
                    {rInfo.viLabel}
                  </span>

                  {card.isCustom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomCard(card.id);
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-rose-500/80 text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Minimal Visual Label */}
                <div className="p-2.5 flex flex-col justify-between flex-1 bg-slate-950">
                  <h3 className="text-xs font-bold text-white group-hover:text-pink-300 transition line-clamp-1">
                    {card.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                    <span className="text-amber-300 font-bold">{card.priceEstimate}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Compact Custom Card Modal */}
      {isCustomModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-pink-400/40 p-5 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={onCloseCustomModal}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-lg text-white mb-3">✨ Tự Tạo Túi Mù</h3>

            <form onSubmit={handleCreateCustom} className="space-y-2.5">
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  maxLength={4}
                  className="col-span-1 px-2 py-2 rounded-xl bg-white/5 border border-white/15 text-center text-lg"
                />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tên quán / kèo đi chơi *"
                  className="col-span-3 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value as RarityTier)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white"
                >
                  <option value="basic">THƯỜNG</option>
                  <option value="rare">HIẾM</option>
                  <option value="sr">CỰC PHẨM</option>
                  <option value="secret">SECRET</option>
                  <option value="mega">MEGA 1:144</option>
                </select>

                <select
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value as VibeWish)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white"
                >
                  {VIBE_WISHES.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.emoji} {w.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as StageKind)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white"
                >
                  <option value="tang1">🥢 Tăng 1</option>
                  <option value="tang2">🌙 Tăng 2</option>
                  <option value="both">✨ Cả hai</option>
                </select>

                <select
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value) as BudgetTier)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white"
                >
                  <option value={50}>≤ 50k</option>
                  <option value={150}>≤ 150k</option>
                  <option value={350}>≤ 350k</option>
                  <option value={999}>Tổng tài</option>
                </select>
              </div>

              <input
                type="text"
                value={spotText}
                onChange={(e) => setSpotText(e.target.value)}
                placeholder="Gợi ý khu vực (VD: Thảo Điền, Hồ Tây)"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xs text-white shadow-lg"
              >
                Thêm Vào Hộp Mù
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
