"use client";

import { PAGE_PERMISSIONS } from "@/constants";
import { canClient } from "@/lib/rbac";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Menu } from "lucide-react";
import { PagePermission } from "@/constants";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [allowedPages, setAllowedPages] = useState(PAGE_PERMISSIONS);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  useEffect(() => {
    async function load() {
      const filtered = [];

      for (const page of PAGE_PERMISSIONS) {
        if (await canClient(page.action, page.resource)) {
          filtered.push(page);
        }
      }

      setAllowedPages(filtered);
    }

    load();
  }, []);

  const mainNav = allowedPages.filter((p) => p.section === "main");
  const otherNav = allowedPages.filter((p) => p.section === "other");

  return (
    <div className="flex min-h-screen bg-background text-text relative overflow-x-hidden">
      {/* Sidebar (Desktop only) */}
      <aside
        className={clsx(
          "hidden md:flex flex-col fixed top-0 left-0 h-full bg-sidebar border-r border-border shadow-sidebar z-40 transition-all duration-300 ease-in-out",
          sidebarHovered ? "w-56" : "w-16"
        )}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-border">
          <span className="font-bold text-lg text-text">S</span>
        </div>
        {/* Nav Links */}
        <nav className="flex-1 mt-4  relative">
          <div className="space-y-1">
            {mainNav.map((item: PagePermission) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-active font-medium"
                    : "hover:bg-hover"
                )}
              >
                <item.icon size={20} className="text-text shrink-0" />
                <span
                  className={clsx(
                    "transition-opacity duration-200 text-sm whitespace-nowrap",
                    sidebarHovered ? "opacity-100" : "opacity-0"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="space-y-1 hidden md:block">
            {otherNav.map((item: PagePermission) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-active font-medium"
                    : "hover:bg-hover"
                )}
              >
                <item.icon size={20} className="text-text shrink-0" />
                <span
                  className={clsx(
                    "transition-opacity duration-200 text-sm whitespace-nowrap",
                    sidebarHovered ? "opacity-100" : "opacity-0"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Overlay behind sidebar when expanded */}
      {sidebarHovered && (
        <div
          className="hidden md:block fixed inset-0 bg-black/10 z-30 transition-opacity duration-300"
          onMouseEnter={() => setSidebarHovered(false)}
        />
      )}
      {/* Main */}
      <main className="flex-1 md:ml-20 p-4">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-sm flex justify-around py-2 z-30">
        {mainNav.map((item: PagePermission) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center text-xs transition-colors",
                isActive
                  ? "text-gray-800 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <item.icon size={22} strokeWidth={1.8} />
              <span className="mt-1">{item.name}</span>
            </Link>
          );
        })}
        <Link
          href="/menu"
          className={clsx(
            "flex flex-col items-center text-xs transition-colors",
            pathname === "/menu"
              ? "text-gray-800 font-semibold"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Menu size={22} strokeWidth={1.8} />
          <span className="mt-1">Menu</span>
        </Link>
      </nav>
    </div>
  );
}
