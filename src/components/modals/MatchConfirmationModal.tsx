import React from 'react';
import Modal from '../ui/Modal';
import type { Wish } from '../../types';

interface MatchConfirmationModalProps {
  wish1: Wish;
  wish2?: Wish; // グループ追加の場合は undefined
  distance: number;
  onConfirm: () => void;
  onCancel: () => void;
  mode?: 'new-match' | 'add-to-group'; // モード追加
  groupWishCount?: number; // グループに既に含まれているメモの数
}

const MatchConfirmationModal: React.FC<MatchConfirmationModalProps> = ({
  wish1,
  wish2,
  distance,
  onConfirm,
  onCancel,
  mode = 'new-match',
  groupWishCount = 0,
}) => {
  const title = mode === 'add-to-group'
    ? 'このメモをグループに追加しますか？'
    : 'これらのメモをマッチングしますか？';

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={title}
      size="large"
    >
      <div className="space-y-6">
        {mode === 'add-to-group' ? (
          // グループ追加モード
          <div className="space-y-4">
            {/* 追加するメモ */}
            <div className="p-4 border-2 border-yellow-300 rounded-lg bg-yellow-50">
              <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">
                {wish1.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                {wish1.description}
              </p>
              <p className="text-xs text-gray-500 mt-2 font-semibold">
                👤 {wish1.author}
              </p>
            </div>

            {/* グループ情報 */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">↓ 既存のグループに追加</span>
              </p>
              <p className="text-xs text-gray-600 mt-2">
                現在 <span className="font-bold text-blue-700">{groupWishCount}個</span> のメモがマッチしています
              </p>
            </div>

            {/* 距離情報 */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">グループまでの距離:</span> {Math.round(distance)}px
              </p>
            </div>
          </div>
        ) : (
          // 1対1マッチモード
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              {/* メモ1 */}
              <div className="flex-1 p-4 border-2 border-yellow-300 rounded-lg bg-yellow-50">
                <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">
                  {wish1.title}
                </h3>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                  {wish1.description}
                </p>
                <p className="text-xs text-gray-500 mt-2 font-semibold">
                  👤 {wish1.author}
                </p>
              </div>

              {/* 接続表示 */}
              <div className="flex items-center justify-center pt-2">
                <span className="text-3xl">🔗</span>
              </div>

              {/* メモ2 */}
              {wish2 && (
                <div className="flex-1 p-4 border-2 border-yellow-300 rounded-lg bg-yellow-50">
                  <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">
                    {wish2.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                    {wish2.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 font-semibold">
                    👤 {wish2.author}
                  </p>
                </div>
              )}
            </div>

            {/* 距離情報 */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">距離:</span> {Math.round(distance)}px
              </p>
            </div>
          </div>
        )}

        {/* ボタン */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            ✓ マッチングする
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MatchConfirmationModal;
