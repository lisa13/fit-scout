import 'server-only'

let embeddingPipeline: any = null

/**
 * Initialize the embedding pipeline (loads model once)
 */
async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    const { pipeline } = await import('@xenova/transformers')
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embeddingPipeline
}

/**
 * Generate embeddings for text using MiniLM
 * @param text - Text to embed
 * @returns Embedding vector
 */
export async function embedText(text: string): Promise<number[]> {
  try {
    const pipeline = await getEmbeddingPipeline()
    const result = await pipeline(text, { pooling: 'mean', normalize: true })
    
    // Convert tensor to array
    const embedding = Array.from(result.data) as number[]
    return embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

/**
 * Generate embeddings for multiple texts
 * @param texts - Array of texts to embed
 * @returns Array of embedding vectors
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = []
  
  for (const text of texts) {
    const embedding = await embedText(text)
    embeddings.push(embedding)
  }
  
  return embeddings
}

// Export cosine similarity functions
export * from './cosine'
