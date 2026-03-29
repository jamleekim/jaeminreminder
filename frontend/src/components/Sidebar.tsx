"use client";

import { ReminderList, Selection, SmartListType } from "@/types";
import SmartListGrid from "./SmartListGrid";
import MyLists from "./MyLists";

interface SidebarProps {
  lists: ReminderList[];
  smartCounts: Record<SmartListType, number>;
  selection: Selection | null;
  onSelectSmart: (type: SmartListType) => void;
  onSelectList: (listId: number) => void;
  onAddListClick: () => void;
}

export default function Sidebar({
  lists,
  smartCounts,
  selection,
  onSelectSmart,
  onSelectList,
  onAddListClick,
}: SidebarProps) {
  return (
    <aside
      className="flex h-full w-[280px] flex-shrink-0 flex-col overflow-hidden border-r"
      style={{ backgroundColor: "var(--sidebar-bg)", borderColor: "var(--separator)" }}
    >
      <SmartListGrid counts={smartCounts} selection={selection} onSelect={onSelectSmart} />
      <MyLists
        lists={lists}
        selection={selection}
        onSelect={onSelectList}
        onAddClick={onAddListClick}
      />
    </aside>
  );
}
