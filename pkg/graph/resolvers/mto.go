package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOStatusGet returns the overall status of an MTO
func MTOStatusGet(ctx context.Context, modelPlanID uuid.UUID, mtoMarkedReadyToReview bool) (models.MTOStatus, error) {
	//TODO (mto) Decide if this would be better as a DB query, if we should rely on other loaders

	if mtoMarkedReadyToReview {
		return models.MTOStatusReadyForReview, nil
	}

	lastUpdated, err := MTOLastUpdatedGet(ctx, modelPlanID)
	if err != nil {
		return models.MTOStatusReadyToStart, err
	}
	if lastUpdated != nil {
		return models.MTOStatusInProgress, nil
	}
	return models.MTOStatusReadyToStart, nil

}

// MTOLastUpdatedGet returns the most recent update to an MTO overall.
func MTOLastUpdatedGet(ctx context.Context, modelPlanID uuid.UUID) (*models.RecentModification, error) {
	// TODO  (mto) restructure this to use change history

	// Call the loader directly so we don't get uncategorized included
	categories, err := loaders.MTOCategory.ByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	milestones, err := MTOMilestoneGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}

	var baseStructs []models.IBaseStruct
	for _, category := range categories {
		baseStructs = append(baseStructs, category)
	}
	for _, milestone := range milestones {
		baseStructs = append(baseStructs, milestone)
	}
	mostRecentTime, mostRecentUserUUID := models.GetMostRecentTime(baseStructs)
	if mostRecentUserUUID == uuid.Nil {
		// There is no recent edit, nil is returned for the user
		return nil, nil
	}

	recentModified := models.NewRecentModification(mostRecentUserUUID, mostRecentTime)

	return &recentModified, nil

	// TODO (mto) add when solution loaders are implemented
	// solutions, err := MTOSolutionGetByModelPlanIDLOADER(ctx, modelPlanID)
	// if err != nil {
	// 	return nil, err
	// }
	// if len(solutions) > 0 {
	// 	return models.MTOStatusInProgress, nil
	// }

}
