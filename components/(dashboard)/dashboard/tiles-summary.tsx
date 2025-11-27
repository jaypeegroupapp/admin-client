import {
  Building2,
  DollarSign,
  Package,
  PackageCheck,
  Truck,
  Users,
} from "lucide-react";

export default function TilesSummary({ data }: { data: any }) {
  const tiles = [
    { icon: Building2, label: "Companies", value: data.totalCompanies },
    { icon: Truck, label: "Active Trucks", value: data.totalTrucks },
    { icon: Package, label: "Published Products", value: data.totalProducts },
    {
      icon: PackageCheck,
      label: "Orders This Month",
      value: data.ordersThisMonth,
    },
    {
      icon: DollarSign,
      label: "Revenue This Month",
      value: `R ${data.revenueThisMonth}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-y-4 gap-x-2">
      {tiles.map((tile, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 px-3 py-3 md:px-4 rounded-xl shadow-md bg-white border"
        >
          <div className="p-2 md:p-3 rounded-xl bg-black flex items-center justify-center text-white">
            <tile.icon className="w-5 h-5" />
          </div>{" "}
          <div className="flex flex-col">
            <span className="text-gray-600 text-sm">{tile.label}</span>
            <span className="text-xl font-bold">{tile.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
