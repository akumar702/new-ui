"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  Send,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react"
import { sampleDocuments } from "@/lib/store"
import type { Document } from "@/lib/store"

const statusConfig: Record<
  Document["status"],
  { label: string; className: string; icon: React.ElementType }
> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground", icon: FileText },
  "in-review": {
    label: "In Review",
    className: "bg-warning/15 text-warning",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    className: "bg-success/15 text-success",
    icon: CheckCircle2,
  },
  published: {
    label: "Published",
    className: "bg-primary/10 text-primary",
    icon: Send,
  },
}

interface DashboardPageProps {
  onOpenDocument: () => void
}

export function DashboardPage({ onOpenDocument }: DashboardPageProps) {
  const stats = [
    { label: "Total Documents", value: sampleDocuments.length, icon: FileText },
    {
      label: "In Review",
      value: sampleDocuments.filter((d) => d.status === "in-review").length,
      icon: Clock,
    },
    {
      label: "Approved",
      value: sampleDocuments.filter((d) => d.status === "approved").length,
      icon: CheckCircle2,
    },
    {
      label: "Published",
      value: sampleDocuments.filter((d) => d.status === "published").length,
      icon: Send,
    },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your documents and workflows</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={onOpenDocument} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            <span>New Document</span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border bg-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-base font-semibold text-foreground">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2 border-border bg-card text-foreground hover:bg-muted" onClick={onOpenDocument}>
              <Plus className="h-4 w-4" />
              <span>Create Document</span>
            </Button>
            <Button variant="outline" className="gap-2 border-border bg-card text-foreground hover:bg-muted">
              <ArrowUpRight className="h-4 w-4" />
              <span>Import Template</span>
            </Button>
            <Button variant="outline" className="gap-2 border-border bg-card text-foreground hover:bg-muted">
              <Send className="h-4 w-4" />
              <span>Submit for Review</span>
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-foreground">Recent Documents</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="h-9 border-border bg-card pl-9 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <Card className="overflow-hidden border-border bg-card">
            <div className="divide-y divide-border">
              {sampleDocuments.map((doc) => {
                const statusInfo = statusConfig[doc.status]
                const StatusIcon = statusInfo.icon
                return (
                  <div
                    key={doc.id}
                    role="button"
                    tabIndex={0}
                    onClick={onOpenDocument}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onOpenDocument()
                      }
                    }}
                    className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.author} &middot; Updated {doc.updatedAt}
                      </p>
                    </div>
                    <Badge className={`gap-1.5 ${statusInfo.className} border-0`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
