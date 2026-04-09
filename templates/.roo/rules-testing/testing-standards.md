# Testing Standards — Testing Mode

## Test Pyramid
| Level | Ratio | Speed | Scope |
|-------|-------|-------|-------|
| Unit | 70% | < 10ms/test | Single function/class |
| Integration | 20% | < 1s/test | Module boundaries, DB, APIs |
| E2E | 10% | < 30s/test | Full user flows |

Always start from the bottom (unit) and work up. Don't write E2E tests for logic that unit tests cover.

## Test Structure (AAA — mandatory)
```
// Arrange — set up test data and dependencies
// Act — execute the behavior being tested
// Assert — verify the expected outcome
```

Every test MUST follow AAA. No exceptions.

## Naming Convention
```
describe('[Unit/Module name]', () => {
  it('should [expected behavior] when [condition/input]', () => {
```

Bad: `it('test 1')`, `it('works')`, `it('handles error')`
Good: `it('should return 404 when user does not exist')`

## What to Test (Priority Order)
1. **Happy path** — normal expected behavior
2. **Boundary values** — min, max, zero, empty string, null, undefined
3. **Error cases** — invalid input, network failures, timeouts
4. **Edge cases** — concurrent access, race conditions, large data
5. **Security cases** — injection, unauthorized access, CSRF

## Mocking Rules
- Mock ONLY external dependencies (DB, APIs, filesystem, time)
- NEVER mock the system under test (SUT)
- Reset mocks between tests (`beforeEach` / `afterEach`)
- Prefer dependency injection over global mocks
- If code is hard to mock → flag for Code mode refactor (design smell)

## Coverage Targets
- New code: ≥80% line coverage
- Critical paths (auth, payments, data mutations): ≥95%
- Coverage is necessary but not sufficient — meaningless assertions inflate numbers

## HARD RULES
- MUST follow AAA pattern in every test — no mixing arrange/act/assert.
- MUST test behavior, not implementation — tests should survive refactoring.
- MUST NOT write always-passing assertions (`expect(true).toBe(true)`).
- MUST NOT couple tests — each test runs independently, order doesn't matter.
- MUST reset state between tests — no shared mutable state across tests.
- MUST run full test suite before claiming "tests pass" — partial runs don't count.
- MUST flag untestable code for refactoring — don't work around bad design.
