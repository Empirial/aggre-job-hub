import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send, Paperclip, RotateCcw, AlertCircle, Sparkles,
  FileText, CheckCircle, X, ChevronRight, History, Trash2, Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { agentApi, documentsApi, getAuthHeader, jobsApi, type AgentAction, type ChatSession, type UserProfile } from "@/lib/api";
import { useProfile, useSaveProfile } from "@/hooks/useProfile";
import { useChatSessions, useDeleteChatSession } from "@/hooks/useChatSessions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  action?: AgentAction;
  actionApplied?: boolean;
  fileAttachment?: string;
}

const QUICK_ACTIONS = [
  { label: "Review my CV", prompt: "Review my CV profile and suggest improvements to make it more ATS-friendly for South African employers." },
  { label: "Update my skills", prompt: "I want to update my skills list. What skills should I have based on my experience, and can you update them?" },
  { label: "Write a cover letter", prompt: "Help me write a cover letter for a software developer role at a South African company." },
  { label: "SA salary check", prompt: "What salary should I expect for my role and experience level in South Africa?" },
];

const WELCOME_MESSAGE = `Hi there! I'm **Zara**, your CareerGate AI career advisor.

I'm built for the South African job market and I can help you with:
- **CV tailoring** for ATS systems used by SA employers (FNB, Standard Bank, Vodacom, etc.)
- **Profile editing** — just tell me what to change and I'll update it directly
- **Upload your CV** — drop a PDF and I'll extract your info automatically
- **Cover letters, interview prep, salary benchmarks** for SA roles

What can I help you with today?`;

// ── Session helpers ────────────────────────────────────────────────────────────

function formatSessionTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function sessionPreview(session: ChatSession): string {
  const firstUser = session.messages.find((m) => m.role === "user");
  const text = firstUser?.content || session.messages[0]?.content || "New conversation";
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

// ── Markdown renderer ─────────────────────────────────────────────────────────

function parseInline(line: string, key: string) {
  const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={`${key}-b${i}`}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))
      return <code key={`${key}-c${i}`} className="text-brand-600 bg-brand-50 px-1 rounded text-[0.85em]">{p.slice(1, -1)}</code>;
    return <span key={`${key}-t${i}`}>{p}</span>;
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

// ── Zara avatar ───────────────────────────────────────────────────────────────

function ZaraAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  const cls = size === "md"
    ? "w-10 h-10 rounded-xl"
    : "w-7 h-7 rounded-lg flex-shrink-0 mt-0.5";
  return (
    <div className={cn("bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center", cls)}>
      <Sparkles className={size === "md" ? "w-5 h-5 text-white" : "w-3.5 h-3.5 text-white"} />
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <ZaraAvatar />
      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 180}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Action confirmation card ──────────────────────────────────────────────────

function ActionCard({
  action,
  applied,
  onApply,
  onDismiss,
}: {
  action: AgentAction;
  applied?: boolean;
  onApply: () => void;
  onDismiss: () => void;
}) {
  const navigate = useNavigate();
  const isCV = action.type === "extract_cv";
  const isJob = action.type === "add_job";
  const patch = action.patch as Record<string, unknown>;
  const keys = Object.keys(patch);

  if (applied) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{isJob ? "Job added to your Jobs Board." : "Profile updated successfully."}</span>
        {(isCV || isJob) && (
          <button
            onClick={() => navigate(isJob ? "/jobs" : "/cv-editor")}
            className="ml-auto flex items-center gap-1 text-brand-600 font-medium hover:underline"
          >
            {isJob ? "Open Jobs Board" : "Open CV Editor"} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 border border-brand-200 bg-brand-50/60 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-brand-600 rounded flex items-center justify-center shrink-0">
          {isCV ? <FileText className="w-3 h-3 text-white" /> : <Sparkles className="w-3 h-3 text-white" />}
        </div>
        <p className="text-xs font-semibold text-brand-700">
          {isJob
            ? "Job Posting Detected — Add to Jobs Board?"
            : isCV
            ? "CV Data Extracted — Import to Profile?"
            : "Profile Update Proposed"}
        </p>
      </div>
      <div className="space-y-1">
        {keys.slice(0, 5).map((key) => {
          const val = patch[key];
          const display = Array.isArray(val)
            ? `${(val as string[]).slice(0, 3).join(", ")}${(val as string[]).length > 3 ? ` +${(val as string[]).length - 3} more` : ""}`
            : String(val).slice(0, 100);
          return (
            <div key={key} className="text-xs text-gray-600">
              <span className="font-medium text-gray-800 capitalize">{key}:</span> {display}
            </div>
          );
        })}
        {keys.length > 5 && (
          <p className="text-xs text-gray-400">+{keys.length - 5} more fields</p>
        )}
      </div>
      <div className="flex gap-2 pt-0.5">
        <Button size="sm" className="h-7 text-xs bg-brand-600 hover:bg-brand-700 text-white px-3" onClick={onApply}>
          {isJob ? "Add to Jobs Board" : "Apply to Profile"}
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-500 px-3" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}

// ── Assistant message bubble ──────────────────────────────────────────────────

function AssistantMessage({
  message,
  onApplyAction,
  onDismissAction,
}: {
  message: Message;
  onApplyAction: (id: string) => void;
  onDismissAction: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 max-w-[85%]">
      <ZaraAvatar />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-gray-700">
          <SafeMarkdown content={message.content} />
        </div>
        {message.action && (
          <ActionCard
            action={message.action}
            applied={message.actionApplied}
            onApply={() => onApplyAction(message.id)}
            onDismiss={() => onDismissAction(message.id)}
          />
        )}
      </div>
    </div>
  );
}

// ── Session list ──────────────────────────────────────────────────────────────

function SessionList({
  sessions,
  loading,
  activeId,
  onSelect,
  onDelete,
}: {
  sessions: ChatSession[];
  loading: boolean;
  activeId?: string;
  onSelect: (session: ChatSession) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}) {
  const sorted = [...sessions].sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-xs text-gray-400">
        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />Loading chats...
      </div>
    );
  }

  if (sorted.length === 0) {
    return <p className="text-xs text-gray-400 px-3 py-4">No past conversations yet.</p>;
  }

  return (
    <div className="space-y-0.5 px-2">
      {sorted.map((s) => (
        <div
          key={s.session_id}
          className={cn(
            "w-full rounded-lg px-1 py-1 flex items-center gap-1 transition-colors",
            activeId === s.session_id ? "bg-brand-50" : "hover:bg-gray-50"
          )}
        >
          <button
            onClick={() => onSelect(s)}
            className="flex-1 min-w-0 text-left px-2 py-1.5"
          >
            <p className={cn(
              "text-xs font-medium truncate",
              activeId === s.session_id ? "text-brand-700" : "text-gray-700"
            )}>
              {sessionPreview(s)}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">{formatSessionTime(s.updated_at)}</p>
          </button>
          <button
            onClick={(e) => onDelete(s.session_id, e)}
            title="Delete chat"
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main Chat page ────────────────────────────────────────────────────────────

export default function Chat() {
  const { data: profile } = useProfile();
  const saveProfile = useSaveProfile();
  const qc = useQueryClient();
  const { data: sessions = [], isLoading: sessionsLoading } = useChatSessions();
  const deleteSession = useDeleteChatSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async (text: string, docText?: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    const trimmed = text.trim();

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await agentApi.send([{ role: "user", content: trimmed }], {
        session_id: sessionId,
        document_text: docText ?? documentText ?? undefined,
      });
      setSessionId(res.session_id);
      qc.invalidateQueries({ queryKey: ["chatSessions"] });

      const asstMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.reply,
        action: res.action,
      };
      setMessages((prev) => [...prev, asstMsg]);

      if (docText || documentText) {
        setDocumentText(null);
        setDocumentName(null);
      }
    } catch {
      setError("Zara can't answer right now. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, messages, sessionId, documentText]);

  const applyAction = async (msgId: string) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg?.action) return;

    if (msg.action.type === "add_job") {
      const patch = msg.action.patch;
      try {
        await jobsApi.addManual({
          title: patch.title || "Untitled role",
          company: patch.company || "Unknown company",
          location: patch.location || "South Africa",
          description: patch.description || "",
          url: patch.url,
        });
        setMessages((prev) =>
          prev.map((m) => m.id === msgId ? { ...m, actionApplied: true } : m)
        );
        toast.success("Job added to your Jobs Board");
      } catch {
        toast.error("Failed to add job — try again");
      }
      return;
    }

    const DEFAULT_PROFILE: UserProfile = {
      name: "", email: "", phone: "", linkedin: "",
      summary: "", skills: [], experience: [], education: "",
      keywords: [], locations: [],
      jobTypes: { fullTime: true, remote: false, contract: false },
    };

    const current: UserProfile = qc.getQueryData(["userProfile"]) ?? DEFAULT_PROFILE;
    const merged: UserProfile = { ...current, ...(msg.action.patch as Partial<UserProfile>) };

    try {
      await saveProfile.mutateAsync(merged);
      setMessages((prev) =>
        prev.map((m) => m.id === msgId ? { ...m, actionApplied: true } : m)
      );
      toast.success("Profile updated by Zara");
    } catch {
      toast.error("Failed to save profile — try again");
    }
  };

  const dismissAction = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => m.id === msgId ? { ...m, action: undefined } : m)
    );
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are supported");
      return;
    }

    const readingId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: `Uploaded: **${file.name}**`, fileAttachment: file.name },
      { id: readingId, role: "assistant", content: `Reading **${file.name}**...` },
    ]);
    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      const authHeader = await getAuthHeader();
      const res = await fetch(`${API_BASE}/documents/extract`, { method: "POST", body: form, headers: authHeader });
      if (!res.ok) throw new Error("Extraction failed");
      const data = await res.json();

      setMessages((prev) => prev.filter((m) => m.id !== readingId));

      if (data.is_fillable && Array.isArray(data.fields) && data.fields.length > 0) {
        await handleFillableForm(file, data.fields, data.text);
        setLoading(false);
        return;
      }

      setLoading(false);
      const autoPrompt = `I've uploaded my document "${file.name}" (${data.page_count} page${data.page_count !== 1 ? "s" : ""}). Please analyze it. If it's a CV/resume, extract my profile data. If it's a job description, help me tailor my CV for it.`;
      await send(autoPrompt, data.text);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== readingId));
      setLoading(false);
      toast.error("Could not read the PDF — make sure it contains selectable text");
    }
  };

  const handleFillableForm = async (file: File, fields: string[], documentText: string) => {
    const fillingId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: fillingId, role: "assistant", content: `**${file.name}** looks like a fillable form with ${fields.length} field${fields.length !== 1 ? "s" : ""}. Filling it out from your profile...` },
    ]);

    try {
      const { suggestions } = await documentsApi.suggestFill({
        fields,
        document_text: documentText,
        profile: profile ?? {},
      });
      const filledDoc = await documentsApi.fill(file, suggestions);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Done — I've filled in **${filledDoc.original_filename}** using your saved profile and saved it to your CV Editor. Review it there and download it whenever you're ready.`,
        },
      ]);
      toast.success("Filled form saved to CV Editor");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I couldn't auto-fill that form. You can still ask me questions about it, or fill it in manually.",
        },
      ]);
      toast.error(err instanceof Error ? err.message : "Failed to fill form");
    }
  };

  const reset = () => {
    setMessages([{ id: "welcome", role: "assistant", content: WELCOME_MESSAGE }]);
    setSessionId(undefined);
    setDocumentText(null);
    setDocumentName(null);
    setInput("");
    setError(null);
    setHistoryOpen(false);
  };

  const loadSession = (session: ChatSession) => {
    const loaded: Message[] = session.messages.map((m, i) => ({
      id: `${session.session_id}-${i}`,
      role: (m.role as Role) ?? "assistant",
      content: String(m.content ?? ""),
    }));
    setMessages(loaded.length ? loaded : [{ id: "welcome", role: "assistant", content: WELCOME_MESSAGE }]);
    setSessionId(session.session_id);
    setDocumentText(null);
    setDocumentName(null);
    setInput("");
    setError(null);
    setHistoryOpen(false);
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteSession.mutateAsync(id);
      if (sessionId === id) reset();
    } catch {
      toast.error("Failed to delete chat");
    }
  };

  const showQuickActions = messages.length <= 1;

  return (
    <div className="flex h-full bg-white">
      {/* ── History sidebar (desktop) ──────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-100 shrink-0">
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Chats</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="h-7 text-xs text-gray-500 hover:text-gray-700 gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <SessionList
            sessions={sessions}
            loading={sessionsLoading}
            activeId={sessionId}
            onSelect={loadSession}
            onDelete={handleDeleteSession}
          />
        </div>
      </aside>

      {/* ── History drawer (mobile) ──────────────────────────────────────────── */}
      {historyOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setHistoryOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col shadow-xl transition-transform duration-200 lg:hidden",
          historyOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="shrink-0 flex items-center justify-between px-4 h-14 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Chats</p>
          <button onClick={() => setHistoryOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <SessionList
            sessions={sessions}
            loading={sessionsLoading}
            activeId={sessionId}
            onSelect={loadSession}
            onDelete={handleDeleteSession}
          />
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full min-w-0">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHistoryOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-900 shrink-0"
            title="Chat history"
          >
            <History className="w-4 h-4" />
          </button>
          <ZaraAvatar size="md" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Zara</p>
            <p className="text-xs text-gray-400">SA Career Advisor · CareerGate AI</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="text-xs text-gray-500 hover:text-gray-700 gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Chat
        </Button>
      </div>

      {/* ── Active document banner ───────────────────────────────────────────── */}
      {documentName && (
        <div className="shrink-0 flex items-center gap-2 px-4 sm:px-6 py-2 bg-brand-50 border-b border-brand-100 text-xs text-brand-700">
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>Active document: <strong>{documentName}</strong></span>
          <button
            onClick={() => { setDocumentText(null); setDocumentName(null); }}
            className="ml-auto text-brand-400 hover:text-brand-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Messages ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] text-sm leading-relaxed">
                <SafeMarkdown content={msg.content} />
              </div>
            </div>
          ) : (
            <AssistantMessage
              key={msg.id}
              message={msg}
              onApplyAction={applyAction}
              onDismissAction={dismissAction}
            />
          )
        )}

        {loading && <TypingIndicator />}

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Quick action chips ───────────────────────────────────────────────── */}
      {showQuickActions && (
        <div className="shrink-0 px-4 sm:px-6 pb-3">
          <p className="text-xs text-gray-400 mb-2">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => send(a.prompt)}
                disabled={loading}
                className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors disabled:opacity-50"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input bar ───────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 sm:px-6 pb-5 pt-2 border-t border-gray-100">
        <div className="flex gap-2 items-end bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-brand-300 transition-colors">
          <button
            onClick={() => fileRef.current?.click()}
            title="Upload PDF"
            disabled={loading}
            className="text-gray-400 hover:text-brand-600 transition-colors shrink-0 self-end pb-0.5 disabled:opacity-40"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
                e.target.value = "";
              }
            }}
          />
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask Zara anything, or upload your CV with the paperclip..."
            className="flex-1 border-0 p-0 text-sm resize-none focus-visible:ring-0 bg-transparent min-h-[20px] max-h-[140px]"
            rows={1}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 self-end transition-all",
              input.trim() && !loading
                ? "bg-brand-600 text-white hover:bg-brand-700 active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-300 text-center mt-1.5 hidden sm:block">
          Enter to send · Shift+Enter for new line · Paperclip to upload a PDF
        </p>
      </div>
      </div>
    </div>
  );
}
