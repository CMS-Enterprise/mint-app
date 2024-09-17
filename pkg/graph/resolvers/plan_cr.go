package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// PlanCRCreate creates a new plan_cr_tdl record in the database
func PlanCRCreate(logger *zap.Logger, input *model.PlanCRCreateInput, principal authentication.Principal, store *storage.Store) (*models.PlanCR, error) {

	planCR := models.NewPlanCR(principal.Account().ID, input.ModelPlanID)
	planCR.IDNumber = input.IDNumber
	planCR.DateInitiated = &input.DateInitiated
	planCR.DateImplemented = &input.DateImplemented
	planCR.Title = input.Title
	planCR.Note = input.Note

	err := BaseStructPreCreate(logger, planCR, principal, store, true)
	if err != nil {
		return nil, err
	}

	return store.PlanCRCreate(logger, planCR)
}

// PlanCRUpdate updates a plan_cr_tdl record in the database
func PlanCRUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.PlanCR, error) {
	// Get PlanCrTdl
	existingPlanCR, err := store.PlanCRGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existingPlanCR, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	result, err := store.PlanCRUpdate(logger, existingPlanCR)
	return result, err
}

// PlanCRDelete deletes a plan cr_tdl record in the database
func PlanCRDelete(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*models.PlanCR, error) {

	existingPlanCR, err := store.PlanCRGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreDelete(logger, existingPlanCR, principal, store, true)
	if err != nil {
		return nil, err
	}

	return store.PlanCRDelete(logger, id, principal.Account().ID)
}

// PlanCRGet returns a plan_cr_tdl record in the database
func PlanCRGet(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanCR, error) {
	result, err := store.PlanCRGetByID(logger, id)
	return result, err
}

// PlanCRsGetByModelPlanID returns plan_cr_tdl records related to a model plan
func PlanCRsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanCR, error) {
	result, err := store.PlanCRsGetByModelPlanID(logger, modelPlanID)
	return result, err
}
