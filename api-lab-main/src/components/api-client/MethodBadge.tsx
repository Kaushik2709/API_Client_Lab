import { cn } from "@/lib/utils";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";

interface MethodBadgeProps {
  method: HttpMethod;
  className?: string;
}

const methodColors: Record<HttpMethod, string> = {
  GET: "bg-success/15 text-success border-success/30",
  POST: "bg-warning/15 text-warning border-warning/30",
  PUT: "bg-info/15 text-info border-info/30",
  PATCH: "bg-primary/15 text-primary border-primary/30",
  DELETE: "bg-destructive/15 text-destructive border-destructive/30",
  OPTIONS: "bg-muted text-muted-foreground border-muted-foreground/30",
  HEAD: "bg-muted text-muted-foreground border-muted-foreground/30",
};

export function MethodBadge({ method, className }: MethodBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold font-mono rounded border transition-base",
        methodColors[method],
        className
      )}
    >
      {method}
    </span>
  );
}
