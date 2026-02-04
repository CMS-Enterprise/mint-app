package models

import (
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

const SolutionType = "Solution"

// ISolutionRelation is an interface that represents models that are related to a solution.
type ISolutionRelation interface {
	GetSolutionID() uuid.UUID
}

// solutionRelation is a struct meant to be embedded to show that the object should have solution relations enforced
type solutionRelation struct {
	SolutionID uuid.UUID `json:"SolutionID" db:"solution_id"`
}

func (m solutionRelation) GetRelationID() uuid.UUID {
	return m.SolutionID
}

func (m solutionRelation) GetType() string {
	return SolutionType
}

func (m solutionRelation) CheckAccess(principal authentication.Principal, logger *zap.Logger, objID uuid.UUID, checkFunc RelationCheckFunc) (bool, error) {
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
	logger.Warn(errString, zap.String("user", principal.ID()), zap.String("SolutionID", objID.String()))
	return false, errors.New(errString)
}

// NewSolutionRelation returns a solution relation object
func NewSolutionRelation(solutionID uuid.UUID) solutionRelation {
	return solutionRelation{
		SolutionID: solutionID,
	}
}

// GetSolutionID returns the SolutionID of the task list section
func (m solutionRelation) GetSolutionID() uuid.UUID {
	return m.SolutionID
}
