"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Link as LinkIcon } from "lucide-react"
import type { QueryPanelProps, QueryMode, InputChangeHandler, TextareaChangeHandler, FormSubmitHandler } from "@/types"

export function QueryPanel({ onSubmit, isLoading = false }: QueryPanelProps) {
  const [mode, setMode] = useState<QueryMode>("url")
  const [url, setUrl] = useState("")
  const [caption, setCaption] = useState("")

  const handleSubmit: FormSubmitHandler = (e) => {
    e.preventDefault()
    if (mode === "url" && url.trim()) {
      onSubmit({ url: url.trim() })
    } else if (mode === "caption" && caption.trim()) {
      onSubmit({ caption: caption.trim() })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Similar Products</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mode selector */}
          <div className="flex rounded-lg border p-1">
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === "url"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              By URL
            </button>
            <button
              type="button"
              onClick={() => setMode("caption")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === "caption"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Search className="h-4 w-4" />
              By Caption
            </button>
          </div>

          {/* Input fields */}
          {mode === "url" ? (
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="https://example.com/product"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !url.trim()}
              >
                {isLoading ? "Fetching..." : "Fetch & Find"}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea
                placeholder="Describe the product you're looking for..."
                value={caption}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
                rows={4}
                required
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !caption.trim()}
              >
                {isLoading ? "Searching..." : "Find"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
