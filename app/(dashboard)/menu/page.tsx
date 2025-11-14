"use client";

import Link from "next/link";
import {
  Scissors,
  Users,
  User,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    name: "Services",
    icon: Scissors,
    href: "/services",
  },
  {
    name: "Staff",
    icon: Users,
    href: "/staff",
  },
  {
    name: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    name: "Logout",
    icon: LogOut,
    href: "/logout",
  },
];

export default function MenuPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white ">
        <h1 className="text-lg font-semibold text-gray-800">Menu</h1>
        <div className="w-6" />
      </div>

      {/* Menu List */}
      <div className="space-y-2 divide-y">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center justify-between py-4 bg-white hover:bg-gray-100 mb-0"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-gray-700" />
              <span className="text-gray-800 font-medium">{item.name}</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
          </Link>
        ))}
      </div>
    </div>
  );
}
