"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reminder, ReminderList, Priority } from "@/types";
import { reminderApi } from "@/lib/api";
import { Trash2 } from "lucide-react";

interface DetailPanelProps {
  reminder: Reminder;
  lists: ReminderList[];
  onUpdate: () => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "NONE", label: "없음" },
  { value: "LOW", label: "!" },
  { value: "MEDIUM", label: "!!" },
  { value: "HIGH", label: "!!!" },
];

export default function DetailPanel({ reminder, lists, onUpdate, onDelete, onClose }: DetailPanelProps) {
  const [title, setTitle] = useState(reminder.title);
  const [notes, setNotes] = useState(reminder.notes ?? "");
  const [dueDate, setDueDate] = useState(reminder.dueDate ?? "");
  const [dueTime, setDueTime] = useState(reminder.dueTime ?? "");
  const [priority, setPriority] = useState<Priority>(reminder.priority);
  const [flagged, setFlagged] = useState(reminder.flagged);
  const [listId, setListId] = useState(reminder.listId);
  const [hasDateEnabled, setHasDateEnabled] = useState(!!reminder.dueDate);
  const [hasTimeEnabled, setHasTimeEnabled] = useState(!!reminder.dueTime);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setTitle(reminder.title);
    setNotes(reminder.notes ?? "");
    setDueDate(reminder.dueDate ?? "");
    setDueTime(reminder.dueTime ?? "");
    setPriority(reminder.priority);
    setFlagged(reminder.flagged);
    setListId(reminder.listId);
    setHasDateEnabled(!!reminder.dueDate);
    setHasTimeEnabled(!!reminder.dueTime);
  }, [reminder]);

  const save = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await reminderApi.update(reminder.id, {
        title: title || reminder.title,
        notes: notes || null,
        dueDate: hasDateEnabled && dueDate ? dueDate : null,
        dueTime: hasTimeEnabled && dueTime ? dueTime : null,
        priority,
        flagged,
        listId,
      });
      onUpdate();
    }, 500);
  }, [title, notes, dueDate, dueTime, priority, flagged, listId, hasDateEnabled, hasTimeEnabled, reminder, onUpdate]);

  useEffect(() => {
    save();
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [save]);

  const handleDelete = async () => {
    onDelete(reminder.id);
  };

  return (
    <div
      className="flex h-full w-[320px] flex-shrink-0 flex-col overflow-y-auto border-l animate-slide-in-right"
      style={{ backgroundColor: "var(--detail-bg)", borderColor: "var(--separator)" }}
    >
      <div className="flex justify-end p-2">
        <button
          onClick={onClose}
          className="rounded-full px-3 py-1 text-sm"
          style={{ color: "var(--color-blue)" }}
        >
          완료
        </button>
      </div>

      {/* Title & Notes */}
      <div className="mx-4 rounded-xl p-3" style={{ backgroundColor: "var(--card-bg)" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-sm font-medium outline-none"
          style={{ color: "var(--text-primary)" }}
          placeholder="제목"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-2 w-full resize-none bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
          placeholder="메모"
          rows={3}
        />
      </div>

      {/* Date & Time */}
      <div className="mx-4 mt-3 rounded-xl" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="flex items-center justify-between border-b px-3 py-2.5" style={{ borderColor: "var(--separator)" }}>
          <span className="text-sm">📅 날짜</span>
          <input
            type="checkbox"
            checked={hasDateEnabled}
            onChange={(e) => {
              setHasDateEnabled(e.target.checked);
              if (!e.target.checked) setDueDate("");
            }}
            className="accent-[var(--color-blue)]"
          />
        </div>
        {hasDateEnabled && (
          <div className="px-3 py-2">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        )}
        <div className="flex items-center justify-between border-b px-3 py-2.5" style={{ borderColor: "var(--separator)" }}>
          <span className="text-sm">⏰ 시간</span>
          <input
            type="checkbox"
            checked={hasTimeEnabled}
            onChange={(e) => {
              setHasTimeEnabled(e.target.checked);
              if (!e.target.checked) setDueTime("");
            }}
            className="accent-[var(--color-blue)]"
          />
        </div>
        {hasTimeEnabled && (
          <div className="px-3 py-2">
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        )}
      </div>

      {/* Priority & Flag */}
      <div className="mx-4 mt-3 rounded-xl" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="flex items-center justify-between border-b px-3 py-2.5" style={{ borderColor: "var(--separator)" }}>
          <span className="text-sm">우선순위</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="bg-transparent text-sm outline-none"
            style={{ color: "var(--color-blue)" }}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-sm">🚩 깃발</span>
          <input
            type="checkbox"
            checked={flagged}
            onChange={(e) => setFlagged(e.target.checked)}
            className="accent-[var(--color-orange)]"
          />
        </div>
      </div>

      {/* List selection */}
      <div className="mx-4 mt-3 rounded-xl" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-sm">📁 리스트</span>
          <select
            value={listId}
            onChange={(e) => setListId(Number(e.target.value))}
            className="bg-transparent text-sm outline-none"
            style={{ color: "var(--color-blue)" }}
          >
            {lists.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Delete */}
      <div className="mx-4 mt-3 mb-6">
        <button
          onClick={handleDelete}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-red-500"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <Trash2 size={16} />
          리마인더 삭제
        </button>
      </div>
    </div>
  );
}
