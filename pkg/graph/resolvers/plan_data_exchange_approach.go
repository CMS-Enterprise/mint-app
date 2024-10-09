package resolvers

import (
	"context"
	"time"

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
	return store.PlanDataExchangeApproachGetByID(logger, id)
}

// PlanDataExchangeApproachGetByModelPlanID retrieves a plan data exchange approach by its model plan ID
func PlanDataExchangeApproachGetByModelPlanID(logger *zap.Logger, store *storage.Store, modelPlanID uuid.UUID) (*models.PlanDataExchangeApproach, error) {
	return store.PlanDataExchangeApproachGetByModelPlanID(logger, modelPlanID)
}

// PlanDataExchangeApproachUpdate updates a plan data exchange approach
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
	// Get existing plan data exchange approach
	existing, err := store.PlanDataExchangeApproachGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	isSettingToComplete := false

	// Check if the 'changes' map contains the 'isDataExchangeApproachComplete' key and that the
	// 'isDataExchangeApproachComplete' is different from the existing value
	if isDataExchangeApproachComplete, ok := changes["isDataExchangeApproachComplete"]; ok {
		isSettingToComplete = isDataExchangeApproachComplete.(bool)

		// Check if time has been set or is the default value
		if existing.MarkedCompleteDts == nil && isSettingToComplete {
			// We do not actually store the isDataExchangeApproachComplete field in the database
			// so we need to remove it from the changes map

			existing.MarkedCompleteBy = &principal.Account().ID
			existing.MarkedCompleteDts = models.TimePointer(time.Now().UTC())
		} else if !isSettingToComplete {
			existing.MarkedCompleteBy = nil
			existing.MarkedCompleteDts = nil
		}

		delete(changes, "isDataExchangeApproachComplete")
	}

	// Update the base task list section
	err = CoreTaskListSectionPreUpdate(logger, existing, changes, principal, store)
	if err != nil {
		return nil, err
	}

	targetStatus, err := EvaluateStatus(len(changes) > 0, isSettingToComplete)
	if err != nil {
		return nil, err
	}

	deaIsChangedMarkedCompleted := (existing.Status == nil || targetStatus != *existing.Status) && targetStatus == models.DataExchangeApproachStatusCompleted
	existing.Status = &targetStatus

	// Update the plan data exchange approach
	retDataExchangeApproach, err := store.PlanDataExchangeApproachUpdate(logger, existing)

	if deaIsChangedMarkedCompleted {
		go func() {
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

			dataExchangeApproachUANs, uacErr := store.UserAccountGetNotificationPreferencesForDataExchangeApproachMarkedComplete(existing.ModelPlanID)
			if uacErr != nil {
				logger.Error("failed to get user account notification preferences", zap.Error(uacErr))
				return
			}

			emailUANs, inAppUANs := models.FilterNotificationPreferences(dataExchangeApproachUANs)

			_, notifErr = notifications.ActivityDataExchangeApproachMarkedCompleteCreate(
				ctx,
				principal.Account().ID,
				store,
				inAppUANs,
				existing.ID,
				principal.Account().ID,
			)
			if notifErr != nil {
				logger.Error("failed to create activity", zap.Error(notifErr))
				return
			}

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
				logger.Error("failed to send email notifications", zap.Error(err))
			}
		}()
	}

	return retDataExchangeApproach, err
}

// EvaluateStatus derives the status of the data exchange approach based on the current state of the model
func EvaluateStatus(hasChanges bool, isSettingToComplete bool) (models.DataExchangeApproachStatus, error) {

	if isSettingToComplete {
		return models.DataExchangeApproachStatusCompleted, nil
	} else if hasChanges {
		return models.DataExchangeApproachStatusInProgress, nil
	}

	return models.DataExchangeApproachStatusReady, nil
}
