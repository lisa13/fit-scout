import { describe, it, expect, vi, beforeEach } from 'vitest'
import app from '../src/index'

// Mock the database and AI modules
vi.mock('@fit-scout/db', () => ({
  getProducts: vi.fn(() => [
    {
      id: '1',
      title: 'Test Product',
      brandId: 'nike',
      category: 'shoes',
      price: 100,
      image: 'test.jpg',
      textVec: null, // No embeddings - will use tag ranking
      tags: ['sneaker', 'running', 'athletic']
    },
    {
      id: '2',
      title: 'Another Product',
      brandId: 'adidas',
      category: 'clothing',
      price: 80,
      image: 'test2.jpg',
      textVec: [0.1, 0.2, 0.3], // Has embeddings - will use cosine ranking
      tags: ['casual', 'comfortable', 'cotton']
    }
  ])
}))

vi.mock('@fit-scout/ai', () => ({
  embedText: vi.fn(() => Promise.resolve([0.1, 0.2, 0.3])),
  findTopKSimilar: vi.fn(() => [{ index: 0, similarity: 0.95 }])
}))

describe('API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return health check', async () => {
    const response = await app.fetch(new Request('http://localhost/v1/healthz'))
    const data = await response.json()
    
    expect(response.ok).toBe(true)
    expect(data).toEqual({ ok: true })
  })

  it('should suggest size for valid request', async () => {
    const requestBody = {
      brand: 'nike',
      category: 'shoes',
      measurements: { foot_mm: 270 },
      fitPreference: 'regular'
    }

    const response = await app.fetch(
      new Request('http://localhost/v1/size/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
    )

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data).toHaveProperty('size')
    expect(data).toHaveProperty('confidence')
    expect(data).toHaveProperty('rationale')
  })

  it('should find similar products using cosine ranking when embeddings available', async () => {
    const requestBody = {
      url: 'https://example.com/product'
    }

    const response = await app.fetch(
      new Request('http://localhost/v1/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
    )

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data).toHaveProperty('items')
    expect(Array.isArray(data.items)).toBe(true)
    expect(data.items.length).toBeGreaterThan(0)
  })

  it('should find similar products using tag ranking when no embeddings available', async () => {
    // Mock products with no embeddings
    const { getProducts } = await import('@fit-scout/db')
    vi.mocked(getProducts).mockReturnValueOnce([
      {
        id: '1',
        title: 'Nike Running Shoes',
        brandId: 'nike',
        category: 'shoes',
        price: 100,
        image: 'test.jpg',
        textVec: null, // No embeddings
        tags: ['running', 'athletic', 'nike']
      },
      {
        id: '2',
        title: 'Adidas Casual Shirt',
        brandId: 'adidas',
        category: 'clothing',
        price: 50,
        image: 'test2.jpg',
        textVec: null, // No embeddings
        tags: ['casual', 'cotton', 'comfortable']
      }
    ])

    const requestBody = {
      text: 'running shoes nike'
    }

    const response = await app.fetch(
      new Request('http://localhost/v1/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
    )

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data).toHaveProperty('items')
    expect(Array.isArray(data.items)).toBe(true)
    expect(data.items.length).toBeGreaterThan(0)
    
    // Should prioritize Nike running shoes
    const nikeProduct = data.items.find((item: any) => item.brandId === 'nike')
    expect(nikeProduct).toBeDefined()
    expect(nikeProduct.score).toBeGreaterThan(0)
  })
})
