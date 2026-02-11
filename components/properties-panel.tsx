"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  Trash2,
  Library,
  Check,
} from "lucide-react"
import type { Block, PreCondition } from "@/lib/store"
import { generateId } from "@/lib/store"
import { useLibrary } from "@/lib/library-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface PropertiesPanelProps {
  block: Block | null
  onUpdateBlock: (id: string, updates: Partial<Block>) => void
}

export function PropertiesPanel({ block, onUpdateBlock }: PropertiesPanelProps) {
  const { saveToLibrary } = useLibrary()
  const { toast } = useToast()

  const handleSaveToLibrary = () => {
    if (!block) return
    saveToLibrary(block)
    toast({
      title: "Saved to Library",
      description: `"${block.label}" has been saved to the Component Library. You can reuse it in any document.`,
    })
  }

  if (!block) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-card px-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <AlignLeft className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="mb-1 text-sm font-medium text-foreground">No block selected</p>
        <p className="text-center text-xs text-muted-foreground">
          Click on a block in the editor to view and edit its properties
        </p>
      </div>
    )
  }

  const updateProperty = (key: string, value: string) => {
    onUpdateBlock(block.id, {
      properties: { ...block.properties, [key]: value },
    })
  }

  const addPreCondition = () => {
    const newCondition: PreCondition = {
      id: generateId(),
      field: "",
      operator: "=",
      value: "",
    }
    onUpdateBlock(block.id, {
      preConditions: [...block.preConditions, newCondition],
    })
  }

  const updatePreCondition = (conditionId: string, updates: Partial<PreCondition>) => {
    onUpdateBlock(block.id, {
      preConditions: block.preConditions.map((c) =>
        c.id === conditionId ? { ...c, ...updates } : c
      ),
    })
  }

  const removePreCondition = (conditionId: string) => {
    onUpdateBlock(block.id, {
      preConditions: block.preConditions.filter((c) => c.id !== conditionId),
    })
  }

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Block Info */}
          <div className="mb-5">
            <Label className="mb-1.5 text-xs text-muted-foreground">Block Name</Label>
            <Input
              className="h-8 border-border bg-background text-sm text-foreground"
              value={block.label}
              onChange={(e) => onUpdateBlock(block.id, { label: e.target.value })}
            />
          </div>

          <div className="mb-5">
            <Label className="mb-1.5 text-xs text-muted-foreground">Type</Label>
            <div className="rounded-md bg-muted px-3 py-1.5 text-sm capitalize text-foreground">
              {block.type}
            </div>
          </div>

          <Separator className="mb-5 bg-border" />

          {/* Style Settings */}
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Styling
          </h4>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 text-xs text-muted-foreground">Font Size</Label>
              <Input
                type="number"
                className="h-8 border-border bg-background text-sm text-foreground"
                value={block.properties.fontSize || "16"}
                onChange={(e) => updateProperty("fontSize", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1.5 text-xs text-muted-foreground">Padding</Label>
              <Input
                type="number"
                className="h-8 border-border bg-background text-sm text-foreground"
                value={block.properties.padding || "8"}
                onChange={(e) => updateProperty("padding", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <Label className="mb-1.5 text-xs text-muted-foreground">Text Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-8 w-8 shrink-0 cursor-pointer rounded border border-border"
                value={block.properties.color || "#1e293b"}
                onChange={(e) => updateProperty("color", e.target.value)}
              />
              <Input
                className="h-8 flex-1 border-border bg-background font-mono text-xs text-foreground"
                value={block.properties.color || "#1e293b"}
                onChange={(e) => updateProperty("color", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-5">
            <Label className="mb-1.5 text-xs text-muted-foreground">Alignment</Label>
            <div className="flex rounded-md border border-border bg-background">
              {[
                { value: "left", Icon: AlignLeft },
                { value: "center", Icon: AlignCenter },
                { value: "right", Icon: AlignRight },
                { value: "justify", Icon: AlignJustify },
              ].map(({ value, Icon }) => (
                <button
                  key={value}
                  onClick={() => updateProperty("alignment", value)}
                  className={cn(
                    "flex flex-1 items-center justify-center py-2 transition-colors",
                    block.properties.alignment === value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <Separator className="mb-5 bg-border" />

          {/* Pre-conditions */}
          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pre-conditions
              </h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-primary"
                onClick={addPreCondition}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only">Add pre-condition</span>
              </Button>
            </div>

            {block.preConditions.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No pre-conditions set. Add one to control when this block appears.
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {block.preConditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="rounded-md border border-border bg-background p-2.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <Input
                        className="h-7 flex-1 border-border bg-card text-xs text-foreground"
                        placeholder="Field"
                        value={condition.field}
                        onChange={(e) =>
                          updatePreCondition(condition.id, { field: e.target.value })
                        }
                      />
                      <Select
                        value={condition.operator}
                        onValueChange={(v) =>
                          updatePreCondition(condition.id, { operator: v })
                        }
                      >
                        <SelectTrigger className="h-7 w-14 border-border bg-card text-xs text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="=">=</SelectItem>
                          <SelectItem value="!=">!=</SelectItem>
                          <SelectItem value=">">{">"}</SelectItem>
                          <SelectItem value="<">{"<"}</SelectItem>
                          <SelectItem value=">=">{"≥"}</SelectItem>
                          <SelectItem value="<=">{"≤"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        className="h-7 flex-1 border-border bg-card text-xs text-foreground"
                        placeholder="Value"
                        value={condition.value}
                        onChange={(e) =>
                          updatePreCondition(condition.id, { value: e.target.value })
                        }
                      />
                      <button
                        onClick={() => removePreCondition(condition.id)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="mb-5 bg-border" />

          {/* Post-condition */}
          <div className="mb-5">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Post-condition
            </h4>
            <Input
              className="h-8 border-border bg-background text-sm text-foreground"
              placeholder='e.g., result = true if all correct'
              value={block.postCondition}
              onChange={(e) => onUpdateBlock(block.id, { postCondition: e.target.value })}
            />
          </div>

          <Separator className="mb-5 bg-border" />

          {/* Save to library */}
          <Button
            variant="outline"
            className="w-full gap-2 border-border bg-background text-foreground hover:bg-muted"
            onClick={handleSaveToLibrary}
          >
            <Library className="h-4 w-4" />
            Save to Component Library
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
