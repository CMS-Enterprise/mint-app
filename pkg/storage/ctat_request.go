package storage

import (
	"github.com/lib/pq"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CTATRequestGetByRequesterIDLOADER returns CTAT requests for the supplied requester IDs.
func CTATRequestGetByRequesterIDLOADER(np sqlutils.NamedPreparer, requesterIDs []uuid.UUID) ([]*models.CTATRequest, error) {
	args := map[string]any{
		"requester_ids": pq.Array(requesterIDs),
	}

	return sqlutils.SelectProcedure[models.CTATRequest](np, sqlqueries.CTATRequest.GetByRequesterID, args)
}

// CTATRequestCollectionGetForAdmin returns CTAT requests for the admin table view.
func CTATRequestCollectionGetForAdmin(np sqlutils.NamedPreparer) ([]*models.CTATRequest, error) {
	return sqlutils.SelectProcedure[models.CTATRequest](np, sqlqueries.CTATRequest.GetForAdmin, map[string]any{})
}
