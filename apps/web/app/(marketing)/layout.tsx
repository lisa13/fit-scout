import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Header } from "@/components/shell/Header"
import { Footer } from "@/components/shell/Footer"

export default function MarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
