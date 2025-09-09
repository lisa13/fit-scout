// Centralized type definitions for FitScout web app

import type { ReactNode, ComponentType } from 'react'

// ===== API Types =====
export interface FindRequest {
  url?: string
  caption?: string
  text?: string
}

export interface FindResponse {
  items: Product[]
}

export interface Product {
  id: string
  title: string
  brandId: string
  category: string
  price: number
  image: string
  score: number
  reason?: string
}

export interface SizeSuggestRequest {
  brand: string
  category: 'shoes' | 'clothing' | 'accessories'
  fitPref: 'snug' | 'regular' | 'relaxed'
  measurements: {
    chest_cm?: number
    waist_cm?: number
    hips_cm?: number
    shoulder_cm?: number
    inseam_cm?: number
    foot_mm?: number
  }
}

export interface SizeSuggestResponse {
  sizeLabel: string
  confidence: number
  rationale: string
  alternates: string[]
}

// ===== Component Props Types =====
export interface ContainerProps {
  children: ReactNode
  className?: string
}

export interface ProductCardProps {
  image: string
  title: string
  brandName: string
  price: number
  score?: number
  reason?: string
}

export interface ConfidenceBarProps {
  value: number // 0-1
  className?: string
}

export interface ResultCardProps {
  sizeLabel: string
  confidence: number
  rationale: string
  alternates?: string[]
}

export interface QueryPanelProps {
  onSubmit: (data: { url?: string; caption?: string }) => void
  isLoading?: boolean
}

export interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>
  title: string
  hint?: string
  action?: ReactNode
}

export interface InlineErrorProps {
  message: string
  className?: string
}

export interface LoadingBlockProps {
  count?: number
  className?: string
}

// ===== Form Types =====
export interface SizeFormData {
  brand: string
  category: 'shoes' | 'clothing' | 'accessories'
  waist_cm?: number
  hips_cm?: number
  chest_cm?: number
  foot_mm?: number
  fitPref: 'snug' | 'regular' | 'relaxed'
}

// ===== Brand Types =====
export interface Brand {
  id: string
  name: string
  categories: string[]
}

// ===== Theme Types =====
export interface ThemeProviderProps {
  children: ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

// ===== Navigation Types =====
export interface NavLink {
  href: string
  label: string
  external?: boolean
}

// ===== Utility Types =====
export type QueryMode = 'url' | 'caption'

// ===== Event Handler Types =====
export type FormSubmitHandler = (e: React.FormEvent) => void
export type InputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void
export type TextareaChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => void
export type SelectChangeHandler = (value: string) => void
export type ButtonClickHandler = () => void

// ===== API Error Types =====
export interface ApiError {
  error: string
  message?: string
}

// ===== Loading States =====
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

// ===== Generic Response Types =====
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}
