const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const jobsApi = {
  list: () => get<Job[]>("/jobs"),
  get: (id: string) => get<Job>(`/jobs/${id}`),
  scrape: (keywords: string[], location: string) =>
    post<ScrapeResponse>("/jobs/scrape", { keywords, location, max_per_source: 10 }),
};

export const cvApi = {
  analyze: (job: { title: string; company?: string; description: string }) =>
    post("/analyze", job),
  tailor: (body: unknown) => post<CVTailorResponse>("/tailor-cv", body),
  downloadUrl: (filename: string) => `${API_BASE}/download/${filename}`,
};

// ── Types matching backend models ─────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: "indeed" | "pnet" | "linkedin";
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
