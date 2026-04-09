# Security Review Checklist — Security Review Mode

## Review Methodology
1. **Threat Model First**: Before reviewing code, identify: What are we protecting? From whom? What's the attack surface?
2. **Trust Boundaries**: Mark every point where data crosses a trust boundary (API routes, form inputs, file uploads, DB queries, external service calls).
3. **Follow the Data**: Trace user-controlled input from entry to storage/output. Flag any point where it's used without validation/sanitization.

## OWASP-Aligned Checklist

### Injection (SQL, NoSQL, Command, LDAP)
- Are all database queries parameterized? No string concatenation with user input?
- Are shell commands constructed without user input? If not, is input sanitized?
- Are LDAP/XPath queries using parameterized filters?

### Authentication & Session
- Are passwords hashed with bcrypt/scrypt/argon2 (not MD5/SHA1)?
- Is session management using secure, httpOnly, sameSite cookies?
- Are JWT tokens validated (signature, expiration, issuer)?
- Is multi-factor authentication available for sensitive operations?

### Authorization
- Is access control checked on EVERY endpoint (not just UI)?
- Are object-level permissions verified (IDOR prevention)?
- Is principle of least privilege applied?

### Data Exposure
- Are sensitive fields excluded from API responses (passwords, tokens, PII)?
- Are error messages generic (no stack traces, DB schema leaks)?
- Is PII encrypted at rest and in transit?

### Configuration
- Are secrets in environment variables (not hardcoded)?
- Is HTTPS enforced? HSTS headers set?
- Are CORS policies restrictive (not `*`)?
- Are security headers set (CSP, X-Frame-Options, X-Content-Type-Options)?

## Output Format
For each finding:
```
[SEVERITY] file:line — Issue description
Impact: What could an attacker do?
Fix: Concrete code change needed
```

Severity: 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | 🟢 LOW

## HARD RULES
- MUST check every trust boundary — no "looks safe" shortcuts.
- MUST trace user input end-to-end — if you can't trace it, flag it.
- MUST provide concrete fix for every finding — "fix this" is not actionable.
- MUST NOT approve code with 🔴 CRITICAL findings — request changes, no exceptions.
- MUST flag hardcoded secrets even in test files — secrets leak from tests too.
- MUST check auth/authz on every new endpoint — missing auth = automatic 🔴 CRITICAL.
