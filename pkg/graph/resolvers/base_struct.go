package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/accesscontrol"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// BaseStructPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func BaseStructPreUpdate(logger *zap.Logger, bs models.IBaseStruct, changes map[string]interface{}, principal authentication.Principal, store *storage.Store, applyChanges bool) error {
	section := bs.GetBaseStruct()

	modified := principal.ID()

	section.ModifiedBy = &modified

	err := accesscontrol.ErrorIfNotCollaborator(bs, logger, principal, store)
	if err != nil {
		return err
	}

	if applyChanges {

		err := ApplyChanges(changes, bs)
		if err != nil {
			return err
		}
	}

	return nil

}

//BaseStructPreCreate is called before an object is created to make sure the user has permissions to do so
func BaseStructPreCreate(logger *zap.Logger, bs models.IBaseStruct, principal authentication.Principal, store *storage.Store) error {
	err := accesscontrol.ErrorIfNotCollaborator(bs, logger, principal, store)
	return err
}

//BaseStructPreDelete is called before an object is deleted to make sure the user has permissions to do so
func BaseStructPreDelete(logger *zap.Logger, bs models.IBaseStruct, principal authentication.Principal, store *storage.Store) error {
	err := accesscontrol.ErrorIfNotCollaborator(bs, logger, principal, store)
	return err
}
