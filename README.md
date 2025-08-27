# Fit Scout - Monorepo

A pnpm monorepo containing a Next.js web app and Hono API for size recommendations and product search.

## Structure

```
fit-scout/
├── apps/
│   ├── web/          # Next.js 15 frontend app
│   └── api/          # Hono API server
├── packages/
│   ├── types/        # Shared TypeScript types and Zod schemas
│   ├── utils/        # Shared utility functions (size suggestion logic)
│   ├── ai/           # AI/ML utilities (embeddings, cosine similarity)
│   └── db/           # Data access layer (brands, size charts, products)
└── package.json      # Root workspace configuration
```

## Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Generate product embeddings:**

   ```bash
   pnpm embed
   ```

3. **Start development servers:**
   ```bash
   pnpm dev
   ```

This will start:

- Web app: http://localhost:3000
- API server: http://localhost:3001

## Development

### Available Scripts

- `pnpm dev` - Start both web and API in development mode
- `pnpm build` - Build both web and API for production
- `pnpm start` - Start both web and API in production mode
- `pnpm embed` - Generate embeddings for product search
- `pnpm typecheck` - Run TypeScript type checking across all packages

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## Features

### Web App (`apps/web`)

- **Size Recommendation Form** (`/fit`) - Get personalized size suggestions based on measurements
- **Product Search** (`/find`) - Find similar products by URL or image upload
- **Modern UI** - Built with Next.js 15, Tailwind CSS, and shadcn/ui components

### API Server (`apps/api`)

- **Size Suggestion** (`POST /v1/size/suggest`) - Rule-based size recommendations
- **Product Search** (`POST /v1/find`) - AI-powered similarity search using embeddings
- **Health Check** (`GET /v1/healthz`) - API health monitoring

### Shared Packages

#### `@fit-scout/types`

- Zod schemas for API validation
- TypeScript type definitions
- Shared interfaces for size suggestions and product search

#### `@fit-scout/utils`

- `suggestSize()` function for size recommendations
- Garment-first sizing with body measurement fallback
- Confidence scoring and rationale generation

#### `@fit-scout/ai`

- Text embedding using MiniLM model
- Cosine similarity calculations
- Product embedding generation script

#### `@fit-scout/db`

- Data loading functions for brands, size charts, and products
- Seed data management

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Hono (lightweight web framework)
- **AI/ML**: @xenova/transformers (MiniLM embeddings)
- **Validation**: Zod schemas
- **Monorepo**: pnpm workspaces
- **Testing**: Vitest, Testing Library, Playwright

## API Endpoints

### Size Suggestion

```http
POST /v1/size/suggest
Content-Type: application/json

{
  "brand": "nike",
  "category": "clothing",
  "fitPref": "regular",
  "measurements": {
    "chest_cm": 96,
    "waist_cm": 81
  }
}
```

### Product Search

```http
POST /v1/find
Content-Type: application/json

{
  "url": "https://example.com/product",
  "caption": "blue running shoes",
  "text": "athletic footwear"
}
```

## Contributing

1. Install dependencies: `pnpm install`
2. Generate embeddings: `pnpm embed`
3. Start development: `pnpm dev`
4. Make changes in the appropriate package/app
5. Test changes: `pnpm typecheck`

## License

MIT
