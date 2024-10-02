package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

// TODO (loaders) where should these compound keys live? better to strongly type than to use a map, but this means they can't live in data loaders.

// SolutionAndPossibleKey is a key to get a operational solution and possible operational solution
type SolutionAndPossibleKey struct {
	OperationalNeedID uuid.UUID `json:"operational_need_id"`
	IncludeNotNeeded  bool      `json:"include_not_needed"`
}

//go:embed SQL/operational_solution/and_possible_get_by_operational_need_id_LOADER.sql
var operationalSolutionAndPossibleGetByOperationalNeedIDLOADERSQL string

//go:embed SQL/operational_solution/get_by_id.sql
var operationalSolutionGetByIDSQL string

//go:embed SQL/operational_solution/update_by_id.sql
var operationalSolutionUpdateByIDSQL string

//go:embed SQL/operational_solution/insert.sql
var operationalSolutionInsertSQL string

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
		"ids": ids,
	}
	res, err := sqlutils.SelectProcedure[models.OperationalSolution](np, sqlqueries.OperationalSolution.GetByIDLOADER, args)
	if err != nil {
		return nil, err
	}
	return res, nil

}

// OperationalSolutionInsert inserts an operational solution if it already exists
func (s *Store) OperationalSolutionInsert(
	logger *zap.Logger,
	solution *models.OperationalSolution,
	solutionTypeKey *models.OperationalSolutionKey,
) (*models.OperationalSolution, error) {

	stmt, err := s.db.PrepareNamed(operationalSolutionInsertSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution)
	}
	defer stmt.Close()

	solution.ID = utilityuuid.ValueOrNewUUID(solution.ID)
	solution.Key = solutionTypeKey

	err = stmt.Get(solution, solution)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, solution) //this could be either update or insert..
	}

	return solution, err
}

// OperationalSolutionUpdateByID updates an operational solution by its ID
func (s *Store) OperationalSolutionUpdateByID(
	logger *zap.Logger,
	solution *models.OperationalSolution,
) (*models.OperationalSolution, error) {

	stmt, err := s.db.PrepareNamed(operationalSolutionUpdateByIDSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution)
	}
	defer stmt.Close()

	err = stmt.Get(solution, solution)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution) //this could be either update or insert..
	}

	return solution, err
}
