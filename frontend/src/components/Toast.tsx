"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (exiting) {
      const timer = setTimeout(onClose, 300);
      return () => clearTimeout(timer);
    }
  }, [exiting, onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        className={`rounded-xl px-4 py-2.5 text-sm text-white shadow-lg ${exiting ? "toast-exit" : "toast-enter"}`}
        style={{ backgroundColor: "rgba(60,60,67,0.9)" }}
      >
        {message}
      </div>
    </div>
  );
}
