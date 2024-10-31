package models

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/helpers"
)

// PlanCR represents CRs (Change Requests) related to a model plan
type PlanCR struct {
	baseStruct
	modelPlanRelation
	IDNumber        string     `json:"idNumber" db:"id_number"`
	DateInitiated   *time.Time `json:"dateInitiated" db:"date_initiated"`
	DateImplemented *time.Time `json:"dateImplemented" db:"date_implemented"`
	Title           string     `json:"title" db:"title"`
	Note            *string    `json:"note" db:"note"`
}

// NewPlanCR returns a New PlanCR
func NewPlanCR(createdBy uuid.UUID, modelPlanID uuid.UUID) *PlanCR {
	return &PlanCR{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}

func (cr *PlanCR) ToEchimpCR(associatedModelUids *uuid.UUID) *EChimpCR {
	// get imp date
	var implementationDate *string
	if cr.DateImplemented != nil {
		implementationDate = helpers.PointerTo(cr.DateImplemented.Format(time.DateOnly))
	}

	// get cr summary from cr note
	var crSummary *TaggedContent
	if cr.Note != nil {
		crSummary = &TaggedContent{
			RawContent: HTML(*cr.Note),
		}
	}

	return &EChimpCR{
		CrNumber:            cr.IDNumber,
		VersionNum:          "0", // no local equivalent
		Initiator:           nil,
		FirstName:           nil,
		LastName:            nil,
		Title:               &cr.Title,
		SensitiveFlag:       nil,
		ImplementationDate:  implementationDate,
		CrSummary:           crSummary,
		CrStatus:            nil,
		EmergencyCrFlag:     nil,
		RelatedCrNumbers:    nil,
		RelatedCrTdlNumbers: nil,
		AssociatedModelUids: associatedModelUids, // associated ID is just the model plans ID
	}
}
