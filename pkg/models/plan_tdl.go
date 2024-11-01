package models

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/helpers"
)

// PlanTDL represents TDLs (Technical Direction Letters) related to a model plan
type PlanTDL struct {
	baseStruct
	modelPlanRelation
	IDNumber      string     `json:"idNumber" db:"id_number"`
	DateInitiated *time.Time `json:"dateInitiated" db:"date_initiated"`
	Title         string     `json:"title" db:"title"`
	Note          *string    `json:"note" db:"note"`
}

// NewPlanTDL returns a New PlanTDL
func NewPlanTDL(createdBy uuid.UUID, modelPlanID uuid.UUID) *PlanTDL {
	return &PlanTDL{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}

func (tdl *PlanTDL) ToEchimpTDL(associatedModelUids *uuid.UUID) *EChimpTDL {
	// get initiation date
	var initiationDate *string
	if tdl.DateInitiated != nil {
		initiationDate = helpers.PointerTo(tdl.DateInitiated.Format(time.DateOnly))
	}

	return &EChimpTDL{
		TdlNumber:           tdl.IDNumber,
		VersionNum:          "0",
		Initiator:           nil,
		FirstName:           nil,
		LastName:            nil,
		Title:               &tdl.Title,
		IssuedDate:          initiationDate, // TODO, is this right?
		Status:              nil,
		AssociatedModelUids: associatedModelUids, // associated ID is just the model plans ID
	}
}
