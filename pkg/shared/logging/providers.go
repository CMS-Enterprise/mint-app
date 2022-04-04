package logging

import (
	"context"
	"fmt"
	"github.com/cmsgov/mint-app/pkg/shared/appcontext/constants"
	"go.uber.org/zap"
	"os"
)

// ProvideLogger will always return something that functions
// as a zap.Logger, even if it wasn't already placed
// on the context
func ProvideLogger(ctx context.Context) *zap.Logger {
	return provideZLogger(ctx)
}

// ProvideDeprecatedLogger
// TODO: Remove deprecated logger
// Deprecated: Prefer ZLogger going forward
func ProvideDeprecatedLogger(ctx context.Context) (*zap.Logger, bool) {
	logger, ok := ctx.Value(constants.LoggerKey).(*zap.Logger)
	return logger, ok
}

// provideZLogger will always return something that functions
// as a zap.Logger, even if it wasn't already placed
// on the context
func provideZLogger(ctx context.Context) *zap.Logger {
	if logger, ok := ctx.Value(constants.LoggerKey).(*zap.Logger); ok {
		return logger
	}
	fmt.Fprintln(os.Stderr, "Logger not found on context.")
	return zap.NewNop()
}
