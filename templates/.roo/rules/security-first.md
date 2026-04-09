# Security First — All Modes

## CRITICAL Checks (from ECC code-reviewer)
- **No hardcoded credentials** — API keys, passwords, tokens, connection strings must use env vars.
- **No SQL injection** — Use parameterized queries, never string concatenation.
- **No XSS** — Sanitize user input before rendering in HTML/JSX.
- **No path traversal** — Validate and sanitize user-controlled file paths.
- **No secrets in logs** — Never log tokens, passwords, or PII.

## Secure Defaults
- Validate inputs at trust boundaries (API routes, form handlers).
- Use HTTPS, CORS, and CSRF protection for web endpoints.
- Apply principle of least privilege for permissions and access.
- Add rate limiting on public-facing endpoints.

## When Writing Code
- Use `.env` files for secrets, add `.env` to `.gitignore`.
- Provide `.env.example` with placeholder values for documentation.
- Never trust client-side data — always re-validate server-side.

## Before Every Commit (from ECC security checks)
- Scan for hardcoded secrets (grep for `password=`, `token=`, `apiKey=`, `secret=`).
- Verify `.env` is in `.gitignore` — never commit secrets to version control.
- Check that error messages do NOT expose internal details (stack traces, DB schema).
- Confirm authentication/authorization checks are not bypassed by new code paths.

## Security Incident Response
- If you discover exposed secrets: **STOP** → rotate immediately → notify user.
- If you find a vulnerability in existing code: document it, flag severity, DO NOT silently fix without user awareness.
- When adding new endpoints: verify auth middleware is applied BEFORE handler logic.

## HARD RULES
- MUST NOT hardcode secrets — scan for `password=`, `token=`, `apiKey=`, `secret=` before commit.
- MUST verify `.env` is in `.gitignore` when secrets are involved.
- MUST NOT expose stack traces or internal details in error responses.
- MUST validate all user inputs at trust boundaries — no blind trust of client data.
- MUST escalate security concerns to user immediately — never silently fix auth bypasses.
- MUST apply auth middleware BEFORE route handlers — never after.
