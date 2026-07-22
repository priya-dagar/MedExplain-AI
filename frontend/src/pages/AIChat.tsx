import { useState, FormEvent, useRef, useEffect } from "react";
import { ChatMessage } from "../types/chat";
import { useAuth } from "../context/AuthContext";
import { sendMessage, getChatHistory } from "../services/chatService";
import { RefreshCw, Sparkles, ChevronRight, Paperclip, ArrowUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

const SUGGESTED_CHIPS = [
  "What medication can I take?",
  "Could it be related to my Allergies?",
  "Add to my health records",
];

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getChatHistory().then((history) => {
      const loaded: ChatMessage[] = history.flatMap((turn) => [
        { role: "user", content: turn.message, timestamp: new Date(turn.created_at) },
        { role: "assistant", content: turn.response, timestamp: new Date(turn.created_at) },
      ]);
      setMessages(loaded);
    });
  }, []);

  const submitMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    const userMessage: ChatMessage = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const data = await sendMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response, timestamp: new Date() }]);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitMessage(input);
  };

  const handleNewChat = () => {
    // Clears the visible thread only — does not delete server-side chat_history.
    setMessages([]);
    setError("");
  };

  const userInitial = user?.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* New chat action */}
      <div className="flex justify-end px-6 pt-4">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-1.5 text-sm font-medium text-[#4a4a44] border border-[#d8d5cb] rounded-full px-4 py-1.5 hover:bg-[#f1efe6] transition-colors"
        >
          <RefreshCw size={16} />
          New chat
        </button>
      </div>

      {/* Disclaimer banner */}
      <div className="flex justify-center px-6 pt-3">
        <span className="text-xs text-[#8a8a80] border border-[#e5e2d8] rounded-full px-4 py-1.5 bg-white">
          Not a substitute for professional medical advice · For emergencies, call 112
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {messages.length === 0 && (
          <div className="flex gap-3 max-w-2xl">
            <div className="w-9 h-9 rounded-full bg-[#1a4d4a] flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="bg-white border border-[#e5e2d8] rounded-2xl rounded-tl-sm px-5 py-4 text-[#3d3d3a] text-sm leading-relaxed">
              Hello{user ? `, ${user.name.split(" ")[0]}` : ""}! I'm your AI Health Companion. I
              can help you understand symptoms, explain your prescriptions, or answer general
              health questions. How can I help you today?
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="w-9 h-9 rounded-full bg-[#1a4d4a] flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} className="text-white" />
              </div>
            )}

            <div className="max-w-[70%]">
              <div
                className={`px-5 py-3.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1a4d4a] text-white rounded-2xl rounded-tr-sm whitespace-pre-wrap"
                    : "bg-white border border-[#e5e2d8] text-[#3d3d3a] rounded-2xl rounded-tl-sm prose prose-sm max-w-none prose-headings:text-[#1a2e2e] prose-strong:text-[#1a2e2e]"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
              <p
                className={`text-xs text-[#8a8a80] mt-1 ${
                  msg.role === "user" ? "text-right" : ""
                }`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>

            {msg.role === "user" && (
              <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold">
                {userInitial}
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1a4d4a] flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="bg-white border border-[#e5e2d8] rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm text-[#8a8a80]">
              Thinking…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="px-6 py-2 text-sm text-red-600 bg-red-50">{error}</div>
      )}

      {/* Suggested chips */}
      <div className="flex flex-wrap gap-2 px-6 pb-3">
        {SUGGESTED_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => submitMessage(chip)}
            disabled={isSending}
            className="flex items-center gap-1 text-sm text-[#4a4a44] border border-[#d8d5cb] rounded-full px-4 py-1.5 hover:bg-[#f1efe6] transition-colors disabled:opacity-50"
          >
            <ChevronRight size={14} />
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[#e5e2d8] bg-white px-6 py-4">
        <div className="flex items-center gap-3 bg-[#f5f3ed] rounded-full px-4 py-2">
          <Paperclip size={18} className="text-[#8a8a80]" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="w-8 h-8 rounded-full bg-[#1a4d4a] text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
            aria-label="Send message"
          >
            <ArrowUp size={16} />
          </button>
        </div>
        <p className="text-center text-xs text-[#8a8a80] mt-3">
          MedExplain AI · Responses are AI-generated · Always verify with your doctor
        </p>
      </form>
    </div>
  );
}