package resolvers

import (
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/accesscontrol"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// BaseStructPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
// It modifies the base struct object bs that is passed to it.
func BaseStructPreUpdate(logger *zap.Logger, bs models.IBaseStruct, changes map[string]interface{}, principal authentication.Principal, store *storage.Store, applyChanges bool, checkAccess bool) error {
	//Future Enhancement: Update this to take a named preparer instead of a store
	err := bs.SetModifiedBy(principal)
	if err != nil {
		return err
	}

	if checkAccess {
		err := accesscontrol.ErrorIfNotCollaborator(bs, logger, principal, store)
		if err != nil {
			return err
		}
	}

	if applyChanges {

		err := ApplyChanges(changes, bs)
		if err != nil {
			return err
		}
	}

	return nil

}

// BaseStructPreCreate is called before an object is created to make sure the user has permissions to do so
func BaseStructPreCreate(logger *zap.Logger, bs models.IBaseStruct, principal authentication.Principal, store *storage.Store, checkAccess bool) error {
	if checkAccess {
		err := accesscontrol.ErrorIfNotCollaborator(bs, logger, principal, store)
		if err != nil {
			return err
		}
	}
	return nil
}

// BaseStructPreDelete is called before an object is deleted to make sure the user has permissions to do so
func BaseStructPreDelete(logger *zap.Logger, bs models.IBaseStruct, principal authentication.Principal, store *storage.Store, checkAccess bool) error {
	if checkAccess {
		err := accesscontrol.ErrorIfNotCollaborator(bs, logger, principal, store)
		if err != nil {
			return err
		}
	}
	return nil
}
