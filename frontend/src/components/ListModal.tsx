"use client";

import { useState } from "react";
import { ReminderList } from "@/types";
import { PRESET_COLORS, PRESET_ICONS } from "@/lib/constants";
import { List, Bookmark, ShoppingCart, Briefcase, House, Heart, Star, Flag, Bell, Music, Gift, Gamepad2, Plane, Car, BookOpen, GraduationCap, Dumbbell, UtensilsCrossed, LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  list: List, bookmark: Bookmark, cart: ShoppingCart, briefcase: Briefcase,
  house: House, heart: Heart, star: Star, flag: Flag, bell: Bell, music: Music,
  gift: Gift, gamepad: Gamepad2, plane: Plane, car: Car, book: BookOpen,
  "graduation-cap": GraduationCap, dumbbell: Dumbbell, utensils: UtensilsCrossed,
};

interface ListModalProps {
  editingList?: ReminderList | null;
  onSave: (data: { name: string; color: string; icon: string }) => void;
  onCancel: () => void;
}

export default function ListModal({ editingList, onSave, onCancel }: ListModalProps) {
  const [name, setName] = useState(editingList?.name ?? "");
  const [color, setColor] = useState(editingList?.color ?? PRESET_COLORS[5].value);
  const [icon, setIcon] = useState(editingList?.icon ?? PRESET_ICONS[0]);

  const IconComponent = ICON_MAP[icon] ?? List;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={editingList ? "리스트 편집" : "리스트 추가"}
        className="w-[340px] rounded-2xl p-5 animate-scale-in"
        style={{ backgroundColor: "var(--card-bg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview */}
        <div className="mb-4 flex justify-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: color }}
          >
            <IconComponent size={28} className="text-white" />
          </div>
        </div>

        {/* Name input */}
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="리스트 이름"
          className="mb-4 w-full rounded-lg px-3 py-2 text-center text-sm outline-none"
          style={{ backgroundColor: "var(--sidebar-bg)", color: "var(--text-primary)" }}
        />

        {/* Color palette */}
        <p className="mb-2 text-xs" style={{ color: "var(--text-secondary)" }}>색상</p>
        <div className="mb-4 grid grid-cols-6 gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              aria-label={`색상: ${c.name}`}
              className={`h-7 w-7 rounded-full transition-transform ${color === c.value ? "scale-125 ring-2 ring-offset-1" : ""}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        {/* Icon grid */}
        <p className="mb-2 text-xs" style={{ color: "var(--text-secondary)" }}>아이콘</p>
        <div className="mb-4 grid grid-cols-6 gap-2">
          {PRESET_ICONS.map((iconName) => {
            const IC = ICON_MAP[iconName] ?? List;
            return (
              <button
                key={iconName}
                onClick={() => setIcon(iconName)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  icon === iconName ? "bg-[var(--separator)]" : ""
                }`}
              >
                <IC size={18} style={{ color: "var(--text-secondary)" }} />
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            취소
          </button>
          <button
            onClick={() => name.trim() && onSave({ name: name.trim(), color, icon })}
            disabled={!name.trim()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            style={{ backgroundColor: "var(--color-blue)" }}
          >
            {editingList ? "수정" : "완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
