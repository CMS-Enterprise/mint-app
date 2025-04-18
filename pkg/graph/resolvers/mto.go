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
)

// MTOStatusGet returns the overall status of an MTO
func MTOStatusGet(ctx context.Context, store *storage.Store, logger *zap.Logger, principal authentication.Principal, modelPlanID uuid.UUID) (models.MTOStatus, error) {

	// Check if the mto has been marked as ready to review
	mtoInfo, err := MTOInfoGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return models.MTOStatusReadyToStart, err
	}
	if mtoInfo.ReadyForReviewBy != nil {
		return models.MTOStatusReadyForReview, nil
	}

	// Determine if the mto section has been started
	lastUpdated, err := MTOMostRecentTranslatedAudit(ctx, store, logger, principal, modelPlanID)
	if err != nil {
		return models.MTOStatusReadyToStart, err
	}
	if lastUpdated != nil {
		return models.MTOStatusInProgress, nil
	}
	return models.MTOStatusReadyToStart, nil

}

// MTOMostRecentTranslatedAudit returns the most recent translated audit for an MTO overall.
// It specifically excludes
func MTOMostRecentTranslatedAudit(ctx context.Context, store *storage.Store, logger *zap.Logger, principal authentication.Principal, modelPlanID uuid.UUID) (*models.TranslatedAudit, error) {
	// TODO, refactor this to be a data loader, since it is called twice
	numberOfRecords := 2
	records, err := MTOTranslatedAuditsGetByModelPlanID(ctx, store, logger, principal, modelPlanID, &numberOfRecords, nil)
	if err != nil {
		return nil, err
	}

	// there are no translated audits.
	if len(records) < 1 {
		return nil, nil
	}
	mostRecent := records[0]
	if mostRecent.TableName == models.TNMTOInfo && mostRecent.Action == models.DBOpInsert {
		return nil, nil
	}

	return records[0], nil
}

func MTOToggleReadyForReview(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID, isReadyForReview bool) (*models.MTOInfo, error) {
	mtoInfo, err := MTOInfoGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	// Clear out ready for review if no
	if !isReadyForReview {
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
