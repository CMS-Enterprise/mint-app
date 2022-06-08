package storage

import (
	_ "embed"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_ops_eval_and_learning_create.sql
var planOpsEvalAndLearningCreateSQL string

//go:embed SQL/plan_ops_eval_and_learning_update.sql
var planOpsEvalAndLearningUpdateSQL string

//go:embed SQL/plan_ops_eval_and_learning_get_by_id.sql
var planOpsEvalAndLearningGetByIDSQL string

//go:embed SQL/plan_ops_eval_and_learning_get_by_model_plan_id.sql
var planOpsEvalAndLearningGetByModelPlanIDSQL string

//PlanOpsEvalAndLearningCreate creates a new plan providers_and_participants object
func (s *Store) PlanOpsEvalAndLearningCreate(logger *zap.Logger, gc *models.PlanOpsEvalAndLearning) (*models.PlanOpsEvalAndLearning, error) {
	gc.ID = utilityUUID.ValueOrNewUUID(gc.ID)

	statement, err := s.db.PrepareNamed(planOpsEvalAndLearningCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, gc)
	}

	gc.ModifiedBy = nil
	gc.ModifiedDts = nil
	err = statement.Get(gc, gc)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, gc)
	}

	return gc, nil
}

// PlanOpsEvalAndLearningUpdate updates the plan providers_and_participants for a given id
func (s *Store) PlanOpsEvalAndLearningUpdate(logger *zap.Logger, gc *models.PlanOpsEvalAndLearning) (*models.PlanOpsEvalAndLearning, error) {
	statement, err := s.db.PrepareNamed(planOpsEvalAndLearningUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, gc)
	}

	err = statement.Get(gc, gc)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, gc)
	}

	return gc, nil
}

// PlanOpsEvalAndLearningGetByID returns the plan providers_and_participants for a given id
func (s *Store) PlanOpsEvalAndLearningGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanOpsEvalAndLearning, error) {
	gc := models.PlanOpsEvalAndLearning{}

	statement, err := s.db.PrepareNamed(planOpsEvalAndLearningGetByIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&gc, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &gc, nil
}

// PlanOpsEvalAndLearningGetByModelPlanID returns the providers_and_participants for a given model plan id
func (s *Store) PlanOpsEvalAndLearningGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) (*models.PlanOpsEvalAndLearning, error) {
	gc := models.PlanOpsEvalAndLearning{}

	statement, err := s.db.PrepareNamed(planOpsEvalAndLearningGetByModelPlanIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	err = statement.Get(&gc, arg)

	if err != nil {
		return nil, err
	}

	return &gc, nil
}
