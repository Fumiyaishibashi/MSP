import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import type { PlacedIdeaItem } from '../../types';
import Avatar from '../ui/Avatar';
import Modal from '../ui/Modal';
import { X, User, Mail, Trash2 } from 'lucide-react';
import { useLongPress } from '../../hooks/useLongPress';

interface DraggableIdeaStickyProps {
  item: PlacedIdeaItem;
  onStop: (uniqueId: string, position: { x: number; y: number }) => void;
  onTextChange: (uniqueId: string, text: string) => void;
  onResizeStop: (uniqueId: string, size: { width: string | number; height: string | number }) => void;
  onDelete: (uniqueId: string) => void;
}

const DraggableIdeaSticky: React.FC<DraggableIdeaStickyProps> = ({ item, onStop, onTextChange, onResizeStop, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [isModalOpen, setIsModalOpen] = useState(false);
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


  const handleBlur = () => {
    setIsEditing(false);
    if (editText !== item.text) {
      onTextChange(item.uniqueId, editText);
    }
  };

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
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
        minHeight={160}
        bounds="parent"
        {...(isDraggable && { disableDrag: !isDraggable })}
        className="shadow-lg rounded-md bg-pink-200 transform -rotate-1 hover:rotate-0 transition-all duration-150"
        style={{ zIndex: item.zIndex }}
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.uniqueId);
            }}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
            title="削除"
          >
            <X size={16} />
          </button>
          <div className="flex-1 overflow-y-auto cursor-pointer" onClick={() => setIsModalOpen(true)}>
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleBlur}
              className="w-full h-full bg-pink-100 border-none outline-none resize-none text-gray-800 font-medium rounded"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p className="w-full h-full text-gray-800 font-medium whitespace-pre-wrap break-words cursor-text hover:bg-pink-100 rounded transition-colors">
              {item.text}
            </p>
          )}
        </div>
      </div>
      </Rnd>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="アイデア詳細">
        <div className="space-y-6">
          {/* アイデア内容 */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">アイデア内容</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-pink-50 rounded-lg p-4">
              {item.text}
            </p>
          </div>

          {/* 著者情報 */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User size={18} /> 提案者
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-800">{item.author}</p>
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <Mail size={14} /> {item.author.toLowerCase()}@mbs.co.jp
              </p>
              <p className="text-xs text-gray-600">企画部</p>
            </div>
          </div>

          {/* 提案日時 */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">提案日時</h3>
            <p className="text-sm text-gray-700">
              {new Date().toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* 削除ボタン */}
          <div className="pt-4 border-t">
            <button
              onClick={() => {
                onDelete(item.uniqueId);
                setIsModalOpen(false);
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

export default DraggableIdeaSticky;
