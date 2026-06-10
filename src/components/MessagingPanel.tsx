"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface MessagingPanelProps {
  studentId: string;
  currentUserId: string;
  recipientId: string;
  recipientName: string;
}

export default function MessagingPanel({ studentId, currentUserId, recipientId, recipientName }: MessagingPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/conversation/${studentId}`, {
        params: { user1: currentUserId, user2: recipientId }
      });
      setMessages(res.data);
      // Mark as read
      await api.put(`/messages/read-all/${studentId}`, null, {
        params: { receiver_id: currentUserId, sender_id: recipientId }
      });
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [studentId, currentUserId, recipientId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await api.post("/messages/", {
        sender_id: currentUserId,
        receiver_id: recipientId,
        student_id: studentId,
        content: newMessage.trim()
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h3 className="font-black text-gray-900">Chat with {recipientName}</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Regarding Student Record</p>
        </div>
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fcfdfe]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-sm font-medium">No messages yet.<br/>Start the conversation.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                msg.sender_id === currentUserId
                ? "bg-blue-600 text-white rounded-tr-none"
                : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
              }`}>
                {msg.content}
                <div className={`text-[9px] mt-1 opacity-60 ${msg.sender_id === currentUserId ? "text-right" : "text-left"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-50 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-50 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-blue-600 transition"
        />
        <button
          type="submit"
          disabled={loading || !newMessage.trim()}
          className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
