package storage

import (
	"github.com/lib/pq"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// CTATRequestDocumentGetByCTATRequestIDLOADER returns CTAT request documents for the supplied CTAT request IDs.
func CTATRequestDocumentGetByCTATRequestIDLOADER(np sqlutils.NamedPreparer, ctatRequestIDs []uuid.UUID) ([]*models.CTATRequestDocument, error) {
	args := map[string]any{
		"ctat_request_ids": pq.Array(ctatRequestIDs),
	}

	return sqlutils.SelectProcedure[models.CTATRequestDocument](np, sqlqueries.CTATRequestDocument.GetByCTATRequestID, args)
}
