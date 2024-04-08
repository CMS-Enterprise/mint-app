package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// TranslatedAuditFieldCreate creates a TranslatedAuditField in the database, using the values passed in the translatedAuditField parameter
func TranslatedAuditFieldCreate(np sqlutils.NamedPreparer, translatedAuditField *models.TranslatedAuditField) (*models.TranslatedAuditField, error) {
	if translatedAuditField.ID == uuid.Nil {
		translatedAuditField.ID = uuid.New()
	}

	// Set the raw data as the MetaData
	translatedAuditField.MetaDataRaw = translatedAuditField.MetaData

	retHumanizedField, procError := sqlutils.GetProcedure[models.TranslatedAuditField](np, sqlqueries.TranslatedAuditField.Create, translatedAuditField)
	if procError != nil {
		return nil, fmt.Errorf("issue creating new TranslatedAuditField object: %w", procError)
	}
	return retHumanizedField, nil
}

// TranslatedAuditFieldCreateCollection creates a TranslatedAuditField in the database, using the values passed in the translatedAuditFields parameter
func TranslatedAuditFieldCreateCollection(np sqlutils.NamedPreparer, translatedAuditFields []*models.TranslatedAuditField) ([]*models.TranslatedAuditField, error) {
	retFields := []*models.TranslatedAuditField{}
	// Ticket (ChChCh Fields!) Make this a separate SQL call to try to insert all records at once instead of iterating through a collection.
	// Note, even in this structure, a transaction is possible

	for _, translatedAuditField := range translatedAuditFields {
		retField, err := TranslatedAuditFieldCreate(np, translatedAuditField)
		if err != nil {
			return nil, fmt.Errorf("issue creating new TranslatedAuditField collection. error: %w", err)
		}
		retFields = append(retFields, retField)
	}

	return retFields, nil
}

// TranslatedAuditFieldCollectionGetByTranslatedAuditID returns all TranslatedAuditFields for a translated audit id
func TranslatedAuditFieldCollectionGetByTranslatedAuditID(np sqlutils.NamedPreparer, translatedAuditID uuid.UUID) ([]*models.TranslatedAuditField, error) {

	arg := map[string]interface{}{"translated_audit_id": translatedAuditID}

	translatedAuditCollection, procErr := sqlutils.SelectProcedure[models.TranslatedAuditField](np, sqlqueries.TranslatedAuditField.CollectionGetByTranslatedAuditID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting translated audit collection by translated_audit_id (%s)  : %w", translatedAuditID, procErr)
	}
	return translatedAuditCollection, nil
}
