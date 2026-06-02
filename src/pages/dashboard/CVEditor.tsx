import { useState } from "react";
import { Download, Wand2, ChevronDown, ChevronUp, Loader2, AlertCircle, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/useProfile";
import { cvApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface TailoredCV {
  summary: string;
  skills: string[];
  experience: string[];
  education?: string;
  docx_path?: string;
}

export default function CVEditor() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const [jobTitle, setJobTitle] = useState("");
  const [jobCompany, setJobCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jdOpen, setJdOpen] = useState(true);

  const [tailored, setTailored] = useState<TailoredCV | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 1: true });

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

  const handleTailor = async () => {
    if (!profile || !jobDescription.trim()) return;
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
          title: jobTitle || "Position",
          company: jobCompany || undefined,
          description: jobDescription,
        },
      });
      setTailored(result as TailoredCV);
      setJdOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Tailoring failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const profileEmpty = !profile?.summary && (!profile?.skills || profile.skills.length === 0);

  const downloadDocx = () => {
    if (!tailored?.docx_path) return;
    const filename = tailored.docx_path.split(/[\\/]/).pop();
    if (filename) window.open(cvApi.downloadUrl(filename), "_blank");
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">CV Editor</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {tailored
              ? `Tailored for: ${jobTitle || "Position"}${jobCompany ? ` — ${jobCompany}` : ""}`
              : "Paste a job description to generate a tailored CV"}
          </p>
        </div>
        {tailored && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadDocx} disabled={!tailored.docx_path}>
              <Download className="w-4 h-4 mr-2" />Download .docx
            </Button>
          </div>
        )}
      </div>

      {profileEmpty && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm text-amber-700">
            Your profile is empty. Add your summary, skills, and experience first so the AI has something to work with.
          </div>
          <Button size="sm" variant="outline" className="shrink-0 text-xs" onClick={() => navigate("/settings")}>
            <Settings className="w-3.5 h-3.5 mr-1.5" />Setup Profile
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
        </div>
      )}

      {/* Job description input */}
      <Card className="border-0 shadow-sm">
        <CardHeader
          className="pb-2 pt-4 px-5 cursor-pointer select-none"
          onClick={() => setJdOpen((v) => !v)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-700">Job Description</CardTitle>
            {jdOpen
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </CardHeader>
        {jdOpen && (
          <CardContent className="px-5 pb-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Job title (e.g. Senior Developer)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="text-sm border-gray-200"
              />
              <Input
                placeholder="Company (optional)"
                value={jobCompany}
                onChange={(e) => setJobCompany(e.target.value)}
                className="text-sm border-gray-200"
              />
            </div>
            <Textarea
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              className="text-sm border-gray-200 resize-none"
            />
            <Button
              className="bg-[#F7941D] hover:bg-[#E08518] text-white"
              size="sm"
              onClick={handleTailor}
              disabled={loading || !jobDescription.trim() || profileEmpty}
            >
              {loading
                ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Tailoring...</>
                : <><Wand2 className="w-3.5 h-3.5 mr-1.5" />Tailor with AI</>}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Side-by-side CV comparison */}
      {(tailored || profile?.summary) && (
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
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-gray-700">Tailored CV</h2>
                <Badge className="bg-brand-50 text-brand-600 border-0 text-xs">ATS Optimised</Badge>
              </div>

              <Card className="border-0 shadow-sm ring-1 ring-brand-100">
                <CardHeader className="pb-1 pt-4 px-5">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Summary</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <Textarea
                    value={tailored.summary}
                    onChange={(e) => setTailored((prev) => prev ? { ...prev, summary: e.target.value } : prev)}
                    className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent"
                    rows={4}
                  />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm ring-1 ring-brand-100">
                <CardHeader className="pb-1 pt-4 px-5">
                  <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Skills</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <Textarea
                    value={tailored.skills.join(", ")}
                    onChange={(e) =>
                      setTailored((prev) =>
                        prev ? { ...prev, skills: e.target.value.split(",").map((s) => s.trim()) } : prev
                      )
                    }
                    className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent"
                    rows={2}
                  />
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
                      <div key={i} className="flex gap-2">
                        <span className="text-gray-300 mt-2 text-xs">•</span>
                        <Textarea
                          value={line}
                          onChange={(e) => updateBullet(i, e.target.value)}
                          className="text-sm text-gray-700 border-0 p-0 focus-visible:ring-0 resize-none bg-transparent flex-1"
                          rows={2}
                        />
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
                      onChange={(e) => setTailored((prev) => prev ? { ...prev, education: e.target.value } : prev)}
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
              <p className="text-sm text-gray-400">Paste a job description and click Tailor with AI</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
