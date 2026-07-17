# Dashboard - MK9 Analytics

## Overview
The dashboard is the central interface for monitoring and analyzing Trade Marketing operations. It provides visualizations, key metrics, and actionable insights to help supervisors and managers make data-driven decisions.

## Current Implementation
As of Sprint 2 (Import Module in progress), the dashboard consists of:
- A layout with sidebar and topbar navigation
- Static placeholder components for metrics and charts
- No live data connections yet

## Planned Features

### Main Dashboard View (`/dashboard`)
#### Key Metrics Cards
- **Total Scheduled Visits**: Number of visits planned for the current operation
- **Completed Visits**: Count and percentage of visits marked as REALIZADA
- **Canceled Visits**: Count and percentage of visits marked as CANCELADA
- **Compliance Rate**: Ratio of completed to scheduled visits (target: >85%)
- **Visits This Week**: Trend compared to previous week
- **Average Visit Duration**: Average time spent per visit (when available)
- **Promoter Attendance Rate**: Percentage of scheduled visits where promoter showed up

#### Charts and Visualizations
- **Visits Trend Over Time**: Line chart showing daily visit completion rates for the current operation
- **Status Distribution**: Pie chart showing proportion of PLANEJADA, REALIZADA, CANCELADA visits
- **Top Performers**: Bar chart showing completion rates by promoter (top 5)
- **Activity Heatmap**: Calendar heatmap showing visit density by day of week and time of day
- **Geographic Distribution**: Map showing visit counts by region/state (when location data available)

#### Interactive Elements
- **Date Range Selector**: Filter data by custom date ranges, presets (today, yesterday, this week, last week, this month, last month)
- **Operation Selector**: Switch between different monthly operations
- **Promoter/Supervisor Filter**: Drill down to specific individuals or teams
- **Store/Industry Filter**: Focus on specific locations or client brands
- **Export Options**: Download dashboard data as CSV or PDF

### Promoters View (`/dashboard/promotores`)
#### Promoter Table
- Columns: Name, Supervisor, Assigned Visits, Completed Visits, Compliance Rate, Last Activity
- Sortable columns
- Inline editing for basic info (name, contact)
- Status indicators (active/inactive)

#### Performance Charts
- Bar chart comparing completion rates across promoters
- Pie chart showing distribution of visit statuses per selected promoter

#### Filters
- Supervisor dropdown
- Date range picker
- Status filter (all/planned/completed/canceled)
- Search box for promoter name

### Pending Visits (`/dashboard/pending-visits`)
#### Visits Table
- Columns: Promoter, Store, Industry, Scheduled Date, Status, Actions
- Row highlighting for overdue visits (scheduled > 2 hours ago)
- Action buttons: Mark as Completed, Mark as Canceled, Add Notes
- Inline editing for scheduled date/time

#### Bulk Actions
- Select multiple visits for batch status updates
- Export selected visits to CSV

#### Filters
- Date range (today, tomorrow, this week, custom)
- Promoter selector
- Store/industry filters
- Status filter (defaults to showing only planned visits)

## Technical Implementation
- Built with React Server Components and Client Components
- Data fetching using React Query (`@tanstack/react-query`)
- State management via React Query server state
- UI built with Tailwind CSS and Shadcn/UI components
- Charts using Recharts library
- Responsive design for mobile and desktop

## Future Enhancements
- Real-time updates via WebSocket or optimized polling
- Customizable dashboard layouts (drag-and-drop widgets)
- Role-based views (Supervisor vs. Analyst vs. Executive)
- Advanced filtering and search capabilities
- Animated transitions and micro-interactions
- Export to additional formats (PDF, Excel)
- Scheduled email reports