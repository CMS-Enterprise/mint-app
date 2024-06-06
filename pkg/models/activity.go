package models

import (
	"github.com/google/uuid"
)

// ActivityType is an enum that represents the possible activities that happen in the MINT application
type ActivityType string

// These constants represent the different values of ActivityType
const (
	ActivityDigest                  ActivityType = "DAILY_DIGEST_COMPLETE"
	ActivityAddedAsCollaborator     ActivityType = "ADDED_AS_COLLABORATOR"
	ActivityTaggedInDiscussion      ActivityType = "TAGGED_IN_DISCUSSION"
	ActivityTaggedInDiscussionReply ActivityType = "TAGGED_IN_DISCUSSION_REPLY"
	ActivityNewDiscussionReply      ActivityType = "NEW_DISCUSSION_REPLY"
	ActivityModelPlanShared         ActivityType = "MODEL_PLAN_SHARED"
	ActivityDatesChanged            ActivityType = "DATES_CHANGED"
)

// Activity represents a discrete event that has happened in the application that might be notifiable.
type Activity struct {
	baseStruct
	ActorID      uuid.UUID    `json:"actorID" db:"actor_id"`
	EntityID     uuid.UUID    `json:"entityID" db:"entity_id"`
	ActivityType ActivityType `json:"activityType" db:"activity_type"`

	MetaDataRaw interface{} `db:"meta_data"`
	// this is conditional data that is returned. It deserializes to data specific the activity type
	MetaData ActivityMetaData `json:"metaData"`
}

// NewActivity returns a New Activity
func NewActivity(actorID uuid.UUID, entityID uuid.UUID, activityType ActivityType) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     entityID,
		ActivityType: activityType,
	}
}
