package resolvers

import (
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// BaseTaskListSectionPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func BaseTaskListSectionPreUpdate(logger *zap.Logger, tls models.IBaseTaskListSection, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) error {
	section := tls.GetBaseTaskListSection()
	oldStatus := section.Status

	err := BaseStructPreUpdate(logger, tls, changes, principal, store, true, true)
	if err != nil {
		return err
	}

	err = tls.CalcStatus(oldStatus)
	if err != nil {
		return err
	}

	return nil

}
