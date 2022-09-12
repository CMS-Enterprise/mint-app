package resolvers

import (
	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CrTdlCreate creates a new cr_tdl record in the database
func CrTdlCreate(logger *zap.Logger, input *model.CrTdlCreateInput, principal authentication.Principal, store *storage.Store) (*models.CrTdl, error) {

	crTdl := models.CrTdl{
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

	err := BaseStructPreCreate(logger, &crTdl, principal, store, false) //you don't need to be a collaborator to favorite a model plan.
	if err != nil {
		return nil, err
	}

	return store.CrTdlCreate(logger, crTdl)

}

// CrTdlUpdate updates a cr_tdl record in the database
func CrTdlUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.CrTdl, error) {
	// Get CrTdl
	existingCrTdl, err := store.CrTdlGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existingCrTdl, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	result, err := store.CrTdlUpdate(logger, existingCrTdl)
	return result, err

}

// CrTdlDelete deletes a cr_tdl record in the database
func CrTdlDelete(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*models.CrTdl, error) {

	existingCrTdl, err := store.CrTdlGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreDelete(logger, existingCrTdl, principal, store, true)
	if err != nil {
		return nil, err
	}

	return store.CrTdlDelete(logger, id)

}

// CrTdlGet returns a cr_tdl record in the database
func CrTdlGet(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.CrTdl, error) {

	return store.CrTdlGetByID(logger, id)

}

// CrTdlsGetByModelPlanID returns cr_tdl records related to a model plan
func CrTdlsGetByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID, store *storage.Store) ([]*models.CrTdl, error) {

	return store.CrTdlsGetByModelPlanID(logger, modelPlanID)

}
