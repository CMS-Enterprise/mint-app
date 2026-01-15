package models

import (
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
)

// ActivityType is an enum that represents the possible activities that happen in the MINT application
type ActivityType string

// These constants represent the different values of ActivityType
const (
	ActivityDigest                             ActivityType = "DAILY_DIGEST_COMPLETE"
	ActivityAddedAsCollaborator                ActivityType = "ADDED_AS_COLLABORATOR"
	ActivityTaggedInDiscussion                 ActivityType = "TAGGED_IN_DISCUSSION"
	ActivityTaggedInDiscussionReply            ActivityType = "TAGGED_IN_DISCUSSION_REPLY"
	ActivityNewDiscussionReply                 ActivityType = "NEW_DISCUSSION_REPLY"
	ActivityModelPlanShared                    ActivityType = "MODEL_PLAN_SHARED"
	ActivityNewModelPlan                       ActivityType = "NEW_MODEL_PLAN"
	ActivityDatesChanged                       ActivityType = "DATES_CHANGED"
	ActivityDataExchangeApproachMarkedComplete ActivityType = "DATA_EXCHANGE_APPROACH_MARKED_COMPLETE"
	ActivityNewDiscussionAdded                 ActivityType = "NEW_DISCUSSION_ADDED"
	ActivityIDDOCQuestionnaireCompleted        ActivityType = "IDDOC_QUESTIONNAIRE_COMPLETED"
	ActivityIncorrectModelStatus               ActivityType = "INCORRECT_MODEL_STATUS"
)

// activityMetaDataTypeMap maps ActivityType to the corresponding ActivityMetaData struct type
// note it returns a constructor function so we can create a new instance when needed
var activityMetaDataTypeMap = map[ActivityType]func() ActivityMetaData{
	ActivityDigest:                             func() ActivityMetaData { return &DailyDigestCompleteActivityMeta{} },
	ActivityAddedAsCollaborator:                func() ActivityMetaData { return &AddedAsCollaboratorMeta{} },
	ActivityTaggedInDiscussion:                 func() ActivityMetaData { return &TaggedInPlanDiscussionActivityMeta{} },
	ActivityTaggedInDiscussionReply:            func() ActivityMetaData { return &TaggedInDiscussionReplyActivityMeta{} },
	ActivityNewDiscussionReply:                 func() ActivityMetaData { return &NewDiscussionRepliedActivityMeta{} },
	ActivityModelPlanShared:                    func() ActivityMetaData { return &ModelPlanSharedActivityMeta{} },
	ActivityNewModelPlan:                       func() ActivityMetaData { return &NewModelPlanActivityMeta{} },
	ActivityNewDiscussionAdded:                 func() ActivityMetaData { return &NewDiscussionAddedActivityMeta{} },
	ActivityDatesChanged:                       func() ActivityMetaData { return &DatesChangedActivityMeta{} },
	ActivityDataExchangeApproachMarkedComplete: func() ActivityMetaData { return &PlanDataExchangeApproachMarkedCompleteActivityMeta{} },
	ActivityIDDOCQuestionnaireCompleted:        func() ActivityMetaData { return &IDDOCQuestionnaireCompletedActivityMeta{} },
	ActivityIncorrectModelStatus:               func() ActivityMetaData { return &IncorrectModelStatusActivityMeta{} },
}

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

// ParseRawActivityMetaData conditionally parses the raw meta data JSON into the appropriate struct based on ActivityType
func (a *Activity) ParseRawActivityMetaData() error {
	var rawData []byte
	// Check if rawMetaDataJSON is already a string
	if str, ok := a.MetaDataRaw.(string); ok {
		// Convert string to byte array
		rawData = []byte(str)
	} else if bytes, ok := a.MetaDataRaw.([]byte); ok {
		// Use byte array directly
		rawData = bytes
	} else {
		// Invalid type, return an error
		return fmt.Errorf("unsupported type for activityData: %T", a.MetaDataRaw)
	}

	// Get the constructor function for the specific meta data type
	metaTypeInit, ok := activityMetaDataTypeMap[a.ActivityType]
	if !ok {
		return fmt.Errorf("no meta data type found for activity type: %s", a.ActivityType)
	}

	meta := metaTypeInit()
	if err := json.Unmarshal(rawData, &meta); err != nil {
		return fmt.Errorf("failed to unmarshal activity meta data for type %s: %w", a.ActivityType, err)
	}
	a.MetaData = meta
	return nil

}
