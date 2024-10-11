package resolvers

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// PlanDataExchangeApproachGetByID retrieves a plan data exchange approach by its ID
func PlanDataExchangeApproachGetByID(logger *zap.Logger, store *storage.Store, id uuid.UUID) (*models.PlanDataExchangeApproach, error) {
	return storage.PlanDataExchangeApproachGetByID(store, logger, id)
}

// PlanDataExchangeApproachGetByModelPlanID retrieves a plan data exchange approach by its model plan ID
func PlanDataExchangeApproachGetByModelPlanID(logger *zap.Logger, store *storage.Store, modelPlanID uuid.UUID) (*models.PlanDataExchangeApproach, error) {
	return storage.PlanDataExchangeApproachGetByModelPlanID(store, logger, modelPlanID)
}

// PlanDataExchangeApproachUpdate updates a plan data exchange approach
// It looks to see if a user marked the section as complete, and if so it will update the status and mark the user and the date.
// If a user sets the section as not complete, it will clear that data, and set the status to in progress.
func PlanDataExchangeApproachUpdate(
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
) (*models.PlanDataExchangeApproach, error) {
	// Get existing plan data exchange approach
	existing, err := storage.PlanDataExchangeApproachGetByID(store, logger, id)
	if err != nil {
		return nil, err
	}
	if existing.Status == models.DataExchangeApproachStatusReady {
		existing.Status = models.DataExchangeApproachStatusInProgress
	}

	// Check if the 'changes' map contains the 'isDataExchangeApproachComplete' key and that the
	// 'isDataExchangeApproachComplete' is different from the existing value
	if isDataExchangeApproachComplete, ok := changes["isDataExchangeApproachComplete"]; ok {
		isSettingToComplete, ok := isDataExchangeApproachComplete.(bool)
		if !ok {
			return nil, fmt.Errorf(" unable to update plan data exchange approach, isDataExchangeApproachComplete is not a bool")
		}

		// Check if time has been set or is the default value
		if existing.MarkedCompleteDts == nil && isSettingToComplete {
			// We do not actually store the isDataExchangeApproachComplete field in the database
			// so we need to remove it from the changes map

			existing.MarkedCompleteBy = &principal.Account().ID
			existing.MarkedCompleteDts = models.TimePointer(time.Now().UTC())
			existing.Status = models.DataExchangeApproachStatusCompleted
		} else if !isSettingToComplete {
			existing.MarkedCompleteBy = nil
			existing.MarkedCompleteDts = nil
			existing.Status = models.DataExchangeApproachStatusInProgress
		}

		delete(changes, "isDataExchangeApproachComplete")
	}

	// Update the base task list section
	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	// Update the plan data exchange approach
	retDataExchangeApproach, err := storage.PlanDataExchangeApproachUpdate(store, logger, existing)
	return retDataExchangeApproach, err
}
