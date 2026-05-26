package storage

import (
	"github.com/lib/pq"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CTATRequestLiteGetByRequesterIDLOADER returns the lite CTAT requests for the supplied requester IDs.
func CTATRequestLiteGetByRequesterIDLOADER(np sqlutils.NamedPreparer, requesterIDs []uuid.UUID) ([]*models.CTATRequestLite, error) {
	args := map[string]any{
		"requester_ids": pq.Array(requesterIDs),
	}

	requestLiteCollection, err := sqlutils.SelectProcedure[models.CTATRequestLite](np, sqlqueries.CTATRequest.GetByRequesterID, args)
	if err != nil {
		return nil, err
	}

	return requestLiteCollection, nil
}

// CTATRequestLiteCollectionGetForAdmin returns the lite CTAT requests for the admin table view.
func CTATRequestLiteCollectionGetForAdmin(np sqlutils.NamedPreparer) ([]*models.CTATRequestLite, error) {
	rows, err := sqlutils.SelectProcedure[models.CTATRequestLite](np, sqlqueries.CTATRequest.GetForAdmin, map[string]any{})
	if err != nil {
		return nil, err
	}

	return rows, nil
}
