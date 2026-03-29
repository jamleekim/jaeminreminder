"use client";

import { LucideIcon } from "lucide-react";

interface SmartListCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  color: string;
  selected: boolean;
  onClick: () => void;
}

export default function SmartListCard({ icon: Icon, label, count, color, selected, onClick }: SmartListCardProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl p-3 text-left transition-all hover:brightness-105 ${
        selected ? "ring-2 ring-offset-1" : ""
      }`}
      style={{
        backgroundColor: `${color}15`,
        ...(selected ? { "--tw-ring-color": color } as React.CSSProperties : {}),
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        >
          <Icon size={16} className="text-white" />
        </div>
        <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {count}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
    </button>
  );
}
