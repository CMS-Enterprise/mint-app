package resolvers

import (
	"fmt"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// BaseStructPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func BaseStructPreUpdate(logger *zap.Logger, bs models.IBaseStruct, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) error {
	section := bs.GetBaseStruct()

	modified := principal.ID()

	section.ModifiedBy = &modified

	modelPlanRelation := bs.(models.IModelPlanRelation)
	if modelPlanRelation != nil {
		isCollaborator, err := IsCollaborator(logger, principal, store, modelPlanRelation.GetModelPlanID())
		if err != nil {
			return err
		}
		if !isCollaborator {
			return fmt.Errorf("user is not a collaborator") //TODO better error here please.
		}
	}

	err := ApplyChanges(changes, bs)
	if err != nil {
		return err
	}

	return nil

}
