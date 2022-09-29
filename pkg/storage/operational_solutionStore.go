package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/operational_solution_collection_get_by_operational_need_id.sql
var operationalSolutionCollectionGetByOperationalNeedIDSQL string

// OperationalSolutionCollectionGetByOperationalNeedID returns Operational Solutions correspondind to an Operational Need
func (s *Store) OperationalSolutionCollectionGetByOperationalNeedID(logger *zap.Logger, operationalNeedID uuid.UUID) ([]*models.OperationalSolution, error) {
	solutions := []*models.OperationalSolution{}

	stmt, err := s.db.PrepareNamed(operationalSolutionCollectionGetByOperationalNeedIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{

		"operational_need_id": operationalNeedID,
	}

	err = stmt.Select(&solutions, arg) //this returns more than one

	if err != nil {
		return nil, err
	}
	return solutions, nil
}
