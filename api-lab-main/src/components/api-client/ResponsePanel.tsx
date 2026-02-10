import { Clock, FileText, Wifi } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "./StatusBadge";
import { JsonViewer } from "./JsonViewer";
import { cn } from "@/lib/utils";

interface ResponseData {
  status: number;
  time: number;
  size: number;
  body: unknown;
  headers: Record<string, string>;
  cookies: Record<string, string>;
}

interface ResponsePanelProps {
  response: ResponseData | null;
  isLoading: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function ResponsePanel({ response, isLoading }: ResponsePanelProps) {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-muted-foreground">Sending request...</p>
      </div>
    );
  }
  
  if (!response) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
          <Wifi className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No response yet</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Enter a URL and click Send to make a request. The response will appear here.
        </p>
        <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono">⌘</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono">Enter</kbd>
            <span>to send</span>
          </span>
        </div>
      </div>
    );
  }
  
  const headerEntries = Object.entries(response.headers);
  const cookieEntries = Object.entries(response.cookies);
  
  return (
    <div className="h-full flex flex-col">
      {/* Status bar */}
      <div className="p-4 border-b border-border flex items-center gap-4 flex-wrap">
        <StatusBadge status={response.status} />
        
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-mono">{formatTime(response.time)}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="font-mono">{formatBytes(response.size)}</span>
        </div>
      </div>
      
      {/* Response tabs */}
      <Tabs defaultValue="body" className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-border px-4">
          <TabsList className="h-10 bg-transparent p-0 gap-1">
            <TabsTrigger
              value="body"
              className="h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
            >
              Body
            </TabsTrigger>
            <TabsTrigger
              value="headers"
              className="h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
            >
              Headers
              {headerEntries.length > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {headerEntries.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="cookies"
              className="h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
            >
              Cookies
              {cookieEntries.length > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {cookieEntries.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-auto">
          <TabsContent value="body" className="m-0 p-4 h-full">
            <JsonViewer data={response.body} />
          </TabsContent>
          
          <TabsContent value="headers" className="m-0 p-4 h-full">
            <div className="bg-card rounded-lg border border-border divide-y divide-border">
              {headerEntries.map(([key, value]) => (
                <div key={key} className="flex py-2 px-3 gap-4">
                  <span className="text-primary font-mono text-sm font-medium min-w-[200px]">
                    {key}
                  </span>
                  <span className="text-foreground font-mono text-sm break-all">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="cookies" className="m-0 p-4 h-full">
            {cookieEntries.length > 0 ? (
              <div className="bg-card rounded-lg border border-border divide-y divide-border">
                {cookieEntries.map(([key, value]) => (
                  <div key={key} className="flex py-2 px-3 gap-4">
                    <span className="text-primary font-mono text-sm font-medium min-w-[200px]">
                      {key}
                    </span>
                    <span className="text-foreground font-mono text-sm break-all">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No cookies in response
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
