# Go Project — Coding Rules

## Idioms
- Accept interfaces, return structs
- Use `error` values — never panic in library code
- Keep packages small and focused (single responsibility)
- Prefer stdlib over third-party when feasible

## Error Handling
- Always check returned errors — never `_ = err`
- Wrap errors with context: `fmt.Errorf("doing X: %w", err)`
- Use sentinel errors (`var ErrNotFound = errors.New(...)`) for known conditions
- Use custom error types for errors needing extra data

## Naming
- Use MixedCase (exported) and mixedCase (unexported)
- Package names: short, lowercase, no underscores
- Interface names: `-er` suffix when single method (`Reader`, `Writer`)
- Avoid stutter: `http.Client` not `http.HTTPClient`

## Testing
- Table-driven tests with subtests (`t.Run`)
- Use `testdata/` directory for test fixtures
- Use `testing.T.Helper()` in test helper functions
- Parallel tests where safe (`t.Parallel()`)

## Project Structure
- Follow standard Go project layout (`cmd/`, `internal/`, `pkg/`)
- Use `internal/` to prevent external imports of private packages
- One `main.go` per binary in `cmd/{binary-name}/`
