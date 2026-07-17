# Start Here - MK9 Analytics

Welcome to the MK9 Analytics project! This document is the starting point for understanding and contributing to the project.

## Project Overview

MK9 Analytics is a comprehensive web application for operational management of Trade Marketing. It automates data collection, integration, and analysis from Excel spreadsheets, Google Drive, and other sources to centralize control of monthly operations, promoters, stores, industries, routes, and visits.

## Key Documentation

- [Project Context](./PROJECT_CONTEXT.md) - Overview of the project objectives and scope
- [Current State](./CURRENT_STATE.md) - Current state of the project, including what's implemented and what's pending
- [Architecture Rules](./ARCHITECTURE_RULES.md) - Architectural guidelines and patterns used
- [Business Rules](./BUSINESS_RULES.md) - Business rules and domain logic
- [Database Context](./DATABASE_CONTEXT.md) - Database schema and relationships
- [Modules](./MODULES.md) - Overview of all modules in the system
- [Module Index](./MODULE_INDEX.md) - Detailed index of each module's responsibilities and dependencies
- [Import Flow](./IMPORT_FLOW.md) - Detailed description of the import process flow
- [Dashboard Rules](./DASHBOARD_RULES.md) - Specific guidelines for the dashboard module
- [AI Instructions](./AI_INSTRUCTIONS.md) - Instructions for AI agents working on this project
- [Prompt Library](./PROMPTS.md) - Collection of useful prompts for AI interaction
- [Decisions](./DECISIONS.md) - Record of important architectural and technical decisions
- [Known Issues](./KNOWN_ISSUES.md) - Current known issues and limitations
- [Common Mistakes](./COMMON_MISTAKES.md) - Common pitfalls to avoid
- [Testing Rules](./TESTING_RULES.md) - Guidelines for writing and maintaining tests
- [Security Rules](./SECURITY_RULES.md) - Security best practices and guidelines
- [Deployment Rules](./DEPLOY_RULES.md) - Deployment procedures and considerations
- [Future Plans](./FUTURE.md) - Planned features and enhancements

## Getting Started

1. **Read the Project Context** to understand the objectives and scope
2. **Review the Current State** to see what's implemented and what needs work
3. **Understand the Architecture** by reading the Architecture Rules and Database Context
4. **Explore the Modules** to understand how the system is organized
5. **Check the Known Issues** before starting work to avoid duplication of effort
6. **Follow the Coding Standards** outlined in the various rule documents

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables: copy `.env.example` to `.env` and fill in the required values
4. Set up the database: `npm run db:migrate` followed by `npm run db:seed`
5. Start the development server: `npm run dev`

## Contributing

Please read [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Getting Help

If you're stuck, check:
- The [Known Issues](./KNOWN_ISSUES.md) document
- The [FAQ](../docs/FAQ.md) if it exists
- Ask in the team communication channels
- Review the [AI Instructions](./AI_INSTRUCTIONS.md) for guidance on how to proceed

## Next Steps

Check the [Next Sprint](./NEXT_SPRINT.md) and [Current Sprint](./CURRENT_SPRINT.md) documents to understand what's currently being worked on and what's coming up.