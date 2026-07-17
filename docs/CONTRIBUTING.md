# Contributing to MK9 Analytics

Thank you for considering contributing to MK9 Analytics! We welcome contributions from the community.

## How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs or request features
- Please include:
  - A clear and descriptive title
  - Steps to reproduce the issue (for bugs)
  - Expected vs actual behavior
  - Screenshots or screen recordings if applicable
  - Your environment (browser, OS, etc.)

### Submitting Changes
1. Fork the repository
2. Create a new branch for your feature or fix (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure your code follows our coding standards
5. Add or update tests as needed
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request against the `main` branch

## Development Setup

### Prerequisites
- Node.js 18.x or later
- npm 9.x or later
- Docker and Docker Compose
- Git

### Getting Started
1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment example:
   ```bash
   cp .env.example .env
   ```
4. Start the development environment:
   ```bash
   docker-compose up -d
   ```
5. Initialize the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Coding Standards

### TypeScript
- Use TypeScript strict mode (enabled in `tsconfig.json`)
- Prefer interfaces over types for object shapes
- Use type assertions sparingly
- Avoid `any` type when possible

### React
- Use functional components with hooks
- Keep components small and focused
- Use proper React keys in lists
- Implement error boundaries where appropriate
- Use React Query for data fetching

### Styling
- Use Tailwind CSS utility classes
- Avoid custom CSS when possible
- Follow the existing design system (Shadcn/UI)
- Ensure responsive design for all components

### Code Formatting
- Use Prettier for code formatting
- Follow ESLint rules
- Run `npm run lint` before submitting PRs
- Run `npm run format` to auto-format code

### Naming Conventions
- Components: PascalCase (e.g., `Button.tsx`)
- Functions and variables: camelCase (e.g., `calculateTotal()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE`)
- Files: match component/function name (e.g., `UserProfile.tsx` for `UserProfile` component)
- API routes: kebab-case in URL (e.g., `/api/promotores`)

### Database Changes
- Modify `prisma/schema.prisma` for schema changes
- Generate migrations with `npx prisma migrate dev --name <description`
- Never modify existing migration files
- Keep seed data idempotent

## Pull Request Process
1. Ensure your code passes all linting checks
2. Update documentation if needed
3. Add tests for new functionality
4. Ensure PR description clearly explains the changes
5. Reference any related issues
6. Keep PRs focused on a single feature or bug fix
7. Be responsive to reviewer feedback

## Code Review Guidelines
- Look for correctness and completeness
- Check adherence to coding standards
- Verify tests are present and passing
- Ensure documentation is updated
- Check for potential performance issues
- Verify security considerations

## Community
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Give credit where it's due
- Stay focused on the project goals

Thank you for contributing to MK9 Analytics!