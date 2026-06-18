package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CustomTimelineDateGetByID returns the custom timeline date for a given id.
func CustomTimelineDateGetByID(np sqlutils.NamedPreparer, id uuid.UUID) (*models.CustomTimelineDate, error) {
	res, err := sqlutils.GetProcedure[models.CustomTimelineDate](np, sqlqueries.CustomTimelineDate.GetByID, utilitysql.CreateIDQueryMap(id))
	if err != nil {
		return nil, fmt.Errorf("problem getting custom timeline date by id: %w", err)
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
