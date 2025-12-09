# MBS Synergy Platform - ブレストマッチング機能実装案

## 📋 問題の本質

### 現在の状態
- ✅ 既存イベント（ごぶごぶFES など）は固定的
- ✅ 配置・管理のツール化が進んだ
- ❌ **ボトムアップの「やりたいこと」がない**
- ❌ **別部署・グループ会社の想いが統合されない**
- ❌ **若手と重鎮の接点が自動化されていない**

### ユーザーが求めるもの
- 📌 「2026年に実現したいイベント」という **自由なブレストスペース**
- 📌 複数部署が「やりたいこと」を付箋として **同時に出す**
- 📌 複数の「願い」が **マッチしました！** と繋がる
- 📌 マッチ後、**自動的にチームが形成される**
- 📌 チームで **専用スペース** で企画を進める
- 📌 **若手と重鎮がくっつく** 仕組み

---

## 🏗️ アーキテクチャ変更案

### 現在の構造
```
Dashboard
└── EventProject（固定的な「箱」）
    └── Canvas
        └── PlacedItems（IP、アイデア、人、会社）
```

### 提案する構造
```
Dashboard
├── 既存イベント（ごぶごぶFES など）
│   └── Canvas
│
└── ⭐ 新「ブレストボード」
    ├── Tab 1: 「2026年に実現したい企画」
    │   └── Canvas（願い付箋を自由に配置）
    │       └── 複数部署の「やりたいこと」
    │
    ├── Tab 2: 「マッチング結果」
    │   └── 繋がった願い同士の可視化
    │       ├── マッチング線（キーワードベース）
    │       └── 提案人物の表示
    │
    └── Tab 3: 「生成されたチーム」
        └── チーム一覧
            ├── チーム専用ホワイトボード
            ├── チーム専用チャット
            └── チーム構成マトリックス
```

---

## 📊 新データモデル

### 1. **「願い（Wish）」モデル**

```typescript
interface Wish {
  id: string;                    // "wish_001"
  title: string;                 // "音楽フェスをやりたい"
  description: string;           // "夏に大規模な音楽フェスを企画したい"
  type: "event" | "concept" | "service";  // 願いの種類

  // 誰が提案したか
  proposedBy: PersonMemo;
  department: string;            // "MBS企画部"
  company?: string;              // "MBSテレビ" / "闇" など

  // 願いの特性
  keywords: string[];            // ["音楽", "フェス", "若者向け", "大規模"]
  targetYear: number;            // 2026
  estimatedScale: "small" | "medium" | "large" | "mega";

  // マッチング関連
  relatedDepartments?: string[]; // 関連部署の候補
  requiredExpertise?: string[];  // 必要な専門家タイプ
  matchedWishes?: string[];      // マッチしたWish ID（複数可）
  matchingScore?: number;        // マッチ度（0-100）

  // UI表示用
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  color?: string;                // 部署別カラーコード

  createdDate: Date;
  status: "draft" | "published" | "matched" | "team_formed" | "completed";
}
```

### 2. **「マッチング結果（MatchGroup）」モデル**

```typescript
interface MatchGroup {
  id: string;                    // "match_001"
  wishes: Wish[];                // マッチした複数の願い
  matchingReason: string;        // "【配信技術】で繋がる"

  // 自動検出された情報
  commonKeywords: string[];      // ["配信", "VR", "全国"]
  suggestedMembers: PersonMemo[]; // マッチに基づいて提案される人物

  // ビジュアル表示用
  visualConnections: Array<{
    fromWishId: string;
    toWishId: string;
    strength: number;            // 繋がりの強さ（0-100）
  }>;

  createdDate: Date;
}
```

### 3. **「チーム（Team）」モデル**

```typescript
interface Team {
  id: string;                    // "team_001"
  name: string;                  // "2026年音楽フェス実現チーム"

  // チームの起源
  originWishes: Wish[];          // このチームの元になった複数の願い
  foundedDate: Date;

  // チーム構成
  members: Array<{
    personMemo: PersonMemo;
    role: string;                // "VR技術責任者" / "グッズプロデューサー" など
    assignedBy: "auto" | "manual"; // 自動割当か手動か
    joiningDate: Date;
  }>;

  // チーム内スペース
  chatRoomId: string;            // 専用チャットルーム
  canvasId: string;              // 専用ホワイトボード
  documentId?: string;           // 企画書ドキュメント

  status: "forming" | "active" | "completed" | "archived";
}
```

---

## 🎨 UI/UX フロー

### ユーザージャーニー

```
1️⃣ ブレストボード へアクセス
   ↓
2️⃣ 「新しい願いを登録」
   ├─ タイトル: "お化け屋敷イベント"
   ├─ 部門: "闇"
   ├─ キーワード: ["お化け", "大規模", "没入感"]
   ├─ 配置: キャンバスに付箋で配置
   └─ 色: 部門別の色で表示
   ↓
3️⃣ 他部署の「願い」が続々追加される
   ├─ "VR配信イベント" (MBSテレビ)
   ├─ "キッチンカー出店" (グッズ班)
   ├─ "配信技術イベント" (放送映画)
   └─ 全て同じキャンバスに配置
   ↓
4️⃣ キャンバス上の「願い」同士が自動で繋がる
   ├─ 「お化け屋敷」と「VR配信」
   │  └─ 線で繋がる（色：【VR技術】での繋がり）
   ├─ 「VR配信」と「配信技術」
   │  └─ 線で繋がる（色：【配信技術】での繋がり）
   └─ マッチング度が数値で表示
   ↓
5️⃣ 「マッチしました！」ポップアップ
   ├─ 「3つの部門が繋がりました」
   ├─ 提案人物の表示
   │  ├─ 高橋（VR技術スペシャリスト）⭐⭐⭐⭐⭐
   │  ├─ 若手〇〇
   │  └─ 重鎮■■（おじいさんっぽい）
   └─ 「チームを作る」ボタン
   ↓
6️⃣ チーム作成
   ├─ チーム名: "2026年お化け屋敷×VR配信プロジェクト"
   ├─ メンバー確認
   │  ├─ 高橋（VR技術）
   │  ├─ 若手〇〇（企画）
   │  └─ 重鎮■■（予算管理）
   ├─ チーム専用チャット: 自動作成
   └─ チーム専用ホワイトボード: 自動作成
   ↓
7️⃣ チーム内で企画を詰める
   ├─ チャットで打ち合わせ
   ├─ ホワイトボードで詳細設計
   └─ IP資産・人物・会社を追加
```

---

## 🔧 実装フェーズ

### **Phase 1: 基本構造 & 願い管理（2週間）**

#### 1-1. データモデル追加
- [ ] `types/index.ts` に `Wish` インターフェース追加
- [ ] `types/index.ts` に `Team` インターフェース追加
- [ ] `types/index.ts` に `MatchGroup` インターフェース追加

#### 1-2. マスターデータ更新
- [ ] `masterPersonData.ts` に新フィールド追加
  - `importance: 1-5` （既にある）
  - `isVeteran: boolean` （重鎮フラグ）
  - `age?: number` （表示用、おじいさんっぽさの判定）
  - `generation: "veteran" | "senior" | "mid" | "junior"`

#### 1-3. 新ページ作成
- [ ] `/src/pages/BrainstormBoard.tsx` 作成
  - Tab 1: 「願い一覧」
  - Tab 2: 「マッチング結果」
  - Tab 3: 「チーム一覧」

#### 1-4. 新コンポーネント作成
- [ ] `WishSticky.tsx` - 願い付箋の表示
- [ ] `WishModal.tsx` - 願い登録フォーム
- [ ] `WishCanvas.tsx` - 願い用キャンバス

#### 1-5. AppContext 拡張
- [ ] `wishes: Wish[]` 状態追加
- [ ] `addWish()` 関数
- [ ] `updateWish()` 関数
- [ ] `deleteWish()` 関数

#### 1-6. 画面実装
- [ ] ブレストボードをダッシュボードに追加（タブ）
- [ ] 願い付箋の作成・編集・削除UI
- [ ] 願い同士を手動で繋ぐUI（ドラッグで線を引く）

---

### **Phase 1.5: コメント＆マッチング準備（1.5週間）** ⭐ NEW

#### 1.5-1. データモデル拡張
- [ ] `types/index.ts` に `WishComment` インターフェース追加
  ```typescript
  interface WishComment {
    id: string;
    wishId: string;
    authorId: string;       // PersonMemo.id へのリファレンス
    content: string;
    timestamp: Date;
    reactions?: string[];   // 将来拡張用
  }
  ```
- [ ] `Wish` インターフェースに `comments: WishComment[]` フィールド追加

#### 1.5-2. マスターデータ拡張（30人）
- [ ] `masterPersonData.ts` を拡張
  - 既存5人はそのまま活用
  - 新規25人を17社から追加
  - フィールド追加：
    - `expertise: string[]` - 専門領域（例：["VR技術", "映像制作"]）
    - `company?: string` - 所属会社（17社コード）
  - 配置：大企業多部門型（案B）
    - MBS TV：5-6人
    - MBSラジオ：3-4人
    - Vogaro（VR/テック）：3人
    - 闇（エンタメ）：2-3人
    - 他13社：各1-2人
  - 重鎮/若手割合は自由配置

#### 1.5-3. コメント機能コンポーネント
- [ ] `WishCommentSection.tsx` - コメント表示エリア
  - コメント一覧表示
  - コメント者名をクリック → 人物詳細モーダル
  - 時系列表示

- [ ] `WishCommentForm.tsx` - コメント入力フォーム
  - 現在ユーザー（currentUser）で自動記入
  - テキストエリア入力
  - 送信ボタン

- [ ] `PersonDetailModal.tsx` - 人物詳細表示（拡張）
  - 名前、部署、会社
  - expertise（専門領域）
  - email, phone
  - pastProjects（実績）
  - importance レベル表示

#### 1.5-4. AppContext 拡張
- [ ] 30人の拡張masterPersonDataをロード
- [ ] `addWishComment(wishId, authorId, content)` 関数
- [ ] `deleteWishComment(commentId)` 関数
- [ ] `getWishComments(wishId)` 関数

#### 1.5-5. BrainstormCanvas 拡張
- [ ] 願い付箋に「コメント数バッジ」表示
- [ ] 願いクリックで「詳細パネル」を開く
  - 願い内容表示
  - コメント一覧表示
  - コメント入力フォーム

#### 1.5-6. localStorage 拡張
- [ ] `mbs_app_comments` - コメント永続化
- [ ] `mbs_app_person_data_expanded` - 30人の人物データ永続化

---

### **Phase 2: マッチングロジック（2-3週間）**

#### 2-1. マッチングエンジン
- [ ] `utils/matchingEngine.ts` 作成
  - **キーワードベースのマッチング**
    - 願い①と願い②の keywords 配列を比較
    - 共通キーワード数でスコア計算
    - マッチングスコア：`(共通キーワード数 / Math.min(wish1.keywords.length, wish2.keywords.length)) * 100`
  - **コメントベースの人物マッチング**
    - 願い①にコメントした人が願い②にも関心がある
    - → その人物をマッチング提案に含める
  - マッチングスコア計算（0-100）
    - キーワード一致度：60%
    - 関連コメント者数：40%

#### 2-2. マッチング可視化
- [ ] キャンバス上に繋がり線を描画
  - 願い①と願い②を線で繋ぐ
  - 線の太さ = マッチングスコア
  - 線の色 = マッチのテーマ（キーワード）
- [ ] 「マッチしました！」通知UI
  - マッチスコア表示
  - 共通キーワード表示
  - 共通コメント者表示

#### 2-3. AppContext 拡張
- [ ] `matchGroups: MatchGroup[]` 状態追加
- [ ] `detectMatches()` 関数（自動マッチング検出）
  - 全ての願いペアを比較
  - スコア > 50% でマッチ判定
- [ ] `createMatch()` 関数（手動マッチング - タブで表示可能に）
- [ ] `getRelatedPeople()` 関数（マッチに基づいて人物提案）
  - マッチした両願いにコメントした人物を抽出
  - importance レベルでソート

#### 2-4. UI 実装
- [ ] Tab 2: 「マッチング結果」ページ
  - マッチング一覧表示
  - マッチングの詳細パネル
    - マッチスコア（%）
    - 共通キーワード
    - 共通コメント者リスト
- [ ] マッチング検索・フィルター
  - キーワードで絞り込み
  - テーマで絞り込み（フェス系、配信系など）
- [ ] 「チームを組む」ボタン

---

### **Phase 3: チーム自動形成 & 専用スペース（3-4週間）**

#### 3-1. チーム管理
- [ ] `Team` データモデル実装
- [ ] AppContext に チーム管理ロジック追加
  - `teams: Team[]`
  - `createTeam()` - マッチングからチーム生成
  - `addTeamMember()` - メンバー追加
  - `removeTeamMember()` - メンバー削除

#### 3-2. 自動メンバー提案
- [ ] マッチした願いから必要スキル判定
- [ ] 関連人物を自動提案
- [ ] 若手＋重鎮のバランス調整

#### 3-3. チーム専用スペース
- [ ] チーム専用ホワイトボード
  - `/team/:teamId` ページ
  - 願いに関連するIP・人・会社を配置可能
- [ ] チーム専用チャット
  - ChatModal を拡張
  - チームメンバーのみが参加

#### 3-4. チーム構成マトリックス
- [ ] チーム内で「誰がどの役割か」を可視化
- [ ] スキルセット表示
- [ ] 足りない職能の提示

---

## 🎨 UI コンポーネント詳細

### 願い付箋（WishSticky）

```
┌─────────────────────────────┐
│ 🎪 音楽フェスをやりたい      │  ← 絵文字 + タイトル
│ ─────────────────────────   │
│ MBS企画部                   │  ← 部門名
│ 【若手だからできる】         │  ← 実力表示（若手/重鎮）
│                            │
│ キーワード:                  │
│ #音楽 #フェス #大規模       │  ← タグ表示
│                            │
│ 提案者: 山田太郎 ⭐⭐      │  ← 提案者と重要度
└─────────────────────────────┘
```

### 繋がり線（Connection Line）

```
願い1              願い2
  │                 │
  │ 【VR技術】での  │
  │   繋がり        │
  └─────────────────┘
     マッチ度: 85%
```

### チーム自動生成パネル

```
┌──────────────────────────────────┐
│ 🎊 マッチしました！              │
│ 「3つの部門が繋がります」         │
├──────────────────────────────────┤
│ 願い:                            │
│ ① 音楽フェスをやりたい           │
│ ② VR配信イベント                 │
│ ③ 配信技術イベント               │
├──────────────────────────────────┤
│ 提案メンバー:                     │
│ ✨ 高橋（VR技術者）⭐⭐⭐⭐⭐    │
│    若手〇〇（企画者）⭐⭐        │
│    重鎮■■（予算管理）⭐⭐⭐⭐ │
├──────────────────────────────────┤
│ [チームを作る] [後で判断]         │
└──────────────────────────────────┘
```

---

## 🏷️ UI パターン: 人物表示の改善

### 「重鎮」 vs 「若手」の視覚的区別

```
【重鎮の場合】
┌───────────────────┐
│ 👴 山田 (90)       │  ← おじいさんアイコン + 年齢
│ ─────────────────  │
│ 製作部長           │
│ 【VRの第一人者】   │  ← 実績・地位
│ ⭐⭐⭐⭐⭐      │  ← 5つ星
│                   │
│ 実績: 4K化プロジェ│
│      クト立案    │
│      ごぶごぶFES │
│      VR配信      │
└───────────────────┘

【若手の場合】
┌───────────────────┐
│ 👨 田中 (28)       │  ← 若手アイコン + 年齢
│ ─────────────────  │
│ 企画アシスタント   │
│ 【成長中】         │  ← 状態表示
│ ⭐⭐             │  ← 2つ星
│                   │
│ 実績: 企画補助  │
│      新企画提案 │
└───────────────────┘
```

---

## 🔗 データ永続化

### localStorage キー追加
- `mbs_app_wishes` - 願い一覧
- `mbs_app_teams` - チーム一覧
- `mbs_app_match_groups` - マッチング結果

---

## 🎯 実装の優先度

| Phase | 優先度 | 期間 | 効果 |
|-------|--------|------|------|
| 1 | 🔴 高 | 2週間 | ブレストボードの基本が動く。願い付箋の作成・配置可能 |
| 2 | 🟡 中 | 2-3週間 | マッチング自動検出。部門同士の繋がりが見える |
| 3 | 🟢 低 | 3-4週間 | チーム自動形成。プロジェクト化。実運用レベル |

---

## 💡 実装時の注意点

1. **願いの多様性を許容**
   - 「イベント」だけでなく「概念」「サービス」も OK
   - 部門の垣根を超えた自由な入力を促す

2. **マッチングの精度**
   - 初版は手動マッチングで十分
   - キーワード分析は 90% 正確性で OK（完璧を目指さない）

3. **重鎮との繋がり**
   - 年齢・経験値でフィルタリング可能に
   - 「若手と重鎮のペアリング」が自動提案される

4. **チーム形成後**
   - チーム専用チャット・ホワイトボードは自動作成
   - ユーザーはすぐに「チーム内での企画」に移行可能

5. **グループ会社対応**
   - 部門名に「闇」「MBSテレビ」など柔軟に対応
   - 会社フィルターで絞り込み可能に

---

## 📈 期待される効果

✅ **ボトムアップの企画が生まれる**
- 各部門の「やりたいこと」が可視化される

✅ **部門横断の自然な繋がり**
- キーワード + マッチングで自動的に連携する

✅ **若手と重鎮の接点**
- 世代をまたいだチーム形成が促される

✅ **実現可能性の向上**
- 複数スキルが集まるので、実現率が上がる

✅ **グループ会社の統合**
- MBS グループ全体での大型企画が可能に

---

## 🚀 次のステップ

1. Phase 1 を実装して、フィードバック収集
2. 実際の部門から願いを集めてテスト
3. マッチングロジックの精度向上
4. チーム形成後の実運用フロー確立

---

## 🏢 MBSグループ会社リスト

### **MBSグループの構成企業一覧**

このリストは「願い（Wish）」を入力する際の **「部門/会社」セレクトボックス** に使用されます。
各グループ会社が独立した「やりたいこと」を持つことで、MBSグループ全体での大型企画が生まれます。

| 会社名 | 事業内容 | 特徴 | 願いの例 |
|--------|--------|------|--------|
| **株式会社毎日放送** | テレビ放送・映像制作 | グループの中核。テレビ番組制作 | 「配信技術を活用したイベント」「テレビ放映企画」 |
| **株式会社MBSラジオ** | ラジオ放送・番組制作 | 「ごぶごぶ」等の番組制作 | 「ごぶごぶコラボイベント」「ラジオ公開生放送」 |
| **株式会社GAORA** | スポーツ放送・配信 | スポーツコンテンツ専門 | 「スポーツイベント開催」「スポーツ配信」 |
| **株式会社MBS企画** | イベント企画・制作 | イベント全般の企画立案 | 「音楽フェス開催」「大型イベント企画」 |
| **株式会社放送映画製作所** | 映像制作・映画化 | 番組から映画化、映像コンテンツ制作 | 「映画化企画」「大型映像展示」「映画館での上映イベント」 |
| **株式会社ミリカ・ミュージック** | 音楽制作・プロデュース | 楽曲制作、アーティスト管理 | 「音楽イベント開催」「アーティストコラボ」 |
| **株式会社MBSファシリティーズ** | 施設管理・保守 | スタジオ・施設の管理運営 | 「イベント会場提供」「施設を活用したイベント」 |
| **株式会社ピコリ** | デジタル・WEB制作 | ウェブサイト・デジタルコンテンツ制作 | 「デジタルイベント」「オンライン配信」 |
| **株式会社MBSライブエンターテインメント** | ライブイベント制作 | コンサート・ライブイベント企画 | 「ライブコンサート」「大型音楽フェス」 |
| **株式会社闇** | エンターテイメント企画 | 独特なコンセプトのイベント制作 | 「お化け屋敷イベント」「没入型エンターテイメント」 |
| **株式会社MBSイノベーションドライブ** | 新規事業・スタートアップ支援 | 新しいビジネスモデル開発 | 「革新的なイベント企画」「次世代型企画」 |
| **株式会社アップランド** | 番組制作・プロデュース | ドラマ・バラエティ制作 | 「番組とのコラボイベント」「アーティスト連携」 |
| **株式会社TOROMI PRODUCE** | 映像制作・プロデュース | CMや映像作品制作 | 「映像配信イベント」「映像アート展示」 |
| **株式会社MGスポーツ** | スポーツマネジメント・イベント | アスリート管理、スポーツイベント | 「スポーツタレント出演イベント」「アスリート連携企画」 |
| **株式会社Zipang** | グローバルコンテンツ | 国際的なコンテンツ企画 | 「国際イベント」「海外配信」 |
| **Vogaro株式会社** | VR・映像技術 | VR映像制作、先端映像技術 | 「VR体験イベント」「先進映像配信」 |
| **株式会社ひなたライフ** | ライフスタイルコンテンツ | 生活、食、ファッション関連企画 | 「ライフスタイルイベント」「食のイベント」「ファッションショー」 |

---

### **願い（Wish）入力フォームの「部門」セレクトボックス**

実装時に以下のような UI を提供：

```typescript
const companyOptions = [
  { value: "maimai_hoso", label: "株式会社毎日放送" },
  { value: "mbs_radio", label: "株式会社MBSラジオ" },
  { value: "gaora", label: "株式会社GAORA" },
  { value: "mbs_planning", label: "株式会社MBS企画" },
  { value: "broadcast_movies", label: "株式会社放送映画製作所" },
  { value: "mirika_music", label: "株式会社ミリカ・ミュージック" },
  { value: "mbs_facilities", label: "株式会社MBSファシリティーズ" },
  { value: "picoli", label: "株式会社ピコリ" },
  { value: "mbs_live_ent", label: "株式会社MBSライブエンターテインメント" },
  { value: "yami", label: "株式会社闇" },
  { value: "mbs_innovation", label: "株式会社MBSイノベーションドライブ" },
  { value: "upland", label: "株式会社アップランド" },
  { value: "toromi_produce", label: "株式会社TOROMI PRODUCE" },
  { value: "mg_sports", label: "株式会社MGスポーツ" },
  { value: "zipang", label: "株式会社Zipang" },
  { value: "vogaro", label: "Vogaro株式会社" },
  { value: "hinata_life", label: "株式会社ひなたライフ" },
];
```

---

### **マスターデータ化（masterCompanyData.ts 拡張）**

願いボードで各グループ会社が「やりたいこと」を入力する際に、
これらの会社情報をドロップダウンで選択可能にします。

```typescript
// src/data/masterCompanyData.ts に追加
interface GroupCompany {
  id: string;                    // "company_mbs_tv"
  name: string;                  // "MBSテレビ"
  parentGroup: string;           // "MBSホールディングス"
  businessArea: string[];        // ["映像制作", "放送"]
  description: string;           // 事業説明
  teamColor: string;             // UI での色分け用 (#FF6B6B など)
}

export const groupCompanies: GroupCompany[] = [
  {
    id: "company_maimai_hoso",
    name: "株式会社毎日放送",
    parentGroup: "MBSホールディングス",
    businessArea: ["映像制作", "放送", "イベント企画"],
    description: "テレビ番組制作、グループの中核",
    teamColor: "#FF6B6B",
  },
  {
    id: "company_mbs_radio",
    name: "株式会社MBSラジオ",
    parentGroup: "MBSホールディングス",
    businessArea: ["ラジオ放送", "音声配信"],
    description: "ラジオ番組制作（ごぶごぶ、プレバト等）",
    teamColor: "#4ECDC4",
  },
  {
    id: "company_gaora",
    name: "株式会社GAORA",
    parentGroup: "MBSホールディングス",
    businessArea: ["スポーツ放送", "配信"],
    description: "スポーツコンテンツ専門",
    teamColor: "#95E1D3",
  },
  {
    id: "company_mbs_planning",
    name: "株式会社MBS企画",
    parentGroup: "MBSホールディングス",
    businessArea: ["イベント企画", "制作"],
    description: "大規模イベント企画立案",
    teamColor: "#F38181",
  },
  {
    id: "company_broadcast_movies",
    name: "株式会社放送映画製作所",
    parentGroup: "MBSホールディングス",
    businessArea: ["映像制作", "映画化"],
    description: "番組から映画化、映像コンテンツ制作",
    teamColor: "#AA96DA",
  },
  {
    id: "company_mirika_music",
    name: "株式会社ミリカ・ミュージック",
    parentGroup: "MBSホールディングス",
    businessArea: ["音楽制作", "プロデュース"],
    description: "楽曲制作、アーティスト管理",
    teamColor: "#FCBAD3",
  },
  {
    id: "company_mbs_facilities",
    name: "株式会社MBSファシリティーズ",
    parentGroup: "MBSホールディングス",
    businessArea: ["施設管理", "保守"],
    description: "スタジオ・施設の管理運営",
    teamColor: "#A8D8EA",
  },
  {
    id: "company_picoli",
    name: "株式会社ピコリ",
    parentGroup: "MBSホールディングス",
    businessArea: ["デジタル", "WEB制作"],
    description: "ウェブサイト・デジタルコンテンツ制作",
    teamColor: "#FFC93C",
  },
  {
    id: "company_mbs_live_ent",
    name: "株式会社MBSライブエンターテインメント",
    parentGroup: "MBSホールディングス",
    businessArea: ["ライブイベント", "コンサート企画"],
    description: "コンサート・ライブイベント企画",
    teamColor: "#FF85A1",
  },
  {
    id: "company_yami",
    name: "株式会社闇",
    parentGroup: "MBSホールディングス",
    businessArea: ["エンターテイメント", "イベント企画"],
    description: "独特なコンセプトのイベント制作",
    teamColor: "#2C3E50",
  },
  {
    id: "company_mbs_innovation",
    name: "株式会社MBSイノベーションドライブ",
    parentGroup: "MBSホールディングス",
    businessArea: ["新規事業", "スタートアップ支援"],
    description: "新しいビジネスモデル開発",
    teamColor: "#16A085",
  },
  {
    id: "company_upland",
    name: "株式会社アップランド",
    parentGroup: "MBSホールディングス",
    businessArea: ["番組制作", "プロデュース"],
    description: "ドラマ・バラエティ制作",
    teamColor: "#C0392B",
  },
  {
    id: "company_toromi_produce",
    name: "株式会社TOROMI PRODUCE",
    parentGroup: "MBSホールディングス",
    businessArea: ["映像制作", "プロデュース"],
    description: "CMや映像作品制作",
    teamColor: "#8E44AD",
  },
  {
    id: "company_mg_sports",
    name: "株式会社MGスポーツ",
    parentGroup: "MBSホールディングス",
    businessArea: ["スポーツマネジメント", "イベント"],
    description: "アスリート管理、スポーツイベント",
    teamColor: "#27AE60",
  },
  {
    id: "company_zipang",
    name: "株式会社Zipang",
    parentGroup: "MBSホールディングス",
    businessArea: ["グローバルコンテンツ", "国際企画"],
    description: "国際的なコンテンツ企画",
    teamColor: "#2980B9",
  },
  {
    id: "company_vogaro",
    name: "Vogaro株式会社",
    parentGroup: "MBSホールディングス",
    businessArea: ["VR", "映像技術"],
    description: "VR映像制作、先端映像技術",
    teamColor: "#E74C3C",
  },
  {
    id: "company_hinata_life",
    name: "株式会社ひなたライフ",
    parentGroup: "MBSホールディングス",
    businessArea: ["ライフスタイル", "コンテンツ"],
    description: "生活、食、ファッション関連企画",
    teamColor: "#F39C12",
  },
];
```

---

### **マッチング時の企業間シナジー判定**

各企業の強みを活かしたマッチング例：

```
願い① 「音楽フェスをやりたい」（MBS企画）
   ×
願い② 「VR配信イベントをやりたい」（MBS映像）
   ↓
マッチング結果: 「VR配信対応音楽フェス」
提案企業: MBSテレビ（放映権）+ グッズ制作班（記念グッズ）

願い③ 「お化け屋敷イベントをやりたい」（闇）
   ×
願い④ 「キッチンカーを出したい」（MBS営業）
   ↓
マッチング結果: 「キッチンカー併設お化け屋敷」
提案企業: 日向ライフ（ライフスタイル視点）
```

---

### **表示例: 願いのタグに会社名を付与**

```
┌─────────────────────────────────┐
│ 🎪 音楽フェスをやりたい          │
│ ─────────────────────────────   │
│ 【MBS企画】                      │  ← グループ会社タグ
│                                 │
│ キーワード:                      │
│ #音楽 #フェス #大規模           │
│                                 │
│ 提案者: 山田太郎 ⭐⭐          │
└─────────────────────────────────┘
```

このセクションにより、**MBSグループ全体での統合イベント企画** が容易になります。

---

## 📊 デモデータ生成戦略（Phase 1.5）

### **30人の人物データ配置（案B: 大企業多部門型）**

```
【MBS TV】5-6人
├─ 営業部：山田太郎（importance: 4）
│  expertise: ["営業", "予算管理", "企画"]
│  company: "mbs_tv"
├─ 企画部：佐藤花子（importance: 3）
│  expertise: ["企画", "マーケティング", "制作"]
├─ 制作部：鈴木太郎（既存, importance: 2）✅
│  expertise: ["グッズ制作", "ブランディング"]
├─ テレビ制作：新規①（importance: 1）
│  expertise: ["映像編集", "放映企画"]
├─ 技術部：新規②（importance: 2）
│  expertise: ["映像制作", "配信技術"]
└─ CEO補佐：重鎮①（importance: 5）
   expertise: ["経営戦略", "大型企画", "予算管理"]

【MBSラジオ】3-4人
├─ 制作部：田中花子（既存, importance: 3）✅
│  expertise: ["ラジオ制作", "音声編集", "番組制作"]
├─ グッズ班：佐藤次郎（既存, importance: 2）✅
│  expertise: ["グッズ制作", "デザイン", "営業"]
├─ 営業：山本美咲（既存, importance: 3）✅
│  expertise: ["営業", "イベント運営", "企画"]
└─ ディレクター：新規③（importance: 2）
   expertise: ["番組制作", "タレント管理"]

【Vogaro - VR/テック専門】3人
├─ CTO：高橋太郎（importance: 5）⭐⭐⭐⭐⭐
│  expertise: ["VR技術", "映像制作", "先端技術", "配信"]
│  company: "vogaro"
│  pastProjects: ["VR体験施設", "4K配信システム", "XR イベント"]
├─ マーケター：新規④（importance: 2）
│  expertise: ["SNS", "デジタルマーケティング"]
└─ 営業：新規⑤（importance: 1）
   expertise: ["営業", "提案営業"]

【闇 - エンタメ/ニッチ】2-3人
├─ CEO：重鎮②（importance: 5）
│  expertise: ["企画", "エンターテイメント", "予算管理"]
│  company: "yami"
│  pastProjects: ["お化け屋敷", "没入型イベント", "大規模舞台"]
└─ プロデューサー：新規⑥（importance: 2）
   expertise: ["企画", "没入体験", "演出"]

【その他13社】各1-2人
├─ GAORA：新規⑦（importance: 2）
│  expertise: ["スポーツ企画", "配信"]
├─ MBS企画：新規⑧（importance: 3）
│  expertise: ["大型イベント", "企画", "予算管理"]
├─ 放送映画：新規⑨（importance: 2）
│  expertise: ["映像制作", "映画化", "配信"]
├─ ミリカ・ミュージック：新規⑩（importance: 3）
│  expertise: ["音楽制作", "アーティスト管理"]
├─ MBSファシリティーズ：新規⑪（importance: 2）
│  expertise: ["施設管理", "会場運営"]
├─ ピコリ：新規⑫（importance: 1）
│  expertise: ["デジタル", "Web制作", "オンライン配信"]
├─ MBSライブエンターテインメント：新規⑬（importance: 3）
│  expertise: ["ライブイベント", "コンサート企画"]
├─ MBSイノベーションドライブ：新規⑭（importance: 2）
│  expertise: ["新規事業", "スタートアップ支援"]
├─ アップランド：新規⑮（importance: 2）
│  expertise: ["番組制作", "バラエティ", "タレント"]
├─ TOROMI PRODUCE：新規⑯（importance: 1）
│  expertise: ["映像制作", "CM制作"]
├─ MGスポーツ：新規⑰（importance: 2）
│  expertise: ["スポーツマネジメント", "アスリート管理"]
├─ Zipang：新規⑱（importance: 1）
│  expertise: ["グローバルコンテンツ", "国際企画"]
└─ ひなたライフ：新規⑲（importance: 2）
   expertise: ["ライフスタイル", "食企画", "通販番組"]

【合計】既存5人 + 新規25人 = 30人
重鎮（importance 4-5）：3人（10%）
中堅（importance 3）：7人（23%）
若手（importance 1-2）：20人（67%）
```

---

### **30個の願いデータ配置戦略**

#### **テーマ別配置**

```
【フェス系】8個
├─ 「音楽フェスをやりたい」（MBS企画）
├─ 「異業種コラボ音楽フェス」（ミリカ・ミュージック）
├─ 「ごぶごぶフェスを拡大版で」（MBSラジオ）
├─ 「推しフェスの規模拡大」（毎日放送アニメ）
├─ 「食FES / はらぺこサーカス」（TOROMI PRODUCE）
├─ 「ライブコンサート＋グッズ販売」（MBSライブエンターテインメント）
├─ 「スポーツイベント開催」（GAORA）
└─ 「グローバルなミュージックフェスティバル」（Zipang）

【配信・VR系】7個
├─ 「VR配信イベントをやりたい」（放送映画）
├─ 「VR体験会 + お化け屋敷」（闇 × Vogaro コラボ案）
├─ 「4K配信による大規模同時中継」（MBS TV + 放送映画）
├─ 「イベントのSNSマーケティング」（Vogaro）
├─ 「オンライン＆オフラインハイブリッド配信」（ピコリ）
├─ 「ライブ配信での360度映像体験」（Vogaro + MBS TV）
└─ 「先端映像を使った新型イベント」（TOROMI PRODUCE）

【グッズ・物販系】5個
├─ 「らじおんチャンコラボグッズ」（グッズ制作班）
├─ 「各フェスの限定グッズ販売」（グッズ制作班 + MBSライブ）
├─ 「若者向け通販番組」（ひなたライフ）
├─ 「ポップアップショップ展開」（グッズ制作班 + ひなたライフ）
└─ 「オンラインストア × 物販コーナー」（グッズ制作班 + ピコリ）

【IP・エンタメ系】4個
├─ 「Vtuberを起用したイベント」（アップランド）
├─ 「番組タイアップのコラボイベント」（アップランド + MBS TV）
├─ 「アニメIP集合イベント」（毎日放送アニメ）
└─ 「タレント＆インフルエンサーイベント」（MGスポーツ + MBS企画）

【ニッチ・独立系】6個
├─ 「大規模お化け屋敷（夏企画）」（闇）
├─ 「食の企画を売りに出す」（毎日放送制作部）
├─ 「施設を活用したイベント」（MBSファシリティーズ）
├─ 「革新的な次世代型イベント」（MBSイノベーション）
├─ 「業務用グッズ販売＆B2B営業」（グッズ制作班）
└─ 「シニア層向けの新型通販」（ひなたライフ）
```

#### **願いの粒度パターン**

```
【単一テーマ型】（15個）
"VR配信イベントをやりたい"
→ keywords: ["VR", "配信", "技術", "没入感"]

【複合・拡張型】（10個）
"フェスをやりたい、VR配信も組み合わせたい"
→ keywords: ["フェス", "VR", "配信", "大規模", "配信技術"]

【野心型・統合案】（5個）
"配信、グッズ、イベント、全部やって、MBSグループ全体での大型プロジェクト化したい"
→ keywords: ["総合企画", "グループ統合", "複数部門", "大型プロジェクト", "シナジー"]
```

---

### **コメント構造の設計**

```
願い①: 「音楽フェスをやりたい」（MBS企画）
  ├─ コメント①: 高橋太郎（Vogaro CTO）
  │  "VR配信対応にしたら面白いと思う"
  ├─ コメント②: 山田太郎（MBS TV 営業）
  │  "テレビ放映権もセットでいきましょう"
  └─ コメント③: グッズ制作班（佐藤次郎）
     "限定グッズ販売もできます！"

願い②: 「VR配信イベントをやりたい」（放送映画）
  ├─ コメント①: 高橋太郎（Vogaro CTO）⭐ 共通
     "VR技術の最新活用ですね。ぜひやりましょう"
  ├─ コメント②: ピコリの新規①（デジタル専門）
     "オンライン配信とセットで"
  └─ コメント③: 山本美咲（MBSラジオ営業）
     "ラジオでもプロモーションします"

↓ マッチング検出
→ 共通キーワード: [VR, 配信]
→ 共通コメント者: 高橋太郎（Vogaro CTO）
→ マッチスコア: 85%
→ 提案チーム: 高橋 + 山田 + グッズ班 + ピコリ
```

---

### **デモデータ生成ファイル（Phase 1.5で作成）**

```typescript
// src/data/demoWishs.ts
export const demoWishs: Wish[] = [
  {
    id: "wish_001",
    title: "音楽フェスをやりたい",
    description: "夏に大規模な音楽フェスを企画したい。複数部門の力を集めたい。",
    keywords: ["音楽", "フェス", "大規模", "夏"],
    author: "山田太郎",
    companyId: "mbs_planning",
    importance: 4,
    createdAt: new Date(),
    position: { x: 100, y: 100 },
    size: { width: 280, height: 180 },
    zIndex: 1,
    comments: [
      {
        id: "comment_001_001",
        wishId: "wish_001",
        authorId: "person_vogaro_cto",  // 高橋太郎
        content: "VR配信対応にしたら面白いと思う！",
        timestamp: new Date(),
      },
      // ... 他のコメント
    ],
  },
  // ... 29個の願い
];

// src/data/masterPersonDataExpanded.ts
export const masterPersonDataExpanded: PersonMemo[] = [
  // 既存5人
  ...masterPersonData,

  // 新規25人
  {
    id: "person_yamada_taro",
    name: "山田太郎",
    department: "営業部",
    company: "mbs_tv",
    expertise: ["営業", "予算管理", "企画"],
    email: "yamada.taro@mbs.co.jp",
    phone: "090-XXXX-XXXX",
    importance: 4,
    pastProjects: ["ごぶごぶFES", "テレビ放映権企画"],
  },
  // ... 24人追加
];
```

---

### **実装タイムライン（推奨）**

```
Week 1-2: Phase 1 MVP
  → 願い登録・配置・削除の基本機能完成

Week 3: Phase 1.5 前半
  → 30人のマスターデータ作成
  → コメント機能（UI/UX）実装開始

Week 4: Phase 1.5 後半
  → コメント機能完成
  → 30個の願いデモデータ作成
  → ブレストボード「完全版」リリース

Week 5-6: Phase 2
  → マッチング自動検出
  → Tab 2: マッチング結果表示

Week 7-8: Phase 3
  → チーム自動形成
  → 専用スペース作成
```

このアプローチにより、ユーザーは自然なブレスト体験を得られます！
