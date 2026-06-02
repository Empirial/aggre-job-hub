import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { chatApi } from "@/lib/api";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  streaming?: boolean;
}

const SUGGESTED_PROMPTS = [
  "How do I tailor my CV for a banking role?",
  "What ATS keywords should I use for a senior developer job?",
  "Write a cover letter for a Full Stack Developer role at Takealot",
  "How do I prepare for a technical interview at FNB?",
  "What salary should I expect as a Python developer in Johannesburg?",
  "Review my summary and make it more ATS-friendly",
];

function useTypewriter(text: string, active: boolean, onDone: () => void) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current += 4;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(interval);
        onDone();
      }
    }, 12);

    return () => clearInterval(interval);
  }, [text, active]);

  return displayed;
}

function AssistantBubble({ message, onDone }: { message: Message; onDone: () => void }) {
  const text = useTypewriter(message.content, !!message.streaming, onDone);
  const content = message.streaming ? text : message.content;

  return (
    <div className="flex gap-3 max-w-2xl">
      <div className="w-7 h-7 bg-[#F7941D] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex-1">
        <div
          className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none
            prose-headings:text-gray-900 prose-strong:text-gray-900
            prose-code:text-brand-600 prose-code:bg-brand-50 prose-code:px-1 prose-code:rounded"
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.*?)\*/g, "<em>$1</em>")
              .replace(/`(.*?)`/g, "<code>$1</code>")
              .replace(/\n\n/g, "<br/><br/>")
              .replace(/\n/g, "<br/>")
              .replace(/\|(.+)\|/g, (match) => {
                const cells = match.split("|").filter((c) => c.trim() && !c.match(/^[-\s|]+$/));
                return `<span class="font-mono text-xs">${cells.join(" · ")}</span>`;
              }),
          }}
        />
        {message.streaming && text.length < message.content.length && (
          <span className="inline-block w-1.5 h-4 bg-brand-400 ml-0.5 animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  );
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hi, I'm your CareerGate AI assistant. I can help you tailor your CV, extract ATS keywords, write cover letters, and prepare for interviews in the South African job market. What do you need?",
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    const assistantId = (Date.now() + 1).toString();

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = [...messages, userMsg]
      .filter((m) => m.id !== "welcome" || m.role === "assistant")
      .map(({ role, content }) => ({ role, content }));

    try {
      const { reply } = await chatApi.send(history);
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: reply, streaming: true },
      ]);
    } catch {
      setError("Failed to reach AI. Check your connection or try again.");
      setLoading(false);
    }
  };

  const markDone = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)));
    setLoading(false);
  };

  const reset = () => {
    setMessages([WELCOME]);
    setLoading(false);
    setInput("");
    setError(null);
  };

  const showSuggestions = messages.length === 1;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#F7941D] rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">AI Assistant</p>
            <p className="text-xs text-gray-400">Powered by DeepSeek</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600" onClick={reset}>
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> New chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-[#F7941D] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-md text-sm leading-relaxed">
                {msg.content}
              </div>
            </div>
          ) : (
            <AssistantBubble key={msg.id} message={msg} onDone={() => markDone(msg.id)} />
          )
        )}

        {loading && !messages.find((m) => m.streaming) && (
          <div className="flex gap-3 max-w-2xl">
            <div className="w-7 h-7 bg-[#F7941D] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg max-w-sm">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {showSuggestions && (
        <div className="px-6 pb-3">
          <p className="text-xs text-gray-400 mb-2">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="text-xs text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-colors font-medium"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-5 pt-2">
        <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-brand-300 transition-colors">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask anything about your job search..."
            className="flex-1 border-0 p-0 text-sm resize-none focus-visible:ring-0 bg-transparent min-h-[24px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 self-end transition-colors",
              input.trim() && !loading
                ? "bg-[#F7941D] text-white hover:bg-[#E08518]"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-gray-300 text-center mt-2">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
