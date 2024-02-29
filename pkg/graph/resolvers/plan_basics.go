package resolvers

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"
)

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

	modelPlan, err := store.ModelPlanGetByID(store, logger, existing.ModelPlanID)
	if err != nil {
		return nil, err
	}

	if emailService != nil &&
		emailTemplateService != nil &&
		len(addressBook.ModelPlanDateChangedRecipients) > 0 {
		err2 := processChangedDates(
			logger,
			changes,
			existing,
			emailService,
			emailTemplateService,
			addressBook,
			modelPlan,
		)
		if err2 != nil {
			logger.Info("Failed to process changed dates",
				zap.String("modelPlanID", modelPlan.ID.String()),
				zap.Error(err2),
			)
		}
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
	changes map[string]interface{},
	existing *models.PlanBasics,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
) error {
	dateChanges, err := extractChangedDates(changes, existing)
	if err != nil {
		return err
	}

	if len(dateChanges) > 0 {
		go func() {
			err2 := sendDateChangedEmails(
				emailService,
				emailTemplateService,
				addressBook,
				modelPlan,
				dateChanges,
			)

			if err2 != nil {
				logger.Error("Failed to send email notification",
					zap.Error(err),
					zap.String("modelPlanID", modelPlan.ID.String()),
				)
			}
		}()
	}
	return nil
}

func extractChangedDates(changes map[string]interface{}, existing *models.PlanBasics) (
	map[string]email.DateChange,
	error,
) {
	dp, err := NewDateProcessor(changes, existing)
	if err != nil {
		return nil, err
	}

	dateChanges, err := dp.ExtractChangedDates()
	if err != nil {
		return nil, err
	}

	return dateChanges, nil
}

func sanitizeZeroDate(date *time.Time) *time.Time {
	if date == nil {
		return nil
	}
	if date.IsZero() {
		return nil
	}

	return date
}

func sendDateChangedEmails(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	dateChanges map[string]email.DateChange,
) error {
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

	dateChangeSlice := make([]email.DateChange, 0, len(dateChanges))

	// Loop over the field data map to ensure order of the date changes in the email
	orderedCommonKeys := getOrderedCommonKeys()
	for _, commonKey := range orderedCommonKeys {
		dateChange := dateChanges[commonKey]

		dateChange.OldDate = sanitizeZeroDate(dateChange.OldDate)
		dateChange.NewDate = sanitizeZeroDate(dateChange.NewDate)
		dateChange.OldRangeStart = sanitizeZeroDate(dateChange.OldRangeStart)
		dateChange.NewRangeStart = sanitizeZeroDate(dateChange.NewRangeStart)
		dateChange.OldRangeEnd = sanitizeZeroDate(dateChange.OldRangeEnd)
		dateChange.NewRangeEnd = sanitizeZeroDate(dateChange.NewRangeEnd)

		dateChangeSlice = append(dateChangeSlice, dateChange)
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
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("no plan basics found for the given modelPlanID: %w", err)
		}

		return nil, fmt.Errorf("failed to fetch the plan basics: %w", err)
	}

	return result.(*models.PlanBasics), nil
}
