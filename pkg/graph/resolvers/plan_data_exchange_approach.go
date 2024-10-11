package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/sqlutils"

	"github.com/cms-enterprise/mint-app/pkg/notifications"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// PlanDataExchangeApproachGetByID retrieves a plan data exchange approach by its ID
func PlanDataExchangeApproachGetByID(logger *zap.Logger, store *storage.Store, id uuid.UUID) (*models.PlanDataExchangeApproach, error) {
	return storage.PlanDataExchangeApproachGetByID(store, logger, id)
}

// PlanDataExchangeApproachGetByModelPlanID retrieves a plan data exchange approach by its model plan ID
func PlanDataExchangeApproachGetByModelPlanID(logger *zap.Logger, store *storage.Store, modelPlanID uuid.UUID) (*models.PlanDataExchangeApproach, error) {
	return storage.PlanDataExchangeApproachGetByModelPlanID(store, logger, modelPlanID)
}

// PlanDataExchangeApproachUpdate updates a plan data exchange approach
// It looks to see if a user marked the section as complete, and if so it will update the status and mark the user and the date.
// If a user sets the section as not complete, it will clear that data, and set the status to in progress.
func PlanDataExchangeApproachUpdate(
	ctx context.Context,
	logger *zap.Logger,
	id uuid.UUID,
	changes map[string]interface{},
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	emailAddressBook email.AddressBook,
) (*models.PlanDataExchangeApproach, error) {
	updatedDataExchangeApproach, err := sqlutils.WithTransaction[models.PlanDataExchangeApproach](
		store,
		func(tx *sqlx.Tx) (*models.PlanDataExchangeApproach, error) {
			// Get existing plan data exchange approach
			existing, err := storage.PlanDataExchangeApproachGetByID(tx, logger, id)
			if err != nil {
				return nil, err
			}

			// If (and only if) we're in the "Ready" status should we should (at least) update to "In Progress"
			if existing.Status == models.DataExchangeApproachStatusReady {
				existing.Status = models.DataExchangeApproachStatusInProgress
			}

			// Variable to track whether or not this update mutation caused the DEA Section
			// to go from some non-complete status to "Complete"
			// (Not quite the same as just checking the mutation variables -- e.g. if we're _already_
			// in "Complete" and pass isDataExchangeApproachComplete: true, we don't want to set this var
			// to true)
			deaChangedToComplete := false

			// Check if the 'changes' map contains the 'isDataExchangeApproachComplete' key and that the
			// 'isDataExchangeApproachComplete' is different from the existing value
			if isDataExchangeApproachComplete, ok := changes["isDataExchangeApproachComplete"]; ok {
				isSettingToComplete, ok := isDataExchangeApproachComplete.(bool)
				if !ok {
					return nil, fmt.Errorf("unable to update plan data exchange approach, isDataExchangeApproachComplete is not a bool")
				}

				// Check if time has been set or is the default value
				if existing.MarkedCompleteDts == nil && isSettingToComplete {
					deaChangedToComplete = true
					existing.MarkedCompleteBy = &principal.Account().ID
					existing.MarkedCompleteDts = models.TimePointer(time.Now().UTC())
					existing.Status = models.DataExchangeApproachStatusCompleted
				} else if !isSettingToComplete {
					existing.MarkedCompleteBy = nil
					existing.MarkedCompleteDts = nil
					existing.Status = models.DataExchangeApproachStatusInProgress
				}

				// Remove isDataExchangeApproachComplete from the changes map, since it's part of the
				// input type but is NOT actually part of the model
				delete(changes, "isDataExchangeApproachComplete")
			}

			// Update the base task list section
			err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
			if err != nil {
				return nil, err
			}

			// Update the plan data exchange approach
			retDataExchangeApproach, err := storage.PlanDataExchangeApproachUpdate(tx, logger, existing)

			if deaChangedToComplete {
				TrySendDataExchangeApproachNotifications(
					ctx,
					existing,
					logger,
					emailService,
					emailTemplateService,
					emailAddressBook,
					principal,
					tx,
				)
			}

			return retDataExchangeApproach, err
		},
	)

	if err != nil {
		return nil, err
	}

	return updatedDataExchangeApproach, nil
}

func TrySendDataExchangeApproachNotifications(
	ctx context.Context,
	existing *models.PlanDataExchangeApproach,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	emailAddressBook email.AddressBook,
	principal authentication.Principal,
	np sqlutils.NamedPreparer,
) {
	// Send email notifications
	modelPlan, notifErr := ModelPlanGetByIDLOADER(ctx, existing.ModelPlanID)
	if notifErr != nil {
		logger.Error("failed to send email notifications", zap.Error(notifErr))
		return
	}

	notifErr = SendDataExchangeApproachMarkedCompleteEmailNotification(
		emailService,
		emailTemplateService,
		emailAddressBook,
		modelPlan,
		emailAddressBook.MINTTeamEmail,
		principal.Account().CommonName,
		false,
	)
	if notifErr != nil {
		logger.Error("failed to send email notifications", zap.Error(notifErr))
		return
	}

	dataExchangeApproachUANs, uacErr := storage.UserAccountGetNotificationPreferencesForDataExchangeApproachMarkedComplete(np, existing.ModelPlanID)
	if uacErr != nil {
		logger.Error("failed to get user account notification preferences", zap.Error(uacErr))
		return
	}

	emailUANs, inAppUANs := models.FilterNotificationPreferences(dataExchangeApproachUANs)

	_, notifErr = notifications.ActivityDataExchangeApproachMarkedCompleteCreate(
		ctx,
		principal.Account().ID,
		np,
		inAppUANs,
		existing.ModelPlanID,
		existing.ID,
		principal.Account().ID,
	)
	if notifErr != nil {
		logger.Error("failed to create activity", zap.Error(notifErr))
		return
	}

	go func() {
		// Send email notifications
		notifErr = SendDataExchangeApproachMarkedCompleteEmailNotifications(
			emailService,
			emailTemplateService,
			emailAddressBook,
			emailUANs,
			modelPlan,
			principal.Account().CommonName,
			true,
		)
		if notifErr != nil {
			logger.Error("failed to send email notifications", zap.Error(notifErr))
		}
	}()
}
