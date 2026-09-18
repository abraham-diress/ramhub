const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Card = {
  id: number;
  column_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  position: number;
};

export type Column = {
  id: number;
  board_id: number;
  title: string;
  position: number;
  cards: Card[];
};

export type Board = {
  id: number;
  title: string;
  created_at: string;
};

export type BoardDetail = Board & {
  columns: Column[];
};

export type CalendarItem = {
  type: "event" | "task";
  id: number;
  title: string;
  description: string | null;
  start: string;
  end: string | null;
  all_day: boolean;
  editable: boolean;
};

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(token: string, path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, body || `Request to ${path} failed with ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const boardsApi = {
  list: (token: string) => request<Board[]>(token, "/api/boards"),
  get: (token: string, boardId: number) => request<BoardDetail>(token, `/api/boards/${boardId}`),
  create: (token: string, title: string) =>
    request<BoardDetail>(token, "/api/boards", { method: "POST", body: JSON.stringify({ title }) }),
  remove: (token: string, boardId: number) =>
    request<void>(token, `/api/boards/${boardId}`, { method: "DELETE" }),
  createColumn: (token: string, boardId: number, title: string) =>
    request<Column>(token, `/api/boards/${boardId}/columns`, {
      method: "POST",
      body: JSON.stringify({ title }),
    }),
  updateColumn: (token: string, columnId: number, payload: Partial<Pick<Column, "title" | "position">>) =>
    request<Column>(token, `/api/boards/columns/${columnId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  removeColumn: (token: string, columnId: number) =>
    request<void>(token, `/api/boards/columns/${columnId}`, { method: "DELETE" }),
  createCard: (
    token: string,
    columnId: number,
    payload: { title: string; description?: string | null; due_date?: string | null }
  ) =>
    request<Card>(token, `/api/boards/columns/${columnId}/cards`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateCard: (
    token: string,
    cardId: number,
    payload: Partial<{
      title: string;
      description: string | null;
      due_date: string | null;
      column_id: number;
      position: number;
    }>
  ) =>
    request<Card>(token, `/api/boards/cards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  removeCard: (token: string, cardId: number) =>
    request<void>(token, `/api/boards/cards/${cardId}`, { method: "DELETE" }),
  trackPaperwork: (token: string, paperworkId: number) =>
    request<TrackResult>(token, "/api/boards/track", {
      method: "POST",
      body: JSON.stringify({ paperwork_id: paperworkId }),
    }),
};

export type TrackResult = {
  board_id: number;
  board_title: string;
  card: Card;
  already_tracked: boolean;
};

export const calendarApi = {
  list: (token: string) => request<CalendarItem[]>(token, "/api/calendar"),
  createEvent: (
    token: string,
    payload: { title: string; description?: string | null; start_time: string; end_time?: string | null; all_day?: boolean }
  ) => request<CalendarItem>(token, "/api/calendar/events", { method: "POST", body: JSON.stringify(payload) }),
  updateEvent: (
    token: string,
    eventId: number,
    payload: Partial<{ title: string; description: string | null; start_time: string; end_time: string | null; all_day: boolean }>
  ) =>
    request<CalendarItem>(token, `/api/calendar/events/${eventId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  removeEvent: (token: string, eventId: number) =>
    request<void>(token, `/api/calendar/events/${eventId}`, { method: "DELETE" }),
};
