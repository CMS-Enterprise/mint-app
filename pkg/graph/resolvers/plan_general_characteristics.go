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

// UpdatePlanGeneralCharacteristics implements resolver logic to update a plan general characteristics object
func UpdatePlanGeneralCharacteristics(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.PlanGeneralCharacteristics, error) {
	// Ensure that if we are updating the currentModelPlanID to a non-empty non-null value, that we are setting the
	// existingModelID to null and vice-versa.
	if _, ok := changes["currentModelPlanID"]; ok {
		if changes["currentModelPlanID"] != nil && changes["currentModelPlanID"] != "" {
			changes["existingModelID"] = nil
		}
	} else if _, ok := changes["existingModelID"]; ok {
		if changes["existingModelID"] != nil {
			changes["currentModelPlanID"] = nil
		}
	}

	// Get existing plan general characteristics
	existing, err := store.PlanGeneralCharacteristicsGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	retGeneralCharacteristics, err := store.PlanGeneralCharacteristicsUpdate(logger, existing)
	return retGeneralCharacteristics, err
}

// PlanGeneralCharacteristicsGetByModelPlanIDLOADER implements resolver logic to get plan general characteristics by a model plan ID using a data loader
func PlanGeneralCharacteristicsGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanGeneralCharacteristics, error) {
	allLoaders, err := loaders.Loaders(ctx)
	if err != nil {
		return nil, err
	}
	gcLoader := allLoaders.GeneralCharacteristicsLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	thunk := gcLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*models.PlanGeneralCharacteristics), nil
}

func PlanGeneralCharacteristicsGetExistingModelName(ctx context.Context, planGeneralCharacteristics *models.PlanGeneralCharacteristics) (*string, error) {
	if planGeneralCharacteristics.ExistingModelID == nil && planGeneralCharacteristics.CurrentModelPlanID == nil {
		return nil, nil
	}

	if planGeneralCharacteristics.ExistingModelID != nil {
		existingModel, err := ExistingModelGetByIDLOADER(ctx, *planGeneralCharacteristics.ExistingModelID)
		if err != nil {
			return nil, err
		}

		return models.StringPointer(existingModel.ModelName), nil
	}

	if planGeneralCharacteristics.CurrentModelPlanID != nil {
		currentModel, err := ModelPlanGetByIDLOADER(ctx, *planGeneralCharacteristics.CurrentModelPlanID)
		if err != nil {
			return nil, err
		}

		return models.StringPointer(currentModel.ModelName), nil
	}

	return nil, nil
}
