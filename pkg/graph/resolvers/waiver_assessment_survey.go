package resolvers

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// WaiverAssessmentSurveyGetByModelPlanID returns the waiver assessment survey associated with a model plan via dataloader
func WaiverAssessmentSurveyGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) (*models.WaiverAssessmentSurvey, error) {
	return loaders.WaiverAssessmentSurvey.ByModelPlanID.Load(ctx, modelPlanID)
}

// WaiverAssessmentSurveyGetByID returns a waiver assessment survey by ID
func WaiverAssessmentSurveyGetByID(logger *zap.Logger, store *storage.Store, id uuid.UUID) (*models.WaiverAssessmentSurvey, error) {
	return storage.WaiverAssessmentSurveyGetByID(store, logger, id)
}

// WaiverAssessmentSurveyUpdate applies changes to a waiver assessment survey and persists them.
// The survey write and plan task status update are wrapped in a single transaction so they
// cannot diverge if one succeeds and the other fails.
func WaiverAssessmentSurveyUpdate(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailAddressBook email.AddressBook,
) (*models.WaiverAssessmentSurvey, error) {
	return sqlutils.WithTransaction[models.WaiverAssessmentSurvey](
		store,
		func(tx *sqlx.Tx) (*models.WaiverAssessmentSurvey, error) {
			existing, err := storage.WaiverAssessmentSurveyGetByID(tx, logger, id)
			if err != nil {
				return nil, err
			}

			// Auto-transition from READY to IN_PROGRESS on first save, matching the
			// DEA pattern. If the caller also sends an explicit status it will override
			// this via ApplyChanges below.
			if existing.Status == models.WaiverAssessmentSurveyStatusReady {
				existing.Status = models.WaiverAssessmentSurveyStatusInProgress
			}

			if err := BaseStructPreUpdate(logger, existing, changes, principal, store, true, true); err != nil {
				return nil, err
			}

			updated, err := storage.WaiverAssessmentSurveyUpdate(tx, logger, existing)
			if err != nil {
				return nil, err
			}

			if err := UpdatePlanTaskStatusOnWaiverAssessmentStarted(tx, logger, updated.ModelPlanID, principal, store); err != nil {
				return nil, err
			}

			if updated.Status == models.WaiverAssessmentSurveyStatusComplete {
				TrySendWaiverAssessmentSurveyNotifications(ctx, updated, logger, emailService, emailAddressBook, principal, tx)
			}

			return updated, nil
		},
	)
}

// WaiversGetByModelPlanID returns all waivers associated with a model plan via dataloader
func WaiversGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) ([]*models.Waiver, error) {
	return loaders.Waiver.ByModelPlanID.Load(ctx, modelPlanID)
}

// WaiverGetByID returns a waiver by ID
func WaiverGetByID(logger *zap.Logger, store *storage.Store, id uuid.UUID) (*models.Waiver, error) {
	return storage.WaiverGetByID(store, logger, id)
}

// UpdateSelectedWaivers upserts a waiver row for each selection in a single transaction.
// Creates the row if it does not exist, otherwise updates will_use_waiver and not_using_reason.
func UpdateSelectedWaivers(
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	selections []*models.WaiverSelectionInput,
	principal authentication.Principal,
	store *storage.Store,
) ([]*models.Waiver, error) {
	actor := principal.Account().ID

	tx, err := store.Beginx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback() //nolint:errcheck

	results := make([]*models.Waiver, 0, len(selections))
	for _, sel := range selections {
		w := models.NewWaiver(actor, modelPlanID, sel.CommonWaiverID)
		w.WillUseWaiver = &sel.WillUseWaiver
		w.NotUsingReason = sel.NotUsingReason
		w.ModifiedBy = &actor

		result, err := storage.WaiverUpsert(tx, logger, w)
		if err != nil {
			return nil, err
		}
		results = append(results, result)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return results, nil
}

// WaiverUpdate upserts a waiver row for the given model plan and common waiver,
// applying the provided changes. Creates the row if it does not yet exist.
func WaiverUpdate(
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	commonWaiverID uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
) (*models.Waiver, error) {
	waiver := models.NewWaiver(principal.Account().ID, modelPlanID, commonWaiverID)

	if err := BaseStructPreUpdate(logger, waiver, changes, principal, store, true, true); err != nil {
		return nil, err
	}

	return storage.WaiverUpsert(store, logger, waiver)
}

// SuggestedWaiversGetByModelPlanID returns suggested waivers for a model plan via dataloader
func SuggestedWaiversGetByModelPlanID(ctx context.Context, modelPlanID uuid.UUID) ([]*models.SuggestedWaiver, error) {
	return loaders.SuggestedWaiver.ByModelPlanID.Load(ctx, modelPlanID)
}

// TrySendWaiverAssessmentSurveyNotifications fires in-app and email notifications when a
// waiver assessment survey transitions to COMPLETE. Errors are logged but do not fail the
// parent transaction since notification delivery is best-effort.
func TrySendWaiverAssessmentSurveyNotifications(
	ctx context.Context,
	survey *models.WaiverAssessmentSurvey,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailAddressBook email.AddressBook,
	principal authentication.Principal,
	np sqlutils.NamedPreparer,
) {
	modelPlan, err := ModelPlanGetByIDLOADER(ctx, survey.ModelPlanID)
	if err != nil {
		logger.Error("waiver assessment survey notification: failed to load model plan", zap.Error(err))
		return
	}

	uans, err := storage.UserAccountGetNotificationPreferencesForWaiverAssessmentSurveyMarkedComplete(np, survey.ModelPlanID)
	if err != nil {
		logger.Error("waiver assessment survey notification: failed to get notification preferences", zap.Error(err))
		return
	}

	emailUANs, inAppUANs := models.FilterNotificationPreferences(uans)

	_, err = notifications.ActivityWaiverAssessmentSurveyMarkedCompleteCreate(
		ctx,
		principal.Account().ID,
		np,
		inAppUANs,
		survey.ModelPlanID,
		survey.ID,
		principal.Account().ID,
	)
	if err != nil {
		logger.Error("waiver assessment survey notification: failed to create activity", zap.Error(err))
		return
	}

	go func() {
		if emailService == nil {
			return
		}

		// Send to MINT team (no footer)
		if err := sendWaiverAssessmentSurveyMarkedCompleteEmail(
			emailService,
			emailAddressBook,
			modelPlan,
			emailAddressBook.MINTTeamEmail,
			principal.Account().CommonName,
			false,
		); err != nil {
			logger.Error("waiver assessment survey notification: failed to send MINT team email", zap.Error(err))
			return
		}

		// Send to opted-in users (with footer)
		if err := sendWaiverAssessmentSurveyMarkedCompleteEmails(
			emailService,
			emailAddressBook,
			emailUANs,
			modelPlan,
			principal.Account().CommonName,
			true,
		); err != nil {
			logger.Error("waiver assessment survey notification: failed to send user emails", zap.Error(err))
		}
	}()
}

func getWaiverAssessmentSurveyMarkedCompleteEmailContent(
	emailService oddmail.EmailService,
	modelPlan *models.ModelPlan,
	markedCompleteByCommonName string,
	showFooter bool,
) (string, string, error) {
	subjectContent := email.WaiverAssessmentSurveyCompletedSubjectContent{
		ModelName: modelPlan.ModelName,
	}
	bodyContent := email.WaiverAssessmentSurveyCompletedBodyContent{
		ClientAddress:                   emailService.GetConfig().GetClientAddress(),
		ModelName:                       modelPlan.ModelName,
		ModelID:                         modelPlan.GetModelPlanID().String(),
		MarkedCompletedByUserCommonName: markedCompleteByCommonName,
	}
	return email.WaiverAssessmentSurvey.Completed.GetContent(subjectContent, bodyContent)
}

func sendWaiverAssessmentSurveyMarkedCompleteEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	modelPlan *models.ModelPlan,
	userEmail string,
	markedCompleteByCommonName string,
	showFooter bool,
) error {
	subject, body, err := getWaiverAssessmentSurveyMarkedCompleteEmailContent(emailService, modelPlan, markedCompleteByCommonName, showFooter)
	if err != nil {
		return err
	}
	return emailService.Send(addressBook.DefaultSender, []string{userEmail}, nil, subject, "text/html", body)
}

func sendWaiverAssessmentSurveyMarkedCompleteEmails(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	receivers []*models.UserAccountAndNotificationPreferences,
	modelPlan *models.ModelPlan,
	markedCompleteByCommonName string,
	showFooter bool,
) error {
	subject, body, err := getWaiverAssessmentSurveyMarkedCompleteEmailContent(emailService, modelPlan, markedCompleteByCommonName, showFooter)
	if err != nil {
		return err
	}
	receiverEmails := lo.Map(receivers, func(pref *models.UserAccountAndNotificationPreferences, _ int) string {
		return pref.Email
	})
	return emailService.Send(addressBook.DefaultSender, []string{}, nil, subject, "text/html", body, oddmail.WithBCC(receiverEmails))
}
