package storage

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/model_plan/create.sql
var modelPlanCreateSQL string

//go:embed SQL/model_plan/update.sql
var modelPlanUpdateSQL string

//go:embed SQL/model_plan/get_by_id.sql
var modelPlanGetByIDSQL string

//go:embed SQL/model_plan/get_by_name.sql
var modelPlanGetByNameSQL string

//go:embed SQL/model_plan/collection_where_archived.sql
var modelPlanCollectionWhereArchivedSQL string

//go:embed SQL/model_plan/collection_by_collaborator.sql
var modelPlanCollectionByCollaboratorSQL string

//go:embed SQL/model_plan/collection_with_crtdl.sql
var modelPlanCollectionWithCRTDlSQL string

//go:embed SQL/model_plan/delete_by_id.sql
var modelPlanDeleteByID string

//go:embed SQL/model_plan/get_by_id_LOADER.sql
var modelPlanGetByIDLoaderSQL string

// ModelPlanGetByModelPlanIDLOADER returns the model plan for a slice of ids
func (s *Store) ModelPlanGetByModelPlanIDLOADER(_ *zap.Logger, paramTableJSON string) ([]*models.ModelPlan, error) {

	var planSlice []*models.ModelPlan

	stmt, err := s.db.PrepareNamed(modelPlanGetByIDLoaderSQL)
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

// ModelPlanCreate creates a model plan using a transaction
func (s *Store) ModelPlanCreate(np NamedPreparer, logger *zap.Logger, plan *models.ModelPlan) (*models.ModelPlan, error) {
	if plan.ID == uuid.Nil {
		plan.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(modelPlanCreateSQL)
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

	stmt, err := s.db.PrepareNamed(modelPlanUpdateSQL)
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
func (s *Store) ModelPlanGetByID(np NamedPreparer, logger *zap.Logger, id uuid.UUID) (*models.ModelPlan, error) {

	plan := models.ModelPlan{}
	stmt, err := np.PrepareNamed(modelPlanGetByIDSQL)
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
	stmt, err := s.db.PrepareNamed(modelPlanGetByNameSQL)
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

	stmt, err := s.db.PrepareNamed(modelPlanCollectionWhereArchivedSQL)
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

	stmt, err := s.db.PrepareNamed(modelPlanCollectionByCollaboratorSQL)
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

	stmt, err := s.db.PrepareNamed(modelPlanCollectionWithCRTDlSQL)
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

// ModelPlanDeleteByID deletes a model plan for a given ID
func (s *Store) ModelPlanDeleteByID(logger *zap.Logger, id uuid.UUID) (sql.Result, error) {
	stmt, err := s.db.PrepareNamed(modelPlanDeleteByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	sqlResult, err := stmt.Exec(utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelDeleteByIDError(logger, err, id)
	}

	return sqlResult, nil
}
