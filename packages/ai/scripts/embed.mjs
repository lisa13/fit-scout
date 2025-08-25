import { pipeline } from '@xenova/transformers'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function embedProducts() {
  try {
    console.log('Loading MiniLM model...')
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    
    console.log('Loading products data...')
    const productsPath = path.join(__dirname, '..', 'data', 'products.json')
    const productsData = await fs.readFile(productsPath, 'utf-8')
    const products = JSON.parse(productsData)
    
    console.log(`Embedding ${products.length} products...`)
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      // Create text representation for embedding
      const text = `${product.title} ${product.tags.join(' ')}`
      
      console.log(`Embedding product ${i + 1}/${products.length}: ${product.title}`)
      
      // Generate embedding
      const result = await embedder(text, { pooling: 'mean', normalize: true })
      const embedding = Array.from(result.data)
      
      // Update product with embedding
      products[i].textVec = embedding
    }
    
    console.log('Writing updated products data...')
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2))
    
    console.log('✅ Product embeddings completed successfully!')
    console.log(`📊 Embedded ${products.length} products`)
    
  } catch (error) {
    console.error('❌ Error embedding products:', error)
    process.exit(1)
  }
}

// Run the embedding process
embedProducts()
