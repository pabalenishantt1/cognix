"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { DashboardPage as DashboardContent } from "@/components/pages/dashboard";
import { ProposalsPage } from "@/components/pages/proposals";
import { ReportsPage } from "@/components/pages/reports";
import { SettingsPage } from "@/components/pages/settings";
import { Menu, X } from "lucide-react";

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardContent />;
      case "proposals":
        return <ProposalsPage />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex">
            <div className="w-full">
              <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <div className="text-sm font-semibold text-sidebar-foreground">
                  Menu
                </div>
                <button
                  aria-label="Close menu"
                  className="p-2 rounded-md hover:bg-sidebar-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="w-5 h-5 text-sidebar-foreground" />
                </button>
              </div>
              <Sidebar
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  setMobileOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Topbar */}
        <div className="md:hidden sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border flex items-center justify-between p-4">
          <button
            aria-label="Open menu"
            className="p-2 rounded-md border border-border hover:bg-accent"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="text-sm text-muted-foreground">Cognix</div>
        </div>
        {renderPage()}
      </main>
    </div>
  );
}
