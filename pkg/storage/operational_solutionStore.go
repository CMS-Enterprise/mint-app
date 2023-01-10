package storage

import (
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	_ "embed"
)

//go:embed SQL/operational_solution/and_possible_get_by_operational_need_id.sql
var operationalSolutionAndPossibleGetByOperationalNeedIDSQL string

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

// OperationalSolutionAndPossibleCollectionGetByOperationalNeedID returns Operational Solutions correspondind to an Operational Need
func (s *Store) OperationalSolutionAndPossibleCollectionGetByOperationalNeedID(logger *zap.Logger, operationalNeedID uuid.UUID, includeNotNeeded bool) ([]*models.OperationalSolution, error) {
	solutions := []*models.OperationalSolution{}

	stmt, err := s.db.PrepareNamed(operationalSolutionAndPossibleGetByOperationalNeedIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{

		"operational_need_id": operationalNeedID,
		"includeNotNeeded":    includeNotNeeded,
	}

	err = stmt.Select(&solutions, arg) //this returns more than one

	if err != nil {
		return nil, err
	}
	return solutions, nil
}

// OperationalSolutionResSet is a type alias for map[string][]*models.OperationalSolution, which implements the scanner and valuer interface
type OperationalSolutionResSet map[string][]*models.OperationalSolution

// ToInterface returns the audit fields as a generic map[string]interface{}
func (rs *OperationalSolutionResSet) ToInterface() (map[string]interface{}, error) {
	retVal := map[string]interface{}{}

	bytes, err := json.Marshal(rs)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(bytes, &retVal)
	if err != nil {
		return nil, err
	}
	return retVal, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (rs *OperationalSolutionResSet) Scan(src interface{}) error {
	if src == nil {
		return nil //TODO fix this
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, rs) //TODO! if we marshal in the database, it doesn't be unmarshaled correctly here, the fields are in DB notation!
	if err != nil {
		return err
	}

	return nil
}

// OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER returns Operational Solutions correspondind to an Operational Need
func (s *Store) OperationalSolutionAndPossibleCollectionGetByOperationalNeedIDLOADER(logger *zap.Logger, paramTableJSON string) (OperationalSolutionResSet, error) {
	resSet := OperationalSolutionResSet{}

	stmt, err := s.db.PrepareNamed(operationalSolutionAndPossibleGetByOperationalNeedIDLOADERSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}
	err = stmt.Get(&resSet, arg) //this returns more than one

	if err != nil {
		return nil, err
	}
	return resSet, nil

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
