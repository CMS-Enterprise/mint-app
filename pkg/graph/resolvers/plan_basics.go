package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/davecgh/go-spew/spew"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/google/uuid"
	"github.com/mitchellh/mapstructure"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

type dateChange struct {
	Old, New *time.Time
}

func getDateFieldsToCheck() []string {
	dateFields := []string{
		"completeICIP",
		"clearanceStarts",
		"clearanceEnds",
		"announced",
		"applicationsStart",
		"applicationsEnd",
		"performancePeriodStarts",
		"performancePeriodEnds",
		"wrapUpEnds",
	}
	return dateFields
}

func getFieldNameMap() map[string]string {
	fieldNames := map[string]string{
		"completeICIP":            "Complete ICIP",
		"clearanceStarts":         "Clearance",
		"clearanceEnds":           "Clearance",
		"announced":               "Announce model",
		"applicationsStart":       "Application period",
		"applicationsEnd":         "Application period",
		"performancePeriodStarts": "Performance period",
		"performancePeriodEnds":   "Performance period",
		"wrapUpEnds":              "Model wrap-up end date",
	}
	return fieldNames
}

func checkDateFieldChanged(
	field string,
	changes map[string]interface{},
	existingMap map[string]interface{},
) (isFieldChanged bool, oldValue *time.Time, newValue *time.Time) {

	newVal, newExists := changes[field]
	oldVal, oldExists := existingMap[field]

	if newExists && newVal != nil {
		fmt.Printf("newVal Type: %T, newVal: %v, newExists: %v\n", newVal, newVal, newExists)
	}

	fmt.Printf("oldVal Type: %T, oldVal: %v, oldExists: %v\n", oldVal, oldVal, oldExists)

	if newExists && oldExists {
		var newTimeVal time.Time
		var err error
		switch v := newVal.(type) {
		case time.Time:
			newTimeVal = v
		case string:
			newTimeVal, err = time.Parse(time.RFC3339, v)
			if err != nil {
				fmt.Println("error parsing newVal:", err)
				return false, nil, nil
			}
		default:
			fmt.Println("newVal is not a recognized type")
			return false, nil, nil
		}

		oldTimeVal, isTypeAssertionOk := oldVal.(*time.Time)
		if !isTypeAssertionOk {
			fmt.Println("oldVal is not a time.Time")
			return false, nil, nil
		}

		if oldTimeVal != nil {
			fmt.Printf("newTimeVal: %v, oldTimeVal: %v\n", newTimeVal, oldTimeVal)
			fmt.Printf("newTimeVal.Equal(oldTimeVal): %v\n", newTimeVal.Equal(*oldTimeVal))
		}

		if oldTimeVal == nil || !newTimeVal.Equal(*oldTimeVal) {
			return true, oldTimeVal, &newTimeVal
		}
	}
	return false, nil, nil
}

// UpdatePlanBasics implements resolver logic to update a plan basics object
func UpdatePlanBasics(
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
) (*models.PlanBasics, error) {
	// Get existing basics
	existing, err := store.PlanBasicsGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	modelPlan, err := store.ModelPlanGetByID(logger, existing.ModelPlanID)
	if err != nil {
		return nil, err
	}

	if emailService != nil &&
		emailTemplateService != nil &&
		addressBook.ModelPlanDateChangedRecipients != nil &&
		len(addressBook.ModelPlanDateChangedRecipients) > 0 {
		// Extract changes and notify
		err = processChangedDates(
			logger,
			existing,
			emailService,
			emailTemplateService,
			addressBook,
			modelPlan,
			changes,
		)
	}

	if err != nil {
		return nil, err
	}

	err = BaseTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	retBasics, err := store.PlanBasicsUpdate(logger, existing)
	return retBasics, err
}

func processChangedDates(
	logger *zap.Logger,
	existing *models.PlanBasics,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	changes map[string]interface{},
) error {

	print("processChangedDates")
	spew.Dump(changes)

	dateChanges, err := ExtractChangedDates(changes, existing)
	if err != nil {
		return err
	}

	if len(dateChanges) == 0 {
		return nil
	}

	print("dateChanges")
	spew.Dump(dateChanges)

	err = sendDateChangedEmails(
		emailService,
		emailTemplateService,
		addressBook,
		modelPlan,
		dateChanges,
	)
	if err != nil {
		logger.Error("Failed to send email notification", zap.Error(err))
	}

	if err != nil {
		return err
	}
	return nil
}

// ExtractChangedDates checks for changed dates and returns them
func ExtractChangedDates(
	changes map[string]interface{},
	existing *models.PlanBasics,
) (map[string]dateChange, error) {
	dateFields := getDateFieldsToCheck()

	print("ExtractChangedDates")

	// Decode the existing object into a map
	var existingMap map[string]interface{}
	decoderConfig := &mapstructure.DecoderConfig{
		Result:           &existingMap,
		TagName:          "json",
		WeaklyTypedInput: true, // To allow time.Time fields to be decoded
	}

	// Create a new decoder with the defined configuration
	decoder, err := mapstructure.NewDecoder(decoderConfig)
	if err != nil {
		return nil, err
	}

	// Use the created decoder to decode the existing struct
	err = decoder.Decode(existing)
	if err != nil {
		return nil, err
	}

	print("Decoded existingMap")
	spew.Dump(existingMap)

	// Map to hold changes
	dateChanges := make(map[string]dateChange)

	// Check each date field for changes
	for _, field := range dateFields {
		print("Check field: ", field, " for changes")
		isFieldChanged, oldValue, newValue := checkDateFieldChanged(
			field,
			changes,
			existingMap,
		)
		print("isFieldChanged: ", isFieldChanged, "\n")
		if oldValue != nil {
			print("oldValue: ", oldValue.String(), "\n")
		} else {
			print("oldValue: nil\n")
		}

		if newValue != nil {
			print("newValue: ", newValue.String(), "\n")
		} else {
			print("newValue: nil\n")
		}

		if err != nil {
			return nil, err
		}

		if isFieldChanged {
			dateChanges[field] = dateChange{
				Old: oldValue,
				New: newValue,
			}
		}
	}

	print("dateChanges")
	spew.Dump(dateChanges)
	return dateChanges, nil
}

func sendDateChangedEmails(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	dateChanges map[string]dateChange,
) error {
	print("sendDateChangedEmails: emailService", emailService, " emailTemplateService", emailTemplateService)
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	fieldNames := getFieldNameMap()

	print("fieldNames")
	spew.Dump(fieldNames)

	// Convert dateChanges map into []email.DateChange slice
	var dateChangeSlice []email.DateChange
	for k, v := range dateChanges {
		dateChange := email.DateChange{
			OldDate: v.Old,
			NewDate: v.New,
		}

		// Map key to human-readable field name
		if name, ok := fieldNames[k]; ok {
			dateChange.Field = name
		} else {
			return fmt.Errorf("unknown date change field: %s", k)
		}

		// Distinguish between date ranges and single dates
		switch k {
		case "clearanceStarts", "applicationsStart", "performancePeriodStarts":
			// This is the start of a date range, so we save it in NewRangeStart and OldRangeStart
			dateChange.NewRangeStart = v.New
			dateChange.OldRangeStart = v.Old
		case "clearanceEnds", "applicationsEnd", "performancePeriodEnds":
			// This is the end of a date range, so we save it in NewRangeEnd and OldRangeEnd
			dateChange.NewRangeEnd = v.New
			dateChange.OldRangeEnd = v.Old
		}
		dateChangeSlice = append(dateChangeSlice, dateChange)
	}

	print("dateChangeSlice")
	spew.Dump(dateChangeSlice)

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.ModelPlanDateChangedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.ModelPlanDateChangedSubjectContent{
		ModelName: modelPlan.ModelName,
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.ModelPlanDateChangedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
		DateChanges:   dateChangeSlice,
	})
	if err != nil {
		return err
	}

	print("emailBody")
	spew.Dump(emailBody)

	print("recipients")
	spew.Dump(addressBook.ModelPlanDateChangedRecipients)

	err = emailService.Send(
		addressBook.DefaultSender,
		addressBook.ModelPlanDateChangedRecipients,
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	if err != nil {
		return err
	}
	return nil
}

// PlanBasicsGetByModelPlanIDLOADER implements resolver logic to get plan basics by a model plan ID using a data loader
func PlanBasicsGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) (*models.PlanBasics, error) {
	allLoaders := loaders.Loaders(ctx)
	basicsLoader := allLoaders.BasicsLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	//TODO do we need to write a new interface to convert our types to what we need?
	thunk := basicsLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.(*models.PlanBasics), nil
}
