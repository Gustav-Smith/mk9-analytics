# MK9 Analytics Architecture

## Overview
MK9 Analytics follows a hybrid architecture combining Domain-Driven Design (DDD) principles with modular organization to ensure scalability, maintainability, and clear separation of concerns.

## Architectural Layers

### 1. Presentation Layer
**Location**: `src/app/` (Next.js pages), `src/components/` (reusable UI components)
**Responsibility**: Rendering UI, handling user interactions, managing local component state
**Technologies**: React Server Components, Client Components, React Hooks, Tailwind CSS, Shadcn/UI

### 2. Application Layer
**Location**: `src/app/api/` (Next.js API routes), `src/modules/*/services/` (application services)
**Responsibility**: Orchestrating use cases, coordinating between domains, managing transactions, applying cross-entity business rules
**Patterns**: Application Services, implicit CQRS through RESTful endpoints

### 3. Domain Layer
**Location**: `prisma/schema.prisma` (domain models), `src/modules/*/types/` (rich domain types), `src/modules/*/schemas/` (domain validation with Zod)
**Responsibility**: Defining business entities, value objects, aggregates, invariants, and pure business logic
**Technologies**: Prisma ORM (as object-relational mapper), TypeScript Interfaces/Types, Zod for domain validation

### 4. Infrastructure Layer
**Location**: `src/lib/` (shared utilities), `src/modules/*/repositories/` (data access implementations), `prisma/` (migrations, seed)
**Responsibility**: Implementing technical details like database access, external service integrations, file processing
**Technologies**: Prisma Client, database drivers, parsing libraries (xlsx, papaparse), HTTP clients (axios)

## Architectural Patterns

### Domain-Driven Design (DDD)
- The core domain is modeled around central Trade Marketing concepts (Operation, Visit, Promoter, Store, Industry)
- Clear module boundaries correspond to bounded contexts (imports, dashboard, operations, etc.)

### Feature-Based Modularity
- Code is organized by business capabilities rather than technical layers
- Each module contains everything related to a feature (imports, dashboard, analytics, etc.) with its own application, domain, and infrastructure layers

### Repository Pattern
- Each domain entity has an abstract repository defined in its domain layer
- Concrete implementations exist in the infrastructure layer
- This decouples business logic from persistence details

### Service Layer
- Application orchestrators containing use-case logic that doesn't belong to entities or repositories
- Example: ImportService coordinating upload → parsing → validation → persistence → logging

### Implicit Event-Driven Architecture
- Through n8n and webhooks, the system reacts to external events (new file in Google Drive) without tight coupling

## Communication Between Layers

### Presentation → Application
- Via REST API calls (using fetch/axios) or Server Actions (future implementations)

### Application → Domain
- Through direct calls to application services that utilize domain models and repositories

### Domain → Infrastructure
- Via repository interfaces (TypeScript) implemented using Prisma Client

### Infrastructure → Presentation
- Through API responses consumed by React components to update UI

## Benefits of This Architecture
- Database changes affect only the infrastructure layer
- UI improvements don't require business logic modifications
- New data sources can be added via new infrastructure adapters
- Complex business rules can be tested in isolation without database or UI dependencies