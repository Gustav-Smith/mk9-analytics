# MK9 Analytics - Architecture Documentation

## Overview
This document describes the architecture of the MK9 Analytics project.

## Architectural Layers

### 1. Presentation Layer
- **Location**: `src/app/` (Next.js pages), `src/components/` (reusable UI)
- **Responsibility**: Rendering UI, handling user interactions, managing local component state
- **Technologies**: React Server Components, Client Components, React Hooks, Tailwind CSS, Shadcn/UI

### 2. Application Layer
- **Location**: `src/app/api/` (Next.js API routes), `src/modules/*/services/` (application services)
- **Responsibility**: Orchestrating use cases, coordinating between domains, managing transactions, applying cross-entity business rules
- **Patterns**: Application Services, implicit CQRS through RESTful endpoints

### 3. Domain Layer
- **Location**: `prisma/schema.prisma` (domain models), `src/modules/*/types/` (rich domain types), `src/modules/*/schemas/` (domain validation with Zod)
- **Responsibility**: Defining business entities, value objects, aggregates, invariants, and pure business logic
- **Technologies**: Prisma ORM (as object-relational mapper), TypeScript Interfaces/Types, Zod for domain validation

### 4. Infrastructure Layer
- **Location**: `src/lib/` (shared utilities), `src/modules/*/repositories/` (data access implementations), `prisma/` (migrations, seed)
- **Responsibility**: Implementing technical details like database access, external service integrations, file processing
- **Technologies**: Prisma Client, database drivers, parsing libraries (xlsx, papaparse), HTTP clients (axios)

## Communication Between Layers

- **Presentation → Application**: Via REST API calls (using fetch/axios) or Server Actions (future implementations)
- **Application → Domain**: Through direct calls to application services that utilize domain models and repositories
- **Domain → Infrastructure**: Via repository interfaces (TypeScript) implemented using Prisma Client
- **Infrastructure → Presentation**: Through API responses consumed by React components to update UI

## Architectural Patterns

### Domain-Driven Design (DDD)
- Core modeled around central Trade Marketing concepts (Operation, Visit, Promoter, Store, Industry)
- Clear module boundaries correspond to bounded contexts (imports, dashboard, operations)

### Feature-Based Modularity
- Code organized by business capabilities rather than technical layers
- Each module contains everything related to a feature (imports, dashboard, analytics, etc.) with its own application, domain, and infrastructure layers

### Repository Pattern
- Each domain entity has an abstract repository defined in its domain layer
- Concrete implementations in the infrastructure layer
- Decouples business logic from persistence details

### Service Layer
- Application orchestrators containing use-case logic that doesn't belong to entities or repositories
- Example: ImportService coordinating upload → parsing → validation → persistence → logging

### Implicit Event-Driven Architecture
- Through n8n and webhooks, the system reacts to external events (new file in Google Drive) without tight coupling

## Key Architectural Decisions

### Use of Next.js App Router
- Chosen for its hybrid rendering capabilities (SSR, SSG, ISR) and built-in API routes
- Enables both static and dynamic rendering as needed

### Prisma ORM Selection
- Provides type-safe database access with automatic TypeScript type generation
- Includes migration system and seamless PostgreSQL integration

### Modular Organization by Feature
- Each feature module (dashboard, imports, etc.) contains its own UI, services, repositories, etc.
- Reduces cognitive load and improves maintainability

### Separation of Concerns via Layers
- Clear separation between presentation, application, domain, and infrastructure concerns
- Enables independent evolution of layers

## Diagrams

See `docs/diagrams/architecture.mmd` for a visual representation of the architecture.