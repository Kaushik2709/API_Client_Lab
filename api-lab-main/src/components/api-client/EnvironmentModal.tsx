import { useState, useEffect } from "react";
import { Plus, Trash2, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyValueEditor, KeyValuePair } from "./KeyValueEditor";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";

interface EnvironmentModalProps {
  environments: any[];
  onEnvironmentsChange: () => void;
}

export function EnvironmentModal({
  environments,
  onEnvironmentsChange,
}: EnvironmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
  const [envName, setEnvName] = useState("");
  const [variables, setVariables] = useState<KeyValuePair[]>([]);

  useEffect(() => {
    if (selectedEnvId) {
      const env = environments.find((e) => e._id === selectedEnvId);
      if (env) {
        setEnvName(env.name);
        setVariables(env.variables.map((v: any) => ({ ...v, enabled: true })));
      }
    } else {
      setEnvName("");
      setVariables([]);
    }
  }, [selectedEnvId, environments]);

  const handleSave = async () => {
    if (!envName) return toast.error("Environment name is required");

    try {
      const data = {
        name: envName,
        variables: variables
          .filter((v) => v.key)
          .map((v) => ({ key: v.key, value: v.value })),
      };

      if (selectedEnvId) {
        await apiService.updateEnvironment(selectedEnvId, data);
        toast.success("Environment updated");
      } else {
        await apiService.createEnvironment(envName, data.variables);
        toast.success("Environment created");
      }

      onEnvironmentsChange();
      setSelectedEnvId(null);
    } catch (error) {
      toast.error("Failed to save environment");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this environment?")) return;
    try {
      await apiService.deleteEnvironment(id);
      toast.success("Environment deleted");
      onEnvironmentsChange();
      if (selectedEnvId === id) setSelectedEnvId(null);
    } catch (error) {
      toast.error("Failed to delete environment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Environments</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 gap-6 overflow-hidden min-h-[400px]">
          {/* Sidebar */}
          <div className="w-48 border-r border-border flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedEnvId(null)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Environment
            </Button>
            <div className="flex-1 overflow-auto space-y-1">
              {environments.map((env) => (
                <div key={env._id} className="flex items-center group">
                  <Button
                    variant={selectedEnvId === env._id ? "secondary" : "ghost"}
                    size="sm"
                    className="flex-1 justify-start truncate"
                    onClick={() => setSelectedEnvId(env._id)}
                  >
                    {env.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={() => handleDelete(env._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="space-y-2">
              <label className="text-sm font-medium">Environment Name</label>
              <Input
                value={envName}
                onChange={(e) => setEnvName(e.target.value)}
                placeholder="e.g. Production, Staging"
              />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <label className="text-sm font-medium mb-2">Variables</label>
              <div className="flex-1 overflow-auto">
                <KeyValueEditor
                  items={variables}
                  onChange={setVariables}
                  keyPlaceholder="Variable (e.g. baseUrl)"
                  valuePlaceholder="Value"
                />
              </div>
            </div>

            <div className="pt-4 mt-auto flex justify-end">
              <Button onClick={handleSave}>
                {selectedEnvId ? "Update Environment" : "Create Environment"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
