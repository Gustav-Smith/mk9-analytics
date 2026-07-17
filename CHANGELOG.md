# Changelog - MK9 Analytics

All notable changes to this project will be documented in this file.

## [Unreleased]
- Initial project setup with Next.js 16, TypeScript, Tailwind CSS v4, Shadcn/UI
- Prisma 6 ORM configuration with PostgreSQL
- Core data models defined
- Basic UI components and layout
- Docker configuration for development

## [v0.1.0] - 2026-07-12
### Added
- Initial project structure with Next.js 16 and TypeScript
- Tailwind CSS v4 and Shadcn/UI integration
- Prisma 6 ORM with PostgreSQL database
- Docker Compose configuration for PostgreSQL and n8n
- Core data models: User, Supervisor, Promoter, Industry, Store, Visit, Operation, Import, ImportFile, SyncLog
- Initial seed data script
- Basic authentication layout (login page)
- Dashboard layout with sidebar and topbar
- Initial module structure: imports, industries, operations, promoters, reports, routes, shared, stores, visits, whatsapp
- Basic API routes for promoters (GET/POST /api/promotores, GET/PUT/DELETE /api/promotores/[id])
- Dynamic API route for individual resources (/api/[id])
- Import page UI with drag-and-drop zone and history table
- Promoters list page (static)
- Dashboard components: stats-card, supervisor-card, visits-chart, pending-visits
- Layout components: sidebar, topbar, dashboard-layout
- Basic UI components from Shadcn/UI: button, card, input, dropdown-menu, etc.
- Environment variable template (.env.example)
- README.md with project overview
- TypeScript and ESLint configuration

### Changed
- Restructured application layout to separate dashboard and public pages
- Updated docker-compose to include PostgreSQL and n8n services
- Added environment variables for database configuration