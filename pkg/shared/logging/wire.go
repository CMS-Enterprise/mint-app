//go:build wireinject
// +build wireinject

package appcontext

import (
	"context"
	"github.com/google/wire"
)

func CreateLogger(ctx context.Context) context.Context {
	wire.Build(ProvideZLogger, ProvideWithLogger)
	return context.Context{}
}

func CreateZLogger(ctx context.Context) (context.Context, uuid.UUID) {
	wire.Build(ProvideWithRequestTrace)
	return context.Context{}
}
