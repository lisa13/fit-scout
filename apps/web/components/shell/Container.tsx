import type { ContainerProps } from "@/types"

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-[1200px] mx-auto px-4 md:px-6 ${className}`}>
      {children}
    </div>
  )
}
