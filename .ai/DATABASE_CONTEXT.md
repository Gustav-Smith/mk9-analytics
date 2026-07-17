# Database Context - MK9 Analytics

## Overview
This document provides detailed information about the database schema, relationships, and data management strategies used in MK9 Analytics.

## Database Technology
- **Primary Database**: PostgreSQL (via Docker in development, managed service in production)
- **ORM**: Prisma 6 (TypeScript-first ORM with automatic TypeScript type generation)
- **Connection Pooling**: Configured through Prisma with default pool settings
- **Migrations**: Prisma Migrate for schema changes
- **Seeding**: Prisma Seed for initial data population

## Database Schema Overview

### Core Entities
The system centers around five core entities that form the foundation of the Trade Marketing domain:

1. **Operation** - Represents a monthly promotional campaign
2. **Visit** - Represents a promotional visit to a store
3. **Promoter** - Field agent who conducts visits
4. **Store** - Retail location where promotional activities occur
5. **Industry** - Client brand or industry for which promotions are run

### Supporting Entities
- **User** - System administrators and supervisors
- **Supervisor** - Manages promoters
- **Import** and **ImportFile** - Track spreadsheet import operations
- **SyncLog** - Logs automated system operations

## Detailed Entity Documentation

### Operation
```prisma
model Operation {
  id        String   @id @default(cuid())
  name      String
  month     Int
  year      Int
  status    OperationStatus @default(OPEN)
  startsAt  DateTime
  endsAt    DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  visits    Visit[]
  
  @@unique([month, year])
}
```

**Key Constraints**:
- Unique constraint on (month, year) ensures only one operation per month
- Status transitions: OPEN → CLOSED → ARCHIVED (one-way)
- Date range validation: startsAt should be first day of month, endsAt last day

### Visit
```prisma
model Visit {
  id             String      @id @default(cuid())
  operationId    String
  operation      Operation   @relation(fields: [operationId], references: [id])
  promoterId     String
  promoter       Promoter    @relation(fields: [promoterId], references: [id])
  storeId        String
  store          Store       @relation(fields: [storeId], references: [id])
  industryId     String
  industry       Industry    @relation(fields: [industryId], references: [id])
  status         VisitStatus @default(PLANEJADA)
  scheduledDate  DateTime
  completedDate  DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

**Key Constraints**:
- Foreign keys to Operation, Promoter, Store, Industry (all required)
- Status constraints based on VisitStatus enum
- Date validation: completedDate ≥ scheduledDate when status is REALIZADA

### Promoter
```prisma
model Promoter {
  id        String  @id @default(cuid())
  name      String
  city      String?
  state     String?
  supervisorId String
  supervisor   Supervisor @relation(fields: [supervisorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  visits    Visit[]
}
```

**Key Constraints**:
- Required supervisor relationship
- Optional geographic fields for filtering and reporting

### Store
```prisma
model Store {
  id   String @id @default(cuid())
  code String @unique
  name String
  chain String?
  city String?
  state String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  visits Visit[]
}
```

**Key Constraints**:
- Unique store code
- Optional chain, city, and state fields

### Industry
```prisma
model Industry {
  id   String @id @default(cuid())
  code String @unique
  name String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  visits Visit[]
}
```

**Key Constraints**:
- Unique industry code
- Required name field

### User
```prisma
model User {
  id       String   @id @default(cuid())
  name     String
  email    String   @unique
  password String
  role     UserRole @default(SUPERVISOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Key Constraints**:
- Unique email address
- Role limited to ADMIN or SUPERVISOR
- Password never stored in plain text

### Supervisor
```prisma
model Supervisor {
  id    String  @id @default(cuid())
  name  String
  email String? @unique
  promoters Promoter[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Key Constraints**:
- Optional email (must be unique if provided)
- One-to-many relationship with Promoter

### Import & ImportFile
```prisma
model Import {
  id        String   @id @default(cuid())
  status    String   // e.g., PENDING, SUCCESS, FAILED
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  files     ImportFile[]
}

model ImportFile {
  id        String   @id @default(cuid())
  fileName  String
  fileHash  String   @unique
  rowCount  Int?
  importId  String
  import    Import   @relation(fields: [importId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Key Constraints**:
- Unique file hash for duplicate detection
- ImportFile belongs to exactly one Import
- Status tracking for import process

### SyncLog
```prisma
model SyncLog {
  id        String   @id @default(cuid())
  action    String   // e.g., COMPARE_MONTHS, DUPLICATE_DETECTION, DATABASE_REBUILD
  status    String   // e.g., INFO, WARNING, ERROR
  message   String
  details   Json?    // additional metadata
  createdAt DateTime @default(now())
}
```

**Key Constraints**:
- Immutable log entries (only inserts, no updates/deletes)
- Flexible JSON details field for context

## Enums

### UserRole
```prisma
enum UserRole {
  ADMIN
  SUPERVISOR
}
```

### VisitStatus
```prisma
enum VisitStatus {
  PLANEJADA
  REALIZADA
  CANCELADA
}
```

### OperationStatus
```prisma
enum OperationStatus {
  OPEN
  CLOSED
  ARCHIVED
}
```

## Relationships Summary

### One-to-Many Relationships
- Operation → Visits (one operation has many visits)
- Supervisor → Promoters (one supervisor manages many promoters)
- Promoter → Visits (one promoter conducts many visits)
- Store → Visits (one store receives many visits)
- Industry → Visits (one industry has many visits across its stores)
- Import → ImportFiles (one import contains many files)
- User → (none direct, but Users can be Supervisors)

### Many-to-One Relationships (inverse of above)
- Visit → Operation (each visit belongs to one operation)
- Visit → Promoter (each visit conducted by one promoter)
- Visit → Store (each visit occurs at one store)
- Visit → Industry (each visit conducted for one industry)
- ImportFile → Import (each file belongs to one import)

## Database Design Decisions

### Use of CUID for Primary Keys
- Chose CUID (Collision-resistant Unique Identifier) over UUID for better readability and prefix-based sorting
- Provides global uniqueness with reasonable performance
- Prefix helps with debugging and log analysis

### Timestamps
- All entities include `createdAt` and `updatedAt` fields for audit trails
- `createdAt` set automatically on record creation
- `updatedAt` updated automatically on record modification

### Optional Fields
- Geographic fields (city, state) made optional for flexibility
- Chain field in Store optional for independent stores
- Email in Supervisor optional for supervisors without system login
- CompletedDate in Visit optional for planned/cancelled visits

### Constraints and Validation
- Database-level constraints for critical data integrity (unique codes, required fields)
- Application-level validation for business rules (date relationships, status transitions)
- Enum constraints for fixed value sets

### Indexing Strategy
- Primary keys automatically indexed
- Unique constraints create unique indexes
- Foreign keys automatically indexed by Prisma
- Additional indexes considered for query performance (to be added based on query patterns)

## Data Flow

### Normal Operations
1. Operations created monthly (unique per month/year)
2. Visits scheduled within operations linking promoters, stores, industries
3. Data imported via spreadsheet processing
4. Visit status updated as work progresses
5. Dashboard reflects current state through queries

### Import Process Flow
1. User uploads file(s) through import interface
2. Files validated (type, size, content)
3. Import record created with PENDING status
4. ImportFile records created for each file with metadata
5. Files parsed (Excel/CSV) and data extracted
6. Extracted data validated against business rules
7. Valid data persisted to domain entities (visits, promoters, etc.)
8. Import status updated to SUCCESS or FAILED
9. SyncLog entries created for audit
10. Dashboard updated with new data

### Archival Process (Future)
1. Operations older than 12 months marked for archival
2. Data moved to archive tables/storage
3. Main tables retain only recent data for performance
4. Archived data accessible for historical reports
5. SyncLog entries maintained regardless of age

## Migration Strategy

### Using Prisma Migrate
- Schema changes defined in `prisma/schema.prisma`
- Migration files generated with `prisma migrate dev`
- Applied to development database automatically
- Applied to production via CI/CD pipeline

### Seed Data
- Initial data populated via `prisma/seed.ts`
- Includes sample users, supervisors, promoters, stores, industries
- Used for development and testing environments
- Not applied to production by default

## Backup and Recovery

### Backup Strategy
- Regular automated backups of PostgreSQL database
- Point-in-time recovery enabled
- Backups stored in secure, geographically distributed storage
- Retention period aligned with data retention policies

### Recovery Procedures
- Point-in-time recovery for accidental data loss
- Full restore from latest backup for catastrophic failure
- Validation procedures to ensure data integrity post-restore
- Documentation of recovery time objectives (RTO) and recovery point objectives (RPO)

## Performance Considerations

### Connection Management
- Prisma connection pool configured for optimal performance
- Monitoring of connection usage and pool exhaustion
- Connection timeout and retry policies

### Query Optimization
- Selective field retrieval to minimize data transfer
- Proper use of includes vs selects in Prisma queries
- Index usage analysis through EXPLAIN statements
- Pagination for large result sets

### Caching Strategy
- Application-level caching for frequently accessed reference data
- Cache invalidation strategies for data that changes
- Consideration of Redis or similar for distributed caching

## Security Considerations

### Data Protection
- Connection string stored in environment variables
- SSL/TLS encryption for database connections
- Principle of least privilege for database user
- Regular security scanning of dependencies

### Access Control
- Database user limited to necessary permissions
- No direct database access for application users
- All access through application layer with proper authorization
- Audit logging for sensitive operations

## Maintenance and Monitoring

### Health Checks
- Database connectivity checks
- Query performance monitoring
- Replication lag monitoring (if using replicas)
- Storage capacity alerts

### Maintenance Tasks
- Regular index analysis and rebuilding
- Statistics updates for query planner
- Log rotation and archival
- Backup integrity verification

## Future Considerations

### Scaling Options
- Read replicas for read-heavy workloads
- Connection pooling middleware (PgBouncer)
- Table partitioning for large tables (visits, import logs)
- Columnar storage for analytics workloads

### Enhanced Features
- Soft delete implementation for audit trails
- Temporal tables for historical tracking
- Full-text search capabilities
- Geospatial queries for location-based analytics

## Environment-Specific Configurations

### Development
- Local PostgreSQL via Docker
- Aggressive logging for debugging
- Frequent schema migrations
- Seed data loaded regularly

### Testing
- Isolated database per test run
- Fast teardown and setup
- Focus on data integrity validation

### Staging
- Production-like database configuration
- Realistic data volumes
- Performance testing environment

### Production
- Managed PostgreSQL service
- Optimized connection pooling
- Minimal logging for performance
- Robust backup and disaster recovery

-- 
*Last updated: July 16, 2026*