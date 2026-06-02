import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, FileText, X, Send, Loader2, ChevronDown,
  PenLine, Download, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/useProfile";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface DocMeta {
  filename: string;
  page_count: number;
  text: string;
  char_count: number;
  fields: string[];
  is_fillable: boolean;
}

// Shorten verbose AcroForm field names like "form[0].page1[0].firstName[0]" → "firstName"
function labelField(name: string): string {
  const clean = name.replace(/\[\d+\]/g, "");
  const parts = clean.split(/[._]/);
  return parts[parts.length - 1] || name;
}

export default function Preview() {
  const { data: profile } = useProfile();

  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<DocMeta | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  // Chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  // Fill panel
  const [fillOpen, setFillOpen] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [suggesting, setSuggesting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fillError, setFillError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      setExtractError("Only PDF files are supported.");
      return;
    }
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(f);
    setPdfUrl(URL.createObjectURL(f));
    setDoc(null);
    setMessages([]);
    setExtractError(null);
    setFillOpen(false);
    setFieldValues({});
    setFillError(null);
    setExtracting(true);

    try {
      const form = new FormData();
      form.append("file", f);
      const res = await fetch(`${API_BASE}/documents/extract`, { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Extraction failed" }));
        throw new Error(err.detail);
      }
      const data: DocMeta = await res.json();
      setDoc(data);

      // Init field values to empty
      const init: Record<string, string> = {};
      data.fields.forEach((fld) => { init[fld] = ""; });
      setFieldValues(init);

      setMessages([{
        id: "init",
        role: "assistant",
        content: data.is_fillable
          ? `**${data.filename}** loaded — ${data.page_count} page${data.page_count !== 1 ? "s" : ""}, ${data.fields.length} fillable fields detected. Click **Fill Form** to auto-populate, or ask me anything about this document.`
          : `**${data.filename}** loaded — ${data.page_count} page${data.page_count !== 1 ? "s" : ""}, ${data.char_count.toLocaleString()} characters. This PDF has no fillable fields, but I can help you understand it or tailor your CV to it.`,
      }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not process PDF.";
      setExtractError(msg);
      setMessages([{
        id: "err",
        role: "assistant",
        content: `Could not extract text: ${msg}. You can still view the PDF above.`,
      }]);
    } finally {
      setExtracting(false);
    }
  }, [pdfUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const clearDoc = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setFile(null);
    setDoc(null);
    setMessages([]);
    setExtractError(null);
    setFillOpen(false);
    setFieldValues({});
  };

  // ── Chat ───────────────────────────────────────────────────────────────────
  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setThinking(true);

    try {
      const res = await fetch(`${API_BASE}/documents/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_text: doc?.text || "",
          messages: messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
          message: text,
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { id: Date.now().toString(), role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [...m, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Backend unavailable. Make sure the server is running at localhost:8000.",
      }]);
    } finally {
      setThinking(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // ── Fill form ──────────────────────────────────────────────────────────────
  const suggestFill = async () => {
    if (!doc) return;
    setSuggesting(true);
    setFillError(null);
    try {
      const res = await fetch(`${API_BASE}/documents/suggest-fill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: doc.fields,
          document_text: doc.text,
          profile: profile || {},
        }),
      });
      const data = await res.json();
      setFieldValues(data.suggestions || {});
    } catch {
      setFillError("Could not reach backend for suggestions.");
    } finally {
      setSuggesting(false);
    }
  };

  const downloadFilled = async () => {
    if (!file || !doc) return;
    setDownloading(true);
    setFillError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("values", JSON.stringify(fieldValues));
      const res = await fetch(`${API_BASE}/documents/fill`, { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Fill failed" }));
        throw new Error(err.detail);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `filled_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setFillError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  // Open fill panel and auto-suggest on first open
  const openFillPanel = async () => {
    setFillOpen(true);
    setChatOpen(false);
    const hasValues = Object.values(fieldValues).some((v) => v.trim().length > 0);
    if (!hasValues) await suggestFill();
  };

  return (
    <div className="flex flex-col h-full bg-[#F0F2F5]">
      {/* Top bar */}
      <div className="h-12 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shrink-0">
        <FileText className="w-4 h-4 text-brand-500 shrink-0" />
        <span className="text-sm font-medium text-gray-800 truncate flex-1">
          {doc ? doc.filename : pdfUrl ? "Loading…" : "Document AI"}
        </span>
        {doc && (
          <span className="text-xs text-gray-400 shrink-0">
            {doc.page_count}p · {doc.char_count.toLocaleString()} chars
            {doc.is_fillable && ` · ${doc.fields.length} fields`}
          </span>
        )}
        {extracting && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400 shrink-0" />}
        {doc?.is_fillable && (
          <Button
            size="sm"
            className="shrink-0 h-7 text-xs bg-brand-600 hover:bg-brand-700 text-white"
            onClick={openFillPanel}
          >
            <PenLine className="w-3 h-3 mr-1.5" />Fill Form
          </Button>
        )}
        {pdfUrl && (
          <button onClick={clearDoc} className="text-gray-400 hover:text-gray-600 shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 h-7 text-xs"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-3 h-3 mr-1.5" />{pdfUrl ? "Replace" : "Upload PDF"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* PDF viewer */}
        <div
          className="flex-1 overflow-hidden relative"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {pdfUrl ? (
            <iframe src={pdfUrl} className="w-full h-full border-0" title="Document preview" />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer group"
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 group-hover:border-brand-400 flex items-center justify-center transition-colors">
                <Upload className="w-7 h-7 text-gray-300 group-hover:text-brand-400 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Upload a PDF to get started</p>
                <p className="text-xs text-gray-400 mt-1">Job description, Z83, or any fillable form — drag & drop or click</p>
              </div>
            </div>
          )}
          {extractError && (
            <div className="absolute bottom-3 left-3 right-3 bg-red-50 border border-red-100 text-xs text-red-500 px-3 py-2 rounded-lg">
              {extractError}
            </div>
          )}
        </div>

        {/* Fill panel */}
        {fillOpen && doc?.is_fillable && (
          <div className="h-80 bg-white border-t border-gray-100 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-10 border-b border-gray-50 shrink-0">
              <span className="text-xs font-medium text-gray-700">
                Fill Form — {doc.fields.length} fields
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={suggestFill}
                  disabled={suggesting}
                  className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-700 disabled:opacity-50"
                >
                  {suggesting
                    ? <><Loader2 className="w-3 h-3 animate-spin" />Suggesting…</>
                    : <><RefreshCw className="w-3 h-3" />Re-suggest</>}
                </button>
                <button onClick={() => { setFillOpen(false); setChatOpen(true); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {suggesting ? (
                <div className="flex items-center gap-2 text-xs text-gray-400 py-6 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />Asking AI to suggest values…
                </div>
              ) : (
                doc.fields.map((fld) => (
                  <div key={fld} className="flex items-center gap-3">
                    <label
                      className="text-xs text-gray-500 w-36 shrink-0 truncate"
                      title={fld}
                    >
                      {labelField(fld)}
                    </label>
                    <Input
                      value={fieldValues[fld] ?? ""}
                      onChange={(e) => setFieldValues((v) => ({ ...v, [fld]: e.target.value }))}
                      className="h-7 text-xs border-gray-200 flex-1"
                      placeholder="—"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 pb-3 pt-2 border-t border-gray-50 shrink-0 flex items-center justify-between">
              {fillError && <span className="text-xs text-red-400">{fillError}</span>}
              {!fillError && <span className="text-xs text-gray-400">Edit any field before downloading</span>}
              <Button
                size="sm"
                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={downloadFilled}
                disabled={downloading || suggesting}
              >
                {downloading
                  ? <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Generating…</>
                  : <><Download className="w-3 h-3 mr-1.5" />Download Filled PDF</>}
              </Button>
            </div>
          </div>
        )}

        {/* Chat panel */}
        {!fillOpen && (
          <div className={`bg-white border-t border-gray-100 flex flex-col transition-all duration-200 ${chatOpen ? "h-72" : "h-10"}`}>
            <div
              className="flex items-center justify-between px-4 h-10 cursor-pointer shrink-0 select-none"
              onClick={() => setChatOpen((o) => !o)}
            >
              <span className="text-xs font-medium text-gray-500">AI Assistant</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${chatOpen ? "" : "-rotate-180"}`} />
            </div>

            {chatOpen && (
              <>
                <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-3">
                  {messages.length === 0 && (
                    <p className="text-xs text-gray-400 pt-2">Upload a document above, then ask me anything about it.</p>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-brand-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {thinking && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-bl-sm">
                        <div className="flex gap-1 items-center h-4">
                          {[0, 1, 2].map((i) => (
                            <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="px-3 pb-3 shrink-0">
                  <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Ask about this document…"
                      rows={1}
                      className="flex-1 resize-none bg-transparent border-0 p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 min-h-0"
                    />
                    <button
                      onClick={send}
                      disabled={!input.trim() || thinking}
                      className="w-7 h-7 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-200 rounded-lg flex items-center justify-center transition-colors shrink-0"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 px-1">Enter to send · Shift+Enter for new line</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
