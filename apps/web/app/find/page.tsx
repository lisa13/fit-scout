'use client'

import { useState } from 'react'
import { Button } from '@/apps/web/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/apps/web/components/ui/card'
import { Input } from '@/apps/web/components/ui/input'
import { Badge } from '@/apps/web/components/ui/badge'
import { Skeleton } from '@/apps/web/components/ui/skeleton'
import { Search, ArrowLeft, Upload, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Dropzone } from '@/apps/web/components/Dropzone'

interface Product {
  id: string
  title: string
  brandId: string
  category: string
  price: number
  tags: string[]
  image: string
  similarity: number
}

interface SearchResults {
  query: string
  results: Product[]
}

export default function FindPage() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResults | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUrlSearch = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/find', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to find similar products')
      }

      setResults(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSearch = async (file: File) => {
    setSelectedFile(file)
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/find', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to find similar products')
      }

      setResults(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (file: File) => {
    handleImageSearch(file)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Similar Products</h1>
            <p className="text-gray-600">
              Upload an image or enter a product URL to discover similar items
            </p>
          </div>

          {/* Search Methods */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* URL Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ExternalLink className="h-5 w-5" />
                  <span>Search by URL</span>
                </CardTitle>
                <CardDescription>
                  Enter a product URL to find similar items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="https://example.com/product"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUrlSearch()}
                  />
                  <Button onClick={handleUrlSearch} disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload Image</span>
                </CardTitle>
                <CardDescription>
                  Drag and drop an image or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dropzone
                  onFileSelect={handleFileSelect}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  maxSize={5}
                />
              </CardContent>
            </Card>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <div className="text-center">
                <Skeleton className="h-4 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-32 w-full mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {results && !isLoading && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Similar Products Found
                </h2>
                <p className="text-gray-600">
                  Showing results for: "{results.query}"
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.results.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                            {product.title}
                          </CardTitle>
                          <CardDescription className="capitalize">
                            {product.brandId} • {product.category}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-2 flex-shrink-0">
                          {Math.round(product.similarity * 100)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <div className="text-gray-400 text-sm text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2" />
                          Product Image
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-lg">
                            ${product.price}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {product.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
