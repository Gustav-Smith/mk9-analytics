# Decisions - MK9 Analytics

## Overview
This document records important architectural and technical decisions made for the MK9 Analytics project.

## Decision Records

### ADR-001: Use Next.js App Router
**Status**: Accepted  
**Date**: July 9, 2026  
**Context**: We needed to choose a routing and rendering strategy for the React application.  
**Decision**: We chose to use the Next.js App Router (introduced in Next.js 13) for its hybrid rendering capabilities (SSR, SSG, ISR) and integrated API routes.  
**Consequences**: 
- Enables static generation for public pages and server-side rendering for dynamic content.
- Requires learning the new routing paradigm (app directory vs pages directory).
- Provides built-in API routes, reducing backend complexity.

### ADR-002: Adopt Prisma ORM
**Status**: Accepted  
**Date**: July 9, 2026  
**Context**: We needed an ORM for type-safe database access with PostgreSQL.  
**Decision**: Selected Prisma 6 for its excellent TypeScript integration, migration system, and developer experience.  
**Consequences**:
- Provides auto-generated TypeScript models for database entities.
- Requires learning Prisma's query API.
- Migrations are managed via Prisma Migrate, ensuring schema consistency.
- Slight learning curve but significant productivity gains.

### ADR-003: Domain-Driven Design with Modular Structure
**Status**: Accepted  
**Date**: July 10, 2026  
**Context**: The project needed to scale with multiple features (imports, dashboard, promoters, etc.) while maintaining clear boundaries.  
**Decision**: Organized code by business domains (modules) rather than technical layers, implementing DDD principles with each module containing its own UI, services, repositories, etc.  
**Consequences**:
- Clear separation of concerns between features.
- Easier to locate and modify code related to specific business capabilities.
- Potential for duplication of cross-cutting concerns (mitigated by shared module).
- Requires discipline to avoid tight coupling between modules.

### ADR-004: Use Tailwind CSS and Shadcn/UI
**Status**: Accepted  
**Date**: July 10, 2026  
**Context**: Needed a styling system and UI component library for rapid, consistent UI development.  
**Decision**: Chose Tailwind CSS for utility-first styling and Shadcn/ui for accessible, primitive UI components built on Radix UI.  
**Consequences**:
- Enables rapid UI development with consistent styling.
- Requires utility-first mindset shift from traditional CSS.
- Shadcn/ui provides customizable components that align with our design system.
- Bundle size considerations mitigated by tree-shaking.

### ADR-005: Implement Singleton Prisma Client
**Status**: Accepted  
**Date**: July 11, 2026  
**Context**: Needed to ensure efficient database connection reuse across the application.  
**Decision**: Created a singleton PrismaClient instance in `src/lib/prisma.ts` to be shared throughout the application.  
**Consequences**:
- Prevents excessive database connections.
- Ensures consistent Prisma client configuration.
- Requires careful handling in serverless environments (Next.js API routes handle this automatically).
- Simplifies database access patterns.

### ADR-006: Use Zod for Validation
**Status**: Accepted  
**Date**: July 11, 2026  
**Context**: Needed a robust validation library for input data at API boundaries and domain level.  
**Decision**: Selected Zod for its TypeScript-first approach, schema declaration, and static type inference.  
**Consequences**:
- Provides runtime validation with static type guarantees.
- Enables shared validation schemas between frontend and backend.
- Slight bundle size impact but worth the safety benefits.
- Requires learning Zod's API but is intuitive for TypeScript developers.

### ADR-007: Adopt React Query for Server State
**Status**: Accepted  
**Date**: July 12, 2026  
**Context**: Needed a solution for data fetching, caching, and state management in React components.  
**Decision**: Chose React Query (@tanstack/react-query) for its powerful caching, background updates, and mutation helpers.  
**Consequences**:
- Reduces boilerplate for data fetching and state synchronization.
- Provides intelligent caching and deduplication of requests.
- Requires learning React Query's concepts (queries, mutations, invalidation).
- Excellent documentation and community support.

### ADR-008: Docker Compose for Local Development
**Status**: Accepted  
**Date**: July 12, 2026  
**Context**: Needed a consistent way to set up PostgreSQL and n8n for local development.  
**Decision**: Used Docker Compose to define and run multi-container PostgreSQL and n8n services.  
**Consequences**:
- Ensures consistent development environments across team members.
- Simplifies onboarding for new developers.
- Adds slight complexity to local setup but eliminates "works on my machine" issues.
- Requires Docker Desktop or equivalent to be installed.

### ADR-009: Conventional Commits for Git History
**Status**: Accepted  
**Date**: July 13, 2026  
**Context**: Needed a standardized format for commit messages to enable automated changelog generation and clear communication.  
**Decision**: Adopted the Conventional Commits specification (feat:, fix:, docs:, etc.).  
**Consequences**:
- Provides clear, searchable commit history.
- Enables automated tooling (version bumping, changelog generation).
- Requires team adherence to the convention.
- Improves readability of project history.

### ADR-010: Modular API Routes with Next.js
**Status**: Accepted  
**Date**: July 13, 2026  
**Context**: Needed to organize API routes as the application grows beyond a few endpoints.  
**Decision**: Organized API routes by domain in `src/app/api/[module]/[resource]/route.ts` following RESTful conventions.  
**Consequences**:
- Scalable structure for adding new endpoints.
- Consistent with module-based organization.
- Requires attention to avoid deep nesting.
- Leverages Next.js' file-based routing for API endpoints.

## Pending Decisions

### Authentication Strategy
**Status**: Pending  
**Context**: Need to decide on authentication mechanism (JWT, sessions, third-party providers).  
**Considerations**:
- Security implications and implementation complexity.
- User experience and integration with Next.js.
- Future needs for social login or SSO.
- Decision expected by end of Sprint 2.

### State Management for Client State
**Status**: Pending  
**Context**: Beyond server state (handled by React Query), need to manage client-side UI state (modals, form state, etc.).  
**Considerations**:
- React Context vs. Zustand vs. Jotai vs. Redux Toolkit.
- Bundle size and learning curve.
- Decision expected by end of Sprint 2.

### Real-time Updates Strategy
**Status**: Pending  
**Context**: For live dashboard updates (e.g., visit completions).  
**Considerations**:
- WebSocket vs. Server-Sent Events vs. polling.
- Integration with Next.js and React Query.
- Infrastructure complexity (WebSocket server or service).
- Decision expected by end of Sprint 3.

-- 
*Last updated: July 16, 2026*