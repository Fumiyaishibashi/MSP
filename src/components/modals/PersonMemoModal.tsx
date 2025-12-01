import React from 'react';
import Modal from '../ui/Modal';
import type { PersonMemo } from '../../types';
import { Mail, Phone, Copy, MessageCircle, Trash2 } from 'lucide-react';

interface PersonMemoModalProps {
  memo: PersonMemo | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (memo: PersonMemo) => void;
  onDelete?: (memoId: string) => void;
}

const PersonMemoModal: React.FC<PersonMemoModalProps> = ({ memo, isOpen, onClose, onOpenChat, onDelete }) => {
  if (!memo) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(memo.email);
    alert('メールアドレスをコピーしました！');
  };

  const handleCopyPhone = () => {
    if (memo.phone) {
      navigator.clipboard.writeText(memo.phone);
      alert('電話番号をコピーしました！');
    }
  };

  const handleOpenChat = () => {
    onOpenChat(memo);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${memo.name} - ${memo.department}`}>
      <div className="space-y-6">
        {/* Header with avatar */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-200 rounded-full">
            <span className="text-3xl">👤</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{memo.name}</h2>
            <p className="text-sm text-gray-600">{memo.department}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">連絡先</h3>
          <div className="space-y-2 bg-gray-50 p-3 rounded">
            {/* Email */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Mail size={18} className="text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">{memo.email}</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="ml-2 p-1 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
                title="コピー"
              >
                <Copy size={16} className="text-blue-600" />
              </button>
            </div>

            {/* Phone */}
            {memo.phone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone size={18} className="text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{memo.phone}</span>
                </div>
                <button
                  onClick={handleCopyPhone}
                  className="ml-2 p-1 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
                  title="コピー"
                >
                  <Copy size={16} className="text-blue-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expertise */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">専門領域</h3>
          <div className="flex flex-wrap gap-2">
            {memo.expertise.map((exp, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>

        {/* Past Projects */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">過去実績</h3>
          <ul className="space-y-2">
            {memo.pastProjects.map((project, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start">
                <span className="mr-2">•</span>
                <span>{project}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleOpenChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <MessageCircle size={18} />
            チャットを開く
          </button>
          {onDelete && (
            <button
              onClick={() => {
                onDelete(memo.id);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              このメモを削除
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PersonMemoModal;
