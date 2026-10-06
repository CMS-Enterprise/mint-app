package translatedaudit

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

func getWaiverNameForAudit(store *storage.Store, audit *models.AuditChangeWithModelPlanID) (string, error) {
	if audit.TableName != models.TNWaiver || !hasWaiverSelectionField(audit.Fields) {
		return "", nil
	}
	if store == nil {
		return "", fmt.Errorf("the store was nil, but is required to resolve a waiver name")
	}

	waiver, err := storage.WaiverGetByID(store, nil, audit.PrimaryKey)
	if err != nil {
		return "", fmt.Errorf("unable to load waiver %s: %w", audit.PrimaryKey, err)
	}

	commonWaivers, err := storage.CommonWaiverGetByIDLoader(store, nil, []uuid.UUID{waiver.CommonWaiverID})
	if err != nil {
		return "", fmt.Errorf("unable to load common waiver %s: %w", waiver.CommonWaiverID, err)
	}
	if len(commonWaivers) == 0 || commonWaivers[0] == nil {
		return "", fmt.Errorf("common waiver %s was not found", waiver.CommonWaiverID)
	}

	return commonWaivers[0].Name, nil
}

func hasWaiverSelectionField(fields models.AuditFields) bool {
	_, hasSelection := fields["will_use_waiver"]
	return hasSelection
}
