# Business Rules - MK9 Analytics

## Domain Entities and Their Business Rules

### User
- **Attributes**: id, name, email, password, role, createdAt, updatedAt
- **Business Rules**:
  - Email must be unique across all users
  - Password must be hashed (never stored in plain text)
  - Role must be either ADMIN or SUPERVISOR
  - A user can be either an ADMIN or a SUPERVISOR (not both)
  - Only ADMIN users can manage other users (create, update, delete)
  - SUPERVISOR users can view their own profile and manage their assigned promoters

### Supervisor
- **Attributes**: id, name, email, createdAt, updatedAt
- **Business Rules**:
  - Email is optional but if provided must be unique among supervisors
  - A supervisor can manage zero or more promoters
  - A promoter must belong to exactly one supervisor
  - Supervisor name is required
  - When a supervisor is deleted, their promoters remain (set supervisorId to null) or are reassigned based on business rules

### Promoter
- **Attributes**: id, name, city, state, supervisorId, createdAt, updatedAt
- **Business Rules**:
  - Name is required
  - City and state are optional but if provided must be strings
  - Must belong to exactly one supervisor (supervisorId is required)
  - A promoter can conduct zero or more visits
  - When a promoter is deleted, their visits remain (set promoterId to null) or are reassigned based on business rules

### Industry
- **Attributes**: id, code, name, createdAt, updatedAt
- **Business Rules**:
  - Code is required and must be unique
  - Name is required
  - Code should follow a pattern (e.g., three letters + three numbers) but this is not enforced at the database level
  - An industry can have zero or more visits
  - When an industry is deleted, their visits remain (set industryId to null) or are reassigned based on business rules

### Store
- **Attributes**: id, code, name, chain, city, state, createdAt, updatedAt
- **Business Rules**:
  - Code is required and must be unique
  - Name is required
  - Chain, city, and state are optional but if provided must be strings
  - A store can receive zero or more visits
  - When a store is deleted, their visits remain (set storeId to null) or are reassigned based on business rules

### Visit
- **Attributes**: id, operationId, promoterId, storeId, industryId, status, scheduledDate, completedDate, createdAt, updatedAt
- **Business Rules**:
  - Must belong to exactly one operation, one promoter, one store, and one industry
  - Status must be one of: PLANEJADA, REALIZADA, CANCELADA
  - Scheduled date is required
  - Completed date is optional but:
    - If status is REALIZADA, completed date must be provided and must be >= scheduled date
    - If status is CANCELADA, completed date must be null
    - If status is PLANEJADA, completed date must be null
  - A visit's scheduled date must be within the operation's start and end dates
  - A promoter cannot have two visits scheduled at the exact same time at different stores (this is a business rule that may be enforced at the application level)
  - A store cannot receive two visits from the same promoter at the exact same time (this is a business rule that may be enforced at the application level)

### Operation
- **Attributes**: id, name, month, year, status, startsAt, endsAt, createdAt, updatedAt
- **Business Rules**:
  - Name is required and is typically generated based on month and year (e.g., "Operação Janeiro 2026")
  - Month must be between 1 and 12
  - Year must be a valid year (e.g., 2026)
  - The combination of month and year must be unique (only one operation per month)
  - Status must be one of: OPEN, CLOSED, ARCHIVED
  - Starts at is typically the first day of the month at 00:00:00
  - Ends at is typically the last day of the month at 23:59:59
  - An operation can contain zero or more visits
  - When an operation is set to CLOSED, no new visits can be added or existing visits modified (except for updating completed date for visits in progress)
  - When an operation is set to ARCHIVED, the operation is moved to historical archive and is view-only

### Import
- **Attributes**: id, status, createdAt, updatedAt
- **Business Rules**:
  - Status is a string that indicates the state of the import (e.g., PENDING, SUCCESS, FAILED)
  - An import consists of one or more import files
  - When an import is started, its status is set to PENDING
  - When all files in an import have been processed successfully, the import status is set to SUCCESS
  - If any file in the import fails processing, the import status is set to FAILED
  - Import records are kept for audit purposes

### ImportFile
- **Attributes**: id, fileName, fileHash, rowCount, importId, createdAt, updatedAt
- **Business Rules**:
  - File name is required
  - File hash is required and must be unique (used for duplicate detection)
  - Row count is optional but if provided must be a non-negative integer
  - Must belong to exactly one import
  - When an import file is processed, its row count is set to the number of rows processed (excluding headers)
  - Import file records are kept for audit purposes

### SyncLog
- **Attributes**: id, action, status, message, details, createdAt
- **Business Rules**:
  - Action is a string that describes the action performed (e.g., COMPARE_MONTHS, DUPLICATE_DETECTION, DATABASE_REBUILD)
  - Status is a string that indicates the outcome (e.g., INFO, WARNING, ERROR)
  - Message is a human-readable log message
  - Details is an optional JSON field for additional metadata
  - Sync log entries are created for automated operations and are never deleted (only appended)

## Cross-Cutting Business Rules

### Data Integrity
- All entities have createdAt and updatedAt timestamps for audit purposes
- No entity should ever have an updatedAt timestamp that is earlier than its createdAt timestamp
- All required fields must be provided when creating an entity
- All foreign key relationships must be valid (point to existing entities) unless the relationship is optional

### Security
- Passwords are never stored in plain text
- Passwords are hashed using a strong, adaptive hashing algorithm (bcrypt)
- Only users with the ADMIN role can perform user management operations
- All API endpoints require authentication unless explicitly marked as public
- Sensitive data (like passwords) is never returned in API responses

### Data Validation
- All data entering the system must be validated against business rules
- Validation occurs at the application layer (in services) using Zod schemas
- Domain objects enforce their own invariants
- Invalid data is rejected and appropriate error messages are returned to the user

### Error Handling
- Expected errors (validation errors, business rule violations) return appropriate HTTP status codes (400, 422)
- Unexpected errors (system failures) return 500 and are logged for investigation
- Error messages should be user-friendly and not expose internal system details
- All errors are logged for auditing and debugging purposes

### Performance
- Database queries should be optimized to avoid N+1 problems
- Pagination should be used for lists that could grow large
- Caching should be considered for frequently accessed, rarely changing data
- Long-running operations (like file imports) should be processed asynchronously

## Workflow Business Rules

### Visit Lifecycle
1. A visit is created in the PLANEJADA state with a scheduled date
2. When the visit is conducted, its status is changed to REALIZADA and a completed date is set
3. If a visit cannot be conducted as planned, its status is changed to CANCELADA and the completed date remains null
4. A visit can transition from PLANEJADA to REALIZADA or CANCELADA, but not vice versa
5. A visit in REALIZADA or CANCELADA state cannot be changed back to PLANEJADA

### Operation Lifecycle
1. An operation is created in the OPEN state at the beginning of the month
2. While an operation is OPEN, visits can be scheduled, modified, and completed
3. When the month ends, the operation is set to CLOSED (no further changes allowed)
4. At a later date, the operation may be set to ARCHIVED (moved to historical storage)
5. An operation cannot go from CLOSED back to OPEN
6. An operation cannot go from ARCHIVED back to any other state

### Import Process
1. User uploads one or more files through the import interface
2. Each file is validated for type, size, and content
3. Valid files are parsed and their data is validated against business rules
4. Valid data is persisted to the database
5. The import status is updated based on the success or failure of file processing
6. Users are notified of the import result
7. Imported data becomes available in the dashboard and reports

## Data Retention and Archiving
- Operational data (visits, operations) is kept online for the current and previous year
- Older operational data is archived but remains accessible for reporting
- Audit logs (like SyncLog) are retained indefinitely
- User data is retained until the user is deleted (and then subject to data retention policies)
- Import records are retained indefinitely for audit purposes

## Compliance and Legal
- The system does not store sensitive personal data beyond what is necessary for operations
- All data handling complies with applicable data protection regulations
- Users have the right to access, correct, and delete their personal data (where applicable)
- Data backups are performed regularly and stored securely