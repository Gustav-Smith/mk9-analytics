# Testing Rules - MK9 Analytics

## Overview
This document outlines the testing strategy, guidelines, and best practices for the MK9 Analytics project.

## Testing Philosophy
- **Test Early, Test Often**: Integrate testing into the development workflow from the beginning.
- **Test What Matters**: Focus on critical user journeys, business logic, and edge cases.
- **Automate Everything**: Strive for high test coverage with automated unit, integration, and end-to-end tests.
- **Maintain Test Quality**: Keep tests readable, maintainable, and fast.

## Test Types

### Unit Tests
- **Purpose**: Test individual functions, utilities, and components in isolation.
- **Tools**: Jest, React Testing Library, @testing-library/react-hooks
- **Coverage Goal**: 80%+ for business logic and utilities
- **Guidelines**:
  - Test pure functions with various inputs and edge cases
  - Mock external dependencies (APIs, databases)
  - Test React components' rendering and user interactions
  - Test custom hooks with different scenarios
  - Keep tests focused and independent

### Integration Tests
- **Purpose**: Test interactions between multiple units (e.g., service + repository, API route + middleware).
- **Tools**: Jest, Supertest (for API routes), Testing Library
- **Coverage Goal**: 60%+ for critical integration points
- **Guidelines**:
  - Test service layer interactions with repositories
  - Test API route handlers with mocked services
  - Test database transactions and queries
  - Use test databases or mocks for persistence layer
  - Focus on contracts between modules

### End-to-End (E2E) Tests
- **Purpose**: Test complete user workflows from UI to database.
- **Tools**: Playwright or Cypress (to be selected)
- **Coverage Goal**: Critical user journeys (login, import, dashboard view)
- **Guidelines**:
  - Test key user flows: authentication, data import, dashboard navigation
  - Run against a test environment with seed data
  - Use page objects for maintainability
  - Keep tests independent and repeatable
  - Limit E2E tests to avoid excessive runtime

## Testing Standards

### Test File Organization
- Place unit tests alongside the file they test (e.g., `util.test.ts`)
- For components and hooks, use `.test.tsx` suffix
- Group integration tests in `__tests__` directories or alongside the tested module
- E2E tests in `e2e/` or `tests/e2e/` directory

### Test Naming
- Use descriptive names: `shouldReturnValidResultWhenInputIsValid`
- Follow the pattern: `unitUnderTest_condition_expectedBehavior`
- For test suites: describe the module or function being tested

### Test Structure (AAA)
- **Arrange**: Set up preconditions and inputs
- **Act**: Execute the function or trigger the event
- **Assert**: Verify the expected outcome

### Mocking Guidelines
- Mock external dependencies (APIs, file system, third-party libraries)
- Use Jest mocks or manual mocks for consistency
- Avoid over-mocking; test real integration where feasible
- Clear mocks between tests to prevent leakage

### Environment
- Use a separate test database to avoid polluting development data
- Reset database state before each test suite
- Use environment variables to configure test behavior
- Run tests in CI on every pull request

## Specific Testing Guidelines

### Testing Utilities and Pure Functions
- Test edge cases: null, undefined, empty strings, zero, negative numbers
- Test typical use cases
- Test error conditions if applicable
- Use table-driven tests for multiple input/output pairs

### Testing React Components
- Render the component with React Testing Library
- Query elements by role, label text, or test ID (avoid by text when possible)
- Test user interactions: clicks, inputs, form submissions
- Test loading and error states
- Test accessibility with axe

### Testing Services
- Test service functions with mocked dependencies (repositories, external APIs)
- Test both success and error cases
- Test transactional behavior
- Test validation logic

### Testing API Routes
- Use Supertest to make HTTP requests to routes
- Test various HTTP methods (GET, POST, PUT, DELETE)
- Test with valid and invalid input
- Test authentication and authorization (when implemented)
- Test error handling and status codes

### Testing Database Operations
- Use a test database seeded with known data
- Test CRUD operations
- Test relationships and constraints
- Test transaction rollbacks

## Test Execution

### Local Development
- Run all tests: `npm test`
- Run unit tests: `npm run test:unit`
- Run integration tests: `npm run test:integration`
- Run e2e tests: `npm run test:e2e`
- Watch mode: `npm run test:watch`

### Continuous Integration
- Tests run on every pull request
- Coverage reports generated and uploaded
- Build fails if coverage drops below threshold

## Coverage Requirements
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## Test Maintenance
- Keep tests up-to-date with code changes
- Remove tests for deleted features
- Update tests when interfaces change
- Regularly review and refactor test code
- Delete redundant or obsolete tests

## Common Testing Pitfalls to Avoid
- Testing implementation details instead of behavior
- Over-mocking leading to tests that don't reflect reality
- Flaky tests due to timing or external dependencies
- Tests that are too slow and discourage frequent runs
- Lack of clear test failure messages

## Resources
- Jest Documentation: https://jestjs.io/
- React Testing Library: https://testing-library.com/docs/react-testing-library/
- @testing-library/react-hooks: https://react-hooks-testing-library.com/
- Playwright: https://playwright.dev/
- Cypress: https://www.cypress.io/

-- 
*Last updated: July 16, 2026*