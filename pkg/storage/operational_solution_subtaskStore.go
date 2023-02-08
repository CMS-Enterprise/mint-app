package storage

import (
	"database/sql"
	_ "embed"
	"errors"
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

//go:embed SQL/operational_solution_subtask/get_by_solution_id.sql
var operationalSolutionSubtasksGetBySolutionIDSQL string

//go:embed SQL/operational_solution_subtask/update.sql
var operationalSolutionSubtaskUpdateByIDSQL string

//go:embed SQL/operational_solution_subtask/delete_by_id.sql
var operationalSolutionSubtaskDeleteByIDSQL string

// OperationalSolutionSubtasksCreate creates a models.OperationalSolutionSubtask
func (s *Store) OperationalSolutionSubtasksCreate(
	logger *zap.Logger,
	subtasks []*models.OperationalSolutionSubtask,
) ([]*models.OperationalSolutionSubtask, error) {
	tx := s.db.MustBegin()
	defer tx.Rollback()

	statement, err := s.db.PrepareNamed(operationalSolutionSubtaskCreateSQL)
	if err != nil {
		return nil, fmt.Errorf("could not prepare subtask creation statement: %w", err)
	}

	var results []*models.OperationalSolutionSubtask
	for _, subtask := range subtasks {
		subtask.ID = utilityUUID.ValueOrNewUUID(subtask.ID)
		subtask.ModifiedBy = nil
		subtask.ModifiedDts = nil

		var resultSubtask models.OperationalSolutionSubtask
		err = statement.Get(&resultSubtask, subtask)
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
func (s *Store) OperationalSolutionSubtaskGetByID(_ *zap.Logger, subtaskID uuid.UUID) (*models.OperationalSolutionSubtask, error) {
	statement, err := s.db.PrepareNamed(operationalSolutionSubtaskGetByIDSQL)
	if err != nil {
		return nil, err
	}

	var subtask models.OperationalSolutionSubtask
	err = statement.Get(
		&subtask,
		utilitySQL.CreateIDQueryMap(subtaskID),
	)
	if err != nil {
		return nil, errors.New("could not fetch operational solution subtask by id")
	}

	return &subtask, err
}

// OperationalSolutionSubtasksGetBySolutionID gets a collection of
// models.OperationalSolutionSubtask by OperationalSolution ID
func (s *Store) OperationalSolutionSubtasksGetBySolutionID(
	logger *zap.Logger,
	solutionID uuid.UUID,
) ([]*models.OperationalSolutionSubtask, error) {
	statement, err := s.db.PrepareNamed(operationalSolutionSubtasksGetBySolutionIDSQL)
	if err != nil {
		return nil, err
	}

	var subtasks []*models.OperationalSolutionSubtask
	err = statement.Select(
		&subtasks,
		utilitySQL.CreateSolutionIDQueryMap(solutionID),
	)
	if err != nil {
		return nil, errors.New("could not fetch operational solution subtasks by solution id")
	}

	return subtasks, err
}

// OperationalSolutionSubtaskDelete deletes an operational solution subtask by id
func (s *Store) OperationalSolutionSubtaskDelete(logger *zap.Logger, id uuid.UUID) (sql.Result, error) {
	statement, err := s.db.PrepareNamed(operationalSolutionSubtaskDeleteByIDSQL)
	if err != nil {
		return nil, err
	}

	sqlResult, err := statement.Exec(utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelDeleteByIDError(logger, err, id)
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

	statement, err := tx.PrepareNamed(operationalSolutionSubtaskUpdateByIDSQL)
	if err != nil {
		return nil, err
	}

	for _, subtask := range subtasks {
		err = statement.Get(subtask, subtask)
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
