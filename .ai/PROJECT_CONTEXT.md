# MK9 Analytics - Project Context

## Project Overview
MK9 Analytics is a comprehensive web application for operational management of Trade Marketing, designed to automate data collection, integration, and analysis from Excel spreadsheets, Google Drive, and other sources. The system centralizes control of monthly operations, promoters, stores, industries, routes, and visits, providing interactive dashboards for strategic decision-making.

## Business Domain
- **Industry**: Trade Marketing / Trade Marketing Operations
- **Core Entities**: Operations, Visits, Promoters, Stores, Industries, Supervisors
- **Primary Users**: Trade Marketing Managers, Field Supervisors, Sales Promoters, Operations Team
- **Key Processes**: Visit scheduling, execution tracking, data import from spreadsheets, performance analytics

## Problem Statement
The project addresses fragmented data management in trade marketing operations where:
- Data is scattered across multiple spreadsheets and emails
- Lack of real-time visibility into promoter activities and store compliance
- Error-prone manual data entry processes
- Intuition-based decision making due to lack of structured analytics
- Complex external integrations with Google Drive, WhatsApp, and other field tools

## Target Audience
1. **Trade Marketing Managers** - Need consolidated view of campaign performance and ROI
2. **Field Supervisors** - Require tools to monitor and guide promoters in real-time
3. **Sales Promoters** - Need simplified access to schedules and activity reporting
4. **Operations Team** - Responsible for data loading, validation, and quality assurance
5. **Commercial Leadership** - Seeks strategic indicators for budget allocation and market planning

## Current Status
- **Version**: 0.1.0 (Initial development phase)
- **Status**: Active development - Core modules (dashboard, imports) in progress
- **Technology Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL
- **Architecture**: Hybrid DDD + Modular architecture with clear layer separation
- **Database**: PostgreSQL with Prisma ORM
- **API Layer**: Next.js API routes with RESTful design
- **Frontend**: React Server Components and Client Components with Shadcn/UI

## Key Features Implemented
- User authentication and role management (ADMIN/SUPERVISOR)
- Core entity models (User, Supervisor, Promoter, Store, Industry, Visit, Operation)
- Dashboard with key metrics and visualizations
- Spreadsheet import functionality (Excel/CSV)
- Visit scheduling and tracking
- Operation management (monthly campaigns)
- Audit trails for all entities

## Planned Features
- WhatsApp Business API integration for automated communication
- Google Drive/Sheets direct integration
- AI-powered operational insights and predictive analytics
- Advanced analytics and reporting module
- Enhanced promoter and store management
- Real-time dashboard updates
- n8n workflow automation integration
- Mobile-friendly interface for field promoters

## Technical Constraints
- Must maintain backward compatibility with existing database schema
- Follow existing architectural patterns (DDD, modular architecture)
- Use existing technology stack (Next.js, Prisma, etc.)
- Maintain type safety with TypeScript strict mode
- Follow existing coding standards and conventions
- Preserve existing API contracts unless absolutely necessary
- Maintain responsive design principles