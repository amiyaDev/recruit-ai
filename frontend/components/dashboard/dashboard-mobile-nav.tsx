"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS } from "@/constants/dashboard-nav";

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-background/95 backdrop-blur-lg border-t border-border px-1 py-1.5 pb-[calc(env(safe-area-inset-bottom)+0.375rem)] shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      {DASHBOARD_NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={cn(
              "flex flex-col items-center justify-center p-2.5 rounded-lg transition-colors",
              active ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
