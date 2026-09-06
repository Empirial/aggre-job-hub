import { auth } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    if (sessionStorage.getItem("cg_demo_mode")) {
      return { "X-Demo-Mode": "true" };
    }
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      return { Authorization: `Bearer ${token}` };
    }
  } catch {
    /* ignore */
  }
  return {};
}

async function get<T>(path: string): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${API_BASE}${path}`, { headers: { ...authHeader } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function getBlob(path: string): Promise<Blob> {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${API_BASE}${path}`, { headers: { ...authHeader } });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}

async function del<T>(path: string): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { ...authHeader },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export const jobsApi = {
  list: () => get<Job[]>("/jobs"),
  get: (id: string) => get<Job>(`/jobs/${id}`),
  scrape: (keywords: string[], location: string) =>
    post<ScrapeResponse>("/jobs/scrape", { keywords, location, max_per_source: 10 }),
  addManual: (body: { title: string; company: string; location: string; description: string; url?: string }) =>
    post<Job>("/jobs/manual", body),
};

// ── Chat ──────────────────────────────────────────────────────────────────────

export const chatApi = {
  send: (messages: { role: "user" | "assistant"; content: string }[], sessionId?: string) =>
    post<{ reply: string; session_id: string }>("/chat", { messages, session_id: sessionId }),
  listSessions: () => get<ChatSession[]>("/chat/sessions"),
  getSession: (sessionId: string) => get<ChatSession>(`/chat/sessions/${sessionId}`),
  deleteSession: (sessionId: string) => del<{ status: string }>(`/chat/sessions/${sessionId}`),
};

export const agentApi = {
  send: (
    messages: { role: "user" | "assistant"; content: string }[],
    options?: { session_id?: string; document_text?: string; cv_context?: Partial<CVDraft> }
  ) => post<AgentResponse>("/chat/agent", { messages, ...options }),
};

export interface AgentAction {
  type: "update_profile" | "extract_cv" | "update_cv" | "add_job";
  patch: Partial<UserProfile> & Partial<CVDraft> & {
    title?: string;
    company?: string;
    location?: string;
    description?: string;
    url?: string;
  };
}

export interface AgentResponse {
  reply: string;
  session_id: string;
  action?: AgentAction;
}

// ── CV ────────────────────────────────────────────────────────────────────────

export const cvApi = {
  analyze: (job: { title: string; company?: string; description: string }): Promise<CVAnalyzeResponse> =>
    post<CVAnalyzeResponse>("/analyze", job),
  tailor: (body: unknown) => post<CVTailorResponse>("/tailor-cv", body),
  coverLetter: (body: unknown) => post<{ cover_letter: string }>("/cover-letter", body),
  generateDocx: (body: unknown) => post<{ docx_path: string }>("/cv/generate-docx", body),
  download: (filename: string) => getBlob(`/download/${encodeURIComponent(filename)}`),
};

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Documents ─────────────────────────────────────────────────────────────────

export const documentsApi = {
  list: () => get<ProfileDocument[]>("/documents/profile-docs"),
  delete: (docId: string) => del<{ status: string }>(`/documents/profile-docs/${docId}`),
  reprocess: () => post<{ reprocessed: number; total: number }>("/documents/profile-docs/reprocess", {}),
  upload: async (file: File, docType: "cv" | "supporting"): Promise<ProfileDocument> => {
    const form = new FormData();
    form.append("file", file);
    form.append("doc_type", docType);
    const authHeader = await getAuthHeader();
    const res = await fetch(`${API_BASE}/documents/upload-profile`, {
      method: "POST",
      body: form,
      headers: authHeader,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  download: (docId: string) => getBlob(`/documents/profile-docs/${docId}/download`),
  fill: async (file: File, values: Record<string, string>): Promise<ProfileDocument> => {
    const form = new FormData();
    form.append("file", file);
    form.append("values", JSON.stringify(values));
    const authHeader = await getAuthHeader();
    const res = await fetch(`${API_BASE}/documents/fill`, {
      method: "POST",
      body: form,
      headers: authHeader,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  suggestFill: (body: { fields: string[]; document_text: string; profile?: unknown }) =>
    post<{ suggestions: Record<string, string> }>("/documents/suggest-fill", body),
};

// ── Profile ───────────────────────────────────────────────────────────────────

export const profileApi = {
  get: () => get<UserProfile>("/profile"),
  save: (profile: UserProfile) => post<{ status: string }>("/profile", profile),
  // CV drafts
  listDrafts: () => get<CVDraft[]>("/profile/cv-drafts"),
  saveDraft: (draft: CVDraft) => post<{ status: string; draft_id: string }>("/profile/cv-drafts", draft),
  deleteDraft: (draftId: string) => del<{ status: string }>(`/profile/cv-drafts/${draftId}`),
  // Saved jobs
  listSavedJobs: () => get<Job[]>("/profile/saved-jobs"),
  saveJob: (jobId: string) => post<{ status: string }>(`/profile/saved-jobs/${jobId}`, {}),
  removeJob: (jobId: string) => del<{ status: string }>(`/profile/saved-jobs/${jobId}`),
  checkSaved: (jobId: string) => get<{ saved: boolean }>(`/profile/saved-jobs/${jobId}/status`),
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: "indeed" | "pnet" | "linkedin" | "adzuna" | "jooble" | "careerjet" | "reed" | "themuse" | "manual";
  date_posted?: string;
  ats_score?: number;
  keywords: string[];
  cv_generated: boolean;
  created_at: string;
}

export interface ScrapeResponse {
  scraped: number;
  saved: number;
  jobs: Job[];
}

export interface CVTailorResponse {
  summary: string;
  skills: string[];
  experience: string[];
  education?: string;
  docx_path?: string;
}

export interface CVAnalyzeResponse {
  ats_score?: number;
  keywords?: string[];
  suggestions?: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experience: string[];
  education: string;
  keywords: string[];
  locations: string[];
  jobTypes: { fullTime: boolean; remote: boolean; contract: boolean };
}

export interface CVDraft {
  draft_id: string;
  job_id?: string;
  job_title?: string;
  summary?: string;
  skills?: string[];
  experience?: string[];
  education?: string;
  created_at?: string;
}

export interface ChatSession {
  session_id: string;
  messages: { role: "user" | "assistant"; content: string; timestamp: string }[];
  updated_at: string;
}

export interface ProfileDocument {
  id: string;
  original_filename: string;
  doc_type: "cv" | "supporting" | "filled_form";
  size: number;
  content_type: string;
  text_excerpt?: string;
  created_at: string;
}
