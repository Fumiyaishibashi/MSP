import React, { useState, useContext, useRef, useEffect } from "react";
import Modal from "../ui/Modal";
import type { BrainstormTeam } from "../../types";
import { AppContext } from "../../context/AppContext";
import { Send } from "lucide-react";

interface TeamChatModalProps {
  team: BrainstormTeam | null;
  isOpen: boolean;
  onClose: () => void;
}

const TeamChatModal: React.FC<TeamChatModalProps> = ({
  team,
  isOpen,
  onClose,
}) => {
  const context = useContext(AppContext);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!context || !team) return null;

  const messages = context.getTeamMessages(team.id);

  useEffect(() => {
    scrollToBottom();
  }, [isOpen, messages.length]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      alert("メッセージを入力してください");
      return;
    }

    context.addTeamMessage(team.id, context.currentUser.name, newMessage);
    setNewMessage("");
    setTimeout(scrollToBottom, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSendMessage();
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${team.name} - チーム チャット`}
      size="xlarge"
    >
      <div className="flex flex-col h-[600px] max-h-[70vh] space-y-4 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Team Members Section */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-3 text-white shadow-lg">
          <p className="text-sm font-bold flex items-center gap-2">
            👥 チームメンバー ({team.members.length})
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {team.members.map((member) => (
              <span
                key={member.personId}
                className="text-xs bg-white text-green-700 font-semibold px-2 py-1 rounded-full"
              >
                {member.name}
              </span>
            ))}
          </div>
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl p-3 shadow-inner">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-4xl mb-2">💬</p>
              <p className="text-sm">まだメッセージがありません</p>
              <p className="text-xs">チームで会話を始めましょう！</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex flex-col gap-1 bg-gray-50 rounded-lg p-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-700">
                      {msg.author}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-800">{msg.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl p-3 shadow-lg">
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="メッセージを入力... (Ctrl+Enterで送信)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all hover:scale-105 shadow-md flex items-center gap-1"
            >
              <Send size={16} />
              送信
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TeamChatModal;
