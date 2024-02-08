package notifications

import (
	"encoding/json"
	"fmt"

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

	MetaDataRaw interface{} `db:"meta_data"`
	// this is conditional data that is returned. It deserializes to data specific the activity type
	MetaData ActivityMetaData `json:"metaData"`
	// TODO: EASI-3294 try to get this represented as a dynamic type
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

func parseRawActivityMetaData(activityType ActivityType, rawMetaDataJSON interface{}) (ActivityMetaData, error) {
	rawJSON := rawMetaDataJSON
	switch activityType {
	case ActivityNewPlanDiscussion:
		// Deserialize the raw JSON into NewPlanDiscussionActivityMeta
		meta := NewPlanDiscussionActivityMeta{}
		if err := json.Unmarshal([]byte(rawJSON.(string)), &meta); err != nil {
			// Handle error if unmarshaling fails
			return nil, err
		}
		return &meta, nil

	// Add cases for other ActivityTypes as needed

	default:
		// Return a default implementation or handle unsupported types
		return nil, fmt.Errorf("unsupported activity type: %s", activityType)
	}

}
