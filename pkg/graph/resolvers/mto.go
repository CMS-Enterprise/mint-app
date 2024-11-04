package resolvers

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOStatusGet returns the overall status of an MTO
func MTOStatusGet(ctx context.Context, modelPlanID uuid.UUID, mtoMarkedReadyToReview bool) (models.MTOStatus, error) {
	//TODO (mto) Decide if this would be better as a DB query, if we should rely on other loaders

	if mtoMarkedReadyToReview {
		return models.MTOStatusReadyToReview, nil
	}
	// Get Categories, Milestones, and Solutions by ModelPlanID. If any are returned, it is in progress. If any errors, it is ReadyToStart

	categories, err := MTOCategoryGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return models.MTOStatusReadyToStart, err
	}
	if len(categories) > 0 {
		return models.MTOStatusInProgress, nil
	}

	milestones, err := MTOMilestoneGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return models.MTOStatusReadyToStart, err
	}
	if len(milestones) > 0 {
		return models.MTOStatusInProgress, nil
	}
	// TODO (mto) add when solution loaders are implemented
	// solutions, err := MTOSolutionGetByModelPlanIDLOADER(ctx, modelPlanID)
	// if err != nil {
	// 	return models.MTOStatusReadyToStart, err
	// }
	// if len(solutions) > 0 {
	// 	return models.MTOStatusInProgress, nil
	// }

	//If there are no categories, milestones, or solutions, it is just ready to start
	return models.MTOStatusReadyToStart, nil

}

// MTOLastUpdatedGet returns the most recent update to an MTO overall.
func MTOLastUpdatedGet(ctx context.Context, modelPlanID uuid.UUID) (*models.RecentModification, error) {
	// TODO  (mto) restructure this to use change history

	categories, err := MTOCategoryGetByModelPlanIDLOADER(ctx, modelPlanID)
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
