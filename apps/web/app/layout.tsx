import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FitScout - Find Your Perfect Fit',
  description: 'AI-powered size recommendations and product discovery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
