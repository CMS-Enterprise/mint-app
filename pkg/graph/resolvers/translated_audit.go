package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/accesscontrol"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// TranslatedAuditGetMostRecentByModelPlanIDAndTableNames returns the most recent TranslatedAudit for a given model plan id and table names
// if one doesn't exist, it will return nil.
// TODO, should we include some filtering to not get changes by the system account? Or just specifically ignore changes for suggestions?
func TranslatedAuditGetMostRecentByModelPlanIDAndTableNames(ctx context.Context, logger *zap.Logger, modelPlanID uuid.UUID, tablesToInclude models.TableNames) (*models.TranslatedAudit, error) {
	return loaders.TranslatedAudit.MostRecentByModelPlanIDAndTableFilters.Load(ctx, storage.MostRecentByModelPlanIDAndTableFilters{})
}

// TranslatedAuditCollectionGetByModelPlanID returns all TranslatedAudit for a given model plan id
// if a user has privileged access, they will see audit changes that are restricted, otherwise only unrestricted
// limit: this controls how many records will be returned at once. A null entry will return all records
// offset: how many records to skip before returning results. If null, no records will be skipped.
func TranslatedAuditCollectionGetByModelPlanID(ctx context.Context, store *storage.Store, logger *zap.Logger, principal authentication.Principal, modelPlanID uuid.UUID, limit *int, offset *int) ([]*models.TranslatedAudit, error) {

	hasPrivilegedAccess, err := accesscontrol.HasPrivilegedDocumentAccessByModelPlanID(logger, principal, store, modelPlanID)
	if err != nil {
		return nil, fmt.Errorf("unable to determine appropriate access level to view audit collection. err %w", err)
		//If desired, we could just return the non-privileged version on error there
	}

	translatedAuditCollection, err := storage.TranslatedAuditCollectionGetByModelPlanID(store, modelPlanID, hasPrivilegedAccess, limit, offset)
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
