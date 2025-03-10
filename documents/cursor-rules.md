# Student Project Showcase - Cursor Rules

## Code Style & Formatting

- Use consistent indentation (2 spaces)
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for functions and components
- Keep files under 300 lines when possible
- Use TypeScript for type safety

## Project Structure

- Organize components by feature/domain
- Keep related files close together
- Use barrel exports (index.ts) for cleaner imports
- Separate UI components from business logic
- Follow Next.js app router conventions

## Component Guidelines

- Create reusable components in `/components` directory
- Use functional components with hooks
- Implement proper prop validation with TypeScript
- Extract complex logic to custom hooks
- Keep components focused on a single responsibility

## State Management

- Use React Context for global state
- Prefer local state for component-specific data
- Implement proper loading and error states
- Use SWR/React Query for data fetching and caching

## AWS Amplify Conventions

- Follow Amplify Gen 2 best practices
- Keep backend definitions in `/amplify/backend` directory
- Use environment variables for configuration
- Implement proper authentication checks
- Follow least privilege principle for IAM roles

## Testing

- Write unit tests for utility functions
- Create component tests for UI elements
- Implement integration tests for critical user flows
- Use mock data for external dependencies

## Git Workflow

- Use descriptive branch names (feature/, bugfix/, etc.)
- Write clear commit messages
- Create focused pull requests
- Review code before merging

## Documentation

- Update documentation as code changes
- Document API endpoints and data models
- Add comments for complex logic
- Keep README up to date

This document will be updated as the project evolves and new conventions are established. 