package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/accesscontrol"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// TranslatedAuditCollectionGetByModelPlanID returns all TranslatedAudit for a given model plan id
func TranslatedAuditCollectionGetByModelPlanID(ctx context.Context, store *storage.Store, logger *zap.Logger, principal authentication.Principal, modelPlanID uuid.UUID) ([]*models.TranslatedAudit, error) {

	hasPrivilegedAccess, err := accesscontrol.IsCollaboratorModelPlanID(logger, principal, store, modelPlanID)
	if err != nil {
		return nil, fmt.Errorf("unable to determine appropriate access level to view audit collection. err %w", err)
		//If desired, we could just return the non-privileged version on error there
	}

	translatedAuditCollection, err := storage.TranslatedAuditCollectionGetByModelPlanID(store, modelPlanID, hasPrivilegedAccess)
	if err != nil {
		return nil, err
	}

	for _, change := range translatedAuditCollection {
		err2 := change.ParseMetaData()

		if err2 != nil {
			return nil, fmt.Errorf("issue parsing raw meta data for translated audit %s. Error : %w", change.ID, err2)
		}

	}

	return translatedAuditCollection, err

}
