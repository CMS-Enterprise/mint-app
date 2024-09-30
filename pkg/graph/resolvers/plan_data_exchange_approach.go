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
		if existing.IsDataExchangeApproachComplete != isSettingToComplete {
			existing.MarkedCompleteBy = principal.Account().ID
			existing.MarkedCompleteDts = time.Now().UTC()
		}
	}

	// Update the base task list section
	err = CoreTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	// Update the plan data exchange approach
	retDataExchangeApproach, err := store.PlanDataExchangeApproachUpdate(logger, existing)
	return retDataExchangeApproach, err
}
