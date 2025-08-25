/**
 * Calculate cosine similarity between two vectors
 * @param vecA - First vector
 * @param vecB - Second vector
 * @returns Cosine similarity score between 0 and 1
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}

/**
 * Find top K most similar vectors
 * @param queryVec - Query vector
 * @param vectors - Array of vectors to compare against
 * @param k - Number of top results to return
 * @returns Array of indices and similarity scores
 */
export function findTopKSimilar(
  queryVec: number[],
  vectors: number[][],
  k: number
): Array<{ index: number; similarity: number }> {
  const similarities = vectors.map((vec, index) => ({
    index,
    similarity: cosineSimilarity(queryVec, vec),
  }))

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k)
}
