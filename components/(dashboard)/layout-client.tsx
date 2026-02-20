"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Menu } from "lucide-react";
import { PagePermission } from "@/constants";
import { ICONS } from "@/constants/dashboard";
import Image from "next/image";

export default function DashboardLayoutClient({
  children,
  allowedPages,
}: {
  children: React.ReactNode;
  allowedPages: PagePermission[];
}) {
  const pathname = usePathname();
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const mainNav = allowedPages.filter((p) => p.section === "main");
  const otherNav = allowedPages.filter((p) => p.section === "other");

  return (
    <div className="flex min-h-screen bg-background text-text relative overflow-x-hidden">
      {/* Sidebar */}
      <aside
        className={clsx(
          "hidden md:flex flex-col fixed top-0 left-0 h-full bg-sidebar border-r border-border shadow-sidebar z-40 transition-all duration-300",
          sidebarHovered ? "w-56" : "w-16",
        )}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-border relative">
          <div className={clsx("relative transition-all duration-300 w-32")}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={128}
              height={40}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </div>

        <nav className="flex-1 mt-4 space-y-1">
          {mainNav.map((item) => {
            const Icon = ICONS[item.icon];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-active font-medium"
                    : "hover:bg-hover",
                )}
              >
                <Icon size={20} className="text-text shrink-0" />
                <span
                  className={clsx(
                    "transition-opacity duration-200 text-sm whitespace-nowrap",
                    sidebarHovered ? "opacity-100" : "opacity-0",
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          {otherNav.length > 0 && (
            <div className="space-y-1">
              {otherNav.map((item) => {
                const Icon = ICONS[item.icon];

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-active font-medium"
                        : "hover:bg-hover",
                    )}
                  >
                    <Icon size={20} className="text-text shrink-0" />
                    <span
                      className={clsx(
                        "transition-opacity duration-200 text-sm whitespace-nowrap",
                        sidebarHovered ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarHovered && (
        <div
          className="hidden md:block fixed inset-0 bg-black/10 z-30"
          onMouseEnter={() => setSidebarHovered(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 md:ml-20 p-4">{children}</main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        {mainNav.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center text-xs transition-colors",
                isActive
                  ? "text-gray-800 font-semibold"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <Icon size={22} strokeWidth={1.8} />
              <span className="mt-1">{item.name}</span>
            </Link>
          );
        })}

        <Link href="/menu" className="flex flex-col items-center text-xs">
          <Menu size={22} />
          <span className="mt-1">Menu</span>
        </Link>
      </nav>
    </div>
  );
}
