"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/api";

import { useAuthStore } from "@/lib/store";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatWidget() {
  const { user: teacher } = useAuthStore();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [schoolId, setSchoolId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dragging state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialise position to bottom‑right on first render
  useEffect(() => {
    setPos({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  }, []);

  useEffect(() => {
    if (teacher) {
      setSchoolId(teacher.school_id || "");
      setTeacherId(teacher.teacher_id || "");
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [teacher]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Drag handlers ----
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;
      setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    },
    [dragging]
  );

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Touch equivalents
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragging(true);
    dragStart.current = { x: touch.clientX - pos.x, y: touch.clientY - pos.y };
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging) return;
      const touch = e.touches[0];
      setPos({ x: touch.clientX - dragStart.current.x, y: touch.clientY - dragStart.current.y });
    },
    [dragging]
  );

  const handleTouchEnd = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseMove, handleTouchMove]);

  // Gate: Only show for Elite tier if logged in
  // Move guard here - after all hooks have run
  if (teacher && teacher.subscription_tier !== "elite") return null;

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    // Initial empty assistant message that we will fill via stream
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const token = teacher?.token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/ai-assistant/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          school_id: schoolId || "guest",
          question,
        }),
      });

      if (!response.ok) throw new Error("Stream failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;

          // Update the last message (the assistant one) with the new chunk
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = fullContent;
            return newMessages;
          });
        }
      }
    } catch (err) {
      console.error("AIChatWidget: Streaming failed", err);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = "Sorry, something went wrong. Please try again.";
        return newMessages;
      });
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
      {/* Draggable floating button */}
      {!open && (
        <button
          ref={buttonRef}
          onClick={() => !dragging && setOpen(true)}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ left: pos.x, top: pos.y }}
          className="fixed z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition cursor-grab active:cursor-grabbing"
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
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Ar‑Learn Assistant</p>
              <p className="text-xs text-blue-100">
                {isLoggedIn ? "Ask me anything about your school" : "Ask me about Ar‑Learn"}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white hover:text-blue-100">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-400 mt-20 whitespace-pre-line">
                {isLoggedIn
                  ? "Hi! I can help you with questions like:\n• “Which class performed best?”\n• “Who scored highest in Math?”\n• “Show me attendance concerns”"
                  : "👋 Welcome! I'm Ar‑Learn Assistant. Ask me anything about this platform:\n• “What does Ar‑Learn do?”\n• “What features are available?”\n• “How do I get started?”"}
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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

          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isLoggedIn ? "Type a question..." : "Ask about Ar‑Learn..."}
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