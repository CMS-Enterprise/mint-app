package resolvers

import (
	"context"

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

	return translatedAuditFieldCollection, err

}
