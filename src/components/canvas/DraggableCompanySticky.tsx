import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import type { PlacedCompanyMemoItem, CompanyMemo } from '../../types';
import Avatar from '../ui/Avatar';
import { X } from 'lucide-react';

interface DraggableCompanyStickyProps {
  item: PlacedCompanyMemoItem;
  memo: CompanyMemo;
  onStop: (uniqueId: string, position: { x: number; y: number }) => void;
  onResizeStop: (uniqueId: string, size: { width: string | number; height: string | number }) => void;
  onDelete: (uniqueId: string) => void;
  onOpen: (memo: CompanyMemo) => void;
}

const DraggableCompanySticky: React.FC<DraggableCompanyStickyProps> = ({
  item,
  memo,
  onStop,
  onResizeStop,
  onDelete,
  onOpen,
}) => {
  const handleDragStop = (_e: any, d: { x: number; y: number }) => {
    onStop(item.uniqueId, { x: d.x, y: d.y });
  };

  const handleResizeStop = (_e: any, _direction: any, ref: HTMLElement) => {
    onResizeStop(item.uniqueId, { width: ref.style.width, height: ref.style.height });
  };

  return (
    <Rnd
      size={item.size}
      position={item.position}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      minWidth={160}
      minHeight={200}
      bounds="parent"
      className="shadow-lg rounded-md bg-emerald-200 transform -rotate-1 hover:rotate-0 transition-all duration-150"
      style={{ zIndex: item.zIndex }}
    >
      <div
        className="relative w-full h-full p-3 flex flex-col cursor-pointer hover:shadow-inner"
        onClick={() => onOpen(memo)}
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

        <div className="flex-grow flex flex-col items-center justify-start pt-2">
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-emerald-300 rounded mb-2">
            <span className="text-xl font-bold text-white">🏢</span>
          </div>
          <p className="text-sm font-bold text-gray-800 text-center break-words mb-2">{memo.name}</p>
        </div>

        <div className="flex-shrink-0 border-t border-emerald-300 pt-2">
          <p className="text-xs font-semibold text-gray-700 mb-1">得意分野:</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {memo.specialty.slice(0, 2).map((spec, idx) => (
              <span key={idx} className="text-xs bg-emerald-300 text-gray-800 px-2 py-0.5 rounded truncate">
                {spec}
              </span>
            ))}
            {memo.specialty.length > 2 && (
              <span className="text-xs text-gray-600">+{memo.specialty.length - 2}</span>
            )}
          </div>
          <p className="text-xs text-gray-700">
            推薦者: <span className="font-semibold">{memo.pointOfContact.length}名</span>
          </p>
        </div>
      </div>
    </Rnd>
  );
};

export default DraggableCompanySticky;
