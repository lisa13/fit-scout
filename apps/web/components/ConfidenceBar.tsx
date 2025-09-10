import type { ConfidenceBarProps } from "@/types";

export function ConfidenceBar({ value, className = "" }: ConfidenceBarProps) {
  const percentage = Math.round(value * 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>Confidence</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
