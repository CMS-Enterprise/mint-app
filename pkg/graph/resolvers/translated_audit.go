package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/accesscontrol"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// TranslatedAuditGetMostRecentByModelPlanIDAndTableNames returns the most recent TranslatedAudit for a given model plan id and table names
// if one doesn't exist, it will return nil.
// Note we specifically exclude privelleged access here so it's consistent for all users
func TranslatedAuditGetMostRecentByModelPlanIDAndTableNames(ctx context.Context, logger *zap.Logger, modelPlanID uuid.UUID, tablesToInclude []models.TableName, excludedFields []string) (*models.TranslatedAudit, error) {

	// Note, if desired in the future, we can check if the user has privileged access here. The data loader has that concept, but leaving as is for consistency
	hasPrivilegedAccess := false

	return loaders.TranslatedAudit.MostRecentByModelPlanIDAndTableFilters.Load(ctx, storage.MostRecentByModelPlanIDAndTableFilters{
		ModelPlanID:    modelPlanID,
		TableNames:     helpers.JoinStringSlice(tablesToInclude, true),
		ExcludedFields: helpers.JoinStringSlice(excludedFields, true),
		IsAdmin:        hasPrivilegedAccess,
	})
}

// TranslatedAuditCollectionGetByModelPlanID returns all TranslatedAudit for a given model plan id
// if a user has privileged access, they will see audit changes that are restricted, otherwise only unrestricted
// limit: this controls how many records will be returned at once. A null entry will return all records
// offset: how many records to skip before returning results. If null, no records will be skipped.
func TranslatedAuditCollectionGetByModelPlanID(ctx context.Context, store *storage.Store, logger *zap.Logger, principal authentication.Principal, modelPlanID uuid.UUID, limit *int, offset *int) ([]*models.TranslatedAudit, error) {
	return TranslatedAuditCollectionGetByModelPlanIDAndTableNames(ctx, store, logger, principal, modelPlanID, nil, limit, offset)
}

// TranslatedAuditCollectionGetByModelPlanIDAndTableNames returns all TranslatedAudit for a given model plan id for the provided table names
// TODO: refactor this to be a data loader, since it is potentially called multiple times
func TranslatedAuditCollectionGetByModelPlanIDAndTableNames(ctx context.Context, store *storage.Store, logger *zap.Logger, principal authentication.Principal, modelPlanID uuid.UUID,
	//TODO refactor this to be a data loader, since it is potentially called multiple times
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
