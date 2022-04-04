package appcontext

import (
	"context"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/shared/appcontext/constants"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

type ContextWithLogger context.Context
type ContextWithRequestTrace context.Context
type ContextWithSecurityPrincipal context.Context

func ProvideWithLogger(ctx context.Context, logger *zap.Logger) ContextWithLogger {
	return context.WithValue(ctx, constants.LoggerKey, logger)
}

func ProvideWithRequestTrace(ctx context.Context) ContextWithRequestTrace {
	traceID := uuid.New()
	return context.WithValue(ctx, constants.TraceKey, traceID)
}

func ProvideWithSecurityPrincipal(ctx context.Context, principal authentication.Principal) ContextWithSecurityPrincipal {
	return context.WithValue(ctx, constants.PrincipalKey, principal)
}
