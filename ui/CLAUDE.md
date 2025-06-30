# Claude Code Guidelines

## File Size Limit
- Keep all files under 200 lines maximum
- If a file approaches 200 lines, split it into smaller, focused modules
- Use clear naming conventions for split files (e.g., `ComponentName.types.ts`, `ComponentName.utils.ts`)

## Code Organization
- Each file should have a single responsibility
- Extract reusable logic into utility functions
- Create separate files for types when they become substantial
- Use barrel exports (index.ts) to maintain clean imports

## File Splitting Guidelines
When files get too large, consider splitting along these lines:

### Components (React)
- Main component file: `ComponentName.tsx`
- Types: `ComponentName.types.ts`
- Styles: `ComponentName.styles.ts`
- Utils/helpers: `ComponentName.utils.ts`

### Screens
- Main screen file: `ScreenName.tsx`
- Screen-specific components: `ScreenName.components.tsx`
- Screen-specific hooks: `ScreenName.hooks.ts`

### General Code
- Break large utility files into focused modules
- Group related functions together
- Use meaningful file names that describe the contained functionality

## Current Project Structure
This project follows these guidelines for maintainable, readable code.