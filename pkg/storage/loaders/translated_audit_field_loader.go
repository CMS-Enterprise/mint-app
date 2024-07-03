package loaders

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/graph-gophers/dataloader"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// These constants represent keys constants used for the translated audit field data loaders
const (
	// DLTranslatedAuditIDKey is the key used to store and retrieve the translated audit id key
	DLTranslatedAuditIDKey string = "translated_audit_id"
)

// translatedAuditFieldCollectionGetByTranslatedAuditIDBatch returns an array of dataLoader results for a given set of keys
// each result will be an array of translatedAuditFields that correspond to a translatedAuditID
func (loaders *DataLoaders) translatedAuditFieldCollectionGetByTranslatedAuditIDBatch(_ context.Context, keys dataloader.Keys) []*dataloader.Result {

	jsonParams, err := CovertToJSONArray(keys)
	if err != nil {
		return createErrorOutput(fmt.Errorf("issue converting keys to json for translatedAuditFieldCollectionGetByTranslatedAuditIDLoader, %w", err), len(keys))
	}

	translatedFields, err := storage.TranslatedAuditFieldCollectionGetByTranslatedAuditIDLoader(loaders.DataReader.Store, jsonParams)
	if err != nil {
		return []*dataloader.Result{{Data: nil, Error: err}}
	}

	translatedFieldsByTranslatedAuditID := map[string][]*models.TranslatedAuditField{}
	for _, field := range translatedFields {
		key := fmt.Sprint(field.TranslatedAuditID)
		slice, ok := translatedFieldsByTranslatedAuditID[key]

		// Future Enhancement: Consider writing a function that will handle the escaped data in a pq string array for multi-select and checkbox.
		// This could look to the functionality already in translatedaudit isArray which returns a pq string array, but would also have to handle the escaping characters
		if ok {
			slice = append(slice, field)
			translatedFieldsByTranslatedAuditID[key] = slice
			continue
		}
		translatedFieldsByTranslatedAuditID[key] = []*models.TranslatedAuditField{field}
	}

	// RETURN IN THE SAME ORDER REQUESTED
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		ck, ok := key.Raw().(KeyArgs)
		if ok {
			resKey := fmt.Sprint(ck.Args[DLTranslatedAuditIDKey])
			contacts := translatedFieldsByTranslatedAuditID[resKey] // If a contact is not found, it will return a zero state result eg empty array.

			output[index] = &dataloader.Result{Data: contacts, Error: nil}

		} else {
			err := fmt.Errorf("could not retrieve key from %s", key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output

}

func TranslatedAuditFieldCollectionGetByTranslatedAuditID(ctx context.Context, translatedAuditID uuid.UUID) ([]*models.TranslatedAuditField, error) {
	allLoaders := Loaders(ctx)
	TranslatedFieldLoader := allLoaders.TranslatedAuditFieldCollectionLoader
	key := NewKeyArgs()
	key.Args[DLTranslatedAuditIDKey] = translatedAuditID

	thunk := TranslatedFieldLoader.Loader.Load(ctx, key)

	result, err := thunk()

	if err != nil {
		return nil, err
	}
	typedReturn, isCastable := result.([]*models.TranslatedAuditField)
	if !isCastable {
		return nil, fmt.Errorf("the dataLoader result is not castable to []*models.TranslatedAuditField, type %T, translatedAuditID %s", result, translatedAuditID)
	}

	return typedReturn, nil

}
