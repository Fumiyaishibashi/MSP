import type { Wish, WishComment } from "../types";
import { v4 as uuidv4 } from "uuid";

/**
 * Demo Wishs Dataset (30 wishes)
 * 位置情報は実際に整理した位置を固定化
 */

// 会社ごとの色マッピング
const getCompanyColor = (companyId: string): string => {
  const colorMap: { [key: string]: string } = {
    mbs_tv: "bg-red-200",
    mbs_radio: "bg-cyan-200",
    mbs_planning: "bg-pink-200",
    broadcast_film: "bg-purple-200",
    mirika_music: "bg-orange-200",
    yami: "bg-slate-400",
    innovation: "bg-green-200",
    toromi: "bg-indigo-200",
    hinata_life: "bg-yellow-200",
    appland: "bg-blue-200",
    mbs_anime: "bg-amber-200",
    mbs_goods: "bg-teal-200",
    gaora: "bg-sky-200",
    facilities: "bg-rose-100",
    picori: "bg-fuchsia-200",
    mbs_live: "bg-lime-200",
    upland: "bg-red-300",
    mg_sports: "bg-emerald-200",
    zipang: "bg-violet-200",
    vogaro: "bg-rose-300",
  };
  return colorMap[companyId] || "bg-gray-200";
};

const createWish = (
  overrides: Partial<Wish> & {
    id?: string; // 固定IDを指定可能にする
    title: string;
    description: string;
    author: string;
    companyId: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }
): Wish => {
  const now = new Date();
  const companyColor = getCompanyColor(overrides.companyId);

  const baseWish: Wish = {
    id: overrides.id || `wish_${uuidv4()}`,
    title: overrides.title,
    description: overrides.description,
    keywords: overrides.keywords || [],
    author: overrides.author,
    companyId: overrides.companyId,
    createdAt: overrides.createdAt || now,
    position: overrides.position,
    size: overrides.size,
    zIndex: Math.floor(Math.random() * 100),
    comments: overrides.comments || [],
    stickyColor: companyColor,
    isPersonalOffer: overrides.isPersonalOffer, // 人材メモフラグ
    avatarImage: overrides.avatarImage, // 写真パス
    isCompanyWish: overrides.isCompanyWish, // 会社メモフラグ
  };
  return baseWish;
};

const createComment = (
  wishId: string,
  authorId: string,
  authorName: string,
  content: string,
  daysAgo: number = 0
): WishComment => ({
  id: `comment_${uuidv4()}`,
  wishId,
  authorId,
  authorName,
  content,
  timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
});

// ========== All Wishes ==========
const allWishes: Wish[] = [];

// Wish 1
const wish1: Wish = createWish({
  id: "wish_c453b01d-c7f0-46f3-935f-6434df23e1ab", // 固定ID
  title: "2026年異業種コラボ音楽フェスを実現したい",
  description:
    "MBSグループの各企業が参加する大規模音楽フェスを開催。ラジオ、テレビ、配信を組み合わせた新しい体験",
  author: "岡田圭太",
  companyId: "mirika_music",
  keywords: ["音楽フェス", "イベント", "異業種コラボ", "ラジオ", "テレビ"],
  position: { x: 48.63154836722883, y: 47.671523287573294 },
  size: { width: 296, height: 228 },
  isCompanyWish: true, // 会社メモ
});
wish1.comments = [
  createComment(
    wish1.id,
    "person_1",
    "山田太郎",
    "テレビ放映を組み合わせることで露出が広がりますね。ぜひやりたい！",
    5
  ),
  createComment(
    wish1.id,
    "person_2",
    "木村康司",
    "ごぶごぶフェスの次ステップになりそう。予算確保していきましょう",
    4
  ),
];
allWishes.push(wish1);

// Wish 2
const wish2: Wish = createWish({
  id: "wish_e64ca208-8298-4427-bc62-ed7bc03ddb93", // 固定ID
  title: "ごぶごぶFES今年は音楽×お笑い",
  description: "去年と差別化した音楽×お笑いFESにしたい",
  author: "木村康司",
  companyId: "mbs_radio",
  keywords: ["音楽", "お笑い", "FES", "イベント"],
  position: { x: 353, y: 30 },
  size: { width: 279, height: 200 },
  isCompanyWish: true, // 会社メモ
});
wish2.comments = [
  createComment(
    wish2.id,
    "person_okada",
    "岡田圭太",
    "ぜひ、今年のFESはミリカ社としても参加させてください",
    4
  ),
  createComment(
    wish2.id,
    "person_nagasawa",
    "長沢健太",
    "あれみたに浜田さんゲスト出演してもらって、食企画放送したいです。その回で完成したものを、FES会場でキッチンカーみたいなフードとして提供したら面白いと思います！",
    3
  ),
  createComment(wish2.id, "person_kimura", "木村康司", "ぜひやりましょう！", 2),
  createComment(
    wish2.id,
    "person_yamazaki",
    "山﨑亜美",
    "食FES開催したいので、協力させてください！キッチンカーの手配してくれる会社知ってます！",
    2
  ),
];
allWishes.push(wish2);

// Wish 3
const wish3: Wish = createWish({
  id: "wish_4a2387e6-7bbe-47cb-ad5b-63a2e9eb4956", // 固定ID
  title: "あれみたで「食」企画",
  description:
    "去年開催したおにぎりが好評。今年は規模大きくしたい。FESで出店？",
  author: "長沢健太",
  companyId: "mbs_tv",
  keywords: ["食", "お笑い", "FES", "キッチンカー"],
  position: { x: 365, y: 250 },
  size: { width: 322, height: 180 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish3);

// Wish 4
const wish4: Wish = createWish({
  title: "VR×イベント連携",
  description: "何かのイベントでVR体験みたいなことをしたい",
  isCompanyWish: true, // 会社メモ
  author: "高野成一",
  companyId: "broadcast_film",
  keywords: ["VR", "配信", "イベント", "体験型"],
  position: { x: 372, y: 538.5 },
  size: { width: 300, height: 220 },
});
allWishes.push(wish4);

// Wish 5
const wish5: Wish = createWish({
  id: "wish_ce481daf-2462-4d27-b665-f42ba4553996", // 固定ID
  title: "食フェスティバルを開きたい",
  description: "はらぺこサーカスみたいなイベントに参加したい",
  author: "山崎亜美",
  companyId: "toromi",
  keywords: ["食", "FES", "イベント"],
  position: { x: 650, y: 44 },
  size: { width: 265, height: 190 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish5);

// Wish 6 - 人材メモ（個人の協力提案）
const wish6: Wish = createWish({
  title: "グッズの制作のお話あれば！！",
  description: "グッズ制作のノウハウがあります！もし気になれば連絡ください！",
  author: "鈴木圭吾",
  companyId: "mbs_goods",
  keywords: ["グッズ", "制作", "イベント"],
  position: { x: 888.7362060546875, y: 332.5145263671875 },
  size: { width: 312, height: 210 },
  isPersonalOffer: true, // 人材メモフラグ
  avatarImage: "/assets/avatar_suzuki_keigo.png", // 写真パス
});
allWishes.push(wish6);

// Wish 7
const wish7: Wish = createWish({
  title: "Vtuberをさまざまな場所で起用したい",
  description:
    "テレビやラジオなどさまざまな場面でうちのVtuberとコラボしませんか？",
  author: "井上隆文",
  companyId: "upland",
  keywords: ["Vtuber", "IT", "イベント", "出演"],
  position: { x: 32.380937093580165, y: 473.7933764027768 },
  size: { width: 304, height: 210 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish7);

// Wish 8
const wish8: Wish = createWish({
  title: "メタバース内で何かイベント開催したい",
  description: "メタバース空間でイベントやFES開催できたら楽しそう",
  author: "伊藤健一",
  companyId: "innovation",
  keywords: ["VR", "IT", "イベント", "メタバース"],
  position: { x: 50, y: 766 },
  size: { width: 292, height: 185 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish8);

// Wish 9
const wish9: Wish = createWish({
  title: "テレビコンテンツの拡大企画",
  description: "テレビをもっと多くの人に届けたい企画です",
  author: "山田太郎",
  companyId: "mbs_tv",
  keywords: ["拡大", "企画", "配信"],
  position: { x: 544, y: 1196 },
  size: { width: 281, height: 160 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish9);

// Wish 10
const wish10: Wish = createWish({
  title: "ラジオ × イベント連携",
  description: "ラジオの特性を活かしたイベント企画を考えています",
  author: "田中花子",
  companyId: "mbs_radio",
  keywords: ["イベント", "連携", "体験"],
  position: { x: 1071, y: 732 },
  size: { width: 280, height: 200 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish10);

// Wish 11
const wish11: Wish = createWish({
  title: "MBS企画グループ制作支援",
  description: "MBS企画の制作に協力します。ノウハウがあります",
  author: "佐藤次郎",
  companyId: "mbs_planning",
  keywords: ["制作", "支援", "ノウハウ"],
  position: { x: 227, y: 997 },
  size: { width: 276, height: 185 },
  isPersonalOffer: true, // 人材メモ
  avatarImage: "/assets/avatar_suzuki_keigo.png",
});
allWishes.push(wish11);

// Wish 12
const wish12: Wish = createWish({
  title: "デジタル化による放送映画推進",
  description: "放送映画をデジタル化することで新しい体験を実現したい",
  author: "鈴木由美",
  companyId: "broadcast_film",
  keywords: ["デジタル", "推進", "体験"],
  position: { x: 1835, y: 858 },
  size: { width: 300, height: 220 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish12);

// Wish 13
const wish13: Wish = createWish({
  title: "ミリカ・ミュージック コンテンツの拡大企画",
  description: "ミリカ・をもっと多くの人に届けたい企画です",
  author: "鈴木健介",
  companyId: "mirika_music",
  keywords: ["拡大", "企画", "配信"],
  position: { x: 55, y: 1219 },
  size: { width: 260, height: 190 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish13);

// Wish 14
const wish14: Wish = createWish({
  title: "闇 × イベント連携",
  description: "闇の特性を活かしたイベント企画を考えています",
  author: "木村康司",
  companyId: "yami",
  keywords: ["イベント", "連携", "体験"],
  position: { x: 1213.3999633789062, y: 249 },
  size: { width: 283, height: 170 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish14);

// Wish 15
const wish15: Wish = createWish({
  title: "TOROMI グループ制作支援",
  description: "TOROMIの制作に協力します。ノウハウがあります",
  author: "角田大輔",
  companyId: "toromi",
  keywords: ["制作", "支援", "ノウハウ"],
  position: { x: 1621, y: 625 },
  size: { width: 290, height: 210 },
  isPersonalOffer: true, // 人材メモ
  avatarImage: "/assets/avatar_suzuki_keigo.png",
});
allWishes.push(wish15);

// Wish 16
const wish16: Wish = createWish({
  title: "デジタル化によるひなた推進",
  description: "ひなたをデジタル化することで新しい体験を実現したい",
  author: "中田文香",
  companyId: "hinata_life",
  keywords: ["デジタル", "推進", "体験"],
  position: { x: 1222, y: 511.5 },
  size: { width: 282, height: 185 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish16);

// Wish 17
const wish17: Wish = createWish({
  title: "アップ コンテンツの拡大企画",
  description: "アップをもっと多くの人に届けたい企画です",
  author: "小林智子",
  companyId: "appland",
  keywords: ["拡大", "企画", "配信"],
  position: { x: 2061, y: 19.5 },
  size: { width: 254, height: 184 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish17);

// Wish 18
const wish18: Wish = createWish({
  title: "MBSアニメ × イベント連携",
  description: "MBSアニメの特性を活かしたイベント企画を考えています",
  author: "木下結衣",
  companyId: "mbs_anime",
  keywords: ["イベント", "連携", "体験"],
  position: { x: 1737, y: 95 },
  size: { width: 280, height: 200 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish18);

// Wish 19
const wish19: Wish = createWish({
  title: "MBSグッズグループ制作支援",
  description: "MBSグッズの制作に協力します。ノウハウがあります",
  author: "山田太郎",
  companyId: "mbs_goods",
  keywords: ["制作", "支援", "ノウハウ"],
  position: { x: 2004, y: 603 },
  size: { width: 290, height: 206 },
  isPersonalOffer: true, // 人材メモ
  avatarImage: "/assets/avatar_suzuki_keigo.png",
});
allWishes.push(wish19);

// Wish 20
const wish20: Wish = createWish({
  title: "デジタル化によるGAORA推進",
  description: "GAORAをデジタル化することで新しい体験を実現したい",
  author: "田中花子",
  companyId: "gaora",
  keywords: ["デジタル", "推進", "体験"],
  position: { x: 1079.0999755859375, y: 22 },
  size: { width: 313, height: 176 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish20);

// Wish 21
const wish21: Wish = createWish({
  title: "ファシ コンテンツの拡大企画",
  description: "ファシをもっと多くの人に届けたい企画です",
  author: "佐藤次郎",
  companyId: "facilities",
  keywords: ["拡大", "企画", "配信"],
  position: { x: 906, y: 1253 },
  size: { width: 260, height: 190 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish21);

// Wish 22
const wish22: Wish = createWish({
  title: "ピコリ × イベント連携",
  description: "ピコリの特性を活かしたイベント企画を考えています",
  author: "鈴木由美",
  companyId: "picori",
  keywords: ["イベント", "連携", "体験"],
  position: { x: 1417, y: 38 },
  size: { width: 280, height: 170 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish22);

// Wish 23
const wish23: Wish = createWish({
  title: "MBSライブグループ制作支援",
  description: "MBSライブの制作に協力します。ノウハウがあります",
  author: "鈴木健介",
  companyId: "mbs_live",
  keywords: ["制作", "支援", "ノウハウ"],
  position: { x: 733, y: 597.5 },
  size: { width: 290, height: 210 },
  isPersonalOffer: true, // 人材メモ
  avatarImage: "/assets/avatar_suzuki_keigo.png",
});
allWishes.push(wish23);

// Wish 24
const wish24: Wish = createWish({
  title: "デジタル化によるMG推進",
  description: "MGをデジタル化することで新しい体験を実現したい",
  author: "木村康司",
  companyId: "mg_sports",
  keywords: ["デジタル", "推進", "体験"],
  position: { x: 1432, y: 904 },
  size: { width: 300, height: 185 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish24);

// Wish 25
const wish25: Wish = createWish({
  title: "ZIPANG コンテンツの拡大企画",
  description: "ZIPANGをもっと多くの人に届けたい企画です",
  author: "角田大輔",
  companyId: "zipang",
  keywords: ["拡大", "企画", "配信"],
  position: { x: 1298, y: 1213 },
  size: { width: 263, height: 178 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish25);

// Wish 26
const wish26: Wish = createWish({
  title: "VOGARO × イベント連携",
  description: "VOGAROの特性を活かしたイベント企画を考えています",
  author: "中田文香",
  companyId: "vogaro",
  keywords: ["イベント", "連携", "体験"],
  position: { x: 1522, y: 332 },
  size: { width: 280, height: 200 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish26);

// Wish 27
const wish27: Wish = createWish({
  title: "アップランドグループ制作支援",
  description: "アップランドの制作に協力します。ノウハウがあります",
  author: "小林智子",
  companyId: "upland",
  keywords: ["制作", "支援", "ノウハウ"],
  position: { x: 992, y: 975 },
  size: { width: 296, height: 217 },
  isPersonalOffer: true, // 人材メモ
  avatarImage: "/assets/avatar_suzuki_keigo.png",
});
allWishes.push(wish27);

// Wish 28
const wish28: Wish = createWish({
  title: "デジタル化によるテレビ推進",
  description: "テレビをデジタル化することで新しい体験を実現したい",
  author: "木下結衣",
  companyId: "mbs_tv",
  keywords: ["デジタル", "推進", "体験"],
  position: { x: 1702, y: 1214 },
  size: { width: 300, height: 220 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish28);

// Wish 29
const wish29: Wish = createWish({
  title: "イノベーションコンテンツの拡大企画",
  description: "イノベーションをもっと多くの人に届けたい企画です",
  author: "山田太郎",
  companyId: "innovation",
  keywords: ["拡大", "企画", "配信"],
  position: { x: 555, y: 828 },
  size: { width: 260, height: 190 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish29);

// Wish 30
const wish30: Wish = createWish({
  title: "MBS企画 × イベント連携",
  description: "MBS企画の特性を活かしたイベント企画を考えています",
  author: "田中花子",
  companyId: "mbs_planning",
  keywords: ["イベント", "連携", "体験"],
  position: { x: 1840, y: 390 },
  size: { width: 274, height: 170 },
  isCompanyWish: true, // 会社メモ
});
allWishes.push(wish30);

export const demoWishs: Wish[] = allWishes;
