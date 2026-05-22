"use client";

import { useState } from "react";
import { RestockHistoryItem } from "./item";
import { EmptyRestockState } from "./empty";

interface RestockHistoryListProps {
  records: any[];
  onRefresh: () => void;
}

export function RestockHistoryList({
  records,
  onRefresh,
}: RestockHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (records.length === 0) {
    return <EmptyRestockState />;
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <RestockHistoryItem
          key={record.id}
          record={record}
          isExpanded={expandedId === record.id}
          onToggle={() =>
            setExpandedId(expandedId === record.id ? null : record.id)
          }
        />
      ))}
    </div>
  );
}
