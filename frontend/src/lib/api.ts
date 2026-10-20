const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Course = {
  id: number;
  code: string;
  title: string;
  program: string;
  credits: number;
  recommended_term: string | null;
  description: string | null;
  tips: string | null;
};

export type Contact = {
  id: number;
  name: string;
  role: string;
  office: string;
  category: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  rose_hill_location: string | null;
  lincoln_center_location: string | null;
  reach_out_for: string;
};

export type Phase = "before_arrival" | "first_10_days" | "first_semester" | "ongoing" | "employment";

export type PaperworkItem = {
  id: number;
  title: string;
  description: string;
  applies_to: string;
  phase: Phase;
  deadline_date: string | null;
  deadline_note: string | null;
  steps: string[];
  is_critical: boolean;
  external_link: string | null;
  source_name: string | null;
  source_url: string | null;
  last_verified: string | null;
  contact: Contact | null;
};

export const PHASE_LABELS: Record<Phase, string> = {
  before_arrival: "Before you arrive",
  first_10_days: "Your first 10 days",
  first_semester: "First semester",
  ongoing: "Keeping your status",
  employment: "Working in the US",
};

export const PHASE_ORDER: Phase[] = [
  "before_arrival",
  "first_10_days",
  "first_semester",
  "ongoing",
  "employment",
];

export type SearchResult = {
  type: "course" | "paperwork" | "contact";
  id: number;
  title: string;
  snippet: string;
};

// Reference content changes rarely, and the API sleeps on a free Render instance where a
// cold start can outlast the serverless function. Caching means most page views never wait
// on it, and `fetchOrNull` keeps a sleeping backend from turning into a 500 for the reader.
const REVALIDATE_SECONDS = 300;

async function apiFetch<T>(path: string, revalidate: number = REVALIDATE_SECONDS): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchOrNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}

export const getCourses = (program?: string) =>
  apiFetch<Course[]>(`/api/courses${program ? `?program=${encodeURIComponent(program)}` : ""}`);

export const getPaperwork = () => apiFetch<PaperworkItem[]>("/api/paperwork");

export const getContacts = () => apiFetch<Contact[]>("/api/contacts");

export const search = (q: string) =>
  apiFetch<SearchResult[]>(`/api/search?q=${encodeURIComponent(q)}`, 60);

export const submitCorrection = async (payload: { category: string; content: string; submitter_email?: string }) => {
  const res = await fetch(`${API_URL}/api/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Submission failed");
  return res.json();
};
