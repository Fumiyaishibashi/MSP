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
  company: string; // MBS Group company ID (e.g., 'mbs_tv', 'mbs_radio')
  yearsOfService: number; // 入社年数（0=新卒、1以上=経験者）
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

// 6. チャットメッセージ（メモ単位）
export interface Message {
  id: string;
  memoType: 'person' | 'company';
  memoId: string;
  author: string;
  content: string;
  timestamp: Date;
  reactions?: string[];
}

// 6b. メモチャット参加者
export interface MemoChatParticipant {
  personId: string;
  name: string;
  avatar?: string;
}

// 6c. メモ単位のチャット情報
export interface MemoChat {
  memoType: 'person' | 'company';
  memoId: string;
  participants: MemoChatParticipant[];
}

// 7. プロジェクトチャットメッセージ
export interface ProjectMessage {
  id: string;
  projectId: string;
  author: string;
  content: string;
  timestamp: Date;
  role?: string; // 'person_memo' | 'idea_author' | 'company_introducer' | 'past_participant'
}

// 8. プロジェクトチャット参加者情報
export interface ProjectChatParticipant {
  personId: string;
  name: string;
  role: 'person_memo' | 'idea_author' | 'company_introducer' | 'past_participant';
  reason: string; // 参加理由の説明
}

// 9. プロジェクトチャット（プロジェクト単位）
export interface ProjectChat {
  projectId: string;
  participants: ProjectChatParticipant[];
  messages: ProjectMessage[];
}

// 10. ブレストボード - 願い（Wish）
export interface Wish {
  id: string;
  title: string; // 「音楽フェスをやりたい」
  description: string; // 詳細説明
  keywords: string[]; // マッチング用キーワード ["音楽", "フェス", "配信"]
  author: string; // 願いを出した人の名前
  companyId: string; // 所属会社ID（MBSグループ）
  createdAt: Date;
  position: { x: number; y: number }; // キャンバス上の位置
  size: { width: number | string; height: number | string }; // サイズ
  zIndex: number;
  comments?: WishComment[]; // 願いに対するコメント（Phase 1.5+）
  stickyColor?: string; // 付箋の色（Tailwind色クラス）
  isPersonalOffer?: boolean; // 人材メモ（個人の協力提案）かどうか
  avatarImage?: string; // 人材メモの場合の写真パス
  isCompanyWish?: boolean; // 会社メモ（企業の願い）かどうか
}

// 10b. ブレストボード - 願いへのコメント
export interface WishComment {
  id: string;
  wishId: string; // 願いID への参照
  authorId: string; // PersonMemo.id への参照
  authorName?: string; // キャッシュ: コメント著者名（表示用）
  content: string; // コメント本文
  timestamp: Date;
  reactions?: string[]; // リアクション絵文字（将来拡張用）
}

// 11. ブレストボード - マッチグループ
export interface MatchGroup {
  id: string;
  wishs: string[]; // マッチした願いのID配列
  commonKeywords: string[]; // 共通キーワード
  matchScore: number; // マッチスコア 0-100
  createdAt: Date;
}

// 12. ブレストボード - チーム
export interface BrainstormTeam {
  id: string;
  name: string; // 「2026年VR対応音楽フェス」
  wishs: string[]; // 関連する願いのID配列
  matchGroupId: string; // 元になったマッチグループID
  members: {
    personId: string;
    name: string;
    reason: string; // なぜこの人が提案されたか
    yearsOfService: number; // 入社年数
  }[];
  externalInvites?: {
    email: string;
    invitedBy: string; // 招待者名
    invitedAt: Date;
  }[]; // 外部メンバー招待リスト
  chatRoomId?: string; // 専用チャットルームID
  whiteboardId?: string; // 専用ホワイトボードID
  createdAt: Date;
}

// チームチャット用メッセージ
export interface TeamMessage {
  id: string;
  teamId: string; // BrainstormTeam.id への参照
  author: string; // メッセージ著者名
  content: string; // メッセージ本文
  timestamp: Date;
}

// Phase 3: チーム作成リクエスト (フォームデータ)
export interface TeamCreationRequest {
  matchGroupId: string;
  teamName: string;
  selectedMemberIds: string[]; // 手動で選択されたPersonMemo IDs
  recommendationReasons: {
    personId: string;
    reason: string; // e.g., "願いの著者", "コメント", "専門知識"
  }[];
  externalInvites?: string[]; // 外部招待メールアドレスリスト
}

// Phase 3: メンバー推奨情報（理由詳細付き）
export interface TeamMemberRecommendation {
  personId: string;
  name: string;
  department: string;
  expertise: string[];
  yearsOfService: number;
  recommendationReasons: {
    type: 'wish_author' | 'wish_commenter' | 'expertise_match'; // 理由カテゴリ
    wishId: string;
    wishTitle: string;
    details: string;
  }[];
  isSelected: boolean; // UI用チェックボックス状態
}

// Phase 3: チーム作成メタデータ
export interface TeamMetadata {
  totalWishes: number;
  commonKeywords: string[];
  matchScore: number;
  suggestedTeamName?: string;
}
