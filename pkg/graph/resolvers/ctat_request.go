package resolvers

import (
	"context"
	"fmt"

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

// CTATRelatedMINTModelsGetByIDsLOADER resolves CTAT-related MINT model plans by ID using the existing model plan dataloader.
func CTATRelatedMINTModelsGetByIDsLOADER(ctx context.Context, ids []uuid.UUID) ([]*models.ModelPlan, error) {
	if len(ids) == 0 {
		return []*models.ModelPlan{}, nil
	}

	plans, errs := loaders.ModelPlan.GetByID.LoadMany(ctx, ids)
	for _, err := range errs {
		if err != nil {
			return nil, err
		}
	}

	relatedModels := make([]*models.ModelPlan, 0, len(plans))
	for _, plan := range plans {
		if plan == nil {
			return nil, fmt.Errorf("model plan not found while resolving CTAT related MINT models")
		}

		relatedModels = append(relatedModels, plan)
	}

	return relatedModels, nil
}
