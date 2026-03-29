export type Priority = "NONE" | "LOW" | "MEDIUM" | "HIGH";

export interface ReminderList {
  id: number;
  name: string;
  color: string;
  icon: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: number;
  title: string;
  notes: string | null;
  dueDate: string | null;
  dueTime: string | null;
  priority: Priority;
  flagged: boolean;
  completed: boolean;
  completedAt: string | null;
  displayOrder: number;
  listId: number;
  listName: string;
  listColor: string;
  createdAt: string;
  updatedAt: string;
}

export type SmartListType = "today" | "scheduled" | "all" | "completed" | "flagged";

export interface Selection {
  type: "smart" | "list";
  id: SmartListType | number;
}
