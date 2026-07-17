# AI Context - MK9 Analytics

## Architecture Overview
MK9 Analytics follows a hybrid architecture combining Domain-Driven Design (DDD) principles with modular organization. The system is structured in four layers:

1. **Presentation Layer**: Next.js pages and reusable UI components
2. **Application Layer**: RESTful API routes and application services
3. **Domain Layer**: Prisma schema, TypeScript interfaces, and Zod validation schemas
4. **Infrastructure Layer**: Shared utilities, repository implementations, database migrations

## Coding Standards
- Use TypeScript strict mode (enabled in tsconfig.json)
- Follow ESLint and Prettier configurations
- Functional components with React hooks
- Named exports for components (default export only for pages)
- Absolute imports using @/ prefix
- PascalCase for components and types, camelCase for functions and variables
- UPPER_SNAKE_CASE for constants

## Naming Conventions
- Files: Button.tsx (components), formatDate.ts (utils)
- Functions: calculateTotal(), handleSubmit()
- Variables: userCount, isLoading
- Constants: MAX_UPLOAD_SIZE, API_ENDPOINT
- Types/Interfaces: UserProps, VisitFormData
- Enums: UserRole, VisitStatus (PascalCase, singular)
- Database Tables: Match Prisma model names (User, Visit)
- API Routes: kebab-case in URLs (/api/promotores)

## State Management
- Use React Query (@tanstack/react-query) for server state
- Use React Context or Zustand for global client state when necessary
- Prefer server state over client state
- Avoid prop drilling by combining context with custom hooks

## Data Fetching
- Prefer React Query's useQuery and useMutation
- Implement proper error boundaries and loading states
- Optimize queries with selective field selection (Prisma select)

## Error Handling
- Use try/catch for asynchronous operations
- Implement error boundaries in React components
- Return appropriate HTTP status codes in API routes
- Log errors to console in development, external service in production
- Provide user-friendly error messages without exposing system details

## Module Structure
Each feature module in src/modules/ follows this structure:
- components/: Module-specific UI components
- hooks/: Custom React hooks for the module
- pages/: Next.js pages related to the module
- repositories/: Data access implementations
- services/: Application logic orchestration
- schemas/: Zod validation schemas
- types/: Module-specific TypeScript types
- utils/: Module-specific utility functions

## What Not to Modify
- prisma/schema.prisma: Database structure changes require migrations
- src/lib/prisma.ts: Singleton PrismaClient implementation
- Next.js core configuration (next.config.ts, tsconfig.json) unless necessary
- Docker configuration unless understanding container orchestration

## How to Continue the Project
1. Complete the import module (Sprint 2) by implementing parser, validator, and service
2. Implement authentication middleware for route protection
3. Complete CRUD operations for core entities (operations, stores, industries)
4. Enhance dashboard with real-time data connections
5. Add comprehensive test suite
6. Implement planned integrations (Google Drive, WhatsApp, n8n workflows)