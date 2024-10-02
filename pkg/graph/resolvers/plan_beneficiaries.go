package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// PlanBeneficiariesGetByModelPlanIDLOADER implements resolver logic to get Plan Beneficiaries by a model plan ID using a data loader
func PlanBeneficiariesGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanBeneficiaries, error) {
	allLoaders, ok := loaders.Loaders(ctx)
	if !ok {
		return nil, loaders.ErrNoLoaderOnContext
	}
	benesLoader := allLoaders.BeneficiariesLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	thunk := benesLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*models.PlanBeneficiaries), nil
}

// PlanBeneficiariesUpdate updates a plan Beneficiary buisness object
func PlanBeneficiariesUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.PlanBeneficiaries, error) {
	// Get existing plan beneficiaries
	existing, err := store.PlanBeneficiariesGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	retGeneralCharacteristics, err := store.PlanBeneficiariesUpdate(logger, existing)
	return retGeneralCharacteristics, err
}
