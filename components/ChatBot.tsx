"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

type RecommendedProduct = {
  id: string;
  name: string;
  price: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  recommendedProducts?: RecommendedProduct[];
};

const QUICK_SUGGESTIONS = [
  "Recommend something under $50",
  "Best tech products?",
  "Looking for a gift idea",
  "What's your cheapest item?",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! 👋 I'm your AI shopping assistant.\nTell me what you're looking for and I'll help you find the perfect product!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.message ?? data.error ?? "Something went wrong.",
          recommendedProducts: data.recommendedProducts ?? [],
        },
      ]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, a temporary error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gray-800"
        aria-label="Open shopping assistant"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* 챗봇 창 */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ height: "560px" }}
      >
        {/* 헤더 */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-black rounded-t-2xl flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">AI Shopping Assistant</p>
            <p className="text-gray-400 text-xs">Powered by Gemini</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>

              {/* 상품 바로가기 버튼 */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                <div className="mt-2 ml-9 flex flex-col gap-1.5 w-full max-w-[78%]">
                  {msg.recommendedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center justify-between bg-white border border-gray-200 hover:border-black hover:shadow-sm rounded-xl px-3 py-2 transition-all group"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-black">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">{product.price}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0 text-xs font-medium text-gray-400 group-hover:text-black transition-colors">
                        View
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center mr-2 flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 빠른 질문 */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* 입력창 */}
        <div className="px-3 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-7 h-7 rounded-lg bg-black flex items-center justify-center disabled:opacity-30 transition-opacity"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
