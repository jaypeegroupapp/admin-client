"use client";

export default function CompanyCreditTabs({
  active,
  counts,
  onChange,
}: {
  active: string;
  counts: {
    All: number;
    Settled: number;
    Owing: number;
  };
  onChange: (status: string) => void;
}) {
  const tabs = ["all", "settled", "owing"] as const;

  return (
    <div className="w-full lg:w-auto flex gap-2 flex-wrap md:flex-nowrap">
      {tabs.map((tab) => {
        const label = tab.charAt(0).toUpperCase() + tab.slice(1);
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium border transition-all
              ${
                active === tab
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }
            `}
          >
            {label} <b>{counts[label as keyof typeof counts]}</b>
          </button>
        );
      })}
    </div>
  );
}
