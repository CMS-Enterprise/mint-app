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
func (s *Store) PossibleOperationalSolutionCollectionGetByNeedType(logger *zap.Logger, needKey models.OperationalNeedKey) ([]*models.PossibleOperationalSolution, error) {

	posSols := []*models.PossibleOperationalSolution{}

	stmt, err := s.statements.Get(possibleOperationalSolutionCollectionByNeedTypeSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"need_key": needKey,
	}

	err = stmt.Select(&posSols, arg) // this returns more than one

	if err != nil {
		return nil, err
	}
	return posSols, nil

}

// PossibleOperationalSolutionCollectionGetAll returns all possible operational solutions
func (s *Store) PossibleOperationalSolutionCollectionGetAll(logger *zap.Logger) ([]*models.PossibleOperationalSolution, error) {
	posSols := []*models.PossibleOperationalSolution{}
	stmt, err := s.statements.Get(possibleOperationalSolutionCollectionGelAllSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{}

	err = stmt.Select(&posSols, arg) // this returns more than one

	if err != nil {
		return nil, err
	}
	return posSols, nil
}

// PossibleOperationalSolutionCollectionGetByOperationalNeedID returns possible operational solutions for a given operational need
func (s *Store) PossibleOperationalSolutionCollectionGetByOperationalNeedID(logger *zap.Logger, operationalNeedID uuid.UUID) ([]*models.PossibleOperationalSolution, error) {

	posSols := []*models.PossibleOperationalSolution{}

	stmt, err := s.statements.Get(possibleOperationalSolutionCollectionByOperationalNeedIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"operational_need_id": operationalNeedID,
	}

	err = stmt.Select(&posSols, arg) // this returns more than one

	if err != nil {
		return nil, err
	}
	return posSols, nil

}
