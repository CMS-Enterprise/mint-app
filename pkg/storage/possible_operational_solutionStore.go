package storage

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/possible_operational_solution/collection_get_by_need_type.sql
var possibleOperationalSolutionCollectionByNeedTypeSQL string

//go:embed SQL/possible_operational_solution/collection_get_all.sql
var possibleOperationalSolutionCollectionGelAllSQL string

//go:embed SQL/possible_operational_solution/collection_get_by_operational_need_id.sql
var possibleOperationalSolutionCollectionByOperationalNeedIDSQL string

// PossibleOperationalSolutionCollectionGetByNeedType returns possible operational solutions for a given operational need
func (s *Store) PossibleOperationalSolutionCollectionGetByNeedType(
	_ *zap.Logger,
	needKey models.OperationalNeedKey,
) ([]*models.PossibleOperationalSolution, error) {

	var posSols []*models.PossibleOperationalSolution
	arg := map[string]interface{}{
		"need_key": needKey,
	}

	// This returns more than one
	err := s.db.Select(&posSols, possibleOperationalSolutionCollectionByNeedTypeSQL, arg)

	if err != nil {
		return nil, err
	}
	return posSols, nil
}

// PossibleOperationalSolutionCollectionGetAll returns all possible operational solutions
func (s *Store) PossibleOperationalSolutionCollectionGetAll(_ *zap.Logger) (
	[]*models.PossibleOperationalSolution,
	error,
) {

	var posSols []*models.PossibleOperationalSolution
	arg := map[string]interface{}{}

	// This returns more than one
	err := s.db.Select(&posSols, possibleOperationalSolutionCollectionGelAllSQL, arg)

	if err != nil {
		return nil, err
	}
	return posSols, nil
}

// PossibleOperationalSolutionCollectionGetByOperationalNeedID returns possible
// operational solutions for a given operational need
func (s *Store) PossibleOperationalSolutionCollectionGetByOperationalNeedID(
	logger *zap.Logger,
	operationalNeedID uuid.UUID,
) ([]*models.PossibleOperationalSolution, error) {

	var posSols []*models.PossibleOperationalSolution
	arg := map[string]interface{}{
		"operational_need_id": operationalNeedID,
	}

	// This returns more than one
	err := s.db.Select(&posSols, possibleOperationalSolutionCollectionByOperationalNeedIDSQL, arg)

	if err != nil {
		return nil, err
	}
	return posSols, nil

}
