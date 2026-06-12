# Testing Rules

All changes in this repository MUST be accompanied by appropriate tests.

## General Rules
- Colocate tests with source: `{name}_test.go` for Go, `index.test.tsx` for React.
- Always aim for deterministic tests; mock external network dependencies.

## Backend Testing (Go)
- **Framework:** Use `testify/suite` for structured tests.
- **Database:** Use real database instances in integration tests, but wrap operations in transactions that roll back to ensure isolation.
- **Mocks:** Use `testhelpers` for common mocks like Okta authentication. Use **gomock** for interface-level dependency injection mocks.

## Frontend Testing (React)
- **Test runner:** **Vitest** (not Jest).
- **Framework:** Use **React Testing Library (RTL)** for component testing.
- **Patterns:** Test behavior from the user's perspective (e.g., `screen.getByText`) rather than implementation details.
- **GraphQL:** Use `MockedProvider` from `@apollo/client/testing` to mock GQL responses.
- **Accessibility:** Use `jest-axe` to catch basic a11y violations in unit tests.
- **Snapshots:** Snapshot tests are permitted for stable UI components but must be reviewed on every update.

## End-to-End (Cypress)
- E2E tests live in the `cypress/` directory.
- Critical user journeys (e.g., creating a model plan, signing a document) MUST have E2E coverage.
- Use `cy.intercept` to handle external service dependencies where appropriate.

## Test Coverage Checklist
- [ ] New features have corresponding unit tests.
- [ ] Edge cases and boundary conditions are covered.
- [ ] Error/failure conditions are tested explicitly.
- [ ] API changes have integration test coverage.

## Test Quality Checklist
- [ ] Tests are deterministic and isolated (no shared mutable state).
- [ ] External network calls are mocked.
- [ ] Backend integration tests wrap DB operations in transactions that roll back.
- [ ] Authentication is mocked via `testhelpers` (not real Okta calls).
- [ ] E2E tests cover all critical user journeys end-to-end.

## Coverage Thresholds
The project enforces minimum coverage; do not let new code push totals below:
- **Branches / Functions**: 50%
- **Lines / Statements**: 60%

Stories (`.stories.tsx`) and snapshots are excluded from coverage reporting.
