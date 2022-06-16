package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//PlanOpsEvalAndLearningUpdate updates a PlanOpsEvalAndLearning buisness object
func PlanOpsEvalAndLearningUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal string, store *storage.Store) (*models.PlanOpsEvalAndLearning, error) {
	//Get existing  PlanOpsEvalAndLearning
	existingOpsEvalAndLearning, err := store.PlanOpsEvalAndLearningGetByID(logger, id)
	if err != nil {
		return nil, err
	}
	err = ApplyChanges(changes, existingOpsEvalAndLearning)
	if err != nil {
		return nil, err
	}
	existingOpsEvalAndLearning.ModifiedBy = &principal
	err = existingOpsEvalAndLearning.CalcStatus()
	if err != nil {
		return nil, err
	}

	retOpsEvalAndLearning, err := store.PlanOpsEvalAndLearningUpdate(logger, existingOpsEvalAndLearning)
	return retOpsEvalAndLearning, err

}

// PlanOpsEvalAndLearningGetByModelPlanID returns a plan OpsEvalAndLearning buisness object associated with a model plan
func PlanOpsEvalAndLearningGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) (*models.PlanOpsEvalAndLearning, error) {
	oel, err := store.PlanOpsEvalAndLearningGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, err
	}
	return oel, err

}
