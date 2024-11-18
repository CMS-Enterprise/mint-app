package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
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

func MTOToggleReadyForReview(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID, isReadyForReview bool) (*models.MTOInfo, error) {
	mtoInfo, err := MTOInfoGetByIDOrModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	// Clear out ready for review if no
	if !isReadyForReview {
		//TODO handle all the logic for this, look at task list section logic. Maybe extract into helper?
		mtoInfo.ReadyForReviewBy = nil
		mtoInfo.ReadyForReviewDts = nil

	} else {
		// Only set it ready for review if it wasn't already marked ready for review
		if mtoInfo.ReadyForReviewBy == nil {
			if principal.Account() == nil {
				return nil, fmt.Errorf("principal was nil")
			}
			userID := principal.Account().ID
			now := time.Now()

			mtoInfo.ReadyForReviewBy = &userID
			mtoInfo.ReadyForReviewDts = &now

		}
	}

	// Just check access, don't apply changes
	err = BaseStructPreUpdate(logger, mtoInfo, nil, principal, store, false, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOInfoUpdate(store, logger, mtoInfo)

}
