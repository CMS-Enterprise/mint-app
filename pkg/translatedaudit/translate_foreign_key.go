package translatedaudit

import (
	"context"
	"fmt"
	"strconv"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//Changes: (fk) Should this be moved into it's own package?
//Changes: (fk) if we have time to allow workers to take a dataloader, these function calls will be more efficient

func translateForeignKey(ctx context.Context, store *storage.Store, value interface{}, tableReference models.TableName) (interface{}, error) {
	if value == nil {
		return nil, nil
	}
	if store == nil {
		return nil, fmt.Errorf("the store was nil, but is required to translate foreign key fields ")
	}

	switch tableReference {
	case models.TNUserAccount:
		{
			return getUserAccountForeignKeyTranslation(store, value)
		}
	case models.TNOperationalSolution:
		{
			return getOperationalSolutionForeignKeyReference(ctx, store, value)
		}
	case models.TNPlanDocument:
		{
			return getPlanDocumentForeignKeyReference(ctx, store, value)
		}
	case models.TNModelPlan:
		{
			return getModelPlanForeignKeyReference(ctx, store, value)
		}
	case models.TNExistingModel:
		{
			return getExistingModelForeignKeyReference(ctx, store, value)
		}
	default:
		return nil, fmt.Errorf("there is no configured method to return the table reference for %s", tableReference)
	}
}

func getUserAccountForeignKeyTranslation(store *storage.Store, key interface{}) (string, error) {
	// cast interface to UUID
	uuidKey, err := parseInterfaceToUUID(key)
	if err != nil {
		return "", fmt.Errorf("unable to convert the provided key to a UUID to get the user account reference. err %w", err)
	}

	// get the account
	account, err := storage.UserAccountGetByID(store, uuidKey)
	if err != nil {
		return "", fmt.Errorf("there was an issue translating the user account foreign key reference. err %w", err)
	}
	// can update the translation as needed.
	return account.CommonName, nil

}

// parseInterfaceToUUID is a utility value to try and cast an interface to a UUID
// it first attempts to parse the value directly to a UUID, and then while try to parse a string to UUID
// If neither is possible, it will return uuid.Nil and an error
func parseInterfaceToUUID(val interface{}) (uuid.UUID, error) {
	uuidKey, isUUID := val.(uuid.UUID)
	if isUUID {
		return uuidKey, nil
	}

	stringKey, isString := val.(string)
	if isString {
		// Changes: (fk) Should we validate the id of the key? parse only tries to parse, it doesn't actually validate the string
		parsedUUID, err := uuid.Parse(stringKey)
		if err != nil {
			return uuid.Nil, fmt.Errorf("unable to parse string to UUID. err %w", err)
		}
		return parsedUUID, nil
	}

	return uuid.Nil, fmt.Errorf("there was an issue casting the provided value (%v) to UUID. It is of type %T", val, val)

}

// parseInterfaceToInt is a utility value to try and cast an interface to an int
// it first attempts to parse the value directly to a int, and then while try to parse a string to int
// If neither is possible, it will return -1 and an error
func parseInterfaceToInt(val interface{}) (int, error) {
	intKey, isInt := val.(int)
	if isInt {
		return intKey, nil
	}

	stringKey, isString := val.(string)
	if isString {
		parsedInt, err := strconv.Atoi(stringKey)
		if err != nil {
			return -1, fmt.Errorf("unable to parse string to Int. err %w", err)
		}
		return parsedInt, nil
	}

	return -1, fmt.Errorf("there was an issue casting the provided value (%v) to Int. It is of type %T", val, val)

}

// getOperationalSolutionForeignKeyReference returns a translation for an operational solution foreign key reference
func getOperationalSolutionForeignKeyReference(ctx context.Context, store *storage.Store, key interface{}) (string, error) {
	// cast interface to UUID
	uuidKey, err := parseInterfaceToUUID(key)
	if err != nil {
		return "", fmt.Errorf("unable to convert the provided key to a UUID to get the operational solution reference. err %w", err)
	}
	logger := appcontext.ZLogger(ctx)

	// get the solution
	solution, err := store.OperationalSolutionGetByID(logger, uuidKey)
	if err != nil {
		return "", fmt.Errorf("there was an issue translating the operational solution foreign key reference. err %w", err)
	}

	if solution == nil {
		return "", fmt.Errorf("the solution for %s was not returned for this foreign key translation", uuidKey)
	}

	// Changes: (Translations) What should we return? Probably solution name, figure out what to return here
	// can update the translation as needed.
	if solution.Name != nil {
		return *solution.Name, nil
	}

	if solution.NameOther != nil {
		return *solution.NameOther, nil
	}
	return solution.ID.String(), nil
}

func getPlanDocumentForeignKeyReference(ctx context.Context, store *storage.Store, key interface{}) (*string, error) {
	// cast interface to UUID
	uuidKey, err := parseInterfaceToUUID(key)
	if err != nil {
		return nil, fmt.Errorf("unable to convert the provided key to a UUID to get the plan document reference. err %w", err)
	}
	logger := appcontext.ZLogger(ctx)

	// get the document
	document, err := storage.PlanDocumentGetByIDNoS3Check(store, logger, uuidKey)
	if err != nil {
		//Changes: (fk) revisit this. Documents can be deleted, so should we handle this differently if the record can't be returned? Perhaps return nil, but no error?
		if err.Error() != "sql: no rows in result set" {
			// Expect There To Be Null results, only error for other store errors
			return nil, fmt.Errorf("there was an issue getting the plan document  foreign key reference . err %w", err)
		}
	}

	if document == nil {
		// a document can be deleted and then translated, in that case, don't translate the value, but don't fail
		return nil, nil
	}

	//Changes: (fk) Revisit this, do we need to return something besides FileName? Perhaps a link? Name is probably good, but verify

	return &document.FileName, nil
}
func getModelPlanForeignKeyReference(ctx context.Context, store *storage.Store, key interface{}) (string, error) {
	// cast interface to UUID
	uuidKey, err := parseInterfaceToUUID(key)
	if err != nil {
		return "", fmt.Errorf("unable to convert the provided key to a UUID to get the model plan reference. err %w", err)
	}
	logger := appcontext.ZLogger(ctx)

	// get the plan
	plan, err := store.ModelPlanGetByID(store, logger, uuidKey)

	if err != nil {
		return "", fmt.Errorf("there was an issue translating the model plan foreign key reference. err %w", err)
	}

	if plan == nil {
		return "", fmt.Errorf("the model plan for %s was not returned for this foreign key translation", uuidKey)
	}

	return plan.ModelName, nil
}

func getExistingModelForeignKeyReference(ctx context.Context, store *storage.Store, key interface{}) (string, error) {
	// cast interface to int
	id, err := parseInterfaceToInt(key)
	if err != nil {
		return "", fmt.Errorf("unable to convert the provided key to a UUID to get the existing model reference. err %w", err)
	}
	logger := appcontext.ZLogger(ctx)

	// get the plan

	existingModel, err := storage.ExistingModelGetByID(store, logger, id)

	if err != nil {
		return "", fmt.Errorf("there was an issue translating the existing model foreign key reference. err %w", err)
	}

	if existingModel == nil {
		return "", fmt.Errorf("the existing model for %v was not returned for this foreign key translation", id)
	}

	return existingModel.ModelName, nil
}
