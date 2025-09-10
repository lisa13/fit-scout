import type { ContainerProps } from "@/types";

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-[1200px] px-4 md:px-6 ${className}`}>
      {children}
    </div>
  );
}
