# Common Mistakes - MK9 Analytics

## Overview
This document lists common mistakes to avoid common mistakes when working on the MK9 Analytics project.

## Database Mistakes

### 1. Modifying Production Database Directly
- **Mistake**: Making schema changes or data corrections directly in the production database.
- **Why it's bad**: Bypasses version control, causes inconsistencies between environments, and violates migration practices.
- **Correct Approach**: Use Prisma Migrate for schema changes. For data fixes, create a migration script or use a seed script in a controlled manner.

### 2. Ignoring Relationship Constraints
- **Mistake**: Creating records with invalid foreign keys or ignoring relationship requirements.
- **Why it's bad**: Leads to orphaned records, broken data integrity, and application errors.
- **Correct Approach**: Always ensure related records exist before creating dependencies. Use Prisma's relational queries to validate.

### 3. Over-Fetching Data
- **Mistake**: Using `include` or `select` excessively, retrieving more data than needed.
- **Why it's bad**: Wastes bandwidth, slows down responses, and increases memory usage.
- **Correct Approach**: Select only the fields needed for the current operation. Use Prisma's `select` and `include` judiciously.

### 4. Not Using Transactions for Related Operations
- **Mistake**: Performing multiple related database operations without wrapping them in a transaction.
- **Why it's bad**: Leads to partial updates and inconsistent state if one operation fails.
- **Correct Approach**: Use Prisma's `$transaction` method for operations that must succeed or fail as a unit.

## Backend Mistakes

### 5. Putting Business Logic in Controllers (API Routes)
- **Mistake**: Implementing complex business logic directly in API route handlers.
- **Why it's bad**: Makes code harder to test, reuse, and maintain. Violates separation of concerns.
- **Correct Approach**: Keep API routes thin; delegate business logic to service layers.

### 6. Not Handling Errors Properly
- **Mistake**: Letting exceptions bubble up or returning generic error messages.
- **Why it's bad**: Exposes internal details to users, makes debugging difficult, and provides poor user experience.
- **Correct Approach**: Catch errors, log them appropriately, and return user-friendly error messages with suitable HTTP status codes.

### 7. Ignoring Input Validation
- **Mistake**: Assuming incoming data is valid without checking.
- **Why it's bad**: Leads to security vulnerabilities (injection attacks) and data corruption.
- **Correct Approach**: Validate all input using Zod schemas at the API boundary before processing.

### 8. Creating N+1 Query Problems
- **Mistake**: Querying for a list of items and then making additional queries for each item to get related data.
- **Why it's bad**: Severely degrades performance as the dataset grows.
- **Correct Approach**: Use Prisma's `include` or `select` to fetch related data in a single query when possible.

## Frontend Mistakes

### 9. Not Using React Query for Server State
- **Mistake**: Managing server state with useState or useEffect instead of a dedicated library.
- **Why it's bad**: Misses out on caching, background updates, and request deduplication.
- **Correct Approach**: Use React Query (`@tanstack/react-query`) for all server state management.

### 10. Over-Complicating Component State
- **Mistake**: Storing data that can be derived from props or other state in component state.
- **Why it's bad**: Leads to inconsistency and unnecessary re-renders.
- **Correct Approach**: Derive values from props and state when possible. Keep state minimal.

### 11. Ignoring Accessibility
- **Mistake**: Building UI without considering keyboard navigation, screen readers, or color contrast.
- **Why it's bad**: Excludes users with disabilities and may violate legal requirements.
- **Correct Approach**: Follow WCAG guidelines, use semantic HTML, and test with accessibility tools.

### 12. Not Optimizing for Performance
- **Mistake**: Causing unnecessary re-renders, loading large images, or not code-splitting.
- **Why it's bad**: Results in slow user experience, especially on mobile devices.
- **Correct Approach**: Use React.memo, useCallback, useMemo. Optimize images. Leverage Next.js code splitting.

## Testing Mistakes

### 13. Writing Brittle Tests
- **Mistake**: Tests that are too coupled to implementation details.
- **Why it's bad**: Tests break frequently during refactoring, reducing their value.
- **Correct Approach**: Test behavior, not implementation. Use testing-library principles.

### 14. Not Testing Error Conditions
- **Mistake**: Only testing the happy path.
- **Why it's bad**: Leaves error handling untested, leading to production issues.
- **Correct Approach**: Test both success and failure scenarios for all functions and components.

### 15. Mocking Incorrectly
- **Mistake**: Over-mocking or under-mocking dependencies in tests.
- **Why it's bad**: Tests become either too fragile or too slow and coupled.
- **Correct Approach**: Mock only external dependencies (APIs, databases). Test internal logic with real implementations where feasible.

## Security Mistakes

### 16. Exposing Sensitive Data
- **Mistake**: Returning passwords, tokens, or other sensitive data in API responses.
- **Why it's bad**: Leads to data breaches and compromised accounts.
- **Correct Approach**: Never include sensitive data in responses. Hash passwords and use secure tokens.

### 17. Insufficient Input Sanitization
- **Mistake**: Not sanitizing user input before displaying it in the UI.
- **Why it's bad**: Opens the door to XSS attacks.
- **Correct Approach**: Sanitize all user-generated content. Use dangerouslySetInnerHTML only when absolutely necessary and with trusted content.

### 18. Missing Rate Limiting
- **Mistake**: Allowing unlimited requests to public endpoints.
- **Why it's bad**: Enables denial-of-service attacks and abuse.
- **Correct Approach**: Implement rate limiting on public API endpoints, especially authentication-related ones.

## Development Process Mistakes

### 19. Committing Sensitive Information
- **Mistake**: Adding API keys, passwords, or other secrets to the repository.
- **Why it's bad**: Exposes secrets to anyone with access to the repo.
- **Correct Approach**: Use environment variables and .env files. Never commit .env files. Use secrets management in CI/CD.

### 20. Ignoring Linting and Formatting
- **Mistake**: Disregarding ESLint and Prettier warnings.
- **Why it's bad**: Leads to inconsistent code style and potential bugs.
- **Correct Address**: Fix linting errors before committing. Use pre-commit hooks to automate checks.

### 21. Not Writing Commit Messages Properly
- **Mistake**: Writing vague or uninformative commit messages.
- **Why it's bad**: Makes it hard to understand changes and track down issues.
- **Correct Approach**: Follow conventional commits format. Be descriptive and concise.

### 22. Making Large, Monolithic Commits
- **Mistake**: Bundling unrelated changes in a single commit.
- **Why it's bad**: Makes code review difficult and complicates rollback.
- **Correct Approach**: Make small, focused commits that address a single concern or feature.

## Architecture Mistakes

### 23. Violating Layer Dependencies
- **Mistake**: Having domain layer depend on infrastructure layer, or presentation layer depend on infrastructure layer.
- **Why it's bad**: Creates tight coupling and makes the system harder to maintain and test.
- **Correct Approach**: Follow the dependency rule: inner layers should not know about outer layers. Dependencies point inward.

### 24. Putting Business Logic in Entities (Anemic Domain Model)
- **Mistake**: Creating entities that are just data bags with no behavior.
- **Why it's bad**: Leads to scattered business logic and procedural code.
- **Correct Approach**: Encapsulate business logic in entities and value objects where appropriate.

### 25. Creating God Modules or God Services
- **Mistake**: Creating modules or services that know too much or do too much.
- **Why it's bad**: Violates single responsibility principle and makes code hard to understand.
- **Correct Approach**: Keep modules and services focused on a single responsibility. Split when they grow too large.

## How to Avoid These Mistakes

1. **Code Review**: Participate in code reviews to catch mistakes early.
2. **Automated Testing**: Write tests to prevent regressions and validate behavior.
3. **Linting and Formatting**: Use ESLint and Prettier to maintain code quality.
4. **Continuous Learning**: Stay updated on best practices and learn from mistakes.
5. **Pair Programming**: Share knowledge and catch mistakes in real-time.
6. **Documentation**: Document decisions and reasoning to prevent future mistakes.
7. **Refactoring**: Regularly refactor to improve design and reduce technical debt.

Remember: Making mistakes is part of learning. The goal is to recognize them, learn from them, and prevent them from recurring.

-- 
*Last updated: July 16, 2026*