"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { DASHBOARD_NAV_ITEMS } from "@/constants/dashboard-nav";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 bg-sidebar border-r border-sidebar-border py-stack-lg">
      <Link href="/dashboard" className="flex items-center gap-3 px-container-margin mb-stack-lg group">
        <BrandLogo className="w-9 h-9 shrink-0 transition-transform group-hover:scale-105" />
        <div className="min-w-0">
          <h1 className="font-headline-md text-lg font-extrabold text-sidebar-foreground leading-none truncate">
            RecruitAI
          </h1>
          <p className="font-label-sm text-[10px] text-muted-foreground tracking-widest uppercase mt-1">
            AI Talent Suite
          </p>
        </div>
      </Link>

      <nav className="flex-1 flex flex-col gap-1 px-stack-sm overflow-y-auto">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg font-body-md text-sm transition-all duration-200",
                active
                  ? "bg-primary/10 text-primary border-r-4 border-primary font-semibold"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1"
              )}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-stack-md mt-stack-md">
        <button
          type="button"
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-warning to-tertiary-fixed-dim text-warning-foreground font-label-sm text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(217,119,6,0.3)] hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          Upgrade to Pro
        </button>
      </div>

      <div className="flex flex-col gap-1 px-stack-sm pt-stack-md mt-stack-sm border-t border-sidebar-border">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors",
            pathname === "/settings"
              ? "text-primary bg-primary/10 font-semibold"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          Settings
        </Link>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          Support
        </a>
        <LogoutButton variant="sidebar" />
      </div>
    </aside>
  );
}
