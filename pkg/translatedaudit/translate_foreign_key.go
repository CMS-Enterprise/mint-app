package translatedaudit

import (
	"context"
	"fmt"
	"strconv"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

//Future Enhancement: allow faktory workers to take a dataloader

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
	// MTO
	case models.TNMTOCategory:
		{
			return getMTOCategoryForeignKeyReference(ctx, store, value)
		}
	case models.TNMTOCommonMilestone:
		{
			return getMTOCommonMilestoneForeignKeyReference(ctx, store, value)
		}
	case models.TNMTOCommonSolution:
		{
			return getMTOCommonSolutionForeignKeyReference(ctx, store, value)
		}
	case models.TNMTOMilestone:
		{
			return getMTOMilestoneForeignKeyReference(ctx, store, value)
		}
	case models.TNMTOSolution:
		{
			return getMTOSolutionForeignKeyReference(ctx, store, value)
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

func parseInterfaceToEnum[E ~string](val interface{}) (E, error) {
	enumKey, isEnum := val.(E)
	if isEnum {
		return enumKey, nil
	}
	stringKey, isString := val.(string)
	if isString {
		return E(stringKey), nil
	}

	return "", fmt.Errorf("there was an issue casting the provided value (%v) to Enum. It is of type %T", val, val)
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

	if solution.Name != nil {
		return *solution.Name, nil
	}

	if solution.NameOther != nil {
		return *solution.NameOther, nil
	}
	return solution.ID.String(), nil
}

func getMTOCategoryForeignKeyReference(ctx context.Context, store *storage.Store, key interface{}) (interface{}, error) {
	// cast interface to UUID
	uuidKey, err := parseInterfaceToUUID(key)
	if err != nil {
		return "", fmt.Errorf("unable to convert the provided key to a UUID to get the mto category reference. err %w", err)
	}

	// get the Category
	// TOOO: (mto) verify this, milestones can be deleted, we probably don't want this to fail if this is the case
	category, err := loaders.MTOCategory.ByID.Load(ctx, uuidKey)
	if err != nil {
		return "", fmt.Errorf("there was an issue translating the mto category foreign key reference. err %w", err)
	}

	if category == nil {
		return "", fmt.Errorf("the category for %s was not returned for this foreign key translation", uuidKey)
	}
	// default to the name of the category
	name := category.Name

	// Check to see if this is a subCategory (has a parent), if so, just return the name of the parent as well
	// ex ParentCategory (subCategory)
	// get the Category
	if category.ParentID != nil {
		parentCategory, err := loaders.MTOCategory.ByID.Load(ctx, *category.ParentID)
		if err != nil {
			return nil, fmt.Errorf("there was an issue getting the parent category for mto category. err %w", err)
		}
		if parentCategory != nil {
			name = parentCategory.Name + " (" + category.Name + ")"
		}
	}
	return name, nil
}
func getMTOCommonMilestoneForeignKeyReference(ctx context.Context, store *storage.Store, key interface{}) (interface{}, error) {
	// cast interface to key
	enumKey, err := parseInterfaceToEnum[models.MTOCommonMilestoneKey](key)
	if err != nil {
		return "", fmt.Errorf("unable to convert the provided key to a MTOCommonMilestoneKey to get the mto common milestone reference. err %w", err)
	}

	// get the common milestone
	commonMilestone, err := loaders.MTOCommonMilestone.ByKey.Load(ctx, enumKey)
	if err != nil {
		return "", fmt.Errorf("there was an issue translating the mto common milestone foreign key reference. err %w", err)
	}

	if commonMilestone == nil {
		return "", fmt.Errorf("the category for %s was not returned for this foreign key translation", enumKey)
	}
	return commonMilestone.Name, nil
}

func getMTOCommonSolutionForeignKeyReference(ctx context.Context, store *storage.Store, key interface{}) (interface{}, error) {
	// cast interface to UUID
	enumKey, err := parseInterfaceToEnum[models.MTOCommonSolutionKey](key)
	if err != nil {
		return "", fmt.Errorf("unable to convert the provided key to a MTOCommonSolutionKey to get the mto common Solution reference. err %w", err)
	}

	// get the common Solution
	commonSolution, err := loaders.MTOCommonSolution.ByKey.Load(ctx, enumKey)
	if err != nil {
		return "", fmt.Errorf("there was an issue translating the mto common Solution foreign key reference. err %w", err)
	}

	if commonSolution == nil {
		return "", fmt.Errorf("the category for %s was not returned for this foreign key translation", enumKey)
	}
	return commonSolution.Name, nil
}
func getMTOMilestoneForeignKeyReference(ctx context.Context, store *storage.Store, key interface{}) (interface{}, error) {
	// cast interface to key
	uuidKey, err := parseInterfaceToUUID(key)
	if err != nil {
		return "", fmt.Errorf("unable to convert the provided key to a uuid to get the mto  milestone reference. err %w", err)
	}

	// get the  milestone
	// TOOO: (mto) verify this, milestones can be deleted, we probably don't want this to fail if this is the case
	milestone, err := loaders.MTOMilestone.ByID.Load(ctx, uuidKey)
	if err != nil {
		return "", fmt.Errorf("there was an issue translating the mto  milestone foreign key reference. err %w", err)
	}

	if milestone == nil {
		return "", fmt.Errorf("the category for %s was not returned for this foreign key translation", uuidKey)
	}
	return milestone.Name, nil
}

func getMTOSolutionForeignKeyReference(ctx context.Context, store *storage.Store, key interface{}) (interface{}, error) {
	// cast interface to UUID
	uuidKey, err := parseInterfaceToUUID(key)
	if err != nil {
		return "", fmt.Errorf("unable to convert the provided key to a uuid to get the mto  Solution reference. err %w", err)
	}
	// get the  solution
	// TOOO: (mto) verify this, milestones can be deleted, we probably don't want this to fail if this is the case
	solution, err := loaders.MTOSolution.ByID.Load(ctx, uuidKey)
	if err != nil {
		return "", fmt.Errorf("there was an issue translating the mto  Solution foreign key reference. err %w", err)
	}

	if solution == nil {
		return "", fmt.Errorf("the category for %s was not returned for this foreign key translation", uuidKey)
	}
	return solution.Name, nil
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
		if err.Error() != "sql: no rows in result set" {
			// Expect There To Be Null results, only error for other store errors
			return nil, fmt.Errorf("there was an issue getting the plan document  foreign key reference . err %w", err)
		}
	}

	if document == nil {
		// a document can be deleted and then translated, in that case, don't translate the value, but don't fail
		return nil, nil
	}

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
