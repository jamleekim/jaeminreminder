"use client";

import { useCallback, useEffect, useState } from "react";
import { Reminder, ReminderList, Selection, SmartListType } from "@/types";
import { listApi, reminderApi } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ReminderListView from "@/components/ReminderListView";

const SMART_LIST_META: Record<SmartListType, { title: string; color: string }> = {
  today: { title: "오늘", color: "#007AFF" },
  scheduled: { title: "예정", color: "#FF3B30" },
  all: { title: "전체", color: "#5856D6" },
  flagged: { title: "깃발 표시", color: "#FF9500" },
  completed: { title: "완료됨", color: "#8E8E93" },
};

export default function Home() {
  const [lists, setLists] = useState<ReminderList[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [smartCounts, setSmartCounts] = useState<Record<SmartListType, number>>({
    today: 0, scheduled: 0, all: 0, completed: 0, flagged: 0,
  });

  const loadLists = useCallback(async () => {
    const data = await listApi.findAll();
    setLists(data);
  }, []);

  const loadSmartCounts = useCallback(async () => {
    const [today, scheduled, all, completed, flagged] = await Promise.all([
      reminderApi.findSmart("today"),
      reminderApi.findSmart("scheduled"),
      reminderApi.findSmart("all"),
      reminderApi.findSmart("completed"),
      reminderApi.findSmart("flagged"),
    ]);
    setSmartCounts({
      today: today.length,
      scheduled: scheduled.length,
      all: all.length,
      completed: completed.length,
      flagged: flagged.length,
    });
  }, []);

  const loadReminders = useCallback(async () => {
    if (!selection) return;
    let data: Reminder[];
    if (selection.type === "smart") {
      data = await reminderApi.findSmart(selection.id as SmartListType);
    } else {
      data = await reminderApi.findByList(selection.id as number);
    }
    setReminders(data);
  }, [selection]);

  useEffect(() => {
    loadLists();
    loadSmartCounts();
  }, [loadLists, loadSmartCounts]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const handleToggleComplete = async (id: number) => {
    await reminderApi.toggleComplete(id);
    loadReminders();
    loadSmartCounts();
  };

  const getTitle = (): string => {
    if (!selection) return "Reminders";
    if (selection.type === "smart") return SMART_LIST_META[selection.id as SmartListType].title;
    const list = lists.find((l) => l.id === selection.id);
    return list?.name ?? "";
  };

  const getTitleColor = (): string => {
    if (!selection) return "var(--text-primary)";
    if (selection.type === "smart") return SMART_LIST_META[selection.id as SmartListType].color;
    const list = lists.find((l) => l.id === selection.id);
    return list?.color ?? "var(--text-primary)";
  };

  const getListColor = (): string => {
    if (!selection) return "#007AFF";
    if (selection.type === "smart") return SMART_LIST_META[selection.id as SmartListType].color;
    const list = lists.find((l) => l.id === selection.id);
    return list?.color ?? "#007AFF";
  };

  return (
    <div className="flex h-full">
      <Sidebar
        lists={lists}
        smartCounts={smartCounts}
        selection={selection}
        onSelectSmart={(type) => setSelection({ type: "smart", id: type })}
        onSelectList={(id) => setSelection({ type: "list", id })}
        onAddListClick={() => {}}
      />
      <main className="flex-1 overflow-hidden" style={{ backgroundColor: "var(--content-bg)" }}>
        {selection ? (
          <ReminderListView
            title={getTitle()}
            titleColor={getTitleColor()}
            reminders={reminders}
            listColor={getListColor()}
            onToggleComplete={handleToggleComplete}
            onReminderClick={() => {}}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p style={{ color: "var(--text-secondary)" }}>리스트를 선택하세요</p>
          </div>
        )}
      </main>
    </div>
  );
}
