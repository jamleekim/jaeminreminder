"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Reminder } from "@/types";
import ReminderRow from "./ReminderRow";

interface SortableReminderRowProps {
  reminder: Reminder;
  listColor: string;
  onToggleComplete: (id: number) => void;
  onClick: (reminder: Reminder) => void;
}

export default function SortableReminderRow({ reminder, listColor, onToggleComplete, onClick }: SortableReminderRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: reminder.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.15)" : undefined,
    zIndex: isDragging ? 50 : undefined,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ReminderRow
        reminder={reminder}
        listColor={listColor}
        onToggleComplete={onToggleComplete}
        onClick={onClick}
      />
    </div>
  );
}
