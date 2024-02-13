package notifications

import (
	"encoding/json"
	"fmt"

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
	ActivityNewPlanDiscussion       ActivityType = "NEW_PLAN_DISCUSSION"
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
	// TODO: EASI-3294 try to get this represented as a dynamic type
}

// NewActivity returns a New Activity
func NewActivity(actorID uuid.UUID, entityID uuid.UUID, activityType ActivityType) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID), //TODO: EASI-3294 do we want to consider the actor is always the creator the activity?
		ActorID:      actorID,
		EntityID:     entityID,
		ActivityType: activityType,
	}
}

// parseRawActivityMetaData conditionally parses meta data from JSON to a specific meta data type
func parseRawActivityMetaData(activityType ActivityType, rawMetaDataJSON interface{}) (ActivityMetaData, error) {

	var rawData []byte

	// Check if rawMetaDataJSON is already a string
	if str, ok := rawMetaDataJSON.(string); ok {
		// Convert string to byte array
		rawData = []byte(str)
	} else if bytes, ok := rawMetaDataJSON.([]byte); ok {
		// Use byte array directly
		rawData = bytes
	} else {
		// Invalid type, return an error
		return nil, fmt.Errorf("unsupported type for activityData: %T", rawMetaDataJSON)
	}

	switch activityType {
	case ActivityNewPlanDiscussion:
		// Deserialize the raw JSON into NewPlanDiscussionActivityMeta
		meta := NewPlanDiscussionActivityMeta{}
		if err := json.Unmarshal(rawData, &meta); err != nil {
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
