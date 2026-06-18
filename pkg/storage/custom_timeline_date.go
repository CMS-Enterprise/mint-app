package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CustomTimelineDateGetByID returns the custom timeline date for a given id.
func CustomTimelineDateGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.CustomTimelineDate, error) {
	return sqlutils.GetProcedure[models.CustomTimelineDate](np, sqlqueries.CustomTimelineDate.GetByID, utilitysql.CreateIDQueryMap(id))
}
