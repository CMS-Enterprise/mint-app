package storage

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

// ModelPlanGetByModelPlanIDLOADER returns the model plan for a slice of ids
func (s *Store) ModelPlanGetByModelPlanIDLOADER(_ *zap.Logger, paramTableJSON string) ([]*models.ModelPlan, error) {

	var planSlice []*models.ModelPlan

	stmt, err := s.db.PrepareNamed(sqlqueries.ModelPlan.GetByIDLoader)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&planSlice, arg) //this returns more than one

	if err != nil {
		return nil, err
	}

	return planSlice, nil
}

// ModelPlanOpSolutionLastModifiedDtsGetByModelPlanIDLOADER returns the most
// recent tracking dates for a series of model plans
func (s *Store) ModelPlanOpSolutionLastModifiedDtsGetByModelPlanIDLOADER(logger *zap.Logger, paramTableJSON string) (
	map[string]time.Time,
	error,
) {
	var trackingDates = make(map[string]time.Time)

	stmt, err := s.db.PrepareNamed(sqlqueries.ModelPlan.GetOpSolutionLastModifiedDtsByIDLoader)
	if err != nil {
		logger.Error("Failed to prepare SQL statement", zap.Error(err))
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	rows, err := stmt.Queryx(arg)
	if err != nil {
		logger.Error("Failed to execute query", zap.Error(err))
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var id string
		var trackingDate time.Time
		if err := rows.Scan(&id, &trackingDate); err != nil {
			logger.Error("Failed to scan row", zap.Error(err))
			continue
		}

		trackingDates[id] = trackingDate
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return trackingDates, nil
}

// ModelPlanCreate creates a model plan using a transaction
func (s *Store) ModelPlanCreate(np sqlutils.NamedPreparer, logger *zap.Logger, plan *models.ModelPlan) (*models.ModelPlan, error) {
	if plan.ID == uuid.Nil {
		plan.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(sqlqueries.ModelPlan.Create)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create model plan with error %s", err),
			zap.String("user", plan.CreatedBy.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	retPlan := models.ModelPlan{}

	plan.ModifiedBy = nil
	plan.ModifiedDts = nil

	err = stmt.Get(&retPlan, plan)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create model plan with error %s", err),
			zap.String("user", plan.CreatedBy.String()),
		)
		return nil, err

	}

	return &retPlan, nil
}

// ModelPlanUpdate updates a model plan
func (s *Store) ModelPlanUpdate(logger *zap.Logger, plan *models.ModelPlan) (*models.ModelPlan, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.ModelPlan.Update)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update system intake %s", err),
			zap.String("id", plan.ID.String()),
			zap.String("user", models.UUIDValueOrEmpty(plan.ModifiedBy)),
		)
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(plan, plan)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update system intake %s", err),
			zap.String("id", plan.ID.String()),
			zap.String("user", models.UUIDValueOrEmpty(plan.ModifiedBy)),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     plan,
			Operation: apperrors.QueryUpdate,
		}
	}

	return plan, nil
}

// ModelPlanGetByID returns a model plan for a given ID
func (s *Store) ModelPlanGetByID(np sqlutils.NamedPreparer, logger *zap.Logger, id uuid.UUID) (*models.ModelPlan, error) {

	plan := models.ModelPlan{}
	stmt, err := np.PrepareNamed(sqlqueries.ModelPlan.GetByID)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare SQL statement: %w", err)
	}
	defer stmt.Close()

	arg := map[string]interface{}{"id": id}

	err = stmt.Get(&plan, arg)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			logger.Warn("No model plan found for the given modelPlanID",
				zap.String("modelPlanID", id.String()))
			return nil, fmt.Errorf("no model plan found for the given modelPlanID: %w", err)
		}

		logger.Error(
			"failed to fetch model plan",
			zap.Error(err),
			zap.String("id", id.String()),
		)

		return nil, &apperrors.QueryError{
			Err:       fmt.Errorf("failed to fetch the model plan: %w", err),
			Model:     plan,
			Operation: apperrors.QueryFetch,
		}
	}

	return &plan, nil
}

// ModelPlanGetByName returns a model plan for a given ID
func (s *Store) ModelPlanGetByName(logger *zap.Logger, modelName string) (*models.ModelPlan, error) {

	plan := models.ModelPlan{}
	stmt, err := s.db.PrepareNamed(sqlqueries.ModelPlan.GetByName)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{"model_name": modelName}

	err = stmt.Get(&plan, arg)
	if err != nil {
		logger.Error(
			"Failed to fetch model plan",
			zap.Error(err),
			zap.String("name", modelName),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     plan,
			Operation: apperrors.QueryFetch,
		}
	}

	return &plan, nil
}

// ModelPlanCollection returns a list of all model plans (whether or not you're a collaborator)
func (s *Store) ModelPlanCollection(logger *zap.Logger, archived bool) ([]*models.ModelPlan, error) {

	var modelPlans []*models.ModelPlan

	stmt, err := s.db.PrepareNamed(sqlqueries.ModelPlan.CollectionWhereArchived)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"archived": archived,
	}

	err = stmt.Select(&modelPlans, arg)
	if err != nil {
		logger.Error(
			"Failed to fetch model plans",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.ModelPlan{},
			Operation: apperrors.QueryFetch,
		}
	}

	return modelPlans, nil
}

// ModelPlanCollectionCollaboratorOnly returns a list of all model plans for
// which the user_accountID supplied is a collaborator.
func (s *Store) ModelPlanCollectionCollaboratorOnly(
	logger *zap.Logger,
	archived bool,
	userID uuid.UUID,
) ([]*models.ModelPlan, error) {

	var modelPlans []*models.ModelPlan

	stmt, err := s.db.PrepareNamed(sqlqueries.ModelPlan.CollectionByCollaborator)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"archived": archived,
		"user_id":  userID,
	}

	err = stmt.Select(&modelPlans, arg)
	if err != nil {
		logger.Error(
			"Failed to fetch model plans",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.ModelPlan{},
			Operation: apperrors.QueryFetch,
		}
	}

	return modelPlans, nil
}

// ModelPlanCollectionWithCRTDLS returns a list of all model plans for which the there are CRTDls
func (s *Store) ModelPlanCollectionWithCRTDLS(logger *zap.Logger, archived bool) ([]*models.ModelPlan, error) {

	var modelPlans []*models.ModelPlan

	stmt, err := s.db.PrepareNamed(sqlqueries.ModelPlan.CollectionWithCRTDL)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"archived": archived,
	}

	err = stmt.Select(&modelPlans, arg)
	if err != nil {
		logger.Error(
			"Failed to fetch model plans",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.ModelPlan{},
			Operation: apperrors.QueryFetch,
		}
	}

	return modelPlans, nil
}
func ModelPlanCollectionApproachingClearance(np sqlutils.NamedPreparer, logger *zap.Logger) ([]*models.ModelPlan, error) {
	logger.Info("fetching model plans approaching clearance")
	args := map[string]interface{}{}

	modelPlans, err := sqlutils.SelectProcedure[models.ModelPlan](np, sqlqueries.ModelPlan.CollectionApproachingClearance, args)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		logger.Error(
			"failed to fetch model plans approaching clearance",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.ModelPlan{},
			Operation: apperrors.QueryFetch,
		}
	}
	return modelPlans, err

}

// ModelPlanCollectionFavorited returns a list of all model plans which are favorited by the user
// Note: Externally, this is called "followed" but internally we call it "favorited"
func (s *Store) ModelPlanCollectionFavorited(
	logger *zap.Logger,
	archived bool,
	userID uuid.UUID,
) ([]*models.ModelPlan, error) {

	arg := map[string]interface{}{
		"archived": archived,
		"user_id":  userID,
	}

	modelPlans, err := sqlutils.SelectProcedure[models.ModelPlan](s.db, sqlqueries.ModelPlan.CollectionWhereFavoritedByUserID, arg)
	if err != nil {
		logger.Error(
			"failed to fetch favorited model plans by user id",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.ModelPlan{},
			Operation: apperrors.QueryFetch,
		}
	}

	return modelPlans, nil
}

// ModelPlanDeleteByID deletes a model plan for a given ID
func (s *Store) ModelPlanDeleteByID(logger *zap.Logger, id uuid.UUID) (sql.Result, error) {
	stmt, err := s.db.PrepareNamed(sqlqueries.ModelPlan.DeleteByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"model_plan_id": id,
	}

	sqlResult, err := stmt.Exec(arg)
	if err != nil {
		return nil, genericmodel.HandleModelDeleteByIDError(logger, err, id)
	}

	return sqlResult, nil

}

func (s *Store) ModelPlanGetByOperationalSolutionKey(
	logger *zap.Logger,
	opSolKey models.OperationalSolutionKey,
) ([]*models.ModelPlanAndPossibleOperationalSolution, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.ModelPlan.GetByOperationalSolutionKey)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"operational_solution_key": opSolKey,
	}

	var modelPlanAndOpSols []*models.ModelPlanAndPossibleOperationalSolution
	err = stmt.Select(&modelPlanAndOpSols, arg)
	if err != nil {
		logger.Error(
			"Failed to fetch model plans",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     models.ModelPlanAndPossibleOperationalSolution{},
			Operation: apperrors.QueryFetch,
		}
	}
	return modelPlanAndOpSols, nil
}

func (s *Store) ModelPlanGetTaskListStatus(logger *zap.Logger, modelPlanID uuid.UUID) (models.TaskStatus, error) {
	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
	}

	println("modelPlanID: ", modelPlanID.String())

	taskStatus, err := sqlutils.GetProcedure[models.TaskStatus](s.db, sqlqueries.ModelPlan.GetTaskListStatus, arg)
	if err != nil {
		logger.Error(
			"Failed to fetch task list status",
			zap.Error(err),
		)
		return "", err
	}

	return *taskStatus, nil
}
