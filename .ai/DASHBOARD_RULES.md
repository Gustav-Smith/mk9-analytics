# Dashboard Rules - MK9 Analytics

## Overview
This document outlines the specific rules, conventions, and best practices for the Dashboard module in MK9 Analytics.

## Module Structure
```
src/modules/dashboard/
├── components/       # Dashboard-specific UI components
├── hooks/            # Custom React hooks for dashboard logic
├── pages/            # Dashboard-related Next.js pages
├── services/         # Dashboard application logic
├── types/            # Dashboard domain TypeScript types
├── utils/            # Dashboard-specific utilities
├── constants/        # Dashboard-specific constants
├── schemas/          # Dashboard-specific validation schemas (if any)
└── README.md         # Module-specific documentation
```

## Component Guidelines
- **Dashboard Layout**: Use the dashboard layout component (`src/components/dashboard/layout.tsx`) for consistent header, sidebar, and main structure.
- **Widgets**: Create reusable widget components (stats cards, charts, tables) in `src/modules/dashboard/components/`.
- **Responsiveness**: Ensure all dashboard components are responsive and work on various screen sizes.
- **Loading States**: Implement skeleton loaders or spinners for asynchronous data loading.
- **Error States**: Display user-friendly error messages when data fetching fails.
- **Empty States**: Show informative empty states when no data is available.

## Hooks Guidelines
- **Data Fetching**: Use React Query (`@tanstack/react-query`) for server state management in custom hooks.
- **Custom Hooks**: Place dashboard-specific hooks in `src/modules/dashboard/hooks/`.
- **Naming**: Prefix custom hooks with `use` (e.g., `useVisitStats`, `useRecentActivities`).
- **Separation of Concerns**: Separate data fetching logic from UI state management in hooks.
- **Stale Data**: Configure appropriate stale times for different types of data (e.g., stats may be stale for 5 minutes, real-time data for 30 seconds).

## Page Guidelines
- **File Structure**: Place dashboard pages in `src/modules/dashboard/pages/`.
- **Routing**: Use Next.js App Router with route groups if necessary.
- **Layout**: Wrap pages in the dashboard layout for consistent styling.
- **Metadata**: Export `metadata` object for SEO and social sharing where applicable.
- **Loading UI**: Utilize React Suspense or loading.js for route-level loading states.

## Service Guidelines
- **Business Logic**: Encapsulate dashboard-specific business logic in services (`src/modules/dashboard/services/`).
- **Data Aggregation**: Services should handle data aggregation, filtering, and formatting for display.
- **Reusability**: Design services to be reusable across different dashboard views.
- **Error Handling**: Services should throw meaningful errors that can be caught by UI layers.
- **Testing**: Write unit tests for service functions to ensure correctness.

## Types Guidelines
- **Domain Types**: Define TypeScript interfaces and types specific to the dashboard domain in `src/modules/dashboard/types/`.
- **API Responses**: Type API response data to ensure type safety throughout the application.
- **UI Props**: Define prop types for dashboard components to ensure correct usage.
- **Avoid Any**: Minimize use of `any` type; prefer specific types or generics.

## Utilities Guidelines
- **Helper Functions**: Place dashboard-specific utility functions in `src/modules/dashboard/utils/`.
- **Data Transformation**: Utilities for formatting dates, numbers, and strings for display.
- **Chart Helpers**: Functions to prepare data for charting libraries (Recharts).
- **Reusability**: Ensure utilities are pure functions where possible for ease of testing.

## Constants Guidelines
- **Configuration**: Define dashboard-specific constants in `src/modules/dashboard/constants/` (e.g., chart colors, default date ranges).
- **Magic Values**: Replace magic numbers and strings with named constants.
- **Export**: Export constants as named exports for easy import.

## Styling Guidelines
- **Tailwind CSS**: Use Tailwind CSS utility classes for styling.
- **Component Consistency**: Follow Shadcn/UI patterns for component styling.
- **Dark Mode**: Ensure components work correctly in both light and dark modes.
- **Spacing**: Use consistent spacing (padding, margin) based on the 4px grid system.
- **Typography**: Follow the established typographic scale (text-sm, text-base, text-lg, etc.).

## Data Fetching Guidelines
- **Server Components**: Prefer Server Components for initial data loading when possible.
- **Client Components**: Use `useQuery` or `useInfiniteQuery` for client-side data fetching.
- **Stale-While-Revalidate**: Leverage React Query's stale-while-revalidate caching strategy.
- **Prefetching**: Consider prefetching data for anticipated user actions.
- **Optimistic Updates**: Implement optimistic updates for mutations where appropriate.

## Chart Guidelines
- **Library**: Use Recharts for data visualization.
- **Responsiveness**: Make charts responsive using the `ResponsiveContainer` component.
- **Tooltips**: Customize tooltips for better readability and information density.
- **Legends**: Position legends appropriately to avoid obscuring data.
- **Accessibility**: Ensure charts are accessible (provide aria-labels, consider color blindness).
- **Performance**: Optimize data points for large datasets (consider sampling or aggregation).

## Table Guidelines
- **Pagination**: Implement server-side pagination for large datasets.
- **Sorting**: Allow sorting by column (clickable headers).
- **Filtering**: Provide column-level or global filtering capabilities.
- **Selection**: Support row selection (single or multiple) when needed.
- **Export**: Offer CSV/Excel export functionality for tabular data.
- **Responsiveness**: Make tables horizontally scrollable on small screens.

## Metrics Cards Guidelines
- **Consistency**: Use consistent card designs for similar metric types.
- **Trends**: Show trend indicators (up/down/same) with appropriate colors.
- **Comparison**: Display comparative values (e.g., vs. previous period) when relevant.
- **Tooltips**: Provide additional context on hover or click.
- **Accessibility**: Ensure sufficient color contrast and readable font sizes.

## Activity Feed Guidelines
- **Chronological Order**: Display items in reverse chronological order (newest first).
- **Grouping**: Consider grouping similar activities (e.g., multiple visits completed).
- **Actions**: Provide actionable items (e.g., "View details", "Mark as complete").
- **Timestamps**: Use relative timestamps ("5 minutes ago") for recent events, absolute for older ones.
- **Scrolling**: Implement virtual scrolling for long lists to maintain performance.

## Quick Actions Guidelines
- **Prominence**: Make frequently used actions easily accessible.
- **Grouping**: Group related actions together (e.g., all import-related actions).
- **Icons**: Use recognizable icons with tooltips for clarity.
- **Confirmation**: Ask for confirmation for destructive actions.
- **Loading Indicators**: Show loading state when actions trigger asynchronous operations.

## Error Handling Guidelines
- **User-Friendly Messages**: Display clear, actionable error messages to users.
- **Logging**: Log errors to console (development) or external service (production) for debugging.
- **Recovery Options**: Provide ways to recover from errors (e.g., retry button, alternative actions).
- **Boundary Errors**: Use React error boundaries to catch and handle unexpected errors in component trees.

## Performance Guidelines
- **Data Fetching**: Fetch only the data needed for the current view.
- **Component Rendering**: Use React.memo, useCallback, useMemo to prevent unnecessary re-renders.
- **Virtualization**: Implement virtual scrolling for long lists (tables, activity feeds).
- **Image Optimization**: Use optimized images and appropriate formats.
- **Bundle Splitting**: Leverage Next.js automatic code splitting; consider dynamic imports for heavy components.

## Accessibility Guidelines
- **Keyboard Navigation**: Ensure all interactive elements are accessible via keyboard.
- **ARIA Labels**: Provide meaningful ARIA labels for icons and non-text elements.
- **Color Contrast**: Ensure sufficient color contrast for text and UI elements.
- **Focus Management**: Manage focus appropriately for modal dialogs and dynamic content.
- **Screen Reader Support**: Test with screen readers to ensure content is announced correctly.

## Testing Guidelines
- **Unit Tests**: Test utility functions, helpers, and pure functions.
- **Component Tests**: Test React components with React Testing Library.
- **Hook Tests**: Test custom hooks with appropriate testing libraries.
- **Service Tests**: Test service functions with mocked dependencies.
- **E2E Tests**: Consider end-to-end tests for critical user journeys (using Playwright or Cypress).

## Internationalization Guidelines (Future)
- **Externalize Strings**: Prepare for i18n by extracting user-facing strings.
- **Date/Number Formatting**: Use date-fns or Intl for locale-aware formatting.
- **Layout Considerations**: Account for text expansion in different languages.
- **RTL Support**: Consider right-to-left language support in layout.

## Security Guidelines
- **Data Exposure**: Never expose sensitive data in dashboard views.
- **Input Sanitization**: Sanitize any user input displayed in the dashboard.
- **Access Control**: Ensure users only see data they are authorized to view.
- **CSRF Protection**: Implement CSRF protection for state-changing operations.
- **Rate Limiting**: Consider rate limiting for dashboard-initiated API calls.

-- 
*Last updated: July 16, 2026*