package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//PlanOpsEvalAndLearningUpdate updates a PlanOpsEvalAndLearning buisness object
func PlanOpsEvalAndLearningUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.PlanOpsEvalAndLearning, error) {
	//Get existing  PlanOpsEvalAndLearning
	existing, err := store.PlanOpsEvalAndLearningGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	retOpsEvalAndLearning, err := store.PlanOpsEvalAndLearningUpdate(logger, existing)
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
