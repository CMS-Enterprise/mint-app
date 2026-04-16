package accesscontrol

import (
	"errors"
	"fmt"

	"go.uber.org/zap"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/apperrors"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// ErrorIfNotCollaborator returns an error if the user is not a collaborator. It wraps checks to see if it has a model plan, or Discussion relation, with priority given to ModelPlan
func ErrorIfNotCollaborator(obj any, logger *zap.Logger, principal authentication.Principal, store *storage.Store) error {

	modelPlanRelation, hasModelPlanRelation := obj.(models.IModelPlanRelation)
	discussionRelation, hasDiscussionRelation := obj.(models.IDiscussionRelation)
	milestoneRelation, hasMilestoneRelation := obj.(models.IMilestoneRelation)
	notCollabErrString := "user is not a collaborator"

	if hasModelPlanRelation { //Favor modelPlanRelation  first

		isCollaborator, err := IsCollaboratorModelPlanID(logger, principal, store, modelPlanRelation.GetModelPlanID())
		if err != nil {
			return err
		}
		if !isCollaborator {

			logger.Warn(notCollabErrString, zap.String("user", principal.ID()), zap.String("ModelPlanID", modelPlanRelation.GetModelPlanID().String()))
			return apperrors.NotCollaboratorError{
				Err: fmt.Errorf("ModelPlanID: %s", modelPlanRelation.GetModelPlanID().String()),
			}
			// return fmt.Errorf("user %s is not a collaborator on model plan %s", principal, modelPlanRelation.GetModelPlanID().String())
		}
	} else if hasDiscussionRelation {
		isCollaborator, err := IsCollaboratorByDiscussionID(logger, principal, store, discussionRelation.GetDiscussionID())
		if err != nil {
			return err
		}
		if !isCollaborator {
			logger.Warn(notCollabErrString, zap.String("user", principal.ID()), zap.String("DiscussionID", discussionRelation.GetDiscussionID().String()))
			return apperrors.NotCollaboratorError{
				Err: fmt.Errorf("DiscussionID: %s", discussionRelation.GetDiscussionID().String()),
			}
		}
	} else if hasMilestoneRelation {
		isCollaborator, err := IsCollaboratorByMilestoneID(logger, principal, store, milestoneRelation.GetMilestoneID())
		if err != nil {
			return err
		}
		if !isCollaborator {
			logger.Warn(notCollabErrString, zap.String("user", principal.ID()), zap.String("MilestoneID", milestoneRelation.GetMilestoneID().String()))
			return apperrors.NotCollaboratorError{
				Err: fmt.Errorf("MilestoneID: %s", milestoneRelation.GetMilestoneID().String()),
			}
		}
	} else {
		return fmt.Errorf("desired access control is not configured")
	}

	return nil
}

// IsCollaboratorModelPlanID handles the logic to asses if a user has permission to update an object by virtue of being a collaborator.
// Users with the Assessment role are automatically allowed access to update all records.
func IsCollaboratorModelPlanID(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {
	if principal.AllowASSESSMENT() {
		return true, nil
	}

	if principal.AllowMAC() {
		return false, nil
	}

	if principal.AllowUSER() {
		collaborator, err := store.CheckIfCollaborator(logger, principal.Account().ID, modelPlanID)
		return collaborator, err
	}

	errString := "user has no roles"
	logger.Warn(errString, zap.String("user", principal.ID()), zap.String("ModelPlanID", modelPlanID.String()))
	return false, errors.New(errString)
}

// IsCollaboratorByDiscussionID handles the logic to asses if a user has permission to update an object by virtue of being a collaborator.
// Users with the Assessment role are automatically allowed access to update all records.
func IsCollaboratorByDiscussionID(logger *zap.Logger, principal authentication.Principal, store *storage.Store, discussionID uuid.UUID) (bool, error) {
	if principal.AllowASSESSMENT() {
		return true, nil
	}

	if principal.AllowMAC() {
		return false, nil
	}

	if principal.AllowUSER() {
		collaborator, err := store.CheckIfCollaboratorByDiscussionID(logger, principal.Account().ID, discussionID)
		return collaborator, err

	}

	errString := "user has no roles"
	logger.Warn(errString, zap.String("user", principal.ID()), zap.String("DiscussionID", discussionID.String()))
	return false, errors.New(errString)
}

func IsCollaboratorByMilestoneID(logger *zap.Logger, principal authentication.Principal, store *storage.Store, milestoneID uuid.UUID) (bool, error) {
	if principal.AllowASSESSMENT() {
		return true, nil
	}

	if principal.AllowMAC() {
		return false, nil
	}

	if principal.AllowUSER() {
		return store.CheckIfCollaboratorByMilestoneID(logger, principal.Account().ID, milestoneID)
	}

	errString := "user has no roles"
	logger.Warn(errString, zap.String("user", principal.ID()), zap.String("MilestoneID", milestoneID.String()))
	return false, errors.New(errString)
}

// HasPrivilegedDocumentAccessByModelPlanID checks if a user should be able to view restricted documents or not. True means that they can see restricted document
func HasPrivilegedDocumentAccessByModelPlanID(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {

	isCollaborator, err := IsCollaboratorModelPlanID(logger, principal, store, modelPlanID)
	if err != nil {
		return false, err
	}

	// users who aren't collaborators or are non-cms users should not see privileged documents.
	if !isCollaborator || principal.AllowNonCMSUser() {
		return false, nil
	}
	return isCollaborator, nil

}
