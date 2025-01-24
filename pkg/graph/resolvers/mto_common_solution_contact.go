package resolvers

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCommonSolutionContactInformationGetByKeyLOADER returns an MTOCommonSolutionContactInformation by it's key. Currently, it doesn't provide any contextual data.
func MTOCommonSolutionContactInformationGetByKeyLOADER(ctx context.Context, key models.MTOCommonSolutionKey) (*models.MTOCommonSolutionContactInformation, error) {
	pocs, err := loaders.MTOCommonSolutionContact.ByCommonSolutionKey.Load(ctx, key)
	if err != nil {
		return nil, nil
	}

	return &models.MTOCommonSolutionContactInformation{
		PointsOfContact: pocs,
	}, nil

}
