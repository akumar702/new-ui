"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { DocumentTree } from "@/components/document-tree"
import { EditorCanvas } from "@/components/editor-canvas"
import { PropertiesPanel } from "@/components/properties-panel"
import {
  Undo2,
  Redo2,
  Save,
  Eye,
  Pencil,
  Send,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  ListOrdered,
} from "lucide-react"
import { useDocument } from "@/lib/document-context"
import { useLibrary } from "@/lib/library-context"
import { useToast } from "@/hooks/use-toast"
import { generateId } from "@/lib/store"
import type { Block } from "@/lib/store"

interface EditorPageProps {
  onOpenPreview?: () => void
}

export function EditorPage({ onOpenPreview }: EditorPageProps) {
  const doc = useDocument()
  const { pendingInsert, setPendingInsert } = useLibrary()
  const { toast } = useToast()
  const [isPreview, setIsPreview] = useState(false)
  const [showProperties, setShowProperties] = useState(true)
  const [indexStyle, setIndexStyle] = useState("decimal")

  // Handle pending inserts from the Component Library
  useEffect(() => {
    if (pendingInsert && doc.selectedSectionId) {
      const clonedBlock: Block = {
        ...pendingInsert.block,
        id: generateId(),
      }
      doc.updateSectionBlocks(doc.selectedSectionId, (blocks) => [...blocks, clonedBlock])
      doc.setSelectedBlockId(clonedBlock.id)
      toast({
        title: "Component Inserted",
        description: `"${pendingInsert.name}" was added to the current section.`,
      })
      setPendingInsert(null)
    }
  }, [pendingInsert])

  return (
    <div className="flex h-screen flex-1 flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
        {/* Breadcrumb + Title */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="shrink-0 text-xs text-muted-foreground">Documents</span>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          <Input
            className="h-7 w-auto min-w-48 max-w-md border-0 bg-transparent px-1 text-sm font-semibold text-foreground shadow-none focus-visible:ring-1"
            value={doc.docTitle}
            onChange={(e) => doc.setDocTitle(e.target.value)}
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Index style */}
          <Select value={indexStyle} onValueChange={setIndexStyle}>
            <SelectTrigger className="h-8 w-32 border-border bg-background text-xs text-foreground">
              <ListOrdered className="mr-1.5 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="decimal">1.1.1</SelectItem>
              <SelectItem value="roman">I.II.III</SelectItem>
              <SelectItem value="alpha">A.B.C</SelectItem>
              <SelectItem value="bullet">Bullet</SelectItem>
            </SelectContent>
          </Select>

          <div className="mx-1 h-5 w-px bg-border" />

          {/* Undo / Redo */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Undo2 className="h-4 w-4" />
            <span className="sr-only">Undo</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Redo2 className="h-4 w-4" />
            <span className="sr-only">Redo</span>
          </Button>

          <div className="mx-1 h-5 w-px bg-border" />

          {/* View toggle */}
          <div className="flex rounded-md border border-border bg-background">
            <button
              onClick={() => setIsPreview(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                !isPreview ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              } rounded-l-md`}
            >
              <Pencil className="h-3 w-3" />
              Editor
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                isPreview ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              } rounded-r-md`}
            >
              <Eye className="h-3 w-3" />
              Preview
            </button>
          </div>

          {onOpenPreview && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-border bg-background text-foreground text-xs hover:bg-muted"
              onClick={onOpenPreview}
            >
              <Eye className="h-3.5 w-3.5" />
              Full Preview
            </Button>
          )}

          <div className="mx-1 h-5 w-px bg-border" />

          {/* Properties toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setShowProperties(!showProperties)}
          >
            {showProperties ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle properties</span>
          </Button>

          <div className="mx-1 h-5 w-px bg-border" />

          {/* Actions */}
          <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border bg-background text-foreground text-xs hover:bg-muted">
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </Button>
          <Button size="sm" className="h-8 gap-1.5 bg-primary text-primary-foreground text-xs hover:bg-primary/90">
            <Send className="h-3.5 w-3.5" />
            Send for Approval
          </Button>
        </div>
      </header>

      {/* Three-Panel Layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left: Document Tree */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <DocumentTree
            chapters={doc.chapters}
            selectedSectionId={doc.selectedSectionId}
            onSelectSection={doc.setSelectedSectionId}
            onToggleChapter={doc.handleToggleChapter}
            onToggleSection={doc.handleToggleSection}
            onAddChapter={doc.handleAddChapter}
            onAddSection={doc.handleAddSection}
            onRenameChapter={doc.handleRenameChapter}
            onRenameSection={doc.handleRenameSection}
            onDeleteChapter={doc.handleDeleteChapter}
            onDeleteSection={doc.handleDeleteSection}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center: Editor Canvas */}
        <ResizablePanel defaultSize={showProperties ? 55 : 80} minSize={40}>
          <EditorCanvas
            blocks={doc.currentBlocks}
            selectedBlockId={doc.selectedBlockId}
            onSelectBlock={doc.setSelectedBlockId}
            onUpdateBlock={doc.handleUpdateBlock}
            onDeleteBlock={doc.handleDeleteBlock}
            onMoveBlock={doc.handleMoveBlock}
            onAddBlock={doc.handleAddBlock}
            isPreview={isPreview}
          />
        </ResizablePanel>

        {/* Right: Properties */}
        {showProperties && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={18} maxSize={35}>
              <PropertiesPanel block={doc.selectedBlock} onUpdateBlock={doc.handleUpdateBlock} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
}
