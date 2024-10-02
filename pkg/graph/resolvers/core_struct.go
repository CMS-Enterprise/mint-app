package resolvers

import (
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/accesscontrol"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// CoreStructPreUpdate applies incoming changes from to a core TaskList Section, and validates its status
// It modifies the core struct object bs that is passed to it.
func CoreStructPreUpdate(
	logger *zap.Logger,
	cs models.ICoreStruct,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	applyChanges bool,
	checkAccess bool,
) error {
	//Future Enhancement: Update this to take a named preparer instead of a store
	err := cs.SetModifiedBy(principal)
	if err != nil {
		return err
	}

	if checkAccess {
		err := accesscontrol.ErrorIfNotCollaborator(cs, logger, principal, store)
		if err != nil {
			return err
		}
	}

	if applyChanges {

		err := ApplyChanges(changes, cs)
		if err != nil {
			return err
		}
	}

	return nil
}
