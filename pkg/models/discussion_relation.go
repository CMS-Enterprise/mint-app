package models

import "github.com/google/uuid"

// IDiscussionRelation is an interface that represents models that are related to a discussion.
type IDiscussionRelation interface {
	GetDiscussionID() uuid.UUID
}

// DiscussionRelation is an embedded struct meant to satisfy the IDiscussionRelation interface
type discussionRelation struct {
	DiscussionID uuid.UUID `json:"discussionID" db:"discussion_id"`
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
