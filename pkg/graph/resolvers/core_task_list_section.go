package resolvers

import (
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// CoreTaskListSectionPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func CoreTaskListSectionPreUpdate(
	logger *zap.Logger,
	tls models.ICoreTaskListSection,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
) error {
	err := BaseStructPreUpdate(logger, tls, changes, principal, store, true, true)
	if err != nil {
		return err
	}

	return nil
}
