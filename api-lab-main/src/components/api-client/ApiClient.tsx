import { useState, useEffect, useCallback } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { RequestPanel } from "./RequestPanel";
import { ResponsePanel } from "./ResponsePanel";
import { KeyValuePair } from "./KeyValueEditor";
import { useTheme } from "next-themes";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type AuthType = "none" | "bearer" | "api-key" | "basic";

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

interface ResponseData {
  status: number;
  time: number;
  size: number;
  body: unknown;
  headers: Record<string, string>;
  cookies: Record<string, string>;
}

export function ApiClient() {
  const { theme, setTheme } = useTheme();
  const [environment, setEnvironment] = useState("local");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [history, setHistory] = useState<Request[]>([]);
  const [environments, setEnvironments] = useState<any[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [currentCollectionId, setCurrentCollectionId] = useState<string | null>(
    null,
  );
  const [requestName, setRequestName] = useState("New Request");

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionsData, requestsData, environmentsData] =
          await Promise.all([
            apiService.getCollections(),
            apiService.getRequests(),
            apiService.getEnvironments(),
          ]);

        // Process requests into collections and history
        const formattedCollections = collectionsData.map((c: any) => ({
          id: c._id,
          name: c.name,
          isOpen: false,
          requests: requestsData
            .filter((r: any) => r.collectionId === c._id)
            .map((r: any) => ({
              id: r._id,
              name: r.name,
              method: r.method,
              url: r.url,
            })),
        }));

        setCollections(formattedCollections);

        // Requests without collectionId are history
        setHistory(
          requestsData
            .filter((r: any) => !r.collectionId)
            .map((r: any) => ({
              id: r._id,
              name: r.name,
              method: r.method,
              url: r.url,
            })),
        );

        setEnvironments(environmentsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      const [collectionsData, requestsData] = await Promise.all([
        apiService.getCollections(),
        apiService.getRequests(),
      ]);

      const formattedCollections = collectionsData.map((c: any) => ({
        id: c._id,
        name: c.name,
        isOpen: collections.find((curr) => curr.id === c._id)?.isOpen || false,
        requests: requestsData
          .filter((r: any) => r.collectionId === c._id)
          .map((r: any) => ({
            id: r._id,
            name: r.name,
            method: r.method,
            url: r.url,
          })),
      }));
      setCollections(formattedCollections);

      setHistory(
        requestsData
          .filter((r: any) => !r.collectionId)
          .map((r: any) => ({
            id: r._id,
            name: r.name,
            method: r.method,
            url: r.url,
          })),
      );
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  };

  const fetchEnvironments = async () => {
    try {
      const environmentsData = await apiService.getEnvironments();
      setEnvironments(environmentsData);
    } catch (error) {
      console.error("Failed to fetch environments:", error);
    }
  };

  // Request state
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [params, setParams] = useState<KeyValuePair[]>([]);
  const [headers, setHeaders] = useState<KeyValuePair[]>([]);
  const [bodyType, setBodyType] = useState<
    "none" | "json" | "form-data" | "urlencoded" | "raw"
  >("json");
  const [formData, setFormData] = useState<KeyValuePair[]>([]);
  const [body, setBody] = useState("");
  const [authType, setAuthType] = useState<AuthType>("none");
  const [authValue, setAuthValue] = useState("");

  // Response state
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCollectionToggle = (id: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isOpen: !c.isOpen } : c)),
    );
  };

  const handleRequestSelect = async (request: Request) => {
    setSelectedRequestId(request.id);
    try {
      const fullRequest = await apiService.getRequest(request.id);
      setRequestName(fullRequest.name);
      setMethod(fullRequest.method as HttpMethod);
      setUrl(fullRequest.url);

      // Load headers
      if (fullRequest.headers) {
        setHeaders(
          fullRequest.headers.map((h: any) => ({ ...h, enabled: true })),
        );
      } else {
        setHeaders([]);
      }

      // Load body
      if (fullRequest.body) {
        try {
          const parsedBody = JSON.parse(fullRequest.body);
          if (typeof parsedBody === "object" && !Array.isArray(parsedBody)) {
            setBodyType("json");
            setBody(JSON.stringify(parsedBody, null, 2));
          } else if (Array.isArray(parsedBody)) {
            setBodyType("form-data");
            setFormData(parsedBody.map((f: any) => ({ ...f, enabled: true })));
          } else {
            setBodyType("raw");
            setBody(fullRequest.body);
          }
        } catch (e) {
          setBodyType("raw");
          setBody(fullRequest.body);
        }
      } else {
        setBodyType("none");
        setBody("");
        setFormData([]);
      }

      // Load auth
      if (fullRequest.auth) {
        setAuthType(fullRequest.auth.authType as AuthType);
        setAuthValue(fullRequest.auth.token || "");
      } else {
        setAuthType("none");
        setAuthValue("");
      }

      setCurrentCollectionId(fullRequest.collectionId || null);
      setResponse(null);
    } catch (error) {
      toast.error("Failed to load request details");
    }
  };

  const handleNewRequest = () => {
    setSelectedRequestId(null);
    setRequestName("New Request");
    setMethod("GET");
    setUrl("");
    setParams([]);
    setHeaders([]);
    setBodyType("json");
    setFormData([]);
    setBody("");
    setAuthType("none");
    setAuthValue("");
    setCurrentCollectionId(null);
    setResponse(null);
  };

  const onRenameCollection = async (id: string, name: string) => {
    try {
      await apiService.updateCollection(id, name);
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name } : c)),
      );
      toast.success("Collection renamed");
    } catch (error) {
      toast.error("Failed to rename collection");
    }
  };

  const onDeleteCollection = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this collection? All requests inside will be deleted.",
      )
    )
      return;
    try {
      await apiService.deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
      toast.success("Collection deleted");
    } catch (error) {
      toast.error("Failed to delete collection");
    }
  };

  const onCreateCollection = async (name: string) => {
    try {
      const newCollection = await apiService.createCollection(name);
      setCollections((prev) => [
        ...prev,
        {
          id: newCollection._id,
          name: newCollection.name,
          isOpen: false,
          requests: [],
        },
      ]);
      toast.success("Collection created");
    } catch (error) {
      toast.error("Failed to create collection");
    }
  };

  const onDeleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      await apiService.deleteRequest(id);
      setCollections((prev) =>
        prev.map((c) => ({
          ...c,
          requests: c.requests.filter((r) => r.id !== id),
        })),
      );
      setHistory((prev) => prev.filter((r) => r.id !== id));
      if (selectedRequestId === id) handleNewRequest();
      toast.success("Request deleted");
    } catch (error) {
      toast.error("Failed to delete request");
    }
  };

  const onAddToCollection = async (requestId: string, collectionId: string) => {
    try {
      const fullRequest = await apiService.getRequest(requestId);
      const savedRequest = await apiService.saveRequest({
        ...fullRequest,
        id: requestId,
        collectionId,
      } as any);
      if (selectedRequestId === requestId) {
        setCurrentCollectionId(savedRequest.collectionId || null);
      }
      await refreshData();
      toast.success("Request added to collection");
    } catch (error) {
      toast.error("Failed to add to collection");
    }
  };

  const handleSend = useCallback(async () => {
    if (!url) return;

    const activeEnv = environments.find((e: any) => e.isActive);
    const variables = activeEnv ? activeEnv.variables : [];

    const replaceVariables = (str: string) => {
      let result = str;
      variables.forEach((v: any) => {
        const regex = new RegExp(`{{${v.key}}}`, "g");
        result = result.replace(regex, v.value);
      });
      return result;
    };

    setIsLoading(true);
    const startTime = performance.now();

    try {
      const replacedUrl = replaceVariables(url);

      // Build headers
      const requestHeaders: Record<string, string> = {};
      headers
        .filter((h) => h.enabled && h.key)
        .forEach((h) => {
          requestHeaders[h.key] = replaceVariables(h.value);
        });

      // Add auth header
      if (authType === "bearer" && authValue) {
        requestHeaders["Authorization"] =
          `Bearer ${replaceVariables(authValue)}`;
      } else if (authType === "basic" && authValue) {
        requestHeaders["Authorization"] =
          `Basic ${btoa(replaceVariables(authValue))}`;
      } else if (authType === "api-key" && authValue) {
        requestHeaders["X-API-Key"] = replaceVariables(authValue);
      }

      // Prepare body for execution
      let executionBody = replaceVariables(body);
      if (["POST", "PUT", "PATCH"].includes(method)) {
        if (bodyType === "form-data" || bodyType === "urlencoded") {
          const data: Record<string, string> = {};
          formData
            .filter((f) => f.enabled && f.key)
            .forEach((f) => {
              data[f.key] = replaceVariables(f.value);
            });
          executionBody = JSON.stringify(data);
        }
      }

      // Execute through backend
      const result = await apiService.executeRequest({
        method,
        url: replacedUrl,
        headers: Object.entries(requestHeaders).map(([key, value]) => ({
          key,
          value,
        })),
        body: executionBody,
        auth:
          authType !== "none"
            ? { authType, token: replaceVariables(authValue) }
            : undefined,
      });

      const endTime = performance.now();

      if (result.error) {
        throw new Error(result.error);
      }

      setResponse({
        status: result.status,
        time: result.responseTime || Math.round(endTime - startTime),
        size: JSON.stringify(result.data).length,
        body: result.data,
        headers: result.headers,
        cookies: {},
      });

      // After successful execution, if it's a new request, we should probably add it to history locally
      // (The backend doesn't automatically save executions to history in our current implementation)
      // For now, let's keep it simple.
    } catch (error) {
      setResponse({
        status: 0,
        time: Math.round(performance.now() - startTime),
        size: 0,
        body: {
          error: error instanceof Error ? error.message : "Request failed",
        },
        headers: {},
        cookies: {},
      });
    } finally {
      setIsLoading(false);
    }
  }, [url, method, headers, body, bodyType, formData, authType, authValue]);

  const handleSave = async (collectionId?: string) => {
    try {
      const data: any = {
        name: requestName,
        method,
        url,
        headers: headers.filter((h) => h.enabled && h.key),
        body:
          bodyType === "json"
            ? body
            : JSON.stringify(formData.filter((f) => f.enabled && f.key)),
        auth: authType !== "none" ? { authType, token: authValue } : undefined,
      };

      // Use provided collectionId OR the current one if we're just updating
      const targetCollectionId =
        collectionId !== undefined ? collectionId : currentCollectionId;
      if (targetCollectionId) data.collectionId = targetCollectionId;

      let savedRequest;
      if (selectedRequestId) {
        savedRequest = await apiService.saveRequest({
          ...data,
          id: selectedRequestId,
        });
      } else {
        savedRequest = await apiService.saveRequest(data);
      }

      toast.success("Request saved successfully");
      setCurrentCollectionId(savedRequest.collectionId || null);
      await refreshData();
      setSelectedRequestId(savedRequest._id);
    } catch (error) {
      toast.error("Failed to save request");
    }
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSend]);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <Header
        theme={theme as "dark" | "light"}
        onThemeChange={(newTheme) => setTheme(newTheme)}
        environment={environment}
        onEnvironmentChange={setEnvironment}
        environments={environments}
        onEnvironmentsChange={fetchEnvironments}
      />

      <div className="flex-1 flex min-h-0">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          collections={collections}
          history={history}
          onCollectionToggle={handleCollectionToggle}
          selectedRequestId={selectedRequestId}
          onRequestSelect={handleRequestSelect}
          onNewRequest={handleNewRequest}
          onCreateCollection={onCreateCollection}
          onRenameCollection={onRenameCollection}
          onDeleteCollection={onDeleteCollection}
          onDeleteRequest={onDeleteRequest}
          onAddToCollection={onAddToCollection}
        />

        <main className="flex-1 min-w-0">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50} minSize={30}>
              <RequestPanel
                method={method}
                onMethodChange={setMethod}
                url={url}
                onUrlChange={setUrl}
                onSend={handleSend}
                onSave={handleSave}
                collections={collections}
                requestName={requestName}
                onRequestNameChange={setRequestName}
                isLoading={isLoading}
                params={params}
                onParamsChange={setParams}
                headers={headers}
                onHeadersChange={setHeaders}
                bodyType={bodyType}
                onBodyTypeChange={setBodyType}
                formData={formData}
                onFormDataChange={setFormData}
                body={body}
                onBodyChange={setBody}
                authType={authType}
                onAuthTypeChange={setAuthType}
                authValue={authValue}
                onAuthValueChange={setAuthValue}
              />
            </ResizablePanel>

            <ResizableHandle className="h-2 bg-border hover:bg-primary/20 transition-colors" />

            <ResizablePanel defaultSize={50} minSize={20}>
              <ResponsePanel response={response} isLoading={isLoading} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
    </div>
  );
}
