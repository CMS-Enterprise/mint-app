package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// CTATRequestGetByRequesterIDLOADER implements resolver logic to get CTAT requests by requester ID using a data loader.
func CTATRequestGetByRequesterIDLOADER(ctx context.Context, requesterID uuid.UUID) ([]*models.CTATRequest, error) {
	return loaders.CTATRequest.ByRequesterID.Load(ctx, requesterID)
}

// CTATRequestCollectionGetForAdmin implements resolver logic to get CTAT requests for the admin table view.
func CTATRequestCollectionGetForAdmin(ctx context.Context, store *storage.Store) ([]*models.CTATRequest, error) {
	return storage.CTATRequestCollectionGetForAdmin(store)
}
