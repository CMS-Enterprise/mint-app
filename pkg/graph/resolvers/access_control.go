package resolvers

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

type Collaborator interface {
	GetRelationID() uuid.UUID
	GetType() string
	CheckAccess(principal authentication.Principal, logger *zap.Logger, objID uuid.UUID, checkFunc models.RelationCheckFunc) (bool, error)
}

func errorIfNotCollaborator2(principal authentication.Principal, logger *zap.Logger, store *storage.Store, bs models.IBaseStruct) error {
	// guard
	collaborator, ok := bs.(Collaborator)
	if !ok {
		return fmt.Errorf("collaborator checks not supported for type %T", bs)
	}

	storeCheckFuncs := map[string]models.RelationCheckFunc{
		models.ModelPlanType:       store.CheckIfCollaborator,
		models.DiscussionType:      store.CheckIfCollaboratorByDiscussionID,
		models.OperationalNeedType: store.CheckIfCollaboratorByOperationalNeedID,
		models.SolutionType:        store.CheckIfCollaboratorBySolutionID,
	}

	checkFunc, ok := storeCheckFuncs[collaborator.GetType()]
	if !ok {
		return fmt.Errorf("unknown collaborator type: %s", collaborator.GetType())
	}

	isCollaborator, err := collaborator.CheckAccess(principal, logger, collaborator.GetRelationID(), checkFunc)
	if err != nil {
		return nil
	}

	if !isCollaborator {
		logger.Warn("user is not a collaborator", zap.String("user", principal.ID()), zap.String("object_id", collaborator.GetRelationID().String()), zap.String("object_type", collaborator.GetType()))
		return apperrors.NotCollaboratorError{
			Err: fmt.Errorf("user %[1]s is not a collaborator on type %[2]s with object id %[3]s", principal.ID(), collaborator.GetType(), collaborator.GetRelationID().String()),
		}
	}

	return nil
}

// isCollaboratorModelPlanID handles the logic to asses if a user has permission to update an object by virtue of being a collaborator.
// Users with the Assessment role are automatically allowed access to update all records.
func isCollaboratorModelPlanID(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {
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

// hasPrivilegedDocumentAccessByModelPlanID checks if a user should be able to view restricted documents or not. True means that they can see restricted document
func hasPrivilegedDocumentAccessByModelPlanID(logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {

	isCollaborator, err := isCollaboratorModelPlanID(logger, principal, store, modelPlanID)
	if err != nil {
		return false, err
	}

	// users who aren't collaborators or are non-cms users should not see privileged documents.
	if !isCollaborator || principal.AllowNonCMSUser() {
		return false, nil
	}
	return isCollaborator, nil

}
