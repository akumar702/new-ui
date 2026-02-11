"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import type { Block, BlockType } from "@/lib/store"
import { generateId } from "@/lib/store"

export interface LibraryComponent {
  id: string
  name: string
  type: BlockType
  preview: string
  block: Block
  savedAt: string
}

interface LibraryContextType {
  components: LibraryComponent[]
  saveToLibrary: (block: Block, name?: string) => void
  removeFromLibrary: (id: string) => void
  pendingInsert: LibraryComponent | null
  setPendingInsert: (component: LibraryComponent | null) => void
}

const LibraryContext = createContext<LibraryContextType | null>(null)

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider")
  }
  return context
}

// Seed with the sample library components as actual blocks
function createSeedComponents(): LibraryComponent[] {
  return [
    {
      id: "lib-1",
      name: "Safety Warning Block",
      type: "paragraph",
      preview: "Warning: Follow all safety procedures before proceeding.",
      savedAt: "2026-02-08",
      block: {
        id: "lib-block-1",
        type: "paragraph",
        label: "Safety Warning Block",
        content: "Warning: Follow all safety procedures before proceeding. Ensure all personnel have been briefed and protective equipment is in place.",
        properties: { fontSize: "16", color: "#dc2626", alignment: "left", padding: "8" },
        preConditions: [],
        postCondition: "",
      },
    },
    {
      id: "lib-2",
      name: "Compliance Checklist",
      type: "checkbox",
      preview: "Pre-flight inspection, Documentation verified, Crew briefed",
      savedAt: "2026-02-07",
      block: {
        id: "lib-block-2",
        type: "checkbox",
        label: "Compliance Checklist",
        content: "Pre-flight inspection, Documentation verified, Crew briefed, Safety equipment check",
        properties: { fontSize: "16", color: "#1e293b", alignment: "left", padding: "8" },
        preConditions: [],
        postCondition: "",
      },
    },
    {
      id: "lib-3",
      name: "Decision Matrix",
      type: "radio",
      preview: "Go / No-Go / Conditional",
      savedAt: "2026-02-06",
      block: {
        id: "lib-block-3",
        type: "radio",
        label: "Decision Matrix",
        content: "Go, No-Go, Conditional",
        properties: { fontSize: "16", color: "#1e293b", alignment: "left", padding: "8" },
        preConditions: [],
        postCondition: "",
      },
    },
    {
      id: "lib-4",
      name: "Procedure Table",
      type: "table",
      preview: "Step | Action | Verification",
      savedAt: "2026-02-05",
      block: {
        id: "lib-block-4",
        type: "table",
        label: "Procedure Table",
        content: "3x3",
        properties: { fontSize: "16", color: "#1e293b", alignment: "left", padding: "8" },
        preConditions: [],
        postCondition: "",
      },
    },
    {
      id: "lib-5",
      name: "Knowledge Check",
      type: "quiz",
      preview: "Multiple choice quiz with 4 options",
      savedAt: "2026-02-04",
      block: {
        id: "lib-block-5",
        type: "quiz",
        label: "Knowledge Check",
        content: "What is the correct procedure for emergency evacuation?",
        properties: { fontSize: "16", color: "#1e293b", alignment: "left", padding: "8" },
        preConditions: [],
        postCondition: "",
      },
    },
    {
      id: "lib-6",
      name: "Action Button",
      type: "button",
      preview: "Proceed to Next Section",
      savedAt: "2026-02-03",
      block: {
        id: "lib-block-6",
        type: "button",
        label: "Action Button",
        content: "Proceed to Next Section",
        properties: { fontSize: "16", color: "#1e293b", alignment: "left", padding: "8" },
        preConditions: [],
        postCondition: "",
      },
    },
  ]
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [components, setComponents] = useState<LibraryComponent[]>(createSeedComponents)
  const [pendingInsert, setPendingInsert] = useState<LibraryComponent | null>(null)

  const saveToLibrary = useCallback((block: Block, name?: string) => {
    const newComponent: LibraryComponent = {
      id: generateId(),
      name: name || block.label,
      type: block.type,
      preview: block.content.slice(0, 80) + (block.content.length > 80 ? "..." : ""),
      savedAt: new Date().toISOString().split("T")[0],
      block: { ...block, id: generateId() },
    }
    setComponents((prev) => [newComponent, ...prev])
  }, [])

  const removeFromLibrary = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return (
    <LibraryContext.Provider
      value={{ components, saveToLibrary, removeFromLibrary, pendingInsert, setPendingInsert }}
    >
      {children}
    </LibraryContext.Provider>
  )
}
