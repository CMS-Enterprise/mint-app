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
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"
)

// PlanTimelineCreate creates a new planTimeline
func (s *Store) PlanTimelineCreate(np sqlutils.NamedPreparer, logger *zap.Logger, planTimeline *models.PlanTimeline) (*models.PlanTimeline, error) {

	planTimeline.ID = utilityuuid.ValueOrNewUUID(planTimeline.ID)

	stmt, err := np.PrepareNamed(sqlqueries.PlanTimeline.Create)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, planTimeline)
	}
	defer stmt.Close()

	planTimeline.ModifiedBy = nil
	planTimeline.ModifiedDts = nil

	err = stmt.Get(planTimeline, planTimeline)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, planTimeline)
	}

	return planTimeline, nil
}

// PlanTimelineUpdate updates the planTimeline for a given id
func (s *Store) PlanTimelineUpdate(logger *zap.Logger, planTimeline *models.PlanTimeline) (*models.PlanTimeline, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanTimeline.Update)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, planTimeline)
	}
	defer stmt.Close()

	err = stmt.Get(planTimeline, planTimeline)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, planTimeline)
	}

	return planTimeline, nil
}

// PlanTimelineGetByID returns the planTimeline for a given id
func (s *Store) PlanTimelineGetByID(_ *zap.Logger, id uuid.UUID) (*models.PlanTimeline, error) {

	planTimeline := models.PlanTimeline{}

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanTimeline.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&planTimeline, utilitysql.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}
	return &planTimeline, nil
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
