package resolvers

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// TranslatedAuditCollectionGetByModelPlanID returns all TranslatedAudit for a given model plan id
func TranslatedAuditCollectionGetByModelPlanID(np sqlutils.NamedPreparer, modelPlanID uuid.UUID) ([]*models.TranslatedAudit, error) {
	translatedAuditCollection, err := storage.TranslatedAuditCollectionGetByModelPlanID(np, modelPlanID)
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
