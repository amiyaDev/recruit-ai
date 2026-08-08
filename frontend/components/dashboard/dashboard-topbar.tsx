"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { MOCK_USER } from "@/constants/dashboard-mock-data";

export function DashboardTopbar() {
  const initials = MOCK_USER.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-end gap-2 px-container-margin border-b border-border bg-background/80 backdrop-blur-md">
      <ThemeToggle />
      <Link
        href="/settings"
        className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-muted transition-colors"
      >
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {initials}
        </span>
        <span className="hidden sm:block text-sm font-medium text-foreground">{MOCK_USER.name}</span>
      </Link>
      <LogoutButton variant="icon" />
    </header>
  );
}
