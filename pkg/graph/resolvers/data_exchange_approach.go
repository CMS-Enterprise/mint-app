package resolvers

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/storage/loaders"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// DataExchangeApproachGetByModelPlanIDLOADER implements resolver logic to get
// data exchange approach by a model plan ID using a data loader
func DataExchangeApproachGetByModelPlanIDLOADER(
	ctx context.Context,
	modelPlanID uuid.UUID,
) (*models.DataExchangeApproach, error) {
	allLoaders := loaders.Loaders(ctx)
	dataExchangeApproachLoader := allLoaders.DataExchangeApproachByModelIDLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	thunk := dataExchangeApproachLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("no data exchange approach found for the given modelPlanID: %w", err)
		}

		return nil, fmt.Errorf("failed to fetch the data exchange approach: %w", err)
	}

	return result.(*models.DataExchangeApproach), nil
}

// DataExchangeApproachUpdate updates a data exchange approach business object
func DataExchangeApproachUpdate(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
) (*models.DataExchangeApproach, error) {
	// Get existing data exchange approach
	existing, err := loaders.GetDataExchangeApproachByID(ctx, id)
	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	retGeneralCharacteristics, err := store.DataExchangeApproachUpdate(logger, existing)
	return retGeneralCharacteristics, err
}
