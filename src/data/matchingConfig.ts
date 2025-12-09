/**
 * マッチング設定ファイル
 *
 * ここに wish の内容とマッチング関係を書きます
 * companyId は会社名で書いてOK（下の companyNameMap で自動変換）
 *
 * 使用可能な会社名：
 * - 株式会社毎日放送 (MBS TV)
 * - 株式会社MBSラジオ
 * - 株式会社MBS企画
 * - 株式会社放送映画製作所
 * - ミリカ・ミュージック
 * - 株式会社闇
 * - MBSイノベーション
 * - TOROMI PRODUCE
 * - ひなたライフ
 * - アップランド
 * - MBSアニメ
 * - MBSグッズ
 * - VOGARO
 */

export interface WishConfig {
  id: string;
  title: string;
  description: string;
  author: string;
  company: string; // 会社名で書く
  keywords: string[];
  matchWith: string[]; // マッチする wish の ID 配列（wish1 なら "wish1" と書く）
}

export const wishMatchingConfig: WishConfig[] = [
  {
    id: "wish1",
    title: "2026年異業種コラボ音楽フェスを実現したい",
    description:
      "MBSグループの各企業が参加する大規模音楽フェスを開催。ラジオ、テレビ、配信を組み合わせた新しい体験",
    author: "岡田圭太",
    company: "ミリカ・ミュージック",
    keywords: ["音楽フェス", "イベント", "異業種コラボ", "ラジオ", "テレビ"],
    matchWith: ["wish2", "wish3", "wish4"],
  },

  // ========== ここから下、あなたが自由に書いてください ==========
  // 例：
  {
    id: "wish2",
    title: "ごぶごぶFES今年は音楽×お笑い",
    description: "去年と差別化した音楽×お笑いFESにしたい",
    author: "木村康司",
    company: "MBSラジオ",
    keywords: ["音楽", "お笑い", "FES", "イベント"],
    matchWith: ["wish1", "wish3"],
  },

  {
    id: "wish3",
    title: "あれみたで「食」企画",
    description:
      "去年開催したおにぎりが好評。今年は規模大きくしたい。FESで出店？",
    author: "長沢健太",
    company: "毎日放送",
    keywords: ["食", "お笑い", "FES", "キッチンカー"],
    matchWith: ["wish1", "wish2"],
  },

  {
    id: "wish4",
    title: "VR×イベント連携",
    description: "何かのイベントでVR体験みたいなことをしたい",
    author: "高野成一",
    company: "放送映画製作所",
    keywords: ["VR", "配信", "イベント", "体験型"],
    matchWith: ["wish1", "wish8"],
  },

  {
    id: "wish5",
    title: "食フェスティバルを開きたい",
    description: "はらぺこサーカスみたいなイベントに参加したい",
    author: "山崎亜美",
    company: "TOROMI PRODUCE",
    keywords: ["食", "FES", "イベント"],
    matchWith: ["wish3"],
  },

  {
    id: "wish6",
    title: "グッズの制作のお話あれば！！",
    description: "グッズ制作のノウハウがあります！もし気になれば連絡ください！",
    author: "鈴木圭吾",
    company: "MBSグッズ",
    keywords: ["グッズ", "制作", "イベント"],
    matchWith: ["wish1", "wish2"],
  },

  {
    id: "wish7",
    title: "Vtuberをさまざまな場所で起用したい",
    description:
      "テレビやラジオなどさまざまな場面でうちのVtuberとコラボしませんか？",
    author: "井上隆文",
    company: "アップランド",
    keywords: ["Vtuber", "IT", "イベント", "出演"],
    matchWith: ["wish8"],
  },

  {
    id: "wish8",
    title: "メタバース内で何かイベント開催したい",
    description: "メタバース空間でイベントやFES開催できたら楽しそう",
    author: "伊藤健一",
    company: "MBSイノベーション",
    keywords: ["VR", "IT", "イベント", "メタバース"],
    matchWith: ["wish4", "wish7"],
  },
];

/**
 * 会社名 → companyId の対応表
 * スクリプト側で自動変換する
 */
export const companyNameMap: { [key: string]: string } = {
  株式会社毎日放送: "mbs_tv",
  "MBS TV": "mbs_tv",
  毎日放送: "mbs_tv",

  株式会社MBSラジオ: "mbs_radio",
  MBSラジオ: "mbs_radio",

  株式会社MBS企画: "mbs_planning",
  MBS企画: "mbs_planning",

  株式会社放送映画製作所: "broadcast_film",
  放送映画製作所: "broadcast_film",

  "ミリカ・ミュージック": "mirika_music",
  ミリカミュージック: "mirika_music",

  株式会社闇: "yami",
  闇: "yami",

  MBSイノベーション: "innovation",
  イノベーション: "innovation",

  "TOROMI PRODUCE": "toromi",
  トロミ: "toromi",

  ひなたライフ: "hinata_life",

  アップランド: "upland",

  MBSアニメ: "mbs_anime",
  "MBS anime": "mbs_anime",

  MBSグッズ: "mbs_goods",
  "MBS goods": "mbs_goods",

  VOGARO: "vogaro",
  ボガロ: "vogaro",

  GAORA: "gaora",

  MBSファシリティーズ: "facilities",

  ピコリ: "picori",

  MBSライブエンターテインメント: "mbs_live",

  "MG SPORTS": "mg_sports",

  ZIPANG: "zipang",
};
