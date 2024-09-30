package resolvers

import (
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// ReadyForClearanceRead handles requests to read a information about a Model Plan's "Ready for Clearance" section
func ReadyForClearanceRead(
	logger *zap.Logger,
	store *storage.Store,
	modelPlanID uuid.UUID,
) (*model.PrepareForClearance, error) {
	clearanceData, err := store.ReadyForClearanceGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	result := model.PrepareForClearance{
		Status:             calculateStatus(clearanceData, time.Now()),
		LatestClearanceDts: clearanceData.MostRecentClearanceDts,
	}

	return &result, nil
}

func calculateStatus(clearanceData *models.PrepareForClearanceResponse, now time.Time) model.PrepareForClearanceStatus {
	// If we don't yet have a clearance date, we cannot start this section yet!
	if clearanceData.BasicsClearanceStarts == nil {
		return model.PrepareForClearanceStatusCannotStart
	}

	// We have a clearance date, so we can calculate 20 days prior to that date
	// If we're before that calculated date, we can't start the section.
	twentyDaysBeforeClearance := clearanceData.BasicsClearanceStarts.Add(-time.Hour * 24 * 20)
	if now.Before(twentyDaysBeforeClearance) {
		return model.PrepareForClearanceStatusCannotStart
	}

	// If every section is ready for clearance, the status is ready for clearance no matter what!
	if clearanceData.AllReadyForClearance {
		return model.PrepareForClearanceStatusReadyForClearance
	}

	// If there's anything in-progress (i.e. our latest clearance-time is not null) we're in progress
	if clearanceData.MostRecentClearanceDts != nil {
		return model.PrepareForClearanceStatusInProgress
	}

	// Otherwise, we haven't started yet!
	return model.PrepareForClearanceStatusReady
}
