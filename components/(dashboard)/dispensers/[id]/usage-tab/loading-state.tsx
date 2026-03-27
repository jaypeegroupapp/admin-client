// src/components/(dashboard)/dispensers/[id]/usage-loading-state.tsx
"use client";

export function UsageLoadingState() {
  return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
