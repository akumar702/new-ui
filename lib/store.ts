export type BlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "button"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "table"
  | "quiz"
  | "dialog"

export interface PreCondition {
  id: string
  field: string
  operator: string
  value: string
}

export interface Block {
  id: string
  type: BlockType
  label: string
  content: string
  properties: Record<string, string>
  preConditions: PreCondition[]
  postCondition: string
}

export interface Section {
  id: string
  title: string
  blocks: Block[]
  children: Section[]
  expanded: boolean
}

export interface Chapter {
  id: string
  title: string
  sections: Section[]
  expanded: boolean
}

export interface Document {
  id: string
  title: string
  status: "draft" | "in-review" | "approved" | "published"
  updatedAt: string
  author: string
  chapters: Chapter[]
}

let counter = 0
export function generateId(): string {
  counter++
  return `id_${Date.now()}_${counter}`
}

export function createDefaultBlock(type: BlockType): Block {
  const labels: Record<BlockType, string> = {
    paragraph: "Paragraph",
    heading: "Heading",
    image: "Image",
    button: "Button",
    radio: "Radio Group",
    checkbox: "Checkbox List",
    dropdown: "Dropdown",
    table: "Table",
    quiz: "Quiz",
    dialog: "Dialog",
  }

  const defaults: Record<BlockType, string> = {
    paragraph: "Start typing your content here...",
    heading: "Section Heading",
    image: "",
    button: "Click Me",
    radio: "Option 1, Option 2, Option 3",
    checkbox: "Item 1, Item 2, Item 3",
    dropdown: "Select an option",
    table: "3x3",
    quiz: "What is the answer?",
    dialog: "Dialog Title",
  }

  return {
    id: generateId(),
    type,
    label: labels[type],
    content: defaults[type],
    properties: {
      fontSize: "16",
      color: "#1e293b",
      alignment: "left",
      padding: "8",
    },
    preConditions: [],
    postCondition: "",
  }
}

export const sampleDocuments: Document[] = [
  {
    id: "doc-1",
    title: "Aircraft Maintenance Manual - Boeing 737",
    status: "published",
    updatedAt: "2026-02-10",
    author: "John Carter",
    chapters: [],
  },
  {
    id: "doc-2",
    title: "Safety Procedures Handbook v3.2",
    status: "in-review",
    updatedAt: "2026-02-09",
    author: "Sarah Chen",
    chapters: [],
  },
  {
    id: "doc-3",
    title: "Pilot Training Module - Emergency Landings",
    status: "draft",
    updatedAt: "2026-02-08",
    author: "Michael Ross",
    chapters: [],
  },
  {
    id: "doc-4",
    title: "Ground Operations Manual",
    status: "approved",
    updatedAt: "2026-02-07",
    author: "Emily Park",
    chapters: [],
  },
  {
    id: "doc-5",
    title: "Cabin Crew Standard Operating Procedures",
    status: "draft",
    updatedAt: "2026-02-06",
    author: "John Carter",
    chapters: [],
  },
  {
    id: "doc-6",
    title: "Aviation Weather Reference Guide",
    status: "in-review",
    updatedAt: "2026-02-05",
    author: "Sarah Chen",
    chapters: [],
  },
]

export const sampleLibraryComponents = [
  {
    id: "lib-1",
    name: "Safety Warning Block",
    type: "paragraph" as BlockType,
    preview: "Warning: Follow all safety procedures before proceeding.",
  },
  {
    id: "lib-2",
    name: "Compliance Checklist",
    type: "checkbox" as BlockType,
    preview: "Pre-flight inspection, Documentation verified, Crew briefed",
  },
  {
    id: "lib-3",
    name: "Decision Matrix",
    type: "radio" as BlockType,
    preview: "Go / No-Go / Conditional",
  },
  {
    id: "lib-4",
    name: "Procedure Table",
    type: "table" as BlockType,
    preview: "Step | Action | Verification",
  },
  {
    id: "lib-5",
    name: "Knowledge Check",
    type: "quiz" as BlockType,
    preview: "Multiple choice quiz with 5 questions",
  },
  {
    id: "lib-6",
    name: "Action Button",
    type: "button" as BlockType,
    preview: "Proceed to Next Section",
  },
]

export function createSampleDocument(): {
  chapters: Chapter[]
} {
  return {
    chapters: [
      {
        id: generateId(),
        title: "Chapter 1: Introduction",
        expanded: true,
        sections: [
          {
            id: generateId(),
            title: "1.1 Purpose & Scope",
            expanded: true,
            children: [],
            blocks: [
              {
                ...createDefaultBlock("heading"),
                content: "Purpose & Scope",
                properties: { fontSize: "24", color: "#1e293b", alignment: "left", padding: "8" },
              },
              {
                ...createDefaultBlock("paragraph"),
                content:
                  "This document provides comprehensive guidelines for all operational procedures. It is intended for use by authorized personnel who have completed the required training modules.",
              },
            ],
          },
          {
            id: generateId(),
            title: "1.2 Definitions",
            expanded: false,
            children: [],
            blocks: [
              {
                ...createDefaultBlock("heading"),
                content: "Definitions & Acronyms",
                properties: { fontSize: "20", color: "#1e293b", alignment: "left", padding: "8" },
              },
              {
                ...createDefaultBlock("table"),
                content: "3x2",
              },
            ],
          },
        ],
      },
      {
        id: generateId(),
        title: "Chapter 2: Procedures",
        expanded: false,
        sections: [
          {
            id: generateId(),
            title: "2.1 Standard Operations",
            expanded: false,
            children: [],
            blocks: [
              {
                ...createDefaultBlock("paragraph"),
                content: "Follow the standard operating procedure outlined below.",
              },
              {
                ...createDefaultBlock("checkbox"),
                content: "Step 1 complete, Step 2 complete, Step 3 complete",
              },
            ],
          },
        ],
      },
      {
        id: generateId(),
        title: "Chapter 3: Assessment",
        expanded: false,
        sections: [
          {
            id: generateId(),
            title: "3.1 Knowledge Check",
            expanded: false,
            children: [],
            blocks: [
              {
                ...createDefaultBlock("quiz"),
                content: "What is the correct procedure for emergency evacuation?",
              },
            ],
          },
        ],
      },
    ],
  }
}
