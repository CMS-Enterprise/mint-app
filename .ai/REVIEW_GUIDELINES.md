# PR Review Guidelines

These guidelines are used by both human reviewers and AI agents to ensure high code quality and security.

## Review Triage

### 🔴 Critical (Request Changes)
- Security vulnerabilities (SQLi, XSS, insecure auth).
- Missing input validation on user-supplied data.
- Hardcoded secrets or API keys.
- Breaking changes (DB schema, API) without a migration path.
- Missing authorization checks on sensitive operations.
- Disabled tests without explicit, tracked justification.

### 🟡 Major (Strong Suggestion)
- Use of `any` in TypeScript.
- Console logs in production-bound code.
- TODO/FIXME comments without a linked issue.
- Performance issues (N+1 queries, inefficient loops).
- Missing error handling in async operations.
- Accessibility violations (WCAG 2.1).

### 🟢 Minor (Suggestion)
- Naming convention violations.
- Code formatting inconsistencies.
- Minor documentation gaps.
- Unused imports or variables.

## Specialized Checklists

### Documentation
- If this PR introduces or changes an architectural pattern, naming convention, tool, or established practice, is the relevant `.ai/` file updated in the same PR?

### Database Migrations
- Are migrations additive/non-breaking?
- Is there a corresponding update to the Go models?

### GraphQL Schema
- Are role-based directives (`@hasRole` or `@hasAnyRole`) applied?
- Is the schema organized by entity?

### Government Compliance
- Does the UI use USWDS components correctly?
- Is Section 508 compliance maintained?

## Security Review Checklist

### Authentication & Authorization
- [ ] All protected routes have authentication middleware.
- [ ] Role-based access control is properly implemented.
- [ ] JWT tokens are properly validated and parsed.
- [ ] Session management follows security best practices.
- [ ] Principal checks are present for all sensitive operations.

### Input Validation & Sanitization
- [ ] All user inputs are validated and sanitized.
- [ ] HTML content is sanitized using `bluemonday`.
- [ ] File uploads have proper type and size validation.
- [ ] GraphQL inputs have proper validation schemas.
- [ ] Database queries use parameterized statements only (no string concatenation).

### Error Handling & Logging
- [ ] Errors do not expose sensitive information in responses.
- [ ] Logs do not contain secrets or PII.
- [ ] Error responses are consistent across endpoints.
- [ ] Trace IDs are included for debugging.

### Headers & CORS
- [ ] CORS configuration is appropriate for the environment.
- [ ] Security headers (CSP, HSTS, etc.) are properly set and maintained.

## Performance Review Checklist

- [ ] No N+1 queries — use the DataLoader pattern for batch operations.
- [ ] New database columns/queries have appropriate indexes.
- [ ] Connection pooling is considered for new data sources.
- [ ] Frontend components are memoized where appropriate.
- [ ] Large lists use virtualization.
- [ ] Bundle size impact is considered for new dependencies.

## Common Issues to Flag

| Priority | Issue | Action |
|----------|-------|--------|
| 🔴 | Missing auth/principal check | Request changes |
| 🔴 | Hardcoded secret or API key | Request changes |
| 🟡 | `any` type in TypeScript | Suggest specific interface |
| 🟡 | `console.log` in production code | Remove |
| 🟡 | TODO/FIXME without a linked issue | Link or remove |
| 🟡 | Skipped/disabled tests without justification | Require justification |
| 🟡 | N+1 query — missing DataLoader usage | Suggest DataLoader |
| 🟢 | Non-strict equality (`==`) | Replace with `===` |
| 🟢 | Unused imports or variables | Remove |
| 🟢 | ESLint disable without justification comment | Add justification |

## Review Response Examples

### Missing Authorization
> 🔴 **Critical**: Missing principal check on a data-mutating operation.
> ```go
> principal := authentication.GetPrincipal(ctx)
> if !principal.AllowUSER() {
>     return nil, apperrors.NewUnauthorizedError(principal, "operation name")
> }
> ```

### TypeScript `any` Usage
> 🟡 **Major**: Avoid `any` — it defeats TypeScript's type safety. Define a proper interface:
> ```typescript
> interface ResponseData { id: string; name: string; }
> ```

### N+1 Query
> 🟡 **Major**: Potential N+1 query detected. Use the DataLoader pattern:
> ```go
> users, err := s.UserAccountGetByModelPlanIDLOADER(ctx, modelPlanID)
> ```

### Missing Tests
> 🟡 **Major**: New functionality requires tests. Please add unit tests, integration tests for API changes, and E2E tests for user-facing features.

## Compliance & Data Handling

- [ ] PII is properly handled and protected; not logged or exposed in responses.
- [ ] Audit trail is maintained for sensitive or data-mutating operations.
- [ ] Data retention policies are followed for stored records.
- [ ] USWDS components are used where applicable.
- [ ] WCAG 2.1 AA accessibility standards are met (color contrast, keyboard navigation, semantic HTML).

## Files Requiring Extra Scrutiny

### Security-Critical
- `pkg/authentication/` — Authentication logic
- `pkg/authorization/` — Authorization middleware
- `pkg/sanitization/` — Input sanitization
- `pkg/handlers/` — HTTP handlers
- `pkg/graph/resolvers/` — GraphQL resolvers

### Performance-Critical
- `pkg/storage/` — Database operations
- `pkg/graph/dataloader/` — Data loading and batch logic
- `src/hooks/` — React hooks with data fetching
- `src/components/` — Reusable UI components
