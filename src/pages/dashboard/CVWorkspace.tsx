import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Send, Loader2, Save, Download, ArrowLeft, Sparkles, FileText, Mail,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCVDrafts, useSaveCVDraft } from "@/hooks/useCVDrafts";
import { useProfile } from "@/hooks/useProfile";
import { agentApi, gmailApi, type CVDraft } from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type ChatMsg = { role: "user" | "assistant"; content: string };

// ── CV Preview — matches the Joshua Nelson template style ─────────────────────

const CV_NAVY = "#1B2D6B";

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-5 mb-2">
      <p style={{ color: CV_NAVY }} className="text-[11px] font-extrabold uppercase tracking-widest">
        {title}
      </p>
      <div style={{ backgroundColor: CV_NAVY }} className="h-[2px] mt-0.5 rounded" />
    </div>
  );
}

function CVPreview({ draft, name, email, phone, linkedin }: {
  draft: CVDraft;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
}) {
  const contactParts = [phone, email, linkedin].filter(Boolean);
  const isEmpty = !draft.summary && !draft.skills?.length && !draft.experience?.length && !draft.education;

  return (
    <div
      className="bg-white shadow rounded-xl border border-gray-200 text-gray-800 leading-relaxed"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "12px", padding: "36px 40px" }}
    >
      {/* ── Name & title ── */}
      <div className="text-center pb-3" style={{ borderBottom: `2px solid ${CV_NAVY}` }}>
        <h1 style={{ color: CV_NAVY, fontSize: "28px", fontWeight: 700, letterSpacing: "0.01em" }}>
          {name || "Your Name"}
        </h1>
        {draft.job_title && draft.job_title !== "General CV" && (
          <p className="mt-1 text-xs font-semibold" style={{ color: CV_NAVY, letterSpacing: "0.05em" }}>
            {draft.job_title}
          </p>
        )}
        {contactParts.length > 0 && (
          <p className="mt-2 text-[11px] text-gray-500">
            {contactParts.join("  |  ")}
          </p>
        )}
      </div>

      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          <FileText className="w-8 h-8 text-gray-200" />
          <p className="text-xs text-gray-300">Your CV will appear here as Zara builds it</p>
        </div>
      )}

      {/* ── Professional Summary ── */}
      {draft.summary && (
        <>
          <SectionHeader title="Professional Summary" />
          <p className="text-[12px] text-gray-700 leading-relaxed">{draft.summary}</p>
        </>
      )}

      {/* ── Areas of Expertise ── */}
      {draft.skills && draft.skills.length > 0 && (
        <>
          {!draft.summary && <SectionHeader title="Professional Summary" />}
          <p className="text-center font-bold text-[11px] mt-3 mb-1">Skills</p>
          <p className="text-center text-[11px] italic text-gray-600">
            {draft.skills.join(" - ")}
          </p>
        </>
      )}

      {/* ── Professional Experience ── */}
      {draft.experience && draft.experience.length > 0 && (
        <>
          <SectionHeader title="Professional Experience" />
          <ul className="mt-1 space-y-1.5">
            {draft.experience.map((line, i) => (
              <li key={i} className="flex gap-2 items-start text-[12px] text-gray-700">
                <span className="mt-1 text-[10px] leading-none shrink-0" style={{ color: CV_NAVY }}>●</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ── Education & Certifications ── */}
      {draft.education && (
        <>
          <SectionHeader title="Education & Certifications" />
          {draft.education.split("\n").filter(Boolean).map((line, i) => (
            <p key={i} className="text-[12px] text-gray-700 mt-1">{line}</p>
          ))}
        </>
      )}
    </div>
  );
}

// ── Zara message bubble ───────────────────────────────────────────────────────

function ZaraBubble({ content }: { content: string }) {
  return (
    <div className="flex gap-2.5 items-start">
      <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

// ── Main workspace ─────────────────────────────────────────────────────────────

export default function CVWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: drafts = [], isLoading } = useCVDrafts();
  const { data: profile } = useProfile();
  const saveDraft = useSaveCVDraft();

  const [draft, setDraft] = useState<CVDraft | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("chat");
  const [downloading, setDownloading] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [mailTo, setMailTo] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [mailBusy, setMailBusy] = useState(false);
  const [gmailReady, setGmailReady] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load draft once drafts are fetched
  useEffect(() => {
    if (!isLoading && drafts.length > 0 && id) {
      const found = drafts.find((d) => d.draft_id === id);
      if (found) {
        setDraft(found);
        setMessages([{
          role: "assistant",
          content: `I'm looking at your CV${found.job_title ? ` targeted for **${found.job_title}**` : ""}. What would you like to improve? I can rewrite your summary, add missing keywords, tighten up your experience bullets, or suggest skills that are missing for this role.`,
        }]);
      }
    }
  }, [isLoading, drafts, id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !draft) return;
    const trimmed = input.trim();


    const userMsg: ChatMsg = { role: "user", content: trimmed };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const res = await agentApi.send([userMsg], {
        session_id: sessionId,
        cv_context: {
          draft_id: draft.draft_id,
          job_title: draft.job_title,
          summary: draft.summary,
          skills: draft.skills,
          experience: draft.experience,
          education: draft.education,
        },
      });

      setSessionId(res.session_id);
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);

      // Apply CV update action
      if (res.action?.type === "update_cv" && res.action.patch) {
        const patch = res.action.patch as Partial<CVDraft>;
        setDraft((prev) => prev ? { ...prev, ...patch } : prev);
        // Show preview tab on mobile after an update
        setActiveTab("preview");
        setTimeout(() => setActiveTab("chat"), 1200);
      }

      // Profile extraction also updates the draft fields
      if (res.action?.type === "extract_cv" && res.action.patch) {
        const patch = res.action.patch as Partial<CVDraft>;
        setDraft((prev) => prev ? { ...prev, ...patch } : prev);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I ran into an issue connecting to the AI. Try again in a moment." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      await saveDraft.mutateAsync(draft);
      setSaved(true);
      toast.success("Draft saved.");
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Failed to save draft.");
    }
  };

  /** Render the CV preview to a PDF and hand back the jsPDF doc + filename. */
  const buildPdf = async (): Promise<{ pdf: jsPDF; filename: string } | null> => {
    if (!draft?.draft_id || !previewRef.current) return null;
    const wasChatTab = activeTab === "chat";
    if (wasChatTab) setActiveTab("preview");
    try {
      if (wasChatTab) {
        // Wait for the preview panel to actually mount before capturing it.
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      const node = previewRef.current;
      if (!node) return null;
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ unit: "px", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return {
        pdf,
        filename: `CV_${(draft.job_title || "General_CV").replace(/\s+/g, "_")}.pdf`,
      };
    } finally {
      if (wasChatTab) setActiveTab("chat");
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const built = await buildPdf();
      if (built) built.pdf.save(built.filename);
    } catch {
      toast.error("Failed to generate PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const openMailDialog = async () => {
    const name = profile?.name || "";
    const role = draft?.job_title || "the advertised position";
    setMailSubject(`Application: ${role}${name ? ` — ${name}` : ""}`);
    setMailBody(
      `Good day,\n\nI would like to apply for the ${role} position. ` +
        `My CV, tailored to the requirements of the role, is attached for your consideration.\n\n` +
        `I would welcome the opportunity to discuss how my experience fits your team.\n\n` +
        `Kind regards,\n${name}${profile?.phone ? `\n${profile.phone}` : ""}${profile?.email ? `\n${profile.email}` : ""}`
    );
    setMailOpen(true);
    try {
      const status = await gmailApi.status();
      setGmailReady(status.connected);
    } catch {
      setGmailReady(false);
    }
  };

  const handleCreateDraft = async () => {
    setMailBusy(true);
    try {
      const built = await buildPdf();
      if (!built) throw new Error("Could not render the CV.");
      const base64 = built.pdf.output("datauristring").split(",")[1];
      const res = await gmailApi.createDraft({
        to: mailTo.trim(),
        subject: mailSubject,
        body: mailBody,
        attachment_filename: built.filename,
        attachment_base64: base64,
      });
      setMailOpen(false);
      toast.success("Draft waiting in your Gmail — review it and hit send.", {
        action: { label: "Open Gmail", onClick: () => window.open(res.gmail_url, "_blank") },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create the Gmail draft.");
    } finally {
      setMailBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-sm text-gray-500">CV draft not found.</p>
        <Button size="sm" variant="outline" onClick={() => navigate("/cv-editor")}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />Back to My CVs
        </Button>
      </div>
    );
  }

  const profileName = profile?.name || "Your Name";
  const profileEmail = profile?.email || "";
  const profilePhone = profile?.phone || "";
  const profileLinkedin = profile?.linkedin || "";

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 h-14 bg-white border-b border-gray-100 shrink-0 flex-wrap">
        <button
          onClick={() => navigate("/cv-editor")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">My CVs</span>
        </button>
        <div className="w-px h-5 bg-gray-200 hidden sm:block" />
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FileText className="w-4 h-4 text-brand-500 shrink-0" />
          <span className="text-sm font-medium text-gray-800 truncate">
            {draft.job_title || "General CV"}
          </span>
        </div>

        {/* Mobile tab toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 lg:hidden">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === "chat" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            CV
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={handleSave}
            disabled={saveDraft.isPending || saved}
          >
            {saved
              ? "Saved"
              : saveDraft.isPending
              ? <><Loader2 className="w-3 h-3 animate-spin" />Saving...</>
              : <><Save className="w-3 h-3" />Save</>}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading
              ? <><Loader2 className="w-3 h-3 animate-spin" />Exporting...</>
              : <><Download className="w-3 h-3" /><span className="hidden sm:inline">Export PDF</span></>}
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5 bg-brand-600 hover:bg-brand-700 text-white"
            onClick={openMailDialog}
          >
            <Mail className="w-3 h-3" />
            <span className="hidden sm:inline">Draft in Gmail</span>
          </Button>
        </div>
      </div>

      {/* Body — split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div className={`flex flex-col w-full lg:w-2/5 border-r border-gray-100 ${activeTab === "preview" ? "hidden lg:flex" : "flex"}`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) =>
              m.role === "assistant"
                ? <ZaraBubble key={i} content={m.content} />
                : <UserBubble key={i} content={m.content} />
            )}
            {sending && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  {[0,1,2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-white">
            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Zara to improve your CV…"
                rows={2}
                className="resize-none text-sm border-gray-200 focus-visible:ring-1 focus-visible:ring-brand-300 flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                size="sm"
                className="bg-brand-600 hover:bg-brand-700 text-white h-10 w-10 p-0 shrink-0"
                onClick={handleSend}
                disabled={sending || !input.trim()}
              >
                {sending
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["Improve my summary", "Add missing skills", "Sharpen experience bullets", "Make it more ATS-friendly"].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors bg-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CV Preview panel */}
        <div className={`flex-1 overflow-y-auto bg-gray-50 p-6 ${activeTab === "chat" ? "hidden lg:block" : "block"}`}>
          <div className="max-w-2xl mx-auto" ref={previewRef}>
            <CVPreview
              draft={draft}
              name={profileName}
              email={profileEmail}
              phone={profilePhone}
              linkedin={profileLinkedin}
            />
          </div>
        </div>
      </div>

      {/* Gmail draft dialog */}
      <Dialog open={mailOpen} onOpenChange={setMailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Draft this application in Gmail</DialogTitle>
            <DialogDescription>
              Zara writes the email and attaches your tailored CV as a PDF. It lands in your Gmail
              drafts — nothing is sent until you press send.
            </DialogDescription>
          </DialogHeader>

          {gmailReady === false && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-md p-3">
              Your Gmail isn't connected yet. Open Settings and connect it first.
            </p>
          )}

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">To (optional)</label>
              <Input
                value={mailTo}
                onChange={(e) => setMailTo(e.target.value)}
                placeholder="recruiter@company.co.za"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Subject</label>
              <Input value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Message</label>
              <Textarea
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
                className="min-h-[180px] text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMailOpen(false)} disabled={mailBusy}>
              Cancel
            </Button>
            <Button
              className="bg-brand-600 hover:bg-brand-700 text-white"
              onClick={handleCreateDraft}
              disabled={mailBusy || gmailReady === false || !mailSubject.trim()}
            >
              {mailBusy
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating draft...</>
                : <><Mail className="w-4 h-4 mr-2" />Create draft</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
