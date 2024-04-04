package resolvers

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// HumanizedAuditChangeCollectionGetByModelPlanID returns all HumanizedAuditChange for a given model plan id
func HumanizedAuditChangeCollectionGetByModelPlanID(np sqlutils.NamedPreparer, modelPlanID uuid.UUID) ([]*models.TranslatedAuditChange, error) {
	humanizedChangeCollection, err := storage.TranslatedAuditChangeCollectionGetByModelPlanID(np, modelPlanID)
	if err != nil {
		return nil, err
	}

	for _, change := range humanizedChangeCollection {
		err2 := change.ParseMetaData()

		if err2 != nil {
			return nil, fmt.Errorf("issue parsing raw meta data for humanized change %s. Error : %w", change.ID, err2)
		}

	}

	return humanizedChangeCollection, err

}
