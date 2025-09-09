import type { EmptyStateProps } from "@/types"

export function EmptyState({ icon: Icon, title, hint, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {hint && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {hint}
        </p>
      )}
      {action && action}
    </div>
  )
}
