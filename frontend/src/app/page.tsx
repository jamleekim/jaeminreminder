"use client";

import { ReminderProvider, useReminders } from "@/lib/ReminderContext";
import { SmartListType } from "@/types";
import Sidebar from "@/components/Sidebar";
import ReminderListView from "@/components/ReminderListView";
import DetailPanel from "@/components/DetailPanel";
import ListModal from "@/components/ListModal";
import ContextMenu from "@/components/ContextMenu";
import Toast from "@/components/Toast";
import MobileHeader from "@/components/MobileHeader";
import { ReminderListSkeleton } from "@/components/Skeleton";
import { useState } from "react";
import { ReminderList } from "@/types";

const SMART_LIST_META: Record<SmartListType, { title: string; color: string }> = {
  today: { title: "오늘", color: "#007AFF" },
  scheduled: { title: "예정", color: "#FF3B30" },
  all: { title: "전체", color: "#5856D6" },
  flagged: { title: "깃발 표시", color: "#FF9500" },
  completed: { title: "완료됨", color: "#8E8E93" },
};

function HomeContent() {
  const ctx = useReminders();
  const {
    lists, reminders, selection, selectedReminder, smartCounts, loading,
    searchMode, searchQuery, toast, sidebarOpen, showListModal, editingList,
    setSelection, setSelectedReminder, setSidebarOpen, setShowListModal, setEditingList,
    clearToast, handleSearch, handleSearchClear, handleToggleComplete, handleToggleFlag,
    handleAdd, handleDelete, handleCreateList, handleUpdateList, handleDeleteList,
    handleListReorder, handleReminderReorder,
  } = ctx;

  const [contextMenu, setContextMenu] = useState<{
    x: number; y: number; list: ReminderList;
  } | null>(null);

  const selectSmart = (type: SmartListType) => {
    handleSearchClear();
    setSelection({ type: "smart", id: type });
    setSelectedReminder(null);
    setSidebarOpen(false);
  };

  const selectList = (id: number) => {
    handleSearchClear();
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
    if (searchMode || !selection) return "var(--text-primary)";
    if (selection.type === "smart") return SMART_LIST_META[selection.id as SmartListType].color;
    return lists.find((l) => l.id === selection.id)?.color ?? "var(--text-primary)";
  };

  const getListColor = (): string => {
    if (searchMode || !selection) return "#007AFF";
    if (selection.type === "smart") return SMART_LIST_META[selection.id as SmartListType].color;
    return lists.find((l) => l.id === selection.id)?.color ?? "#007AFF";
  };

  return (
    <div className="flex h-full">
      <div className={`max-lg:fixed max-lg:inset-0 max-lg:z-40 ${sidebarOpen ? "max-lg:block" : "max-lg:hidden"} lg:block`}>
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <div className="relative z-10 h-full">
          <Sidebar
            lists={lists} smartCounts={smartCounts} selection={selection}
            onSelectSmart={selectSmart} onSelectList={selectList}
            onAddListClick={() => { setEditingList(null); setShowListModal(true); }}
            onContextMenu={(e, list) => setContextMenu({ x: e.clientX, y: e.clientY, list })}
            onSearch={handleSearch} onSearchClear={handleSearchClear}
            onListReorder={handleListReorder}
          />
        </div>
      </div>

      <main className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: "var(--content-bg)" }}>
        <MobileHeader title={getTitle()} titleColor={getTitleColor()} onMenuToggle={() => setSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          {loading ? (
            <div className="flex-1"><ReminderListSkeleton /></div>
          ) : selection || searchMode ? (
            <>
              <div className="flex-1 overflow-hidden animate-fade-in">
                <ReminderListView
                  title={getTitle()} titleColor={getTitleColor()} reminders={reminders}
                  listColor={getListColor()} showInlineAdd={selection?.type === "list" && !searchMode}
                  onToggleComplete={handleToggleComplete} onToggleFlag={handleToggleFlag}
                  onReminderClick={(r) => setSelectedReminder(r)} onAdd={handleAdd}
                  onReorder={handleReminderReorder}
                />
              </div>
              {selectedReminder && (
                <div className="max-md:fixed max-md:inset-0 max-md:z-30 max-md:flex max-md:items-end md:block">
                  <div className="fixed inset-0 bg-black/30 md:hidden" onClick={() => setSelectedReminder(null)} />
                  <div className="relative z-10 max-md:w-full max-md:max-h-[80vh] max-md:rounded-t-2xl max-md:overflow-hidden">
                    <DetailPanel
                      reminder={selectedReminder} lists={lists}
                      onUpdate={async () => {
                        await ctx.refresh();
                        const data = await (await fetch(`/api/lists/${selectedReminder.listId}/reminders`)).json();
                        const updated = data.find((r: { id: number }) => r.id === selectedReminder.id);
                        if (updated) setSelectedReminder(updated);
                      }}
                      onDelete={handleDelete} onClose={() => setSelectedReminder(null)}
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

      {showListModal && (
        <ListModal editingList={editingList}
          onSave={editingList ? handleUpdateList : handleCreateList}
          onCancel={() => { setShowListModal(false); setEditingList(null); }}
        />
      )}

      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y}
          items={[
            { label: "편집", onClick: () => { setEditingList(contextMenu.list); setShowListModal(true); } },
            { label: "삭제", onClick: () => handleDeleteList(contextMenu.list), danger: true },
          ]}
          onClose={() => setContextMenu(null)}
        />
      )}

      {toast && <Toast message={toast} onClose={clearToast} />}
    </div>
  );
}

export default function Home() {
  return (
    <ReminderProvider>
      <HomeContent />
    </ReminderProvider>
  );
}
