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

	planCrTdl := models.PlanCrTdl{
		IDNumber:         input.IDNumber,
		DateInitiated:    &input.DateInitiated,
		Title:            input.Title,
		OptionalComments: *input.OptionalComments,
		ModelPlanRelation: models.ModelPlanRelation{
			ModelPlanID: input.ModelPlanID,
		},
		BaseStruct: models.BaseStruct{
			CreatedBy: principal.ID(),
		},
	}

	err := BaseStructPreCreate(logger, &planCrTdl, principal, store, false) //you don't need to be a collaborator to favorite a model plan.
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

	return store.PlanCrTdlDelete(logger, id)

}

// PlanCrTdlGet returns a plan_cr_tdl record in the database
func PlanCrTdlGet(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.PlanCrTdl, error) {

	return store.PlanCrTdlGetByID(logger, id)

}

// PlanCrTdlsGetByModelPlanID returns plan_cr_tdl records related to a model plan
func PlanCrTdlsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.PlanCrTdl, error) {

	return store.PlanCrTdlsGetByModelPlanID(logger, modelPlanID)

}
