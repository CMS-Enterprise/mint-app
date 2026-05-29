package storage

import (
	"fmt"

	"github.com/lib/pq"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CTATRequestDocumentCreate creates a CTAT request document row.
func CTATRequestDocumentCreate(
	np sqlutils.NamedPreparer,
	doc *models.CTATRequestDocument,
) (*models.CTATRequestDocument, error) {
	if doc.ID == uuid.Nil {
		doc.ID = uuid.New()
	}

	doc.ModifiedBy = nil
	doc.ModifiedDts = nil

	createdDoc, procErr := sqlutils.GetProcedure[models.CTATRequestDocument](np, sqlqueries.CTATRequestDocument.Create, doc)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating CTAT request document: %w", procErr)
	}

	return createdDoc, nil
}

// CTATRequestDocumentGetByCTATRequestIDLOADER returns CTAT request documents for the supplied CTAT request IDs.
func CTATRequestDocumentGetByCTATRequestIDLOADER(np sqlutils.NamedPreparer, ctatRequestIDs []uuid.UUID) ([]*models.CTATRequestDocument, error) {
	args := map[string]any{
		"ctat_request_ids": pq.Array(ctatRequestIDs),
	}

	return sqlutils.SelectProcedure[models.CTATRequestDocument](np, sqlqueries.CTATRequestDocument.GetByCTATRequestID, args)
}
