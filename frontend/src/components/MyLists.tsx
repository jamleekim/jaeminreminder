"use client";

import { ReminderList, Selection } from "@/types";
import { Plus } from "lucide-react";

interface MyListsProps {
  lists: ReminderList[];
  selection: Selection | null;
  onSelect: (listId: number) => void;
  onAddClick: () => void;
}

export default function MyLists({ lists, selection, onSelect, onAddClick }: MyListsProps) {
  return (
    <div className="flex flex-1 flex-col px-3">
      <p className="mb-1 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
        내 리스트
      </p>
      <div className="flex-1 overflow-y-auto">
        {lists.map((list) => {
          const isSelected = selection?.type === "list" && selection.id === list.id;
          return (
            <button
              key={list.id}
              onClick={() => onSelect(list.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
                isSelected ? "bg-[var(--separator)]" : "hover:bg-[var(--separator)]/50"
              }`}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
                style={{ backgroundColor: list.color }}
              >
                {list.icon ? "●" : "●"}
              </span>
              <span className="flex-1 text-sm" style={{ color: "var(--text-primary)" }}>
                {list.name}
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 px-2 py-3 text-sm font-medium"
        style={{ color: "var(--color-blue)" }}
      >
        <Plus size={18} />
        리스트 추가
      </button>
    </div>
  );
}
