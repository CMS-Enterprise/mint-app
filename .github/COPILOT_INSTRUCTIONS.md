# GitHub Copilot PR Review Instructions

## Overview
This document provides specific instructions for GitHub Copilot when reviewing pull requests for the CMS MINT application. These guidelines ensure consistent code quality, security, and adherence to established patterns.

## Code Review Priorities

### 🔴 Critical Issues (Request Changes)
1. **Security vulnerabilities**
2. **Breaking changes without proper migration**
3. **Missing authentication/authorization checks**
4. **Hardcoded secrets or sensitive data**
5. **SQL injection vulnerabilities**
6. **XSS vulnerabilities**
7. **Missing input validation**
8. **Disabled tests without justification**

### 🟡 Major Issues (Strong Suggestions)
1. **TypeScript `any` type usage**
2. **Console statements in production code**
3. **TODO/FIXME comments without tracking**
4. **ESLint disable comments without justification**
5. **Non-strict equality operators (`==`, `!=`)**
6. **Missing error handling**
7. **Performance issues (N+1 queries, inefficient loops)**
8. **Accessibility violations**

### 🟢 Minor Issues (Suggestions)
1. **Naming convention violations**
2. **Code formatting inconsistencies**
3. **Missing documentation**
4. **Overly complex functions**
5. **Unused imports or variables**

## Technology-Specific Guidelines

### Graphql Schema File Reviews

### Go Backend Review

#### Required Patterns to Check
- **Base Struct Pattern**: All models should extend `baseStruct` with proper UUID ID
**Store Pattern**: CRUD operations should follow `func {EntityName}Create(np sqlutils.NamedPreparer, logger *zap.Logger, {entity} *models.{EntityName}) (*models.{EntityName}, error)` pattern (e.g., `ModelPlanCreate`, `UserAccountCreate`)
- **Principal Pattern**: Authentication checks should use `Principal` interface
- **Logging Pattern**: Use structured logging with Zap, include context and trace IDs

#### Go Anti-patterns to Flag
```go
// ❌ Direct database queries without transaction support
db.Query("SELECT * FROM users WHERE id = ?", id)

// ❌ Missing error handling
result, _ := someFunction()

// ❌ Hardcoded strings instead of constants
if role == "admin" {

// ❌ Bare error passthrough (acceptable currently, but prefer wrapped errors)
if err != nil {
    return nil, err  // Consider: errors.Wrap(err, "context about operation")
}

// ❌ Non-descriptive function names
func DoStuff() {}

// ❌ Missing authorization checks
func SensitiveOperation() {}
```

#### Go Best Practices to Enforce
```go
// ✅ Proper transaction handling
func {EntityName}Create(np sqlutils.NamedPreparer, logger *zap.Logger, {entity} *models.{EntityName}) (*models.{EntityName}, error) {
    // Implementation
}

// ✅ Preferred: Error wrapping with context (moving toward this pattern)
if err != nil {
    logger.Error("Failed to create model", zap.Error(err), zap.String("operation", "ModelCreate"))
    return nil, errors.Wrap(err, "failed to create model")
}

// ✅ Acceptable: Simple passthrough (current common pattern)
if err != nil {
    return nil, err
}

// ✅ Proper authorization pattern
func (r *mutationResolver) CreateModel(ctx context.Context, input *model.ModelPlanCreateInput) (*model.ModelPlan, error) {
    principal := authentication.GetPrincipal(ctx)
    if !principal.AllowUSER() {
        return nil, errors.New("unauthorized")
    }
    // Implementation
}
```

### React/TypeScript Frontend Review

#### Required Patterns to Check
- **Component Pattern**: Components should follow proper TypeScript typing with interface extensions
- **Hook Pattern**: Custom hooks should use `use` prefix and proper dependency arrays
- **Props Pattern**: Props should extend `JSX.IntrinsicElements` for HTML attributes
- **Error Boundaries**: Critical components should have error boundary protection
- **Accessibility**: All interactive elements should have proper ARIA labels

#### TypeScript Anti-patterns to Flag
```typescript
// ❌ Using 'any' type
const data: any = response.data;

// ❌ Missing prop types
const Component = ({ title, onClick }) => {

// ❌ Console statements in production
console.log('Debug data:', data);

// ❌ Non-strict equality
if (value == null) {

// ❌ Missing error handling
const data = await fetchData();

// ❌ Disabled ESLint rules without justification
// eslint-disable-next-line react-hooks/exhaustive-deps

// ❌ Missing accessibility attributes
<button onClick={handleClick}>Submit</button>
```

#### Frontend Best Practices to Enforce
```typescript
// ✅ Proper TypeScript typing
interface ComponentProps {
  title: string;
  onClick: () => void;
} & JSX.IntrinsicElements['button'];

// ✅ Proper component structure
const Component = ({ title, onClick, ...props }: ComponentProps) => {
  return (
    <button 
      onClick={onClick}
      aria-label={title}
      {...props}
    >
      {title}
    </button>
  );
};

// ✅ Proper error handling
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  logger.error('Failed to fetch data', error);
  setError(error);
}

// ✅ Strict equality
if (value === null) {
```

## Security Review Checklist

### Authentication & Authorization
- [ ] All protected routes have authentication middleware
- [ ] Role-based access control is properly implemented
- [ ] JWT tokens are properly validated and parsed
- [ ] Session management follows security best practices
- [ ] Principal checks are present for sensitive operations

### Input Validation & Sanitization
- [ ] All user inputs are validated and sanitized
- [ ] HTML content is sanitized using bluemonday
- [ ] File uploads have proper validation
- [ ] GraphQL inputs have proper validation schemas
- [ ] Database queries use parameterized statements

### Error Handling & Logging
- [ ] Errors don't expose sensitive information
- [ ] Proper logging without logging secrets
- [ ] Error responses are consistent
- [ ] Trace IDs are included for debugging

### Security Headers & CORS
- [ ] CORS configuration is appropriate
- [ ] Security headers are properly set
- [ ] Content Security Policy is maintained

## Testing Review Criteria

### Test Coverage
- [ ] New features have corresponding tests
- [ ] Edge cases are covered
- [ ] Error conditions are tested
- [ ] Integration tests for API changes

### Test Quality
- [ ] Tests are deterministic and isolated
- [ ] Proper mocking of external dependencies
- [ ] Database tests use transaction cleanup
- [ ] E2E tests cover critical user journeys

### Test Patterns
- [ ] Frontend tests use React Testing Library patterns
- [ ] Backend tests use Testify suite pattern
- [ ] GraphQL tests use MockedProvider
- [ ] Authentication tests mock Okta properly

## Performance Review Guidelines

### Backend Performance
- [ ] Database queries are optimized (no N+1 queries)
- [ ] DataLoader pattern is used for batch operations
- [ ] Proper indexing for new database queries
- [ ] Connection pooling is considered

### Frontend Performance
- [ ] Components are properly memoized where appropriate
- [ ] Large lists use virtualization
- [ ] Images are optimized and lazy-loaded
- [ ] Bundle size impact is considered

## Compliance & Accessibility

### Government Compliance
- [ ] USWDS components are used where applicable
- [ ] Accessibility standards are met (WCAG 2.1)
- [ ] Proper semantic HTML structure
- [ ] Color contrast requirements are met

### Data Handling
- [ ] PII is properly handled and protected
- [ ] Audit trail is maintained for sensitive operations
- [ ] Data retention policies are followed

## Common Issues to Flag

### High Priority Issues
1. **TypeScript `any` usage** - Found 759+ instances, should be eliminated
2. **Console statements** - Remove console.log, console.error from production code
3. **TODO comments** - Should be tracked in issues, not left in code
4. **Skipped tests** - Should not be committed without justification
5. **ESLint disable comments** - Should have clear justification

### Code Quality Issues
1. **Non-strict equality** - Use `===` instead of `==`
2. **Missing error handling** - All async operations should have error handling
3. **Hardcoded values** - Use constants or configuration
4. **Complex functions** - Break down functions > 50 lines
5. **Unused imports** - Remove unused imports and variables

### Security Issues
1. **Missing authentication checks** - All protected operations should validate principal
2. **Unvalidated inputs** - All user inputs should be validated
3. **Hardcoded secrets** - Use environment variables or secure config
4. **SQL injection risks** - Use parameterized queries only
5. **XSS vulnerabilities** - Sanitize all user-generated content

## Review Response Examples

### For Critical Security Issues
```
🔴 **CRITICAL**: Missing authentication check on sensitive operation. 

All operations that modify data should validate the principal:
```go
principal := authentication.GetPrincipal(ctx)
if !principal.AllowUSER() {
    return nil, errors.New("unauthorized")
}
```

### For TypeScript Any Usage
```
🟡 **MAJOR**: Avoid using `any` type as it defeats TypeScript's type safety.

Consider creating a proper interface:
```typescript
interface ResponseData {
  id: string;
  name: string;
  // ... other properties
}
```

### For Performance Issues
```
🟡 **MAJOR**: Potential N+1 query detected. Consider using DataLoader pattern for batch operations.

Example:
```go
// Use the existing loader pattern
users, err := s.UserAccountGetByModelPlanIDLOADER(ctx, modelPlanID)
```

### For Missing Tests
```
🟡 **MAJOR**: New functionality should include corresponding tests. Please add:
- Unit tests for the new function
- Integration tests for API changes  
- E2E tests for user-facing features
```

## Files Requiring Extra Scrutiny

### Security-Critical Files
- `pkg/authentication/` - Authentication logic
- `pkg/authorization/` - Authorization middleware
- `pkg/sanitization/` - Input sanitization
- `pkg/handlers/` - HTTP handlers
- `pkg/graph/resolvers/` - GraphQL resolvers

### Performance-Critical Files
- `pkg/storage/` - Database operations
- `pkg/graph/dataloader/` - Data loading logic
- `src/hooks/` - React hooks with data fetching
- `src/components/` - Reusable components

Remember: The goal is to maintain high code quality while ensuring security, performance, and maintainability. Be thorough but constructive in reviews.
