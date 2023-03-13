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

//go:embed SQL/operational_solution/get_by_operational_need_id_and_type.sql
var operationalSolutionGetByOperationalNeedIDAndTypeSQL string

//go:embed SQL/operational_solution/get_by_operational_need_id_and_other_type.sql
var operationalSolutionGetByOperationalNeedIDAndOtherTypeSQL string

//go:embed SQL/operational_solution/get_by_id.sql
var operationalSolutionGetByIDSQL string

//go:embed SQL/operational_solution/update_by_id.sql
var operationalSolutionUpdateByIDSQL string

//go:embed SQL/operational_solution/insert_or_update.sql
var operationalSolutionInsertOrUpdateSQL string

//go:embed SQL/operational_solution/insert_or_update_other.sql
var operationalSolutionInsertOrUpdateOtherSQL string

// OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER returns Operational Solutions that match the paramtableJSON
func (s *Store) OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(logger *zap.Logger, paramTableJSON string) ([]*models.OperationalSolution, error) {
	solutions := []*models.OperationalSolution{}

	stmt, err := s.db.PrepareNamed(operationalSolutionAndPossibleGetByOperationalNeedIDLOADERSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}
	err = stmt.Select(&solutions, arg) //this returns more than one

	if err != nil {
		return nil, err
	}
	return solutions, nil

}

// OperationalSolutionGetByOperationNeedIDAndType returns an operational solution that matches by operational need an solutionType
func (s *Store) OperationalSolutionGetByOperationNeedIDAndType(logger *zap.Logger, operationNeedID uuid.UUID, solutionKey models.OperationalSolutionKey) (*models.OperationalSolution, error) {
	solution := models.OperationalSolution{}

	stmt, err := s.db.PrepareNamed(operationalSolutionGetByOperationalNeedIDAndTypeSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"operational_need_id": operationNeedID,
		"sol_key":             solutionKey,
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
		"name_other":          customSolutionType,
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

// OperationalSolutionGetByID returns an operational solution by ID
func (s *Store) OperationalSolutionGetByID(logger *zap.Logger, id uuid.UUID) (*models.OperationalSolution, error) {
	solution := models.OperationalSolution{}

	stmt, err := s.db.PrepareNamed(operationalSolutionGetByIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"id": id,
	}
	err = stmt.Get(&solution, arg)
	if err != nil {
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
	solution.Key = &solutionTypeKey
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
	solution.NameOther = &customSolutionType
	err = statement.Get(solution, solution)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution) //this could be either update or insert..
	}
	return solution, err
}

// OperationalSolutionUpdateByID updates an operational solution by it's ID
func (s *Store) OperationalSolutionUpdateByID(logger *zap.Logger, solution *models.OperationalSolution) (*models.OperationalSolution, error) {
	statement, err := s.db.PrepareNamed(operationalSolutionUpdateByIDSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution)
	}

	err = statement.Get(solution, solution)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, solution) //this could be either update or insert..
	}
	return solution, err
}
