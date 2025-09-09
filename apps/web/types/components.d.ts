// Component type declarations

declare global {
  namespace React {
    interface HTMLAttributes<T> {
      className?: string
      children?: ReactNode
      [key: string]: any
    }
    
    interface FormEvent<T = Element> {
      preventDefault(): void
      target: T
    }
    
    interface ChangeEvent<T = Element> {
      target: T & { value: string }
    }
  }
}

export {}