import React, { useContext, useRef, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, Send } from 'lucide-react';
import type { ProjectChatParticipant } from '../types';

const ProjectChatPage = () => {
  const { id: projectId } = useParams();
  const context = useContext(AppContext);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [participants, setParticipants] = useState<ProjectChatParticipant[]>([]);

  if (!context || !projectId) {
    return <div>Context is not available.</div>;
  }

  const { projects, getProjectMessages, getProjectChatParticipants } = context;
  const currentProject = projects.find((p) => p.id === projectId);
  const messages = getProjectMessages(projectId);

  useEffect(() => {
    const chatParticipants = getProjectChatParticipants(projectId);
    setParticipants(chatParticipants);
    if (chatParticipants.length > 0 && !selectedAuthor) {
      setSelectedAuthor(chatParticipants[0].name);
    }
  }, [projectId, getProjectChatParticipants]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedAuthor) {
      alert('メッセージと送信者を選択してください');
      return;
    }
    context.addProjectMessage(projectId, selectedAuthor, newMessage);
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

  const getAuthorColor = (authorName: string) => {
    const colors = [
      'from-blue-100 to-cyan-100',
      'from-purple-100 to-pink-100',
      'from-green-100 to-emerald-100',
      'from-yellow-100 to-orange-100',
      'from-red-100 to-rose-100',
      'from-indigo-100 to-violet-100',
      'from-teal-100 to-blue-100',
      'from-amber-100 to-yellow-100',
    ];

    let hash = 0;
    for (let i = 0; i < authorName.length; i++) {
      hash = ((hash << 5) - hash) + authorName.charCodeAt(i);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">プロジェクトが見つかりません</h2>
        <Link to="/" className="text-blue-500 hover:underline">ダッシュボードに戻る</Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex-col">
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <Link to={`/event/${projectId}`} className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">🎉 {currentProject.title}</h1>
            <p className="text-sm font-semibold mt-0.5">プロジェクトチャット</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-purple-200">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-4xl mb-4">💬</p>
                <p className="text-2xl font-bold mb-2">会話を開始しましょう！</p>
                <p className="text-base">下から参加者を選んでメッセージを送信してね</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`p-4 rounded-xl bg-gradient-to-r ${getAuthorColor(msg.author)} hover:shadow-md transition-shadow border-l-4 border-gray-400`}>
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-bold text-sm text-gray-800">👤 {msg.author}</p>
                      <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap break-words font-medium text-sm leading-relaxed mt-1">{msg.content}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Section - Compact */}
          <div className="border-t-2 border-purple-300 bg-white p-4">
            <div className="space-y-2">
              <div className="flex gap-3 items-end">
                {/* Author Selection */}
                <div className="flex-shrink-0">
                  <label className="block text-xs font-bold text-gray-700 mb-1">👤 送信者</label>
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="px-3 py-1.5 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-gradient-to-r from-purple-50 to-blue-50"
                  >
                    <option value="">選択...</option>
                    {participants.map((p) => (
                      <option key={p.personId} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Input */}
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="メッセージを入力... (Ctrl+Enter送信)"
                    className="w-full px-3 py-1.5 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none bg-gradient-to-r from-purple-50 to-blue-50"
                    rows={2}
                  />
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-4 py-1.5 rounded-lg transition-all hover:scale-105 shadow-md transform active:scale-95 flex items-center gap-1"
                >
                  <Send size={16} />
                  送信
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectChatPage;
