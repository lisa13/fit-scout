import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { 
  SizeSuggestInputSchema, 
  FindRequestSchema,
  FindResponseSchema 
} from '@fit-scout/types'
import { suggestSize } from '@fit-scout/utils'
import { embedText, findTopKSimilar } from '@fit-scout/ai'
import { getProducts } from '@fit-scout/db'

// Stopwords for tokenization
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'i', 'you', 'we', 'they', 'this',
  'these', 'those', 'or', 'but', 'if', 'when', 'where', 'why',
  'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'can', 'could', 'should',
  'would', 'may', 'might', 'must', 'shall'
])

// Simple tokenization utility
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(token => token.length > 0 && !STOPWORDS.has(token))
    .filter((token, index, arr) => arr.indexOf(token) === index) // Dedupe
}

// Jaccard similarity between two sets
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  const union = new Set([...setA, ...setB])
  return union.size === 0 ? 0 : intersection.size / union.size
}

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

// Health check
app.get('/v1/healthz', (c) => {
  return c.json({ ok: true })
})

// Size suggestion endpoint
app.post('/v1/size/suggest', async (c) => {
  try {
    const body = await c.req.json()
    
    // Validate input
    const validatedData = SizeSuggestInputSchema.parse(body)
    
    // Get size suggestion
    const suggestion = suggestSize(validatedData)
    
    return c.json(suggestion)
  } catch (error) {
    console.error('Size suggestion error:', error)
    return c.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      400
    )
  }
})

// Find similar products endpoint
app.post('/v1/find', async (c) => {
  try {
    const body = await c.req.json()
    
    // Validate input
    const validatedData = FindRequestSchema.parse(body)
    
    let cue = ''
    
    if (validatedData.url) {
      // For demo purposes, we'll use a placeholder text
      // In a real implementation, you'd fetch OG title/keywords from the URL
      cue = `product from ${validatedData.url}`
    } else if (validatedData.caption) {
      cue = validatedData.caption
    } else if (validatedData.text) {
      cue = validatedData.text
    } else {
      return c.json({ error: 'Either URL, caption, or text is required' }, 400)
    }
    
    // Get all products
    const products = getProducts()
    const productsWithEmbeddings = products.filter((product) => product.textVec !== null)
    
    let items: Array<{
      id: string
      title: string
      brandId: string
      category: string
      price: number
      image: string
      score: number
      reason?: string
    }> = []
    
    if (productsWithEmbeddings.length > 0) {
      // Use cosine ranking with embeddings (current behavior)
      const queryEmbedding = await embedText(cue)
      const productEmbeddings = productsWithEmbeddings.map((product) => product.textVec as number[])
      const similarIndices = findTopKSimilar(queryEmbedding, productEmbeddings, 24)
      
      items = similarIndices.map(({ index, similarity }) => {
        const product = productsWithEmbeddings[index]
        return {
          id: product.id,
          title: product.title,
          brandId: product.brandId,
          category: product.category,
          price: product.price,
          image: product.image,
          score: Math.round(similarity * 100) / 100,
          reason: `Matched tags: ${product.tags.slice(0, 3).join(', ')}`,
        }
      })
    } else {
      // Use lightweight tag/keyword ranking
      const queryTokens = new Set(tokenize(cue))
      
      // Score all products
      const scoredProducts = products.map(product => {
        const productTags = new Set(product.tags.map(tag => tag.toLowerCase()))
        let score = jaccardSimilarity(queryTokens, productTags)
        
        // Add 0.1 bonus if brand/category is inferred from query
        const cueLower = cue.toLowerCase()
        if (cueLower.includes(product.brandId.toLowerCase())) {
          score += 0.1
        }
        if (cueLower.includes(product.category.toLowerCase())) {
          score += 0.1
        }
        
        return {
          product,
          score: Math.min(score, 1.0) // Cap at 1.0
        }
      })
      
      // Sort by score and take top 24
      scoredProducts.sort((a, b) => b.score - a.score)
      const topProducts = scoredProducts.slice(0, 24)
      
      items = topProducts.map(({ product, score }) => ({
        id: product.id,
        title: product.title,
        brandId: product.brandId,
        category: product.category,
        price: product.price,
        image: product.image,
        score: Math.round(score * 100) / 100,
        reason: `Matched tags: ${product.tags.slice(0, 3).join(', ')}`,
      }))
    }
    
    const response = { items }
    
    // Validate response
    FindResponseSchema.parse(response)
    
    return c.json(response)
  } catch (error) {
    console.error('Find products error:', error)
    return c.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      400
    )
  }
})

const port = parseInt(process.env.PORT || '3001')
console.log(`🚀 Server is running on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
