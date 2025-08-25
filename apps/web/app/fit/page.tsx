'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/apps/web/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/apps/web/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/apps/web/components/ui/form'
import { Input } from '@/apps/web/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/apps/web/components/ui/select'
import { Badge } from '@/apps/web/components/ui/badge'
import { Ruler, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import brands from '@/data/brands.json'

const sizeFormSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  category: z.enum(['shoes', 'clothing', 'accessories'], {
    errorMap: () => ({ message: 'Category is required' }),
  }),
  chest_cm: z.number().min(50).max(200).optional(),
  waist_cm: z.number().min(50).max(200).optional(),
  shoulder_cm: z.number().min(30).max(100).optional(),
  inseam_cm: z.number().min(50).max(150).optional(),
  hip_cm: z.number().min(50).max(200).optional(),
  foot_mm: z.number().min(200).max(400).optional(),
  fitPreference: z.enum(['slim', 'regular', 'loose'], {
    errorMap: () => ({ message: 'Fit preference is required' }),
  }),
})

type SizeFormData = z.infer<typeof sizeFormSchema>

interface SizeSuggestion {
  size: string
  confidence: number
  rationale: string
  measurements: Record<string, number>
}

export default function FitPage() {
  const [suggestion, setSuggestion] = useState<SizeSuggestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SizeFormData>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: {
      brand: '',
      category: 'clothing',
      fitPreference: 'regular',
    },
  })

  const selectedCategory = form.watch('category')

  const onSubmit = async (data: SizeFormData) => {
    setIsLoading(true)
    setError(null)
    setSuggestion(null)

    try {
      // Filter out undefined measurements
      const measurements = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          if (key === 'brand' || key === 'category' || key === 'fitPreference') return false
          return value !== undefined && value !== null
        })
      )

      const response = await fetch('/api/size/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: data.brand,
          category: data.category,
          measurements,
          fitPreference: data.fitPreference,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to get size suggestion')
      }

      setSuggestion(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ruler className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Size</h1>
            <p className="text-gray-600">
              Enter your measurements and preferences to get personalized size recommendations
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Size Recommendation Form</CardTitle>
              <CardDescription>
                Fill in your measurements and we'll suggest the best size for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Brand and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="shoes">Shoes</SelectItem>
                              <SelectItem value="clothing">Clothing</SelectItem>
                              <SelectItem value="accessories">Accessories</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Measurements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Measurements</h3>
                    
                    {selectedCategory === 'shoes' ? (
                      <FormField
                        control={form.control}
                        name="foot_mm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Foot Length (mm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 270"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="chest_cm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chest (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 96"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="waist_cm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Waist (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 81"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shoulder_cm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Shoulder (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 47"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="inseam_cm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inseam (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 81"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  {/* Fit Preference */}
                  <FormField
                    control={form.control}
                    name="fitPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fit Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="slim">Slim</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="loose">Loose</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Getting Recommendation...' : 'Get Size Recommendation'}
                  </Button>
                </form>
              </Form>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {/* Size Suggestion */}
              {suggestion && (
                <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-900">Size Recommendation</h3>
                    <Badge variant="secondary" className="text-sm">
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-green-900">Recommended Size:</span>
                      <span className="ml-2 text-2xl font-bold text-green-700">{suggestion.size}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-green-900">Reasoning:</span>
                      <p className="mt-1 text-green-800">{suggestion.rationale}</p>
                    </div>

                    {Object.keys(suggestion.measurements).length > 0 && (
                      <div>
                        <span className="font-medium text-green-900">Size Chart Measurements:</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(suggestion.measurements).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
