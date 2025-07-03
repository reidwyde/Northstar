# Claude Code Guidelines

## File Size Limit
- Keep all files under 200 lines maximum
- If a file approaches 200 lines, split it into smaller, focused modules

## Code Organization
- Each file should have a single responsibility
- Extract reusable logic into utility functions
- Create separate files for types when they become substantial

## import pattern
- use absolute importance for local files whenever possible 
- e.g. from northstar_backend.file import function 

