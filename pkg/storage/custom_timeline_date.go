package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CustomTimelineDateCreate creates a custom timeline date.
func CustomTimelineDateCreate(np sqlutils.NamedPreparer, customTimelineDate *models.CustomTimelineDate) (*models.CustomTimelineDate, error) {
	if customTimelineDate.ID == uuid.Nil {
		customTimelineDate.ID = uuid.New()
	}

	res, err := sqlutils.GetProcedure[models.CustomTimelineDate](np, sqlqueries.CustomTimelineDate.Create, customTimelineDate)
	if err != nil {
		return nil, fmt.Errorf("problem creating custom timeline date: %w", err)
	}

	return res, nil
}

// CustomTimelineDateGetByIDLoader returns custom timeline dates for a slice of ids.
func CustomTimelineDateGetByIDLoader(np sqlutils.NamedPreparer, ids []uuid.UUID) ([]*models.CustomTimelineDate, error) {
	args := map[string]any{
		"ids": pq.Array(ids),
	}

	res, err := sqlutils.SelectProcedure[models.CustomTimelineDate](np, sqlqueries.CustomTimelineDate.GetByIDLoader, args)
	if err != nil {
		return nil, fmt.Errorf("problem getting custom timeline dates by id: %w", err)
	}
	return res, nil
}

// CustomTimelineDateGetByModelPlanIDLoader returns custom timeline dates for a slice of model plan ids.
func CustomTimelineDateGetByModelPlanIDLoader(np sqlutils.NamedPreparer, modelPlanIDs []uuid.UUID) ([]*models.CustomTimelineDate, error) {
	args := map[string]any{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	res, err := sqlutils.SelectProcedure[models.CustomTimelineDate](np, sqlqueries.CustomTimelineDate.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, fmt.Errorf("problem getting custom timeline dates by model plan id: %w", err)
	}
	return res, nil
}

// CustomTimelineDateUpdate updates the custom timeline date for a given id.
func CustomTimelineDateUpdate(np sqlutils.NamedPreparer, customTimelineDate *models.CustomTimelineDate) (*models.CustomTimelineDate, error) {
	res, err := sqlutils.GetProcedure[models.CustomTimelineDate](np, sqlqueries.CustomTimelineDate.Update, customTimelineDate)
	if err != nil {
		return nil, fmt.Errorf("problem updating custom timeline date: %w", err)
	}

	return res, nil
}

// CustomTimelineDateDelete deletes the custom timeline date for a given id.
func CustomTimelineDateDelete(tx *sqlx.Tx, actorUserID uuid.UUID, id uuid.UUID) (*models.CustomTimelineDate, error) {
	// We need to set the session user variable so that the audit trigger knows who made the delete operation
	if err := setCurrentSessionUserVariable(tx, actorUserID); err != nil {
		return nil, fmt.Errorf("problem setting current session user variable when deleting custom timeline date by id: %w", err)
	}

	res, err := sqlutils.GetProcedure[models.CustomTimelineDate](tx, sqlqueries.CustomTimelineDate.Delete, utilitysql.CreateIDQueryMap(id))
	if err != nil {
		return nil, fmt.Errorf("problem deleting custom timeline date by id: %w", err)
	}

	return res, nil
}
