"use client";

import { ReminderList, Selection, SmartListType } from "@/types";
import SmartListGrid from "./SmartListGrid";
import MyLists from "./MyLists";
import SearchBar from "./SearchBar";

interface SidebarProps {
  lists: ReminderList[];
  smartCounts: Record<SmartListType, number>;
  selection: Selection | null;
  onSelectSmart: (type: SmartListType) => void;
  onSelectList: (listId: number) => void;
  onAddListClick: () => void;
  onContextMenu: (e: React.MouseEvent, list: ReminderList) => void;
  onSearch: (query: string) => void;
  onSearchClear: () => void;
  onListReorder: (ids: number[]) => void;
}

export default function Sidebar({
  lists,
  smartCounts,
  selection,
  onSelectSmart,
  onSelectList,
  onAddListClick,
  onContextMenu,
  onSearch,
  onSearchClear,
  onListReorder,
}: SidebarProps) {
  return (
    <aside
      className="flex h-full w-[280px] flex-shrink-0 flex-col overflow-hidden border-r"
      style={{ backgroundColor: "var(--sidebar-bg)", borderColor: "var(--separator)" }}
    >
      <SearchBar onSearch={onSearch} onClear={onSearchClear} />
      <SmartListGrid counts={smartCounts} selection={selection} onSelect={onSelectSmart} />
      <MyLists
        lists={lists}
        selection={selection}
        onSelect={onSelectList}
        onAddClick={onAddListClick}
        onContextMenu={onContextMenu}
        onReorder={onListReorder}
      />
    </aside>
  );
}
