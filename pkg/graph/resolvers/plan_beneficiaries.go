package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// PlanBeneficiariesUpdate updates a plan Beneficiary buisness object
func PlanBeneficiariesUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.PlanBeneficiaries, error) {
	// Get existing plan beneficiaries
	existing, err := store.PlanBeneficiariesGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	retGeneralCharacteristics, err := store.PlanBeneficiariesUpdate(logger, existing)
	return retGeneralCharacteristics, err
}

//PlanBeneficiariesGetByModelPlanID returns a plan Beneficiary buisness object associated with a model plan
func PlanBeneficiariesGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) (*models.PlanBeneficiaries, error) {
	b, err := store.PlanBeneficiariesGetByModelPlanID(logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	return b, nil
}
