import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: number;
  className?: string;
}

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) {
    return "bg-success/15 text-success border-success/30 glow-success";
  }
  if (status >= 300 && status < 400) {
    return "bg-info/15 text-info border-info/30";
  }
  if (status >= 400 && status < 500) {
    return "bg-warning/15 text-warning border-warning/30";
  }
  if (status >= 500) {
    return "bg-destructive/15 text-destructive border-destructive/30 glow-destructive";
  }
  return "bg-muted text-muted-foreground border-muted-foreground/30";
}

function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    200: "OK",
    201: "Created",
    204: "No Content",
    301: "Moved Permanently",
    302: "Found",
    304: "Not Modified",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  };
  return statusTexts[status] || "";
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusText = getStatusText(status);
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 text-sm font-mono font-semibold rounded-md border transition-base",
        getStatusColor(status),
        className
      )}
    >
      <span>{status}</span>
      {statusText && <span className="text-xs opacity-80">{statusText}</span>}
    </span>
  );
}
