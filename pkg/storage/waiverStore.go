package storage

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// WaiverGetByID returns a waiver row for a given id.
func WaiverGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.Waiver, error) {
	return sqlutils.GetProcedure[models.Waiver](np, sqlqueries.Waiver.GetByID, utilitysql.CreateIDQueryMap(id))
}
