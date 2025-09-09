"use client"

import { useState } from "react"
import { Container } from "@/components/shell/Container"
import { QueryPanel } from "@/components/QueryPanel"
import { ProductCard } from "@/components/ProductCard"
import { LoadingBlock } from "@/components/common/LoadingBlock"
import { EmptyState } from "@/components/common/EmptyState"
import { InlineError } from "@/components/common/InlineError"
import { postJSON } from "@/lib/fetcher"
import { Search } from "lucide-react"
import type { FindResponse, Product } from "@/types"

export default function FindPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<FindResponse["items"]>([])

  const handleSubmit = async (data: { url?: string; caption?: string }) => {
    setIsLoading(true)
    setError(null)
    setProducts([])

    try {
      const response = await postJSON<FindResponse>("/v1/find", data)
      setProducts(response.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Find Similar Products</h1>
            <p className="text-muted-foreground">
              Upload a product image or paste a URL to find similar items
            </p>
          </div>

          <div className="mb-8">
            <QueryPanel onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {error && (
            <div className="mb-6">
              <InlineError message={error} />
            </div>
          )}

          {isLoading && <LoadingBlock />}

          {!isLoading && products.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Similar Products ({products.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
                {products.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    title={product.title}
                    brandName={product.brandId}
                    price={product.price}
                    score={product.score}
                    reason={product.reason}
                  />
                ))}
              </div>
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <EmptyState
              icon={Search}
              title="No products found"
              hint="Try entering a different URL or uploading a different image"
            />
          )}
        </div>
      </Container>
    </div>
  )
}