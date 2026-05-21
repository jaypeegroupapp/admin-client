"use client";

interface FinancialFieldsToggleProps {
  show: boolean;
  onToggle: (show: boolean) => void;
}

export function FinancialFieldsToggle({
  show,
  onToggle,
}: FinancialFieldsToggleProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        id="showFinancialFields"
        checked={show}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-4 h-4"
      />
      <label
        htmlFor="showFinancialFields"
        className="text-sm font-medium text-gray-700"
      >
        Add Purchase & Financial Details
      </label>
    </div>
  );
}
