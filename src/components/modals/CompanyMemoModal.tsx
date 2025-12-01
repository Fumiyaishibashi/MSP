import React from 'react';
import Modal from '../ui/Modal';
import type { CompanyMemo } from '../../types';
import { Mail, Copy, MessageCircle, User, Trash2 } from 'lucide-react';

interface CompanyMemoModalProps {
  memo: CompanyMemo | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (memo: CompanyMemo) => void;
  onDelete?: (memoId: string) => void;
}

const CompanyMemoModal: React.FC<CompanyMemoModalProps> = ({ memo, isOpen, onClose, onOpenChat, onDelete }) => {
  if (!memo) return null;

  const handleCopyContactEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    alert('メールアドレスをコピーしました！');
  };

  const handleOpenChat = () => {
    onOpenChat(memo);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${memo.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <div className="w-16 h-16 flex items-center justify-center bg-emerald-200 rounded">
            <span className="text-3xl">🏢</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{memo.name}</h2>
        </div>

        {/* Specialty */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">得意分野</h3>
          <div className="flex flex-wrap gap-2">
            {memo.specialty.map((spec, idx) => (
              <span
                key={idx}
                className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full font-medium"
              >
                {spec}
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

        {/* Points of Contact */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">推薦者・担当者</h3>
          <div className="space-y-2">
            {memo.pointOfContact.map((contact, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <User size={16} className="text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{contact.name}</p>
                      {contact.role && <p className="text-xs text-gray-600">{contact.role}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between ml-6">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Mail size={14} className="text-gray-600 flex-shrink-0" />
                    <span className="text-xs text-gray-700 truncate">{contact.email}</span>
                  </div>
                  <button
                    onClick={() => handleCopyContactEmail(contact.email)}
                    className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                    title="コピー"
                  >
                    <Copy size={14} className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleOpenChat}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
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

export default CompanyMemoModal;
