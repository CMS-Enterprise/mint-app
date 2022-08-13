package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// BaseStructPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func BaseStructPreUpdate(logger *zap.Logger, bs models.IBaseStruct, changes map[string]interface{}, principal authentication.Principal, store *storage.Store, applyChanges bool) error {
	section := bs.GetBaseStruct()

	modified := principal.ID()

	section.ModifiedBy = &modified

	err := ErrorIfNotCollaborator(bs, logger, principal, store)
	if err != nil {
		return err
	}

	// modelPlanRelation, hasModelPlanRelation := bs.(models.IModelPlanRelation)

	// if hasModelPlanRelation {
	// 	isCollaborator, err := IsCollaborator(logger, principal, store, modelPlanRelation.GetModelPlanID())
	// 	if err != nil {
	// 		return err
	// 	}
	// 	if !isCollaborator {
	// 		return fmt.Errorf("user is not a collaborator") //TODO better error here please.
	// 	}
	// }

	if applyChanges {

		err := ApplyChanges(changes, bs)
		if err != nil {
			return err
		}
	}

	return nil

}

//BaseStructPreCreate is called before an object is created to make sure the user has permissions to do so
func BaseStructPreCreate(logger *zap.Logger, bs models.IBaseStruct, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) error {
	err := ErrorIfNotCollaborator(bs, logger, principal, store)
	return err
	// if err != nil {
	// 	return err
	// }

}

//BaseStructPreDelete is called before an object is deleted to make sure the user has permissions to do so
func BaseStructPreDelete(logger *zap.Logger, bs models.IBaseStruct, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) error {
	err := ErrorIfNotCollaborator(bs, logger, principal, store)
	return err
}
