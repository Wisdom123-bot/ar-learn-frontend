"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface MessagingPanelProps {
  studentId: string;
  currentUserId: string;
  recipientId: string;
  recipientName: string;
}

export default function MessagingPanel({
  studentId,
  currentUserId,
  recipientId,
  recipientName,
}: MessagingPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchConversation = async () => {
    try {
      const res = await api.get(`/messages/conversation/${studentId}`, {
        params: { user2: recipientId },
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load conversation", err);
    }
  };

  useEffect(() => {
    fetchConversation();
    // Poll for new messages every 5 seconds for "real-time" feel without WebSockets
    const interval = setInterval(fetchConversation, 5000);
    return () => clearInterval(interval);
  }, [studentId, recipientId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const content = input.trim();
    setInput("");

    try {
      await api.post("/messages", {
        sender_id: currentUserId,
        receiver_id: recipientId,
        student_id: studentId,
        content: content,
      });
      fetchConversation();
    } catch (err) {
      console.error("Failed to send message", err);
      setInput(content); // Restore input on fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[500px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <div>
           <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Communication Hub</h3>
           <p className="text-[10px] text-gray-400 font-bold uppercase">Chat with {recipientName}</p>
        </div>
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No conversation history</p>
            <p className="text-[10px] text-gray-500 mt-1">Start a professional dialogue regarding student progress.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium shadow-sm ${
                  m.sender_id === currentUserId
                    ? "bg-gray-900 text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                }`}
              >
                {m.content}
                <p className={`text-[8px] mt-1 opacity-50 ${m.sender_id === currentUserId ? "text-right" : "text-left"}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter message..."
          disabled={loading}
          className="flex-1 bg-gray-50 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg active:scale-95"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
