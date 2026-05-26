package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// CTATRequestLiteGetByRequesterIDLOADER implements resolver logic to get lite CTAT requests by requester ID using a data loader.
func CTATRequestLiteGetByRequesterIDLOADER(ctx context.Context, requesterID uuid.UUID) ([]*models.CTATRequestLite, error) {
	return loaders.CTATRequest.ByRequesterID.Load(ctx, requesterID)
}
