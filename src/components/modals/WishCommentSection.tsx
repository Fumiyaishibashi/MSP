import React, { useContext } from 'react';
import type { WishComment, PersonMemo } from '../../types';
import { AppContext } from '../../context/AppContext';
import { Trash2 } from 'lucide-react';

interface WishCommentSectionProps {
  wishId: string;
  comments: WishComment[];
  currentUser: PersonMemo;
  onShowAuthorDetail: (personId: string) => void;
}

/**
 * 願いに対するコメント一覧を表示するコンポーネント
 * - コメント者の情報を表示
 * - 時系列順にソート
 * - 削除ボタン（同じユーザーのみ）
 * - 著者名クリック → 人物詳細表示
 */
const WishCommentSection: React.FC<WishCommentSectionProps> = ({
  wishId,
  comments,
  currentUser,
  onShowAuthorDetail,
}) => {
  const context = useContext(AppContext);

  if (!context) return null;

  const { deleteWishComment, personMemos } = context;

  // コメントを時系列順にソート
  const sortedComments = [...comments].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  // 時間差を人間が読みやすい形に変換
  const getTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    if (minutes > 0) return `${minutes}分前`;
    return '今さっき';
  };

  // コメント者の人物情報を取得
  const getAuthorName = (authorId: string): string => {
    const person = personMemos.find((p) => p.id === authorId);
    return person?.name || '不明なユーザー';
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('このコメントを削除しますか？')) {
      deleteWishComment(wishId, commentId);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <p className="text-sm">コメントがまだありません</p>
        <p className="text-xs mt-1">最初のコメントを書いてみましょう！</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-bold text-gray-700 mb-2">
        💬 コメント ({comments.length}件)
      </div>

      {sortedComments.map((comment) => (
        <div
          key={comment.id}
          className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
        >
          {/* コメント者情報行 */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => onShowAuthorDetail(comment.authorId)}
              className="text-sm font-semibold text-blue-600 hover:underline hover:text-blue-800 transition-colors"
            >
              👤 {comment.authorName || getAuthorName(comment.authorId)}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {getTimeAgo(comment.timestamp)}
              </span>
              {/* 削除ボタン（同じユーザーのみ） */}
              {comment.authorId === currentUser.id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                  title="コメントを削除"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              )}
            </div>
          </div>

          {/* コメント内容 */}
          <p className="text-sm text-gray-700 leading-relaxed break-words">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default WishCommentSection;
