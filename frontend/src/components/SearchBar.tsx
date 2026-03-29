"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

export default function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim()) {
      debounceRef.current = setTimeout(() => onSearch(query.trim()), 300);
    } else {
      onClear();
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, onSearch, onClear]);

  return (
    <div className="relative px-3 pt-3 pb-1">
      <Search
        size={14}
        className="absolute left-5 top-1/2 -translate-y-1/2"
        style={{ color: "var(--text-secondary)" }}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색"
        className="w-full rounded-lg py-1.5 pl-7 pr-7 text-sm outline-none"
        style={{
          backgroundColor: "var(--separator)",
          color: "var(--text-primary)",
        }}
      />
      {query && (
        <button
          onClick={() => { setQuery(""); onClear(); }}
          className="absolute right-5 top-1/2 -translate-y-1/2"
        >
          <X size={14} style={{ color: "var(--text-secondary)" }} />
        </button>
      )}
    </div>
  );
}
