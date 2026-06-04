"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [schoolId, setSchoolId] = useState("");
  const [teacherId, setTeacherId] = useState("");   // for auth token
  const bottomRef = useRef<HTMLDivElement>(null);

  // Get school ID and teacher ID from the logged‑in user
  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (stored) {
      try {
        const t = JSON.parse(stored);
        setSchoolId(t.school_id || "");
        setTeacherId(t.teacher_id || "");
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || !schoolId || !teacherId) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post(
        "/ai-assistant/ask",
        {
          school_id: schoolId,
          question,
        },
        {
          headers: {
            Authorization: `Bearer ${teacherId}`,
          },
        }
      );
      const answer = res.data.answer || "I'm not sure how to answer that.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition"
          aria-label="Chat with AI Assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Ar‑Learn Assistant</p>
              <p className="text-xs text-blue-100">Ask me anything about your school</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white hover:text-blue-100">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-400 mt-20">
                Hi! I can help you with questions like:
                <br />• “Which class performed best?”
                <br />• “Who scored highest in Math?”
                <br />• “Show me attendance concerns”
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm text-gray-400">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a question..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}