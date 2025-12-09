import React, { useState, useContext } from 'react';
import type { PersonMemo } from '../../types';
import { AppContext } from '../../context/AppContext';
import { Send } from 'lucide-react';

interface WishCommentFormProps {
  wishId: string;
  currentUser: PersonMemo;
  onCommentAdded?: () => void;
}

/**
 * 願いにコメントを追加するフォーム
 * - currentUser により著者は自動設定
 * - 200字上限の入力検証
 * - 送信後にフォームをリセット
 */
const WishCommentForm: React.FC<WishCommentFormProps> = ({
  wishId,
  currentUser,
  onCommentAdded,
}) => {
  const context = useContext(AppContext);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!context) return null;

  const { addWishComment } = context;

  const MAX_LENGTH = 200;
  const remainingChars = MAX_LENGTH - commentText.length;
  const isValid = commentText.trim().length > 0 && remainingChars >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!commentText.trim()) {
      setError('コメントを入力してください');
      return;
    }

    if (commentText.length > MAX_LENGTH) {
      setError(`${MAX_LENGTH}字以内でお願いします`);
      return;
    }

    // 送信処理
    setIsSubmitting(true);
    try {
      addWishComment(
        wishId,
        currentUser.id,
        currentUser.name,
        commentText.trim()
      );

      // リセット
      setCommentText('');
      setError('');

      // コールバック実行
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      setError('コメント送信に失敗しました');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="text-sm font-bold text-gray-700">
        ✏️ コメントを追加
      </div>

      {/* 著者名表示 */}
      <div className="text-xs text-gray-600 px-2">
        投稿者: <span className="font-semibold">{currentUser.name}</span> ({currentUser.department})
      </div>

      {/* テキストエリア */}
      <textarea
        value={commentText}
        onChange={(e) => {
          setCommentText(e.target.value);
          if (error) setError(''); // エラーをクリア
        }}
        placeholder="コメントを入力してください（200字以内）..."
        maxLength={MAX_LENGTH}
        rows={3}
        className={`w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none transition-colors ${
          error
            ? 'border-red-300 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:ring-2 focus:ring-blue-200'
        }`}
        disabled={isSubmitting}
      />

      {/* 文字数カウント */}
      <div
        className={`text-xs text-right ${
          remainingChars < 20 && remainingChars >= 0
            ? 'text-orange-600 font-bold'
            : remainingChars < 0
            ? 'text-red-600 font-bold'
            : 'text-gray-500'
        }`}
      >
        {Math.max(0, remainingChars)} 字残り
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
          ⚠️ {error}
        </div>
      )}

      {/* 送信ボタン */}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            isValid && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send size={14} />
          {isSubmitting ? '送信中...' : '送信'}
        </button>
        <button
          type="button"
          onClick={() => {
            setCommentText('');
            setError('');
          }}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
        >
          クリア
        </button>
      </div>
    </form>
  );
};

export default WishCommentForm;
