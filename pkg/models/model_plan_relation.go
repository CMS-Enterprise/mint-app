package models

import (
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

const ModelPlanType = "ModelPlan"

// modelPlanRelation is a struct meant to be embedded to show that the object should have model plan relations enforced
// it implements the resolvers.Collaborator interface
type modelPlanRelation struct {
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
}

func (m modelPlanRelation) GetRelationID() uuid.UUID {
	return m.ModelPlanID
}

func (m modelPlanRelation) GetType() string {
	return ModelPlanType
}

func (m modelPlanRelation) CheckAccess(principal authentication.Principal, logger *zap.Logger, objID uuid.UUID, checkFunc RelationCheckFunc) (bool, error) {
	if principal.AllowASSESSMENT() {
		return true, nil
	}

	if principal.AllowMAC() {
		return false, nil
	}

	if principal.AllowUSER() {
		return checkFunc(logger, principal.Account().ID, objID)
	}

	errString := "user has no roles"
	logger.Warn(errString, zap.String("user", principal.ID()), zap.String("ModelPlanID", objID.String()))
	return false, errors.New(errString)
}

// NewModelPlanRelation returns a model plan relation object
func NewModelPlanRelation(modelPlanID uuid.UUID) modelPlanRelation {
	return modelPlanRelation{
		ModelPlanID: modelPlanID,
	}
}

// GetModelPlanID returns the modelPlanID of the task list section
func (m modelPlanRelation) GetModelPlanID() uuid.UUID {
	return m.ModelPlanID
}

// Future Enhancement: Consider adding a ModelPlan() method like we do for user accounts etc to return a ModelPlan for any relation.
// This would remove the need to implement it in the resolvers
