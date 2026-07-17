# Import Module - MK9 Analytics

## Overview
The Import module handles the end-to-end process of uploading, parsing, validating, and persisting spreadsheet data (Excel and CSV) into the system. This is the primary mechanism for populating visit data and other operational information.

## Features
- File upload with drag-and-drop interface
- Support for Excel (.xlsx, .xls) and CSV (.csv) formats
- File size and type validation
- Automatic parsing of spreadsheet data
- Interactive data preview with column mapping
- Data validation using Zod schemas
- Duplicate detection based on file content hashing
- Error reporting and correction interface
- Database transaction processing
- Import history tracking and status management
- Integration with dashboard for real-time updates

## Components

### ImportCard (`src/modules/imports/components/ImportCard.tsx`)
The main upload interface featuring:
- Drag-and-drop area with visual feedback
- File type and size validation
- Upload progress indicator
- Action buttons for initiating import

### ImportPreview (`src/modules/imports/components/ImportPreview.tsx`)
Displays parsed data in an interactive grid:
- Column headers with sorting capability
- Row highlighting for invalid data
- Pagination for large datasets
- Option to adjust column mappings

### ImportValidation (`src/modules/imports/components/ImportValidation.tsx`)
Shows validation results:
- Summary of valid/invalid rows
- Detailed error messages per cell
- Options to fix errors or proceed with valid data only
- Statistics on duplicates and skipped records

## Hooks

### useImport (`src/modules/imports/hooks/useImport.ts`)
Custom hook managing the import workflow state:
- Upload status (idle, uploading, parsing, validating, processing, completed, error)
- Parsed data and validation results
- Import progress tracking
- Error handling and user feedback
- Integration with import service

## Service

### ImportService (`src/modules/imports/services/importService.ts`)
Orchestrates the import process:
1. **File Handling**: Validates and stores uploaded file
2. **Parsing**: Uses appropriate parser (Excel or CSV) based on file extension
3. **Validation**: Applies Zod schemas to validate data integrity
4. **Processing**: Transforms validated data into database operations
5. **Persistence**: Uses repositories to save Import, ImportFile, and Visit records in a transaction
6. **Logging**: Creates SyncLog entries for auditing
7. **Notifications**: Triggers user feedback and dashboard updates

## Schemas

### Import Schemas (`src/modules/imports/schemas/`)
- `visitImportSchema.zod.ts`: Defines the expected structure for visit import files
  - Required fields: promoterIdentifier, storeIdentifier, industryIdentifier, scheduledDate, status
  - Optional fields: notes, custom fields
  - Data type validations (dates, strings, enums)
  - Custom validation for business rules (e.g., date ranges, referential integrity checks)

## Utilities

### Parsers (`src/modules/imports/utils/`)
- `parseExcel.ts`: Uses `xlsx` library to extract data from Excel files
- `parseCSV.ts`: Uses `papaparse` library to parse CSV files with auto-detection of delimiters
- Both return normalized data arrays with consistent column naming

### Validation Helpers
- Functions to validate referential integrity (checking if promoter/store/industry exist)
- Date validation utilities
- Duplicate detection algorithms

## Database Integration

### Repositories (`src/modules/imports/repositories/`)
- `importRepository.ts`: CRUD operations for Import entity
- `importFileRepository.ts`: CRUD operations for ImportFile entity

### Prisma Models
- **Import**: Tracks import batches with status (PENDING, PROCESSING, SUCCESS, FAILED)
- **ImportFile**: Stores metadata for each uploaded file including:
  - fileName: Original filename
  - fileHash: SHA-256 hash for duplicate detection
  - rowCount: Number of rows processed
  - Relations: BelongsTo Import

## Workflow
1. User uploads file via ImportCard
2. File is validated (type, size) and uploaded to temporary storage
3. useImport triggers parsing via appropriate parser
4. Parsed data is displayed in ImportPreview for review
5. User can adjust column mappings if needed
6. Upon confirmation, data is sent to validation
7. ImportService runs validation against Zod schema
8. Validation results shown in ImportValidation
9. If valid, data is processed and saved to database in a transaction
10. Upon success:
    - Import record status updated to SUCCESS
    - ImportFile records created with hashes
    - Visit records created/updated
    - SyncLog entry created
    - Dashboard notified via React Query invalidation
11. If errors occur:
    - Import record status set to FAILED
    - Error details logged
    - User presented with error details and retry option

## Error Handling
- Validation errors: Displayed inline with specific field errors
- Processing errors: Caught and logged, user shown friendly message
- Duplicate files: Detected via file hash, user notified
- Database errors: Transaction rolled back, error reported
- Network errors: Handled with retry mechanism and user notification

## Security Considerations
- File type validation prevents upload of malicious files
- File size limits prevent DoS via large uploads
- Content hashing prevents processing identical files multiple times
- Server-side validation ensures data integrity regardless of client-side bypass
- Prepared statements via Prisma prevent SQL injection

## Performance Considerations
- Streaming parsing for large files to minimize memory usage
- Batch database operations to reduce round-trips
- Progressive UI updates for large datasets
- Cancellation support for long-running operations

## Testing
- Unit tests for parsers and validation logic
- Integration tests for the full import workflow
- Manual testing with various file formats and edge cases
- Performance testing with large datasets

## Future Enhancements
- Support for additional file formats (XLS, ODS)
- Data transformation rules (unit conversion, formatting)
- Scheduled imports from FTP/SFTP
- API endpoint for programmatic imports
- Machine learning-based column mapping suggestions
- Real-time collaboration on import review