import React, { useState, useContext, useRef, useEffect } from 'react';
import Modal from '../ui/Modal';
import type { PersonMemo, CompanyMemo, Message } from '../../types';
import { AppContext } from '../../context/AppContext';
import { Send } from 'lucide-react';

interface ChatModalProps {
  memoType: 'person' | 'company' | null;
  memo: PersonMemo | CompanyMemo | null;
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ memoType, memo, isOpen, onClose }) => {
  const context = useContext(AppContext);
  const [newMessage, setNewMessage] = useState('');
  const [author, setAuthor] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!context || !memo || !memoType) return null;

  const messages = context.getMessagesForMemo(memoType, memo.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !author.trim()) {
      alert('メッセージと名前を入力してください');
      return;
    }
    context.addMessage(memoType, memo.id, author, newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSendMessage();
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const memoName = memo && 'name' in memo ? memo.name : '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${memoName} - チャット`}
      size="large"
    >
      <div className="flex flex-col h-96">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded mb-4 p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>まだメッセージはありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-800 text-sm">{msg.author}</p>
                    <span className="text-xs text-gray-500">{formatDate(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="space-y-3 pt-2 border-t border-gray-200">
          {/* Author Input */}
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="あなたの名前"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />

          {/* Message Input */}
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力... (Ctrl+Enterで送信)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            rows={3}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <Send size={18} />
            送信
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
