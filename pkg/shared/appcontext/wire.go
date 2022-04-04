//go:build wireinject
// +build wireinject

package appcontext

import (
	"context"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/shared/logging"

	"github.com/google/wire"
)

func CreateContextWithLogger(ctx context.Context) ContextWithLogger {
	wire.Build(ProvideWithLogger, logging.ProvideLogger)
	return nil
}

func CreateContextWithRequestTrace(ctx context.Context) ContextWithRequestTrace {
	wire.Build(ProvideWithRequestTrace)
	return nil
}

func CreateWithSecurityPrincipal(ctx context.Context, principal authentication.Principal) ContextWithSecurityPrincipal {
	wire.Build(ProvideWithSecurityPrincipal)
	return nil
}
