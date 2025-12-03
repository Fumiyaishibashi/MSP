import React, { useState, useContext, useRef, useEffect } from "react";
import Modal from "../ui/Modal";
import type { PersonMemo, CompanyMemo } from "../../types";
import { AppContext } from "../../context/AppContext";
import { Send, Plus, X } from "lucide-react";

interface ChatModalProps {
  memoType: "person" | "company" | null;
  memo: PersonMemo | CompanyMemo | null;
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({
  memoType,
  memo,
  isOpen,
  onClose,
}) => {
  const context = useContext(AppContext);
  const [newMessage, setNewMessage] = useState("");
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [isOpen]);

  if (!context || !memo || !memoType) return null;

  const messages = context.getMessagesForMemo(memoType, memo.id);
  const participants = context.getMemoChatParticipants(memoType, memo.id);
  const allPersonMemos = context.personMemos;

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      alert("メッセージを入力してください");
      return;
    }

    context.addMessage(memoType, memo.id, context.currentUser.name, newMessage);
    setNewMessage("");
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

  const memoName = memo && "name" in memo ? memo.name : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={` ${memoName} - チャット`}
      size="large"
    >
      <div className="flex flex-col h-96 max-h-96 space-y-4 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Participants Section - POP Design - Compact */}
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl p-3 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold flex items-center gap-2">
              👥 参加者 ({participants.length})
            </p>
            <button
              onClick={() => setShowAddParticipant(!showAddParticipant)}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-white text-purple-600 font-bold rounded-full hover:scale-105 transition-transform shadow-md"
            >
              <Plus size={14} /> 追加
            </button>
          </div>

          {/* Add Participant Dropdown */}
          {showAddParticipant && (
            <div className="mt-2 p-2 bg-white text-gray-800 rounded-lg shadow-lg">
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {allPersonMemos
                  .filter(
                    (p) => !participants.find((part) => part.personId === p.id)
                  )
                  .map((person) => (
                    <button
                      key={person.id}
                      onClick={() => {
                        context.addMemoChatParticipant(memoType, memo.id, {
                          personId: person.id,
                          name: person.name,
                        });
                        setShowAddParticipant(false);
                      }}
                      className="w-full text-left px-2 py-1 text-xs bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-gray-800 font-semibold rounded transition-all"
                    >
                      {person.name}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Participants List - POP Tags - Compact */}
          <div className="flex flex-wrap gap-1 mt-2">
            {participants.map((participant) => (
              <div
                key={participant.personId}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-white text-purple-600 font-bold rounded-full shadow-md hover:scale-105 transition-transform"
              >
                <span>{participant.name}</span>
                <button
                  onClick={() =>
                    context.removeMemoChatParticipant(
                      memoType,
                      memo.id,
                      participant.personId
                    )
                  }
                  className="hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Container - Colorful */}
        <div className="flex-1 overflow-y-auto rounded-2xl p-5 bg-white shadow-lg border-4 border-gradient-to-r from-blue-200 to-purple-200">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-2xl mb-2">💬</p>
              <p className="font-semibold">まだメッセージはありません</p>
              <p className="text-sm">最初のメッセージを送ってみよう！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 hover:shadow-lg transition-shadow border-l-4 border-purple-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-gray-800 text-base">
                      👤 {msg.author}
                    </p>
                    <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap break-words font-medium">
                    {msg.content}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Section - Compact */}
        <div className="border-t-2 border-purple-300 bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex gap-3 items-end">
            {/* Message Input */}
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
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
    </Modal>
  );
};

export default ChatModal;
