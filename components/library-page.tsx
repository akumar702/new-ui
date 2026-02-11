"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Type,
  CheckSquare,
  CircleDot,
  Table2,
  HelpCircle,
  MousePointer2,
  LayoutGrid,
  List,
  ImageIcon,
  ChevronDown,
  MessageSquare,
  Trash2,
  ArrowRight,
  Calendar,
} from "lucide-react"
import { useLibrary } from "@/lib/library-context"
import { useToast } from "@/hooks/use-toast"
import type { BlockType } from "@/lib/store"
import { cn } from "@/lib/utils"

const typeIcons: Record<BlockType, React.ElementType> = {
  paragraph: Type,
  heading: Type,
  image: ImageIcon,
  button: MousePointer2,
  radio: CircleDot,
  checkbox: CheckSquare,
  dropdown: ChevronDown,
  table: Table2,
  quiz: HelpCircle,
  dialog: MessageSquare,
}

interface LibraryPageProps {
  onNavigateToEditor: () => void
}

export function LibraryPage({ onNavigateToEditor }: LibraryPageProps) {
  const { components, removeFromLibrary, setPendingInsert } = useLibrary()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = components.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUseComponent = (comp: typeof components[0]) => {
    setPendingInsert(comp)
    toast({
      title: "Component Ready to Insert",
      description: `"${comp.name}" will be inserted into the currently selected section. Navigating to editor...`,
    })
    // Navigate to the editor after a brief moment
    setTimeout(() => {
      onNavigateToEditor()
    }, 600)
  }

  const handleRemove = (id: string, name: string) => {
    removeFromLibrary(id)
    toast({
      title: "Removed from Library",
      description: `"${name}" has been removed from the Component Library.`,
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Component Library</h1>
          <p className="text-sm text-muted-foreground">
            Reusable blocks saved from your documents ({components.length} components)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-border bg-background">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center justify-center rounded-l-md px-2.5 py-1.5 transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center justify-center rounded-r-md px-2.5 py-1.5 transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search components by name or type..."
            className="h-10 border-border bg-card pl-9 text-foreground placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mb-1 text-sm font-medium text-foreground">No components found</p>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? "Try a different search term"
                : "Save blocks from the editor to build your library"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((comp) => {
              const Icon = typeIcons[comp.type] || Type
              return (
                <Card key={comp.id} className="group border-border bg-card transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-muted text-muted-foreground capitalize text-[10px]">
                          {comp.type}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="mb-1.5 text-sm font-semibold text-foreground">{comp.name}</h3>
                    <p className="mb-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed">{comp.preview}</p>
                    <div className="mb-4 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Saved {comp.savedAt}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 bg-primary text-primary-foreground text-xs hover:bg-primary/90 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleUseComponent(comp)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Use in Document
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleRemove(comp.id, comp.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove from library</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="overflow-hidden border-border bg-card">
            <div className="divide-y divide-border">
              {filtered.map((comp) => {
                const Icon = typeIcons[comp.type] || Type
                return (
                  <div
                    key={comp.id}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-foreground">{comp.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{comp.preview}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{comp.savedAt}</span>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground capitalize text-[10px]">
                      {comp.type}
                    </Badge>
                    <Button
                      size="sm"
                      className="shrink-0 gap-1.5 bg-primary text-primary-foreground text-xs hover:bg-primary/90"
                      onClick={() => handleUseComponent(comp)}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      Use
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(comp.id, comp.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Remove from library</span>
                    </Button>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* How it works info */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">How the Component Library Works</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Save from Editor</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select any block in the editor and click &ldquo;Save to Component Library&rdquo; in the Properties panel.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Browse & Search</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Find saved components here using search or browse by type. Toggle between grid and list views.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Use in Documents</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click &ldquo;Use in Document&rdquo; to insert a copy of the component into your current editor section.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
