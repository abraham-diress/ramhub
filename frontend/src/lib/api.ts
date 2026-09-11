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
  email: string | null;
  phone: string | null;
  reach_out_for: string;
};

export type PaperworkItem = {
  id: number;
  title: string;
  description: string;
  applies_to: string;
  deadline_date: string | null;
  deadline_note: string | null;
  external_link: string | null;
  contact: Contact | null;
};

export type SearchResult = {
  type: "course" | "paperwork" | "contact";
  id: number;
  title: string;
  snippet: string;
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const getCourses = (program?: string) =>
  apiFetch<Course[]>(`/api/courses${program ? `?program=${encodeURIComponent(program)}` : ""}`);

export const getPaperwork = () => apiFetch<PaperworkItem[]>("/api/paperwork");

export const getContacts = () => apiFetch<Contact[]>("/api/contacts");

export const search = (q: string) => apiFetch<SearchResult[]>(`/api/search?q=${encodeURIComponent(q)}`);

export const submitCorrection = async (payload: { category: string; content: string; submitter_email?: string }) => {
  const res = await fetch(`${API_URL}/api/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Submission failed");
  return res.json();
};
