import { auth } from "./auth";

// Live CareerGate AI server (Google Cloud Run, africa-south1).
// Override locally with VITE_API_URL when running the backend on your machine.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://careergate-api-93102026777.africa-south1.run.app";

export async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const user = auth?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      return { Authorization: `Bearer ${token}` };
    }
  } catch {
    /* ignore */
  }
  return {};
}

// AI-backed endpoints (tailoring, chat, document extraction) can legitimately
// take longer than a typical CRUD call — give them more room before we give up.
const DEFAULT_TIMEOUT_MS = 30_000;
const AI_TIMEOUT_MS = 60_000;

/** Turn a failed response into something a user should actually read — never
 * the raw body (which can be a FastAPI validation-error blob or a stack trace). */
export async function friendlyError(res: Response): Promise<string> {
  let parsed: unknown = null;
  try {
    parsed = await res.json();
  } catch {
    /* not JSON — fall through to a status-based message */
  }
  if (parsed && typeof parsed === "object" && "detail" in parsed) {
    const detail = (parsed as { detail: unknown }).detail;
    if (typeof detail === "string" && detail.trim()) return detail;
    if (Array.isArray(detail)) {
      return "Some of the information you entered wasn't valid — please check and try again.";
    }
  }
  if (res.status === 401) return "Please sign in again.";
  if (res.status === 404) return "We couldn't find that.";
  if (res.status === 429) return "You're doing that a bit too fast — please wait a moment and try again.";
  if (res.status >= 500) return "Something went wrong on our end — please try again.";
  return "Something went wrong. Please try again.";
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("That took too long to respond — please try again.");
    }
    throw new Error("Couldn't reach the server — check your connection and try again.");
  } finally {
    clearTimeout(timer);
  }
}

async function get<T>(path: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_BASE}${path}`, { headers: { ...authHeader } }, timeoutMs);
  if (!res.ok) throw new Error(await friendlyError(res));
  return res.json();
}

async function post<T>(path: string, body: unknown, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetchWithTimeout(
    `${API_BASE}${path}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify(body),
    },
    timeoutMs
  );
  if (!res.ok) throw new Error(await friendlyError(res));
  return res.json();
}

async function getBlob(path: string): Promise<Blob> {
  const authHeader = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_BASE}${path}`, { headers: { ...authHeader } });
  if (!res.ok) throw new Error(await friendlyError(res));
  return res.blob();
}

async function del<T>(path: string): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetchWithTimeout(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { ...authHeader },
  });
  if (!res.ok) throw new Error(await friendlyError(res));
  return res.json();
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export const jobsApi = {
  list: () => get<Job[]>("/jobs"),
  listPublic: async (): Promise<Job[]> => {
    const res = await fetchWithTimeout(`${API_BASE}/jobs/public`);
    if (!res.ok) throw new Error(await friendlyError(res));
    return res.json();
  },
  get: (id: string) => get<Job>(`/jobs/${id}`),
  scrape: (keywords: string[], location: string) =>
    post<ScrapeResponse>("/jobs/scrape", { keywords, location, max_per_source: 10 }),
  addManual: (body: { title: string; company: string; location: string; description: string; url?: string }) =>
    post<Job>("/jobs/manual", body),
};

// ── Chat ──────────────────────────────────────────────────────────────────────

export const chatApi = {
  send: (messages: { role: "user" | "assistant"; content: string }[], sessionId?: string) =>
    post<{ reply: string; session_id: string }>("/chat", { messages, session_id: sessionId }, AI_TIMEOUT_MS),
  listSessions: () => get<ChatSession[]>("/chat/sessions"),
  getSession: (sessionId: string) => get<ChatSession>(`/chat/sessions/${sessionId}`),
  deleteSession: (sessionId: string) => del<{ status: string }>(`/chat/sessions/${sessionId}`),
};

export const agentApi = {
  send: (
    messages: { role: "user" | "assistant"; content: string }[],
    options?: { session_id?: string; document_text?: string; cv_context?: Partial<CVDraft> }
  ) => post<AgentResponse>("/chat/agent", { messages, ...options }, AI_TIMEOUT_MS),
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
    post<CVAnalyzeResponse>("/analyze", job, AI_TIMEOUT_MS),
  tailor: (body: unknown) => post<CVTailorResponse>("/tailor-cv", body, AI_TIMEOUT_MS),
  coverLetter: (body: unknown) => post<{ cover_letter: string }>("/cover-letter", body, AI_TIMEOUT_MS),
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
    const res = await fetchWithTimeout(
      `${API_BASE}/documents/upload-profile`,
      { method: "POST", body: form, headers: authHeader },
      AI_TIMEOUT_MS
    );
    if (!res.ok) throw new Error(await friendlyError(res));
    return res.json();
  },
  download: (docId: string) => getBlob(`/documents/profile-docs/${docId}/download`),
  fill: async (file: File, values: Record<string, string>): Promise<ProfileDocument> => {
    const form = new FormData();
    form.append("file", file);
    form.append("values", JSON.stringify(values));
    const authHeader = await getAuthHeader();
    const res = await fetchWithTimeout(
      `${API_BASE}/documents/fill`,
      { method: "POST", body: form, headers: authHeader },
      AI_TIMEOUT_MS
    );
    if (!res.ok) throw new Error(await friendlyError(res));
    return res.json();
  },
  suggestFill: (body: { fields: string[]; document_text: string; profile?: unknown }) =>
    post<{ suggestions: Record<string, string> }>("/documents/suggest-fill", body, AI_TIMEOUT_MS),
  extract: async (file: File): Promise<ExtractedForm> => {
    const form = new FormData();
    form.append("file", file);
    const authHeader = await getAuthHeader();
    const res = await fetchWithTimeout(
      `${API_BASE}/documents/extract`,
      { method: "POST", body: form, headers: authHeader },
      AI_TIMEOUT_MS
    );
    if (!res.ok) throw new Error(await friendlyError(res));
    return res.json();
  },
  formChat: (body: {
    instruction: string;
    fields: string[];
    values: Record<string, string>;
    document_text?: string;
    profile?: unknown;
  }) => post<{ reply: string; values: Record<string, string> }>("/documents/form-chat", body, AI_TIMEOUT_MS),
};

export interface ExtractedForm {
  filename: string;
  page_count: number;
  text: string;
  char_count: number;
  fields: string[];
  is_fillable: boolean;
  ocr_used: boolean;
}


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
  source: "dpsa" | "manual";
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
  /** True when the listings came from the shared refresh someone already did. */
  cached?: boolean;
  last_updated?: string | null;
}

export interface CVTailorResponse {
  summary: string;
  skills: string[];
  experience: string[];
  education?: string;
  docx_path?: string;
  ats_score?: number;
  matched_keywords?: string[];
  missing_keywords?: string[];
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
