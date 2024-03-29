// Package humanizedaudit translates audit delta slices to human readable changes
package humanizedaudit

import (
	"context"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/mappings"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/constants"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// HumanizeAuditsForModelPlan gets all changes for a model plan and related sections in a time period,
// It groups the changes by actor, and a debounced time period. It will then save this record to the database
func HumanizeAuditsForModelPlan(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	timeStart time.Time,
	timeEnd time.Time,
	modelPlanID uuid.UUID) ([]*models.HumanizedAuditChange, error) {

	plan, err := store.ModelPlanGetByID(store, logger, modelPlanID)
	if err != nil {
		return nil, err
	}

	audits, err := storage.AuditChangeCollectionGetByModelPlanIDandTimeRange(store, logger, plan.ID, timeStart, timeEnd)
	if err != nil {
		return nil, err
	}
	humanizedChanges, err := humanizeChangeSet(ctx, store, plan, audits)
	if err != nil {
		return nil, fmt.Errorf("issue analyzing model plan change set for time start %s to time end %s. Error : %w", timeStart, timeEnd, err)
	}

	retHumanizedChanges, err := storage.HumanizedAuditChangeCreateCollection(store, humanizedChanges)

	return retHumanizedChanges, err

}

// humanizeChangeSet trans
func humanizeChangeSet(
	ctx context.Context,
	store *storage.Store,
	plan *models.ModelPlan,
	audits []*models.AuditChange,
) ([]*models.HumanizedAuditChange, error) {

	planChanges, err := humanizeModelPlanAudits(ctx, store, plan, audits)
	if err != nil {
		return nil, err
	}

	partsProvidersChanges := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_participants_and_providers"
	})

	partsAndProviderChanges, err := genericAuditTranslation(ctx, store, plan, partsProvidersChanges)
	// partsAndProviderChanges, err := humanizeParticipantsAndProviders(ctx, store, plan, audits)
	if err != nil {
		return nil, err
	}
	_ = humanizeParticipantsAndProviders

	combinedChanges := append(planChanges, partsAndProviderChanges...)

	return combinedChanges, nil

}

func humanizeModelPlanAudits(ctx context.Context, store *storage.Store, plan *models.ModelPlan, audits []*models.AuditChange) ([]*models.HumanizedAuditChange, error) {
	// model PL
	changes := []*models.HumanizedAuditChange{}

	modelPlanAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "model_plan"
	})
	for _, modelAudit := range modelPlanAudits {
		actorAccount, err := modelAudit.ModifiedByUserAccount(ctx)
		if err != nil {
			fmt.Printf("issue getting actor for audit  (%d) for plan %s, while attempting humanization ", modelAudit.ID, plan.ModelName)
			continue
		}
		operation, isValidOperation := GetDatabaseOperation(modelAudit.Action)
		if !isValidOperation {
			fmt.Printf("issue converting operation to valid DB operation for audit  (%d) for plan %s, while attempting humanization. Provided value was %s ", modelAudit.ID, plan.ModelName, modelAudit.Action)
		}

		for fieldName, field := range modelAudit.Fields { //fieldName
			change := models.NewHumanizedAuditChange(
				constants.GetSystemAccountUUID(),
				modelAudit.ModifiedBy,
				actorAccount.CommonName,

				plan.ID,
				plan.ModelName,
				modelAudit.ModifiedDts,
				modelAudit.TableName,
				modelAudit.TableID,
				modelAudit.ID,
				modelAudit.PrimaryKey,
				operation,
				fieldName,
				fieldName, //TODO: (ChChCh Changes!) Add Translation
				field.Old,
				field.Old, //TODO: (ChChCh Changes!) Add Translation
				field.New,
				field.New, //TODO: (ChChCh Changes!) Add Translation
			)
			change.MetaDataRaw = field

			changes = append(changes, &change)

		}

	}

	return changes, nil
}

func humanizeParticipantsAndProviders(ctx context.Context, store *storage.Store, plan *models.ModelPlan, audits []*models.AuditChange) ([]*models.HumanizedAuditChange, error) {
	// model PL
	changes := []*models.HumanizedAuditChange{}

	modelPlanAudits := lo.Filter(audits, func(m *models.AuditChange, index int) bool {
		return m.TableName == "plan_participants_and_providers"
	})
	translation, err := mappings.ParticipantsAndProvidersTranslation()
	if err != nil {
		return nil, fmt.Errorf("unable to get translation for Participants and Providers, err : %w", err)
	}
	// translationMap, err := models.StructToMap(translation)
	translationMap, err := models.StructToMapDBTag(*translation) //TODO (ChChCh Changes!) Maybe make this return the map from the library?
	if err != nil {
		return nil, fmt.Errorf("unable to convert translation for Participants and Providers to a map, err : %w", err)
	}
	type partsAndProviderTranslatedField struct { // Ticket: (ChChCh Changes!) This should be expanded and moved. We might need a specific type here either...
		Question string
		Old      interface{}
		New      interface{}
	}
	for _, modelAudit := range modelPlanAudits {
		actorAccount, err := modelAudit.ModifiedByUserAccount(ctx)
		if err != nil {
			fmt.Printf("issue getting actor for audit  (%d) for plan %s, while attempting humanization ", modelAudit.ID, plan.ModelName)
			continue
		}
		operation, isValidOperation := GetDatabaseOperation(modelAudit.Action)
		if !isValidOperation {
			fmt.Printf("issue converting operation to valid DB operation for audit  (%d) for plan %s, while attempting humanization. Provided value was %s ", modelAudit.ID, plan.ModelName, modelAudit.Action)
		}

		for fieldName, field := range modelAudit.Fields {
			fieldInterface := translationMap[fieldName]
			fieldTrans, ok := fieldInterface.(mappings.TranslationFieldProperties)
			if !ok {
				continue
				// Ticket: (ChChCh Changes!) Verify this, there are other field types. We should have helper methods
			}
			translatedField := partsAndProviderTranslatedField{
				Question: fieldTrans.Label,
				Old:      field.Old,
				New:      field.New,
			}
			change := models.NewHumanizedAuditChange(
				constants.GetSystemAccountUUID(),
				modelAudit.ModifiedBy,
				actorAccount.CommonName,
				plan.ID,
				plan.ModelName,
				modelAudit.ModifiedDts,
				modelAudit.TableName,
				modelAudit.TableID,
				modelAudit.ID,
				modelAudit.PrimaryKey,
				operation,
				fieldName,
				fieldTrans.Label, //TODO: (ChChCh Changes!) We should also see about the Read Only Label, it is in context of not answering the question which makes sense here
				field.Old,
				field.Old, //TODO: (ChChCh Changes!) Add Translation
				field.New,
				field.New, //TODO: (ChChCh Changes!) Add Translation
			)
			change.MetaDataRaw = translatedField //Ticket: (ChChCh Changes!) This should actually translate the data

			fmt.Println(fieldName)
			changes = append(changes, &change)

		}

	}

	return changes, nil
}

// genericAuditTranslation provides an entry point to translate every audit change generically
func genericAuditTranslation(ctx context.Context, store *storage.Store, plan *models.ModelPlan, audits []*models.AuditChange) ([]*models.HumanizedAuditChange, error) {

	if len(audits) == 0 {
		return nil, nil
	}
	// model PL
	changes := []*models.HumanizedAuditChange{}
	//Ticket (ChChCh Changes!) Think about grouping all the changes first so we don't actually have to parse this each time.
	audit := audits[0]
	trans, err := mappings.GetTranslation(audit.TableName)
	if err != nil {
		return nil, fmt.Errorf("unable to get translation for %s , err : %w", audit.TableName, err)
	}
	translationMap, err := trans.ToMap() //TODO (ChChCh Changes!) Maybe make this return the map from the library?
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

		for fieldName, field := range audit.Fields {

			change, err := translateField(fieldName, field, audit, actorAccount, operation, plan, translationMap)
			if err != nil {

				fmt.Printf("issue translating field (%s) for plan %s ", fieldName, plan.ModelName)
				continue

			}

			changes = append(changes, change)
		}

	}

	return changes, nil
}

func translateField(fieldName string, field models.AuditField, audit *models.AuditChange, actorAccount *authentication.UserAccount, operation models.DatabaseOperation, modelPlan *models.ModelPlan, translationMap map[string]interface{}) (*models.HumanizedAuditChange, error) {
	var translatedLabel string
	var translatedOld interface{}
	var translatedNew interface{}

	fieldInterface := translationMap[fieldName]
	fieldTransOptions, hasOptions := fieldInterface.(mappings.TranslationFieldPropertiesWithOptions)
	fieldTrans, hasTranslation := fieldInterface.(mappings.TranslationFieldProperties)

	// Ticket: (ChChCh Changes!) Should we handle this better? There are different implementations we have to cast to
	if hasOptions {
		translatedLabel = fieldTransOptions.GetLabel()
		translatedOld = translateValue(field.Old, fieldTransOptions.Options)
		translatedNew = translateValue(field.New, fieldTransOptions.Options)

		// Ticket: (ChChCh Changes!) Verify this, there are other field types. We should have helper methods. This logic flow can be improved as well
	} else if hasTranslation {
		translatedLabel = fieldTrans.GetLabel()
		translatedOld = field.Old
		translatedNew = field.New

	} else {
		translatedLabel = fieldName
		translatedOld = field.Old
		translatedNew = field.New
	}

	change := models.NewHumanizedAuditChange(
		constants.GetSystemAccountUUID(),
		audit.ModifiedBy,
		actorAccount.CommonName,
		modelPlan.ID,
		modelPlan.ModelName,
		audit.ModifiedDts,
		audit.TableName,
		audit.TableID,
		audit.ID,
		audit.PrimaryKey,
		operation,
		fieldName,
		translatedLabel,
		field.Old,
		translatedOld,
		field.New,
		translatedNew,
	)
	// change.MetaDataRaw = nil //Ticket: (ChChCh Changes!) This should be specific to the type of change...

	return &change, nil

}

// translateValue takes a given value and maps it to a human readable value.
// It checks in the value is an array, and if so it translates each value to a human readable form
func translateValue(value interface{}, options map[string]string) interface{} {

	//Ticket: (ChChCh Changes!) Check if value is nil, don't need to translate that.
	//Ticket: (ChChCh Changes!) work on bool representation, they should come through here as a string, but show up as t, f. We will want to set they values
	// strSlice, isSlice := value.([]string)
	str, isString := value.(string)
	if !isString {
		return value
	}

	strSlice, isSlice := isArray(str)

	if isSlice {
		// transArray := []string{}
		transArray := pq.StringArray{}
		for _, str := range strSlice {
			translated := translateValueSingle(str, options)
			transArray = append(transArray, translated)
		}
		return transArray
	}
	// str, isString := value.(string)
	if isString {
		return translateValueSingle(str, options)
	}
	//Ticket: (ChChCh Changes!) Should we handle the case where we can't translate it more?
	return value

}

// translateValueSingle translates a single audit value to a human readable string value
func translateValueSingle(value string, options map[string]string) string {
	translated, ok := options[value]
	if ok {
		return translated
	}
	//Ticket (ChChCh Changes!) If the map doesn't have a value, return the raw value instead.
	return value

}

// isArray checks if a String begins with { and ends with }. If so, it is an array
func isArray(str string) ([]string, bool) {
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
// Ticket (ChChCh Changes!) Verify the extraction, perhaps we can combine with earlier function?
func extractArrayValues(str string) []string {
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
