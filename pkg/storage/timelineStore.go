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

// TimelineCreate creates a new timeline
func (s *Store) TimelineCreate(np sqlutils.NamedPreparer, logger *zap.Logger, timeline *models.Timeline) (*models.Timeline, error) {

	timeline.ID = utilityuuid.ValueOrNewUUID(timeline.ID)

	stmt, err := np.PrepareNamed(sqlqueries.Timeline.Create)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, timeline)
	}
	defer stmt.Close()

	timeline.ModifiedBy = nil
	timeline.ModifiedDts = nil

	err = stmt.Get(timeline, timeline)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, timeline)
	}

	return timeline, nil
}

// TimelineUpdate updates the timeline for a given id
func (s *Store) TimelineUpdate(logger *zap.Logger, timeline *models.Timeline) (*models.Timeline, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.Timeline.Update)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, timeline)
	}
	defer stmt.Close()

	err = stmt.Get(timeline, timeline)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, timeline)
	}

	return timeline, nil
}

// TimelineGetByID returns the timeline for a given id
func (s *Store) TimelineGetByID(_ *zap.Logger, id uuid.UUID) (*models.Timeline, error) {

	timeline := models.Timeline{}

	stmt, err := s.db.PrepareNamed(sqlqueries.Timeline.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(&timeline, utilitysql.CreateIDQueryMap(id))

	if err != nil {
		return nil, err
	}
	return &timeline, nil
}

// TimelineGetByModelPlanID returns the timeline for a given model plan id
func (s *Store) TimelineGetByModelPlanID(modelPlanID uuid.UUID) (*models.Timeline, error) {
	arg := utilitysql.CreateModelPlanIDQueryMap(modelPlanID)

	timeline, err := sqlutils.GetProcedure[models.Timeline](s, sqlqueries.Timeline.GetByModelPlanID, arg)
	if err != nil {
		return nil, fmt.Errorf("error getting plan timeline by model plan id: %w", err)
	}
	return timeline, nil
}

// TimelineGetByModelPlanIDLoader returns the plan timeline for a slice of model plan ids
func TimelineGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.Timeline, error) {

	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	res, err := sqlutils.SelectProcedure[models.Timeline](np, sqlqueries.Timeline.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return res, nil

}
