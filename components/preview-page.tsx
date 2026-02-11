"use client"

import React from "react"
import { useDocument } from "@/lib/document-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle2,
  FileText,
} from "lucide-react"
import type { Block } from "@/lib/store"
import { useDocument } from "@/lib/document-context"

interface PreviewPageProps {
  onBack: () => void
}

export function PreviewPage({ onBack }: PreviewPageProps) {
  const { chapters } = useDocument(createSampleDocument()) // Use the imported function

  return (
    <div className="flex h-screen flex-1 flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to editor</span>
          </Button>
          <Separator orientation="vertical" className="h-5 bg-border" />
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h1 className="text-sm font-semibold text-foreground">Aircraft Maintenance Manual - Boeing 737</h1>
          </div>
          <Badge className="gap-1.5 bg-success/15 text-success border-0 text-[10px]">
            <CheckCircle2 className="h-3 w-3" />
            Preview Mode
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border bg-background text-foreground text-xs hover:bg-muted">
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 border-border bg-background text-foreground text-xs hover:bg-muted">
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </Button>
          <Button size="sm" className="h-8 gap-1.5 bg-primary text-primary-foreground text-xs hover:bg-primary/90" onClick={onBack}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Editor
          </Button>
        </div>
      </header>

      {/* Preview Content */}
      <ScrollArea className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-8 py-12">
          {/* Document Title Page */}
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-3 text-4xl font-bold text-foreground text-balance">
              Aircraft Maintenance Manual - Boeing 737
            </h1>
            <p className="mb-1 text-base text-muted-foreground">Technical Publications Department</p>
            <p className="text-sm text-muted-foreground">
              Author: John Carter &middot; Last Updated: Feb 10, 2026 &middot; Version 3.2
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Badge className="bg-primary/10 text-primary border-0">Published</Badge>
              <Badge variant="outline" className="border-border text-muted-foreground">12 Sections</Badge>
              <Badge variant="outline" className="border-border text-muted-foreground">3 Chapters</Badge>
            </div>
          </div>

          <Separator className="mb-12 bg-border" />

          {/* Table of Contents */}
          <div className="mb-12 rounded-xl border border-border bg-card p-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">Table of Contents</h2>
            <nav className="flex flex-col gap-1">
              {chapters.map((chapter, chIdx) => (
                <div key={chapter.id}>
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2 font-semibold text-foreground hover:bg-muted transition-colors">
                    <span className="text-sm text-primary">{chIdx + 1}.</span>
                    <span className="text-sm">{chapter.title.replace(/^Chapter \d+:\s*/, '')}</span>
                    <span className="ml-auto text-xs text-muted-foreground">p.{chIdx * 4 + 1}</span>
                  </div>
                  {chapter.sections.map((section, sIdx) => (
                    <div
                      key={section.id}
                      className="ml-6 flex items-center gap-3 rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <span className="text-xs">{chIdx + 1}.{sIdx + 1}</span>
                      <span className="text-sm">{section.title.replace(/^\d+\.\d+\s*/, '')}</span>
                      <span className="ml-auto text-xs">{chIdx * 4 + sIdx + 2}</span>
                    </div>
                  ))}
                </div>
              ))}
            </nav>
          </div>

          {/* Chapters & Sections */}
          {chapters.map((chapter, chIdx) => (
            <div key={chapter.id} className="mb-16">
              {/* Chapter heading */}
              <div className="mb-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
                  Chapter {chIdx + 1}
                </span>
                <h2 className="text-3xl font-bold text-foreground text-balance">
                  {chapter.title.replace(/^Chapter \d+:\s*/, '')}
                </h2>
                <Separator className="mt-4 bg-border" />
              </div>

              {/* Sections */}
              {chapter.sections.map((section, sIdx) => (
                <div key={section.id} className="mb-10">
                  <h3 className="mb-4 text-xl font-semibold text-foreground">
                    {chIdx + 1}.{sIdx + 1} {section.title.replace(/^\d+\.\d+\s*/, '')}
                  </h3>

                  {/* Blocks */}
                  <div className="flex flex-col gap-5">
                    {section.blocks.map((block) => (
                      <PreviewBlock key={block.id} block={block} />
                    ))}
                  </div>

                  {/* Nested children */}
                  {section.children.map((child, cIdx) => (
                    <div key={child.id} className="ml-6 mt-6">
                      <h4 className="mb-3 text-lg font-medium text-foreground">
                        {chIdx + 1}.{sIdx + 1}.{cIdx + 1} {child.title}
                      </h4>
                      <div className="flex flex-col gap-5">
                        {child.blocks.map((block) => (
                          <PreviewBlock key={block.id} block={block} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* Footer */}
          <Separator className="mb-8 bg-border" />
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-1">End of Document</p>
            <p>Aircraft Maintenance Manual - Boeing 737 &middot; Version 3.2 &middot; 2026</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function PreviewBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return (
        <h3
          className="font-bold text-foreground"
          style={{
            fontSize: `${block.properties.fontSize || 24}px`,
            textAlign: (block.properties.alignment as React.CSSProperties["textAlign"]) || "left",
          }}
        >
          {block.content}
        </h3>
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
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Image Placeholder</span>
            <span className="text-xs">Figure {Math.floor(Math.random() * 10 + 1)}</span>
          </div>
        </div>
      )

    case "button":
      return (
        <div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            {block.content || "Button"}
          </Button>
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
            <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )

    case "table":
      return (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                {["Step", "Action", "Verification"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {[
                ["1", "Perform pre-check", "Visually confirmed"],
                ["2", "Execute procedure", "System validated"],
                ["3", "Record results", "Supervisor signed"],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

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
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-semibold">Dialog: {block.content}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            This interactive dialog will appear as a modal overlay when triggered by the user.
          </p>
        </div>
      )

    default:
      return (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">{block.label}: {block.content}</p>
        </div>
      )
  }
}
