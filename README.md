# FitScout Monorepo

A pnpm monorepo containing the FitScout application with separate web and API services.

## 🏗️ Architecture

```
fit-scout/
├── apps/
│   ├── web/          # Next.js 15 frontend application
│   └── api/          # Hono API server
├── packages/
│   ├── types/        # Shared TypeScript types and Zod schemas
│   ├── utils/        # Business logic (size suggestions)
│   ├── ai/           # AI/ML utilities (embeddings, similarity)
│   └── db/           # Data access layer
└── package.json      # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

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

- **Web app** at http://localhost:3000
- **API server** at http://localhost:3001

## 📦 Packages

### `@fit-scout/types`

Shared TypeScript types and Zod validation schemas for:

- Size suggestion requests/responses
- Product search requests/responses
- Brand and product data structures

### `@fit-scout/utils`

Business logic for size recommendations:

- Rule-based sizing algorithm
- Garment-first approach with body measurement fallback
- Confidence scoring and rationale generation

### `@fit-scout/ai`

AI/ML utilities:

- Text embedding using MiniLM
- Cosine similarity calculations
- Product embedding generation script

### `@fit-scout/db`

Data access layer:

- Brand, size chart, and product data
- Filtering and query utilities
- Seed data management

## 🛠️ Development

### Available Scripts

```bash
# Root workspace
pnpm dev          # Start both web and API in development
pnpm build        # Build both applications
pnpm start        # Start both applications in production
pnpm embed        # Generate product embeddings
pnpm typecheck    # Type check all packages

# Web app
pnpm -C apps/web dev
pnpm -C apps/web build
pnpm -C apps/web test

# API server
pnpm -C apps/api dev
pnpm -C apps/api build
```

### Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## 🧪 Testing

### Unit Tests

```bash
pnpm -C apps/web test
```

### E2E Tests

```bash
pnpm -C apps/web test:e2e
```

## 🔧 API Endpoints

### Health Check

```
GET /v1/healthz
```

### Size Suggestions

```
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

```
POST /v1/find
Content-Type: application/json

{
  "url": "https://example.com/product",
  "caption": "Blue running shoes",
  "text": "Nike running shoes"
}
```

## 🏛️ Project Structure

### Web App (`apps/web/`)

- Next.js 15 with App Router
- TypeScript + Tailwind CSS
- shadcn/ui components
- Form handling with react-hook-form + Zod
- Drag-and-drop file uploads

### API Server (`apps/api/`)

- Hono framework
- CORS enabled
- Request validation with Zod
- Error handling and logging

### Shared Packages

- **types**: Zod schemas and TypeScript interfaces
- **utils**: Pure business logic functions
- **ai**: AI/ML utilities with lazy loading
- **db**: Data access and seed management

## 🔄 Data Flow

1. **Web App** → **API Server** via HTTP requests
2. **API Server** → **Shared Packages** for business logic
3. **AI Package** handles embeddings and similarity
4. **DB Package** provides data access
5. **Types Package** ensures type safety across the stack

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

### Start Production Servers

```bash
pnpm start
```

## 📝 Contributing

1. Follow the monorepo structure
2. Use workspace dependencies (`workspace:*`)
3. Keep packages focused and single-purpose
4. Maintain type safety across all packages
5. Update tests when modifying business logic

## 🔍 Troubleshooting

### Common Issues

1. **Embeddings not working**: Run `pnpm embed` first
2. **Type errors**: Run `pnpm typecheck` to identify issues
3. **API connection**: Check `NEXT_PUBLIC_API_URL` environment variable
4. **CORS errors**: Verify `CORS_ORIGIN` in API environment

### Development Tips

- Use `pnpm -C <package>` to run commands in specific packages
- Check package dependencies with `pnpm list`
- Use workspace aliases for clean imports
- Keep shared logic in packages, not apps
