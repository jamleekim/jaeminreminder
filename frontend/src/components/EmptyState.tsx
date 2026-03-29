"use client";

import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "리마인더 없음" }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
      <Inbox size={48} style={{ color: "var(--text-secondary)" }} strokeWidth={1} />
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {message}
      </p>
    </div>
  );
}
