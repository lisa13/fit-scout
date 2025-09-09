import Link from "next/link"
import { Container } from "./Container"
import { ThemeToggle } from "./ThemeToggle"
import { MobileMenu } from "./MobileMenu"

const navLinks = [
  { href: "/find", label: "Find" },
  { href: "/fit", label: "Fit" },
  { href: "https://github.com/fitscout/fitscout", label: "GitHub", external: true },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-xl">FitScout</span>
          </Link>

          {/* Center: Navigation (md+) */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Theme toggle + Mobile menu */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  )
}
