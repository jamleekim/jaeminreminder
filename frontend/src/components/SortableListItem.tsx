"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReminderList, Selection } from "@/types";

interface SortableListItemProps {
  list: ReminderList;
  selection: Selection | null;
  onSelect: (listId: number) => void;
  onContextMenu: (e: React.MouseEvent, list: ReminderList) => void;
}

export default function SortableListItem({ list, selection, onSelect, onContextMenu }: SortableListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: list.id,
  });

  const isSelected = selection?.type === "list" && selection.id === list.id;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        onClick={() => onSelect(list.id)}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, list); }}
        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
          isSelected ? "bg-[var(--separator)]" : "hover:bg-[var(--separator)]/50"
        }`}
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
          style={{ backgroundColor: list.color }}
        >
          ●
        </span>
        <span className="flex-1 text-sm" style={{ color: "var(--text-primary)" }}>
          {list.name}
        </span>
      </button>
    </div>
  );
}
