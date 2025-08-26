package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

// NewDiscussionAddedActivityMeta represents metadata for a "new discussion added" activity.
type NewDiscussionAddedActivityMeta struct {
	ActivityMetaBaseStruct
	discussionRelation
	modelPlanRelation
	UserName          string `json:"userName"`
	ModelPlanName     string `json:"modelPlanName"`
	ModelAbbreviation string `json:"modelAbbreviation"`
	Role              string `json:"role"`
	Content           string `json:"content"`
}

// newNewDiscussionAddedActivityMeta creates a NewDiscussionAddedActivityMeta.
// Increment version if/when this meta schema changes.
func newNewDiscussionAddedActivityMeta(
	planDiscussion *PlanDiscussion,
	modelPlan *ModelPlan,
	userName string,
	role string,
) *NewDiscussionAddedActivityMeta {
	version := 0
	return &NewDiscussionAddedActivityMeta{
		ActivityMetaBaseStruct: NewActivityMetaBaseStruct(ActivityNewDiscussionReply, version),
		discussionRelation:     NewDiscussionRelation(planDiscussion.ID),
		modelPlanRelation:      NewModelPlanRelation(modelPlan.ID),
		UserName:               userName,
		ModelPlanName:          modelPlan.ModelName,
		ModelAbbreviation:      ValueOrEmpty(modelPlan.Abbreviation),
		Role:                   role,
		Content:                planDiscussion.Content.RawContent.String(),
	}
}

// NewNewDiscussionAddedActivity creates an Activity for a newly added discussion.
// NOTE: If your convention is to set EntityID to the model ID (rather than the discussion ID),
// swap DiscussionID for ModelID below.
func NewNewDiscussionAddedActivity(
	planDiscussion *PlanDiscussion,
	modelPlan *ModelPlan,
	actorID uuid.UUID,
	userName string,
	role string,
) *Activity {
	return &Activity{
		baseStruct:   NewBaseStruct(actorID),
		ActorID:      actorID,
		EntityID:     planDiscussion.ID,
		ActivityType: ActivityNewDiscussionAdded,
		MetaData: newNewDiscussionAddedActivityMeta(
			planDiscussion,
			modelPlan,
			userName,
			role,
		),
	}
}

// Value allows writing the meta to the database (JSONB)
func (m NewDiscussionAddedActivityMeta) Value() (driver.Value, error) {
	j, err := json.Marshal(m)
	return j, err
}

// Scan loads the meta from the database (JSONB)
func (m *NewDiscussionAddedActivityMeta) Scan(src interface{}) error {
	if src == nil {
		return nil
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, m)
	if err != nil {
		return err
	}

	return nil
}
