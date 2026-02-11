"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardPage } from "@/components/dashboard-page"
import { EditorPage } from "@/components/editor-page"
import { LibraryPage } from "@/components/library-page"
import { ApprovalsPage } from "@/components/approvals-page"
import { SettingsPage } from "@/components/settings-page"
import { PreviewPage } from "@/components/preview-page"
import { LibraryProvider } from "@/lib/library-context"
import { DocumentProvider } from "@/lib/document-context"
import { Toaster } from "@/components/ui/toaster"

type Page = "dashboard" | "editor" | "library" | "approvals" | "settings" | "preview"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleOpenDocument = () => {
    setCurrentPage("editor")
  }

  const handleOpenPreview = () => {
    setCurrentPage("preview")
  }

  const handleBackFromPreview = () => {
    setCurrentPage("editor")
  }

  const handleNavigateToEditor = () => {
    setCurrentPage("editor")
  }

  return (
    <DocumentProvider>
      <LibraryProvider>
        {currentPage === "preview" ? (
          <div className="flex h-screen overflow-hidden bg-background">
            <PreviewPage onBack={handleBackFromPreview} />
          </div>
        ) : (
          <div className="flex h-screen overflow-hidden bg-background">
            <AppSidebar
              currentPage={currentPage}
              onNavigate={(page) => setCurrentPage(page as Page)}
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <main className="flex flex-1 overflow-hidden">
              {currentPage === "dashboard" && <DashboardPage onOpenDocument={handleOpenDocument} />}
              {currentPage === "editor" && <EditorPage onOpenPreview={handleOpenPreview} />}
              {currentPage === "library" && <LibraryPage onNavigateToEditor={handleNavigateToEditor} />}
              {currentPage === "approvals" && <ApprovalsPage />}
              {currentPage === "settings" && <SettingsPage />}
            </main>
          </div>
        )}
        <Toaster />
      </LibraryProvider>
    </DocumentProvider>
  )
}
