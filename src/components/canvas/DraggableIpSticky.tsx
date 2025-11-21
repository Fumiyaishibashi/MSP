import { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import type { IpAssetMaster, PlacedIpItem } from '../../types';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import { User, Mail } from 'lucide-react';

interface DraggableIpStickyProps {
  item: PlacedIpItem;
  asset: IpAssetMaster;
  onStop: (uniqueId: string, position: { x: number; y: number }) => void;
  onNoteChange: (uniqueId: string, note: string) => void;
  onResizeStop: (uniqueId: string, size: { width: string | number; height: string | number }) => void;
}

const DraggableIpSticky: React.FC<DraggableIpStickyProps> = ({ item, asset, onStop, onNoteChange, onResizeStop }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(item.note || '');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  
  const handleMemoDoubleClick = () => {
    setIsEditing(true);
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
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        minWidth={160}
        minHeight={192}
        bounds="parent"
        className="shadow-lg rounded-md bg-yellow-200 transform -rotate-2 hover:rotate-0 transition-all duration-150"
        style={{ zIndex: item.zIndex }}
        onDoubleClick={handleDoubleClick}
      >
        <div className="relative w-full h-full p-3 flex flex-col">
          <div className="absolute -top-2 -left-2">
            <Avatar name={item.author} />
          </div>
          <div className="flex-grow flex flex-col items-center justify-start pt-2">
            <img src={asset.imagePath} alt={asset.name} className="w-16 h-16 object-contain mb-1" />
            <p className="text-sm font-semibold text-gray-800 text-center break-words">
              {asset.name}
            </p>
          </div>
          <div className="flex-shrink-0 h-16 w-full mt-1 text-xs text-gray-700 memo-area" onDoubleClick={handleMemoDoubleClick}>
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
              <p className="w-full h-full p-1 whitespace-pre-wrap break-words overflow-y-auto cursor-text">
                {item.note || <span className="text-gray-400">（メモを追加）</span>}
              </p>
            )}
          </div>
        </div>
      </Rnd>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`${asset.name} - 詳細情報`}>
        {/* ... Modal content ... */}
      </Modal>
    </>
  );
};

export default DraggableIpSticky;
