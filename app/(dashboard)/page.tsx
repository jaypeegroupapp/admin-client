import { Home } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Today's Bookings", value: 12 },
    { label: "Active Clients", value: 84 },
    { label: "Staff on Duty", value: 6 },
    { label: "Pending Services", value: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-center">
        <Home /> <h1 className="text-xl font-semibold">Dashboard Overview</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-border rounded-xl p-4 shadow-sm text-center"
          >
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-lg font-bold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
