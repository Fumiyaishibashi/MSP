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
export type PlacedItem = PlacedIpItem | PlacedIdeaItem | PlacedPersonMemoItem | PlacedCompanyMemoItem;

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

// 3c. 人メモ付箋
export interface PlacedPersonMemoItem {
  type: 'person';
  uniqueId: string;
  memoId: string; // PersonMemo.id への参照
  author: string; // 配置した人の名前
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  zIndex: number;
}

// 3d. 会社メモ付箋
export interface PlacedCompanyMemoItem {
  type: 'company';
  uniqueId: string;
  memoId: string; // CompanyMemo.id への参照
  author: string; // 配置した人の名前
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  zIndex: number;
}

// 4. 人メモ（マスターデータ）
export interface PersonMemo {
  id: string;
  name: string;
  department: string;
  expertise: string[];
  email: string;
  phone?: string;
  pastProjects: string[];
  avatar?: string;
}

// 5. 会社メモ（マスターデータ）
export interface CompanyMemo {
  id: string;
  name: string;
  specialty: string[];
  pastProjects: string[];
  pointOfContact: {
    personId?: string;
    name: string;
    email: string;
    role?: string;
  }[];
}

// 6. チャットメッセージ（グローバル）
export interface Message {
  id: string;
  memoType: 'person' | 'company';
  memoId: string;
  author: string;
  content: string;
  timestamp: Date;
  reactions?: string[];
}
