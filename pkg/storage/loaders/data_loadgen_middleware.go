package loaders

import (
	"context"
	"net/http"
)

const (
	loadgenKey = ctxKey("dataloadgen")
)

func dataLoadgenMiddleware(buildDataloaders BuildDataloadgens, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCtx := CTXWithLoadgen(r.Context(), buildDataloaders)
		r = r.WithContext(nextCtx)
		next.ServeHTTP(w, r)
	})
}

// NewDataLoadgenMiddleware decorates a request with data loader context
func NewDataLoadgenMiddleware(buildDataloaders BuildDataloadgens) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return dataLoadgenMiddleware(buildDataloaders, next)
	}
}

// loadgen returns the dataLoaders for a given context
func loadgensFromCTX(ctx context.Context) (*DataLoadgens, bool) {
	loadgens := ctx.Value(loadgenKey)
	if loadgens == nil {
		return nil, false
	}

	dl, ok := loadgens.(*DataLoadgens)
	return dl, ok

}

// CTXWithLoadgen  sets the given dataloaders onto given context
func CTXWithLoadgen(ctx context.Context, buildDataloadgens BuildDataloadgens) context.Context {
	return context.WithValue(ctx, loadgenKey, buildDataloadgens())
}
