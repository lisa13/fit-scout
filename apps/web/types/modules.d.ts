// Module declarations for packages that don't have built-in TypeScript support

declare module "react" {
  export * from "react";
  export { default } from "react";
}

declare module "next/link" {
  import { ComponentType, ReactNode } from "react";
  interface LinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    target?: string;
    rel?: string;
  }
  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module "next" {
  export interface Metadata {
    title?: string;
    description?: string;
  }
}

declare module "lucide-react" {
  import { ComponentType, SVGProps } from "react";
  export const Search: ComponentType<SVGProps<SVGSVGElement>>;
  export const Ruler: ComponentType<SVGProps<SVGSVGElement>>;
  export const Shield: ComponentType<SVGProps<SVGSVGElement>>;
  export const Zap: ComponentType<SVGProps<SVGSVGElement>>;
  export const Target: ComponentType<SVGProps<SVGSVGElement>>;
  export const Moon: ComponentType<SVGProps<SVGSVGElement>>;
  export const Sun: ComponentType<SVGProps<SVGSVGElement>>;
  export const Menu: ComponentType<SVGProps<SVGSVGElement>>;
  export const X: ComponentType<SVGProps<SVGSVGElement>>;
  export const ExternalLink: ComponentType<SVGProps<SVGSVGElement>>;
  export const Heart: ComponentType<SVGProps<SVGSVGElement>>;
  export const AlertCircle: ComponentType<SVGProps<SVGSVGElement>>;
  export const HelpCircle: ComponentType<SVGProps<SVGSVGElement>>;
  export const ChevronDown: ComponentType<SVGProps<SVGSVGElement>>;
  export const ChevronUp: ComponentType<SVGProps<SVGSVGElement>>;
  export const Link: ComponentType<SVGProps<SVGSVGElement>>;
  export const Upload: ComponentType<SVGProps<SVGSVGElement>>;
}

declare module "next-themes" {
  import { ReactNode } from "react";
  interface ThemeProviderProps {
    children: ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
  };
}

declare module "react-hook-form" {
  import { ReactNode } from "react";
  export function useForm<T>(config?: any): {
    control: any;
    handleSubmit: (fn: (data: T) => void) => (e: any) => void;
  };
  export function FormProvider(props: {
    children: ReactNode;
    [key: string]: any;
  }): JSX.Element;
}

declare module "@hookform/resolvers/zod" {
  export function zodResolver(schema: any): any;
}

declare module "zod" {
  export const z: {
    object: (schema: any) => any;
    string: () => any;
    number: () => any;
    enum: (values: any[]) => any;
  };
}

declare module "class-variance-authority" {
  export function cva(base: string, config?: any): any;
  export type VariantProps<T> = any;
}

declare module "@radix-ui/react-slot" {
  import { ComponentType, ReactNode } from "react";
  interface SlotProps {
    children: ReactNode;
    [key: string]: any;
  }
  export const Slot: ComponentType<SlotProps>;
}

declare module "@radix-ui/react-dialog" {
  import { ComponentType, ReactNode } from "react";
  export const Root: ComponentType<{ children: ReactNode; [key: string]: any }>;
  export const Trigger: ComponentType<{
    children: ReactNode;
    asChild?: boolean;
    [key: string]: any;
  }>;
  export const Content: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
  export const Overlay: ComponentType<{ [key: string]: any }>;
  export const Close: ComponentType<{ [key: string]: any }>;
  export const Portal: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
  export const Title: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
  export const Description: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
}

declare module "@radix-ui/react-select" {
  import { ComponentType, ReactNode } from "react";
  export const Root: ComponentType<{ children: ReactNode; [key: string]: any }>;
  export const Trigger: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
  export const Value: ComponentType<{
    placeholder?: string;
    [key: string]: any;
  }>;
  export const Content: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
  export const Item: ComponentType<{
    children: ReactNode;
    value: string;
    [key: string]: any;
  }>;
  export const Portal: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
}

declare module "@radix-ui/react-label" {
  import { ComponentType, ReactNode } from "react";
  export const Root: ComponentType<{ children: ReactNode; [key: string]: any }>;
}

declare module "@radix-ui/react-collapsible" {
  import { ComponentType, ReactNode } from "react";
  export const Root: ComponentType<{
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    [key: string]: any;
  }>;
  export const Trigger: ComponentType<{
    children: ReactNode;
    asChild?: boolean;
    [key: string]: any;
  }>;
  export const Content: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
}

declare module "@radix-ui/react-form" {
  import { ComponentType, ReactNode } from "react";
  export const Root: ComponentType<{ children: ReactNode; [key: string]: any }>;
  export const Field: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
  export const Label: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
  export const Control: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
  export const Message: ComponentType<{
    children: ReactNode;
    [key: string]: any;
  }>;
}
