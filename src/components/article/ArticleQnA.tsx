"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MessageCircle, Send, Loader2, X, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ArticleQnAProps {
  articleId: string;
  articleTitle: string;
  content: string;
}

export default function ArticleQnA({ articleId, articleTitle, content }: ArticleQnAProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const question = input.trim();
    if (!question || loading) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "rewrite",
          content: `You are a helpful assistant that answers questions about a news article. Be concise and factual. If you don't know the answer from the article, say so.\n\nARTICLE: "${articleTitle}"\n\nCONTENT:\n${content.slice(0, 4000)}\n\nQUESTION: ${question}`,
          articleId,
        }),
      });

      const data = await res.json();
      const answer = data.result || data.error || "Sorry, I couldn't process that question.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, articleId, articleTitle, content]);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3 bg-brand hover:bg-brand-dark text-white rounded-full shadow-lg shadow-brand/20 transition-all hover:scale-105"
        aria-label="Ask a question about this article"
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[480px] max-h-[calc(100vh-6rem)] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand/10 rounded-lg">
                <Bot size={16} className="text-brand" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Ask about this article</h3>
                <p className="text-[10px] text-gray-500">AI-powered · may be inaccurate</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot size={32} className="text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400 mb-1">Ask me anything about this story</p>
                <p className="text-[11px] text-gray-600">e.g., &quot;What are the key findings?&quot;</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center mt-0.5">
                    <Bot size={12} className="text-brand" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand text-white rounded-br-sm"
                      : "bg-zinc-800 text-gray-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center mt-0.5">
                    <User size={12} className="text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center">
                  <Bot size={12} className="text-brand" />
                </div>
                <div className="bg-zinc-800 px-3 py-2 rounded-xl rounded-bl-sm">
                  <Loader2 size={14} className="text-brand animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={loading}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-brand hover:bg-brand-dark text-white rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
