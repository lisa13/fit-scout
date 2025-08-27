import { z } from 'zod'

// Size suggestion input schema
export const SizeSuggestInputSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  category: z.enum(['shoes', 'clothing', 'accessories'], {
    errorMap: () => ({ message: 'Category must be shoes, clothing, or accessories' }),
  }),
  fitPref: z.enum(['slim', 'regular', 'loose'], {
    errorMap: () => ({ message: 'Fit preference must be slim, regular, or loose' }),
  }),
  measurements: z.object({
    chest_cm: z.number().min(50).max(200).optional(),
    waist_cm: z.number().min(50).max(200).optional(),
    hip_cm: z.number().min(50).max(200).optional(),
    shoulder_cm: z.number().min(30).max(100).optional(),
    inseam_cm: z.number().min(50).max(150).optional(),
    foot_mm: z.number().min(200).max(400).optional(),
  }),
})

export type SizeSuggestInput = z.infer<typeof SizeSuggestInputSchema>

// Size suggestion output schema
export const SizeSuggestOutputSchema = z.object({
  sizeLabel: z.string(),
  confidence: z.number().min(0).max(1),
  rationale: z.string(),
  alternates: z.array(z.string()),
})

export type SizeSuggestOutput = z.infer<typeof SizeSuggestOutputSchema>

// Find request schema
export const FindRequestSchema = z.object({
  url: z.string().url().optional(),
  caption: z.string().optional(),
  text: z.string().optional(),
})

export type FindRequest = z.infer<typeof FindRequestSchema>

// Find response schema
export const FindResponseSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    brandId: z.string(),
    category: z.string(),
    price: z.number(),
    image: z.string(),
    score: z.number().min(0).max(1),
    reason: z.string().optional(),
  })),
})

export type FindResponse = z.infer<typeof FindResponseSchema>

// Re-export all schemas
export * from './schemas'
