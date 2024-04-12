package storage

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/authentication"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/possible_operational_solution/collection_get_by_need_type.sql
var possibleOperationalSolutionCollectionByNeedTypeSQL string

//go:embed SQL/possible_operational_solution/collection_get_all.sql
var possibleOperationalSolutionCollectionGelAllSQL string

//go:embed SQL/possible_operational_solution/collection_get_by_operational_need_id.sql
var possibleOperationalSolutionCollectionByOperationalNeedIDSQL string

//go:embed SQL/possible_operational_solution/get_by_id.sql
var possibleOperationalSolutionGetByIDSQL string

//go:embed SQL/possible_operational_solution/get_by_key.sql
var possibleOperationalSolutionGetByKeySQL string

//go:embed SQL/possible_operational_solution/set_primary_contact_by_id.sql
var possibleOperationalSolutionSetPrimaryContactByIDSQL string

//go:embed SQL/possible_operational_solution/unset_primary_contact_by_id.sql
var possibleOperationalSolutionUnsetPrimaryContactByIDSQL string

// PossibleOperationalSolutionCollectionGetByNeedType returns possible
// operational solutions for a given operational need
func (s *Store) PossibleOperationalSolutionCollectionGetByNeedType(
	_ *zap.Logger,
	needKey models.OperationalNeedKey,
) ([]*models.PossibleOperationalSolution, error) {

	var posSols []*models.PossibleOperationalSolution

	stmt, err := s.db.PrepareNamed(possibleOperationalSolutionCollectionByNeedTypeSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"need_key": needKey,
	}

	err = stmt.Select(&posSols, arg) // This returns more than one
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
	stmt, err := s.db.PrepareNamed(possibleOperationalSolutionCollectionGelAllSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{}

	err = stmt.Select(&posSols, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return posSols, nil
}

// PossibleOperationalSolutionCollectionGetByOperationalNeedID returns possible
// operational solutions for a given operational need
func (s *Store) PossibleOperationalSolutionCollectionGetByOperationalNeedID(
	_ *zap.Logger,
	operationalNeedID uuid.UUID,
) ([]*models.PossibleOperationalSolution, error) {

	var posSols []*models.PossibleOperationalSolution

	stmt, err := s.db.PrepareNamed(possibleOperationalSolutionCollectionByOperationalNeedIDSQL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"operational_need_id": operationalNeedID,
	}

	err = stmt.Select(&posSols, arg) // This returns more than one
	if err != nil {
		return nil, err
	}

	return posSols, nil

}

// PossibleOperationalSolutionGetByID returns a possible solution associated to a specific id
func (s *Store) PossibleOperationalSolutionGetByID(logger *zap.Logger, id int) (*models.PossibleOperationalSolution, error) {

	opSol := models.PossibleOperationalSolution{}
	stmt, err := s.db.PrepareNamed(possibleOperationalSolutionGetByIDSQL)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare SQL statement: %w", err)
	}
	defer stmt.Close()

	arg := map[string]interface{}{"id": id}

	err = stmt.Get(&opSol, arg)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			logger.Warn("no possible solution was found for the given ID : %s",
				zap.Int("id", id))
			return nil, fmt.Errorf("no possible solution plan found for the given id: %w", err)
		}

		logger.Error(
			"failed to fetch possible operational solution",
			zap.Error(err),
			zap.Int("id", id),
		)

		return nil, &apperrors.QueryError{
			Err:       fmt.Errorf("failed to fetch the possible operational solution: %w", err),
			Model:     opSol,
			Operation: apperrors.QueryFetch,
		}
	}

	return &opSol, nil
}

// PossibleOperationalSolutionGetByKey returns a possible solution associated to a specific id
func (s *Store) PossibleOperationalSolutionGetByKey(logger *zap.Logger, solKey models.OperationalSolutionKey) (*models.PossibleOperationalSolution, error) {
	//TODO: restructure as data-loaders

	opSol := models.PossibleOperationalSolution{}
	stmt, err := s.db.PrepareNamed(possibleOperationalSolutionGetByKeySQL)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare SQL statement: %w", err)
	}
	defer stmt.Close()

	arg := map[string]interface{}{"sol_key": solKey}

	err = stmt.Get(&opSol, arg)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			logger.Warn("no possible solution was found for the given key : %s",
				zap.Any("sol_key", solKey))
			return nil, fmt.Errorf("no possible solution plan found for the given id: %w", err)
		}

		logger.Error(
			"failed to fetch possible operational solution",
			zap.Error(err),
			zap.Any("sol_key", solKey),
		)

		return nil, &apperrors.QueryError{
			Err:       fmt.Errorf("failed to fetch the possible operational solution: %w", err),
			Model:     opSol,
			Operation: apperrors.QueryFetch,
		}
	}

	return &opSol, nil
}

// PossibleOperationalSolutionUnsetPrimaryContactByID unsets all primary contacts for a possible operational solution
func (s *Store) PossibleOperationalSolutionUnsetPrimaryContactByID(
	logger *zap.Logger,
	possibleOperationalSolutionID int,
	principal authentication.Principal,
) error {

	stmt, err := s.db.PrepareNamed(possibleOperationalSolutionUnsetPrimaryContactByIDSQL)
	if err != nil {
		return fmt.Errorf("failed to prepare SQL statement: %w", err)
	}
	defer stmt.Close()

	args := map[string]interface{}{
		"solution_id": possibleOperationalSolutionID,
		"modified_by": principal.Account().ID,
	}

	_, err = stmt.Exec(args)
	if err != nil {
		logger.Error(
			"failed to unset primary contact for possible operational solution",
			zap.Error(err),
			zap.Int("solution_id", possibleOperationalSolutionID),
		)

		return &apperrors.QueryError{
			Err:       fmt.Errorf("failed to unset primary contact for possible operational solution: %w", err),
			Operation: apperrors.QueryUpdate,
		}
	}

	return nil
}

// PossibleOperationalSolutionSetPrimaryContactByID sets the primary point of
// contact for a possible operational solution
func (s *Store) PossibleOperationalSolutionSetPrimaryContactByID(
	logger *zap.Logger,
	possibleOperationalSolutionID int,
	pointOfContactID uuid.UUID,
	principal authentication.Principal,
) (bool, error) {

	opSol := models.PossibleOperationalSolution{}
	stmt, err := s.db.PrepareNamed(possibleOperationalSolutionSetPrimaryContactByIDSQL)
	if err != nil {
		return false, fmt.Errorf("failed to prepare SQL statement: %w", err)
	}
	defer stmt.Close()

	args := map[string]interface{}{
		"solution_id": possibleOperationalSolutionID,
		"contact_id":  pointOfContactID,
		"modified_by": principal.Account().ID,
	}

	_, err = stmt.Exec(args)
	if err != nil {
		logger.Error(
			"failed to set primary contact for possible operational solution",
			zap.Error(err),
			zap.Int("possible_operational_solution_id", possibleOperationalSolutionID),
			zap.String("point_of_contact_id", pointOfContactID.String()),
		)

		return false, &apperrors.QueryError{
			Err:       fmt.Errorf("failed to set primary contact for possible operational solution: %w", err),
			Model:     opSol,
			Operation: apperrors.QueryUpdate,
		}
	}

	return true, nil
}
