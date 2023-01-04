package loaders

import (
	"context"
	"net/http"
)

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

// Loaders wrap your data loaders to inject via middleware
type Loaders struct {
	// UserLoader *dataloader.Loader
}

// // NewLoaders instantiates data loaders for the middleware
// func NewLoaders(conn *sql.DB) *Loaders {
// 	// define the data loader
// 	userReader := &UserReader{conn: conn}
// 	loaders := &Loaders{
// 		UserLoader: dataloader.NewBatchedLoader(userReader.GetUsers),
// 	}
// 	return loaders
// }

// NewDataLoaderMiddleware decorates a request with data loader context
func NewDataLoaderMiddleware(loaders *Loaders, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCtx := context.WithValue(r.Context(), loadersKey, loaders)
		r = r.WithContext(nextCtx)
		next.ServeHTTP(w, r)
	})
}
