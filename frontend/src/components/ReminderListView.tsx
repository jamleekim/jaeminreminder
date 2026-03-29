"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Reminder } from "@/types";
import { useSortableReorder } from "@/lib/useSortableList";
import SortableReminderRow from "./SortableReminderRow";
import EmptyState from "./EmptyState";
import InlineAdd from "./InlineAdd";

interface ReminderListViewProps {
  title: string;
  titleColor: string;
  reminders: Reminder[];
  listColor: string;
  showInlineAdd: boolean;
  onToggleComplete: (id: number) => void;
  onToggleFlag: (id: number) => void;
  onReminderClick: (reminder: Reminder) => void;
  onAdd: (title: string) => void;
  onReorder: (ids: number[]) => void;
}

export default function ReminderListView({
  title,
  titleColor,
  reminders,
  listColor,
  showInlineAdd,
  onToggleComplete,
  onToggleFlag,
  onReminderClick,
  onAdd,
  onReorder,
}: ReminderListViewProps) {
  const handleDragEnd = useSortableReorder(reminders, onReorder);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-3xl font-bold" style={{ color: titleColor }}>
          {title}
        </h1>
      </div>

      {reminders.length === 0 && !showInlineAdd ? (
        <EmptyState />
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={reminders.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            <div className="flex-1">
              {reminders.map((reminder) => (
                <SortableReminderRow
                  key={reminder.id}
                  reminder={reminder}
                  listColor={listColor}
                  onToggleComplete={onToggleComplete}
                  onClick={onReminderClick}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {showInlineAdd && <InlineAdd listColor={listColor} onAdd={onAdd} />}
    </div>
  );
}
