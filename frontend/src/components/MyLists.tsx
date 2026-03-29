"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ReminderList, Selection } from "@/types";
import { useSortableReorder } from "@/lib/useSortableList";
import { Plus } from "lucide-react";
import SortableListItem from "./SortableListItem";

interface MyListsProps {
  lists: ReminderList[];
  selection: Selection | null;
  onSelect: (listId: number) => void;
  onAddClick: () => void;
  onContextMenu: (e: React.MouseEvent, list: ReminderList) => void;
  onReorder: (ids: number[]) => void;
}

export default function MyLists({ lists, selection, onSelect, onAddClick, onContextMenu, onReorder }: MyListsProps) {
  const handleDragEnd = useSortableReorder(lists, onReorder);

  return (
    <div className="flex flex-1 flex-col px-3">
      <p className="mb-1 text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>
        내 리스트
      </p>
      <div className="flex-1 overflow-y-auto">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={lists.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            {lists.map((list) => (
              <SortableListItem
                key={list.id}
                list={list}
                selection={selection}
                onSelect={onSelect}
                onContextMenu={onContextMenu}
              />
            ))}
          </SortableContext>
        </DndContext>
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
