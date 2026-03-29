import { DragEndEvent } from "@dnd-kit/core";

export function useSortableReorder<T extends { id: number }>(
  items: T[],
  onReorder: (ids: number[]) => void,
) {
  return (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = [...items];
    const [moved] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, moved);
    onReorder(newOrder.map((item) => item.id));
  };
}
