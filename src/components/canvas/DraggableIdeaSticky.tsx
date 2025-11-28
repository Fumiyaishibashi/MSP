import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import type { PlacedIdeaItem } from '../../types';
import Avatar from '../ui/Avatar';
import { X } from 'lucide-react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <Rnd
      size={item.size}
      position={item.position}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      minWidth={160}
      minHeight={160}
      bounds="parent"
      className="shadow-lg rounded-md bg-pink-200 transform -rotate-1 hover:rotate-0 transition-all duration-150"
      style={{ zIndex: item.zIndex }}
    >
      <div className="relative w-full h-full p-4" onClick={() => setIsEditing(true)}>
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
        <div className="pt-2 h-full">
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
  );
};

export default DraggableIdeaSticky;
