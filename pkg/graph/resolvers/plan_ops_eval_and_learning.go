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

// PlanOpsEvalAndLearningGetByModelPlanIDLOADER implements resolver logic to get Plan Operations Evaluation And Learning by a model plan ID using a data loader
func PlanOpsEvalAndLearningGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanOpsEvalAndLearning, error) {
	allLoaders, err := loaders.Loaders(ctx)
	if err != nil {
		return nil, err
	}
	oelLoader := allLoaders.OperationsEvaluationAndLearningLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	thunk := oelLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*models.PlanOpsEvalAndLearning), nil
}

// PlanOpsEvalAndLearningUpdate updates a PlanOpsEvalAndLearning buisness object
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
