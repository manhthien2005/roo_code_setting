# TypeScript Project — Coding Rules

## Type Safety
- Use `strict: true` in tsconfig.json
- Prefer explicit types over `any` — use `unknown` when type is truly unknown
- Use discriminated unions over type assertions
- Prefer `interface` for object shapes, `type` for unions/intersections

## Patterns
- Use `Result<T, E>` pattern for error handling (no throwing in library code)
- Prefer `const` assertions for literal types
- Use `satisfies` operator for type-safe object literals
- Prefer `Map`/`Set` over plain objects for dynamic keys

## Imports
- Use path aliases (`@/`) instead of deep relative paths (`../../../`)
- Barrel exports only for public API — avoid re-exporting internal modules
- Group imports: external → internal → types → styles

## Testing
- Use describe/it blocks matching file structure
- Mock at module boundary, not internal functions
- Test types with `expectTypeOf` (vitest) or `tsd`
