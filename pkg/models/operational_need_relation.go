package models

import (
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

const OperationalNeedType = "OperationalNeed"

// operationalNeedRelation is an embedded struct meant to satisfy the resolvers.Collaborator interface
type operationalNeedRelation struct {
	OperationalNeedID uuid.UUID `json:"operationalNeedID" db:"operational_need_id"`
}

func (d operationalNeedRelation) GetRelationID() uuid.UUID {
	return d.OperationalNeedID
}

func (d operationalNeedRelation) GetType() string {
	return OperationalNeedType
}

func (d operationalNeedRelation) CheckAccess(principal authentication.Principal, logger *zap.Logger, objID uuid.UUID, checkFunc RelationCheckFunc) (bool, error) {
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
	logger.Warn(errString, zap.String("user", principal.ID()), zap.String("OperationalNeedID", objID.String()))
	return false, errors.New(errString)
}

// NewOperationalNeedRelation returns a operational need relation object
func NewOperationalNeedRelation(operationalNeedID uuid.UUID) operationalNeedRelation {
	return operationalNeedRelation{
		OperationalNeedID: operationalNeedID,
	}
}

// GetOperationalNeedID returns OperationalID
func (d operationalNeedRelation) GetOperationalNeedID() uuid.UUID {
	return d.OperationalNeedID
}
