"use client";

import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Reminder } from "@/types";
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
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = reminders.findIndex((r) => r.id === active.id);
    const newIndex = reminders.findIndex((r) => r.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = [...reminders];
    const [moved] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, moved);
    onReorder(newOrder.map((r) => r.id));
  };

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
