import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
  className?: string;
}

const methods: { value: HttpMethod; color: string }[] = [
  { value: "GET", color: "text-success" },
  { value: "POST", color: "text-warning" },
  { value: "PUT", color: "text-info" },
  { value: "PATCH", color: "text-primary" },
  { value: "DELETE", color: "text-destructive" },
];

export function MethodSelector({ value, onChange, className }: MethodSelectorProps) {
  const selectedMethod = methods.find((m) => m.value === value);
  
  return (
    <Select value={value} onValueChange={(v) => onChange(v as HttpMethod)}>
      <SelectTrigger
        className={cn(
          "w-28 h-10 font-mono font-semibold text-sm bg-secondary border-border focus-ring",
          selectedMethod?.color,
          className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {methods.map((method) => (
          <SelectItem
            key={method.value}
            value={method.value}
            className={cn("font-mono font-semibold cursor-pointer", method.color)}
          >
            {method.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
