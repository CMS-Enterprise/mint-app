package storage

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/model_plan_create.sql
var modelPlanCreateSQL string

//go:embed SQL/model_plan_update.sql
var modelPlanUpdateSQL string

//go:embed SQL/model_plan_get_by_id.sql
var modelPlanGetByIDSQL string

//go:embed SQL/model_plan_collection_by_user.sql
var modelPlanCollectionByUserSQL string

// ModelPlanCreate creates a model plan
func (s *Store) ModelPlanCreate(logger *zap.Logger, plan *models.ModelPlan) (*models.ModelPlan, error) {
	// func (s *Store) ModelPlanCreate(ctx context.Context, plan *models.ModelPlan) (*models.ModelPlan, error) {

	if plan.ID == uuid.Nil {
		plan.ID = uuid.New()
	}
	stmt, err := s.db.PrepareNamed(modelPlanCreateSQL)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create model plan with error %s", err),
			zap.String("user", models.ValueOrEmpty(plan.ModifiedBy)),
		)
		return nil, err
	}
	retPlan := models.ModelPlan{}

	err = stmt.Get(&retPlan, plan)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create model plan with error %s", err),
			zap.String("user", models.ValueOrEmpty(plan.ModifiedBy)),
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
			zap.String("user", models.ValueOrEmpty(plan.ModifiedBy)),
		)
		return nil, err
	}

	err = stmt.Get(plan, plan)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update system intake %s", err),
			zap.String("id", plan.ID.String()),
			zap.String("user", models.ValueOrEmpty(plan.ModifiedBy)),
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
func (s *Store) ModelPlanGetByID(logger *zap.Logger, id uuid.UUID) (*models.ModelPlan, error) {
	plan := models.ModelPlan{}
	stmt, err := s.db.PrepareNamed(modelPlanGetByIDSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{"id": id}

	err = stmt.Get(&plan, arg)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			logger.Info(
				"No model plan found",
				zap.Error(err),
				zap.String("id", id.String()),
			)
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.ModelPlan{}}
		}
		logger.Error(
			"Failed to fetch model plan",
			zap.Error(err),
			zap.String("id", id.String()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     id,
			Operation: apperrors.QueryFetch,
		}
	}

	return &plan, nil

}

// ModelPlanCollectionByUser returns a list of model plans for a given EUA ID (TODO: Make this go by collaborators, not by createdBy)
func (s *Store) ModelPlanCollectionByUser(logger *zap.Logger, EUAID string) ([]*models.ModelPlan, error) {
	modelPlans := []*models.ModelPlan{}

	stmt, err := s.db.PrepareNamed(modelPlanCollectionByUserSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{"euaID": EUAID}

	err = stmt.Select(&modelPlans, arg) //this returns more than one

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			logger.Info(
				"No model plans for user found",
				zap.Error(err),
				zap.String("euaID", EUAID),
			)
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.ModelPlan{}}
		}
		logger.Error(
			"Failed to fetch model plans",
			zap.Error(err),
			zap.String("euaID", EUAID),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     EUAID,
			Operation: apperrors.QueryFetch,
		}
	}

	return modelPlans, nil
}
