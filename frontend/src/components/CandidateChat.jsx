import { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Bot, User, Loader2, Sparkles,
  MessageSquare, ChevronDown, RotateCcw, Zap
} from "lucide-react";
import API from "../api/api";

export default function CandidateChat({ candidate, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: `Hello! I'm the AI spokesperson for ${candidate.name} of the ${candidate.party || "Independent"} party. Ask me anything about our platform, vision, and policies!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      role: "user",
      parts: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Build history for the API (exclude the initial greeting which is "model" role)
    const history = messages
      .filter((m) => m !== messages[0]) // skip the system greeting
      .map((m) => ({ role: m.role, parts: m.parts }));

    try {
      const res = await API.post(`/ai/chat/${candidate._id}`, {
        message: trimmed,
        history,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: res.data.reply,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "The AI representative is temporarily unavailable. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "model",
        parts: `Hello! I'm the AI spokesperson for ${candidate.name} of the ${candidate.party || "Independent"} party. Ask me anything about our platform, vision, and policies!`,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  const suggestedQuestions = [
    "What are your main policies?",
    "Why should I vote for you?",
    "What's your stance on the economy?",
    "How will you improve education?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl flex flex-col"
        style={{
          height: "min(700px, 90vh)",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: "24px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 flex-shrink-0"
          style={{
            borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
            background: "rgba(99, 102, 241, 0.08)",
            borderRadius: "24px 24px 0 0",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
                }}
              >
                {candidate.name?.charAt(0) || "C"}
              </div>
              {/* AI badge */}
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">{candidate.name}</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: "rgba(99, 102, 241, 0.2)",
                    color: "#a5b4fc",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                  }}
                >
                  AI Rep
                </span>
              </div>
              <div className="text-sm" style={{ color: "#94a3b8" }}>
                <span>{candidate.party || "Independent"}</span>
                <span className="mx-2">•</span>
                <span className="text-green-400 flex-inline items-center gap-1">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1"
                    style={{ animation: "pulse 1.5s infinite" }}
                  />
                  Online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleReset}
              className="p-2 rounded-xl transition-colors"
              style={{ color: "#94a3b8" }}
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl transition-colors"
              style={{ color: "#94a3b8" }}
              title="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-5 space-y-4"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(99,102,241,0.3) transparent" }}
        >
          {/* Suggested questions (only shown at start) */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <p className="text-xs mb-3 font-medium" style={{ color: "#64748b" }}>
                SUGGESTED QUESTIONS
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <motion.button
                    key={q}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setInput(q);
                      inputRef.current?.focus();
                    }}
                    className="text-xs px-3 py-1.5 rounded-full transition-all"
                    style={{
                      background: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      color: "#a5b4fc",
                    }}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {msg.role === "model" ? (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        boxShadow: "0 0 12px rgba(99,102,241,0.4)",
                      }}
                    >
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                      }}
                    >
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                  }`}
                  style={
                    msg.role === "model"
                      ? {
                          background: "rgba(99, 102, 241, 0.1)",
                          border: "1px solid rgba(99, 102, 241, 0.2)",
                          color: "#e2e8f0",
                        }
                      : {
                          background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                          color: "white",
                          boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                        }
                  }
                >
                  {msg.parts}
                  <div
                    className="text-xs mt-1.5 opacity-50"
                    style={{ color: msg.role === "user" ? "rgba(255,255,255,0.7)" : "#64748b" }}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 items-center"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "0 0 12px rgba(99,102,241,0.4)",
                  }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1"
                  style={{
                    background: "rgba(99, 102, 241, 0.1)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#6366f1" }}
                      animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#fca5a5",
                }}
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="p-4 flex-shrink-0"
          style={{
            borderTop: "1px solid rgba(99, 102, 241, 0.2)",
            background: "rgba(99, 102, 241, 0.04)",
            borderRadius: "0 0 24px 24px",
          }}
        >
          <div
            className="flex items-end gap-3 rounded-2xl p-2 pl-4"
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about policies, vision, plans..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm outline-none resize-none py-2 leading-relaxed"
              style={{
                color: "#e2e8f0",
                caretColor: "#6366f1",
                minHeight: "36px",
                maxHeight: "120px",
              }}
            />
            <motion.button
              whileHover={{ scale: isLoading || !input.trim() ? 1 : 1.1 }}
              whileTap={{ scale: isLoading || !input.trim() ? 1 : 0.9 }}
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl flex-shrink-0 transition-all"
              style={{
                background:
                  isLoading || !input.trim()
                    ? "rgba(99, 102, 241, 0.2)"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                boxShadow: isLoading || !input.trim() ? "none" : "0 4px 15px rgba(99,102,241,0.4)",
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </motion.button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Zap className="w-3 h-3" style={{ color: "#6366f1" }} />
            <span className="text-xs" style={{ color: "#475569" }}>
              Powered by Google Gemini · Responses are AI-generated
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
