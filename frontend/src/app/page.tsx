"use client";

import { useCallback, useEffect, useState } from "react";
import { Reminder, ReminderList, Selection, SmartListType } from "@/types";
import { listApi, reminderApi } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ReminderListView from "@/components/ReminderListView";
import DetailPanel from "@/components/DetailPanel";
import ListModal from "@/components/ListModal";
import ContextMenu from "@/components/ContextMenu";
import Toast from "@/components/Toast";
import MobileHeader from "@/components/MobileHeader";
import { ReminderListSkeleton } from "@/components/Skeleton";

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
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [smartCounts, setSmartCounts] = useState<Record<SmartListType, number>>({
    today: 0, scheduled: 0, all: 0, completed: 0, flagged: 0,
  });

  // List modal
  const [showListModal, setShowListModal] = useState(false);
  const [editingList, setEditingList] = useState<ReminderList | null>(null);

  // Context menu
  const [contextMenu, setContextMenu] = useState<{
    x: number; y: number; list: ReminderList;
  } | null>(null);

  // Search
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (msg: string) => setToast(msg);

  const withErrorHandling = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch {
      showToast("요청에 실패했습니다. 다시 시도해주세요.");
    }
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
      today: today.length,
      scheduled: scheduled.length,
      all: all.length,
      completed: completed.length,
      flagged: flagged.length,
    });
  }, []);

  const loadReminders = useCallback(async () => {
    if (searchMode && searchQuery) {
      const data = await reminderApi.search(searchQuery);
      setReminders(data);
      return;
    }
    if (!selection) { setReminders([]); return; }
    let data: Reminder[];
    if (selection.type === "smart") {
      data = await reminderApi.findSmart(selection.id as SmartListType);
    } else {
      data = await reminderApi.findByList(selection.id as number);
    }
    setReminders(data);
  }, [selection, searchMode, searchQuery]);

  useEffect(() => {
    Promise.all([loadLists(), loadSmartCounts()]).finally(() => setLoading(false));
  }, [loadLists, loadSmartCounts]);

  useEffect(() => { loadReminders(); }, [loadReminders]);

  const refresh = () => { loadReminders(); loadSmartCounts(); loadLists(); };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedReminder) { setSelectedReminder(null); e.preventDefault(); }
        else if (showListModal) { setShowListModal(false); setEditingList(null); e.preventDefault(); }
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedReminder && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
          withErrorHandling(async () => {
            await reminderApi.delete(selectedReminder.id);
            setSelectedReminder(null);
            refresh();
          });
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedReminder, showListModal]);

  const handleToggleComplete = async (id: number) => {
    await withErrorHandling(async () => { await reminderApi.toggleComplete(id); refresh(); });
  };

  const handleToggleFlag = async (id: number) => {
    await withErrorHandling(async () => { await reminderApi.toggleFlag(id); refresh(); });
  };

  const handleAdd = async (title: string) => {
    if (selection?.type !== "list") return;
    await withErrorHandling(async () => {
      await reminderApi.create(selection.id as number, { title });
      refresh();
    });
  };

  const handleDelete = async (id: number) => {
    await withErrorHandling(async () => {
      await reminderApi.delete(id);
      setSelectedReminder(null);
      refresh();
    });
  };

  const handleCreateList = async (data: { name: string; color: string; icon: string }) => {
    await withErrorHandling(async () => {
      await listApi.create(data);
      setShowListModal(false);
      loadLists();
    });
  };

  const handleUpdateList = async (data: { name: string; color: string; icon: string }) => {
    if (!editingList) return;
    await withErrorHandling(async () => {
      await listApi.update(editingList.id, data);
      setEditingList(null);
      setShowListModal(false);
      loadLists();
    });
  };

  const handleDeleteList = async (list: ReminderList) => {
    if (!confirm(`"${list.name}" 리스트와 포함된 리마인더가 모두 삭제됩니다.`)) return;
    await withErrorHandling(async () => {
      await listApi.delete(list.id);
      if (selection?.type === "list" && selection.id === list.id) {
        setSelection(null);
        setReminders([]);
      }
      loadLists();
      loadSmartCounts();
    });
  };

  const handleSearch = useCallback((query: string) => {
    setSearchMode(true);
    setSearchQuery(query);
    setSelection(null);
    setSelectedReminder(null);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchMode(false);
    setSearchQuery("");
  }, []);

  const selectSmart = (type: SmartListType) => {
    setSearchMode(false); setSearchQuery("");
    setSelection({ type: "smart", id: type });
    setSelectedReminder(null);
    setSidebarOpen(false);
  };

  const selectList = (id: number) => {
    setSearchMode(false); setSearchQuery("");
    setSelection({ type: "list", id });
    setSelectedReminder(null);
    setSidebarOpen(false);
  };

  const getTitle = (): string => {
    if (searchMode) return `검색: "${searchQuery}"`;
    if (!selection) return "Reminders";
    if (selection.type === "smart") return SMART_LIST_META[selection.id as SmartListType].title;
    return lists.find((l) => l.id === selection.id)?.name ?? "";
  };

  const getTitleColor = (): string => {
    if (searchMode) return "var(--text-primary)";
    if (!selection) return "var(--text-primary)";
    if (selection.type === "smart") return SMART_LIST_META[selection.id as SmartListType].color;
    return lists.find((l) => l.id === selection.id)?.color ?? "var(--text-primary)";
  };

  const getListColor = (): string => {
    if (searchMode) return "#007AFF";
    if (!selection) return "#007AFF";
    if (selection.type === "smart") return SMART_LIST_META[selection.id as SmartListType].color;
    return lists.find((l) => l.id === selection.id)?.color ?? "#007AFF";
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - desktop always visible, mobile overlay */}
      <div className={`
        max-lg:fixed max-lg:inset-0 max-lg:z-40
        ${sidebarOpen ? "max-lg:block" : "max-lg:hidden"}
        lg:block
      `}>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="relative z-10 h-full">
          <Sidebar
            lists={lists}
            smartCounts={smartCounts}
            selection={selection}
            onSelectSmart={selectSmart}
            onSelectList={selectList}
            onAddListClick={() => { setEditingList(null); setShowListModal(true); }}
            onContextMenu={(e, list) => setContextMenu({ x: e.clientX, y: e.clientY, list })}
            onSearch={handleSearch}
            onSearchClear={handleSearchClear}
            onListReorder={async (ids) => {
              await withErrorHandling(async () => { await listApi.reorder(ids); loadLists(); });
            }}
          />
        </div>
      </div>

      <main className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: "var(--content-bg)" }}>
        {/* Mobile header */}
        <MobileHeader
          title={getTitle()}
          titleColor={getTitleColor()}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          {loading ? (
            <div className="flex-1">
              <ReminderListSkeleton />
            </div>
          ) : selection || searchMode ? (
            <>
              <div className="flex-1 overflow-hidden animate-fade-in">
                <ReminderListView
                  title={getTitle()}
                  titleColor={getTitleColor()}
                  reminders={reminders}
                  listColor={getListColor()}
                  showInlineAdd={selection?.type === "list" && !searchMode}
                  onToggleComplete={handleToggleComplete}
                  onToggleFlag={handleToggleFlag}
                  onReminderClick={(r) => setSelectedReminder(r)}
                  onAdd={handleAdd}
                  onReorder={async (ids) => {
                    await withErrorHandling(async () => { await reminderApi.reorder(ids); refresh(); });
                  }}
                />
              </div>
              {selectedReminder && (
                <div className="max-md:fixed max-md:inset-0 max-md:z-30 max-md:flex max-md:items-end md:block">
                  {/* Mobile backdrop for detail panel */}
                  <div
                    className="fixed inset-0 bg-black/30 md:hidden"
                    onClick={() => setSelectedReminder(null)}
                  />
                  <div className="relative z-10 max-md:w-full max-md:max-h-[80vh] max-md:rounded-t-2xl max-md:overflow-hidden">
                    <DetailPanel
                      reminder={selectedReminder}
                      lists={lists}
                      onUpdate={() => {
                        refresh();
                        reminderApi.findByList(selectedReminder.listId).then((data) => {
                          const updated = data.find((r) => r.id === selectedReminder.id);
                          if (updated) setSelectedReminder(updated);
                        });
                      }}
                      onDelete={handleDelete}
                      onClose={() => setSelectedReminder(null)}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p style={{ color: "var(--text-secondary)" }}>리스트를 선택하세요</p>
            </div>
          )}
        </div>
      </main>

      {/* List Modal */}
      {showListModal && (
        <ListModal
          editingList={editingList}
          onSave={editingList ? handleUpdateList : handleCreateList}
          onCancel={() => { setShowListModal(false); setEditingList(null); }}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={[
            { label: "편집", onClick: () => { setEditingList(contextMenu.list); setShowListModal(true); } },
            { label: "삭제", onClick: () => handleDeleteList(contextMenu.list), danger: true },
          ]}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
