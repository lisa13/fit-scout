"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Container } from "@/components/shell/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResultCard } from "@/components/ResultCard"
import { EmptyState } from "@/components/common/EmptyState"
import { InlineError } from "@/components/common/InlineError"
import { postJSON } from "@/lib/fetcher"
import { Ruler, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { SizeFormData, SizeSuggestResponse, Brand } from "@/types"

const sizeFormSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  category: z.enum(['shoes', 'clothing', 'accessories'], {
    errorMap: () => ({ message: 'Category is required' }),
  }),
  waist_cm: z.number().min(50).max(200).optional(),
  hips_cm: z.number().min(50).max(200).optional(),
  chest_cm: z.number().min(50).max(200).optional(),
  foot_mm: z.number().min(200).max(400).optional(),
  fitPref: z.enum(['snug', 'regular', 'relaxed'], {
    errorMap: () => ({ message: 'Fit preference is required' }),
  }),
})

// Mock brands data - in real app, this would come from API
const brands: Brand[] = [
  { id: 'nike', name: 'Nike', categories: ['shoes', 'clothing', 'accessories'] },
  { id: 'adidas', name: 'Adidas', categories: ['shoes', 'clothing', 'accessories'] },
  { id: 'puma', name: 'Puma', categories: ['shoes', 'clothing', 'accessories'] },
  { id: 'under-armour', name: 'Under Armour', categories: ['shoes', 'clothing', 'accessories'] },
]

export default function FitPage() {
  const [suggestion, setSuggestion] = useState<SizeSuggestResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  const form = useForm<SizeFormData>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: {
      brand: '',
      category: 'clothing',
      fitPref: 'regular',
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
          if (key === 'brand' || key === 'category' || key === 'fitPref') return false
          return value !== undefined && value !== null
        })
      )

      const response = await postJSON<SizeSuggestResponse>("/v1/size/suggest", {
        brand: data.brand,
        category: data.category,
        fitPref: data.fitPref,
        measurements,
      })

      setSuggestion(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ruler className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Find Your Size</h1>
            <p className="text-muted-foreground">
              Enter your measurements and preferences to get personalized size recommendations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Size Recommendation Form</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Brand and Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }: { field: any }) => (
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
                        render={({ field }: { field: any }) => (
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
                          render={({ field }: { field: any }) => (
                            <FormItem>
                              <FormLabel>Foot Length (mm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 270"
                                  {...field}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                            render={({ field }: { field: any }) => (
                              <FormItem>
                                <FormLabel>Chest (cm)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="e.g., 96"
                                    {...field}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="waist_cm"
                            render={({ field }: { field: any }) => (
                              <FormItem>
                                <FormLabel>Waist (cm)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="e.g., 81"
                                    {...field}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="hips_cm"
                            render={({ field }: { field: any }) => (
                              <FormItem>
                                <FormLabel>Hips (cm)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="e.g., 95"
                                    {...field}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                      name="fitPref"
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
                              <SelectItem value="snug">Snug</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="relaxed">Relaxed</SelectItem>
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

                {/* Help Section */}
                <Collapsible open={showHelp} onOpenChange={setShowHelp} className="mt-6">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        How to measure
                      </div>
                      {showHelp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Chest:</strong> Measure around the fullest part of your chest, under your arms.</p>
                    <p><strong>Waist:</strong> Measure around your natural waistline, usually the narrowest part of your torso.</p>
                    <p><strong>Hips:</strong> Measure around the fullest part of your hips and buttocks.</p>
                    <p><strong>Foot Length:</strong> Measure from the back of your heel to the tip of your longest toe.</p>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            {/* Results */}
            <div>
              {error && (
                <div className="mb-6">
                  <InlineError message={error} />
                </div>
              )}

              {suggestion ? (
                <ResultCard
                  sizeLabel={suggestion.sizeLabel}
                  confidence={suggestion.confidence}
                  rationale={suggestion.rationale}
                  alternates={suggestion.alternates}
                />
              ) : (
                <EmptyState
                  icon={Ruler}
                  title="No recommendation yet"
                  hint="Fill out the form and submit to get your personalized size recommendation"
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}