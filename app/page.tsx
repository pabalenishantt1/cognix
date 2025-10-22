"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardPage } from "@/components/pages/dashboard"
import { ProposalsPage } from "@/components/pages/proposals"
import { ReportsPage } from "@/components/pages/reports"
import { SettingsPage } from "@/components/pages/settings"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "proposals":
        return <ProposalsPage />
      case "reports":
        return <ReportsPage />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  )
}
