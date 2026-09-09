import { useMemo, useRef, useState } from "react";
import {
  Upload,
  Loader2,
  Download,
  Send,
  Wand2,
  FileCheck2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { useProfileDocuments } from "@/hooks/useProfileDocuments";
import { documentsApi, triggerBlobDownload } from "@/lib/api";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

function prettyLabel(field: string) {
  return field
    .replace(/[_.]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

export default function Z83Form() {
  const { data: profile } = useProfile();
  const { data: documents = [] } = useProfileDocuments();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<string[]>([]);
  const [docText, setDocText] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [prefilling, setPrefilling] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Upload your Z83 form and I'll pick up every box that needs filling. Then just tell me what to put where — for example \"my ID number is 9001015800083\" — or type into the boxes yourself.",
    },
  ]);

  const savedForms = useMemo(
    () => documents.filter((d) => /z83|form/i.test(d.original_filename) && d.content_type === "application/pdf"),
    [documents]
  );

  async function loadForm(f: File) {
    setLoadingForm(true);
    try {
      const res = await documentsApi.extract(f);
      setFile(f);
      setDocText(res.text || "");
      setFields(res.fields);
      setValues(Object.fromEntries(res.fields.map((k) => [k, ""])));
      if (!res.fields.length) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "I read this PDF but it has no fillable boxes in it. Please upload the official fillable Z83 (the version from the DPSA website) so I can type into it.",
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `Got it — I found ${res.fields.length} boxes on this form. Tap "Fill from my profile" to start, then tell me anything you want changed.`,
          },
        ]);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read that PDF.");
    } finally {
      setLoadingForm(false);
    }
  }

  async function useSaved(docId: string, filename: string) {
    setLoadingForm(true);
    try {
      const blob = await documentsApi.download(docId);
      await loadForm(new File([blob], filename, { type: "application/pdf" }));
    } catch {
      toast.error("Could not open that saved form.");
      setLoadingForm(false);
    }
  }

  async function prefill() {
    if (!fields.length) return;
    setPrefilling(true);
    try {
      const res = await documentsApi.suggestFill({
        fields,
        document_text: docText,
        profile,
      });
      setValues((v) => ({ ...v, ...res.suggestions }));
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I filled in everything I could from your profile. Please check each box before you download." },
      ]);
    } catch {
      toast.error("Could not fill the form automatically. You can still type in the boxes.");
    } finally {
      setPrefilling(false);
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || !fields.length) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setSending(true);
    try {
      const res = await documentsApi.formChat({
        instruction: text,
        fields,
        values,
        document_text: docText,
        profile,
      });
      setValues(res.values);
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong on my side. Try again, or edit the box directly." },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function download() {
    if (!file) return;
    setDownloading(true);
    try {
      const saved = await documentsApi.fill(file, values);
      const blob = await documentsApi.download(saved.id);
      triggerBlobDownload(blob, saved.original_filename);
      toast.success("Your completed form is downloaded and saved under My CVs.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not build the completed form.");
    } finally {
      setDownloading(false);
    }
  }

  const filledCount = Object.values(values).filter((v) => v.trim()).length;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Z83 government form</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill the official Z83 by chatting or typing, then download it and submit it with your CV.
          </p>
        </div>
        {file && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> New form
            </Button>
            <Button
              size="sm"
              onClick={download}
              disabled={downloading || !filledCount}
              className="bg-[#F7941D] hover:bg-[#E08518] text-white"
            >
              {downloading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
              Download form
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) loadForm(f);
        }}
      />

      {!file && (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
          {loadingForm ? (
            <Loader2 className="w-6 h-6 mx-auto animate-spin text-brand-600" />
          ) : (
            <>
              <FileCheck2 className="w-8 h-8 mx-auto text-gray-300" />
              <p className="mt-3 text-sm text-gray-600">Upload the official Z83 PDF to get started.</p>
              <Button className="mt-4" onClick={() => fileRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1.5" /> Upload Z83 PDF
              </Button>
              {savedForms.length > 0 && (
                <div className="mt-6 text-left max-w-sm mx-auto">
                  <p className="text-xs font-medium text-gray-500 mb-2">Or use one you already uploaded</p>
                  <div className="space-y-1.5">
                    {savedForms.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => useSaved(d.id, d.original_filename)}
                        className="w-full text-left text-sm px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 truncate"
                      >
                        {d.original_filename}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {file && (
        <div className="mt-6 grid lg:grid-cols-2 gap-4">
          {/* Fields */}
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">What goes on the form</h2>
              <Button size="sm" variant="outline" onClick={prefill} disabled={prefilling || !fields.length}>
                {prefilling ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 mr-1.5" />}
                Fill from my profile
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {file.name} · {filledCount} of {fields.length} boxes filled
            </p>

            {fields.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                This PDF has no fillable boxes. Upload the fillable Z83 from the DPSA website.
              </p>
            ) : (
              <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {fields.map((f) => (
                  <div key={f}>
                    <label className="text-xs font-medium text-gray-600">{prettyLabel(f)}</label>
                    <Input
                      value={values[f] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col">
            <h2 className="text-sm font-semibold text-gray-900">Tell me what to change</h2>
            <div className="mt-3 flex-1 space-y-3 overflow-y-auto max-h-[52vh] pr-1">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-xl bg-brand-600 text-white text-sm px-3 py-2"
                      : "max-w-[90%] text-sm text-gray-700"
                  }
                >
                  {m.content}
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating your form…
                </div>
              )}
            </div>
            <div className="mt-3 flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={2}
                placeholder='e.g. "My surname is Mphela and I have a driver&apos;s licence"'
                className="resize-none"
                disabled={!fields.length}
              />
              <Button onClick={send} disabled={sending || !input.trim() || !fields.length} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
