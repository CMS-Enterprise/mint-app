package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"

	_ "embed"
)

//go:embed SQL/operational_solution/and_possible_get_by_operational_need_id_LOADER.sql
var operationalSolutionAndPossibleGetByOperationalNeedIDLOADERSQL string

//go:embed SQL/operational_solution/get_by_id.sql
var operationalSolutionGetByIDSQL string

// OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER returns
// Operational Solutions that match the paramTable JSON
func (s *Store) OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.OperationalSolution, error) {

	var solutions []*models.OperationalSolution

	stmt, err := s.db.PrepareNamed(operationalSolutionAndPossibleGetByOperationalNeedIDLOADERSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&solutions, arg) //this returns more than one
	if err != nil {
		return nil, err
	}

	return solutions, nil
}

// OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER returns an array of
func OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(np sqlutils.NamedPreparer, _ *zap.Logger, keys []SolutionAndPossibleKey) ([]*models.OperationalSolution, error) {

	jsonParam, err := models.StructArrayToJSONArray(keys)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{
		"paramTableJSON": jsonParam,
	}

	solutions, err := sqlutils.SelectProcedure[models.OperationalSolution](np, operationalSolutionAndPossibleGetByOperationalNeedIDLOADERSQL, arg)
	if err != nil {
		return nil, err
	}

	return solutions, nil
}

// OperationalSolutionGetByID returns an operational solution by ID
func (s *Store) OperationalSolutionGetByID(_ *zap.Logger, id uuid.UUID) (*models.OperationalSolution, error) {
	solution := models.OperationalSolution{}

	stmt, err := s.db.PrepareNamed(operationalSolutionGetByIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	err = stmt.Get(&solution, arg)
	if err != nil {
		return nil, err
	}

	return &solution, err
}

// OperationalSolutionGetByIDWithNumberOfSubtasks returns an operational solution by ID, along with a count of the number of subtasks
func OperationalSolutionGetByIDWithNumberOfSubtasks(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.OperationalSolutionWithNumberOfSubtasks, error) {

	args := map[string]interface{}{
		"id": id,
	}
	solutionWithNumberOfSubtasks, procError := sqlutils.GetProcedure[models.OperationalSolutionWithNumberOfSubtasks](np, sqlqueries.OperationalSolution.GetWithNumberOfSubtasksByID, args)
	if procError != nil {
		return nil, fmt.Errorf("issue returning Operational Solution With Number of Subtasks object: %w", procError)
	}
	return solutionWithNumberOfSubtasks, nil
}

// OperationalSolutionGetByIDLOADER returns an operational solution by ID using a DataLoader
func OperationalSolutionGetByIDLOADER(np sqlutils.NamedPreparer, logger *zap.Logger, ids []uuid.UUID) ([]*models.OperationalSolution, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}
	res, err := sqlutils.SelectProcedure[models.OperationalSolution](np, sqlqueries.OperationalSolution.GetByIDLOADER, args)
	if err != nil {
		return nil, err
	}
	return res, nil

}
