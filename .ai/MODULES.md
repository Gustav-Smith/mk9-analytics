# Modules Documentation - MK9 Analytics

## Overview
This document provides detailed information about each module in the MK9 Analytics system, including their responsibilities, dependencies, and data flow.

## Module List

### 1. Dashboard Module
**Path**: `src/modules/dashboard/`
**Responsibility**: Data visualization and operational monitoring
**Key Responsibilities**:
- Display key metrics and KPIs
- Show charts and graphs for visit trends
- Provide recent activity feed
- Offer quick actions for common tasks
**Dependencies**:
- Shared module (for common utilities and types)
- Visits module (for visit data)
- Promoters module (for promoter data)
- Stores module (for store data)
- Industries module (for industry data)
**Data Flow**:
- Services fetch data from repositories
- Components consume data via hooks or server props
- UI updates based on data changes

### 2. Imports Module
**Path**: `src/modules/imports/`
**Responsibility**: Spreadsheet ingestion and data import processing
**Key Responsibilities**:
- Handle file uploads and validation
- Parse Excel and CSV files
- Validate imported data against business rules
- Persist valid data to the database
- Track import status and history
**Dependencies**:
- Shared module (for utilities and types)
- Visits module (for visit persistence)
- Promoters module (for promoter validation)
- Stores module (for store validation)
- Industries module (for industry validation)
- Operations module (for operation validation)
**Data Flow**:
1. User uploads file(s)
2. File validation (type, size, content)
3. Import record created (PENDING status)
4. File parsing (Excel/CSV)
5. Data validation (business rules)
6. Data persistence (visits, promoters, etc.)
7. Import status updated (SUCCESS/FAILED)
8. Notification to user

### 3. Shared Module
**Path**: `src/modules/shared/`
**Responsibility**: Cross-cutting concerns and shared utilities
**Key Responsibilities**:
- Provide reusable UI components
- Offer custom React hooks (auth, data fetching, etc.)
- Define global TypeScript types and interfaces
- Contain utility functions (date formatting, string manipulation, etc.)
- Store application-wide constants
**Dependencies**: None (independent module)
**Used By**: All other modules

### 4. Promoters Module
**Path**: `src/modules/promoters/`
**Responsibility**: Promoter profile management and performance tracking
**Key Responsibilities**:
- CRUD operations for promoter profiles
- Assign promoters to supervisors
- Track promoter performance metrics
- Manage promoter activity history
**Dependencies**:
- Shared module (for common utilities)
- Supervisors (via relationship, but supervisors are in their own module? Actually, supervisors are in the promoters module? Wait, in the schema, Supervisor is a separate model. We have a supervisors module? Not in the list. We have promoters, but not supervisors. Let's adjust: the promoter module may also manage supervisors, or we have a separate supervisors module. However, the user's list of modules does not include supervisors. We'll assume that supervisors are managed within the promoters module or that the promoter module handles the relationship.)
- Visits (for performance data)
**Data Flow**:
- Services handle promoter CRUD
- Components display promoter lists and forms
- Performance data fetched from visits

### 5. Stores Module
**Path**: `src/modules/stores/`
**Responsibility**: Store directory and performance analytics
**Key Responsibilities**:
- CRUD operations for store information
- Manage store details (code, name, chain, location)
- Analyze store performance based on visit data
**Dependencies**:
- Shared module
- Visits (for performance data)
**Data Flow**:
- Store CRUD operations
- Performance analytics derived from visit data

### 6. Industries Module
**Path**: `src/modules/industries/`
**Responsibility**: Client/industry management and campaign association
**Key Responsibilities**:
- CRUD operations for industry information
- Manage industry details (code, name)
- Analyze industry performance based on visit data
**Dependencies**:
- Shared module
- Visits (for performance data)
**Data Flow**:
- Industry CRUD operations
- Performance analytics from visit data

### 7. Operations Module
**Path**: `src/modules/operations/`
**Responsibility**: Promotional campaign lifecycle management
**Key Responsibilities**:
- CRUD operations for operations (monthly campaigns)
- Manage operation status (OPEN, CLOSED, ARCHIVED)
- Set operation dates (startsAt, endsAt)
- Generate operation names based on month/year
**Dependencies**:
- Shared module
- Visits (each visit belongs to an operation)
**Data Flow**:
- Operations CRUD
- Visit creation linked to operations

### 8. Visits Module
**Path**: `src/modules/visits/`
**Responsibility**: Visit scheduling, execution tracking, and historical analysis
**Key Responsibilities**:
- CRUD operations for visits
- Manage visit status (PLANEJADA, REALIZADA, CANCELADA)
- Track scheduled and completed dates
- Associate visits with promoters, stores, industries, operations
- Provide visit history and analytics
**Dependencies**:
- Shared module
- Promoters, Stores, Industries, Operations (all via relationships)
**Data Flow**:
- Visit CRUD operations
- Status transitions based on business rules

### 9. Routes Module (Planned)
**Path**: `src/modules/routes/`
**Responsibility**: Route optimization and territory management
**Key Responsibilities**:
- Optimize promoter routes based on store locations
- Manage territories and zones
- Suggest efficient visit sequences
**Dependencies**:
- Shared module
- Stores (for locations)
- Promoters (for assignments)
- Visits (for historical data)
**Status**: Planned for future implementation

### 10. Checklists Module (Planned)
**Path**: `src/modules/checklists/`
**Responsibility**: Dynamic checklists for promotional activities per visit
**Key Responsibilities**:
- Define checklist templates for different visit types
- Assign checklists to visits
- Track checklist completion status
- Provide guidance for promotional activities
**Dependencies**:
- Shared module
- Visits (each visit can have a checklist)
**Status**: Already partially implemented (we saw a checklists module in the src/modules directory)

### 11. Reports Module (Planned)
**Path**: `src/modules/reports/`
**Responsibility**: Custom report generation and export functionality
**Key Responsibilities**:
- Design and generate custom reports
- Export reports in various formats (PDF, CSV, Excel)
- Schedule automated report generation
- Provide report templates for common use cases
**Dependencies**:
- Shared module
- All data modules (visits, promoters, stores, etc.)
**Status**: Planned for future implementation

### 12. Google Drive Module (Planned)
**Path**: `src/modules/google-drive/`
**Responsibility**: Direct Google Drive integration (complementing n8n workflows)
**Key Responsibilities**:
- Authenticate with Google Drive API
- List and retrieve files from Google Drive
- Save files to Google Drive
- Synchronize files between local system and Google Drive
**Dependencies**:
- Shared module
- Configuration (API credentials)
**Status**: Planned for future implementation

### 13. WhatsApp Module (Planned)
**Path**: `src/modules/whatsapp/`
**Responsibility**: WhatsApp Business API integration for automated communication
**Key Responsibilities**:
- Send automated WhatsApp messages based on visit outcomes
- Receive and process incoming WhatsApp messages
- Manage message templates and campaigns
- Track message delivery and engagement
**Dependencies**:
- Shared module
- WhatsApp Business API credentials
**Status**: Planned for future implementation

### 14. N8N Module
**Path**: `src/modules/n8n/`
**Responsibility**: Workflow automation integration points
**Key Responsibilities**:
- Define webhooks for n8n workflows
- Handle callbacks from n8n
- Trigger n8n workflows based on system events
- Exchange data with n8n for automations
**Dependencies**:
- Shared module
- n8n instance (external)
**Status**: Partially implemented (we have an n8n module in src/modules)

## Inter-Module Dependencies
- All modules depend on the `shared` module for common utilities and types.
- Domain modules (promoters, stores, industries, visits, operations) depend on each other through relationships.
- The imports module depends on all domain modules for data validation.
- The dashboard module depends on domain modules for data display.
- Planned modules (routes, reports, google-drive, whatsapp) will depend on relevant domain modules and shared.

## Data Flow Summary
1. **Data Entry**: Through imports module (spreadsheet upload) or manual entry (future modules)
2. **Data Storage**: Persisted via repositories in each module
3. **Data Processing**: Services apply business logic and coordinate between modules
4. **Data Presentation**: Dashboard and other UI components consume processed data
5. **Automation**: n8n module handles external workflows and integrations
6. **Reporting**: Reports module (future) will generate insights from stored data

## Module Guidelines
- Each module should be self-contained with its own components, hooks, pages, repositories, services, schemas, types, and utils.
- Avoid direct dependencies on UI components from other modules; use shared components or create wrappers.
- Business logic should reside in services, not in components.
- Data access should be through repositories, not direct Prisma calls in services.
- Validation schemas should be defined in the schemas directory.
- Types and interfaces specific to the module should be in the types directory.
- Shared utilities that are truly cross-cutting should go in the shared module.

## Finding Module Documentation
Each module has its own README.md in its directory (e.g., `src/modules/dashboard/README.md`). This document provides a high-level overview; for detailed module-specific information, refer to the individual module READMEs.