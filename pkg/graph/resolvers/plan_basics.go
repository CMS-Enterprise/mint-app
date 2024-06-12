package resolvers

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/notifications"

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
	ctx context.Context,
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
			ctx,
			logger,
			store,
			principal,
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
	ctx context.Context,
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
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
				ctx,
				logger,
				store,
				principal,
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
	ctx context.Context,
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
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

	defaultRecipientEmailBody, err := emailTemplate.GetExecutedBody(email.ModelPlanDateChangedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
		DateChanges:   dateChangeSlice,
		ShowFooter:    false,
	})
	if err != nil {
		return err
	}

	// Send the email to default recipients
	err = emailService.Send(
		addressBook.DefaultSender,
		addressBook.ModelPlanDateChangedRecipients,
		nil,
		emailSubject,
		"text/html",
		defaultRecipientEmailBody,
	)
	if err != nil {
		return err
	}

	recipientUserAccounts, err := store.UserAccountsGetNotificationRecipientsForDatesChanged(modelPlan.ID)
	if err != nil {
		logger.Error("Error getting user accounts for date change notifications",
			zap.Error(err),
			zap.String("modelPlanID", modelPlan.ID.String()),
		)
		return err
	}

	emailRecipientUserAccounts, inAppRecipientUserAccounts := models.FilterNotificationPreferences(recipientUserAccounts)

	emailBody, err := emailTemplate.GetExecutedBody(email.ModelPlanDateChangedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
		DateChanges:   dateChangeSlice,
		ShowFooter:    true,
	})
	if err != nil {
		return err
	}

	recipientEmails := lo.Map(emailRecipientUserAccounts, func(user *models.UserAccountAndNotificationPreferences, _ int) string {
		return user.Email
	})

	go func() {
		err = emailService.Send(
			addressBook.DefaultSender,
			nil,
			nil,
			emailSubject,
			"text/html",
			emailBody,
			oddmail.WithBCC(recipientEmails),
		)

		if err != nil {
			logger.Error("Failed to send email notification",
				zap.Error(err),
				zap.String("modelPlanID", modelPlan.ID.String()),
			)
		}
	}()

	// Convert from email.DateChange to models.DateChange for GQL transport
	datesChangedModels := lo.Map(dateChangeSlice, func(dc email.DateChange, _ int) models.DateChange {
		modelDateChange := models.DateChange{
			IsChanged:     dc.IsChanged,
			IsRange:       dc.IsRange,
			OldDate:       dc.OldDate,
			NewDate:       dc.NewDate,
			OldRangeStart: dc.OldRangeStart,
			OldRangeEnd:   dc.OldRangeEnd,
			NewRangeStart: dc.NewRangeStart,
			NewRangeEnd:   dc.NewRangeEnd,
		}

		switch dc.Field {
		case "Complete ICIP":
			modelDateChange.Field = models.DateChangeFieldTypeCompleteIcip
		case "Clearance":
			modelDateChange.Field = models.DateChangeFieldTypeClearance
		case "Announce model":
			modelDateChange.Field = models.DateChangeFieldTypeAnnounced
		case "Application period":
			modelDateChange.Field = models.DateChangeFieldTypeApplications
		case "Performance period":
			modelDateChange.Field = models.DateChangeFieldTypePerformancePeriod
		case "Model wrap-up end date":
			modelDateChange.Field = models.DateChangeFieldTypeWrapUpEnds
		default:
			logger.Error("Unknown field type", zap.String("field", dc.Field))
		}

		return modelDateChange
	})

	_, err = notifications.ActivityDatesChangedCreate(ctx, store, principal.Account().ID, modelPlan.ID, datesChangedModels, inAppRecipientUserAccounts)
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
