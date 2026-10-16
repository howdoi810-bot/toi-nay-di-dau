export type RarityKey = "common" | "rare" | "epic" | "legendary" | "mythic";

export interface RarityTier {
  key: RarityKey;
  badge: string;
  title: string;
  subtitle: string;
  color: string;
  glow: string;
  bgGradient: string;
  weight: number;
}

export const RARITY_TIERS: Record<RarityKey, RarityTier> = {
  common: {
    key: "common",
    badge: "THƯỜNG",
    title: "Phàm Nhân Trúng Gió",
    subtitle: "Xui sương sương • Cấp độ Nhập Môn",
    color: "#94A3B8",
    glow: "rgba(148, 163, 184, 0.35)",
    bgGradient: "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))",
    weight: 30,
  },
  rare: {
    key: "rare",
    badge: "HIẾM",
    title: "Đạo Hữu Xu Cà Na",
    subtitle: "Bước chân trái ra đường • Cấp độ Trúc Cơ",
    color: "#2DD4BF",
    glow: "rgba(45, 212, 191, 0.45)",
    bgGradient: "linear-gradient(135deg, rgba(19,78,74,0.85), rgba(15,23,42,0.95))",
    weight: 32,
  },
  epic: {
    key: "epic",
    badge: "SỬ THI",
    title: "Chân Nhân Nghiệp Tụ",
    subtitle: "Nghiệp quật không trượt phát nào • Cấp Kim Đan",
    color: "#C084FC",
    glow: "rgba(192, 132, 252, 0.5)",
    bgGradient: "linear-gradient(135deg, rgba(88,28,135,0.85), rgba(15,23,42,0.95))",
    weight: 22,
  },
  legendary: {
    key: "legendary",
    badge: "HUYỀN THOẠI",
    title: "Độ Kiếp Kỳ Tổ Độ",
    subtitle: "9 tầng mây gọi tên • Cấp Nguyên Anh",
    color: "#F43F5E",
    glow: "rgba(244, 63, 94, 0.55)",
    bgGradient: "linear-gradient(135deg, rgba(136,19,55,0.9), rgba(15,23,42,0.95))",
    weight: 11,
  },
  mythic: {
    key: "mythic",
    badge: "THIÊN ĐỊNH",
    title: "Thiên Định Tế Thần",
    subtitle: "Vạn người có một • Thánh Nhọ Tối Thượng",
    color: "#FACC15",
    glow: "rgba(250, 204, 21, 0.65)",
    bgGradient: "linear-gradient(135deg, rgba(113,63,18,0.92), rgba(24,16,8,0.98))",
    weight: 5,
  },
};

export type ArenaMode = "lightning" | "reel" | "bomb";

export interface KeoPreset {
  id: string;
  label: string;
  shortLabel: string;
  emoji: string;
  timeRangeLabel: string;
  description: string;
  actionButtonText: string;
  supportsBillSplit?: boolean;
  defaultBillAmount?: number;
  verdicts: string[];
}

export const KEO_PRESETS: KeoPreset[] = [
  {
    id: "trasua",
    label: "Xuống Sảnh Rước Trà Sữa / Shipper",
    shortLabel: "Rước Trà Sữa",
    emoji: "🧋",
    timeRangeLabel: "Khung giờ vàng 13:30 – 17:30",
    description:
      "Shipper đã gọi cuộc nhỡ thứ 2 dưới sảnh nắng chang chang. Để Thiên Lôi chỉ định đạo hữu nào phải đứng dậy mang giày!",
    actionButtonText: "Xách dép xuống sảnh ngay",
    verdicts: [
      "Shipper đang đứng dưới gốc cây nhìn lên tầng mình. Đạo hữu mau xỏ dép chạy xuống trước khi đá tan thành nước lọc!",
      "Hưởng thụ trà sữa thì nhanh mà xuống lấy thì đùn đẩy! Thiên Đình phán: Cầm điện thoại xuống sảnh rước 10 ly lên ngay!",
      "Vận khí hôm nay thuộc hệ Chạy Việc. Đi bộ 200m xuống sảnh vừa tiêu mỡ bụng vừa tích công đức cho cả phòng!",
    ],
  },
  {
    id: "tratien",
    label: "Chủ Chi / Chia Bill Nhân Phẩm",
    shortLabel: "Chia Bill / Trả Tiền",
    emoji: "💸",
    timeRangeLabel: "Khung giờ ăn trưa & tụ tập",
    description:
      "Hoá đơn đã lên bàn! Chọn 1 Chủ Chi gánh trọn hoặc bật chế độ 'Chia Bill Theo Độ Nghiệp' để Thiên Lôi phân bổ số tiền phải trả.",
    actionButtonText: "Mở app ngân hàng quét QR",
    supportsBillSplit: true,
    defaultBillAmount: 300000,
    verdicts: [
      "Ví tiền của đạo hữu vừa phát sáng lấp lánh trên radar của Thiên Lôi! Tiền đi thay người, phúc lộc đầy nhà!",
      "Cả nhóm ăn uống no say, riêng đạo hữu nhận vinh dự Chủ Xị Độ Kiếp hôm nay. Mở app ngân hàng không nói nhiều!",
      "Thần Giữ Của vừa ngủ quên 3 giây và cái kết: Hoá đơn này chính thức khắc tên đạo hữu!",
    ],
  },
  {
    id: "caphe",
    label: "Gom Đơn / Pha Cà Phê Sáng",
    shortLabel: "Cà Phê Sáng",
    emoji: "☕",
    timeRangeLabel: "Khung giờ 06:00 – 11:00",
    description:
      "Cả phòng đang ngáp ngắn ngáp dài thiếu tỉnh táo. Ai là người đứng ra gom đơn hoặc đi lấy cà phê cứu rỗi anh em?",
    actionButtonText: "Đi gom đơn cà phê",
    verdicts: [
      "Cả văn phòng đang chờ một vị cứu tinh mang caffeine về bản. Đạo hữu chính là người được chọn!",
      "Thiên Lôi thấy đạo hữu tỉnh táo nhất đám nên giao trọng trách cao cả: Đi lấy cà phê cho đồng bọn!",
    ],
  },
  {
    id: "banhau",
    label: "Uống Ly Phạt / Tới Bến Bàn Nhậu",
    shortLabel: "Ly Phạt Bàn Nhậu",
    emoji: "🍻",
    timeRangeLabel: "Khung giờ 17:30 – 02:00",
    description:
      "Ngồi trên bàn nhậu chỉ tay năm ngón làm gì! Bấm nút để Thiên Đình chỉ định ai phải uống cạn ly phạt tiếp theo.",
    actionButtonText: "1, 2, 3 DÔ 100%!",
    verdicts: [
      "Không trình bày nhiều! Cầm ly lên 100% không chừa giọt nào dưới sự chứng giám của hội đồng bô lão!",
      "Tửu lượng cao hay thấp không quan trọng, quan trọng là Nhân Phẩm vừa gọi thẳng tên đạo hữu!",
      "Vừa định trốn đi WC đúng lúc sét đánh trúng đầu! Uống cạn ly này rồi tính tiếp!",
    ],
  },
  {
    id: "dondep",
    label: "Rửa Bát / Dọn Bàn / Đổ Rác",
    shortLabel: "Rửa Bát Dọn Bàn",
    emoji: "🧹",
    timeRangeLabel: "Mọi khung giờ",
    description:
      "Ăn xong ai cũng hóa đá bấm điện thoại. Để Đài Độ Kiếp phân xử xem ai phải đứng dậy dọn bãi chiến trường!",
    actionButtonText: "Đeo găng tay vào bếp",
    verdicts: [
      "Lúc ăn thì gắp nhanh như chớp, lúc dọn thì Thiên Lôi không bỏ sót! Mời đạo hữu đeo tạp dề vào việc!",
      "Nước rửa chén Sunlight đang vẫy gọi tên đạo hữu. Dọn sạch bóng rồi mới được nằm lướt TikTok tiếp!",
    ],
  },
  {
    id: "ganhteam",
    label: "Đại Diện Thuyết Trình / Báo Cáo Sếp",
    shortLabel: "Gánh Team Báo Cáo",
    emoji: "🎤",
    timeRangeLabel: "Giờ họp hành & deadline",
    description:
      "Sếp hỏi 'Nhóm này ai lên trình bày?' — Nhường qua nhường lại mất thời gian, để Thiên Lôi chọn người gánh team!",
    actionButtonText: "Bật mic lên sân khấu",
    verdicts: [
      "Hào quang nhân vật chính đã chiếu thẳng vào mặt đạo hữu! Cầm mic bước lên gánh team thôi!",
      "Né sao khỏi nắng! Sếp đang nhìn kìa, đạo hữu chuẩn bị tinh thần mở slide đầu tiên ngay!",
    ],
  },
];

export interface SavedSquad {
  id: string;
  name: string;
  emoji: string;
  members: string[];
}

export const DEFAULT_SQUADS: SavedSquad[] = [
  {
    id: "trasua-t5",
    name: "Hội Trà Sữa Tầng 5",
    emoji: "🧋",
    members: ["Minh", "Lan", "Tuấn", "Hương", "Đạt", "Trang"],
  },
  {
    id: "ban-nhau",
    name: "Chiến Thần Bàn Nhậu",
    emoji: "🍻",
    members: ["Hùng", "Dũng", "Khoa", "Linh", "Phúc"],
  },
  {
    id: "phong-tro",
    name: "Phòng Trọ Bất Ổn",
    emoji: "🏠",
    members: ["An", "Bình", "Châu", "Dương"],
  },
  {
    id: "deadline-team",
    name: "Team Deadline Công Sở",
    emoji: "💼",
    members: ["Sếp Tùng", "Vy", "Khánh", "My", "Nam", "Thảo"],
  },
];

export const CASTER_DODGE_LINES: string[] = [
  "⚡ {name} vừa bật Khiên Mặt Dày phản tia sét sang đứa bên cạnh!",
  "🛡️ {name} niệm thần chú 'Em đang bận họp' và né thành công 1 kiếp nạn!",
  "💨 {name} giả vờ cúi xuống buộc dây giày đúng lúc Thiên Lôi bổ búa!",
  "✨ {name} đốt 1 lá Bùa Hộ Mệnh Cuối Tháng, lôi điện sượt qua tóc mái!",
  "🦊 {name} lùi nhẹ 1 bước chân, âm thầm đẩy đồng đội ra hứng đạn!",
  "🌀 {name} tung chiêu 'Mạng nhà em bị lag' làm Thiên Lôi mất dấu GPS!",
];

export const CASTER_STRIKE_LINES: string[] = [
  "💥 BÙM! {name} cười hơi sớm và bị sét đánh cháy sém lông mày!",
  "⚡ Thiên Lôi vừa khóa mục tiêu 4K HDR thẳng vào đỉnh đầu {name}!",
  "🌩️ Nghiệp tụ vành môi! {name} trúng 1 đạo Thiên Lôi 9999 sát thương!",
  "🔥 Không trượt phát nào! {name} vừa bị lôi điện hút dính xuống sàn!",
  "⚠️ Báo động đỏ! Nhân phẩm của {name} đang tụt dốc không phanh!",
];

export const CASTER_FAKEOUT_LINES: string[] = [
  "😱 KHOAN ĐÃ! Tia sét cuối cùng đột ngột bẻ lái 180 độ trên không trung!",
  "⚡ ĐẢO CHIỀU PHÚT 90! Thiên Lôi đổi ý vào giây cuối cùng!",
  "🌪️ BIẾN CỐ ĐỘT NGỘT! Kim Bài Miễn Tử vừa kích hoạt đẩy tia sét sang người khác!",
];

export interface BankOption {
  bin: string;
  shortName: string;
  name: string;
}

export const VIETQR_BANKS: BankOption[] = [
  { bin: "VCB", shortName: "Vietcombank", name: "Ngân hàng TMCP Ngoại thương Việt Nam" },
  { bin: "MB", shortName: "MBBank", name: "Ngân hàng TMCP Quân Đội" },
  { bin: "TCB", shortName: "Techcombank", name: "Ngân hàng TMCP Kỹ thương Việt Nam" },
  { bin: "ACB", shortName: "ACB", name: "Ngân hàng TMCP Á Châu" },
  { bin: "BIDV", shortName: "BIDV", name: "Ngân hàng TMCP Đầu tư và Phát triển VN" },
  { bin: "ICB", shortName: "VietinBank", name: "Ngân hàng TMCP Công thương Việt Nam" },
  { bin: "VPB", shortName: "VPBank", name: "Ngân hàng TMCP Việt Nam Thịnh Vượng" },
  { bin: "TPB", shortName: "TPBank", name: "Ngân hàng TMCP Tiên Phong" },
];

export function getAutoKeoByHour(hour: number): string {
  if (hour >= 6 && hour < 11) return "caphe";
  if (hour >= 11 && hour < 13) return "tratien";
  if (hour >= 13 && hour < 17) return "trasua";
  if (hour >= 17 || hour < 2) return "banhau";
  return "trasua";
}
