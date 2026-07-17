# AI Instructions - MK9 Analytics

## Overview
This document provides instructions for AI agents working on the MK9 Analytics project. It outlines how to understand the project, make changes, and maintain consistency with the project's architecture and standards.

## Understanding the Project

### 1. Read the Documentation
- Start with `.ai/START_HERE.md` to get oriented.
- Read `.ai/PROJECT_CONTEXT.md` for the project overview.
- Review `.ai/CURRENT_STATE.md` to understand what's implemented and what's pending.
- Familiarize yourself with the architecture in `.ai/ARCHITECTURE_RULES.md` and `.ai/BUSINESS_RULES.md`.

### 2. Understand the Structure
- The project follows a modular, Domain-Driven Design structure.
- Each feature is in `src/modules/[module-name]/`.
- Layers within each module:
  - `components/` - UI components
  - `hooks/` - Custom React hooks
  - `pages/` - Next.js pages
  - `services/` - Application logic
  - `repositories/` - Data access
  - `schemas/` - Validation schemas
  - `types/` - TypeScript types
  - `utils/` - Utility functions
- Shared code is in `src/modules/shared/`.
- Infrastructure: `src/lib/` (shared utilities like Prisma client) and `prisma/` (database schema and migrations).
- Presentation: `src/app/` (Next.js pages and API routes) and `src/components/` (reusable UI components).

### 3. Coding Standards
- Follow the guidelines in `.ai/ARCHITECTURE_RULES.md` and `.ai/BUSINESS_RULES.md`.
- Use TypeScript strict mode.
- Follow ESLint and Prettier configurations.
- Use absolute imports with `@/` prefix.
- Components: PascalCase, functions and variables: camelCase, constants: UPPER_SNAKE_CASE.
- Prefer Server Components for data fetching; use Client Components only when necessary (interactivity, state, browser APIs).

## Making Changes

### 1. Before Making Changes
- Check `.ai/KNOWN_ISSUES.md` to avoid duplicating effort.
- Look for similar existing code to follow patterns.
- Ensure you understand the domain and business rules for the area you're modifying.
- If creating a new feature, consider if it fits in an existing module or requires a new one.

### 2. Making Changes
- **Database Changes**: 
  - Modify `prisma/schema.prisma` only when necessary.
  - Run `npx prisma migrate dev` to create a migration.
  - Update `prisma/seed.ts` if needed for test data.
  - Never modify the database directly; always use migrations.
  
- **API Changes**:
  - API routes are in `src/app/api/`.
  - Follow RESTful conventions.
  - Use appropriate HTTP status codes.
  - Validate input data using Zod schemas.
  
- **UI Changes**:
  - Follow the component structure in `.ai/DASHBOARD_RULES.md` (applies to all UI components).
  - Use Shadcn/UI primitives for consistency.
  - Ensure responsiveness and accessibility.
  
- **Testing**:
  - Write unit tests for new logic.
  - Update tests for changed behavior.
  - Follow the guidelines in `.ai/TESTING_RULES.md`.

### 3. After Making Changes
- Run linting: `npm run lint`
- Build the project: `npm run build`
- Test locally: `npm run dev`
- Ensure all tests pass.
- Update documentation if necessary.
- Commit with a conventional commit message.

## Communication
- Use clear, concise language in commit messages and comments.
- Follow the Conventional Commits standard.
- When in doubt, refer to existing code patterns.
- For complex changes, consider creating a branch and opening a pull request for review.

## Troubleshooting
- Check the console for errors and warnings.
- Verify environment variables are set correctly.
- Ensure the database is running and migrated.
- Look for similar issues in `.ai/KNOWN_ISSUES.md`.
- Use the browser's developer tools for frontend debugging.
- Use server logs for backend debugging.

-- 
*Last updated: July 16, 2026*