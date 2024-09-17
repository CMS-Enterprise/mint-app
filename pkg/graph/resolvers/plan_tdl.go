package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// PlanTDLCreate creates a new plan_cr_tdl record in the database
func PlanTDLCreate(logger *zap.Logger, input *model.PlanTDLCreateInput, principal authentication.Principal, store *storage.Store) (*models.PlanTDL, error) {

	planTDL := models.NewPlanTDL(principal.Account().ID, input.ModelPlanID)
	planTDL.IDNumber = input.IDNumber
	planTDL.DateInitiated = &input.DateInitiated
	planTDL.Title = input.Title
	planTDL.Note = input.Note

	err := BaseStructPreCreate(logger, planTDL, principal, store, true)
	if err != nil {
		return nil, err
	}

	return store.PlanTDLCreate(logger, planTDL)
}

// PlanTDLUpdate updates a plan_cr_tdl record in the database
func PlanTDLUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.PlanTDL, error) {
	// Get PlanCrTdl
	existingPlanTDL, err := store.PlanTDLGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existingPlanTDL, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	result, err := store.PlanTDLUpdate(logger, existingPlanTDL)
	return result, err
}

// PlanTDLDelete deletes a plan cr_tdl record in the database
func PlanTDLDelete(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*models.PlanTDL, error) {

	existingPlanCrTdl, err := store.PlanTDLGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreDelete(logger, existingPlanCrTdl, principal, store, true)
	if err != nil {
		return nil, err
	}

	return store.PlanTDLDelete(logger, id, principal.Account().ID)
}

// PlanTDLGet returns a plan_cr_tdl record in the database
func PlanTDLGet(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanTDL, error) {
	result, err := store.PlanTDLGetByID(logger, id)
	return result, err
}

// PlanTDLsGetByModelPlanID returns plan_cr_tdl records related to a model plan
func PlanTDLsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanTDL, error) {
	result, err := store.PlanTDLsGetByModelPlanID(logger, modelPlanID)
	return result, err
}
