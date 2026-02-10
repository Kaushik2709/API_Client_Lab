import { Profiler, useContext, useState } from "react";
import { Moon, Sun, ChevronDown, Zap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Profile from "../ui/profile";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { EnvironmentModal } from "./EnvironmentModal";

interface HeaderProps {
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
  environment: string;
  onEnvironmentChange: (env: string) => void;
  environments: any[];
  onEnvironmentsChange: () => void;
}

export function Header({
  theme,
  onThemeChange,
  environment,
  onEnvironmentChange,
  environments,
  onEnvironmentsChange,
}: HeaderProps) {
  const selectedEnv = environments.find(
    (e) => e._id === environment || e.name === environment,
  );
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight">APIForge</span>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          v1.0
        </span>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        <EnvironmentModal
          environments={environments}
          onEnvironmentsChange={onEnvironmentsChange}
        />

        {/* Environment selector */}
        <Select value={environment} onValueChange={onEnvironmentChange}>
          <SelectTrigger className="w-40 h-9 bg-secondary border-border">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  selectedEnv ? "bg-success" : "bg-muted",
                )}
              />
              <SelectValue placeholder="Select Environment" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="none">No Environment</SelectItem>
            {environments.map((env) => (
              <SelectItem
                key={env._id}
                value={env._id}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full bg-success")} />
                  {env.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {user ? (
          <Profile />
        ) : (
          <Button onClick={() => navigate("/login")}>
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
