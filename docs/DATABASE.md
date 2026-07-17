# Database Documentation - MK9 Analytics

## Overview
This document describes the database schema for MK9 Analytics, implemented using Prisma ORM with PostgreSQL as the underlying database.

## Enums

### UserRole
Defines user access levels in the system.
- `ADMIN`: Full system access including user and permission management
- `SUPERVISOR`: Can manage assigned promoters and view team reports

### VisitStatus
Represents the state of a visit.
- `PLANEJADA`: Visit scheduled for future occurrence
- `REALIZADA`: Visit successfully completed
- `CANCELADA`: Scheduled visit that did not occur

### OperationStatus
Defines the state of a monthly operation.
- `OPEN`: Active operation accepting new visits and updates
- `CLOSED`: Operation closed, no further changes allowed (data remains viewable)
- `ARCHIVED`: Operation moved to historical archive (planned for future implementation)

## Models

### User
System users with access to the administrative interface.
- `id`: Unique identifier (ULID via `cuid()`)
- `name`: User's full name
- `email`: Unique email address (used for login)
- `password`: Hashed password (never stored as plain text in production)
- `role`: Access level (`ADMIN` or `SUPERVISOR`)
- `createdAt`/`updatedAt`: Creation and last update timestamps

### Supervisor
Manages a team of promoters.
- `id`: Unique identifier
- `name`: Supervisor's full name
- `email`: Optional email for notifications and potential future login
- **Relationships**:
  - `promoters`: One-to-many with Promoter (one supervisor manages many promoters)
  - `createdAt`/`updatedAt`: Audit timestamps

### Promoter
Field agent responsible for visiting stores and executing promotional activities.
- `id`: Unique identifier
- `name`: Promoter's full name
- `city`/`state`: Optional geographic location (for filtering and regional reports)
- `supervisorId`: Foreign key linking to responsible supervisor
- **Relationships**:
  - `supervisor`: The supervisor managing this promoter
  - `visits`: One-to-many with Visit (visits conducted by this promoter)
  - `createdAt`/`updatedAt`: Audit timestamps

### Industry
Client brand or industry for which promotional activities are conducted.
- `id`: Unique identifier
- `code`: Unique industry code (e.g., `BEB001` for beverages)
- `name`: Descriptive industry name (e.g., "Beverage Industry X")
- **Relationships**:
  - `visits`: One-to-many with Visit (visits conducted for this industry)
  - `createdAt`/`updatedAt`: Audit timestamps

### Store
Retail location where promotional activities occur.
- `id`: Unique identifier
- `code`: Unique store code (e.g., `SMC001`)
- `name`: Store's commercial name
- `chain`: Optional retail chain name
- `city`/`state`: Optional geographic location
- **Relationships**:
  - `visits`: One-to-many with Visit (visits conducted at this store)
  - `createdAt`/`updatedAt`: Audit timestamps

### Visit
Instance of a promotional visit to a store by a promoter.
- `id`: Unique identifier
- `operationId`: Foreign key linking to the parent monthly operation
- `operation`: The operation to which this visit belongs
- `promoterId`: Foreign key linking to the conducting promoter
- `promoter`: The promoter who conducted this visit
- `storeId`: Foreign key linking to the visited store
- `store`: The store that was visited
- `industryId`: Foreign key linking to the client industry
- `industry`: The industry/client for whom the visit was conducted
- `status`: Current visit status (`PLANEJADA`, `REALIZADA`, `CANCELADA`)
- `scheduledDate`: Date and time the visit was scheduled to occur
- `completedDate`: Date and time the visit was actually completed (null if not performed or still in progress)
- `createdAt`/`updatedAt`: Audit timestamps
- **Relationships**:
  - Each visit belongs to exactly one operation, one promoter, one store, and one industry
  - An operation can have many visits
  - A promoter can conduct many visits
  - A store can receive many visits
  - An industry can have many visits across its stores

### Operation
Monthly promotional campaign.
- `id`: Unique identifier
- `name`: Descriptive operation name (auto-generated based on month/year)
- `month`: Month of operation (1-12)
- `year`: Year of operation (e.g., 2026)
- `status`: Current operation status (`OPEN`, `CLOSED`, `ARCHIVED`)
- `startsAt`: Official operation start date/time (typically first day of month at 00:00)
- `endsAt`: Official operation end date/time (typically last day of month at 23:59:59)
- `createdAt`/`updatedAt`: Audit timestamps
- **Constraint**: Unique index on `(month, year)` ensuring only one operation per month/year
- **Relationships**:
  - One-to-many with Visit (an operation contains many visits)

### Import
Tracking of spreadsheet import operations.
- `id`: Unique identifier
- `status`: Import status (e.g., `PENDING`, `SUCCESS`, `FAILED`)
- `createdAt`/`updatedAt`: Audit timestamps
- **Relationships**:
  - One-to-many with ImportFile (an import contains many files)

### ImportFile
Individual file within an import operation.
- `id`: Unique identifier
- `fileName`: Original file name
- `fileHash`: Unique hash of file content (for duplicate detection)
- `rowCount`: Optional number of rows processed
- `importId`: Foreign key linking to parent import
- `import`: The import process this file belongs to
- `createdAt`/`updatedAt`: Audit timestamps

### SyncLog
Log of automated synchronization and maintenance operations.
- `id`: Unique identifier
- `action`: Type of action performed (e.g., `COMPARE_MONTHS`, `DUPLICATE_DETECTION`, `DATABASE_REBUILD`)
- `status`: Outcome status (e.g., `INFO`, `WARNING`, `ERROR`)
- `message`: Human-readable log message
- `details`: Optional JSON metadata for additional context
- `createdAt`: Timestamp of when the log entry was created

## Relationships Diagram
```mermaid
erDiagram
    USER ||..|> SUPERVISOR : "manages"
    SUPERVISOR ||..o{ PROMOTER : "supervises"
    PROMOTOR ||..o{ VISIT : "conducts"
    OPERATION ||..o{ VISIT : "contains"
    STORE ||..o{ VISIT : "receives"
    INDUSTRY ||..o{ VISIT : "serves"
    IMPORT ||..o{ IMPORT-FILE : "contains"
```

## Data Flow
1. **Operations** are created monthly (unique per month/year combination)
2. **Visits** are scheduled within operations, linking promoters, stores, and industries
3. **Imports** process spreadsheet files to create or update visit records
4. **SyncLogs** track automated operations like data comparisons and duplicate detection
5. **Users** (admins/supervisors) manage the system and view dashboards
6. **All entities** maintain audit trails through `createdAt` and `updatedAt` timestamps

## Constraints and Validations
- Unique constraint on `Operation.month` and `Operation.year` prevents duplicate monthly operations
- Unique constraint on `Industry.code` ensures industry codes are unique
- Unique constraint on `Store.code` ensures store codes are unique
- Unique constraint on `ImportFile.fileHash` prevents processing identical files multiple times
- Foreign key relationships enforce referential integrity between entities