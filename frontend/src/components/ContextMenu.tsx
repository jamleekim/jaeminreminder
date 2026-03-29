"use client";

import { useEffect, useRef, useState } from "react";

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
  const [pos, setPos] = useState({ left: x, top: y });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // 뷰포트 경계 보정
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    let left = x;
    let top = y;
    if (left + rect.width > window.innerWidth) left = window.innerWidth - rect.width - 8;
    if (top + rect.height > window.innerHeight) top = window.innerHeight - rect.height - 8;
    if (left < 0) left = 8;
    if (top < 0) top = 8;
    setPos({ left, top });
  }, [x, y]);

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[160px] rounded-xl py-1 shadow-xl animate-scale-in"
      style={{ left: pos.left, top: pos.top, backgroundColor: "var(--card-bg)" }}
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
