"use client";

import { useEffect, useRef } from "react";

interface MenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[160px] rounded-xl py-1 shadow-xl"
      style={{ left: x, top: y, backgroundColor: "var(--card-bg)" }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => { item.onClick(); onClose(); }}
          className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--separator)]/50 ${
            item.danger ? "text-red-500" : ""
          }`}
          style={item.danger ? {} : { color: "var(--text-primary)" }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
