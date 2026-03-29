"use client";

export function ReminderSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="skeleton h-5 w-5 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}

export function ReminderListSkeleton() {
  return (
    <div>
      <div className="px-4 pt-6 pb-4">
        <div className="skeleton h-8 w-32" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <ReminderSkeleton key={i} />
      ))}
    </div>
  );
}
