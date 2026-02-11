"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  FolderOpen,
  Folder,
  FileText,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import type { Chapter, Section } from "@/lib/store"

interface DocumentTreeProps {
  chapters: Chapter[]
  selectedSectionId: string | null
  onSelectSection: (sectionId: string) => void
  onToggleChapter: (chapterId: string) => void
  onToggleSection: (sectionId: string) => void
  onAddChapter: () => void
  onAddSection: (chapterId: string) => void
  onRenameChapter: (chapterId: string, newTitle: string) => void
  onRenameSection: (sectionId: string, newTitle: string) => void
  onDeleteChapter: (chapterId: string) => void
  onDeleteSection: (sectionId: string) => void
}

export function DocumentTree({
  chapters,
  selectedSectionId,
  onSelectSection,
  onToggleChapter,
  onToggleSection,
  onAddChapter,
  onAddSection,
  onRenameChapter,
  onRenameSection,
  onDeleteChapter,
  onDeleteSection,
}: DocumentTreeProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id)
    setEditValue(currentTitle)
  }

  const commitEdit = (id: string, type: "chapter" | "section") => {
    const trimmed = editValue.trim()
    if (trimmed) {
      if (type === "chapter") {
        onRenameChapter(id, trimmed)
      } else {
        onRenameSection(id, trimmed)
      }
    }
    setEditingId(null)
  }

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Document Outline
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={onAddChapter}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only">Add chapter</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="mb-1">
              {/* Chapter */}
              <div className="group flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-muted">
                <button
                  onClick={() => onToggleChapter(chapter.id)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground"
                >
                  {chapter.expanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
                {chapter.expanded ? (
                  <FolderOpen className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Folder className="mr-1.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}

                {editingId === chapter.id ? (
                  <InlineEdit
                    value={editValue}
                    onChange={setEditValue}
                    onCommit={() => commitEdit(chapter.id, "chapter")}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <span
                    className="flex-1 truncate text-sm font-medium text-foreground"
                    onDoubleClick={() => startEditing(chapter.id, chapter.title)}
                  >
                    {chapter.title}
                  </span>
                )}

                {editingId !== chapter.id && (
                  <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                    <button
                      onClick={() => onAddSection(chapter.id)}
                      className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => startEditing(chapter.id, chapter.title)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddSection(chapter.id)}>
                          <Plus className="mr-2 h-3.5 w-3.5" />
                          Add Section
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDeleteChapter(chapter.id)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete Chapter
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {/* Sections */}
              {chapter.expanded && (
                <div className="ml-4 border-l border-border pl-2">
                  {chapter.sections.map((section) => (
                    <SectionItem
                      key={section.id}
                      section={section}
                      depth={0}
                      selectedSectionId={selectedSectionId}
                      onSelectSection={onSelectSection}
                      onToggleSection={onToggleSection}
                      editingId={editingId}
                      editValue={editValue}
                      onEditValueChange={setEditValue}
                      onStartEditing={startEditing}
                      onCommitEdit={(id) => commitEdit(id, "section")}
                      onCancelEdit={() => setEditingId(null)}
                      onRenameSection={onRenameSection}
                      onDeleteSection={onDeleteSection}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {chapters.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">No chapters yet</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 gap-1.5 text-primary hover:text-primary"
                onClick={onAddChapter}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Chapter
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function InlineEdit({
  value,
  onChange,
  onCommit,
  onCancel,
}: {
  value: string
  onChange: (v: string) => void
  onCommit: () => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
    ref.current?.select()
  }, [])

  return (
    <Input
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCommit()
        if (e.key === "Escape") onCancel()
      }}
      className="h-6 flex-1 border-primary/40 bg-background px-1.5 text-sm shadow-none focus-visible:ring-1"
    />
  )
}

function SectionItem({
  section,
  depth,
  selectedSectionId,
  onSelectSection,
  onToggleSection,
  editingId,
  editValue,
  onEditValueChange,
  onStartEditing,
  onCommitEdit,
  onCancelEdit,
  onRenameSection,
  onDeleteSection,
}: {
  section: Section
  depth: number
  selectedSectionId: string | null
  onSelectSection: (id: string) => void
  onToggleSection: (id: string) => void
  editingId: string | null
  editValue: string
  onEditValueChange: (v: string) => void
  onStartEditing: (id: string, title: string) => void
  onCommitEdit: (id: string) => void
  onCancelEdit: () => void
  onRenameSection: (id: string, title: string) => void
  onDeleteSection: (id: string) => void
}) {
  const isSelected = selectedSectionId === section.id
  const hasChildren = section.children.length > 0
  const isEditing = editingId === section.id

  return (
    <div>
      <div
        className={cn(
          "group flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 transition-colors",
          isSelected ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <GripVertical className="mr-0.5 hidden h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground group-hover:block" />
        {hasChildren ? (
          <button
            onClick={() => onToggleSection(section.id)}
            className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground"
          >
            {section.expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <div className="h-5 w-5 shrink-0" />
        )}
        <FileText className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />

        {isEditing ? (
          <InlineEdit
            value={editValue}
            onChange={onEditValueChange}
            onCommit={() => onCommitEdit(section.id)}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            <button
              onClick={() => onSelectSection(section.id)}
              onDoubleClick={(e) => {
                e.stopPropagation()
                onStartEditing(section.id, section.title)
              }}
              className="flex-1 truncate text-left text-sm"
            >
              {section.title}
            </button>

            <div className="hidden shrink-0 items-center group-hover:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => onStartEditing(section.id, section.title)}>
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDeleteSection(section.id)}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete Section
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>

      {hasChildren && section.expanded && (
        <div className="ml-4 border-l border-border pl-1">
          {section.children.map((child) => (
            <SectionItem
              key={child.id}
              section={child}
              depth={depth + 1}
              selectedSectionId={selectedSectionId}
              onSelectSection={onSelectSection}
              onToggleSection={onToggleSection}
              editingId={editingId}
              editValue={editValue}
              onEditValueChange={onEditValueChange}
              onStartEditing={onStartEditing}
              onCommitEdit={onCommitEdit}
              onCancelEdit={onCancelEdit}
              onRenameSection={onRenameSection}
              onDeleteSection={onDeleteSection}
            />
          ))}
        </div>
      )}
    </div>
  )
}
