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

	requests, err := sqlutils.SelectProcedure[models.CTATRequest](np, sqlqueries.CTATRequest.GetByRequesterID, args)
	if err != nil {
		return nil, err
	}

	return hydrateCTATRequestSupportingDocuments(np, requests)
}

// CTATRequestCollectionGetForAdmin returns CTAT requests for the admin table view.
func CTATRequestCollectionGetForAdmin(np sqlutils.NamedPreparer) ([]*models.CTATRequest, error) {
	requests, err := sqlutils.SelectProcedure[models.CTATRequest](np, sqlqueries.CTATRequest.GetForAdmin, map[string]any{})
	if err != nil {
		return nil, err
	}

	return hydrateCTATRequestSupportingDocuments(np, requests)
}

func hydrateCTATRequestSupportingDocuments(np sqlutils.NamedPreparer, requests []*models.CTATRequest) ([]*models.CTATRequest, error) {
	if len(requests) == 0 {
		return requests, nil
	}

	requestIDs := make([]uuid.UUID, len(requests))
	for i, request := range requests {
		requestIDs[i] = request.ID
		request.SupportingDocuments = []*models.CTATRequestDocument{}
	}

	documents, err := CTATRequestDocumentGetByCTATRequestIDLOADER(np, requestIDs)
	if err != nil {
		return nil, err
	}

	documentsByRequestID := make(map[uuid.UUID][]*models.CTATRequestDocument, len(requests))
	for _, document := range documents {
		documentsByRequestID[document.CTATRequestID] = append(documentsByRequestID[document.CTATRequestID], document)
	}

	for _, request := range requests {
		request.SupportingDocuments = documentsByRequestID[request.ID]
		if request.SupportingDocuments == nil {
			request.SupportingDocuments = []*models.CTATRequestDocument{}
		}
	}

	return requests, nil
}
