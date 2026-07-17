# Module Index - MK9 Analytics

## Overview
This document provides an index of all modules in the MK9 Analytics system, following Domain-Driven Design principles. Each module represents a bounded context with its own application, domain, and infrastructure layers.

## Module List

### Core Modules
1. [dashboard](./MODULES.md#dashboard-module) - Data visualization and operational monitoring
2. [imports](./MODULES.md#imports-module) - Spreadsheet ingestion and data import processing
3. [shared](./MODULES.md#shared-module) - Cross-cutting concerns and shared utilities

### Business Domain Modules
4. [promoters](./MODULES.md#promoters-module) - Promoter profile management and performance tracking
5. [stores](./MODULES.md#stores-module) - Store directory and performance analytics
6. [industries](./MODULES.md#industries-module) - Client/industry management and campaign association
7. [operations](./MODULES.md#operations-module) - Promotional campaign lifecycle management
8. [visits](./MODULES.md#visits-module) - Visit scheduling, execution tracking, and historical analysis

### Planned Integration Modules
9. [routes](./MODULES.md#routes-module) - Route optimization and territory management
10. [checklists](./MODULES.md#checklists-module) - Dynamic checklists for promotional activities per visit
11. [reports](./MODULES.md#reports-module) - Custom report generation and export functionality
12. [google-drive](./MODULES.md#google-drive-module) - Direct Google Drive integration (complementing n8n workflows)
13. [whatsapp](./MODULES.md#whatsapp-module) - WhatsApp Business API integration for automated communication

### Infrastructure Modules
14. [n8n](./MODULES.md#n8n-module) - Workflow automation integration points

## Module Structure Standard
Each module follows this standard structure:
```
src/modules/[module-name]/
├── components/       # Module-specific UI components
├── hooks/            # Custom React hooks for the module
├── pages/            # Next.js pages related to the module
├── repositories/     # Data access implementations
├── services/         # Application logic orchestration
├── schemas/          # Zod validation schemas
├── types/            # Module-specific TypeScript types
├── utils/            # Module-specific utility functions
├── constants/        # Module-specific constants
└── README.md         # Module-specific documentation
```

## Dependency Guidelines
- Modules should depend only on the `shared` module and other domain modules
- Avoid circular dependencies between modules
- Infrastructure concerns (database, external APIs) should be isolated in repositories
- UI components should be as dumb as possible, receiving data via props
- Business logic should reside in services or domain types, not in components

## Cross-Module Communication
- Application layer services communicate via direct function calls
- Modules publish domain events that other modules can subscribe to (via shared event bus)
- Shared state managed through React Query or global state solutions when necessary
- Avoid direct module-to-module UI component dependencies

## Finding Modules
All modules are located in the `src/modules/` directory. Each module has its own subdirectory with the module name.

For detailed information about each module's responsibilities, dependencies, and data flow, refer to the individual module documentation in [MODULES.md](./MODULES.md).