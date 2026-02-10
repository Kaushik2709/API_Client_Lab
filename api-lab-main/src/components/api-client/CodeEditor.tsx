import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "json" | "text";
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = "json",
  placeholder = "Enter your code here...",
  className,
  readOnly = false,
}: CodeEditorProps) {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (language === "json" && value) {
      try {
        JSON.parse(value);
        setError(null);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    }
  }, [value, language]);
  const handleFormat = () => {
    if (language === "json" && value) {
      try {
        const parsed = JSON.parse(value);
        onChange(JSON.stringify(parsed, null, 2));
        setError(null);
      } catch {
        // Ignore format errors
      }
    }
  };
  
  const lineCount = value.split("\n").length;
  
  return (
    <div className={cn("relative", className)}>
      <div className="flex rounded-lg border border-border overflow-hidden bg-card">
        {/* Line numbers */}
        <div className="flex-shrink-0 select-none bg-muted/30 border-r border-border">
          <div className="py-3 px-2">
            {Array.from({ length: Math.max(lineCount, 10) }, (_, i) => (
              <div
                key={i}
                className="text-xs font-mono text-muted-foreground/50 text-right leading-6 h-6"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        
        {/* Editor */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
          className={cn(
            "flex-1 p-3 font-mono text-sm leading-6 bg-transparent resize-none outline-none",
            "placeholder:text-muted-foreground/50",
            readOnly && "cursor-default",
            error && "text-destructive"
          )}
          style={{ minHeight: "240px" }}
          onKeyDown={(e) => {
            // Tab key inserts spaces
            if (e.key === "Tab") {
              e.preventDefault();
              const start = e.currentTarget.selectionStart;
              const end = e.currentTarget.selectionEnd;
              const newValue = value.substring(0, start) + "  " + value.substring(end);
              onChange(newValue);
              // Move cursor
              setTimeout(() => {
                e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
              }, 0);
            }
            // Cmd/Ctrl + Shift + F to format
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "f") {
              e.preventDefault();
              handleFormat();
            }
          }}
        />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-destructive/10 border-t border-destructive/30 text-xs text-destructive font-mono">
          {error}
        </div>
      )}
      
      {/* Format hint */}
      {language === "json" && !readOnly && (
        <div className="absolute top-2 right-2 text-xs text-muted-foreground/50">
          ⌘⇧F to format
        </div>
      )}
    </div>
  );
}
