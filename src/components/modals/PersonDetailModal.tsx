import React from 'react';
import { createPortal } from 'react-dom';
import type { PersonMemo } from '../../types';
import { X, Mail, Phone, Copy } from 'lucide-react';

interface PersonDetailModalProps {
  person: PersonMemo;
  onClose: () => void;
}

/**
 * シンプルな人物詳細表示モーダル
 * - 名前、部門、企業、専門領域を表示
 * - メール・電話番号のコピー機能
 * - React Portal でモーダル化
 */
const PersonDetailModal: React.FC<PersonDetailModalProps> = ({
  person,
  onClose,
}) => {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(person.email);
    alert(`📋 ${person.email} をコピーしました!`);
  };

  const handleCopyPhone = () => {
    if (person.phone) {
      navigator.clipboard.writeText(person.phone);
      alert(`📋 ${person.phone} をコピーしました!`);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-2xl w-full max-w-md"
      >
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-bold">👤 {person.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-4">
          {/* 部門 */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">部門</p>
            <p className="text-sm text-gray-800">{person.department}</p>
          </div>

          {/* 企業 */}
          {person.company && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">企業</p>
              <p className="text-sm text-gray-800">{person.company}</p>
            </div>
          )}

          {/* 入社年数 */}
          {person.yearsOfService !== undefined && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">入社年数</p>
              <p className="text-sm text-gray-800">
                {person.yearsOfService === 0 ? '新卒' : `${person.yearsOfService}年`}
              </p>
            </div>
          )}

          {/* 専門領域 */}
          {person.expertise && person.expertise.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                専門領域
              </p>
              <div className="flex flex-wrap gap-2">
                {person.expertise.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 連絡先 */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            {/* メール */}
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-blue-600" />
              <span className="text-sm text-gray-700 flex-1 truncate">
                {person.email}
              </span>
              <button
                onClick={handleCopyEmail}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="コピー"
              >
                <Copy size={14} className="text-gray-600" />
              </button>
            </div>

            {/* 電話 */}
            {person.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-green-600" />
                <span className="text-sm text-gray-700 flex-1">
                  {person.phone}
                </span>
                <button
                  onClick={handleCopyPhone}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="コピー"
                >
                  <Copy size={14} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* 過去プロジェクト */}
          {person.pastProjects && person.pastProjects.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                過去プロジェクト
              </p>
              <ul className="text-xs text-gray-700 space-y-1">
                {person.pastProjects.map((project, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">▪</span>
                    <span>{project}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold text-sm transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PersonDetailModal;
