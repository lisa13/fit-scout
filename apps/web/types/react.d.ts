// React type declarations

declare global {
  namespace React {
    interface IntrinsicElements {
      [elemName: string]: any;
    }

    type ReactNode = any;
    type ComponentType<P = {}> = (props: P) => JSX.Element | null;
  }

  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export {};
