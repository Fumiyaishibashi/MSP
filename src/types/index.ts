// 1. マスタデータ（固定のアセット情報）
export interface IpAssetMaster {
  id: string;
  name: string;
  imagePath: string; // ロゴ画像パス。アイコンの場合は空文字など
  ownerName: string;
  contact: string;
  category: '番組IP' | 'キャラクター/タレント' | '技術/リソース';
  iconName?: string; // lucide-reactのアイコン名
}

// 2. イベントデータ (イベント付箋)
export interface EventProject {
  id: string;
  title: string;
  location: string;
  date: string;
  status: '募集中' | '企画中' | '準備中' | '終了';
  placedItems: PlacedItem[]; // 汎用的なPlacedItemの配列に変更
}

// 3. キャンバス上のアイテム（共用体）
export type PlacedItem = PlacedIpItem | PlacedIdeaItem;

// 3a. IP付箋
export interface PlacedIpItem {
  type: 'ip';
  uniqueId: string;
  assetId: string; // Master の ID を参照
  author: string; // 作成者名
  note?: string; // 自由記述メモ
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  zIndex: number;
}

// 3b. アイデア付箋
export interface PlacedIdeaItem {
  type: 'idea';
  uniqueId: string;
  text: string;
  author: string; // 作成者名
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  zIndex: number;
}
