package storage

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

// PossibleOperationalSolutionCollectionGetByNeedType returns possible
// operational solutions for a given operational need
func (s *Store) PossibleOperationalSolutionCollectionGetByNeedType(
	_ *zap.Logger,
	needKey models.OperationalNeedKey,
) ([]*models.PossibleOperationalSolution, error) {

	var posSols []*models.PossibleOperationalSolution

	stmt, err := s.db.PrepareNamed(sqlqueries.PossibleOperationalSolution.CollectionByNeedType)
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
	stmt, err := s.db.PrepareNamed(sqlqueries.PossibleOperationalSolution.CollectionGetAll)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

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

	stmt, err := s.db.PrepareNamed(sqlqueries.PossibleOperationalSolution.CollectionByOperationalNeed)
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
	stmt, err := s.db.PrepareNamed(sqlqueries.PossibleOperationalSolution.GetByID)
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
	stmt, err := s.db.PrepareNamed(sqlqueries.PossibleOperationalSolution.GetByKey)
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
