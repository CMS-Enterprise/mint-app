package resolvers

import (
	"fmt"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//IsCollaborator handles the logic to asses if a user has permission to update an object by virtue of being a collaborator.
// Users with the Assessment role are automatically allowed access to update all records.
func IsCollaborator(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {

	//TODO restructure this
	if principal.AllowASSESSMENT() {
		return true, nil
	} else if principal.AllowUSER() {

		collaborator, err := store.CheckIfCollaborator(logger, principal.ID(), modelPlanID)
		return collaborator, err

	} else {
		return false, fmt.Errorf("user has no roles") //TODO better error please
	}

}

//IsCollaboratorByDiscussionID handles the logic to asses if a user has permission to update an object by virtue of being a collaborator.
// Users with the Assessment role are automatically allowed access to update all records.
func IsCollaboratorByDiscussionID(logger *zap.Logger, principal authentication.Principal, store *storage.Store, discussionID uuid.UUID) (bool, error) {

	//TODO restructure this
	if principal.AllowASSESSMENT() {
		return true, nil
	} else if principal.AllowUSER() {

		collaborator, err := store.CheckIfCollaboratorByDiscussionID(logger, principal.ID(), discussionID)
		return collaborator, err

	} else {
		return false, fmt.Errorf("user has no roles") //TODO better error please
	}

}
