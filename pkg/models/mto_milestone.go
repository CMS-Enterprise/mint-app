package models

import (
	"time"

	"github.com/google/uuid"
)

type MTOMilestoneStatus string

const (
	MTMNotStarted MTOMilestoneStatus = "NOT_STARTED"
	MTMInProgress MTOMilestoneStatus = "IN_PROGRESS"
	MTMCompleted  MTOMilestoneStatus = "COMPLETED"
)

// mtoMilestoneHumanized maps MTO milestone Statuses to a human-readable string
var mtoMilestoneHumanized = map[MTOMilestoneStatus]string{
	MTMNotStarted: "Not Started",
	MTMInProgress: "In Progress",
	MTMCompleted:  "Completed",
}

// Humanize returns the human-readable string of a MTO milestone Status
// if a value is not found for the provided status, an empty string is returned
func (m MTOMilestoneStatus) Humanize() string {
	//Future Enhancement, consider implementing the shared translation to make this work
	return mtoMilestoneHumanized[m]
}

// MTOMilestoneWithSolutionID wraps an MTOMilestone with a solution id. It is useful for referring to milestones that are linked to specific solutions
type MTOMilestoneWithSolutionID struct {
	MTOMilestone
	SolutionID uuid.UUID `json:"solutionID" db:"solution_id"`
}

func (mto *MTOMilestoneWithSolutionID) ToMTOMilestone() *MTOMilestone {
	return &mto.MTOMilestone
}

// MTOMilestoneWithNewlyInsertedStatus wraps MTOMilestone as well as a newly inserted status
// it is useful for checking if a milestone was just added, so an email can be sent
type MTOMilestoneWithNewlyInsertedStatus struct {
	MTOMilestone
	NewlyInserted bool `json:"newlyInserted" db:"newly_inserted"`
}

// ToMTOMilestone returns the MTOMilestone object from the MTOMilestoneWithNewlyInsertedStatus
func (mto *MTOMilestoneWithNewlyInsertedStatus) ToMTOMilestone() *MTOMilestone {
	return &mto.MTOMilestone
}

type MTOMilestone struct {
	baseStruct
	modelPlanRelation

	Name        *string                `json:"name" db:"name"` // From Common Milestone Table if linked
	Description *string                `json:"description" db:"description"`
	Key         *MTOCommonMilestoneKey `json:"key" db:"mto_common_milestone_key"` // Foreign Key to the Common Milestone Table

	MTOCategoryID        *uuid.UUID                                  `json:"mtoCategoryID" db:"mto_category_id"`
	ResponsibleComponent EnumArray[MTOMilestoneResponsibleComponent] `json:"responsibleComponent" db:"responsible_component"`
	FacilitatedBy        *EnumArray[MTOFacilitator]                  `json:"facilitatedBy" db:"facilitated_by"`
	FacilitatedByOther   *string                                     `json:"facilitatedByOther" db:"facilitated_by_other"`
	AssignedTo           *uuid.UUID                                  `json:"assignedTo" db:"assigned_to"`
	NeedBy               *time.Time                                  `json:"needBy" db:"need_by"`
	Status               MTOMilestoneStatus                          `json:"status" db:"status"`
	RiskIndicator        MTORiskIndicator                            `json:"riskIndicator" db:"risk_indicator"`
	IsDraft              bool                                        `json:"isDraft" db:"is_draft"`
}

// AddedFromMilestoneLibrary returns true or false if this was added from the common milestone library.
// It simply checks if the common  milestone id is populated or not
func (m *MTOMilestone) AddedFromMilestoneLibrary() bool {
	return m.Key != nil
}

// NewMTOMilestone returns a new mtoMileMTOMilestone object
func NewMTOMilestone(createdBy uuid.UUID, name *string, description *string, commonMilestoneKey *MTOCommonMilestoneKey, modelPlanID uuid.UUID, mtoCategoryID *uuid.UUID) *MTOMilestone {
	return &MTOMilestone{
		Name:                 name,
		Description:          description,
		baseStruct:           NewBaseStruct(createdBy),
		modelPlanRelation:    NewModelPlanRelation(modelPlanID),
		Key:                  commonMilestoneKey,
		MTOCategoryID:        mtoCategoryID,
		IsDraft:              true,
		RiskIndicator:        MTORiskIndicatorOnTrack,
		Status:               MTMNotStarted,
		ResponsibleComponent: []MTOMilestoneResponsibleComponent{},
	}
}
