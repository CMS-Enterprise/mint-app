package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/accesscontrol"
	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// TranslatedAuditCollectionGetByModelPlanID returns all TranslatedAudit for a given model plan id
func TranslatedAuditCollectionGetByModelPlanID(ctx context.Context, store *storage.Store, modelPlanID uuid.UUID) ([]*models.TranslatedAudit, error) {
	logger := appcontext.ZLogger(ctx)
	principal := appcontext.Principal(ctx)
	hasPrivilegedAccess, err := accesscontrol.IsCollaboratorModelPlanID(logger, principal, store, modelPlanID)
	if err != nil {
		return nil, fmt.Errorf("unable to determine appropriate access level to view audit collection. err %w", err)
		//If desired, we could just return the non-privileged version on error there
	}

	//Changes: (Confidential) Update this to also do a collaborator check here, if a collaborator return all. Can we make this efficient?
	translatedAuditCollection, err := storage.TranslatedAuditCollectionGetByModelPlanID(store, modelPlanID, hasPrivilegedAccess)
	if err != nil {
		return nil, err
	}
	//Changes: (Meta) Gate the permission for privileged information here based on current users role
	// Changes: (Data) verify that the user is a collaborator or assessment or not. Conditionally return confidential information if so.

	for _, change := range translatedAuditCollection {
		err2 := change.ParseMetaData()

		if err2 != nil {
			return nil, fmt.Errorf("issue parsing raw meta data for translated audit %s. Error : %w", change.ID, err2)
		}

	}

	return translatedAuditCollection, err

}
