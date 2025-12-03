import { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import type { IpAssetMaster, PlacedIpItem } from '../../types';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import { User, Mail, X, Trash2 } from 'lucide-react';
import { useLongPress } from '../../hooks/useLongPress';

interface DraggableIpStickyProps {
  item: PlacedIpItem;
  asset: IpAssetMaster;
  authorEmail?: string;
  onStop: (uniqueId: string, position: { x: number; y: number }) => void;
  onNoteChange: (uniqueId: string, note: string) => void;
  onResizeStop: (uniqueId: string, size: { width: string | number; height: string | number }) => void;
  onDelete: (uniqueId: string) => void;
}

const DraggableIpSticky: React.FC<DraggableIpStickyProps> = ({ item, asset, onStop, onNoteChange, onResizeStop, onDelete, authorEmail }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(item.note || '');
  const [isDraggable, setIsDraggable] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 長押し検出
  const { handlers: longPressHandlers } = useLongPress({
    threshold: 500,
    onLongPress: () => setIsDraggable(true),
  });

  const handleDragStart = () => {
    // ドラッグ開始時に isDraggable を強制チェック
    if (!isDraggable) {
      return false; // ドラッグを阻止
    }
  };

  const handleDragStop = (_e: any, d: { x: number; y: number }) => {
    onStop(item.uniqueId, { x: d.x, y: d.y });
  };

  const handleResizeStop = (_e: any, _direction: any, ref: HTMLElement) => {
    onResizeStop(item.uniqueId, { width: ref.style.width, height: ref.style.height });
  };

  const openModal = () => !isEditing && setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDoubleClick = (e: React.MouseEvent) => {
    // メモ欄以外をダブルクリックした場合はモーダルを開く
    if (!(e.target as HTMLElement).closest('.memo-area')) {
      openModal();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editNote !== (item.note || '')) {
      onNoteChange(item.uniqueId, editNote);
    }
  };

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <>
      <Rnd
        size={item.size}
        position={item.position}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        minWidth={160}
        minHeight={192}
        bounds="parent"
        {...(isDraggable && { disableDrag: !isDraggable })}
        className="shadow-lg rounded-md bg-yellow-200 transform -rotate-2 hover:rotate-0 transition-all duration-150"
        style={{ zIndex: item.zIndex }}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className="relative w-full h-full p-3 flex flex-col"
          {...longPressHandlers}
          onMouseUp={() => {
            longPressHandlers.onMouseUp();
            setIsDraggable(false);
          }}
        >
          <div className="absolute -top-2 -left-2">
            <Avatar name={item.author} />
          </div>
          <button
            onClick={() => onDelete(item.uniqueId)}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
            title="削除"
          >
            <X size={16} />
          </button>
          <div className="flex-grow flex flex-col items-center justify-start pt-2">
            {asset.imagePath ? (
              <img src={asset.imagePath} alt={asset.name} className="w-16 h-16 object-contain mb-1" />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center bg-gray-300 rounded mb-1">
                <span className="text-2xl">📺</span>
              </div>
            )}
            <p className="text-sm font-semibold text-gray-800 text-center break-words">
              {asset.name}
            </p>
          </div>
          <div className="flex-shrink-0 h-16 w-full mt-1 text-xs text-gray-700 memo-area" onClick={() => setIsEditing(true)}>
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                onBlur={handleBlur}
                className="w-full h-full bg-yellow-100 border-none outline-none resize-none p-1 rounded"
                placeholder="メモ..."
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="w-full h-full p-1 whitespace-pre-wrap break-words overflow-y-auto cursor-text hover:bg-yellow-100 rounded transition-colors">
                {item.note || <span className="text-gray-400">（メモを追加）</span>}
              </p>
            )}
          </div>
        </div>
      </Rnd>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`${asset.name} - 詳細情報`}>
        <div className="space-y-6">
          {/* 基本情報 */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">基本情報</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">カテゴリー:</span> {asset.category}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">所有部門:</span> {asset.ownerName}
              </p>
            </div>
          </div>

          {/* プロデューサー情報 */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User size={18} /> プロデューサー
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-800">鈴木太郎</p>
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <Mail size={14} /> suzuki.taro@mbs.co.jp
              </p>
              <p className="text-xs text-gray-600">テレビ・ラジオ企画部</p>
            </div>
          </div>

          {/* ディレクター情報 */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User size={18} /> ディレクター
            </h3>
            <div className="bg-green-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-800">田中花子</p>
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <Mail size={14} /> tanaka.hanako@mbs.co.jp
              </p>
              <p className="text-xs text-gray-600">制作技術部</p>
            </div>
          </div>

          {/* 連絡先 */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">連絡先</h3>
            <p className="text-sm text-gray-700">{asset.contact}</p>
          </div>

          {/* 作成者情報 */}
          {item.author && (
            <div className="space-y-2 bg-gray-50 p-3 rounded text-xs border border-gray-200">
              <p className="text-gray-600 font-semibold">メモを作成した人</p>
              <p className="text-gray-800">{item.author}</p>
              {authorEmail && (
                <p className="text-gray-600 flex items-center gap-1">
                  <Mail size={12} /> {authorEmail}
                </p>
              )}
            </div>
          )}

          {/* 削除ボタン */}
          <div className="pt-4 border-t">
            <button
              onClick={() => {
                onDelete(item.uniqueId);
                closeModal();
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 size={18} />
              このメモを削除
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DraggableIpSticky;
