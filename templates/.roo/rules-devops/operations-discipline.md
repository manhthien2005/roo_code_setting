# Operations Discipline — DevOps Mode

## Core Principles
- **Infrastructure as Code** — all infra changes through version-controlled config, never manual.
- **Immutable Deployments** — don't modify running instances; replace with new ones.
- **Least Privilege** — services get minimum permissions needed, nothing more.
- **Fail Gracefully** — design for failure: retries, circuit breakers, graceful degradation.

## Change Management
1. **Plan**: Document what will change, what could break, rollback steps.
2. **Review**: Another pair of eyes on infra changes — they're production-impacting.
3. **Test**: Staging/preview environment first. Never test in production.
4. **Deploy**: Blue-green or canary. Never big-bang for critical services.
5. **Monitor**: Watch metrics for 15 min post-deploy. Rollback threshold defined upfront.
6. **Document**: Update runbooks, architecture diagrams, and on-call docs.

## CI/CD Pipeline Standards
- **Build**: Deterministic, reproducible builds. Pin dependency versions.
- **Test**: Unit + integration tests gate every PR. Flaky tests = blocked pipeline.
- **Security**: SAST/DAST scans in pipeline. Secrets never in code or CI config.
- **Deploy**: Automated deployment to staging. Manual approval gate for production.
- **Rollback**: Every deployment must have a tested rollback procedure.

## Secrets Management
- NEVER store secrets in: code, CI config files, Docker images, logs, or error messages.
- Use dedicated secret managers: GitHub Secrets, Vault, AWS Secrets Manager, etc.
- Rotate secrets on schedule and immediately after any suspected exposure.
- Audit secret access — who accessed what and when.

## Incident Response
1. **Detect**: Alert fires → acknowledge within 5 min.
2. **Assess**: Impact? Scope? Users affected? Severity level?
3. **Mitigate**: Stop the bleeding first. Rollback if needed.
4. **Investigate**: Root cause AFTER mitigation. Don't debug during outage.
5. **Postmortem**: Blameless. Document: timeline, root cause, prevention actions.

## Monitoring Essentials
- **4 Golden Signals**: Latency, Traffic, Errors, Saturation.
- Alert on symptoms (error rate up), not causes (CPU high).
- Dashboard for every service: health, dependencies, error rates.
- Log structured data (JSON) — not free-form text.

## HARD RULES
- MUST NOT make manual infrastructure changes — use IaC (Terraform, CloudFormation, etc.).
- MUST have rollback procedure before deploying — no deploy without escape plan.
- MUST NOT store secrets in code or CI config — use secret managers.
- MUST test in staging before production — no YOLO deploys.
- MUST monitor after every deployment — silent failures are the worst failures.
- MUST document all infrastructure changes — undocumented infra = tech debt bomb.
- MUST use least privilege for all service accounts — over-permissioned = attack surface.
