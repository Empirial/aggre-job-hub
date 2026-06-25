import { auth } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function getAuthHeader(): Promise<Record<string, string>> {
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
};

// ── Chat ──────────────────────────────────────────────────────────────────────

export const chatApi = {
  send: (messages: { role: "user" | "assistant"; content: string }[], sessionId?: string) =>
    post<{ reply: string; session_id: string }>("/chat", { messages, session_id: sessionId }),
  listSessions: () => get<ChatSession[]>("/chat/sessions"),
  getSession: (sessionId: string) => get<ChatSession>(`/chat/sessions/${sessionId}`),
  deleteSession: (sessionId: string) => del<{ status: string }>(`/chat/sessions/${sessionId}`),
};

// ── CV ────────────────────────────────────────────────────────────────────────

export const cvApi = {
  analyze: (job: { title: string; company?: string; description: string }): Promise<CVAnalyzeResponse> =>
    post<CVAnalyzeResponse>("/analyze", job),
  tailor: (body: unknown) => post<CVTailorResponse>("/tailor-cv", body),
  coverLetter: (body: unknown) => post<{ cover_letter: string }>("/cover-letter", body),
  downloadUrl: (filename: string) => `${API_BASE}/download/${filename}`,
};

// ── Applications ──────────────────────────────────────────────────────────────

export const applicationsApi = {
  list: () => get<Application[]>("/applications"),
  send: (body: {
    job_id: string;
    profile: unknown;
    recipient_email: string;
    cover_note?: string;
  }) => post<{ status: string; message: string }>("/applications/send", body),
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
  source: "indeed" | "pnet" | "linkedin" | "adzuna" | "jooble" | "careerjet" | "reed" | "themuse";
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

export interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  status: string;
  cv_path?: string;
  recipient_email?: string;
  date_applied?: string;
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
