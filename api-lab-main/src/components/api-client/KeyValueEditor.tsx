import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  className?: string;
}

export function KeyValueEditor({
  items,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  className,
}: KeyValueEditorProps) {
  const addItem = () => {
    const newItem: KeyValuePair = {
      id: crypto.randomUUID(),
      key: "",
      value: "",
      enabled: true,
    };
    onChange([...items, newItem]);
  };
  
  const updateItem = (id: string, field: "key" | "value" | "enabled", newValue: string | boolean) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };
  
  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {/* Header */}
      <div className="grid grid-cols-[auto,1fr,1fr,auto] gap-2 px-2 text-xs font-medium text-muted-foreground">
        <div className="w-6" />
        <div>{keyPlaceholder}</div>
        <div>{valuePlaceholder}</div>
        <div className="w-8" />
      </div>
      
      {/* Items */}
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "grid grid-cols-[auto,1fr,1fr,auto] gap-2 items-center p-1 rounded-md group transition-base",
              "hover:bg-secondary/50",
              !item.enabled && "opacity-50"
            )}
          >
            <div className="flex items-center gap-1">
              <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
              <Checkbox
                checked={item.enabled}
                onCheckedChange={(checked) => updateItem(item.id, "enabled", !!checked)}
              />
            </div>
            
            <Input
              value={item.key}
              onChange={(e) => updateItem(item.id, "key", e.target.value)}
              placeholder={keyPlaceholder}
              className="h-8 font-mono text-sm bg-background"
            />
            
            <Input
              value={item.value}
              onChange={(e) => updateItem(item.id, "value", e.target.value)}
              placeholder={valuePlaceholder}
              className="h-8 font-mono text-sm bg-background"
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {/* Add button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={addItem}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {keyPlaceholder.toLowerCase()}
      </Button>
    </div>
  );
}
