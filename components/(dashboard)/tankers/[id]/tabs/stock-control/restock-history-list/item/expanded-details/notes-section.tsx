"use client";

interface NotesSectionProps {
  record: any;
}

export function NotesSection({ record }: NotesSectionProps) {
  return (
    <div className="md:col-span-2">
      {record.notes && (
        <p className="text-sm text-gray-600 bg-white p-2 rounded">
          <span className="font-medium">Notes:</span> {record.notes}
        </p>
      )}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>
          Recorded: {new Date(record.createdAt).toLocaleString("en-ZA")}
        </span>
        {record.restockDate && (
          <span>
            Restock Date:{" "}
            {new Date(record.restockDate).toLocaleDateString("en-ZA")}
          </span>
        )}
      </div>
    </div>
  );
}
