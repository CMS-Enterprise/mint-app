package resolvers

import (
	"context"
	"errors"
	"fmt"
	"sort"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// CustomTimelineDateCreate creates a custom timeline date.
func CustomTimelineDateCreate(
	ctx context.Context,
	logger *zap.Logger,
	input *model.CustomTimelineDateCreateInput,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) (*models.CustomTimelineDate, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	customTimelineDate := models.NewCustomTimelineDate(principalAccount.ID, input.ModelPlanID)
	customTimelineDate.Title = input.Title
	customTimelineDate.Description = input.Description
	customTimelineDate.DateType = input.DateType
	customTimelineDate.StartDate = input.StartDate
	customTimelineDate.EndDate = input.EndDate

	if err := validateAndNormalizeCustomTimelineDate(customTimelineDate); err != nil {
		return nil, err
	}

	if err := BaseStructPreCreate(logger, customTimelineDate, principal, store, true); err != nil {
		return nil, err
	}

	createdCustomDate, err := storage.CustomTimelineDateCreate(store, customTimelineDate)
	if err != nil {
		return nil, err
	}

	processCustomTimelineDateCreatedEmails(
		ctx,
		logger,
		store,
		principal,
		emailService,
		addressBook,
		createdCustomDate,
	)

	return createdCustomDate, nil
}

func processCustomTimelineDateCreatedEmails(
	ctx context.Context,
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	customTimelineDate *models.CustomTimelineDate,
) {
	if emailService == nil || customTimelineDate == nil {
		return
	}

	principalAccount := principal.Account()
	if principalAccount == nil {
		logger.Error("failed to send custom timeline date created email because principal account is nil",
			zap.String("customTimelineDateID", customTimelineDate.ID.String()),
			zap.String("modelPlanID", customTimelineDate.ModelPlanID.String()),
		)
		return
	}

	go func() {
		err := sendCustomTimelineDateCreatedEmails(
			ctx,
			store,
			emailService,
			addressBook,
			customTimelineDate,
			principalAccount.CommonName,
		)
		if err != nil {
			logger.Error("failed to send custom timeline date created email",
				zap.String("customTimelineDateID", customTimelineDate.ID.String()),
				zap.String("modelPlanID", customTimelineDate.ModelPlanID.String()),
				zap.Error(err),
			)
		}
	}()
}

func sendCustomTimelineDateCreatedEmails(
	ctx context.Context,
	store *storage.Store,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	customTimelineDate *models.CustomTimelineDate,
	createdByUserName string,
) error {
	modelPlan, err := loaders.ModelPlan.GetByID.Load(ctx, customTimelineDate.ModelPlanID)
	if err != nil {
		return fmt.Errorf("unable to load model plan for custom timeline date created email: %w", err)
	}

	subjectContent := email.CustomTimelineDateCreatedSubjectContent{
		ModelName: modelPlan.ModelName,
	}
	bodyContent := email.CustomTimelineDateCreatedBodyContent{
		ClientAddress:                 emailService.GetConfig().GetClientAddress(),
		ModelName:                     modelPlan.ModelName,
		ModelID:                       modelPlan.GetModelPlanID().String(),
		UserName:                      createdByUserName,
		CustomTimelineDateTitle:       customTimelineDate.Title,
		CustomTimelineDateDescription: customTimelineDateDescriptionForEmail(customTimelineDate),
		CustomTimelineDate:            customTimelineDateForEmail(customTimelineDate),
	}

	emailSubject, emailBody, err := email.ModelPlan.CustomTimelineDateCreated.GetContent(subjectContent, bodyContent)
	if err != nil {
		return err
	}

	if len(addressBook.ModelPlanDateChangedRecipients) > 0 {
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
	}

	recipientUserAccounts, err := store.UserAccountsGetNotificationRecipientsForDatesChanged(customTimelineDate.ModelPlanID)
	if err != nil {
		return fmt.Errorf("unable to get date change notification recipients for custom timeline date created email: %w", err)
	}

	emailRecipientUserAccounts, _ := models.FilterNotificationPreferences(recipientUserAccounts)
	recipientEmails := make([]string, 0, len(emailRecipientUserAccounts))
	for _, recipient := range emailRecipientUserAccounts {
		recipientEmails = append(recipientEmails, recipient.Email)
	}

	if len(recipientEmails) > 0 {
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
			return err
		}
	}

	return nil
}

func customTimelineDateDescriptionForEmail(customTimelineDate *models.CustomTimelineDate) string {
	if customTimelineDate.Description == nil {
		return ""
	}

	return *customTimelineDate.Description
}

func customTimelineDateForEmail(customTimelineDate *models.CustomTimelineDate) string {
	startDate := customTimelineDate.StartDate.Format("01/02/2006")
	if customTimelineDate.DateType != models.CustomTimelineDateTypeRange || customTimelineDate.EndDate == nil {
		return startDate
	}

	return fmt.Sprintf("%s - %s", startDate, customTimelineDate.EndDate.Format("01/02/2006"))
}

// validateAndNormalizeCustomTimelineDate gets the request body's dates ready for the DB
func validateAndNormalizeCustomTimelineDate(customTimelineDate *models.CustomTimelineDate) error {
	switch customTimelineDate.DateType {
	case models.CustomTimelineDateTypeSingle:
		customTimelineDate.EndDate = nil
	case models.CustomTimelineDateTypeRange:
		if customTimelineDate.EndDate == nil {
			return errors.New("end date is required when custom timeline date type is RANGE")
		}
	default:
		return fmt.Errorf("unsupported custom timeline date type %s", customTimelineDate.DateType)
	}

	return nil
}

// CustomTimelineDateUpdate updates a custom timeline date.
func CustomTimelineDateUpdate(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]any,
	principal authentication.Principal,
	store *storage.Store,
) (*models.CustomTimelineDate, error) {
	if principal.Account() == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existing, err := CustomTimelineDateGetByIDLOADER(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("error fetching custom timeline date during update: %w", err)
	}

	if existing == nil {
		return nil, fmt.Errorf("custom timeline date with id %s not found", id)
	}

	customTimelineDate := *existing

	if err := BaseStructPreUpdate(logger, &customTimelineDate, changes, principal, store, true, true); err != nil {
		return nil, err
	}

	if err := validateAndNormalizeCustomTimelineDate(&customTimelineDate); err != nil {
		return nil, err
	}

	return storage.CustomTimelineDateUpdate(store, &customTimelineDate)
}

// CustomTimelineDateGetByIDLOADER returns a custom timeline date by its provided ID.
func CustomTimelineDateGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.CustomTimelineDate, error) {
	return loaders.CustomTimelineDate.ByID.Load(ctx, id)
}

// CustomTimelineDateGetByModelPlanIDLOADER returns custom timeline dates by their provided model plan ID.
func CustomTimelineDateGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.CustomTimelineDate, error) {
	customTimelineDates, err := loaders.CustomTimelineDate.ByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}

	sort.SliceStable(customTimelineDates, func(i, j int) bool {
		// in order to always get a deterministic return, we first order by the start date, and if those are equal, then we fall back to ordering by which was created first
		if customTimelineDates[i].StartDate.Equal(customTimelineDates[j].StartDate) {
			return customTimelineDates[i].CreatedDts.Before(customTimelineDates[j].CreatedDts)
		}
		return customTimelineDates[i].StartDate.Before(customTimelineDates[j].StartDate)
	})

	return customTimelineDates, nil
}

// DeleteCustomTimelineDate deletes a custom timeline date.
func DeleteCustomTimelineDate(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	id uuid.UUID,
) (*models.CustomTimelineDate, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	existing, err := loaders.CustomTimelineDate.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("error fetching custom timeline date during deletion: %w", err)
	}

	if existing == nil {
		return nil, fmt.Errorf("custom timeline date with id %s not found", id)
	}

	if err := BaseStructPreDelete(logger, existing, principal, store, true); err != nil {
		return nil, fmt.Errorf("error deleting custom timeline date. user doesn't have permissions: %w", err)
	}

	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.CustomTimelineDate, error) {
		deletedCustomTimelineDate, err := storage.CustomTimelineDateDelete(tx, principalAccount.ID, id)
		if err != nil {
			return nil, fmt.Errorf("unable to delete custom timeline date: %w", err)
		}

		return deletedCustomTimelineDate, nil
	})
}
