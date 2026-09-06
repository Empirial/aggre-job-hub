import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, Sparkles, RotateCcw, X, AlertCircle, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chatApi } from "@/lib/api";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  streaming?: boolean;
}

// ── Page context map ──────────────────────────────────────────────────────────

interface PageContext {
  label: string;
  systemContext: string;
  suggestions: string[];
  welcome: string;
}

function getPageContext(pathname: string): PageContext {
  if (pathname === "/" || pathname === "") {
    return {
      label: "Overview",
      systemContext:
        "The user is on their dashboard home. It shows how many jobs are available to them, how many CVs they have ready, and their most recent job matches.",
      suggestions: [
        "What should I do first?",
        "Which jobs should I apply to today?",
        "How do I get more interviews?",
        "Help me finish my profile",
      ],
      welcome:
        "Hi! I'm Zara. Ask me what to do next, which jobs to go for, or how to get more interviews.",
    };
  }
  if (pathname.startsWith("/jobs/") && pathname.length > 6) {
    return {
      label: "Job",
      systemContext:
        "The user is viewing a single job listing with its full description and requirements, and can create a CV tailored to this role.",
      suggestions: [
        "Is this job a good fit for me?",
        "Tailor my CV for this job",
        "What should I highlight in my application?",
        "Write a cover letter for this job",
      ],
      welcome:
        "You're looking at a job. Want me to check if it's a good fit, or tailor your CV for it?",
    };
  }
  if (pathname === "/jobs") {
    return {
      label: "Find Jobs",
      systemContext:
        "The user is browsing available job listings, including South African government vacancies. They can search and filter by location and department.",
      suggestions: [
        "Which of these jobs suit me?",
        "What should I search for in my field?",
        "How do I apply for a government post?",
        "How do I know a job is worth applying for?",
      ],
      welcome:
        "You're browsing jobs. I can help you pick the roles worth your time.",
    };
  }
  if (pathname === "/cv-editor") {
    return {
      label: "My CVs",
      systemContext:
        "The user is on their CVs page. They can create a CV tailored to a specific job, and download it.",
      suggestions: [
        "How do I make my CV stand out?",
        "What makes a CV pass automatic screening?",
        "Help me write my summary",
        "What should I highlight for government jobs?",
      ],
      welcome:
        "Pick a job and I'll rewrite your CV to match it. Ask me anything about CV writing.",
    };
  }
  if (pathname === "/settings") {
    return {
      label: "My Profile",
      systemContext:
        "The user is filling in their profile: contact details, summary, skills, experience, education, the kind of work they want, and their documents.",
      suggestions: [
        "What should I write in my summary?",
        "What skills should I list for a finance role?",
        "How do I write a strong LinkedIn headline?",
        "Which cities should I look at in South Africa?",
      ],
      welcome:
        "A complete profile means better CVs. Ask me what to write in any field.",
    };
  }
  return {
    label: "CareerGate",
    systemContext:
      "The user is using CareerGate, an AI job application assistant for South African job seekers. It finds jobs (including government vacancies), tailors CVs, and helps with applications.",

    suggestions: [
      "Tailor my CV for a banking role",
      "Write a cover letter for a dev role at Takealot",
      "How do I prepare for a technical interview at FNB?",
      "What salary should I expect as a Python dev in JHB?",
    ],
    welcome:
      "Hi! I'm your CareerGate assistant. Ask me anything about your CV, cover letters, or job search in South Africa.",
  };
}

// ── Typewriter ────────────────────────────────────────────────────────────────

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

// ── Markdown renderer ─────────────────────────────────────────────────────────

function parseInline(line: string, lineKey: string): React.ReactNode[] {
  const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={`${lineKey}-b${i}`}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={`${lineKey}-c${i}`} className="text-brand-600 bg-brand-50 px-1 rounded text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    return <span key={`${lineKey}-t${i}`}>{part}</span>;
  });
}

function SafeMarkdown({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {content.split("\n").map((line, i) =>
        line.trim() === ""
          ? <br key={i} />
          : <p key={i} className="m-0">{parseInline(line, String(i))}</p>
      )}
    </div>
  );
}

// ── Bubbles ───────────────────────────────────────────────────────────────────

function AssistantBubble({ message, onDone }: { message: Message; onDone: () => void }) {
  const text = useTypewriter(message.content, !!message.streaming, onDone);
  const content = message.streaming ? text : message.content;
  return (
    <div className="flex gap-2">
      <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-3 py-2 flex-1 text-gray-700">
        <SafeMarkdown content={content} />
        {message.streaming && text.length < message.content.length && (
          <span className="inline-block w-1 h-3.5 bg-brand-400 ml-0.5 animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ChatBot() {
  const location = useLocation();
  const pageCtx = getPageContext(location.pathname);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset welcome message when page changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: pageCtx.welcome,
      },
    ]);
    setSessionId(undefined);
  }, [location.pathname]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (open && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    const trimmed = text.trim();

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Prepend a hidden context message so the AI knows which page the user is on.
    // Only the new message (plus this short context note) is sent — the backend
    // reconstructs prior conversation turns itself from the stored session.
    const contextMsg = {
      role: "user" as Role,
      content: `[Page context — do not repeat this to the user]: ${pageCtx.systemContext}`,
    };
    const toSend = [contextMsg, { role: "user" as Role, content: trimmed }];

    try {
      const { reply, session_id } = await chatApi.send(toSend, sessionId);
      setSessionId(session_id);
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: reply, streaming: true },
      ]);
    } catch {
      setError("Failed to reach AI. Check your connection.");
      setLoading(false);
    }
  };

  const markDone = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)));
    setLoading(false);
  };

  const reset = () => {
    setMessages([{ id: "welcome", role: "assistant", content: pageCtx.welcome }]);
    setLoading(false);
    setInput("");
    setError(null);
    setSessionId(undefined);
  };

  const showSuggestions = messages.length <= 1;
  const unread = !open && messages.length > 1;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed z-50 bottom-4 right-4 sm:bottom-5 sm:right-5 flex flex-col items-end gap-3">
        {/* Chat window */}
        {open && (
          <div
            className={cn(
              "bg-white flex flex-col overflow-hidden shadow-2xl border border-gray-100",
              // Mobile: near full-screen sheet from bottom
              "fixed bottom-0 right-0 left-0 rounded-t-2xl h-[90dvh]",
              // Desktop: floating panel
              "sm:static sm:rounded-2xl sm:w-96 sm:h-[540px]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-brand-600 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <div>
                  <p className="text-sm font-semibold text-white">Zara</p>
                  <p className="text-xs text-brand-200">{pageCtx.label}</p>

                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-200 hover:text-white hover:bg-brand-700 h-8 px-2"
                  onClick={reset}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-200 hover:text-white hover:bg-brand-700 h-8 px-2"
                  onClick={() => setOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-3 py-2 max-w-[78%] text-sm leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <AssistantBubble key={msg.id} message={msg} onDone={() => markDone(msg.id)} />
                )
              )}

              {loading && !messages.find((m) => m.streaming) && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-3 py-2">
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
                <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Suggested prompts */}
            {showSuggestions && (
              <div className="px-4 pb-2 shrink-0">
                <p className="text-xs text-gray-400 mb-1.5">Suggested for this page</p>
                <div className="flex flex-col gap-1">
                  {pageCtx.suggestions.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="text-xs text-left text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors active:scale-[0.98]"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-5 pt-2 border-t border-gray-100 shrink-0">
              <div className="flex gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-brand-300 transition-colors">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask anything..."
                  className="flex-1 border-0 p-0 text-sm resize-none focus-visible:ring-0 bg-transparent min-h-[20px] max-h-[100px]"
                  rows={1}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 self-end transition-colors",
                    input.trim() && !loading
                      ? "bg-brand-600 text-white hover:bg-brand-700 active:scale-95"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-300 text-center mt-1.5 hidden sm:block">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        )}

        {/* Toggle bubble */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative w-13 h-13 w-12 h-12 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
        >
          {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
          {unread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
              {messages.length - 1}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
