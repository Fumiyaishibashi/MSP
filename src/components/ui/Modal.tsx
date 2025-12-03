import React from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size = 'medium' }) => {
  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-2xl',
  };

  const modalContent = (
    <div
      // オーバーレイ
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        // モーダル本体
        className={`bg-white rounded-lg shadow-2xl w-full ${sizeClasses[size]} m-4 z-50 transform transition-all`}
        onClick={(e) => e.stopPropagation()} // モーダル内のクリックで閉じないようにする
      >
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">{title || ''}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );

  // document.body に直接マウントして、親要素のスクロール・ズームの影響を受けないようにする
  return createPortal(modalContent, document.body);
};

export default Modal;
