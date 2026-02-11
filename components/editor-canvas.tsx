"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  GripVertical,
  Settings2,
  Trash2,
  ImageIcon,
  Upload,
  CircleDot,
  CheckSquare,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  Plus,
  FileText,
} from "lucide-react"
import type { Block, BlockType } from "@/lib/store"
import { useState } from "react"

interface EditorCanvasProps {
  blocks: Block[]
  selectedBlockId: string | null
  onSelectBlock: (id: string | null) => void
  onUpdateBlock: (id: string, updates: Partial<Block>) => void
  onDeleteBlock: (id: string) => void
  onMoveBlock: (id: string, direction: "up" | "down") => void
  onAddBlock: (type: BlockType) => void
  isPreview: boolean
}

export function EditorCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onAddBlock,
  isPreview,
}: EditorCanvasProps) {
  if (isPreview) {
    return <PreviewMode blocks={blocks} />
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Canvas */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-3xl px-8 py-8">
          {blocks.length === 0 ? (
            <EmptyState onAddBlock={onAddBlock} />
          ) : (
            <div className="flex flex-col gap-3">
              {blocks.map((block) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onSelect={() => onSelectBlock(block.id)}
                  onUpdate={(updates) => onUpdateBlock(block.id, updates)}
                  onDelete={() => onDeleteBlock(block.id)}
                />
              ))}

              {/* Add block at end */}
              <button
                onClick={() => onAddBlock("paragraph")}
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-8 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                <Plus className="h-4 w-4" />
                Click to add a block
              </button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick-Add Toolbar */}
      <QuickAddToolbar onAddBlock={onAddBlock} />
    </div>
  )
}

function EmptyState({ onAddBlock }: { onAddBlock: (type: BlockType) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Plus className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">Start building your document</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Drag components here or click the toolbar below to add blocks
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {(["paragraph", "heading", "image", "table"] as BlockType[]).map((type) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            className="gap-1.5 border-border bg-card text-foreground hover:bg-muted hover:text-primary capitalize"
            onClick={() => onAddBlock(type)}
          >
            <Plus className="h-3.5 w-3.5" />
            {type}
          </Button>
        ))}
      </div>
    </div>
  )
}

function BlockRenderer({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: {
  block: Block
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
}) {
  return (
    <div
      className={cn(
        "group relative rounded-lg border bg-card transition-all",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-transparent hover:border-border"
      )}
      onClick={onSelect}
    >
      {/* Drag handle + actions */}
      <div
        className={cn(
          "absolute -left-10 top-2 flex flex-col items-center gap-1",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <button className="flex h-6 w-6 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Actions bar */}
      <div
        className={cn(
          "absolute -right-0 top-2 right-2 flex items-center gap-1",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <button className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
          <Settings2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Block content */}
      <div className="p-4">
        <BlockContent block={block} onUpdate={onUpdate} />
      </div>
    </div>
  )
}

function BlockContent({
  block,
  onUpdate,
}: {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
}) {
  switch (block.type) {
    case "heading":
      return (
        <input
          className="w-full bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground"
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Type your heading..."
        />
      )

    case "paragraph":
      return (
        <textarea
          className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Start typing your content here..."
          rows={3}
        />
      )

    case "image":
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 py-10">
          <ImageIcon className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium text-foreground">Drop an image here</p>
          <p className="mb-4 text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
          <Button variant="outline" size="sm" className="gap-1.5 border-border bg-card text-foreground">
            <Upload className="h-3.5 w-3.5" />
            Upload Image
          </Button>
        </div>
      )

    case "button":
      return (
        <div className="flex items-center gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            {block.content || "Button Text"}
          </Button>
          <Input
            className="h-8 max-w-48 border-border bg-background text-foreground text-xs"
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Button label"
          />
        </div>
      )

    case "radio":
      return (
        <RadioBlock block={block} onUpdate={onUpdate} />
      )

    case "checkbox":
      return (
        <CheckboxBlock block={block} onUpdate={onUpdate} />
      )

    case "dropdown":
      return (
        <div className="max-w-xs">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {block.label}
          </label>
          <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
            <span className="text-sm text-muted-foreground">{block.content}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )

    case "table":
      return <TableBlock />

    case "quiz":
      return <QuizBlock block={block} onUpdate={onUpdate} />

    case "dialog":
      return (
        <div className="rounded-lg border border-border bg-background p-6">
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Dialog Block</span>
          </div>
          <Input
            className="mb-2 border-border bg-card text-foreground"
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Dialog Title"
          />
          <p className="text-xs text-muted-foreground">
            This dialog will display as a modal overlay when triggered.
          </p>
        </div>
      )

    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unknown block type: {block.type}
        </p>
      )
  }
}

function RadioBlock({ block, onUpdate }: { block: Block; onUpdate: (updates: Partial<Block>) => void }) {
  const options = block.content.split(",").map((o) => o.trim())
  const [selected, setSelected] = useState(0)

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">{block.label}</label>
      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <label key={index} className="flex items-center gap-2.5 cursor-pointer">
            <button
              onClick={() => setSelected(index)}
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                selected === index
                  ? "border-primary bg-primary"
                  : "border-border"
              )}
            >
              {selected === index && <CircleDot className="h-2.5 w-2.5 text-primary-foreground" />}
            </button>
            <span className="text-sm text-foreground">{option}</span>
          </label>
        ))}
      </div>
      <Input
        className="mt-3 h-8 border-border bg-background text-foreground text-xs"
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Option 1, Option 2, Option 3"
      />
    </div>
  )
}

function CheckboxBlock({ block, onUpdate }: { block: Block; onUpdate: (updates: Partial<Block>) => void }) {
  const items = block.content.split(",").map((o) => o.trim())

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">{block.label}</label>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <label key={index} className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox className="border-border" />
            <span className="text-sm text-foreground">{item}</span>
          </label>
        ))}
      </div>
      <Input
        className="mt-3 h-8 border-border bg-background text-foreground text-xs"
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Item 1, Item 2, Item 3"
      />
    </div>
  )
}

function TableBlock() {
  const headers = ["Step", "Action", "Verification"]
  const rows = [
    ["1", "Perform pre-check", "Visually confirmed"],
    ["2", "Execute procedure", "System validated"],
    ["3", "Record results", "Supervisor signed"],
  ]

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function QuizBlock({ block, onUpdate }: { block: Block; onUpdate: (updates: Partial<Block>) => void }) {
  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <div className="mb-3 flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Quiz Question</span>
      </div>
      <Input
        className="mb-4 border-border bg-card text-foreground"
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Enter your question..."
      />
      <div className="flex flex-col gap-2">
        {["Answer Option A", "Answer Option B", "Answer Option C", "Answer Option D"].map(
          (opt, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <button
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  idx === 0
                    ? "border-success bg-success text-success-foreground"
                    : "border-border text-muted-foreground"
                )}
              >
                {String.fromCharCode(65 + idx)}
              </button>
              <Input
                className="h-8 flex-1 border-border bg-card text-foreground text-sm"
                defaultValue={opt}
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              />
              {idx === 0 && (
                <CheckSquare className="h-4 w-4 text-success" />
              )}
            </div>
          )
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Click the letter to mark the correct answer. Green indicates the correct choice.
      </p>
    </div>
  )
}

function QuickAddToolbar({ onAddBlock }: { onAddBlock: (type: BlockType) => void }) {
  const tools: { type: BlockType; label: string }[] = [
    { type: "paragraph", label: "Paragraph" },
    { type: "heading", label: "Heading" },
    { type: "image", label: "Image" },
    { type: "button", label: "Button" },
    { type: "radio", label: "Radio" },
    { type: "checkbox", label: "Checkbox" },
    { type: "dropdown", label: "Dropdown" },
    { type: "table", label: "Table" },
    { type: "quiz", label: "Quiz" },
    { type: "dialog", label: "Dialog" },
  ]

  return (
    <div className="border-t border-border bg-card px-4 py-2.5">
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {tools.map((tool) => (
          <Button
            key={tool.type}
            variant="ghost"
            size="sm"
            className="shrink-0 gap-1.5 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary"
            onClick={() => onAddBlock(tool.type)}
          >
            <Plus className="h-3 w-3" />
            {tool.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

function PreviewMode({ blocks }: { blocks: Block[] }) {
  return (
    <ScrollArea className="flex-1 bg-card">
      <div className="mx-auto max-w-3xl px-8 py-10">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mb-1 text-sm font-medium text-foreground">No content to preview</p>
            <p className="text-xs text-muted-foreground">Add some blocks in the editor to see them rendered here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {blocks.map((block) => (
              <PreviewBlock key={block.id} block={block} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

function PreviewBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          className="font-bold text-foreground"
          style={{
            fontSize: `${block.properties.fontSize || 24}px`,
            textAlign: (block.properties.alignment as React.CSSProperties["textAlign"]) || "left",
          }}
        >
          {block.content}
        </h2>
      )
    case "paragraph":
      return (
        <p
          className="leading-relaxed text-foreground"
          style={{
            fontSize: `${block.properties.fontSize || 16}px`,
            textAlign: (block.properties.alignment as React.CSSProperties["textAlign"]) || "left",
          }}
        >
          {block.content}
        </p>
      )
    case "image":
      return (
        <div className="overflow-hidden rounded-xl border border-border bg-muted">
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-background">
              <ImageIcon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Image Placeholder</span>
          </div>
        </div>
      )
    case "button":
      return (
        <div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">{block.content}</Button>
        </div>
      )
    case "radio": {
      const opts = block.content.split(",").map((o) => o.trim())
      return (
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="mb-3 text-sm font-medium text-foreground">{block.label}</p>
          <div className="flex flex-col gap-2.5">
            {opts.map((o, i) => (
              <label key={i} className="flex cursor-pointer items-center gap-2.5">
                <input type="radio" name={block.id} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                <span className="text-sm text-foreground">{o}</span>
              </label>
            ))}
          </div>
        </div>
      )
    }
    case "checkbox": {
      const items = block.content.split(",").map((o) => o.trim())
      return (
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="mb-3 text-sm font-medium text-foreground">{block.label}</p>
          <div className="flex flex-col gap-2.5">
            {items.map((item, i) => (
              <label key={i} className="flex cursor-pointer items-center gap-2.5">
                <Checkbox className="border-border" />
                <span className="text-sm text-foreground">{item}</span>
              </label>
            ))}
          </div>
        </div>
      )
    }
    case "dropdown":
      return (
        <div className="max-w-xs rounded-lg border border-border bg-card p-5">
          <p className="mb-2 text-sm font-medium text-foreground">{block.label}</p>
          <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
            <span className="text-sm text-muted-foreground">{block.content}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )
    case "table":
      return <TableBlock />
    case "quiz":
      return (
        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              Q
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Knowledge Check</span>
          </div>
          <p className="mb-4 text-base font-medium text-foreground">{block.content}</p>
          <div className="flex flex-col gap-2">
            {["A", "B", "C", "D"].map((letter) => (
              <label key={letter} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-border text-xs font-semibold text-muted-foreground">
                  {letter}
                </span>
                <span className="text-sm text-foreground">Answer Option {letter}</span>
              </label>
            ))}
          </div>
        </div>
      )
    case "dialog":
      return (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-semibold">Dialog: {block.content}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            This interactive dialog will appear as a modal overlay when triggered.
          </p>
        </div>
      )
    default:
      return (
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">{block.label}: {block.content}</p>
        </div>
      )
  }
}
