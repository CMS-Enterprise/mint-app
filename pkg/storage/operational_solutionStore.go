package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/operational_solution_collection_get_by_operational_need_id.sql
var operationalSolutionCollectionGetByOperationalNeedIDSQL string

//go:embed SQL/operational_solution_get_by_operational_need_id_and_type.sql
var operationalSolutionGetByOperationalNeedIDAndTypeSQL string

//go:embed SQL/operational_solution_get_by_operational_need_id_and_other_type.sql
var operationalSolutionGetByOperationalNeedIDAndOtherTypeSQL string

//go:embed SQL/operational_solution_insert_or_update.sql
var operationalSolutionInsertOrUpdateSQL string

//go:embed SQL/operational_solution_insert_or_update_other.sql
var operationalSolutionInsertOrUpdateOtherSQL string

// OperationalSolutionCollectionGetByOperationalNeedID returns Operational Solutions correspondind to an Operational Need
func (s *Store) OperationalSolutionCollectionGetByOperationalNeedID(logger *zap.Logger, operationalNeedID uuid.UUID) ([]*models.OperationalSolution, error) {
	solutions := []*models.OperationalSolution{}

	stmt, err := s.db.PrepareNamed(operationalSolutionCollectionGetByOperationalNeedIDSQL)
	// stmt, err := s.db.PrepareNamed(operationalSolutionAndPossibleGetByOperationalNeedIDSQL)
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

// OperationalSolutionGetByOperationNeedIDAndType returns an operational solution that matches by operational need an solutionType
func (s *Store) OperationalSolutionGetByOperationNeedIDAndType(logger *zap.Logger, operationNeedID uuid.UUID, solutionType models.OperationalSolutionKey) (*models.OperationalSolution, error) {
	solution := models.OperationalSolution{}

	stmt, err := s.db.PrepareNamed(operationalSolutionGetByOperationalNeedIDAndTypeSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"operational_need_id": operationNeedID,
		"solution_type":       solutionType,
	}
	err = stmt.Get(&solution, arg)
	if err != nil {
		if err != nil {
			if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
				return nil, nil
			}
		}
		return nil, err
	}
	return &solution, err

}

// OperationalSolutionGetByOperationNeedIDAndOtherType returns an operational solution that matches by operational need an solutionType
func (s *Store) OperationalSolutionGetByOperationNeedIDAndOtherType(logger *zap.Logger, operationNeedID uuid.UUID, customSolutionType string) (*models.OperationalSolution, error) {
	solution := models.OperationalSolution{}

	stmt, err := s.db.PrepareNamed(operationalSolutionGetByOperationalNeedIDAndOtherTypeSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"operational_need_id": operationNeedID,
		"solution_other":      customSolutionType,
	}
	err = stmt.Get(&solution, arg)
	if err != nil {
		if err != nil {
			if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
				return nil, nil
			}
		}
		return nil, err
	}
	return &solution, err

}

// OperationalSolutionInsertOrUpdate either inserts or updates an operational solution if it already exists
func (s *Store) OperationalSolutionInsertOrUpdate(logger *zap.Logger, solution *models.OperationalSolution, solutionTypeKey models.OperationalSolutionKey) (*models.OperationalSolution, error) {
	statement, err := s.db.PrepareNamed(operationalSolutionInsertOrUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution)
	}
	solution.ID = utilityUUID.ValueOrNewUUID(solution.ID)
	solution.SolutionTypeShortName = solutionTypeKey
	err = statement.Get(solution, solution)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution) //this could be either update or insert..
	}
	return solution, err
}

// OperationalSolutionInsertOrUpdateOther either inserts or updates an operational solution if it already exists
func (s *Store) OperationalSolutionInsertOrUpdateOther(logger *zap.Logger, solution *models.OperationalSolution, customSolutionType string) (*models.OperationalSolution, error) {
	statement, err := s.db.PrepareNamed(operationalSolutionInsertOrUpdateOtherSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution)
	}
	solution.ID = utilityUUID.ValueOrNewUUID(solution.ID)
	solution.SolutionOther = &customSolutionType
	err = statement.Get(solution, solution)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution) //this could be either update or insert..
	}
	return solution, err
}
