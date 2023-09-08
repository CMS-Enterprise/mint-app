package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/operational_solution/and_possible_get_by_operational_need_id_LOADER.sql
var operationalSolutionAndPossibleGetByOperationalNeedIDLOADERSQL string

//go:embed SQL/operational_solution/get_by_id.sql
var operationalSolutionGetByIDSQL string

//go:embed SQL/operational_solution/update_by_id.sql
var operationalSolutionUpdateByIDSQL string

//go:embed SQL/operational_solution/insert.sql
var operationalSolutionInsertSQL string

// OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER returns Operational Solutions that match the paramtableJSON
func (s *Store) OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(logger *zap.Logger, paramTableJSON string) ([]*models.OperationalSolution, error) {

	var solutions []*models.OperationalSolution
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	// This returns more than one
	err := s.db.Select(&solutions, operationalSolutionAndPossibleGetByOperationalNeedIDLOADERSQL, arg)

	if err != nil {
		return nil, err
	}
	return solutions, nil
}

// OperationalSolutionGetByID returns an operational solution by ID
func (s *Store) OperationalSolutionGetByID(logger *zap.Logger, id uuid.UUID) (*models.OperationalSolution, error) {

	solution := models.OperationalSolution{}
	arg := map[string]interface{}{
		"id": id,
	}

	err := s.db.Get(&solution, operationalSolutionGetByIDSQL, arg)
	if err != nil {
		return nil, err
	}
	return &solution, err
}

// OperationalSolutionInsert inserts an operational solution if it already exists
func (s *Store) OperationalSolutionInsert(
	logger *zap.Logger,
	solution *models.OperationalSolution,
	solutionTypeKey *models.OperationalSolutionKey,
) (*models.OperationalSolution, error) {

	solution.ID = utilityUUID.ValueOrNewUUID(solution.ID)
	solution.Key = solutionTypeKey
	err := s.db.Get(solution, operationalSolutionInsertSQL, solution)
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

	err := s.db.Get(solution, operationalSolutionUpdateByIDSQL, solution)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution) //this could be either update or insert..
	}

	return solution, err
}
