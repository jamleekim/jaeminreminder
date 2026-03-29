"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface InlineAddProps {
  listColor: string;
  onAdd: (title: string) => void;
}

export default function InlineAdd({ listColor, onAdd }: InlineAddProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed) {
      onAdd(trimmed);
      setTitle("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setTitle("");
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 px-4 py-3 text-sm font-medium"
        style={{ color: listColor }}
      >
        <Plus size={18} />
        새로운 리마인더
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2"
        style={{ borderColor: listColor }}
      />
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          handleSubmit();
          setIsEditing(false);
        }}
        placeholder="새로운 리마인더"
        className="flex-1 bg-transparent text-sm outline-none"
        style={{ color: "var(--text-primary)" }}
      />
    </div>
  );
}
