"use client";

import { Menu } from "lucide-react";

interface MobileHeaderProps {
  title: string;
  titleColor: string;
  onMenuToggle: () => void;
}

export default function MobileHeader({ title, titleColor, onMenuToggle }: MobileHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b px-4 py-3 lg:hidden" style={{ borderColor: "var(--separator)" }}>
      <button onClick={onMenuToggle} className="p-1">
        <Menu size={22} style={{ color: "var(--color-blue)" }} />
      </button>
      <h1 className="text-lg font-bold" style={{ color: titleColor }}>
        {title}
      </h1>
    </div>
  );
}
