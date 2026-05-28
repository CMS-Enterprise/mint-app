package storage

import (
	"github.com/lib/pq"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CTATRequestModelPlanLinkGetByCTATRequestIDLOADER returns CTAT request model-plan links for the supplied CTAT request IDs.
func CTATRequestModelPlanLinkGetByCTATRequestIDLOADER(np sqlutils.NamedPreparer, ctatRequestIDs []uuid.UUID) ([]*models.CTATRequestModelPlanLink, error) {
	args := map[string]any{
		"ctat_request_ids": pq.Array(ctatRequestIDs),
	}

	return sqlutils.SelectProcedure[models.CTATRequestModelPlanLink](np, sqlqueries.CTATRequestModelPlanLink.GetByCTATRequestID, args)
}
