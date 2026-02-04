package models

import (
	"errors"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

const DiscussionType = "Discussion"

// discussionRelation is an embedded struct meant to satisfy the resolvers.Collaborator interface
type discussionRelation struct {
	DiscussionID uuid.UUID `json:"discussionID" db:"discussion_id"`
}

func (d discussionRelation) GetRelationID() uuid.UUID {
	return d.DiscussionID
}

func (d discussionRelation) GetType() string {
	return DiscussionType
}

func (d discussionRelation) CheckAccess(principal authentication.Principal, logger *zap.Logger, objID uuid.UUID, checkFunc RelationCheckFunc) (bool, error) {
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
	logger.Warn(errString, zap.String("user", principal.ID()), zap.String("DiscussionID", objID.String()))
	return false, errors.New(errString)
}

// NewDiscussionRelation returns a model plan relation object
func NewDiscussionRelation(discussionID uuid.UUID) discussionRelation {
	return discussionRelation{
		DiscussionID: discussionID,
	}
}

// GetDiscussionID returns DiscussionID
func (d discussionRelation) GetDiscussionID() uuid.UUID {
	return d.DiscussionID
}
