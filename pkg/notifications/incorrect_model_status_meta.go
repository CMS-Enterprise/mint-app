package notifications

import (
	"context"
	"log"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ActivityIncorrectModelStatusCreate creates an activity for when an incorrect model status is detected.
// If isLeadFunc returns true for a receiver, a notification is always created regardless of preferences.
func ActivityIncorrectModelStatusCreate(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	actorID uuid.UUID,
	receiverIDs []uuid.UUID,
	phaseSuggestion *models.PhaseSuggestion,
	modelPlan *models.ModelPlan,
	getPreferencesFunc GetUserNotificationPreferencesFunc,
	isLeadFunc IsLeadFunc,
) (*models.Activity, error) {

	// extract statuses
	SuggestedStatuses := make([]string, len(phaseSuggestion.SuggestedStatuses))
	for i, status := range phaseSuggestion.SuggestedStatuses {
		SuggestedStatuses[i] = string(status)
	}

	activity := models.NewIncorrectModelStatusActivity(
		actorID,
		modelPlan,
		phaseSuggestion,
	)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	for _, receiverID := range receiverIDs {
		preferences, err := getPreferencesFunc(ctx, receiverID)
		if err != nil {
			return nil, err
		}

		var notifPrefs models.UserNotificationPreferenceFlags
		var isLead bool
		if isLeadFunc != nil {
			isLead, err = isLeadFunc(receiverID)
			if err != nil {
				log.Printf("Error checking if user %s is a lead: %v", receiverID, err)
			}
		}
		// if model lead then send all notifications regardless of user preferences
		if isLead {
			notifPrefs = models.UserNotificationPreferenceFlags{
				models.UserNotificationPreferenceInApp,
				models.UserNotificationPreferenceEmail,
			}
		} else {
			notifPrefs = preferences.IncorrectModelStatus
		}

		_, err = userNotificationCreate(ctx, np, retActivity, receiverID, notifPrefs)
		if err != nil {
			return nil, err
		}
	}

	return retActivity, nil
}
