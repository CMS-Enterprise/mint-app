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
)

// TranslatedAuditCollectionGetByModelPlanID returns all TranslatedAudit for a given model plan id
// if a user has privileged access, they will see audit changes that are restricted, otherwise only unrestricted
// limit: this controls how many records will be returned at once. A null entry will return all records
// offset: how many records to skip before returning results. If null, no records will be skipped.
func TranslatedAuditCollectionGetByModelPlanID(ctx context.Context, store *storage.Store, logger *zap.Logger, principal authentication.Principal, modelPlanID uuid.UUID, limit *int, offset *int) ([]*models.TranslatedAudit, error) {
	return TranslatedAuditCollectionGetByModelPlanIDAndTableNames(ctx, store, logger, principal, modelPlanID, nil, limit, offset)
}

func TranslatedAuditCollectionGetByModelPlanIDAndTableNames(ctx context.Context, store *storage.Store, logger *zap.Logger, principal authentication.Principal, modelPlanID uuid.UUID,
	tablesToInclude []models.TableName, limit *int, offset *int) ([]*models.TranslatedAudit, error) {

	hasPrivilegedAccess, err := accesscontrol.HasPrivilegedDocumentAccessByModelPlanID(logger, principal, store, modelPlanID)
	if err != nil {
		return nil, fmt.Errorf("unable to determine appropriate access level to view audit collection. err %w", err)
		//If desired, we could just return the non-privileged version on error there
	}

	translatedAuditCollection, err := storage.TranslatedAuditCollectionGetByModelPlanID(store, modelPlanID, tablesToInclude, hasPrivilegedAccess, limit, offset)
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

// MTOTranslatedAuditsGetByModelPlanID returns audits related to the mto section
func MTOTranslatedAuditsGetByModelPlanID(ctx context.Context, store *storage.Store, logger *zap.Logger, principal authentication.Principal, modelPlanID uuid.UUID, limit *int, offset *int) ([]*models.TranslatedAudit, error) {
	numberOfRecords := 1
	return TranslatedAuditCollectionGetByModelPlanIDAndTableNames(ctx, store, logger, principal, modelPlanID, models.MTOTables, &numberOfRecords, nil)
}
