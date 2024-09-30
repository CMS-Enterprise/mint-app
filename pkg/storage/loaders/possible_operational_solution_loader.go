package loaders

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/logfields"
	"github.com/cms-enterprise/mint-app/pkg/models"

	"github.com/cms-enterprise/mint-app/pkg/storage"
)

const (
	// DLOperationalSolutionKey is the key used to store and retrieve operational solution keys
	DLOperationalSolutionKey string = "sol_key"
)

func (loaders *DataLoaders) possibleOperationalSolutionByKeyBatch(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
	output := make([]*dataloader.Result, len(keys))
	logger := appcontext.ZLogger(ctx).With(logfields.DataLoaderAppSection)

	// 1. Convert to array first
	solKeyArray, err := ConvertKeysToArray[models.OperationalSolutionKey](keys, DLOperationalSolutionKey)
	if err != nil {
		for _, result := range output {
			result.Error = fmt.Errorf("issue converting keys for possibleOperationalSolutionByKeyBatch, %w", err)
		}
		return output
	}

	sols, err := storage.PossibleOperationalSolutionGetByKeys(loaders.DataReader.Store, logger, solKeyArray)
	if err != nil {
		for _, result := range output {
			result.Error = err
		}
		return output

	}

	solsByKey := lo.Associate(sols, func(sol *models.PossibleOperationalSolution) (models.OperationalSolutionKey, *models.PossibleOperationalSolution) {
		return sol.Key, sol
	})

	// return in same order requested
	for index, key := range solKeyArray {
		preference, ok := solsByKey[key]
		if ok {
			output[index] = &dataloader.Result{Data: preference, Error: nil}
		} else {
			err := fmt.Errorf("possible operational solution not found for %s %s", DLOperationalSolutionKey, key)
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output
}

// PossibleOperationalSolutionByKey returns a collection of analyzed audits for a model plans for a specific date utilizing a data loader
func PossibleOperationalSolutionByKey(ctx context.Context, solKey models.OperationalSolutionKey) (*models.PossibleOperationalSolution, error) {

	allLoaders := Loaders(ctx)
	auditLoader := allLoaders.PossibleOperationSolutionByKeyLoader
	key := NewKeyArgs()
	key.Args[DLOperationalSolutionKey] = solKey

	thunk := auditLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}
	castResult, isCastable := result.(*models.PossibleOperationalSolution)
	if !isCastable {
		return nil, fmt.Errorf("unable to cast dataloader result to the Possible Operational Solution type")

	}
	return castResult, nil

}
