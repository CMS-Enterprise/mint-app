package storage

import (
	"database/sql"
	_ "embed"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
)

//go:embed SQL/operational_solution_subtask/create.sql
var operationalSolutionSubtaskCreateSQL string

//go:embed SQL/operational_solution_subtask/get_by_id.sql
var operationalSolutionSubtaskGetByIDSQL string

//go:embed SQL/operational_solution_subtask/update.sql
var operationalSolutionSubtaskUpdateByIDSQL string

//go:embed SQL/operational_solution_subtask/delete_by_id.sql
var operationalSolutionSubtaskDeleteByIDSQL string

//go:embed SQL/operational_solution_subtask/get_by_solution_id_LOADER.sql
var operationalSolutionSubtaskGetBySolutionIDLoaderSQL string

// OperationalSolutionSubtaskGetByModelPlanIDLOADER returns the plan GeneralCharacteristics for a slice of model plan ids
func (s *Store) OperationalSolutionSubtaskGetByModelPlanIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*models.OperationalSolutionSubtask, error) {

	var OpSolSSlice []*models.OperationalSolutionSubtask

	stmt, err := s.db.PrepareNamed(operationalSolutionSubtaskGetBySolutionIDLoaderSQL)
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

// OperationalSolutionSubtasksCreate creates a models.OperationalSolutionSubtask
func (s *Store) OperationalSolutionSubtasksCreate(
	_ *zap.Logger,
	subtasks []*models.OperationalSolutionSubtask,
) ([]*models.OperationalSolutionSubtask, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()

	stmt, err := tx.PrepareNamed(operationalSolutionSubtaskCreateSQL)
	if err != nil {
		return nil, fmt.Errorf("could not prepare subtask creation statement: %w", err)
	}
	defer stmt.Close()

	var results []*models.OperationalSolutionSubtask
	for _, subtask := range subtasks {
		subtask.ID = utilityUUID.ValueOrNewUUID(subtask.ID)
		subtask.ModifiedBy = nil
		subtask.ModifiedDts = nil

		var resultSubtask models.OperationalSolutionSubtask
		err = stmt.Get(&resultSubtask, subtask)
		if err != nil {
			return nil, fmt.Errorf("could not execute subtask statement: %w", err)
		}

		results = append(results, &resultSubtask)
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("could not commit subtask creation transaction: %w", err)
	}

	return results, nil
}

// OperationalSolutionSubtaskGetByID gets a models.OperationalSolutionSubtask by ID
func (s *Store) OperationalSolutionSubtaskGetByID(
	_ *zap.Logger,
	subtaskID uuid.UUID,
) (*models.OperationalSolutionSubtask, error) {

	stmt, err := s.db.PrepareNamed(operationalSolutionSubtaskGetByIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var subtask models.OperationalSolutionSubtask
	err = stmt.Get(
		&subtask,
		utilitySQL.CreateIDQueryMap(subtaskID),
	)
	if err != nil {
		return nil, fmt.Errorf("could not fetch operational solution subtask by id, err : %w", err)
	}

	return &subtask, err
}

// OperationalSolutionSubtaskDelete deletes an operational solution subtask by id
func (s *Store) OperationalSolutionSubtaskDelete(
	logger *zap.Logger,
	id uuid.UUID,
	userID uuid.UUID,
) (sql.Result, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()

	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return nil, err
	}

	stmt, err := tx.PrepareNamed(operationalSolutionSubtaskDeleteByIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	sqlResult, err := stmt.Exec(utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelDeleteByIDError(logger, err, id)
	}

	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("could not commit solution subtask delete transaction: %w", err)
	}

	return sqlResult, nil
}

// OperationalSolutionSubtasksUpdate updates a collection of operational solution subtasks by ID
func (s *Store) OperationalSolutionSubtasksUpdate(
	_ *zap.Logger,
	subtasks []*models.OperationalSolutionSubtask,
) ([]*models.OperationalSolutionSubtask, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()

	stmt, err := tx.PrepareNamed(operationalSolutionSubtaskUpdateByIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	for _, subtask := range subtasks {
		err = stmt.Get(subtask, subtask)
		if err != nil {
			return nil, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return subtasks, nil
}
