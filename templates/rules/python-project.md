# Python Project — Coding Rules

## Type Safety
- Use type hints for all function signatures
- Run mypy/pyright in CI — no `type: ignore` without comment
- Use `TypedDict` for structured dicts, `dataclass` for data containers
- Prefer `Protocol` over `ABC` for structural typing

## Patterns
- Use `pathlib.Path` over `os.path`
- Prefer `contextlib` context managers for resource cleanup
- Use `logging` module — never `print()` for production output
- Use `enum.Enum` for fixed choice sets

## Imports
- Group: stdlib → third-party → local, separated by blank lines
- Use absolute imports from package root
- Avoid wildcard imports (`from x import *`)

## Testing
- Use pytest fixtures over setUp/tearDown
- Parametrize tests for multiple input cases
- Use `tmp_path` fixture for file operations
- Mock external services at boundary (httpx, database)
