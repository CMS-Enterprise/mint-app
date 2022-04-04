package server

import (
	"github.com/cmsgov/mint-app/pkg/shared/appcontext"
	"net/http"

	"go.uber.org/zap"
)

const traceHeader = "X-TRACE-ID"

func traceMiddleware(logger *zap.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := appcontext.ProvideWithRequestTrace(r.Context())
		traceID, _ := appcontext.GetContextTrace(ctx)

		w.Header().Add(traceHeader, traceID.String())
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// NewTraceMiddleware returns a handler with a trace ID in context
func NewTraceMiddleware(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return traceMiddleware(logger, next)
	}
}
