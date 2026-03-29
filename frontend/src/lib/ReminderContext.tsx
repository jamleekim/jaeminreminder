"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { Reminder, ReminderList, Selection, SmartListType } from "@/types";
import { listApi, reminderApi } from "@/lib/api";

interface ReminderContextType {
  lists: ReminderList[];
  reminders: Reminder[];
  selection: Selection | null;
  selectedReminder: Reminder | null;
  smartCounts: Record<SmartListType, number>;
  loading: boolean;
  searchMode: boolean;
  searchQuery: string;
  toast: string | null;
  sidebarOpen: boolean;
  showListModal: boolean;
  editingList: ReminderList | null;

  setSelection: (s: Selection | null) => void;
  setSelectedReminder: (r: Reminder | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setShowListModal: (show: boolean) => void;
  setEditingList: (list: ReminderList | null) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;

  refresh: () => Promise<void>;
  loadLists: () => Promise<void>;

  handleSearch: (query: string) => void;
  handleSearchClear: () => void;
  handleToggleComplete: (id: number) => Promise<void>;
  handleToggleFlag: (id: number) => Promise<void>;
  handleAdd: (title: string) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleCreateList: (data: { name: string; color: string; icon: string }) => Promise<void>;
  handleUpdateList: (data: { name: string; color: string; icon: string }) => Promise<void>;
  handleDeleteList: (list: ReminderList) => Promise<void>;
  handleListReorder: (ids: number[]) => Promise<void>;
  handleReminderReorder: (ids: number[]) => Promise<void>;
}

const ReminderContext = createContext<ReminderContextType | null>(null);

export function useReminders() {
  const ctx = useContext(ReminderContext);
  if (!ctx) throw new Error("useReminders must be used within ReminderProvider");
  return ctx;
}

export function ReminderProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<ReminderList[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [smartCounts, setSmartCounts] = useState<Record<SmartListType, number>>({
    today: 0, scheduled: 0, all: 0, completed: 0, flagged: 0,
  });
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [editingList, setEditingList] = useState<ReminderList | null>(null);

  const showToast = (msg: string) => setToast(msg);
  const clearToast = () => setToast(null);

  const withError = async (fn: () => Promise<void>) => {
    try { await fn(); } catch { showToast("요청에 실패했습니다. 다시 시도해주세요."); }
  };

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
      today: today.length, scheduled: scheduled.length, all: all.length,
      completed: completed.length, flagged: flagged.length,
    });
  }, []);

  const loadReminders = useCallback(async (signal?: AbortSignal) => {
    try {
      if (searchMode && searchQuery) {
        const data = await reminderApi.search(searchQuery);
        if (!signal?.aborted) setReminders(data);
        return;
      }
      if (!selection) { setReminders([]); return; }
      let data: Reminder[];
      if (selection.type === "smart") {
        data = await reminderApi.findSmart(selection.id as SmartListType);
      } else {
        data = await reminderApi.findByList(selection.id as number);
      }
      if (!signal?.aborted) setReminders(data);
    } catch {
      if (!signal?.aborted) showToast("데이터를 불러오지 못했습니다.");
    }
  }, [selection, searchMode, searchQuery]);

  useEffect(() => {
    Promise.all([loadLists(), loadSmartCounts()]).finally(() => setLoading(false));
  }, [loadLists, loadSmartCounts]);

  useEffect(() => {
    const controller = new AbortController();
    loadReminders(controller.signal);
    return () => controller.abort();
  }, [loadReminders]);

  const refresh = useCallback(async () => {
    await Promise.all([loadReminders(), loadSmartCounts(), loadLists()]);
  }, [loadReminders, loadSmartCounts, loadLists]);

  const handleSearch = useCallback((query: string) => {
    setSearchMode(true); setSearchQuery(query);
    setSelection(null); setSelectedReminder(null);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchMode(false); setSearchQuery("");
  }, []);

  const handleToggleComplete = async (id: number) => {
    await withError(async () => { await reminderApi.toggleComplete(id); await refresh(); });
  };

  const handleToggleFlag = async (id: number) => {
    await withError(async () => { await reminderApi.toggleFlag(id); await refresh(); });
  };

  const handleAdd = async (title: string) => {
    if (selection?.type !== "list") return;
    await withError(async () => {
      await reminderApi.create(selection.id as number, { title });
      await refresh();
    });
  };

  const handleDelete = async (id: number) => {
    await withError(async () => {
      await reminderApi.delete(id);
      setSelectedReminder(null);
      await refresh();
    });
  };

  const handleCreateList = async (data: { name: string; color: string; icon: string }) => {
    await withError(async () => {
      await listApi.create(data);
      setShowListModal(false);
      await loadLists();
    });
  };

  const handleUpdateList = async (data: { name: string; color: string; icon: string }) => {
    if (!editingList) return;
    await withError(async () => {
      await listApi.update(editingList.id, data);
      setEditingList(null); setShowListModal(false);
      await loadLists();
    });
  };

  const handleDeleteList = async (list: ReminderList) => {
    if (!confirm(`"${list.name}" 리스트와 포함된 리마인더가 모두 삭제됩니다.`)) return;
    await withError(async () => {
      await listApi.delete(list.id);
      if (selection?.type === "list" && selection.id === list.id) {
        setSelection(null); setReminders([]);
      }
      await Promise.all([loadLists(), loadSmartCounts()]);
    });
  };

  const handleListReorder = async (ids: number[]) => {
    await withError(async () => { await listApi.reorder(ids); await loadLists(); });
  };

  const handleReminderReorder = async (ids: number[]) => {
    await withError(async () => { await reminderApi.reorder(ids); await refresh(); });
  };

  return (
    <ReminderContext.Provider value={{
      lists, reminders, selection, selectedReminder, smartCounts, loading,
      searchMode, searchQuery, toast, sidebarOpen, showListModal, editingList,
      setSelection, setSelectedReminder, setSidebarOpen, setShowListModal, setEditingList,
      showToast, clearToast, refresh, loadLists,
      handleSearch, handleSearchClear, handleToggleComplete, handleToggleFlag,
      handleAdd, handleDelete, handleCreateList, handleUpdateList, handleDeleteList,
      handleListReorder, handleReminderReorder,
    }}>
      {children}
    </ReminderContext.Provider>
  );
}
