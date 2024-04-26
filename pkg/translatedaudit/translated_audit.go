// Package humanizedaudit translates audit delta slices to human readable changes
package translatedaudit

import (
	"context"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/mappings"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// TranslateAudit translates a single audit to a translated audit and stores it in the translated audit table in the database.
func TranslateAudit(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	auditID int) (*models.TranslatedAuditWithTranslatedFields, error) {

	//Changes: (Job) Implement this to translate a single audit, we also need to figure out what model plan this is based on the audit id

	/*
		1. Get Audit (with ModelPlanID?)
		2. Run the Translation Job
		3. Save
		4. Should we delete the processing job here? Or elsewhere? Should the id actually be the id of the processing entry? That way we can save it and update here?

	*/

	return nil, nil
}

// TranslateAuditsForModelPlan gets all changes for a model plan and related sections in a time period,
// It groups the changes by actor, and a debounced time period. It will then save this record to the database
func TranslateAuditsForModelPlan(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	timeStart time.Time,
	timeEnd time.Time,
	modelPlanID uuid.UUID) ([]*models.TranslatedAuditWithTranslatedFields, error) {

	plan, err := store.ModelPlanGetByID(store, logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	audits, err := storage.AuditChangeCollectionGetByModelPlanIDandTimeRange(store, logger, plan.ID, timeStart, timeEnd)
	if err != nil {
		return nil, err
	}
	translatedChanges, err := translateChangeSet(ctx, store, plan, audits)
	if err != nil {
		return nil, fmt.Errorf("issue analyzing model plan change set for time start %s to time end %s. Error : %w", timeStart, timeEnd, err)
	}

	retTranslatedChanges, err := saveTranslatedAuditAndFields(store, translatedChanges)
	if err != nil {
		return nil, fmt.Errorf("issue saving model plan change set for time start %s to time end %s. Error : %w", timeStart, timeEnd, err)
	}

	// retTranslatedChanges, err := storage.TranslatedAuditChangeCreateCollection(store, translatedChanges)

	return retTranslatedChanges, err

}

// translateChangeSet trans
func translateChangeSet(
	ctx context.Context,
	store *storage.Store,
	plan *models.ModelPlan,
	audits []*models.AuditChange,
) ([]*models.TranslatedAuditWithTranslatedFields, error) {

	// Group audits by tables
	groupedAudits := lo.GroupBy[*models.AuditChange, string](audits, func(m *models.AuditChange) string {
		return m.TableName
	})
	planAudits := groupedAudits["model_plan"]
	partsProvidersAudits := groupedAudits["plan_participants_and_providers"]
	basicsAudits := groupedAudits["plan_basics"]
	paymentsAudits := groupedAudits["plan_payments"]
	opsEvalAndLearningAudits := groupedAudits["plan_ops_eval_and_learning"]
	generalCharacteristicsAudits := groupedAudits["plan_general_characteristics"]
	collaboratorAudits := groupedAudits["plan_collaborator"]
	beneficiariesAudits := groupedAudits["plan_beneficiaries"]

	// Translate all audits
	planChangesTranslated, err := genericAuditTranslation(ctx, store, plan, planAudits)
	if err != nil {
		return nil, err
	}
	partsAndProviderChangesTranslated, err := genericAuditTranslation(ctx, store, plan, partsProvidersAudits)
	if err != nil {
		return nil, err
	}
	basicsChangesTranslated, err := genericAuditTranslation(ctx, store, plan, basicsAudits)
	if err != nil {
		return nil, err
	}
	paymentsChangesTranslated, err := genericAuditTranslation(ctx, store, plan, paymentsAudits)
	if err != nil {
		return nil, err
	}
	opsEvalAndLearningChangesTranslated, err := genericAuditTranslation(ctx, store, plan, opsEvalAndLearningAudits)
	if err != nil {
		return nil, err
	}
	generalCharacteristicsChangesTranslated, err := genericAuditTranslation(ctx, store, plan, generalCharacteristicsAudits)
	if err != nil {
		return nil, err
	}
	collaboratorChangesTranslated, err := genericAuditTranslation(ctx, store, plan, collaboratorAudits)
	if err != nil {
		return nil, err
	}
	beneficiariesChangesTranslated, err := genericAuditTranslation(ctx, store, plan, beneficiariesAudits)
	if err != nil {
		return nil, err
	}

	// Combine all translated changes
	combinedChanges := append(planChangesTranslated, basicsChangesTranslated...)
	combinedChanges = append(combinedChanges, partsAndProviderChangesTranslated...)
	combinedChanges = append(combinedChanges, paymentsChangesTranslated...)
	combinedChanges = append(combinedChanges, opsEvalAndLearningChangesTranslated...)
	combinedChanges = append(combinedChanges, generalCharacteristicsChangesTranslated...)
	combinedChanges = append(combinedChanges, collaboratorChangesTranslated...)
	combinedChanges = append(combinedChanges, beneficiariesChangesTranslated...)

	return combinedChanges, nil

}

// genericAuditTranslation provides an entry point to translate every audit change generically
func genericAuditTranslation(ctx context.Context, store *storage.Store, plan *models.ModelPlan, audits []*models.AuditChange) ([]*models.TranslatedAuditWithTranslatedFields, error) {

	if len(audits) == 0 {
		return nil, nil
	}
	// model PL
	changes := []*models.TranslatedAuditWithTranslatedFields{}
	// Changes: (Serialization) Think about grouping all the changes first so we don't actually have to parse this each time.
	audit := audits[0]
	trans, err := mappings.GetTranslation(audit.TableName)
	if err != nil {
		return nil, fmt.Errorf("unable to get translation for %s , err : %w", audit.TableName, err)
	}
	translationMap, err := trans.ToMap() // Changes: (Translations)  Maybe make this return the map from the library?
	if err != nil {
		return nil, fmt.Errorf("unable to convert translation for %s to a map, err : %w", trans.TableName(), err)
	}
	for _, audit := range audits {

		actorAccount, err := audit.ModifiedByUserAccount(ctx)
		if err != nil {
			fmt.Printf("issue getting actor for audit  (%d) for plan %s, while attempting humanization ", audit.ID, plan.ModelName)
			continue
		}
		operation, isValidOperation := GetDatabaseOperation(audit.Action)
		if !isValidOperation {
			fmt.Printf("issue converting operation to valid DB operation for audit  (%d) for plan %s, while attempting humanization. Provided value was %s ", audit.ID, plan.ModelName, audit.Action)
		}
		translatedAudit := models.TranslatedAuditWithTranslatedFields{
			TranslatedFields: []*models.TranslatedAuditField{},
		}
		change := models.NewTranslatedAuditChange( //  Changes: (Translations)  extract this logic to another function
			constants.GetSystemAccountUUID(),
			audit.ModifiedBy,
			actorAccount.CommonName,
			plan.ID,
			plan.ModelName,
			audit.ModifiedDts,
			audit.TableName,
			audit.TableID,
			audit.ID,
			audit.PrimaryKey,
			operation,
		)
		translatedAudit.TranslatedAudit = change

		for fieldName, field := range audit.Fields {
			//  Changes: (Translations) consider removing plan from the function
			transField, err := translateField(fieldName, field, audit, actorAccount, operation, plan, translationMap)
			if err != nil {
				fmt.Printf("issue translating field (%s) for plan %s ", fieldName, plan.ModelName)
				continue
			}
			translatedAudit.TranslatedFields = append(translatedAudit.TranslatedFields, transField)

		}
		changes = append(changes, &translatedAudit) // append the whole audit

	}

	return changes, nil
}

func translateField(fieldName string, field models.AuditField, audit *models.AuditChange, actorAccount *authentication.UserAccount, operation models.DatabaseOperation, modelPlan *models.ModelPlan, translationMap map[string]models.ITranslationField) (*models.TranslatedAuditField, error) {

	// Set default values in case of missing translation
	// Changes: (Translations) We should handle a nil / empty case what should we do in that case?
	translatedLabel := fieldName
	var referencesLabel *string
	old := field.Old
	new := field.New
	translatedOld := old
	translatedNew := new
	changeType := getChangeType(old, new)
	var formType *models.TranslationFormType
	var dataType *models.TranslationDataType
	var conditionals *pq.StringArray
	var questionType *models.TranslationQuestionType
	// Changes: (Translations) We need to distinguish if the answer is for an other / note field. The label in that case is really the parent's label or the specific text for that type.

	// Changes: (Translations) Handle if the change made a question not necessary // Changes: (Structure) How should we structure this? Field MetaData? Or base level implementation information?

	translationInterface := translationMap[fieldName]
	if translationInterface != nil {

		translatedLabel = translationInterface.GetLabel()
		referencesLabel = translationInterface.GetReferencesLabel(translationMap)
		//Changes: (Translations) update this to handle if notes, or preferences.

		tForm := translationInterface.GetFormType()
		tData := translationInterface.GetDataType()
		formType = &tForm
		dataType = &tData
		questionType = translationInterface.GetQuestionType()

		if tData == models.TDTBoolean { // clean t or f to true or false
			old = sanitizeAuditBoolValue(old)
			new = sanitizeAuditBoolValue(new)

		}

		//Changes: (Translations) refactor this
		oldStr, oldIsString := old.(string)
		if oldIsString {
			oldSlice, oldIsSlice := isArray(oldStr)
			if oldIsSlice {
				old = oldSlice
			} else {
				old = oldStr
			}
		}
		newStr, newIsString := new.(string)
		if newIsString {
			newSlice, newIsSlice := isArray(newStr)
			if newIsSlice {
				new = newSlice
			} else {
				new = newStr
			}
		}

		options, hasOptions := translationInterface.GetOptions()
		if hasOptions {
			translatedOld = translateValue(old, options)
			translatedNew = translateValue(new, options)
		} else {
			translatedOld = old
			translatedNew = new
		}

		children, hasChildren := translationInterface.GetChildren()
		if hasChildren {
			conditionals = checkChildConditionals(old, new, children)
		}
	}
	translatedField := models.NewTranslatedAuditField(constants.GetSystemAccountUUID(),
		fieldName,
		translatedLabel,
		old,
		translatedOld,
		new,
		translatedNew,
		dataType,
		formType,
	)
	translatedField.ChangeType = changeType
	translatedField.NotApplicableQuestions = conditionals
	translatedField.QuestionType = questionType
	translatedField.ReferenceLabel = referencesLabel

	// change.MetaDataRaw = nil //Changes: (Meta) This should be specific to the type of change...

	return &translatedField, nil

}

// getChangeType interprets the change that happened on a field to characterize it as an AuditFieldChangeType
func getChangeType(old interface{}, new interface{}) models.AuditFieldChangeType {
	//Changes: (Meta) Revisit this, make sure we handle all cases. Can this every be called for a field that has no answer? What about on insert? Or do we only have answer on insert if non-null?
	// return models.AFCAnswered

	if new == nil || new == "{}" {
		if old == nil || old == "{}" {
			//Changes: (Meta) Revisit this, is this possible?
			return ""
		}
		return models.AFCRemoved
	}
	if old == nil || old == "{}" {
		return models.AFCAnswered
	}
	return models.AFCUpdated
}

func translateStrSlice(strSlice []string, options map[string]interface{}) pq.StringArray {
	// Changes: (Translations) Determine if we can serialize a generic interface? it makes a weird artifact in the GQL
	//   "{\"Mandatory national\",\"Other\"}",
	transArray := pq.StringArray{}
	for _, str := range strSlice {
		translated := translateValueSingle(str, options)
		transArray = append(transArray, translated)
	}

	return transArray
	// Changes: (Translations) revisit this, even using generic array results in escape characters in GQL...
	// genArray := pq.GenericArray{transArray}

}

// translateValue takes a given value and maps it to a human readable value.
// It checks in the value is an array, and if so it translates each value to a human readable form
func translateValue(value interface{}, options map[string]interface{}) interface{} {

	if value == nil {
		return nil
	}
	// Changes: (Translations) Check if value is nil, don't need to translate that.
	// Changes: (Translations) work on bool representation, they should come through here as a string, but show up as t, f. We will want to set they values
	// strSlice, isSlice := value.([]string)
	str, isString := value.(string)

	// strSlice, isSlice := isArray(str)
	strSlice, isSlice := value.(pq.StringArray)

	if isSlice {
		transArray := translateStrSlice(strSlice, options)
		return transArray
	}
	// str, isString := value.(string)
	if isString {
		// Changes: (Translations) Revisit this issue here, we need the value to be stringified properly. Or provide a column type that is string or string array

		return translateValueSingle(str, options)
	}
	// Changes: (Translations)  Should we handle the case where we can't translate it more?
	return value

}

// translateValueSingle translates a single audit value to a human readable string value
func translateValueSingle(value string, options map[string]interface{}) string {
	translated, ok := options[value]
	if ok {
		return fmt.Sprint(translated) // Translations are always string representations
	}
	// Changes: (Translations)  If the map doesn't have a value, return the raw value instead.
	return value

}

// isArray checks if a String begins with { and ends with }. If so, it is an array
func isArray(str string) (pq.StringArray, bool) {
	// Define a regular expression to match the array format
	arrayRegex := regexp.MustCompile(`^\{.*\}$`)

	// Check if the string matches the array format
	isArray := arrayRegex.MatchString(str)
	if !isArray {
		return nil, false
	}

	return extractArrayValues(str), true

}

// extractArrayValues extracts array values from a string representation
// Changes: (Translations)  Verify the extraction, perhaps we can combine with earlier function?
func extractArrayValues(str string) pq.StringArray {
	// Define a regular expression to match the array format
	arrayRegex := regexp.MustCompile(`\{(.+?)\}`)

	// Find submatches (values within curly braces)
	matches := arrayRegex.FindStringSubmatch(str)
	if len(matches) < 2 {
		// No matches found or no values inside curly braces
		return nil
	}

	// Split the matched values by comma to get individual values
	values := strings.Split(matches[1], ",")
	for i, value := range values {
		// Trim whitespace from each value
		values[i] = strings.TrimSpace(value)
	}

	return values
}

// saveTranslatedAuditAndFields is a helper method to save a change with it's related fields at the same time
func saveTranslatedAuditAndFields(tp sqlutils.TransactionPreparer, translatedAudits []*models.TranslatedAuditWithTranslatedFields) ([]*models.TranslatedAuditWithTranslatedFields, error) {

	retTranslatedAuditsWithFields := []*models.TranslatedAuditWithTranslatedFields{}

	// Changes: (Serialization) Figure out how we want to error. Should each change and field be it's own transaction? That way if it fails, we still save other  changes? That's probably best
	for _, translatedAudit := range translatedAudits {

		retTranslated, err := sqlutils.WithTransaction[models.TranslatedAuditWithTranslatedFields](tp, func(tx *sqlx.Tx) (*models.TranslatedAuditWithTranslatedFields, error) {

			change, err := storage.TranslatedAuditCreate(tx, &translatedAudit.TranslatedAudit)
			if err != nil {
				return nil, err
			}
			if change == nil {
				return nil, fmt.Errorf("translated change not created as expected.Err: %w", err)
			}
			retTranslated := models.TranslatedAuditWithTranslatedFields{
				TranslatedAudit: *change,
			}

			for _, translatedAuditField := range translatedAudit.TranslatedFields {
				// Changes: (Serialization) Combine this with the storage message loop
				translatedAuditField.TranslatedAuditID = retTranslated.ID
			}

			retTranslatedFields, err := storage.TranslatedAuditFieldCreateCollection(tx, translatedAudit.TranslatedFields)
			if err != nil {
				return nil, fmt.Errorf("translated change fields not created as expected. Err: %w", err)
			}

			retTranslated.TranslatedFields = retTranslatedFields
			return &retTranslated, nil

		})
		if err != nil {
			return nil, err
			// Changes: (Serialization)  Figure out, if one audit fails translation, should the whole job fail? Or should we just fail
		}

		retTranslatedAuditsWithFields = append(retTranslatedAuditsWithFields, retTranslated)

	}
	return retTranslatedAuditsWithFields, nil
}

// sanitizeAuditBoolValue sanitizes raw audit data and does some preliminary translation data, ex translating a t or f character to true or false
func sanitizeAuditBoolValue(value interface{}) interface{} {
	if value == "t" {
		return "true"
	}
	if value == "f" {
		return "false"
	}
	return value

}
