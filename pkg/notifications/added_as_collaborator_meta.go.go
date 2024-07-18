package notifications

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// ActivityAddedAsCollaboratorCreate creates an activity for when a User is added as a collaborator for a model plan.
// It also creates all the relevant notifications
func ActivityAddedAsCollaboratorCreate(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	collaboratorID uuid.UUID,
	collaboratorAccountID uuid.UUID,
	getPreferencesFunc GetUserNotificationPreferencesFunc) (*models.Activity, error) {

	activity := models.NewAddedAsCollaboratorActivity(actorID, modelPlanID, collaboratorID)

	retActivity, actErr := activityCreate(ctx, np, activity)
	if actErr != nil {
		return nil, actErr
	}

	pref, err := getPreferencesFunc(ctx, collaboratorAccountID)
	if err != nil {
		return nil, fmt.Errorf("unable to get user notification preference, Notification not created %w", err)
	}

	_, err = userNotificationCreate(ctx, np, retActivity, collaboratorAccountID, pref.AddedAsCollaborator)
	if err != nil {
		return nil, err
	}

	return retActivity, nil

}
