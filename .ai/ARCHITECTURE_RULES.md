# Architecture Rules - MK9 Analytics

## Architectural Layers

### 1. Presentation Layer
- **Location**: `src/app/` (Next.js pages), `src/components/` (reusable UI)
- **Responsibility**: Rendering UI, handling user interactions, managing local component state
- **Technologies**: React Server Components, Client Components, React Hooks, Tailwind CSS, Shadcn/UI
- **Rules**:
  - Use Server Components by default for data fetching
  - Use Client Components only when necessary (interactive state, event handlers, browser APIs)
  - Keep components small and focused on a single responsibility
  - Use Shadcn/UI primitives for consistent UI
  - Follow atomic design principles for component composition

### 2. Application Layer
- **Location**: `src/app/api/` (Next.js API routes), `src/modules/*/services/` (application services)
- **Responsibility**: Orchestrating use cases, coordinating between domains, managing transactions, applying cross-entity business rules
- **Patterns**: Application Services, implicit CQRS through RESTful endpoints
- **Rules**:
  - Services should orchestrate use cases, not contain business logic
  - Business logic belongs in domain layer (entities, value objects)
  - Services should be thin orchestrators
  - Use Prisma transactions for multi-step operations
  - Handle errors appropriately and return meaningful HTTP status codes

### 3. Domain Layer
- **Location**: `prisma/schema.prisma` (domain models), `src/modules/*/types/` (rich domain types), `src/modules/*/schemas/` (domain validation with Zod)
- **Responsibility**: Defining business entities, value objects, aggregates, invariants, and pure business logic
- **Technologies**: Prisma ORM (as object-relational mapper), TypeScript Interfaces/Types, Zod for domain validation
- **Rules**:
  - Define clear boundaries between aggregates
  - Entities should encapsulate business logic and invariants
  - Value objects should be immutable
  - Use Zod for validation at domain boundaries
  - Keep domain objects free of infrastructure concerns

### 4. Infrastructure Layer
- **Location**: `src/lib/` (shared utilities), `src/modules/*/repositories/` (data access implementations), `prisma/` (migrations, seed)
- **Responsibility**: Implementing technical details like database access, external service integrations, file processing
- **Technologies**: Prisma Client, database drivers, parsing libraries (xlsx, papaparse), HTTP clients (axios)
- **Rules**:
  - Repositories should implement interfaces defined in domain layer
  - Infrastructure should depend on domain, not vice versa
  - Keep infrastructure concerns isolated
  - Use dependency injection where possible
  - Handle external service failures gracefully

## Architectural Patterns

### Domain-Driven Design (DDD)
- Core modeled around central Trade Marketing concepts (Operation, Visit, Promoter, Store, Industry)
- Clear module boundaries correspond to bounded contexts (imports, dashboard, operations)
- Each module contains everything related to a feature (imports, dashboard, analytics, etc.) with its own application, domain, and infrastructure layers

### Feature-Based Modularity
- Code organized by business capabilities rather than technical layers
- Each module contains everything related to a feature
- Modules are loosely coupled and highly cohesive

### Repository Pattern
- Each domain entity has an abstract repository defined in its domain layer
- Concrete implementations in the infrastructure layer using Prisma Client
- Decouples business logic from persistence details

### Service Layer
- Application orchestrators containing use-case logic that doesn't belong to entities or repositories
- Examples: ImportService coordinating upload → parsing → validation → persistence → logging

### Implicit Event-Driven Architecture
- Through n8n and webhooks, the system reacts to external events (new file in Google Drive) without tight coupling
- SyncLog entity tracks automated operations

## Communication Between Layers

### Presentation → Application
- Via REST API calls (using fetch/axios) or Server Actions (future implementations)

### Application → Domain
- Through direct calls to application services that utilize domain models and repositories

### Domain → Infrastructure
- Via repository interfaces (TypeScript) implemented using Prisma Client

### Infrastructure → Presentation
- Through API responses consumed by React components to update UI

## Layer Dependencies
- Presentation → Application → Domain ← Infrastructure
- Infrastructure can be used by Application and Presentation for cross-cutting concerns (logging, etc.)
- Domain should not depend on Infrastructure or Application
- Application should not depend on Presentation

## Dependency Rule
- Source code dependencies can only point inward
- Inner layers should not know about outer layers
- Outer layers can depend on inner layers

## Boundary Implementation
- Use interfaces (TypeScript) to define contracts between layers
- Depend on interfaces, not concrete implementations
- Use dependency injection to provide implementations

## Cross-Cutting Concerns
- Logging, caching, error handling should be implemented as middleware or decorators
- Avoid scattering cross-cutting concerns throughout the codebase
- Use Aspect-Oriented Programming principles where applicable

## Data Flow Principles
- Prefer immutable data structures where practical
- Use unidirectional data flow in React components
- Avoid direct DOM manipulation in React components
- Use React Query for server state management
- Keep component state local unless absolutely necessary to share

## Error Handling
- Handle errors at the appropriate layer
- Presentation layer: show user-friendly error messages
- Application layer: log errors and return appropriate HTTP status codes
- Domain layer: throw domain-specific exceptions that can be caught by application layer
- Infrastructure layer: handle technical exceptions and translate to domain exceptions when appropriate

## Validation
- Validate at the boundaries (application layer receiving input)
- Use Zod for schema validation
- Domain objects should enforce their own invariants
- Never trust client-side validation alone

## Security
- Validate and sanitize all inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Follow the principle of least privilege
- Keep dependencies updated
- Use environment variables for secrets
- Implement rate limiting where appropriate
- Use HTTPS in production
- Set appropriate security headers

## Performance
- Avoid N+1 query problems with Prisma's include/select
- Use pagination for large datasets
- Implement caching where appropriate (server-side with proper invalidation)
- Optimize bundle size with code splitting
- Use React.memo, useCallback, useMemo judiciously
- Optimize images and static assets

## Observability
- Implement structured logging
- Track key metrics (response times, error rates, business metrics)
- Distributed tracing for complex operations
- Health checks for all services
- Audit trails for sensitive operations

## Scalability
- Design stateless services where possible
- Use database connection pooling
- Implement proper indexing strategies
- Consider read replicas for read-heavy workloads
- Use message queues for asynchronous processing
- Design for horizontal scaling

## Testability
- Write unit tests for domain logic
- Write integration tests for application services
- Write end-to-end tests for critical user journeys
- Mock external dependencies in tests
- Aim for high test coverage without sacrificing quality
- Use test doubles (mocks, stubs, spies) appropriately

## Maintainability
- Follow consistent naming conventions
- Keep functions small and focused
- Use descriptive variable and function names
- Write self-documenting code
- Add comments only when necessary to explain why, not what
- Follow the Boy Scout Rule: leave the code cleaner than you found it
- Regularly refactor to improve design
- Remove dead code

## Extensibility
- Design for extension, not modification
- Use open/closed principle: entities should be open for extension but closed for modification
- Use dependency inversion principle
- Prefer composition over inheritance
- Use plugin architecture where appropriate
- Keep interfaces stable

## Simplicity
- Favor simple solutions over complex ones
- Avoid premature optimization
- Do the simplest thing that could possibly work
- Refactor when complexity becomes a problem
- Follow YAGNI (You Aren't Gonna Need It) principle
- Keep it simple, stupid (KISS)