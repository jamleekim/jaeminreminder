"use client";

import { useCallback, useEffect, useState } from "react";
import { Reminder, ReminderList, Selection, SmartListType } from "@/types";
import { listApi, reminderApi } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ReminderListView from "@/components/ReminderListView";
import DetailPanel from "@/components/DetailPanel";
import ListModal from "@/components/ListModal";
import ContextMenu from "@/components/ContextMenu";

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

  useEffect(() => { loadLists(); loadSmartCounts(); }, [loadLists, loadSmartCounts]);
  useEffect(() => { loadReminders(); }, [loadReminders]);

  const refresh = () => { loadReminders(); loadSmartCounts(); loadLists(); };

  const handleToggleComplete = async (id: number) => { await reminderApi.toggleComplete(id); refresh(); };
  const handleToggleFlag = async (id: number) => { await reminderApi.toggleFlag(id); refresh(); };

  const handleAdd = async (title: string) => {
    if (selection?.type !== "list") return;
    await reminderApi.create(selection.id as number, { title });
    refresh();
  };

  const handleDelete = async (id: number) => {
    await reminderApi.delete(id);
    setSelectedReminder(null);
    refresh();
  };

  // List CRUD
  const handleCreateList = async (data: { name: string; color: string; icon: string }) => {
    await listApi.create(data);
    setShowListModal(false);
    loadLists();
  };

  const handleUpdateList = async (data: { name: string; color: string; icon: string }) => {
    if (!editingList) return;
    await listApi.update(editingList.id, data);
    setEditingList(null);
    setShowListModal(false);
    loadLists();
  };

  const handleDeleteList = async (list: ReminderList) => {
    if (!confirm(`"${list.name}" 리스트와 포함된 리마인더가 모두 삭제됩니다.`)) return;
    await listApi.delete(list.id);
    if (selection?.type === "list" && selection.id === list.id) {
      setSelection(null);
      setReminders([]);
    }
    loadLists();
    loadSmartCounts();
  };

  // Search
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
      <Sidebar
        lists={lists}
        smartCounts={smartCounts}
        selection={selection}
        onSelectSmart={(type) => {
          setSearchMode(false); setSearchQuery("");
          setSelection({ type: "smart", id: type });
          setSelectedReminder(null);
        }}
        onSelectList={(id) => {
          setSearchMode(false); setSearchQuery("");
          setSelection({ type: "list", id });
          setSelectedReminder(null);
        }}
        onAddListClick={() => { setEditingList(null); setShowListModal(true); }}
        onContextMenu={(e, list) => setContextMenu({ x: e.clientX, y: e.clientY, list })}
        onSearch={handleSearch}
        onSearchClear={handleSearchClear}
        onListReorder={async (ids) => { await listApi.reorder(ids); loadLists(); }}
      />

      <main className="flex flex-1 overflow-hidden" style={{ backgroundColor: "var(--content-bg)" }}>
        {selection || searchMode ? (
          <>
            <div className="flex-1 overflow-hidden">
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
                onReorder={async (ids) => { await reminderApi.reorder(ids); refresh(); }}
              />
            </div>
            {selectedReminder && (
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
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p style={{ color: "var(--text-secondary)" }}>리스트를 선택하세요</p>
          </div>
        )}
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
    </div>
  );
}
