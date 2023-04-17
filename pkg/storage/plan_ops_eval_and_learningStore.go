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

//go:embed SQL/plan_ops_eval_and_learning/create.sql
var planOpsEvalAndLearningCreateSQL string

//go:embed SQL/plan_ops_eval_and_learning/update.sql
var planOpsEvalAndLearningUpdateSQL string

//go:embed SQL/plan_ops_eval_and_learning/get_by_id.sql
var planOpsEvalAndLearningGetByIDSQL string

//go:embed SQL/plan_ops_eval_and_learning/get_by_model_plan_id_LOADER.sql
var planOpsEvalAndLearningGetByModelPlanIDLoaderSQL string

// PlanOpsEvalAndLearningGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanOpsEvalAndLearningGetByModelPlanIDLOADER(logger *zap.Logger, paramTableJSON string) ([]*models.PlanOpsEvalAndLearning, error) {
	oelSlice := []*models.PlanOpsEvalAndLearning{}

	stmt, err := s.db.PrepareNamed(planOpsEvalAndLearningGetByModelPlanIDLoaderSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&oelSlice, arg) //this returns more than one

	if err != nil {
		return nil, err
	}

	return oelSlice, nil
}

// PlanOpsEvalAndLearningCreate creates a new plan providers_and_participants object
func (s *Store) PlanOpsEvalAndLearningCreate(logger *zap.Logger, oel *models.PlanOpsEvalAndLearning) (*models.PlanOpsEvalAndLearning, error) {
	oel.ID = utilityUUID.ValueOrNewUUID(oel.ID)

	statement, err := s.db.PrepareNamed(planOpsEvalAndLearningCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, oel)
	}

	oel.ModifiedBy = nil
	oel.ModifiedDts = nil
	err = statement.Get(oel, oel)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, oel)
	}

	return oel, nil
}

// PlanOpsEvalAndLearningUpdate updates the plan providers_and_participants for a given id
func (s *Store) PlanOpsEvalAndLearningUpdate(logger *zap.Logger, oel *models.PlanOpsEvalAndLearning) (*models.PlanOpsEvalAndLearning, error) {
	statement, err := s.db.PrepareNamed(planOpsEvalAndLearningUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, oel)
	}

	err = statement.Get(oel, oel)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, oel)
	}

	return oel, nil
}

// PlanOpsEvalAndLearningGetByID returns the plan providers_and_participants for a given id
func (s *Store) PlanOpsEvalAndLearningGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanOpsEvalAndLearning, error) {
	oel := models.PlanOpsEvalAndLearning{}

	statement, err := s.db.PrepareNamed(planOpsEvalAndLearningGetByIDSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Get(&oel, utilitySQL.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}

	return &oel, nil
}
