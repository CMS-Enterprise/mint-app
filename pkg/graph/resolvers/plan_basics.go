package resolvers

import (
	"context"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

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
		len(addressBook.ModelPlanDateChangedRecipients) > 0 {
		go func() {
			err = processChangedDates(
				logger,
				existing,
				emailService,
				emailTemplateService,
				addressBook,
				modelPlan,
				changes,
			)

			if err != nil {
				logger.Error("Error processing changed dates",
					zap.Error(err),
					zap.String("modelPlanID", modelPlan.ID.String()),
				)
			}
		}()
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
	dp, err := NewDateProcessor(changes, existing)
	if err != nil {
		return err
	}

	dateChanges, err := dp.ExtractChangedDates()
	if err != nil {
		return err
	}

	if len(dateChanges) == 0 {
		return nil
	}

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

func sendDateChangedEmails(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	dateChanges map[string]dateChange,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	fieldNames := getFieldNameMap()

	// Convert dateChanges map into []email.DateChange slice
	var dateChangeSlice []email.DateChange

	// Preparing a map to store date ranges separately
	dateRangeMap := make(map[string]*email.DateChange)

	for k, v := range dateChanges {
		// Check if this key is part of a range
		rangeKey := ""
		switch k {
		case "clearanceStarts", "applicationsStart", "performancePeriodStarts":
			rangeKey = "start"
		case "clearanceEnds", "applicationsEnd", "performancePeriodEnds":
			rangeKey = "end"
		}

		if rangeKey != "" {
			// This is part of a range, handle differently
			name := fieldNames[k]
			if dateRangeMap[name] == nil {
				dateRangeMap[name] = &email.DateChange{
					Field: name,
				}
			}
			if rangeKey == "start" {
				dateRangeMap[name].OldRangeStart = v.Old
				dateRangeMap[name].NewRangeStart = v.New
			} else {
				dateRangeMap[name].OldRangeEnd = v.Old
				dateRangeMap[name].NewRangeEnd = v.New
			}
		} else {
			// This is a single date, handle as before
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

			dateChangeSlice = append(dateChangeSlice, dateChange)
		}
	}

	// Add the range changes to the slice
	for _, dateChange := range dateRangeMap {
		dateChangeSlice = append(dateChangeSlice, *dateChange)
	}

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
