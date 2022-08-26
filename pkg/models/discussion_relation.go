package models

import "github.com/google/uuid"

//IDiscussionRelation is an interface that represents models that are related to a discussion.
type IDiscussionRelation interface {
	GetDiscussionID() uuid.UUID
}

//DiscussionRelation is an embedded struct meant to satisify the IDiscussionRelation interface
type DiscussionRelation struct {
	DiscussionID uuid.UUID `json:"discussionID" db:"discussion_id"`
}

//GetDiscussionID returns DiscussionID
func (d DiscussionRelation) GetDiscussionID() uuid.UUID {
	return d.DiscussionID
}
