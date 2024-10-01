package resolvers

import (
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// PlanDataExchangeApproachGetByID retrieves a plan data exchange approach by its ID
func PlanDataExchangeApproachGetByID(logger *zap.Logger, store *storage.Store, id uuid.UUID) (*models.PlanDataExchangeApproach, error) {
	return store.PlanDataExchangeApproachGetByID(logger, id)
}

// PlanDataExchangeApproachGetByModelPlanID retrieves a plan data exchange approach by its model plan ID
func PlanDataExchangeApproachGetByModelPlanID(logger *zap.Logger, store *storage.Store, modelPlanID uuid.UUID) (*models.PlanDataExchangeApproach, error) {
	return store.PlanDataExchangeApproachGetByModelPlanID(logger, modelPlanID)
}

// PlanDataExchangeApproachUpdate updates a plan data exchange approach
func PlanDataExchangeApproachUpdate(
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
) (*models.PlanDataExchangeApproach, error) {
	// Get existing plan data exchange approach
	existing, err := store.PlanDataExchangeApproachGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	// Check if the 'changes' map contains the 'isDataExchangeApproachComplete' key and that the
	// 'isDataExchangeApproachComplete' is different from the existing value
	if isDataExchangeApproachComplete, ok := changes["isDataExchangeApproachComplete"]; ok {
		isSettingToComplete := isDataExchangeApproachComplete.(bool)

		// Check if time has been set or is the default value
		if existing.MarkedCompleteDts == nil && isSettingToComplete {
			// We do not actually store the isDataExchangeApproachComplete field in the database
			// so we need to remove it from the changes map

			existing.MarkedCompleteBy = &principal.Account().ID
			existing.MarkedCompleteDts = models.TimePointer(time.Now().UTC())
		} else if !isSettingToComplete {
			existing.MarkedCompleteBy = nil
			existing.MarkedCompleteDts = nil
		}

		delete(changes, "isDataExchangeApproachComplete")
	}

	// Update the base task list section
	err = CoreTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	targetStatus, err := EvaluateStatus(existing)
	if err != nil {
		return nil, err
	}

	existing.Status = &targetStatus

	// Update the plan data exchange approach
	retDataExchangeApproach, err := store.PlanDataExchangeApproachUpdate(logger, existing)
	return retDataExchangeApproach, err
}

// EvaluateStatus derives the status of the data exchange approach based on the current state of the model
func EvaluateStatus(dea *models.PlanDataExchangeApproach) (models.DataExchangeApproachStatus, error) {

	if dea.ModifiedDts == nil {
		return models.DataExchangeApproachStatusNotStarted, nil
	}

	if dea.MarkedCompleteDts != nil {
		return models.DataExchangeApproachStatusComplete, nil
	}

	return models.DataExchangeApproachStatusInProgress, nil
}
