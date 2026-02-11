"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import type { Block, BlockType, Chapter } from "@/lib/store"
import { createDefaultBlock, createSampleDocument, generateId } from "@/lib/store"

interface DocumentContextType {
  docTitle: string
  setDocTitle: (title: string) => void
  chapters: Chapter[]
  setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>
  selectedSectionId: string | null
  setSelectedSectionId: (id: string | null) => void
  selectedBlockId: string | null
  setSelectedBlockId: (id: string | null) => void

  // Chapter actions
  handleToggleChapter: (chapterId: string) => void
  handleToggleSection: (sectionId: string) => void
  handleAddChapter: () => void
  handleAddSection: (chapterId: string) => void
  handleRenameChapter: (chapterId: string, newTitle: string) => void
  handleRenameSection: (sectionId: string, newTitle: string) => void
  handleDeleteChapter: (chapterId: string) => void
  handleDeleteSection: (sectionId: string) => void

  // Block actions
  updateSectionBlocks: (sectionId: string, updater: (blocks: Block[]) => Block[]) => void
  handleUpdateBlock: (blockId: string, updates: Partial<Block>) => void
  handleDeleteBlock: (blockId: string) => void
  handleMoveBlock: (blockId: string, direction: "up" | "down") => void
  handleAddBlock: (type: BlockType) => void

  // Derived state
  currentBlocks: Block[]
  selectedBlock: Block | null
}

const DocumentContext = createContext<DocumentContextType | null>(null)

export function useDocument() {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider")
  }
  return context
}

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [docTitle, setDocTitle] = useState("Aircraft Maintenance Manual - Boeing 737")
  const [chapters, setChapters] = useState<Chapter[]>(() => createSampleDocument().chapters)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  // Auto-select first section if none selected
  if (!selectedSectionId && chapters.length > 0 && chapters[0].sections.length > 0) {
    setSelectedSectionId(chapters[0].sections[0].id)
  }

  // Find sections helper
  const findSection = useCallback(
    (sectionId: string | null) => {
      if (!sectionId) return null
      for (const chapter of chapters) {
        for (const section of chapter.sections) {
          if (section.id === sectionId) return section
          for (const child of section.children) {
            if (child.id === sectionId) return child
          }
        }
      }
      return null
    },
    [chapters],
  )

  const currentSection = findSection(selectedSectionId)
  const currentBlocks = currentSection?.blocks || []
  const selectedBlock = currentBlocks.find((b) => b.id === selectedBlockId) || null

  // --- Chapter / Section actions ---

  const handleToggleChapter = useCallback((chapterId: string) => {
    setChapters((prev) => prev.map((ch) => (ch.id === chapterId ? { ...ch, expanded: !ch.expanded } : ch)))
  }, [])

  const handleToggleSection = useCallback((sectionId: string) => {
    setChapters((prev) =>
      prev.map((ch) => ({
        ...ch,
        sections: ch.sections.map((s) => (s.id === sectionId ? { ...s, expanded: !s.expanded } : s)),
      })),
    )
  }, [])

  const handleAddChapter = useCallback(() => {
    setChapters((prev) => {
      const newChapter: Chapter = {
        id: generateId(),
        title: `Chapter ${prev.length + 1}: New Chapter`,
        expanded: true,
        sections: [],
      }
      return [...prev, newChapter]
    })
  }, [])

  const handleAddSection = useCallback((chapterId: string) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id !== chapterId) return ch
        const sectionNum = ch.sections.length + 1
        const chapterIndex = prev.indexOf(ch) + 1
        const newSection = {
          id: generateId(),
          title: `${chapterIndex}.${sectionNum} New Section`,
          blocks: [],
          children: [],
          expanded: false,
        }
        return { ...ch, sections: [...ch.sections, newSection] }
      }),
    )
  }, [])

  const handleRenameChapter = useCallback((chapterId: string, newTitle: string) => {
    setChapters((prev) => prev.map((ch) => (ch.id === chapterId ? { ...ch, title: newTitle } : ch)))
  }, [])

  const handleRenameSection = useCallback((sectionId: string, newTitle: string) => {
    setChapters((prev) =>
      prev.map((ch) => ({
        ...ch,
        sections: ch.sections.map((s) =>
          s.id === sectionId
            ? { ...s, title: newTitle }
            : {
                ...s,
                children: s.children.map((c) => (c.id === sectionId ? { ...c, title: newTitle } : c)),
              },
        ),
      })),
    )
  }, [])

  const handleDeleteChapter = useCallback(
    (chapterId: string) => {
      setChapters((prev) => {
        const chapter = prev.find((ch) => ch.id === chapterId)
        if (chapter) {
          const sectionIds = chapter.sections.flatMap((s) => [s.id, ...s.children.map((c) => c.id)])
          if (selectedSectionId && sectionIds.includes(selectedSectionId)) {
            setSelectedSectionId(null)
            setSelectedBlockId(null)
          }
        }
        return prev.filter((ch) => ch.id !== chapterId)
      })
    },
    [selectedSectionId],
  )

  const handleDeleteSection = useCallback(
    (sectionId: string) => {
      if (selectedSectionId === sectionId) {
        setSelectedSectionId(null)
        setSelectedBlockId(null)
      }
      setChapters((prev) =>
        prev.map((ch) => ({
          ...ch,
          sections: ch.sections
            .filter((s) => s.id !== sectionId)
            .map((s) => ({
              ...s,
              children: s.children.filter((c) => c.id !== sectionId),
            })),
        })),
      )
    },
    [selectedSectionId],
  )

  // --- Block actions ---

  const updateSectionBlocks = useCallback((sectionId: string, updater: (blocks: Block[]) => Block[]) => {
    setChapters((prev) =>
      prev.map((ch) => ({
        ...ch,
        sections: ch.sections.map((s) => (s.id === sectionId ? { ...s, blocks: updater(s.blocks) } : s)),
      })),
    )
  }, [])

  const handleUpdateBlock = useCallback(
    (blockId: string, updates: Partial<Block>) => {
      if (!selectedSectionId) return
      updateSectionBlocks(selectedSectionId, (blocks) =>
        blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)),
      )
    },
    [selectedSectionId, updateSectionBlocks],
  )

  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      if (!selectedSectionId) return
      if (selectedBlockId === blockId) setSelectedBlockId(null)
      updateSectionBlocks(selectedSectionId, (blocks) => blocks.filter((b) => b.id !== blockId))
    },
    [selectedSectionId, selectedBlockId, updateSectionBlocks],
  )

  const handleMoveBlock = useCallback(
    (blockId: string, direction: "up" | "down") => {
      if (!selectedSectionId) return
      updateSectionBlocks(selectedSectionId, (blocks) => {
        const index = blocks.findIndex((b) => b.id === blockId)
        if (index === -1) return blocks
        const newIndex = direction === "up" ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= blocks.length) return blocks
        const newBlocks = [...blocks]
        ;[newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]
        return newBlocks
      })
    },
    [selectedSectionId, updateSectionBlocks],
  )

  const handleAddBlock = useCallback(
    (type: BlockType) => {
      if (!selectedSectionId) return
      const newBlock = createDefaultBlock(type)
      updateSectionBlocks(selectedSectionId, (blocks) => [...blocks, newBlock])
      setSelectedBlockId(newBlock.id)
    },
    [selectedSectionId, updateSectionBlocks],
  )

  return (
    <DocumentContext.Provider
      value={{
        docTitle,
        setDocTitle,
        chapters,
        setChapters,
        selectedSectionId,
        setSelectedSectionId,
        selectedBlockId,
        setSelectedBlockId,
        handleToggleChapter,
        handleToggleSection,
        handleAddChapter,
        handleAddSection,
        handleRenameChapter,
        handleRenameSection,
        handleDeleteChapter,
        handleDeleteSection,
        updateSectionBlocks,
        handleUpdateBlock,
        handleDeleteBlock,
        handleMoveBlock,
        handleAddBlock,
        currentBlocks,
        selectedBlock,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}
