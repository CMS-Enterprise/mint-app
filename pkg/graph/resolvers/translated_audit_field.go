package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

// TranslatedAuditFieldCollectionGetByTranslatedAuditID returns all TranslatedAuditChange for a given translated audit id
func TranslatedAuditFieldCollectionGetByTranslatedAuditID(ctx context.Context, translatedAuditID uuid.UUID) ([]*models.TranslatedAuditField, error) {
	translatedAuditFieldCollection, err := loaders.TranslatedAuditFieldCollectionGetByTranslatedAuditID(ctx, translatedAuditID)
	if err != nil {
		return nil, err
	}

	for _, change := range translatedAuditFieldCollection {
		err2 := change.ParseMetaData()
		// Changes: (Serialization) consider calling this in the loader since we already loop in that call?

		if err2 != nil {
			return nil, fmt.Errorf("issue parsing raw meta data for translated change %s. Error : %w", change.ID, err2)
		}

	}

	return translatedAuditFieldCollection, err

}
