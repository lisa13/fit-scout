import type { EmptyStateProps } from "@/types";

export function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {hint && (
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">{hint}</p>
      )}
      {action && action}
    </div>
  );
}
