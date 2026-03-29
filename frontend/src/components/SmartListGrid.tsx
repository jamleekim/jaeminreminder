"use client";

import { Calendar, CalendarDays, Inbox, CheckCircle2, Flag } from "lucide-react";
import SmartListCard from "./SmartListCard";
import { SmartListType, Selection } from "@/types";

interface SmartListGridProps {
  counts: Record<SmartListType, number>;
  selection: Selection | null;
  onSelect: (type: SmartListType) => void;
}

const smartLists: { type: SmartListType; label: string; icon: typeof Calendar; color: string }[] = [
  { type: "today", label: "오늘", icon: Calendar, color: "#007AFF" },
  { type: "scheduled", label: "예정", icon: CalendarDays, color: "#FF3B30" },
  { type: "all", label: "전체", icon: Inbox, color: "#5856D6" },
  { type: "flagged", label: "깃발 표시", icon: Flag, color: "#FF9500" },
  { type: "completed", label: "완료됨", icon: CheckCircle2, color: "#8E8E93" },
];

export default function SmartListGrid({ counts, selection, onSelect }: SmartListGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-3">
      {smartLists.map((item) => (
        <div key={item.type} className={item.type === "completed" ? "col-span-2" : ""}>
          <SmartListCard
            icon={item.icon}
            label={item.label}
            count={counts[item.type]}
            color={item.color}
            selected={selection?.type === "smart" && selection.id === item.type}
            onClick={() => onSelect(item.type)}
          />
        </div>
      ))}
    </div>
  );
}
