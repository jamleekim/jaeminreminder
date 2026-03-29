"use client";

import { useState } from "react";
import { Reminder } from "@/types";
import { Flag } from "lucide-react";

interface ReminderRowProps {
  reminder: Reminder;
  listColor: string;
  onToggleComplete: (id: number) => void;
  onClick: (reminder: Reminder) => void;
}

function formatDueDate(dueDate: string | null, dueTime: string | null): string | null {
  if (!dueDate) return null;
  const date = new Date(dueDate + "T00:00:00");
  const formatted = date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  if (dueTime) {
    const [h, m] = dueTime.split(":");
    const hour = parseInt(h);
    const ampm = hour < 12 ? "오전" : "오후";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${formatted} ${ampm} ${displayHour}:${m}`;
  }
  return formatted;
}

function priorityLabel(priority: string): string | null {
  if (priority === "LOW") return "!";
  if (priority === "MEDIUM") return "!!";
  if (priority === "HIGH") return "!!!";
  return null;
}

export default function ReminderRow({ reminder, listColor, onToggleComplete, onClick }: ReminderRowProps) {
  const [completing, setCompleting] = useState(false);
  const dueDateStr = formatDueDate(reminder.dueDate, reminder.dueTime);
  const priority = priorityLabel(reminder.priority);
  const hasSubInfo = dueDateStr || priority;

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!reminder.completed) {
      setCompleting(true);
      setTimeout(() => {
        onToggleComplete(reminder.id);
        setCompleting(false);
      }, 500);
    } else {
      onToggleComplete(reminder.id);
    }
  };

  return (
    <div
      className={`flex cursor-pointer items-start gap-3 px-4 py-2 transition-all ${
        completing ? "animate-slide-up" : ""
      }`}
      onClick={() => onClick(reminder)}
    >
      <button
        onClick={handleComplete}
        aria-label={reminder.completed ? "완료 취소" : "완료 처리"}
        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200"
        style={{
          borderColor: listColor,
          backgroundColor: reminder.completed || completing ? listColor : "transparent",
        }}
      >
        {(reminder.completed || completing) && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="animate-check-fill">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1 border-b py-0.5" style={{ borderColor: "var(--separator)" }}>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm transition-all duration-200 ${
              reminder.completed || completing ? "line-through" : ""
            }`}
            style={{ color: reminder.completed || completing ? "var(--text-secondary)" : "var(--text-primary)" }}
          >
            {reminder.title}
          </span>
          {reminder.flagged && <Flag size={14} fill="#FF9500" className="text-[#FF9500]" />}
        </div>
        {hasSubInfo && (
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {[dueDateStr, priority].filter(Boolean).join(" · ")}
          </p>
        )}
        {reminder.notes && (
          <p className="truncate text-xs" style={{ color: "var(--text-secondary)" }}>
            {reminder.notes}
          </p>
        )}
      </div>
    </div>
  );
}
