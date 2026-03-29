import { Reminder, ReminderList, SmartListType } from "@/types";

const BASE = "/api";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ReminderList API
export const listApi = {
  findAll: () => fetchJson<ReminderList[]>(`${BASE}/lists`),
  create: (data: { name: string; color: string; icon?: string }) =>
    fetchJson<ReminderList>(`${BASE}/lists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: number, data: { name: string; color: string; icon?: string }) =>
    fetchJson<ReminderList>(`${BASE}/lists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchJson<void>(`${BASE}/lists/${id}`, { method: "DELETE" }),
  reorder: (ids: number[]) =>
    fetchJson<void>(`${BASE}/lists/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }),
};

// Reminder API
export const reminderApi = {
  findByList: (listId: number) =>
    fetchJson<Reminder[]>(`${BASE}/lists/${listId}/reminders`),
  create: (listId: number, data: { title: string; [key: string]: unknown }) =>
    fetchJson<Reminder>(`${BASE}/lists/${listId}/reminders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Record<string, unknown>) =>
    fetchJson<Reminder>(`${BASE}/reminders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchJson<void>(`${BASE}/reminders/${id}`, { method: "DELETE" }),
  toggleComplete: (id: number) =>
    fetchJson<Reminder>(`${BASE}/reminders/${id}/complete`, { method: "PATCH" }),
  toggleFlag: (id: number) =>
    fetchJson<Reminder>(`${BASE}/reminders/${id}/flag`, { method: "PATCH" }),
  reorder: (ids: number[]) =>
    fetchJson<void>(`${BASE}/reminders/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }),
  // Smart lists
  findSmart: (type: SmartListType) =>
    fetchJson<Reminder[]>(`${BASE}/reminders/${type}`),
  search: (query: string) =>
    fetchJson<Reminder[]>(`${BASE}/reminders/search?q=${encodeURIComponent(query)}`),
};
