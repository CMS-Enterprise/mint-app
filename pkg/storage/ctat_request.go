package storage

import (
	"fmt"

	"github.com/lib/pq"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CTATRequestCreate creates a CTAT request row.
func CTATRequestCreate(np sqlutils.NamedPreparer, request *models.CTATRequest) (*models.CTATRequest, error) {
	if request.ID == uuid.Nil {
		request.ID = uuid.New()
	}

	request.ModifiedBy = nil
	request.ModifiedDts = nil

	createdRequest, procErr := sqlutils.GetProcedure[models.CTATRequest](np, sqlqueries.CTATRequest.Create, request)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating CTAT request: %w", procErr)
	}

	return createdRequest, nil
}

// CTATRequestGetByID returns a CTAT request by ID.
func CTATRequestGetByID(np sqlutils.NamedPreparer, id uuid.UUID) (*models.CTATRequest, error) {
	request, err := sqlutils.GetProcedure[models.CTATRequest](np, sqlqueries.CTATRequest.GetByID, map[string]any{
		"id": id,
	})
	if err != nil {
		return nil, err
	}

	return request, nil
}

// CTATRequestGetByRequesterIDLOADER returns CTAT requests for the supplied requester IDs.
func CTATRequestGetByRequesterIDLOADER(np sqlutils.NamedPreparer, requesterIDs []uuid.UUID) ([]*models.CTATRequest, error) {
	args := map[string]any{
		"requester_ids": pq.Array(requesterIDs),
	}

	requests, err := sqlutils.SelectProcedure[models.CTATRequest](np, sqlqueries.CTATRequest.GetByRequesterID, args)
	if err != nil {
		return nil, err
	}

	return requests, nil
}

// CTATRequestCollectionGetForAdmin returns CTAT requests for the admin table view.
func CTATRequestCollectionGetForAdmin(np sqlutils.NamedPreparer) ([]*models.CTATRequest, error) {
	requests, err := sqlutils.SelectProcedure[models.CTATRequest](np, sqlqueries.CTATRequest.GetForAdmin, map[string]any{})
	if err != nil {
		return nil, err
	}

	return requests, nil
}
