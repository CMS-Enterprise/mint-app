package notifications

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
)

// ActivityType is an enum that represents the possible activities that happen in the MINT application
type ActivityType string

// These constants represent the different values of ActivityType
const (
	ActivityDigest             ActivityType = "DAILY_DIGEST_COMPLETE"
	ActivityNewPlanDiscussion  ActivityType = "NEW_PLAN_DISCUSSION"
	ActivityNewDiscussionReply ActivityType = "NEW_DISCUSSION_REPLY"
)

// Activity represents a discrete event that has happened in the application that might be notifiable.
type Activity struct {
	models.BaseStruct
	ActorID      uuid.UUID    `json:"actorID" db:"actor_id"`
	EntityID     uuid.UUID    `json:"entityID" db:"entity_id"`
	ActivityType ActivityType `json:"activityType" db:"activity_type"`
	// this is conditional data that is returned. It deserializes to data specific the activity type
	MetaData any `json:"metaData" db:"meta_data"`
	// TODO: EASI-3294
}

// NewActivity returns a New Activity
func NewActivity(actorID uuid.UUID, entityID uuid.UUID, activityType ActivityType) *Activity {
	return &Activity{
		BaseStruct:   models.NewBaseStruct(actorID), //TODO: EASI-3294 do we want to consider the actor is always the creator the activity?
		ActorID:      actorID,
		EntityID:     entityID,
		ActivityType: activityType,
	}
}
