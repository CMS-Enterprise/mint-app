package storage

import (
	_ "embed"
	"fmt"

	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// PlanTimelineCreate creates a new planTimeline
func (s *Store) PlanTimelineCreate(np sqlutils.NamedPreparer, logger *zap.Logger, planTimeline *models.PlanTimeline) (*models.PlanTimeline, error) {

	if planTimeline.ID == uuid.Nil {
		planTimeline.ID = uuid.New()
	}

	returned, procErr := sqlutils.GetProcedure[models.PlanTimeline](np, sqlqueries.PlanTimeline.Create, planTimeline)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new PlanTimeline object: %w", procErr)
	}
	return returned, nil
}

// PlanTimelineUpdate updates the planTimeline for a given id
func (s *Store) PlanTimelineUpdate(np sqlutils.NamedPreparer, logger *zap.Logger, planTimeline *models.PlanTimeline) (*models.PlanTimeline, error) {
	returned, procErr := sqlutils.GetProcedure[models.PlanTimeline](np, sqlqueries.MTOSolution.Update, planTimeline)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating PlanTimeline object: %w", procErr)
	}
	return returned, nil
}

// PlanTimelineGetByID returns the planTimeline for a given id
func (s *Store) PlanTimelineGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.PlanTimeline, error) {
	return sqlutils.GetProcedure[models.PlanTimeline](np, sqlqueries.PlanDataExchangeApproach.GetByID, utilitysql.CreateIDQueryMap(id))
}

// PlanTimelineGetByModelPlanID returns the planTimeline for a given model plan id
func (s *Store) PlanTimelineGetByModelPlanID(modelPlanID uuid.UUID) (*models.PlanTimeline, error) {
	arg := utilitysql.CreateModelPlanIDQueryMap(modelPlanID)

	planTimeline, err := sqlutils.GetProcedure[models.PlanTimeline](s, sqlqueries.PlanTimeline.GetByModelPlanID, arg)
	if err != nil {
		return nil, fmt.Errorf("error getting planTimeline by model plan id: %w", err)
	}
	return planTimeline, nil
}

// PlanTimelineGetByModelPlanIDLoader returns the planTimeline for a slice of model plan ids
func PlanTimelineGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.PlanTimeline, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	res, err := sqlutils.SelectProcedure[models.PlanTimeline](np, sqlqueries.PlanTimeline.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return res, nil

}
