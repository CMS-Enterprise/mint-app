# COPILOT REVIEW: CMS MINT Application

## Overview
This is a comprehensive analysis of the CMS MINT (Model Innovation Tool) application codebase, outlining code standards, architectural patterns, and best practices used throughout the project.

## Application Architecture

### Tech Stack
- **Backend**: Go 1.24.4 with GraphQL (gqlgen) + REST APIs
- **Frontend**: React 19.1.0 with TypeScript, Vite, Apollo Client
- **Database**: PostgreSQL with Flyway migrations
- **Authentication**: Okta integration
- **Infrastructure**: Docker, AWS services, background jobs via Faktory

### Repository Structure
```
mint-app/
├── cmd/              # CLI applications & entry points
├── pkg/              # Core Go packages (handlers, models, services, storage)
├── src/              # Frontend React/TypeScript source
├── migrations/       # Database schema migrations
├── cypress/          # E2E tests
├── config/           # Configuration files
├── scripts/          # Development scripts
└── docs/             # Documentation
```

## Code Style & Standards

### Go Backend Standards

#### Project Organization
- **Clean Architecture**: Clear separation of handlers → services → storage
- **Package Structure**: Organized by domain (models, handlers, services, storage)
- **Dependency Injection**: Using resolver pattern for testability

#### Naming Conventions
- **Packages**: lowercase, descriptive (`handlers`, `models`, `storage`)
- **Files**: snake_case (`model_plan.go`, `plan_basics.go`)
- **Functions**: PascalCase exports, descriptive action prefixes (`Create`, `Update`, `GetByID`)
- **Structs**: PascalCase (`ModelPlan`, `PlanBasics`)
- **Interfaces**: PascalCase with `I` prefix (`IBaseStruct`)

#### Code Patterns
```go
// Base struct pattern for all models
type baseStruct struct {
    ID uuid.UUID `json:"id" db:"id"`
    createdByRelation
    modifiedByRelation
}

// Store pattern for CRUD operations
func (s *Store) ModelPlanCreate(np sqlutils.NamedPreparer, logger *zap.Logger, plan *models.ModelPlan) (*models.ModelPlan, error)

// Handler pattern with common functionality
type HandlerBase struct {
    clock clock.Clock
}
```

#### Database Patterns
- **SQL Organization**: Embedded SQL files using `//go:embed`
- **Transactions**: `NamedPreparer` interface for consistent transaction handling
- **Data Loading**: DataLoader pattern for efficient batch operations (N+1 prevention)

#### Authentication & Authorization
- **Principal-based**: `Principal` interface for user identity
- **Role-based**: `AllowUSER()`, `AllowASSESSMENT()`, `AllowMAC()` methods
- **GraphQL Directives**: `@hasRole` and `@hasAnyRole` for schema-level authorization

#### Error Handling
- **Structured Errors**: Custom types (`UnauthorizedError`, `ValidationError`)
- **Consistent Responses**: Error responses with trace IDs
- **Logging**: Structured logging with Zap, context-aware with trace IDs

### Frontend Standards

#### Component Architecture
- **TypeScript First**: Strong typing throughout with proper interfaces
- **Component Organization**: Feature-based structure with shared components
- **USWDS Integration**: US Web Design System as primary UI framework

#### Naming Conventions
- **Components**: PascalCase (`Header`, `MainContent`, `Alert`)
- **Files**: `index.tsx` for main component files
- **Hooks**: camelCase with `use` prefix (`useCheckMobile`, `useOktaSession`)
- **Types**: PascalCase with descriptive suffixes (`AlertProps`, `ModalProps`)
- **CSS Classes**: BEM-like with `mint-` prefix (`mint-modal__content`)

#### Code Patterns
```typescript
// Standard component structure
type ComponentProps = {
  // Props with proper typing
} & JSX.IntrinsicElements['element'];

const Component = ({ ...props }: ComponentProps) => {
  // Component logic
  return <JSX />;
};

export default Component;
```

#### State Management
- **React Context**: Primary state management (no Redux)
- **Apollo Client**: GraphQL state management with cache
- **Custom Hooks**: Reusable logic patterns

#### Styling Standards
- **SCSS Architecture**: Module-based with global variables
- **Responsive Design**: Mobile-first approach with breakpoint utilities
- **Accessibility**: ARIA labels and semantic HTML throughout

## Testing Standards

### Frontend Testing
- **Framework**: Vitest with React Testing Library
- **Organization**: Tests alongside components (`*.test.tsx`)
- **Patterns**: Unit tests, snapshot tests, utility tests
- **Mocking**: Apollo MockedProvider for GraphQL, Vitest mocks for modules

### Backend Testing
- **Framework**: Testify with Go's built-in testing
- **Organization**: `*_test.go` files with test suites
- **Patterns**: Database testing with transaction cleanup
- **Mocking**: Gomock for dependency injection

### E2E Testing
- **Framework**: Cypress
- **Organization**: `cypress/e2e/*.spec.js`
- **Authentication**: Okta integration testing

### Coverage Standards
- **Thresholds**: 50% branches/functions, 60% lines/statements
- **Exclusions**: Stories and snapshots excluded from coverage

## Development Workflow

### Local Development
- **Docker Compose**: Multi-service setup with hot reload
- **Commands**: `scripts/dev` for unified development commands
- **Database**: PostgreSQL with comprehensive migrations
- **Services**: MinIO (S3), Faktory (jobs), email service

### Build & Deployment
- **Frontend**: Vite build system with TypeScript support
- **Backend**: Go build with Docker containerization
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Environment**: Cloud-ready with AWS integration

## Security & Compliance

### Security Practices
- **Authentication**: Okta integration with JWT tokens
- **Authorization**: Role-based access control throughout
- **Input Validation**: Comprehensive validation patterns
- **Secrets Management**: Proper handling of sensitive data

### Government Compliance
- **USWDS**: US Web Design System for federal accessibility
- **Security**: Government-grade security and compliance features
- **Audit Trail**: Comprehensive logging and request tracing

## Performance Patterns

### Backend Performance
- **DataLoader**: Efficient batch loading to prevent N+1 queries
- **Connection Pooling**: Configurable database connection limits
- **Caching**: GraphQL query caching with Apollo Client

### Frontend Performance
- **Code Splitting**: Vite-based bundle optimization
- **Lazy Loading**: Component-level code splitting
- **Responsive Design**: Mobile-first with efficient breakpoints

## Best Practices Summary

### Code Quality
1. **Type Safety**: Strong TypeScript and Go typing throughout
2. **Consistent Patterns**: Established patterns for common operations
3. **Error Handling**: Structured error management with proper logging
4. **Testing**: Comprehensive test coverage with multiple test levels

### Architecture
1. **Separation of Concerns**: Clear boundaries between layers
2. **Dependency Injection**: Testable and maintainable code structure
3. **Interface-Based Design**: Abstractions for flexibility
4. **Domain-Driven Design**: Business logic organization

### Development Experience
1. **Hot Reload**: Efficient development with Air (Go) and Vite (frontend)
2. **Code Generation**: GraphQL schema-first development
3. **Consistent Commands**: Unified development scripts
4. **Comprehensive Documentation**: Clear setup and usage instructions

### Security & Compliance
1. **Authentication**: Robust Okta integration
2. **Authorization**: Fine-grained role-based permissions
3. **Audit Trail**: Complete request tracing and logging
4. **Federal Standards**: USWDS compliance for government applications

This codebase demonstrates excellent engineering practices with a focus on maintainability, scalability, security, and developer experience. The architecture supports both current needs and future growth while maintaining high code quality standards.
