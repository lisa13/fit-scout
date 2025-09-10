import { AlertCircle } from "lucide-react";
import type { InlineErrorProps } from "@/types";

export function InlineError({ message, className = "" }: InlineErrorProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive ${className}`}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
