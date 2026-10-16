import { CITY_OPTIONS, RARITY_CONFIG } from '../data/themes';
import { CityPreset, UnboxResult } from '../types/hangout';

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export async function generateShareCardDataUrl(
  result: UnboxResult,
  city: CityPreset
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const card = result.primaryCard;
  const rarityInfo = RARITY_CONFIG[card.rarity];
  const cityLabel = CITY_OPTIONS.find((c) => c.id === city)?.short || 'Toàn quốc';
  const spots = card.citySpots[city] || card.citySpots.any;

  // 1. Background Deep Night Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1480);
  bgGrad.addColorStop(0, '#0d081d');
  bgGrad.addColorStop(0.5, '#1b1138');
  bgGrad.addColorStop(1, '#090614');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1480);

  // Decorative Glow Orbs
  const glow = ctx.createRadialGradient(540, 380, 30, 540, 380, 480);
  glow.addColorStop(0, rarityInfo.borderGlow);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1480);

  // 2. Outer Collectible Card Frame
  ctx.strokeStyle = rarityInfo.color;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(54, 54, 972, 1372, 42);
  ctx.stroke();

  ctx.fillStyle = 'rgba(20, 14, 42, 0.88)';
  ctx.beginPath();
  ctx.roundRect(66, 66, 948, 1348, 36);
  ctx.fill();

  // 3. Top Header Pill ("BẢN CAM KẾT CHỐT KÈO TÚI MÙ")
  ctx.fillStyle = rarityInfo.bgBadge;
  ctx.beginPath();
  ctx.roundRect(110, 110, 860, 74, 37);
  ctx.fill();

  ctx.fillStyle = rarityInfo.color;
  ctx.font = 'bold 28px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `🎁 THẺ CHỐT KÈO TỐI NAY • ĐỘ HIẾM: ${rarityInfo.label} (${rarityInfo.viLabel})`,
    540,
    157
  );

  // Wish Match Banner if triggered
  if (result.wishMatched) {
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.roundRect(270, 204, 540, 52, 26);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Be Vietnam Pro", sans-serif';
    ctx.fillText('🎉 ĐÃ TRÚNG NGUYỆN VỌNG ĐÊM NAY! 🎉', 540, 238);
  }

  // 4. Center Emoji Badge
  ctx.font = '130px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(card.emoji, 540, 395);

  // 5. Card Title & Subtitle
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 50px "Be Vietnam Pro", sans-serif';
  let cursorY = wrapText(ctx, card.title.toUpperCase(), 540, 475, 840, 64);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 30px "Be Vietnam Pro", sans-serif';
  cursorY = wrapText(ctx, card.subtitle, 540, cursorY + 14, 820, 42);

  // 6. Combo 3 Bags Section OR Single Details Box
  if (result.mode === 'combo' && result.tang1Card && result.tang2Card) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(110, cursorY + 20, 860, 230, 28);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`🥢 TĂNG 1 (Ấm bụng): ${result.tang1Card.emoji} ${result.tang1Card.title}`, 145, cursorY + 80);

    ctx.fillStyle = '#f472b6';
    ctx.fillText(`🌙 TĂNG 2 (Đi chill): ${result.tang2Card.emoji} ${result.tang2Card.title}`, 145, cursorY + 145);

    ctx.fillStyle = '#fde047';
    ctx.fillText(`💰 Dự kiến: ${card.priceEstimate} / người • Khu vực: ${cityLabel}`, 145, cursorY + 210);
    cursorY += 280;
  } else {
    // Price & City Spots Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(110, cursorY + 20, 860, 220, 28);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 28px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`💰 Ngân sách dự kiến: ${card.priceEstimate} / người`, 145, cursorY + 75);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`📍 Gợi ý tại ${cityLabel}:`, 145, cursorY + 130);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 25px "Be Vietnam Pro", sans-serif';
    wrapText(ctx, spots.join('  •  '), 145, cursorY + 175, 790, 36);
    cursorY += 270;
  }

  // 7. Twist / Luật Ngầm Box
  ctx.fillStyle = 'rgba(244, 63, 94, 0.14)';
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(110, cursorY + 10, 860, 240, 28);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fda4af';
  ctx.font = 'bold 27px "Be Vietnam Pro", sans-serif';
  ctx.fillText(
    `${result.twistCard.emoji} LUẬT NGẦM ĐÊM NAY: ${result.twistCard.title.toUpperCase()}`,
    145,
    cursorY + 62
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = '500 24px "Be Vietnam Pro", sans-serif';
  const afterDescY = wrapText(ctx, result.twistCard.description, 145, cursorY + 108, 790, 34);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 23px "Be Vietnam Pro", sans-serif';
  wrapText(ctx, `⚠️ Hình phạt: ${result.twistCard.penalty}`, 145, afterDescY + 12, 790, 32);

  // 8. Footer Stamp
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 24px "Be Vietnam Pro", sans-serif';
  ctx.fillText(
    `⏰ Đã khui túi lúc ${result.timestamp} • Bút sa gà chết, cấm bùng kèo!`,
    540,
    1345
  );

  ctx.fillStyle = rarityInfo.color;
  ctx.font = 'bold 22px "Space Grotesk", sans-serif';
  ctx.fillText('TỐI NAY ĐI ĐÂU? — XÉ TÚI MÙ CHỐT KÈO ĐI CHƠI', 540, 1385);

  return canvas.toDataURL('image/png');
}
