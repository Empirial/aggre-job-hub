import { useState, useEffect, useRef } from "react";
import { Save, Eye, EyeOff, Plus, X, Upload, FileText, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useProfile, useSaveProfile } from "@/hooks/useProfile";

export default function Settings() {
  const { data: savedProfile } = useProfile();
  const saveProfile = useSaveProfile();
  const [showKey, setShowKey] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
  });

  useEffect(() => {
    if (savedProfile) {
      setProfile({
        name: savedProfile.name,
        email: savedProfile.email,
        phone: savedProfile.phone,
        linkedin: savedProfile.linkedin,
      });
    }
  }, [savedProfile]);
  const [keywords, setKeywords] = useState(["React", "Python", "Full Stack", "Software Engineer"]);
  const [locations, setLocations] = useState(["Johannesburg", "Remote", "Pretoria"]);
  const [jobTypes, setJobTypes] = useState({ fullTime: true, remote: true, contract: false });
  const [api, setApi] = useState({
    deepseekKey: "sk-••••••••••••••••••••••••••••••••",
    schedule: "0 6 * * *",
    senderEmail: "lufuno@mphelaindustries.co.za",
  });
  const [kwInput, setKwInput] = useState("");
  const [locInput, setLocInput] = useState("");

  const addTag = (
    list: string[],
    setList: (v: string[]) => void,
    input: string,
    setInput: (v: string) => void
  ) => {
    const val = input.trim();
    if (val && !list.includes(val)) setList([...list, val]);
    setInput("");
  };

  const removeTag = (list: string[], setList: (v: string[]) => void, tag: string) =>
    setList(list.filter((t) => t !== tag));

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your profile, preferences, and API configuration</p>
      </div>

      {/* Profile */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Full Name</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="text-sm border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Email</Label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="text-sm border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Phone</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="text-sm border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">LinkedIn URL</Label>
              <Input
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="text-sm border-gray-200"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              disabled={saveProfile.isPending}
              onClick={() =>
                saveProfile.mutate({
                  ...savedProfile!,
                  ...profile,
                })
              }
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {saveProfile.isPending ? "Saving..." : saveProfile.isSuccess ? "Saved" : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Preferences */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Job Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Keywords</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {keywords.map((kw) => (
                <Badge key={kw} className="bg-brand-50 text-brand-600 border-0 text-xs pr-1.5 flex items-center gap-1">
                  {kw}
                  <button onClick={() => removeTag(keywords, setKeywords, kw)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={kwInput}
                onChange={(e) => setKwInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag(keywords, setKeywords, kwInput, setKwInput)}
                placeholder="Add keyword..."
                className="text-sm border-gray-200 h-8"
              />
              <Button size="sm" variant="outline" className="h-8"
                onClick={() => addTag(keywords, setKeywords, kwInput, setKwInput)}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Preferred Locations</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {locations.map((loc) => (
                <Badge key={loc} className="bg-gray-100 text-gray-600 border-0 text-xs pr-1.5 flex items-center gap-1">
                  {loc}
                  <button onClick={() => removeTag(locations, setLocations, loc)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={locInput}
                onChange={(e) => setLocInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag(locations, setLocations, locInput, setLocInput)}
                placeholder="Add location..."
                className="text-sm border-gray-200 h-8"
              />
              <Button size="sm" variant="outline" className="h-8"
                onClick={() => addTag(locations, setLocations, locInput, setLocInput)}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Job Types</Label>
            <div className="flex gap-5">
              {[
                { key: "fullTime", label: "Full-time" },
                { key: "remote", label: "Remote" },
                { key: "contract", label: "Contract" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={jobTypes[key as keyof typeof jobTypes]}
                    onCheckedChange={(v) => setJobTypes({ ...jobTypes, [key]: !!v })}
                  />
                  <Label htmlFor={key} className="text-sm text-gray-600 cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="sm" variant="outline">
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Config */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">DeepSeek API Key</Label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={api.deepseekKey}
                onChange={(e) => setApi({ ...api, deepseekKey: e.target.value })}
                className="text-sm border-gray-200 pr-10"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Scraper Schedule (cron)</Label>
            <Input
              value={api.schedule}
              onChange={(e) => setApi({ ...api, schedule: e.target.value })}
              className="text-sm border-gray-200 font-mono"
            />
            <p className="text-xs text-gray-400">Default: every day at 6:00 AM</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Sender Email</Label>
            <Input
              value={api.senderEmail}
              onChange={(e) => setApi({ ...api, senderEmail: e.target.value })}
              className="text-sm border-gray-200"
            />
          </div>
          <div className="flex justify-end">
            <Button size="sm" variant="outline">
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Config
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <DocumentsSection />
    </div>
  );
}

// ── Documents upload section ──────────────────────────────────────────────────

const API_BASE = "http://localhost:8000";

interface UploadedDoc {
  name: string;
  type: "cv" | "supporting";
  size: string;
  uploadedAt: string;
}

function DocumentsSection() {
  const cvRef = useRef<HTMLInputElement>(null);
  const docsRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [uploading, setUploading] = useState<"cv" | "supporting" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const upload = async (file: File, type: "cv" | "supporting") => {
    setUploading(type);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("doc_type", type);
      const res = await fetch(`${API_BASE}/documents/upload-profile`, { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail);
      }
      const newDoc: UploadedDoc = {
        name: file.name,
        type,
        size: formatSize(file.size),
        uploadedAt: new Date().toLocaleDateString("en-ZA"),
      };
      if (type === "cv") {
        setDocs((d) => [newDoc, ...d.filter((x) => x.type !== "cv")]);
      } else {
        setDocs((d) => [newDoc, ...d]);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const remove = (name: string) => setDocs((d) => d.filter((x) => x.name !== name));

  const cv = docs.find((d) => d.type === "cv");
  const supporting = docs.filter((d) => d.type === "supporting");

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Base CV */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-500">Base CV</Label>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              disabled={uploading === "cv"}
              onClick={() => cvRef.current?.click()}
            >
              {uploading === "cv"
                ? <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Uploading…</>
                : <><Upload className="w-3 h-3 mr-1.5" />{cv ? "Replace" : "Upload CV"}</>}
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
                <p className="text-xs font-medium text-gray-800 truncate">{cv.name}</p>
                <p className="text-[10px] text-gray-400">{cv.size} · {cv.uploadedAt}</p>
              </div>
              <button onClick={() => remove(cv.name)} className="text-gray-300 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              className="border border-dashed border-gray-200 rounded-lg px-4 py-5 text-center cursor-pointer hover:border-brand-400 transition-colors"
              onClick={() => cvRef.current?.click()}
            >
              <p className="text-xs text-gray-400">PDF or DOCX · max 10 MB</p>
            </div>
          )}
        </div>

        {/* Supporting documents */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-500">Supporting Documents</Label>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              disabled={uploading === "supporting"}
              onClick={() => docsRef.current?.click()}
            >
              {uploading === "supporting"
                ? <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Uploading…</>
                : <><Plus className="w-3 h-3 mr-1.5" />Add Document</>}
            </Button>
            <input
              ref={docsRef}
              type="file"
              accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "supporting")}
            />
          </div>
          <p className="text-[10px] text-gray-400">ID, certificates, matric results, references — PDF, DOCX, or image</p>
          {supporting.length > 0 ? (
            <div className="space-y-1.5">
              {supporting.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{doc.name}</p>
                    <p className="text-[10px] text-gray-400">{doc.size} · {doc.uploadedAt}</p>
                  </div>
                  <button onClick={() => remove(doc.name)} className="text-gray-300 hover:text-red-400">
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
              <p className="text-xs text-gray-400">Drag & drop or click to add</p>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
      </CardContent>
    </Card>
  );
}
