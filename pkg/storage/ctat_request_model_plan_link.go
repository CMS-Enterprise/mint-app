package storage

import (
	"fmt"

	"github.com/lib/pq"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CTATRequestModelPlanLinkCreate creates a CTAT request model-plan link row.
func CTATRequestModelPlanLinkCreate(
	np sqlutils.NamedPreparer,
	link *models.CTATRequestModelPlanLink,
) (*models.CTATRequestModelPlanLink, error) {
	if link.ID == uuid.Nil {
		link.ID = uuid.New()
	}

	link.ModifiedBy = nil
	link.ModifiedDts = nil

	createdLink, procErr := sqlutils.GetProcedure[models.CTATRequestModelPlanLink](np, sqlqueries.CTATRequestModelPlanLink.Create, link)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating CTAT request model-plan link: %w", procErr)
	}

	return createdLink, nil
}

// CTATRequestModelPlanLinkGetByCTATRequestIDLOADER returns CTAT request model-plan links for the supplied CTAT request IDs.
func CTATRequestModelPlanLinkGetByCTATRequestIDLOADER(np sqlutils.NamedPreparer, ctatRequestIDs []uuid.UUID) ([]*models.CTATRequestModelPlanLink, error) {
	args := map[string]any{
		"ctat_request_ids": pq.Array(ctatRequestIDs),
	}

	return sqlutils.SelectProcedure[models.CTATRequestModelPlanLink](np, sqlqueries.CTATRequestModelPlanLink.GetByCTATRequestID, args)
}
