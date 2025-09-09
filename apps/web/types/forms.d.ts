// Form type declarations

declare global {
  namespace React {
    interface FormEvent<T = Element> {
      preventDefault(): void
      target: T
    }
    
    interface ChangeEvent<T = Element> {
      target: T & { value: string }
    }
    
    interface HTMLInputElement {
      value: string
    }
    
    interface HTMLTextAreaElement {
      value: string
    }
  }
}

export {}
