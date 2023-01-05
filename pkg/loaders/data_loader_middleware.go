package loaders

import (
	"context"
	"fmt"
	"net/http"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

type ctxKey string

const (
	loadersKey = ctxKey("dataloaders")
)

// Loaders wrap your data loaders to inject via middleware
type Loaders struct {
	BasicsLoader *dataloader.Loader
}

// NewLoaders instantiates data loaders for the middleware
// TODO pass the store here? Or ok to get it from routes instead?
func NewLoaders(store *storage.Store) *Loaders {
	// define the data loader
	basicsReader := &BasicsReader{
		Store: *store,
	}
	loaders := &Loaders{
		// BasicsLoader: dataloader.NewBatchedLoader(basicsReader.GetUsers),
		BasicsLoader: dataloader.NewBatchedLoader(basicsReader.GetPlanBasics),
	}
	return loaders
}

func dataLoadermMiddleware(loaders *Loaders, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCtx := context.WithValue(r.Context(), loadersKey, loaders)
		r = r.WithContext(nextCtx)
		next.ServeHTTP(w, r)
	})
}

// NewDataLoaderMiddleware decorates a request with data loader context
func NewDataLoaderMiddleware(loaders *Loaders) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return dataLoadermMiddleware(loaders, next)
	}
}

// For returns the dataLoaders for a given context
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}

// BasicsReader reads Users from a database
type BasicsReader struct {
	Store storage.Store
}

// GetPlanBasics uses a DataLoader to aggreggate a SQL call and return all plan basics in one query
func (br BasicsReader) GetPlanBasics(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {

	modelPlanIDs := make([]string, len(keys))
	for ix, key := range keys {
		modelPlanIDs[ix] = key.String()
	}
	logger := appcontext.ZLogger(ctx)
	basics, _ := br.Store.PlanBasicsGetByModelPlanIDLOADER(logger, modelPlanIDs) //TODO, should we move some logic there?
	// basicsByID := map[string]*models.PlanBasics{}
	// for _, planBasic := range basics {

	// }

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		basic, ok := lo.Find(basics, func(basic *models.PlanBasics) bool { //Get the  plan basic that matches what we asked for

			return basic.ModelPlanID.String() == key.String()
		})

		if ok {
			output[index] = &dataloader.Result{Data: basic, Error: nil}
		} else {
			err := fmt.Errorf("plan basic not found for model plan %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}
