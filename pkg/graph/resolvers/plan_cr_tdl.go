package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// PlanCrTdlCreate creates a new plan_cr_tdl record in the database
func PlanCrTdlCreate(logger *zap.Logger, input *model.PlanCrTdlCreateInput, principal authentication.Principal, store *storage.Store) (*models.PlanCrTdl, error) {

	planCrTdl := models.NewPlanCrTdl(principal.Account().ID, input.ModelPlanID)
	planCrTdl.IDNumber = input.IDNumber
	planCrTdl.DateInitiated = &input.DateInitiated
	planCrTdl.Title = input.Title
	planCrTdl.Note = input.Note

	err := BaseStructPreCreate(logger, planCrTdl, principal, store, true)
	if err != nil {
		return nil, err
	}

	return store.PlanCrTdlCreate(logger, planCrTdl)
}

// PlanCrTdlUpdate updates a plan_cr_tdl record in the database
func PlanCrTdlUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.PlanCrTdl, error) {
	// Get PlanCrTdl
	existingPlanCrTdl, err := store.PlanCrTdlGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existingPlanCrTdl, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	result, err := store.PlanCrTdlUpdate(logger, existingPlanCrTdl)
	return result, err

}

// PlanCrTdlDelete deletes a plan cr_tdl record in the database
func PlanCrTdlDelete(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*models.PlanCrTdl, error) {

	existingPlanCrTdl, err := store.PlanCrTdlGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreDelete(logger, existingPlanCrTdl, principal, store, true)
	if err != nil {
		return nil, err
	}

	return store.PlanCrTdlDelete(logger, id, principal.Account().ID)

}

// PlanCrTdlGet returns a plan_cr_tdl record in the database
func PlanCrTdlGet(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanCrTdl, error) {
	result, err := store.PlanCrTdlGetByID(logger, id)
	return result, err
}

// PlanCrTdlsGetByModelPlanID returns plan_cr_tdl records related to a model plan
func PlanCrTdlsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanCrTdl, error) {
	result, err := store.PlanCrTdlsGetByModelPlanID(logger, modelPlanID)
	return result, err
}
