import { useState, useEffect, useRef } from "react";
import {
  Save, Plus, X, Upload, FileText, Trash2, Loader2, User,
  Briefcase, Code, GraduationCap, BookOpen, RefreshCw, Mail, CheckCircle2,
} from "lucide-react";
import { useZaraSuggest, ZaraTrigger, ZaraSuggestionCard } from "@/components/ZaraSuggest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useProfile, useSaveProfile, type UserProfile } from "@/hooks/useProfile";
import {
  useProfileDocuments,
  useUploadProfileDocument,
  useDeleteProfileDocument,
} from "@/hooks/useProfileDocuments";
import { documentsApi, gmailApi, GMAIL_REDIRECT_URI, type GmailStatus } from "@/lib/api";
import { toast } from "sonner";

export default function Settings() {
  const { data: saved, isLoading } = useProfile();
  const saveProfile = useSaveProfile();

  const [form, setForm] = useState<UserProfile | null>(null);
  const [expInput, setExpInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [kwInput, setKwInput] = useState("");
  const [locInput, setLocInput] = useState("");

  const zara = useZaraSuggest();
  const [zaraField, setZaraField] = useState<string | null>(null);
  const zaraBulletRef = useRef<number | null>(null);

  const zaraAsk = (field: string, prompt: string, onApply: (v: string) => void) => {
    setZaraField(field);
    zara.ask(prompt, onApply);
  };
  const zaraShowFor = (field: string) => zaraField === field && zara.state === "done";
  const zaraDismiss = () => { zara.dismiss(); setZaraField(null); };

  useEffect(() => {
    if (saved && !form) setForm(saved);
  }, [saved]);

  const set = (patch: Partial<UserProfile>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  const addToList = (
    field: "skills" | "experience" | "keywords" | "locations",
    value: string,
    clearFn: () => void
  ) => {
    const val = value.trim();
    if (!val || !form) return;
    if (!form[field].includes(val)) set({ [field]: [...form[field], val] });
    clearFn();
  };

  const removeFromList = (
    field: "skills" | "experience" | "keywords" | "locations",
    value: string
  ) => {
    if (!form) return;
    set({ [field]: (form[field] as string[]).filter((v) => v !== value) });
  };

  const handleSave = async () => {
    if (!form) return;
    await saveProfile.mutateAsync(form);
    toast.success("Profile saved.");
  };

  if (isLoading || !form) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-2xl pb-20">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          The more you fill in, the better your tailored CVs will be
        </p>
      </div>

      {/* ── Personal Info ─────────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <CardTitle className="text-sm font-medium text-gray-700">Your details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Full Name</Label>
              <Input
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Jane Doe"
                className="text-sm border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Email</Label>
              <Input
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="jane@example.com"
                className="text-sm border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => set({ phone: e.target.value })}
                placeholder="+27 81 234 5678"
                className="text-sm border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">LinkedIn URL</Label>
              <Input
                value={form.linkedin}
                onChange={(e) => set({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/janedoe"
                className="text-sm border-gray-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Professional Summary ──────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <CardTitle className="text-sm font-medium text-gray-700">About you</CardTitle>
            </div>
            <ZaraTrigger
              loading={zaraField === "summary" && zara.state === "loading"}
              error={zaraField === "summary" && zara.state === "error"}
              onClick={() => zaraAsk(
                "summary",
                `Write ONLY a professional summary (2-3 sentences) for a CV. No labels, no explanation, no quotes — just the summary text itself. Profile: Name: ${form.name || "Job Seeker"}, Skills: ${form.skills.slice(0, 8).join(", ") || "not set"}, Experience: ${form.experience.slice(0, 3).join(" | ") || "not set"}, Job keywords: ${form.keywords.slice(0, 5).join(", ") || "general"}. Make it ATS-friendly for South African employers.`,
                (v) => set({ summary: v })
              )}
            />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
A short paragraph about who you are and what you do well.
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.summary}
            onChange={(e) => set({ summary: e.target.value })}
            placeholder="e.g. Results-driven software engineer with 4 years of experience building scalable web applications using React and Python. Passionate about clean code, agile delivery, and solving real-world problems in the South African fintech space."
            rows={4}
            className="text-sm border-gray-200 resize-none"
          />
          {zaraShowFor("summary") && (
            <ZaraSuggestionCard
              suggestion={zara.suggestion}
              onApply={zara.apply}
              onDismiss={zaraDismiss}
            />
          )}
        </CardContent>
      </Card>

      {/* ── Skills ───────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-gray-400" />
              <CardTitle className="text-sm font-medium text-gray-700">Skills</CardTitle>
            </div>
            <ZaraTrigger
              label="Suggest skills"
              loading={zaraField === "skills" && zara.state === "loading"}
              error={zaraField === "skills" && zara.state === "error"}
              onClick={() => zaraAsk(
                "skills",
                `Suggest 6-8 skills to ADD to my CV for South African job applications. Current skills: ${form.skills.join(", ") || "none"}. My experience: ${form.experience.slice(0, 3).join(" | ") || "not provided"}. Output ONLY a comma-separated list of NEW skills to add, nothing else.`,
                (v) => {
                  const newSkills = v.split(/[,\n]/).map(s => s.replace(/^[-•*\d.)\s]+/, "").trim()).filter(Boolean);
                  const toAdd = newSkills.filter(s => !form.skills.includes(s));
                  if (toAdd.length) set({ skills: [...form.skills, ...toAdd] });
                }
              )}
            />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
Add one skill at a time.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {form.skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-brand-50 text-brand-600 border-0 text-xs pr-1.5 flex items-center gap-1"
              >
                {skill}
                <button onClick={() => removeFromList("skills", skill)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {form.skills.length === 0 && (
              <p className="text-xs text-gray-400">No skills added yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && addToList("skills", skillInput, () => setSkillInput(""))
              }
              placeholder="e.g. React, Python, SQL..."
              className="text-sm border-gray-200 h-8"
            />
            <Button
              size="sm"
              variant="outline"
              className="h-8 shrink-0"
              onClick={() => addToList("skills", skillInput, () => setSkillInput(""))}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          {zaraShowFor("skills") && (
            <ZaraSuggestionCard
              suggestion={zara.suggestion}
              applyLabel="Add These Skills"
              onApply={zara.apply}
              onDismiss={zaraDismiss}
            />
          )}
        </CardContent>
      </Card>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <CardTitle className="text-sm font-medium text-gray-700">Experience</CardTitle>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
One line per thing you've done. Zara rewrites these to match each job.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            {form.experience.map((line, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                  <p className="text-sm text-gray-700 flex-1">{line}</p>
                  <ZaraTrigger
                    label="Improve"
                    loading={zaraField === `exp-${i}` && zara.state === "loading"}
                    error={zaraField === `exp-${i}` && zara.state === "error"}
                    onClick={() => {
                      zaraBulletRef.current = i;
                      zaraAsk(
                        `exp-${i}`,
                        `Rewrite this experience bullet to be more impactful with action verbs and quantifiable results where possible. Output ONLY the improved bullet text, no quotes, no labels: ${line}`,
                        (v) => {
                          const idx = zaraBulletRef.current;
                          if (idx !== null) set({ experience: form.experience.map((e, j) => j === idx ? v : e) });
                        }
                      );
                    }}
                  />
                  <button
                    onClick={() => removeFromList("experience", line)}
                    className="text-gray-300 hover:text-red-400 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {zaraShowFor(`exp-${i}`) && (
                  <ZaraSuggestionCard
                    suggestion={zara.suggestion}
                    applyLabel="Replace Bullet"
                    onApply={zara.apply}
                    onDismiss={zaraDismiss}
                  />
                )}
              </div>
            ))}
            {form.experience.length === 0 && (
              <p className="text-xs text-gray-400">No experience entries yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={expInput}
              onChange={(e) => setExpInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && addToList("experience", expInput, () => setExpInput(""))
              }
              placeholder="e.g. Built REST APIs with FastAPI serving 10k daily users"
              className="text-sm border-gray-200 h-8"
            />
            <Button
              size="sm"
              variant="outline"
              className="h-8 shrink-0"
              onClick={() => addToList("experience", expInput, () => setExpInput(""))}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Education ────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <CardTitle className="text-sm font-medium text-gray-700">Education</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.education}
            onChange={(e) => set({ education: e.target.value })}
            placeholder="e.g. BSc Computer Science — University of South Africa (UNISA), 2024"
            rows={2}
            className="text-sm border-gray-200 resize-none"
          />
        </CardContent>
      </Card>

      {/* ── Job Preferences ──────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-medium text-gray-700">What you're looking for</CardTitle>
          <p className="text-xs text-gray-400 mt-0.5">
            Helps us show you the right vacancies
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Keywords */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-500">Job titles or keywords</Label>
              <ZaraTrigger
                label="Suggest keywords"
                loading={zaraField === "keywords" && zara.state === "loading"}
                error={zaraField === "keywords" && zara.state === "error"}
                onClick={() => zaraAsk(
                  "keywords",
                  `Suggest 6 job search keywords for South African job boards (Adzuna, PNet, Indeed) based on this profile. Skills: ${form.skills.join(", ") || "not set"}. Summary: ${form.summary.slice(0, 100) || "not set"}. Output ONLY a comma-separated list, nothing else.`,
                  (v) => {
                    const newKws = v.split(/[,\n]/).map(s => s.replace(/^[-•*\d.)\s]+/, "").trim()).filter(Boolean);
                    const toAdd = newKws.filter(k => !form.keywords.includes(k));
                    if (toAdd.length) set({ keywords: [...form.keywords, ...toAdd] });
                  }
                )}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.keywords.map((kw) => (
                <Badge
                  key={kw}
                  className="bg-brand-50 text-brand-600 border-0 text-xs pr-1.5 flex items-center gap-1"
                >
                  {kw}
                  <button onClick={() => removeFromList("keywords", kw)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {form.keywords.length === 0 && (
                <p className="text-xs text-gray-400">No keywords added</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={kwInput}
                onChange={(e) => setKwInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && addToList("keywords", kwInput, () => setKwInput(""))
                }
                placeholder="e.g. React, Software Engineer..."
                className="text-sm border-gray-200 h-8"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-8 shrink-0"
                onClick={() => addToList("keywords", kwInput, () => setKwInput(""))}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
            {zaraShowFor("keywords") && (
              <ZaraSuggestionCard
                suggestion={zara.suggestion}
                applyLabel="Add These Keywords"
                onApply={zara.apply}
                onDismiss={zaraDismiss}
              />
            )}
          </div>

          {/* Locations */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Where you want to work</Label>
            <div className="flex flex-wrap gap-1.5">
              {form.locations.map((loc) => (
                <Badge
                  key={loc}
                  className="bg-gray-100 text-gray-600 border-0 text-xs pr-1.5 flex items-center gap-1"
                >
                  {loc}
                  <button onClick={() => removeFromList("locations", loc)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {form.locations.length === 0 && (
                <p className="text-xs text-gray-400">No locations added</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={locInput}
                onChange={(e) => setLocInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && addToList("locations", locInput, () => setLocInput(""))
                }
                placeholder="e.g. Johannesburg, Remote..."
                className="text-sm border-gray-200 h-8"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-8 shrink-0"
                onClick={() => addToList("locations", locInput, () => setLocInput(""))}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Job types */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Type of work</Label>
            <div className="flex flex-wrap gap-5">
              {([
                { key: "fullTime", label: "Full-time" },
                { key: "remote", label: "Remote" },
                { key: "contract", label: "Contract" },
              ] as const).map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={form.jobTypes[key]}
                    onCheckedChange={(v) =>
                      set({ jobTypes: { ...form.jobTypes, [key]: !!v } })
                    }
                  />
                  <Label htmlFor={key} className="text-sm text-gray-600 cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Documents ────────────────────────────────────────────────── */}
      <DocumentsSection />

      {/* ── Gmail ────────────────────────────────────────────────────── */}
      <GmailSection />

      {/* ── Sticky save bar ──────────────────────────────────────────── */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-white/90 backdrop-blur border-t border-gray-100 flex justify-end">
        <Button
          className="bg-brand-600 hover:bg-brand-700 text-white w-full sm:w-auto"
          disabled={saveProfile.isPending}
          onClick={handleSave}
        >
          {saveProfile.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
          ) : (
            <><Save className="w-4 h-4 mr-2" />Save my profile</>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Documents upload section ──────────────────────────────────────────────────

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentsSection() {
  const cvRef = useRef<HTMLInputElement>(null);
  const docsRef = useRef<HTMLInputElement>(null);
  const { data: docs = [] } = useProfileDocuments();
  const uploadDoc = useUploadProfileDocument();
  const deleteDoc = useDeleteProfileDocument();
  const [error, setError] = useState<string | null>(null);
  const [reprocessing, setReprocessing] = useState(false);

  const uploading = uploadDoc.isPending ? uploadDoc.variables?.docType ?? null : null;

  const reprocess = async () => {
    setReprocessing(true);
    try {
      const res = await documentsApi.reprocess();
      toast.success(`Refreshed text for ${res.reprocessed} of ${res.total} document(s).`);
    } catch {
      toast.error("Failed to refresh document text.");
    } finally {
      setReprocessing(false);
    }
  };

  const upload = async (file: File, docType: "cv" | "supporting") => {
    setError(null);
    try {
      await uploadDoc.mutateAsync({ file, docType });
      toast.success(`${docType === "cv" ? "CV" : "Document"} uploaded.`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  };

  const remove = async (docId: string) => {
    try {
      await deleteDoc.mutateAsync(docId);
    } catch {
      toast.error("Failed to remove document.");
    }
  };

  const cv = docs.find((d) => d.doc_type === "cv");
  const supporting = docs.filter((d) => d.doc_type === "supporting");

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700">Your documents</CardTitle>
          {docs.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              disabled={reprocessing}
              onClick={reprocess}
            >
              {reprocessing ? (
                <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Refreshing…</>
              ) : (
                <><RefreshCw className="w-3 h-3 mr-1.5" />Re-read my documents</>
              )}
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          Upload your base CV and any supporting documents
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Base CV */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-500">Your CV</Label>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              disabled={uploading === "cv"}
              onClick={() => cvRef.current?.click()}
            >
              {uploading === "cv" ? (
                <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Uploading…</>
              ) : (
                <><Upload className="w-3 h-3 mr-1.5" />{cv ? "Replace" : "Upload CV"}</>
              )}
            </Button>
            <input
              ref={cvRef}
              type="file"
              accept=".pdf,.docx,.doc"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "cv")}
            />
          </div>
          {cv ? (
            <div className="flex items-center gap-3 px-3 py-2 bg-brand-50 rounded-lg">
              <FileText className="w-4 h-4 text-brand-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{cv.original_filename}</p>
                <p className="text-[10px] text-gray-400">
                  {formatSize(cv.size)} · {new Date(cv.created_at).toLocaleDateString("en-ZA")}
                </p>
              </div>
              <button onClick={() => remove(cv.id)} className="text-gray-300 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              className="border border-dashed border-gray-200 rounded-lg px-4 py-5 text-center cursor-pointer hover:border-brand-400 transition-colors"
              onClick={() => cvRef.current?.click()}
            >
              <p className="text-xs text-gray-400">PDF or Word document · up to 10 MB</p>
            </div>
          )}
        </div>

        {/* Supporting docs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-500">Other documents</Label>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              disabled={uploading === "supporting"}
              onClick={() => docsRef.current?.click()}
            >
              {uploading === "supporting" ? (
                <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Uploading…</>
              ) : (
                <><Plus className="w-3 h-3 mr-1.5" />Add Document</>
              )}
            </Button>
            <input
              ref={docsRef}
              type="file"
              accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "supporting")}
            />
          </div>
          <p className="text-[10px] text-gray-400">
            ID, certificates, matric results or references
          </p>
          {supporting.length > 0 ? (
            <div className="space-y-1.5">
              {supporting.map((d) => (
                <div key={d.id} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{d.original_filename}</p>
                    <p className="text-[10px] text-gray-400">
                      {formatSize(d.size)} · {new Date(d.created_at).toLocaleDateString("en-ZA")}
                    </p>
                  </div>
                  <button onClick={() => remove(d.id)} className="text-gray-300 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="border border-dashed border-gray-200 rounded-lg px-4 py-5 text-center cursor-pointer hover:border-brand-400 transition-colors"
              onClick={() => docsRef.current?.click()}
            >
              <p className="text-xs text-gray-400">Click to add</p>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
      </CardContent>
    </Card>
  );
}


// ── Gmail connection section ──────────────────────────────────────────────────

function GmailSection() {
  const [status, setStatus] = useState<GmailStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    setLoading(true);
    gmailApi
      .status()
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const connect = async () => {
    setBusy(true);
    try {
      const { url } = await gmailApi.authUrl(GMAIL_REDIRECT_URI);
      window.location.href = url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open Gmail sign-in. Please try again.");
      setBusy(false);
    }
  };

  const disconnect = async () => {
    setBusy(true);
    try {
      await gmailApi.disconnect();
      toast.success("Gmail unlinked.");
      refresh();
    } catch {
      toast.error("Could not unlink Gmail. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading || !status?.configured) return null;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Mail className="w-4 h-4 text-brand-600" />
          Email your applications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          Link your Gmail and Zara will write the application email, attach your tailored CV, and
          leave it in your drafts. Nothing goes out until you press send.
        </p>

        {status.connected ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-emerald-100 bg-emerald-50 p-3">
            <span className="flex items-center gap-2 text-sm text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              Linked{status.email ? ` — ${status.email}` : ""}
            </span>
            <Button size="sm" variant="outline" disabled={busy} onClick={disconnect}>
              Unlink
            </Button>
          </div>
        ) : (
          <Button
            className="bg-brand-600 hover:bg-brand-700 text-white"
            disabled={busy}
            onClick={connect}
          >
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
            Link my Gmail
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
