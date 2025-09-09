import type { ConfidenceBarProps } from "@/types"

export function ConfidenceBar({ value, className = "" }: ConfidenceBarProps) {
  const percentage = Math.round(value * 100)
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span>Confidence</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
