package resolvers

import (
	"fmt"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//ErrorIfNotCollaborator returns an error if the user is not a collaborator. It wraps checks to see if it has a model plan, or Discussion relation, with priority given to ModelPlan
func ErrorIfNotCollaborator(obj interface{}, logger *zap.Logger, principal authentication.Principal, store *storage.Store) error {

	_, checkAccessControl := obj.(models.ICheckAccess) //See if object was meant to check for access

	if checkAccessControl {
		modelPlanRelation, hasModelPlanRelation := obj.(models.IModelPlanRelation)
		discussionRelation, hasDiscussionRelation := obj.(models.IDiscussionRelation)
		if hasModelPlanRelation { //Favor modelPlanRelation  first
			isCollaborator, err := IsCollaboratorModelPlanID(logger, principal, store, modelPlanRelation.GetModelPlanID())
			if err != nil {
				return err
			}
			if !isCollaborator {
				return fmt.Errorf("user is not a collaborator")
			}
		} else if hasDiscussionRelation {
			isCollaborator, err := IsCollaboratorByDiscussionID(logger, principal, store, discussionRelation.GetDiscussionID())
			if err != nil {
				return err
			}
			if !isCollaborator {
				return fmt.Errorf("user is not a collaborator")
			}
		} else {
			return fmt.Errorf("desired access control is not configured")
		}

	}
	return nil
}

//IsCollaboratorModelPlanID handles the logic to asses if a user has permission to update an object by virtue of being a collaborator.
// Users with the Assessment role are automatically allowed access to update all records.
func IsCollaboratorModelPlanID(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {

	if principal.AllowASSESSMENT() {
		return true, nil
	} else if principal.AllowUSER() {
		collaborator, err := store.CheckIfCollaborator(logger, principal.ID(), modelPlanID)
		return collaborator, err

	} else {
		errString := "user has no roles"
		logger.Error(errString, zap.String("user", principal.ID()), zap.String("ModelPlanID", modelPlanID.String()))
		return false, fmt.Errorf("user has no roles")
	}

}

//IsCollaboratorByDiscussionID handles the logic to asses if a user has permission to update an object by virtue of being a collaborator.
// Users with the Assessment role are automatically allowed access to update all records.
func IsCollaboratorByDiscussionID(logger *zap.Logger, principal authentication.Principal, store *storage.Store, discussionID uuid.UUID) (bool, error) {
	if principal.AllowASSESSMENT() {
		return true, nil
	} else if principal.AllowUSER() {
		collaborator, err := store.CheckIfCollaboratorByDiscussionID(logger, principal.ID(), discussionID)
		return collaborator, err

	} else {
		errString := "user has no roles"
		logger.Error(errString, zap.String("user", principal.ID()), zap.String("DiscussionID", discussionID.String()))
		return false, fmt.Errorf(errString)
	}

}
