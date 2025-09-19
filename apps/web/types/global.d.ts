// Global type declarations for FitScout web app

declare global {
  namespace React {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Extend the global namespace for better type safety
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};

