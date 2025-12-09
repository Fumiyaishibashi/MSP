import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Wish } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface WishModalProps {
  onClose: () => void;
  onSubmit: (wish: Wish) => void;
}

const mbsCompanies = [
  { id: 'mbs_tv', name: '株式会社毎日放送' },
  { id: 'mbs_radio', name: '株式会社MBSラジオ' },
  { id: 'gaora', name: '株式会社GAORA' },
  { id: 'mbs_planning', name: '株式会社MBS企画' },
  { id: 'broadcast_film', name: '株式会社放送映画製作所' },
  { id: 'mirika_music', name: '株式会社ミリカ・ミュージック' },
  { id: 'facilities', name: '株式会社MBSファシリティーズ' },
  { id: 'picori', name: '株式会社ピコリ' },
  { id: 'mbs_live', name: '株式会社MBSライブエンターテインメント' },
  { id: 'yami', name: '株式会社闇' },
  { id: 'innovation', name: '株式会社MBSイノベーションドライブ' },
  { id: 'upland', name: '株式会社アップランド' },
  { id: 'toromi', name: '株式会社TOROMI PRODUCE' },
  { id: 'mg_sports', name: '株式会社MGスポーツ' },
  { id: 'zipang', name: '株式会社Zipang' },
  { id: 'vogaro', name: 'Vogaro株式会社' },
  { id: 'hinata_life', name: '株式会社ひなたライフ' },
];

const WishModal: React.FC<WishModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [author, setAuthor] = useState('');
  const [companyId, setCompanyId] = useState(mbsCompanies[0].id);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'タイトルを入力してください';
    if (!description.trim()) newErrors.description = '説明を入力してください';
    if (keywords.length === 0) newErrors.keywords = 'キーワードを1つ以上追加してください';
    if (!author.trim()) newErrors.author = '著者名を入力してください';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const wish: Wish = {
      id: `wish_${uuidv4()}`,
      title: title.trim(),
      description: description.trim(),
      keywords,
      author: author.trim(),
      companyId,
      createdAt: new Date(),
      position: { x: Math.random() * 100, y: Math.random() * 100 },
      size: { width: 280, height: 180 },
      zIndex: Math.floor(Math.random() * 100),
    };

    onSubmit(wish);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-96 overflow-y-auto z-50" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">新しい願いを追加</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              📝 タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：音楽フェスをやりたい"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              📄 説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="詳細な説明を入力してください"
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              🏷️ キーワード（マッチング用）
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="キーワード（Enter で追加）"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button
                onClick={addKeyword}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-all"
              >
                追加
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold"
                >
                  #{keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="hover:text-blue-900 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {errors.keywords && <p className="text-xs text-red-500">{errors.keywords}</p>}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              👤 著者（あなたの名前）
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="例：佐藤太郎"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              🏢 所属会社
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              {mbsCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-all"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md transition-all hover:scale-105"
          >
            願いを追加
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default WishModal;
