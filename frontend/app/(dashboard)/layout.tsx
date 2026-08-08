import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <DashboardTopbar />
        <main className="flex-1 w-full max-w-7xl mx-auto p-container-margin md:p-section-gap pb-28 md:pb-section-gap">
          {children}
        </main>
      </div>
      <DashboardMobileNav />
    </div>
  );
}
