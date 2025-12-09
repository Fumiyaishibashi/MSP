# Phase 1.5 実装計画書
## コメント機能 + 30人データ + 30願いデータ統合

**最終更新**: 2025-12-04
**実装目標期間**: 1.5週間（Week 3-4）
**現在の状態**: Phase 1 ✅ 完了 → Phase 1.5 🔨 実装中

---

## 📊 現状サマリー

### ✅ 実装済み（本日）
```
1. masterPersonDataExpanded.ts
   - 30人の完全なマスターデータ生成 ✅
   - company フィールド追加 ✅
   - importance レベル設定済み ✅

2. demoWishs.ts
   - 30個の願い完全生成 ✅
   - テーマ別配置（8+7+5+4+6） ✅
   - 各願いに3-5件のコメント付与 ✅

3. types/index.ts 拡張
   - PersonMemo に company/importance 追加 ✅
   - WishComment インターフェース追加 ✅
   - Wish に comments フィールド追加 ✅

4. AppContext.tsx 拡張
   - addWishComment() 実装 ✅
   - deleteWishComment() 実装 ✅
   - getWishComments() 実装 ✅
   - localStorage 対応 ✅

5. BrainstormCanvas.tsx 更新
   - コメント数バッジ表示追加 ✅
   - ビルド成功 ✅

6. データ整合性
   - masterPersonData.ts 更新（7人分フィールド追加） ✅
   - EventCanvas.tsx 修正（PersonMemo作成時） ✅
   - demoCurrentUser 更新 ✅
```

### ❌ 未実装（Phase 1.5 残りタスク）
```
1. コメント表示UI
   - WishCommentSection.tsx (コメント一覧表示)
   - コメント者名クリック → 人物詳細モーダル

2. コメント入力UI
   - WishCommentForm.tsx (コメント入力フォーム)
   - currentUser による自動著者設定

3. 願い詳細パネル
   - WishDetailPanel.tsx (願い詳細表示)
   - BrainstormCanvas との統合
   - クリック → パネル表示フロー

4. 画面統合
   - BrainstormCanvas での願いクリック → 詳細パネル表示
   - コメント機能の完全統合
   - ビジュアルテスト
```

---

## 🏗️ 実装ステップ（段階的）

### **ステップ 1: コメント表示コンポーネント実装**
**期間**: 2日
**目的**: コメント機能の読み取り側UI完成

#### タスク 1-1: WishCommentSection.tsx 作成
- [ ] コンポーネント新規作成
- [ ] Props: `wishId: string`, `comments: WishComment[]`
- [ ] コメント一覧表示（時系列順）
- [ ] 各コメントに著者名表示
- [ ] 著者名クリック → PersonDetailModal 表示（Hook化）
- [ ] 削除ボタン（currentUser と作成者が同じ場合のみ表示）
- [ ] スタイリング（Tailwind）

**実装ポイント**:
```typescript
// WishCommentSection.tsx 構造
interface WishCommentSectionProps {
  wishId: string;
  comments: WishComment[];
  onDeleteComment: (commentId: string) => void;
  onShowAuthorDetail: (personId: string) => void;  // PersonDetailModal へ
}

// レイアウト
┌─────────────────────┐
│ コメント (3件)      │
├─────────────────────┤
│ 👤 著者①             │  ← クリックで詳細表示
│ コメント内容...      │
│ 1時間前 [削除]       │
├─────────────────────┤
│ 👤 著者②             │
│ コメント内容...      │
│ 2時間前              │
└─────────────────────┘
```

---

#### タスク 1-2: WishCommentForm.tsx 作成
- [ ] コンポーネント新規作成
- [ ] Props: `wishId: string`, `currentUser: PersonMemo`
- [ ] テキストエリア入力（200字上限）
- [ ] 送信ボタン
- [ ] 入力検証（空文字列チェック）
- [ ] 送信成功後フォームリセット
- [ ] useContext(AppContext) で addWishComment 呼び出し

**実装ポイント**:
```typescript
// WishCommentForm.tsx 構造
interface WishCommentFormProps {
  wishId: string;
  currentUser: PersonMemo;
  onCommentAdded?: () => void;  // 送信後のコールバック
}

// レイアウト
┌─────────────────────┐
│ 👤 著者名（自動）   │
├─────────────────────┤
│ [テキストエリア]    │
│ (200字上限)          │
├─────────────────────┤
│ [送信] [キャンセル] │
└─────────────────────┘
```

---

### **ステップ 2: 願い詳細パネルの実装**
**期間**: 2日
**目的**: 願い詳細表示 + コメント統合UI

#### タスク 2-1: WishDetailPanel.tsx 作成
- [ ] コンポーネント新規作成
- [ ] Props: `wish: Wish`, `onClose: () => void`, `currentUser: PersonMemo`
- [ ] 願い情報表示
  - タイトル、説明、キーワード、著者
  - 企業、重要度、作成日時
- [ ] WishCommentSection 統合
- [ ] WishCommentForm 統合
- [ ] 削除ボタン（願い削除、currentUser との比較）
- [ ] 全体的なスタイリング（モーダルパネル風）

**実装ポイント**:
```typescript
// WishDetailPanel.tsx 構造
interface WishDetailPanelProps {
  wish: Wish;
  currentUser: PersonMemo;
  onClose: () => void;
  onDeleteWish: (wishId: string) => void;
  onDeleteComment: (wishId: string, commentId: string) => void;
}

// レイアウト
┌─────────────────────────────────┐
│ ✕ 願い詳細パネル                 │
├─────────────────────────────────┤
│ 【願い情報】                    │
│ タイトル: 音楽フェスをやりたい   │
│ 企業: MBS企画                   │
│ キーワード: #音楽 #フェス ...   │
│ 重要度: 4/5                     │
│ 著者: 山田太郎                  │
├─────────────────────────────────┤
│ 【コメント一覧】                │
│ WishCommentSection ← 統合      │
├─────────────────────────────────┤
│ 【新規コメント入力】            │
│ WishCommentForm ← 統合         │
├─────────────────────────────────┤
│ [削除] [閉じる]                 │
└─────────────────────────────────┘
```

---

#### タスク 2-2: React Portal でモーダル化
- [ ] WishDetailPanel を createPortal で document.body に描画
- [ ] 背景ダークオーバーレイ表示
- [ ] ESC キーで閉じる（useEffect で addEventListener）
- [ ] 背景クリックで閉じる

---

### **ステップ 3: BrainstormCanvas との統合**
**期間**: 1.5日
**目的**: 願いクリック → 詳細パネル表示フロー

#### タスク 3-1: BrainstormCanvas.tsx 拡張
- [ ] 願い付箋をクリック可能に
- [ ] 状態追加: `selectedWishId: string | null`
- [ ] 状態追加: `showWishDetail: boolean`
- [ ] クリックハンドラ: 願い付箋クリック → パネル表示
- [ ] 詳細パネルの開閉制御

**実装ポイント**:
```typescript
// BrainstormCanvas.tsx に追加
const [selectedWishId, setSelectedWishId] = useState<string | null>(null);
const [showWishDetail, setShowWishDetail] = useState(false);

const handleWishClick = (wishId: string) => {
  setSelectedWishId(wishId);
  setShowWishDetail(true);
};

// JSX に追加
{showWishDetail && selectedWishId && (
  <WishDetailPanel
    wish={wishs.find(w => w.id === selectedWishId)!}
    currentUser={context.currentUser}
    onClose={() => setShowWishDetail(false)}
    onDeleteWish={context.deleteWish}
    onDeleteComment={context.deleteWishComment}
  />
)}
```

#### タスク 3-2: 願い付箋のクリックイベント修正
- [ ] Rnd コンポーネントのクリック処理を修正
  - ドラッグモード時はクリック判定しない
  - 通常モード時のみ詳細パネル表示
- [ ] イベント伝播（stopPropagation）の制御

---

### **ステップ 4: PersonDetailModal 拡張（コメント者詳細表示）**
**期間**: 1日
**目的**: コメント者をクリック → 人物詳細表示

#### タスク 4-1: 既存 PersonDetailModal との連携
- [ ] WishCommentSection からコメント者をクリック
- [ ] → PersonDetailModal に該当 PersonMemo を渡して表示
- [ ] 既存ロジック（メール・電話コピー）を活用
- [ ] expertise フィールド表示追加

**実装ポイント**:
```typescript
// WishCommentSection.tsx で
<button
  onClick={() => onShowAuthorDetail(comment.authorId)}
  className="text-blue-600 hover:underline"
>
  {comment.authorName}
</button>

// BrainstormCanvas.tsx で
const [selectedPersonForDetail, setSelectedPersonForDetail] = useState<PersonMemo | null>(null);

{selectedPersonForDetail && (
  <PersonDetailModal
    person={selectedPersonForDetail}
    onClose={() => setSelectedPersonForDetail(null)}
  />
)}
```

---

### **ステップ 5: 統合テスト & ビジュアル調整**
**期間**: 1.5日
**目的**: 全機能が正常に動作することを確認

#### タスク 5-1: 機能テスト
- [ ] 願いをクリック → 詳細パネル表示 ✓
- [ ] コメント一覧表示 ✓
- [ ] コメント者名クリック → 人物詳細表示 ✓
- [ ] コメント送信 → リアルタイム反映 ✓
- [ ] コメント削除 → リアルタイム反映 ✓
- [ ] localStorage に自動保存 ✓
- [ ] ページリロード → データ復元 ✓

#### タスク 5-2: ビジュアルテスト
- [ ] コメント欄のスタイリング確認
- [ ] 詳細パネルのレイアウト確認
- [ ] モーダルの背景ダークオーバーレイ確認
- [ ] レスポンシブ対応確認（1024px以下）
- [ ] ダークモード対応（必要に応じて）

#### タスク 5-3: パフォーマンステスト
- [ ] 30願い × 平均5コメント = 150コメント
- [ ] レンダリング速度確認（遅延なし）
- [ ] メモリ使用量確認

---

## 🔍 実装順序の依存関係

```
ステップ1（コメント表示）
├─ WishCommentSection.tsx
└─ WishCommentForm.tsx
   ↓
ステップ2（詳細パネル）
├─ WishDetailPanel.tsx
└─ Portal + Modal化
   ↓
ステップ3（Canvas統合）
├─ BrainstormCanvas クリック処理
└─ パネル開閉制御
   ↓
ステップ4（人物詳細）
├─ PersonDetailModal との連携
   ↓
ステップ5（統合テスト）
├─ 全機能テスト
└─ ビジュアル & パフォーマンステスト
```

**注意**: ステップ1と2は並列実装可能だが、ステップ3以降は順序が必須

---

## ⚠️ リスク & 対策

| リスク | 影響 | 対策 |
|--------|------|------|
| React Portal の z-index 衝突 | 🟡 中 | modal-root div を HTML に追加 |
| コメント削除の同時実行バグ | 🟡 中 | optimistic update + error handling |
| ドラッグ中のクリック誤検知 | 🟡 中 | Rnd の isDragging フラグで判定 |
| PersonDetailModal との重複表示 | 🟢 低 | 状態を一元管理（AppContext）化 |
| localStorage サイズ超過 | 🟢 低 | 150コメント程度なら問題なし（<1MB） |

---

## 📋 チェックリスト（ステップ毎）

### ステップ 1
- [ ] WishCommentSection.tsx コンポーネント作成
- [ ] WishCommentForm.tsx コンポーネント作成
- [ ] 入力検証実装
- [ ] ビルド確認

### ステップ 2
- [ ] WishDetailPanel.tsx コンポーネント作成
- [ ] Portal でモーダル化
- [ ] スタイリング完成
- [ ] ビルド確認

### ステップ 3
- [ ] BrainstormCanvas に selectedWishId 状態追加
- [ ] 詳細パネルの開閉制御
- [ ] クリックイベント修正
- [ ] ドラッグ vs クリック判定
- [ ] ビルド確認

### ステップ 4
- [ ] PersonDetailModal との連携確認
- [ ] コメント者クリック → 詳細表示
- [ ] ビルド確認

### ステップ 5
- [ ] 全機能テスト（5項目以上）
- [ ] ビジュアルテスト
- [ ] パフォーマンステスト
- [ ] npm run build 成功
- [ ] **ローカルテスト完了 ✓**

---

## 🎯 成功基準

✅ **すべてのステップが完了したら Phase 1.5 完成**

- 願いをクリック → コメント詳細が見える
- コメント送信 → リアルタイム反映
- コメント者名クリック → 人物詳細が見える
- localStorage 自動保存
- ビルド成功 (`npm run build`)
- ビジュアルが統一されている

---

## 📅 実装タイムラインの目安

```
Day 1-2（ステップ 1）: コメント表示 UI
  → WishCommentSection + WishCommentForm 完成

Day 3-4（ステップ 2）: 詳細パネル
  → WishDetailPanel 完成 + Portal化

Day 5（ステップ 3）: Canvas 統合
  → クリック処理 + パネル開閉

Day 6（ステップ 4）: 人物詳細連携
  → PersonDetailModal 連携

Day 7-8（ステップ 5）: テスト & 調整
  → 統合テスト + ビジュアル調整

目標: **8日で Phase 1.5 完成** ✅
```

---

## 🚀 次のアクション

1. **ステップ 1-1 開始**: WishCommentSection.tsx 実装開始
2. **並列**: ステップ 1-2: WishCommentForm.tsx 実装
3. **品質確保**: ビルド & ローカルテスト を各ステップ完了時に実施
4. **問題発見**: 依存関係の齟齬がないか確認しながら進める

