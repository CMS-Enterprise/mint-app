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

func (s *Store) ModelPlanCreate(ctx context.Context, plan *models.ModelPlan) (*models.ModelPlan, error) {

	if plan.ID == uuid.Nil {
		plan.ID = uuid.New()
	}

	time := s.clock.Now()
	if plan.CreatedDts == nil {
		plan.CreatedDts = &time
	}

	if plan.ModifiedDts == nil {
		plan.ModifiedDts = &time
	}
	_, err := s.db.NamedExec(
		model_plan_createSQL,
		plan,
	)
	if err != nil {
		appcontext.ZLogger(ctx).Error(
			fmt.Sprintf("Failed to create model plan with error %s", err),
			zap.String("user", plan.ModifiedBy.ValueOrZero()),
		)
		return nil, err

	}

	return plan, nil //TODO update this, have a return in the SQL, or fetch the object, or just have that script return it
}

func (s *Store) ModelPlanUpdate(ctx context.Context, plan *models.ModelPlan) (*models.ModelPlan, error) {

	_, err := s.db.NamedExec(
		model_plan_updateSQL,
		plan,
	)
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

	return plan, nil //TODO update this, have a return in the SQL, or fetch the object, or just have that script return it

}

func (s *Store) ModelPlanGetByID(ctx context.Context, id uuid.UUID) (*models.ModelPlan, error) {
	plan := models.ModelPlan{}
	err := s.db.GetContext(ctx, &plan, model_plan_get_by_idSQL, id) //TODO replace with named exec,

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
