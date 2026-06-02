import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, FileText, X, Send, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const API_BASE = "http://localhost:8000";

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
}

// Mock AI responses using extracted document text as context
function buildMockReply(userMsg: string, doc: DocMeta | null): string {
  const q = userMsg.toLowerCase();

  if (!doc) {
    return "Upload a document first and I'll help you work through it.";
  }

  if (q.includes("summarise") || q.includes("summarize") || q.includes("summary") || q.includes("what is")) {
    const snippet = doc.text.slice(0, 600).replace(/\n+/g, " ");
    return `Here's a summary of **${doc.filename}**:\n\n${snippet}${doc.text.length > 600 ? "…" : ""}\n\nThe document is ${doc.page_count} page${doc.page_count !== 1 ? "s" : ""} long. What would you like to know more about?`;
  }
  if (q.includes("z83") || q.includes("form") || q.includes("fill")) {
    return "This looks like a government form. I can walk you through each required field. Which section would you like to start with — Personal Details, Employment History, or Qualifications?";
  }
  if (q.includes("requirement") || q.includes("qualify") || q.includes("eligible")) {
    return `Based on the document, here are the key requirements I can identify:\n\n${doc.text
      .split("\n")
      .filter((l) => l.trim().length > 20)
      .slice(0, 6)
      .map((l) => `• ${l.trim()}`)
      .join("\n")}\n\nWould you like me to check these against your CV?`;
  }
  if (q.includes("tailor") || q.includes("cv") || q.includes("apply")) {
    return "I can tailor your CV to match this document. Go to Job Detail on any job, or I can do it directly here — paste your current CV summary and I'll rewrite it to mirror the keywords in this document.";
  }
  if (q.includes("keyword")) {
    const words = doc.text
      .split(/\W+/)
      .filter((w) => w.length > 4)
      .reduce<Record<string, number>>((acc, w) => {
        acc[w.toLowerCase()] = (acc[w.toLowerCase()] || 0) + 1;
        return acc;
      }, {});
    const top = Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([w]) => w);
    return `Top keywords in this document:\n\n${top.map((k) => `• ${k}`).join("\n")}`;
  }

  return `I have the full text of **${doc.filename}** loaded (${doc.page_count} pages, ${doc.char_count.toLocaleString()} characters). You can ask me to:\n\n• Summarise the document\n• Extract requirements or qualifications\n• Identify keywords for ATS\n• Help fill a Z83 or application form\n• Tailor your CV to this posting`;
}

export default function Preview() {
  const [doc, setDoc] = useState<DocMeta | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setExtractError("Only PDF files are supported.");
      return;
    }
    // Show PDF immediately via object URL
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setDoc(null);
    setExtractError(null);
    setMessages([]);

    // Extract text via backend
    setExtracting(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_BASE}/documents/extract`, { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(err.detail || "Extraction failed");
      }
      const data: DocMeta = await res.json();
      setDoc(data);
      setMessages([
        {
          id: "init",
          role: "assistant",
          content: `**${data.filename}** loaded — ${data.page_count} page${data.page_count !== 1 ? "s" : ""}, ${data.char_count.toLocaleString()} characters extracted. What would you like to do with it?`,
        },
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not extract text from PDF.";
      setExtractError(msg);
      setMessages([
        {
          id: "err",
          role: "assistant",
          content: `Could not extract text: ${msg}. The PDF may be scanned or image-based. You can still view it above.`,
        },
      ]);
    } finally {
      setExtracting(false);
    }
  }, [pdfUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setThinking(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const reply = buildMockReply(text, doc);
    setMessages((m) => [...m, { id: Date.now().toString(), role: "assistant", content: reply }]);
    setThinking(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearDoc = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setDoc(null);
    setMessages([]);
    setExtractError(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#F0F2F5]">
      {/* Top bar */}
      <div className="h-12 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shrink-0">
        <FileText className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-medium text-gray-800 truncate flex-1">
          {doc ? doc.filename : pdfUrl ? "Loading…" : "Document AI"}
        </span>
        {doc && (
          <span className="text-xs text-gray-400 shrink-0">
            {doc.page_count} page{doc.page_count !== 1 ? "s" : ""} · {doc.char_count.toLocaleString()} chars
          </span>
        )}
        {extracting && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />}
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
          <Upload className="w-3 h-3 mr-1.5" />
          {pdfUrl ? "Replace" : "Upload PDF"}
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
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="Document preview"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer group"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 group-hover:border-indigo-400 flex items-center justify-center transition-colors">
                <Upload className="w-7 h-7 text-gray-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Upload a PDF to get started</p>
                <p className="text-xs text-gray-400 mt-1">Job description, Z83 form, or any document</p>
              </div>
            </div>
          )}

          {extractError && (
            <div className="absolute bottom-3 left-3 right-3 bg-red-50 border border-red-100 text-xs text-red-500 px-3 py-2 rounded-lg">
              {extractError}
            </div>
          )}
        </div>

        {/* Chat panel */}
        <div
          className={`bg-white border-t border-gray-100 flex flex-col transition-all duration-200 ${
            chatOpen ? "h-72" : "h-10"
          }`}
        >
          {/* Chat header */}
          <div
            className="flex items-center justify-between px-4 h-10 cursor-pointer shrink-0 select-none"
            onClick={() => setChatOpen((o) => !o)}
          >
            <span className="text-xs font-medium text-gray-500">AI Assistant</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${chatOpen ? "" : "-rotate-180"}`}
            />
          </div>

          {chatOpen && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-3">
                {messages.length === 0 && (
                  <p className="text-xs text-gray-400 pt-2">
                    Upload a document above, then ask me anything about it.
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-bl-sm">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 pb-3 shrink-0">
                <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                  <Textarea
                    ref={textareaRef}
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
                    className="w-7 h-7 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 rounded-lg flex items-center justify-center transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 px-1">Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
