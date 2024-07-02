package storage

import (
	_ "embed"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

// PlanOpsEvalAndLearningGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) PlanOpsEvalAndLearningGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.PlanOpsEvalAndLearning, error) {

	var oelSlice []*models.PlanOpsEvalAndLearning

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanOpsEvalAndLearning.GetByModelPlanIDLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&oelSlice, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return oelSlice, nil
}

// PlanOpsEvalAndLearningCreate creates a new plan providers_and_participants object
func (s *Store) PlanOpsEvalAndLearningCreate(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	oel *models.PlanOpsEvalAndLearning,
) (*models.PlanOpsEvalAndLearning, error) {

	oel.ID = utilityUUID.ValueOrNewUUID(oel.ID)

	stmt, err := np.PrepareNamed(sqlqueries.PlanOpsEvalAndLearning.Create)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, oel)
	}
	defer stmt.Close()

	oel.ModifiedBy = nil
	oel.ModifiedDts = nil

	err = stmt.Get(oel, oel)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, oel)
	}

	return oel, nil
}

// PlanOpsEvalAndLearningUpdate updates the plan providers_and_participants for a given id
func (s *Store) PlanOpsEvalAndLearningUpdate(
	logger *zap.Logger,
	oel *models.PlanOpsEvalAndLearning,
) (*models.PlanOpsEvalAndLearning, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanOpsEvalAndLearning.Update)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, oel)
	}
	defer stmt.Close()

	err = stmt.Get(oel, oel)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, oel)
	}

	return oel, nil
}

// PlanOpsEvalAndLearningGetByID returns the plan providers_and_participants for a given id
func (s *Store) PlanOpsEvalAndLearningGetByID(
	_ *zap.Logger,
	id uuid.UUID,
) (*models.PlanOpsEvalAndLearning, error) {

	oel := models.PlanOpsEvalAndLearning{}

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanOpsEvalAndLearning.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&oel, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, err
	}

	return &oel, nil
}
