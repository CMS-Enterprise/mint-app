package storage

import (
	_ "embed"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"

	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
)

// OperationalSolutionSubtaskGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) OperationalSolutionSubtaskGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.OperationalSolutionSubtask, error) {

	var OpSolSSlice []*models.OperationalSolutionSubtask

	stmt, err := s.db.PrepareNamed(sqlqueries.OperationalSolutionSubtask.GetBySolutionIDLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&OpSolSSlice, arg) //this returns more than one
	if err != nil {
		return nil, err
	}

	return OpSolSSlice, nil
}

// OperationalSolutionSubtaskGetByID gets a models.OperationalSolutionSubtask by ID
func (s *Store) OperationalSolutionSubtaskGetByID(
	_ *zap.Logger,
	subtaskID uuid.UUID,
) (*models.OperationalSolutionSubtask, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.OperationalSolutionSubtask.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var subtask models.OperationalSolutionSubtask
	err = stmt.Get(
		&subtask,
		utilitysql.CreateIDQueryMap(subtaskID),
	)
	if err != nil {
		return nil, fmt.Errorf("could not fetch operational solution subtask by id, err : %w", err)
	}

	return &subtask, err
}
