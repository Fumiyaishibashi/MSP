import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import type { Wish, PersonMemo } from '../../types';
import { AppContext } from '../../context/AppContext';
import WishCommentSection from './WishCommentSection';
import WishCommentForm from './WishCommentForm';
import PersonDetailModal from './PersonDetailModal';
import { X, Trash2 } from 'lucide-react';

interface WishDetailPanelProps {
  wish: Wish;
  currentUser: PersonMemo;
  onClose: () => void;
  onDeleteWish: (wishId: string) => void;
}

/**
 * 願いの詳細情報を表示するパネル
 * - 願い情報（タイトル、説明、キーワード等）
 * - WishCommentSection（コメント一覧）統合
 * - WishCommentForm（コメント入力）統合
 * - 削除機能
 * - React Portal でモーダル化
 */
const WishDetailPanel: React.FC<WishDetailPanelProps> = ({
  wish,
  currentUser,
  onClose,
  onDeleteWish,
}) => {
  const context = useContext(AppContext);
  const [selectedPerson, setSelectedPerson] = useState<PersonMemo | null>(null);

  if (!context) return null;

  const { personMemos, getWishComments } = context;
  const comments = getWishComments(wish.id);

  // ESC キーでパネルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // 著者の人物情報を取得
  const authorPerson = personMemos.find((p) => p.name === wish.author);

  // 企業名を取得する簡易関数
  const getCompanyName = (companyId: string): string => {
    const companyMap: { [key: string]: string } = {
      mbs_tv: '株式会社毎日放送',
      mbs_radio: '株式会社MBSラジオ',
      mbs_goods: 'グッズ制作班',
      mbs_planning: '株式会社MBS企画',
      broadcast_film: '株式会社放送映画製作所',
      mirika_music: 'ミリカ・ミュージック',
      mbs_facilities: 'MBSファシリティーズ',
      picoli: 'ピコリ',
      mbs_live_ent: 'MBSライブエンターテインメント',
      yami: '株式会社闇',
      innovation: 'MBSイノベーション',
      upland: 'アップランド',
      toromi: 'TOROMI PRODUCE',
      vogaro: 'Vogaro',
      hinata_life: 'ひなたライフ',
    };
    return companyMap[companyId] || companyId;
  };


  // 削除ハンドラ
  const handleDelete = () => {
    if (confirm(`願い「${wish.title}」を削除してもよろしいですか？`)) {
      onDeleteWish(wish.id);
      onClose();
    }
  };


  // パネルの背景をクリック → 閉じる
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const panelContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      {/* パネル本体 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* ヘッダー */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-bold truncate">{wish.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            title="パネルを閉じる (ESC キー)"
          >
            <X size={24} />
          </button>
        </div>

        {/* メインコンテンツ */}
        <div className="p-6 space-y-6">
          {/* 【願い基本情報セクション】 */}
          <section className="space-y-3">
            <h3 className="font-bold text-gray-800 text-sm">📋 願い情報</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-semibold">企業</p>
                <p className="text-gray-800">{getCompanyName(wish.companyId)}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">著者</p>
                <p className="text-gray-800">👤 {wish.author}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">作成日時</p>
                <p className="text-gray-800">
                  {new Date(wish.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
          </section>

          {/* 【説明セクション】 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-800 text-sm">📝 説明</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {wish.description}
            </p>
          </section>

          {/* 【キーワードセクション】 */}
          <section className="space-y-2">
            <h3 className="font-bold text-gray-800 text-sm">🏷️ キーワード</h3>
            <div className="flex flex-wrap gap-2">
              {wish.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </section>

          {/* 区切り線 */}
          <hr className="border-gray-200" />

          {/* 【コメントセクション】 */}
          <section className="space-y-4">
            <WishCommentSection
              wishId={wish.id}
              comments={comments}
              currentUser={currentUser}
              onShowAuthorDetail={(personId) => {
                const person = personMemos.find((p) => p.id === personId);
                if (person) {
                  setSelectedPerson(person);
                }
              }}
            />
          </section>

          {/* 【コメント入力セクション】 */}
          <section className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <WishCommentForm
              wishId={wish.id}
              currentUser={currentUser}
            />
          </section>
        </div>

        {/* フッター */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-2">
          {currentUser.id === authorPerson?.id && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <Trash2 size={16} />
              削除
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold text-sm transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>

      {/* コメント者の人物詳細モーダル */}
      {selectedPerson && (
        <PersonDetailModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </div>
  );

  // Portal で document.body にレンダリング
  return createPortal(panelContent, document.body);
};

export default WishDetailPanel;
