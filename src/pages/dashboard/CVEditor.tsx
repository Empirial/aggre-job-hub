import { useState, useRef } from "react";
import {
  Download, Wand2, ChevronDown, ChevronUp, Loader2,
  AlertCircle, Settings, Briefcase, Search, CheckCircle2, FileText, Copy, Check,
  Save, UserCheck, TrendingUp,
} from "lucide-react";
import { useZaraSuggest, ZaraTrigger, ZaraSuggestionCard } from "@/components/ZaraSuggest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useProfile, useSaveProfile } from "@/hooks/useProfile";
import { useSaveCVDraft } from "@/hooks/useCVDrafts";
import { useJobs } from "@/hooks/useJobs";
import { cvApi, triggerBlobDownload, type Job } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TailoredCV {
  summary: string;
  skills: string[];
  experience: string[];
  education?: string;
  docx_path?: string;
}

/** Pull bullet-point style duties out of a raw job description */
function extractDuties(description: string): string[] {
  if (!description?.trim()) return [];

  const lines = description
    .split(/\n/)
    .map((l) => l.replace(/^[\s\-\u2022\*\u00b7]+/, "").trim())
    .filter((l) => l.length > 20 && l.length < 200);

  // Prefer lines that start with action verbs or look like duties
  const dutyPattern =
    /^(Manage|Develop|Design|Implement|Lead|Coordinate|Ensure|Maintain|Support|Assist|Conduct|Prepare|Provide|Analyse|Analyze|Build|Create|Drive|Monitor|Report|Review|Handle|Deliver|Collaborate|Work|Perform|Execute|Plan|Oversee|Responsible)/i;

  const duty = lines.filter((l) => dutyPattern.test(l));
  const fallback = lines.filter((l) => !dutyPattern.test(l));

  return [...duty, ...fallback].slice(0, 8);
}

const STOPWORDS = new Set([
  "and","or","the","a","an","in","on","at","to","for","of","with","is","are","will",
  "you","your","we","our","this","that","be","as","by","from","have","has","can","may",
  "must","should","all","any","other","their","they","it","its","not","but","also",
  "both","been","were","was","do","does","did","who","what","how","which","when",
  "where","would","could","should","about","into","than","then","there","these",
  "those","very","more","some","such","over","under","per","via","etc","i","me","my",
]);

function computeAtsMatch(jobDesc: string, tailored: TailoredCV) {
  const extract = (text: string) =>
    (text.toLowerCase().match(/\b[a-z][a-z+#.\-]{3,}\b/g) ?? []).filter(
      (w) => !STOPWORDS.has(w)
    );

  const jobWords = new Set(extract(jobDesc));
  const cvText = [
    tailored.summary,
    tailored.skills.join(" "),
    tailored.experience.join(" "),
  ].join(" ");
  const cvWords = new Set(extract(cvText));

  const matched = [...jobWords].filter((w) => cvWords.has(w));
  const missing = [...jobWords]
    .filter((w) => !cvWords.has(w))
    .sort((a, b) => b.length - a.length)
    .slice(0, 12);
  const score = jobWords.size > 0 ? Math.round((matched.length / jobWords.size) * 100) : 0;
  return { score, matchedCount: matched.length, total: jobWords.size, missing };
}

export default function CVEditor() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();

  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [pickerOpen, setPickerOpen] = useState(true);

  const [tailored, setTailored] = useState<TailoredCV | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });

  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [coverLetterOpen, setCoverLetterOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const saveProfile = useSaveProfile();
  const saveDraft = useSaveCVDraft();
  const [savedDraft, setSavedDraft] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);

  const zara = useZaraSuggest();
  const [zaraField, setZaraField] = useState<string | null>(null);
  const zaraBulletRef = useRef<number | null>(null);

  const zaraAsk = (field: string, prompt: string, onApply: (v: string) => void) => {
    setZaraField(field);
    zara.ask(prompt, onApply);
  };
  const zaraShowFor = (field: string) => zaraField === field && zara.state === "done";
  const zaraDismiss = () => { zara.dismiss(); setZaraField(null); };

  const toggleExp = (i: number) =>
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  const updateBullet = (idx: number, value: string) => {
    if (!tailored) return;
    setTailored((prev) => {
      if (!prev) return prev;
      const exp = [...prev.experience];
      exp[idx] = value;
      return { ...prev, experience: exp };
    });
  };

  const handleSaveDraft = async () => {
    if (!tailored || !selectedJob) return;
    await saveDraft.mutateAsync({
      draft_id: `${selectedJob.id}-${Date.now()}`,
      job_id: selectedJob.id,
      job_title: selectedJob.title,
      summary: tailored.summary,
      skills: tailored.skills,
      experience: tailored.experience,
      education: tailored.education,
    });
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2500);
  };

  const handleSaveToProfile = async () => {
    if (!tailored || !profile) return;
    await saveProfile.mutateAsync({
      ...profile,
      summary: tailored.summary,
      skills: tailored.skills,
      experience: tailored.experience,
    });
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2500);
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setPickerOpen(false);
    setTailored(null);
    setError(null);
    setCoverLetter(null);
  };

  const handleGenerateCoverLetter = async () => {
    if (!profile || !selectedJob) return;
    setCoverLetterLoading(true);
    try {
      const result = await cvApi.coverLetter({
        profile: {
          name: profile.name || "Job Seeker",
          email: profile.email || "",
          phone: profile.phone || "",
          linkedin: profile.linkedin || "",
          summary: profile.summary || "",
          skills: profile.skills || [],
          experience: profile.experience || [],
          education: profile.education || "",
        },
        job: {
          title: selectedJob.title,
          company: selectedJob.company,
          description: selectedJob.description,
        },
      });
      setCoverLetter(result.cover_letter);
      setCoverLetterOpen(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Cover letter generation failed. Check backend connection.");
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTailor = async () => {
    if (!profile || !selectedJob) return;
    setError(null);
    setLoading(true);
    try {
      const result = await cvApi.tailor({
        profile: {
          name: profile.name || "Job Seeker",
          email: profile.email || "",
          phone: profile.phone || "",
          linkedin: profile.linkedin || "",
          summary: profile.summary || "",
          skills: profile.skills || [],
          experience: profile.experience || [],
          education: profile.education || "",
        },
        job: {
          title: selectedJob.title,
          company: selectedJob.company,
          description: selectedJob.description,
        },
      });
      setTailored(result as TailoredCV);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Tailoring failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const profileEmpty =
    !profile?.summary && (!profile?.skills || profile.skills.length === 0);

  const downloadDocx = async () => {
    if (!tailored?.docx_path) return;
    const filename = tailored.docx_path.split(/[\\/]/).pop();
    if (!filename) return;
    try {
      const blob = await cvApi.download(filename);
      triggerBlobDownload(blob, filename);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to download CV.");
    }
  };

  const duties = selectedJob ? extractDuties(selectedJob.description) : [];

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">CV Editor</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {selectedJob
              ? `${selectedJob.title} — ${selectedJob.company}`
              : "Select a scraped job to tailor your CV"}
          </p>
        </div>
        {tailored && (
          <Button
            variant="outline"
            size="sm"
            onClick={downloadDocx}
            disabled={!tailored.docx_path}
          >
            <Download className="w-4 h-4 mr-2" />
            Download .docx
          </Button>
        )}
      </div>

      {/* Profile warning */}
      {profileEmpty && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm text-amber-700">
            Your profile is empty. Add your summary, skills, and experience first.
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 text-xs"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            Setup Profile
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Job picker */}
      <Card className="border-0 shadow-sm">
        <CardHeader
          className="pb-2 pt-4 px-5 cursor-pointer select-none"
          onClick={() => setPickerOpen((v) => !v)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <CardTitle className="text-sm font-medium text-gray-700">
                {selectedJob ? "Selected Job" : "Pick a Job"}
              </CardTitle>
              {selectedJob && (
                <Badge className="bg-green-50 text-green-600 border-0 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {selectedJob.title}
                </Badge>
              )}
            </div>
            {pickerOpen
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </CardHeader>

        {pickerOpen && (
          <CardContent className="px-5 pb-5 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search jobs or companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-sm border-gray-200"
              />
            </div>

            {jobsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-6 text-sm text-gray-400">
                No jobs found. Run the scraper from the Jobs Board first.
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                {filteredJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => handleSelectJob(job)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                      selectedJob?.id === job.id
                        ? "bg-brand-50 text-brand-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{job.title}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {job.company} · {job.location}
                      </p>
                    </div>
                    <Badge className="ml-2 shrink-0 bg-gray-100 text-gray-500 border-0 text-xs capitalize">
                      {job.source}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Duties card */}
      {selectedJob && duties.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium text-gray-700">Key Duties</CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">
              What you'll be doing in this role
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ul className="space-y-2">
              {duties.map((duty, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                  {duty}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      {selectedJob && (
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            className="bg-brand-600 hover:bg-brand-700 text-white"
            size="sm"
            onClick={handleTailor}
            disabled={loading || profileEmpty}
          >
            {loading
              ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Tailoring...</>
              : <><Wand2 className="w-3.5 h-3.5 mr-1.5" />Tailor CV for this Job</>}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateCoverLetter}
            disabled={coverLetterLoading || profileEmpty}
          >
            {coverLetterLoading
              ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Generating...</>
              : <><FileText className="w-3.5 h-3.5 mr-1.5" />Generate Cover Letter</>}
          </Button>
        </div>
      )}

      {/* ATS Match Score */}
      {tailored && selectedJob && (() => {
        const ats = computeAtsMatch(selectedJob.description, tailored);
        const color = ats.score >= 70 ? "green" : ats.score >= 45 ? "amber" : "red";
        const colorMap = {
          green: { bar: "bg-green-500", badge: "bg-green-50 text-green-700", ring: "ring-green-100" },
          amber: { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-700", ring: "ring-amber-100" },
          red:   { bar: "bg-red-400",   badge: "bg-red-50 text-red-600",     ring: "ring-red-100" },
        }[color];
        return (
          <Card className={`border-0 shadow-sm ring-1 ${colorMap.ring}`}>
            <CardContent className="px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">ATS Match Score</span>
                  <Badge className={`${colorMap.badge} border-0 text-xs font-semibold`}>
                    {ats.score}%
                  </Badge>
                </div>
                <span className="text-xs text-gray-400">{ats.matchedCount} / {ats.total} keywords</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${colorMap.bar}`}
                  style={{ width: `${ats.score}%` }}
                />
              </div>
              {ats.missing.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Missing keywords — consider adding these to your CV:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ats.missing.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-500 font-mono"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}

      {/* Cover letter result */}
      {coverLetter !== null && (
        <Card className="border-0 shadow-sm ring-1 ring-brand-100">
          <CardHeader
            className="pb-2 pt-4 px-5 cursor-pointer select-none"
            onClick={() => setCoverLetterOpen((v) => !v)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-500" />
                <CardTitle className="text-sm font-medium text-gray-700">Cover Letter</CardTitle>
                <Badge className="bg-brand-50 text-brand-600 border-0 text-xs">AI Generated</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
                  onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                >
                  {copied
                    ? <><Check className="w-3.5 h-3.5 mr-1" />Copied</>
                    : <><Copy className="w-3.5 h-3.5 mr-1" />Copy</>}
                </Button>
                {coverLetterOpen
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
          </CardHeader>

          {coverLetterOpen && (
            <CardContent className="px-5 pb-5 space-y-2">
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="text-sm text-gray-700 leading-relaxed border-gray-200 resize-none focus-visible:ring-1 focus-visible:ring-brand-300"
                rows={10}
              />
              <div className="flex justify-end">
                <ZaraTrigger
                  label="Improve with Zara"
                  loading={zaraField === "cover-letter" && zara.state === "loading"}
                  error={zaraField === "cover-letter" && zara.state === "error"}
                  onClick={() => zaraAsk(
                    "cover-letter",
                    `Improve this cover letter for "${selectedJob?.title}" at ${selectedJob?.company}. Make it more professional and compelling. Output ONLY the full improved cover letter, nothing else: ${(coverLetter ?? "").slice(0, 10000)}`,
                    (v) => setCoverLetter(v)
                  )}
                />
              </div>
              {zaraShowFor("cover-letter") && (
                <ZaraSuggestionCard
                  suggestion={zara.suggestion}
                  applyLabel="Replace Cover Letter"
                  onApply={zara.apply}
                  onDismiss={zaraDismiss}
                  maxLength={10000}
                />
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Side-by-side CV comparison */}
      {(tailored || profile?.summary) && selectedJob && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Base CV */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium text-gray-700">Your Profile</h2>
              <Badge className="bg-gray-100 text-gray-500 border-0 text-xs">Original</Badge>
            </div>

            {profile?.summary && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-1 pt-4 px-5">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Summary</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{profile.summary}</p>
                </CardContent>
              </Card>
            )}

            {profile?.skills && profile.skills.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-1 pt-4 px-5">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Skills</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <p className="text-sm text-gray-600">{profile.skills.join(", ")}</p>
                </CardContent>
              </Card>
            )}

            {profile?.experience && profile.experience.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-1 pt-4 px-5">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-1">
                  {profile.experience.map((line, i) => (
                    <p key={i} className="text-sm text-gray-600 leading-relaxed">{line}</p>
                  ))}
                </CardContent>
              </Card>
            )}

            {profile?.education && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-1 pt-4 px-5">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Education</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <p className="text-sm text-gray-600">{profile.education}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tailored CV */}
          {tailored ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-medium text-gray-700">Tailored CV</h2>
                  <Badge className="bg-brand-50 text-brand-600 border-0 text-xs">ATS Optimised</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1.5"
                    disabled={saveDraft.isPending || savedDraft}
                    onClick={handleSaveDraft}
                  >
                    {savedDraft
                      ? <><Check className="w-3 h-3" />Saved</>
                      : saveDraft.isPending
                      ? <><Loader2 className="w-3 h-3 animate-spin" />Saving...</>
                      : <><Save className="w-3 h-3" />Save Draft</>}
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs gap-1.5 bg-brand-600 hover:bg-brand-700 text-white"
                    disabled={saveProfile.isPending || savedProfile}
                    onClick={handleSaveToProfile}
                  >
                    {savedProfile
                      ? <><Check className="w-3 h-3" />Updated</>
                      : saveProfile.isPending
                      ? <><Loader2 className="w-3 h-3 animate-spin" />Saving...</>
                      : <><UserCheck className="w-3 h-3" />Save to Profile</>}
                  </Button>
                </div>
              </div>

              <Card className="border-0 shadow-sm ring-1 ring-brand-100">
                <CardHeader className="pb-1 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Summary</CardTitle>
                    <ZaraTrigger
                      label="Improve"
                      loading={zaraField === "cv-summary" && zara.state === "loading"}
                      error={zaraField === "cv-summary" && zara.state === "error"}
                      onClick={() => zaraAsk(
                        "cv-summary",
                        `Improve this CV summary for the role "${selectedJob?.title}" at ${selectedJob?.company}. Make it more ATS-friendly and impactful. Output ONLY the improved summary text, no labels, no quotes: ${tailored.summary}`,
                        (v) => setTailored((prev) => prev ? { ...prev, summary: v } : prev)
                      )}
                    />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <Textarea
                    value={tailored.summary}
                    onChange={(e) =>
                      setTailored((prev) => prev ? { ...prev, summary: e.target.value } : prev)
                    }
                    className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent"
                    rows={4}
                  />
                  {zaraShowFor("cv-summary") && (
                    <ZaraSuggestionCard
                      suggestion={zara.suggestion}
                      onApply={zara.apply}
                      onDismiss={zaraDismiss}
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm ring-1 ring-brand-100">
                <CardHeader className="pb-1 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Skills</CardTitle>
                    <ZaraTrigger
                      label="Add more"
                      loading={zaraField === "cv-skills" && zara.state === "loading"}
                      error={zaraField === "cv-skills" && zara.state === "error"}
                      onClick={() => zaraAsk(
                        "cv-skills",
                        `Suggest 4-5 additional skills for the role "${selectedJob?.title}" at ${selectedJob?.company}. Current skills: ${tailored.skills.join(", ")}. Job description excerpt: ${selectedJob?.description.slice(0, 200)}. Output ONLY a comma-separated list of NEW skills to add, nothing else.`,
                        (v) => {
                          const extras = v.split(/[,\n]/).map(s => s.replace(/^[-•*\d.)\s]+/, "").trim()).filter(Boolean);
                          const toAdd = extras.filter(s => !tailored.skills.includes(s));
                          if (toAdd.length) setTailored((prev) => prev ? { ...prev, skills: [...prev.skills, ...toAdd] } : prev);
                        }
                      )}
                    />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <Textarea
                    value={tailored.skills.join(", ")}
                    onChange={(e) =>
                      setTailored((prev) =>
                        prev
                          ? { ...prev, skills: e.target.value.split(",").map((s) => s.trim()) }
                          : prev
                      )
                    }
                    className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent"
                    rows={2}
                  />
                  {zaraShowFor("cv-skills") && (
                    <ZaraSuggestionCard
                      suggestion={zara.suggestion}
                      applyLabel="Add These Skills"
                      onApply={zara.apply}
                      onDismiss={zaraDismiss}
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm ring-1 ring-brand-100">
                <CardHeader
                  className="pb-1 pt-4 px-5 cursor-pointer"
                  onClick={() => toggleExp(0)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience</CardTitle>
                    {expanded[0]
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </CardHeader>
                {expanded[0] && (
                  <CardContent className="px-5 pb-4 space-y-2">
                    {tailored.experience.map((line, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex gap-2 items-start">
                          <span className="text-gray-300 mt-2 text-xs">•</span>
                          <Textarea
                            value={line}
                            onChange={(e) => updateBullet(i, e.target.value)}
                            className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent flex-1"
                            rows={2}
                          />
                          <ZaraTrigger
                            label="Improve"
                            loading={zaraField === `cv-exp-${i}` && zara.state === "loading"}
                            error={zaraField === `cv-exp-${i}` && zara.state === "error"}
                            onClick={() => {
                              zaraBulletRef.current = i;
                              zaraAsk(
                                `cv-exp-${i}`,
                                `Improve this experience bullet for the role "${selectedJob?.title}". Make it more impactful and ATS-relevant. Output ONLY the improved bullet, no quotes, no labels: ${line}`,
                                (v) => {
                                  const idx = zaraBulletRef.current;
                                  if (idx !== null) updateBullet(idx, v);
                                }
                              );
                            }}
                          />
                        </div>
                        {zaraShowFor(`cv-exp-${i}`) && (
                          <ZaraSuggestionCard
                            suggestion={zara.suggestion}
                            applyLabel="Replace Bullet"
                            onApply={zara.apply}
                            onDismiss={zaraDismiss}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>

              {tailored.education && (
                <Card className="border-0 shadow-sm ring-1 ring-brand-100">
                  <CardHeader className="pb-1 pt-4 px-5">
                    <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <Textarea
                      value={tailored.education}
                      onChange={(e) =>
                        setTailored((prev) => prev ? { ...prev, education: e.target.value } : prev)
                      }
                      className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent"
                      rows={1}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 h-48 rounded-xl border border-dashed border-gray-200">
              <Wand2 className="w-6 h-6 text-gray-300" />
              <p className="text-sm text-gray-400">Click "Tailor CV for this Job" to generate</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
