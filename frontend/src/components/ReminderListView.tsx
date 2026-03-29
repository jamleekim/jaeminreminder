"use client";

import { Reminder } from "@/types";
import ReminderRow from "./ReminderRow";
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
}: ReminderListViewProps) {
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
        <div className="flex-1">
          {reminders.map((reminder) => (
            <ReminderRow
              key={reminder.id}
              reminder={reminder}
              listColor={listColor}
              onToggleComplete={onToggleComplete}
              onClick={onReminderClick}
            />
          ))}
        </div>
      )}

      {showInlineAdd && <InlineAdd listColor={listColor} onAdd={onAdd} />}
    </div>
  );
}
