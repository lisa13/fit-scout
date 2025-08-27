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
    
    let queryText = ''
    
    if (validatedData.url) {
      // For demo purposes, we'll use a placeholder text
      // In a real implementation, you'd fetch OG title/keywords from the URL
      queryText = `product from ${validatedData.url}`
    } else if (validatedData.caption) {
      queryText = validatedData.caption
    } else if (validatedData.text) {
      queryText = validatedData.text
    } else {
      return c.json({ error: 'Either URL, caption, or text is required' }, 400)
    }
    
    // Generate embedding for query
    const queryEmbedding = await embedText(queryText)
    
    // Get products with embeddings
    const products = getProducts()
    const productsWithEmbeddings = products.filter((product) => product.textVec !== null)
    const productEmbeddings = productsWithEmbeddings.map((product) => product.textVec as number[])
    
    if (productEmbeddings.length === 0) {
      return c.json({ error: 'No product embeddings available. Run the embed script first.' }, 500)
    }
    
    // Find top 6 similar products
    const similarIndices = findTopKSimilar(queryEmbedding, productEmbeddings, 6)
    
    // Build response
    const items = similarIndices.map(({ index, similarity }) => {
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
