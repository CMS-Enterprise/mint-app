package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"

	_ "embed"
)

//go:embed SQL/model_plan_create.sql
var model_plan_createSQL string

//go:embed SQL/model_plan_update.sql
var model_plan_updateSQL string

//go:embed SQL/model_plan_get_by_id.sql
var model_plan_get_by_idSQL string

//go:embed SQL/model_plan_collection_by_user.sql
var model_plan_collection_by_userSQL string

func (s *Store) ModelPlanCreate(ctx context.Context, plan *models.ModelPlan) (*models.ModelPlan, error) {
	if plan.ID == uuid.Nil {
		plan.ID = uuid.New()
	}
	stmt, err := s.db.PrepareNamed(model_plan_createSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create model plan with error %s", err),
			zap.String("user", plan.ModifiedBy.ValueOrZero()),
		)
		return nil, err
	}
	retPlan := models.ModelPlan{}

	err = stmt.Get(&retPlan, plan)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create model plan with error %s", err),
			zap.String("user", plan.ModifiedBy.ValueOrZero()),
		)
		return nil, err

	}

	return &retPlan, nil
}

func (s *Store) ModelPlanUpdate(ctx context.Context, plan *models.ModelPlan) (*models.ModelPlan, error) {

	stmt, err := s.db.PrepareNamed(model_plan_updateSQL)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update system intake %s", err),
			zap.String("id", plan.ID.String()),
			zap.String("user", plan.ModifiedBy.ValueOrZero()),
		)
		return nil, err
	}

	err = stmt.Get(plan, plan)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to update system intake %s", err),
			zap.String("id", plan.ID.String()),
			zap.String("user", plan.ModifiedBy.ValueOrZero()),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     plan,
			Operation: apperrors.QueryUpdate,
		}
	}

	return plan, nil

}

func (s *Store) ModelPlanGetByID(ctx context.Context, id uuid.UUID) (*models.ModelPlan, error) {
	plan := models.ModelPlan{}
	stmt, err := s.db.PrepareNamed(model_plan_get_by_idSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{"id": id}

	err = stmt.Get(&plan, arg)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			appcontext.ZLogger(ctx).Info(
				"No model plan found",
				zap.Error(err),
				zap.String("id", id.String()),
			)
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.ModelPlan{}}
		}
		appcontext.ZLogger(ctx).Error(
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

func (s *Store) ModelPlanCollectionByUser(ctx context.Context, EUAID string) ([]*models.ModelPlan, error) {
	modelPlans := []*models.ModelPlan{}

	stmt, err := s.db.PrepareNamed(model_plan_collection_by_userSQL)
	if err != nil {
		return nil, err
	}
	arg := map[string]interface{}{"euaID": EUAID}

	err = stmt.Select(&modelPlans, arg) //this returns more than one

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			appcontext.ZLogger(ctx).Info(
				"No model plans for user found",
				zap.Error(err),
				zap.String("euaID", EUAID),
			)
			return nil, &apperrors.ResourceNotFoundError{Err: err, Resource: models.ModelPlan{}}
		}
		appcontext.ZLogger(ctx).Error(
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
