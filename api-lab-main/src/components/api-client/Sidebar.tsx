import { useState } from "react";
import {
  Plus,
  Folder,
  FolderOpen,
  FileJson,
  History,
  Settings,
  ChevronRight,
  ChevronDown,
  Search,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeft,
  MoreVertical,
  Edit2,
  Trash2,
  FolderPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MethodBadge } from "./MethodBadge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD";

interface Request {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
}

interface Collection {
  id: string;
  name: string;
  isOpen: boolean;
  requests: Request[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  collections: Collection[];
  history: Request[];
  onCollectionToggle: (id: string) => void;
  selectedRequestId: string | null;
  onRequestSelect: (request: Request) => void;
  onNewRequest: () => void;
  onCreateCollection: (name: string) => void;
  onRenameCollection: (id: string, name: string) => void;
  onDeleteCollection: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  onAddToCollection: (requestId: string, collectionId: string) => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  collections,
  history,
  onCollectionToggle,
  selectedRequestId,
  onRequestSelect,
  onNewRequest,
  onCreateCollection,
  onRenameCollection,
  onDeleteCollection,
  onDeleteRequest,
  onAddToCollection,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "collections" | "history" | "settings"
  >("collections");

  if (!isOpen) {
    return (
      <div className="w-14 border-r border-border bg-sidebar flex flex-col items-center py-4 gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={onToggle}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <div className="h-px w-8 bg-border my-2" />
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9",
            activeTab === "collections"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground",
          )}
          onClick={() => {
            setActiveTab("collections");
            onToggle();
          }}
        >
          <Folder className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9",
            activeTab === "history"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground",
          )}
          onClick={() => {
            setActiveTab("history");
            onToggle();
          }}
        >
          <History className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9",
            activeTab === "settings"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground",
          )}
          onClick={() => {
            setActiveTab("settings");
            onToggle();
          }}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant={activeTab === "collections" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => setActiveTab("collections")}
          >
            <Folder className="h-4 w-4 mr-1.5" />
            Collections
          </Button>
          <Button
            variant={activeTab === "history" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveTab("history")}
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={onToggle}
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 bg-background text-sm"
          />
        </div>
      </div>

      {/* New request button */}
      <div className="p-3 border-b border-border">
        <Button
          className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={onNewRequest}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {activeTab === "collections" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  Collections
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 hover:bg-secondary"
                  onClick={() => {
                    const name = prompt("Enter collection name:");
                    if (name) {
                      onCreateCollection(name);
                    }
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {collections
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.requests.some((r) =>
                      r.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    ),
                )
                .map((collection) => (
                  <div key={collection.id}>
                    {/* Collection header */}
                    <div className="group flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-secondary/50 transition-colors">
                      <button
                        className="flex-1 flex items-center gap-2 text-sm overflow-hidden"
                        onClick={() => onCollectionToggle(collection.id)}
                      >
                        {collection.isOpen ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        {collection.isOpen ? (
                          <FolderOpen className="h-4 w-4 text-primary flex-shrink-0" />
                        ) : (
                          <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="truncate font-medium text-left">
                          {collection.name}
                        </span>
                        <span className="ml-auto text-[10px] text-muted-foreground opacity-60">
                          {collection.requests.length}
                        </span>
                      </button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              onNewRequest();
                              // We'll need a way to auto-select this collection in the save dialog
                              // For now, it just resets the form.
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Request
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              const name = prompt(
                                "Rename collection:",
                                collection.name,
                              );
                              if (name) onRenameCollection(collection.id, name);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDeleteCollection(collection.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Requests */}
                    {collection.isOpen && (
                      <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-1">
                        {collection.requests
                          .filter((r) =>
                            r.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                          )
                          .map((request) => (
                            <div
                              key={request.id}
                              className="group/req flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-secondary/50 transition-colors"
                            >
                              <button
                                className={cn(
                                  "flex-1 flex items-center gap-2 text-sm transition-colors overflow-hidden",
                                  selectedRequestId === request.id
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                                onClick={() => onRequestSelect(request)}
                              >
                                <MethodBadge
                                  method={request.method}
                                  className="scale-75 origin-left"
                                />
                                <span className="truncate">{request.name}</span>
                              </button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 opacity-0 group-hover/req:opacity-100"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => onDeleteRequest(request.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-1">
              {history
                .filter(
                  (r) =>
                    (r.name || "")
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    (r.url || "")
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                )
                .map((request) => (
                  <div
                    key={request.id}
                    className="group flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-secondary/50 transition-colors"
                  >
                    <button
                      className={cn(
                        "flex-1 flex items-center gap-2 text-sm transition-colors overflow-hidden",
                        selectedRequestId === request.id
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                      onClick={() => onRequestSelect(request)}
                    >
                      <MethodBadge
                        method={request.method}
                        className="scale-75 origin-left"
                      />
                      <span className="truncate">
                        {request.name || request.url}
                      </span>
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {collections.length > 0 && (
                          <>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <FolderPlus className="h-4 w-4 mr-2 transition-colors" />
                                Add to Collection
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  {collections.map((c) => (
                                    <DropdownMenuItem
                                      key={c.id}
                                      onClick={() =>
                                        onAddToCollection(request.id, c.id)
                                      }
                                    >
                                      {c.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDeleteRequest(request.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              {history.length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No history yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Settings</p>
              <p className="text-xs mt-1">Configure your workspace</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
