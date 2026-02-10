import { ChevronDown, Send, Loader2, Save, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MethodSelector } from "./MethodSelector";
import { KeyValueEditor, KeyValuePair } from "./KeyValueEditor";
import { CodeEditor } from "./CodeEditor";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type AuthType = "none" | "bearer" | "api-key" | "basic";
type BodyType = "none" | "json" | "form-data" | "urlencoded" | "raw";

interface Collection {
  id: string;
  name: string;
}

interface RequestPanelProps {
  method: HttpMethod;
  onMethodChange: (method: HttpMethod) => void;
  url: string;
  onUrlChange: (url: string) => void;
  onSend: () => void;
  onSave: (collectionId?: string) => void;
  requestName: string;
  onRequestNameChange: (name: string) => void;
  isLoading: boolean;
  params: KeyValuePair[];
  onParamsChange: (params: KeyValuePair[]) => void;
  headers: KeyValuePair[];
  onHeadersChange: (headers: KeyValuePair[]) => void;
  bodyType: BodyType;
  onBodyTypeChange: (type: BodyType) => void;
  formData: KeyValuePair[];
  onFormDataChange: (data: KeyValuePair[]) => void;
  body: string;
  onBodyChange: (body: string) => void;
  authType: AuthType;
  onAuthTypeChange: (type: AuthType) => void;
  authValue: string;
  onAuthValueChange: (value: string) => void;
  collections: Collection[];
}

export function RequestPanel({
  method,
  onMethodChange,
  url,
  onUrlChange,
  onSend,
  onSave,
  requestName,
  onRequestNameChange,
  isLoading,
  params,
  onParamsChange,
  headers,
  onHeadersChange,
  bodyType,
  onBodyTypeChange,
  formData,
  onFormDataChange,
  body,
  onBodyChange,
  authType,
  onAuthTypeChange,
  authValue,
  onAuthValueChange,
  collections,
}: RequestPanelProps) {
  const enabledParamsCount = params.filter((p) => p.enabled && p.key).length;
  const enabledHeadersCount = headers.filter((h) => h.enabled && h.key).length;

  return (
    <div className="flex flex-col h-full">
      {/* URL bar */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center gap-2">
          <Input
            value={requestName}
            onChange={(e) => onRequestNameChange(e.target.value)}
            className="h-8 w-64 bg-transparent border-none focus-visible:ring-0 text-lg font-semibold px-0"
            placeholder="Request Name"
          />
          <div className="ml-auto flex gap-1">
            <div className="flex items-center -space-x-[1px]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSave()}
                className="h-8 rounded-r-none border-r-0"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-7 rounded-l-none"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onSave()}>
                    <Save className="h-4 w-4 mr-2" />
                    Save to History
                  </DropdownMenuItem>
                  {collections.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        Save to Collection
                      </div>
                      {collections.map((collection) => (
                        <DropdownMenuItem
                          key={collection.id}
                          onClick={() => onSave(collection.id)}
                        >
                          <FolderPlus className="h-4 w-4 mr-2" />
                          {collection.name}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <MethodSelector value={method} onChange={onMethodChange} />
          <div className="flex-1 relative">
            <Input
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="Enter request URL or paste curl command"
              className="h-10 font-mono text-sm bg-background pr-4"
            />
          </div>
          <Button
            onClick={onSend}
            disabled={isLoading || !url}
            className={cn(
              "h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold",
              "transition-all duration-200",
              !isLoading && url && "glow-primary hover:animate-pulse-glow",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Request configuration tabs */}
      <Tabs defaultValue="params" className="flex-1 flex flex-col">
        <div className="border-b border-border px-4">
          <TabsList className="h-10 bg-transparent p-0 gap-1">
            <TabsTrigger
              value="params"
              className="h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
            >
              Params
              {enabledParamsCount > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                  {enabledParamsCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="headers"
              className="h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
            >
              Headers
              {enabledHeadersCount > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                  {enabledHeadersCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="body"
              className="h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
            >
              Body
            </TabsTrigger>
            <TabsTrigger
              value="auth"
              className="h-10 px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
            >
              Auth
              {authType !== "none" && (
                <span className="ml-1.5 w-2 h-2 rounded-full bg-success" />
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="params" className="m-0 p-4 h-full">
            <KeyValueEditor
              items={params}
              onChange={onParamsChange}
              keyPlaceholder="Parameter"
              valuePlaceholder="Value"
            />
          </TabsContent>

          <TabsContent value="headers" className="m-0 p-4 h-full">
            <KeyValueEditor
              items={headers}
              onChange={onHeadersChange}
              keyPlaceholder="Header"
              valuePlaceholder="Value"
            />
          </TabsContent>

          <TabsContent value="body" className="m-0 p-4 h-full">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Body type:
                </span>
                <div className="flex gap-2">
                  {(
                    [
                      "none",
                      "json",
                      "form-data",
                      "urlencoded",
                      "raw",
                    ] as BodyType[]
                  ).map((type) => (
                    <Button
                      key={type}
                      variant={bodyType === type ? "secondary" : "ghost"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => onBodyTypeChange(type)}
                    >
                      {type === "none"
                        ? "None"
                        : type === "json"
                          ? "JSON"
                          : type === "form-data"
                            ? "Form Data"
                            : type === "urlencoded"
                              ? "x-www-form-encoded"
                              : "Raw"}
                    </Button>
                  ))}
                </div>
              </div>

              {bodyType === "json" && (
                <CodeEditor
                  value={body}
                  onChange={onBodyChange}
                  language="json"
                  placeholder='{\n  "key": "value"\n}'
                />
              )}

              {bodyType === "raw" && (
                <CodeEditor
                  value={body}
                  onChange={onBodyChange}
                  language="text"
                  placeholder="Enter raw body content..."
                />
              )}

              {bodyType === "none" && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  This request does not have a body
                </div>
              )}

              {(bodyType === "form-data" || bodyType === "urlencoded") && (
                <KeyValueEditor
                  items={formData}
                  onChange={onFormDataChange}
                  keyPlaceholder="Field"
                  valuePlaceholder="Value"
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="auth" className="m-0 p-4 h-full">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-20">
                  Type:
                </span>
                <Select
                  value={authType}
                  onValueChange={(v) => onAuthTypeChange(v as AuthType)}
                >
                  <SelectTrigger className="w-48 h-9 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="none">No Auth</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="api-key">API Key</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {authType === "bearer" && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-20">
                    Token:
                  </span>
                  <Input
                    type="password"
                    value={authValue}
                    onChange={(e) => onAuthValueChange(e.target.value)}
                    placeholder="Enter bearer token"
                    className="flex-1 font-mono text-sm bg-background"
                  />
                </div>
              )}

              {authType === "api-key" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-20">
                      Key:
                    </span>
                    <Input
                      value={authValue}
                      onChange={(e) => onAuthValueChange(e.target.value)}
                      placeholder="X-API-Key"
                      className="flex-1 font-mono text-sm bg-background"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-20">
                      Value:
                    </span>
                    <Input
                      type="password"
                      placeholder="Enter API key value"
                      className="flex-1 font-mono text-sm bg-background"
                    />
                  </div>
                </div>
              )}

              {authType === "none" && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  This request does not use authentication
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
