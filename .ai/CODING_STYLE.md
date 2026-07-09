# Coding Style & Standards

This document defines the coding patterns and standards that MUST be followed across the MINT codebase.

## Go Backend Standards

### 0. Naming Conventions
- **Packages**: lowercase, single word (`handlers`, `models`, `storage`)
- **Files**: snake_case (`model_plan.go`, `plan_basics.go`)
- **Functions/Methods**: PascalCase exports with descriptive action prefixes (`ModelPlanCreate`, `PlanBasicsGetByModelPlanID`)
- **Structs**: PascalCase (`ModelPlan`, `PlanBasics`)
- **Interfaces**: PascalCase; use an `I` prefix when naming an interface that mirrors a concrete struct (`IBaseStruct`)

### 1. Store Pattern (Database Access)
All database operations must live in the `storage` package. New functions should follow this signature:
```go
func  {Entity}{Action}(ctx context.Context, np sqlutils.NamedPreparer, logger logging.ILogger, {entity} *models.{Entity}) (*models.{Entity}, error)
```
- Always use `sqlutils.NamedPreparer` to support both direct and transactional queries.
- Use parameterized queries to prevent SQL injection.
- All models should embed `baseStruct`, which provides a UUID-based `ID` field.
- SQL files are embedded via `//go:embed` in the `sqlqueries` package and loaded at startup; do not construct SQL strings at runtime. Do not embed SQL directly in the `storage` package

### 2. Authentication & Authorization
- Use the `Principal` interface for all authorization checks.
- Auth checks should happen at the **Service** or **Resolver** level before data access.
- GraphQL operations must use `@hasRole` or `@hasAnyRole` directives.
- Use the typed role methods on `Principal` rather than string comparisons:
  - `principal.AllowUSER()` — standard authenticated user
  - `principal.AllowASSESSMENT()` — assessment team member
  - `principal.AllowMAC()` — MAC user

### 3. Error Handling
Two acceptable patterns — prefer wrapping for errors that require diagnostic context or should trigger alerts:
```go
// ✅ Preferred: wrapped error with context
if err != nil {
    logger.Error("Failed to create model", zap.Error(err))
    return nil, errors.Wrap(err, "failed to create model")
}

// ✅ Acceptable: simple passthrough (current common pattern)
if err != nil {
    return nil, err
}

// ❌ Swallowed error — never do this
result, _ := someFunction()
```
- Use `apperrors` for specific failure types (NotFound, Unauthorized).
- Use `logger.Error` only for failures that are actionable and should trigger an alert. Use `logger.Warn` for expected or non-critical degraded states.

### 4. Logging

- **Use the `logging.ILogger` interface** for all structured logging. This provides a consistent, zap-backed logging abstraction across the application.
- **Pass the logger at the highest level** of a function chain. This allows descendant functions to decorate it with additional trace context.

- **For code shared between workers and request handlers**, use the generic `logging.ChainableErrorOrWarnLogger`. This pattern allows the caller to determine whether a failure should be logged as a `Warn` (e.g., in a request context) or an `Error` (e.g., in a background job). When using this logger, call the `logger.ErrorOrWarn()` method to log failures.

```go
// ✅ Standard logging with the ILogger interface
func MyRequestHandler(logger logging.ILogger, ...) {
    // ...
    if err != nil {
        // In a request handler, a failure might just be a warning.
        logger.Warn("Non-critical failure in request", zap.Error(err))
        return
    }
    // ...
}

// ✅ Advanced pattern for shared code using generics
func AnalyzeSharedResource[T logging.ChainableErrorOrWarnLogger[T]](
    logger T,
    // ...
) error {
    // ...
    if err != nil {
        // Let the caller decide if this is an Error or a Warn.
        return logger.ErrorOrWarn("Failed to analyze shared resource", err)
    }
    // ...
    return nil
}
```

### Go Anti-patterns to Avoid
```go
// ❌ Direct DB query without transaction support
db.Query("SELECT * FROM users WHERE id = ?", id)

// ❌ Hardcoded role string instead of a constant
if role == "admin" { ... }

// ❌ Missing authorization check on a sensitive operation
func SensitiveOperation() {}

// ❌ Non-descriptive function name
func DoStuff() {}
```

## Frontend & TypeScript Standards

### 0. Naming Conventions
- **Components**: PascalCase (`Header`, `MainContent`, `Alert`)
- **Files**: Use `index.tsx` as the main entry for each component folder
- **Hooks**: camelCase with `use` prefix (`useCheckMobile`, `useOktaSession`)
- **Types/Interfaces**: PascalCase with descriptive suffixes (`AlertProps`, `ModalWrapperProps`)
- **CSS classes**: BEM-style with `mint-` prefix (`mint-modal__content`, `mint-header__nav`)

### 1. Strict Typing
- **DO NOT** use the `any` type. Use specific interfaces or `unknown` if necessary.
- Explicitly type component props and function return values.
- Always use strict equality (`===` / `!==`); never `==` or `!=`.
- ESLint disable comments must include a justification explaining why the rule is suppressed.

### 2. Component Structure
- Use functional components with hooks.
- Colocate styles (`index.scss`), tests (`index.test.tsx`), and stories (`index.stories.tsx`) with the component (`index.tsx`).
- Custom hooks must use the `use` prefix and declare correct dependency arrays.
- Component props should extend `JSX.IntrinsicElements` for the underlying HTML element where applicable.
- Critical components should be wrapped in an error boundary.

```typescript
// ✅ Proper prop typing with element extension
interface ButtonProps extends JSX.IntrinsicElements['button'] {
  label: string;
  onClick: () => void;
}

const Button = ({ label, onClick, ...props }: ButtonProps) => (
  <button onClick={onClick} aria-label={label} {...props}>
    {label}
  </button>
);
```

### 3. UI & Accessibility
- Prefer **USWDS** components for consistency and government compliance.
- All interactive elements MUST have proper ARIA labels and roles.
- Maintain WCAG 2.1 AA compliance (color contrast, keyboard navigation).

### 4. GraphQL Usage
- Write operations in `.ts` files inside `src/gql/operations/`.
- Use autogenerated hooks (e.g., `useGetCurrentUserQuery`) instead of generic `useQuery`.

### 5. State Management
- Use **React Context** for global/shared application state.
- Do **not** introduce Redux or other external state libraries.
- Use **Apollo Client cache** for server-derived GraphQL state.

### 6. Styling
- SCSS is module-based with shared global variables.
- Follow a **mobile-first** approach; use established breakpoint utilities for responsive layouts.

### TypeScript Anti-patterns to Avoid
```typescript
// ❌ Using 'any' type
const data: any = response.data;

// ❌ Missing prop types
const Component = ({ title, onClick }) => { ... };

// ❌ Console statements in production code
console.log('Debug data:', data);

// ❌ Non-strict equality
if (value == null) { ... }

// ❌ ESLint disable without justification
// eslint-disable-next-line react-hooks/exhaustive-deps

// ❌ Missing accessibility attribute
<button onClick={handleClick}>Submit</button>

// ❌ Missing error handling in async operation
const data = await fetchData();
```
