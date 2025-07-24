package storage

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/apperrors"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOCommonSolutionGetByModelPlanIDLoader returns all common solutions, with the context of the model plan id to determine if it was added or not
// if model plan id is null, contextual data will show up as false (is_added, is_suggested)
func MTOCommonSolutionGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.MTOCommonSolution, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolution](np, sqlqueries.MTOCommonSolution.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCommonSolutionGetByKeyLoader returns all Common Solutions associated by a list of keys
func MTOCommonSolutionGetByKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonSolutionKey) ([]*models.MTOCommonSolution, error) {

	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolution](np, sqlqueries.MTOCommonSolution.GetByKeyLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// MTOCommonSolutionGetByCommonMilestoneKeyLoader returns all common solutions associated with a Common Milestone Key
func MTOCommonSolutionGetByCommonMilestoneKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonMilestoneKey) ([]*models.MTOCommonSolution, error) {

	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolution](np, sqlqueries.MTOCommonSolution.GetByCommonMilestoneKeyLoader, args)
	if err != nil {
		return nil, err
	}
	return returned, nil

}

// PossibleOperationalSolutionGetByID returns a possible solution associated to a specific id
func (s *Store) MTOCommonSolutionGetByID(logger *zap.Logger, id int) (*models.MTOCommonSolution, error) {

	opSol := models.MTOCommonSolution{}
	stmt, err := s.db.PrepareNamed(sqlqueries.MTOCommonSolution.GetByID)
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
