import { useState } from "react";
import { Check, Copy, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JsonViewerProps {
  data: unknown;
  className?: string;
}

function formatValue(value: unknown, depth: number = 0): JSX.Element {
  if (value === null) {
    return <span className="json-null">null</span>;
  }
  
  if (typeof value === "boolean") {
    return <span className="json-boolean">{value.toString()}</span>;
  }
  
  if (typeof value === "number") {
    return <span className="json-number">{value}</span>;
  }
  
  if (typeof value === "string") {
    return <span className="json-string">"{value}"</span>;
  }
  
  if (Array.isArray(value)) {
    return <JsonArray items={value} depth={depth} />;
  }
  
  if (typeof value === "object") {
    return <JsonObject obj={value as Record<string, unknown>} depth={depth} />;
  }
  
  return <span>{String(value)}</span>;
}

function JsonArray({ items, depth }: { items: unknown[]; depth: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  
  if (items.length === 0) {
    return <span className="text-muted-foreground">[]</span>;
  }
  
  if (collapsed) {
    return (
      <span 
        className="cursor-pointer hover:text-primary transition-colors"
        onClick={() => setCollapsed(false)}
      >
        <ChevronRight className="inline h-3 w-3 mr-1" />
        <span className="text-muted-foreground">[{items.length} items]</span>
      </span>
    );
  }
  
  return (
    <span>
      <span 
        className="cursor-pointer hover:text-primary transition-colors"
        onClick={() => setCollapsed(true)}
      >
        <ChevronDown className="inline h-3 w-3 mr-1" />
      </span>
      {"[\n"}
      {items.map((item, index) => (
        <span key={index}>
          {childIndent}
          {formatValue(item, depth + 1)}
          {index < items.length - 1 ? "," : ""}
          {"\n"}
        </span>
      ))}
      {indent}]
    </span>
  );
}

function JsonObject({ obj, depth }: { obj: Record<string, unknown>; depth: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const entries = Object.entries(obj);
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  
  if (entries.length === 0) {
    return <span className="text-muted-foreground">{"{}"}</span>;
  }
  
  if (collapsed) {
    return (
      <span 
        className="cursor-pointer hover:text-primary transition-colors"
        onClick={() => setCollapsed(false)}
      >
        <ChevronRight className="inline h-3 w-3 mr-1" />
        <span className="text-muted-foreground">{`{${entries.length} keys}`}</span>
      </span>
    );
  }
  
  return (
    <span>
      <span 
        className="cursor-pointer hover:text-primary transition-colors"
        onClick={() => setCollapsed(true)}
      >
        <ChevronDown className="inline h-3 w-3 mr-1" />
      </span>
      {"{\n"}
      {entries.map(([key, value], index) => (
        <span key={key}>
          {childIndent}
          <span className="json-key">"{key}"</span>
          <span className="text-muted-foreground">: </span>
          {formatValue(value, depth + 1)}
          {index < entries.length - 1 ? "," : ""}
          {"\n"}
        </span>
      ))}
      {indent}{"}"}
    </span>
  );
}

export function JsonViewer({ data, className }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={cn("relative group", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute top-2 right-2 h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/80 hover:bg-secondary"
      >
        {copied ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <pre className="code-editor p-4 overflow-auto whitespace-pre bg-card rounded-lg border border-border">
        {formatValue(data, 0)}
      </pre>
    </div>
  );
}
