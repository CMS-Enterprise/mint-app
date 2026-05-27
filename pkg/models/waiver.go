package models

import "github.com/google/uuid"

// Waiver represents a model plan's decision on whether to use a specific waiver
type Waiver struct {
	baseStruct
	modelPlanRelation

	CommonWaiverID uuid.UUID `json:"commonWaiverID" db:"common_waiver_id"`
	WillUseWaiver  *bool     `json:"willUseWaiver" db:"will_use_waiver"`
	NotUsingReason *string   `json:"notUsingReason" db:"not_using_reason"`
}

// NewWaiver returns a new Waiver object
func NewWaiver(createdBy uuid.UUID, modelPlanID uuid.UUID, commonWaiverID uuid.UUID) *Waiver {
	return &Waiver{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		CommonWaiverID:    commonWaiverID,
	}
}

// SuggestedWaiver represents a waiver MINT has determined is likely needed for a model plan
type SuggestedWaiver struct {
	baseStruct
	modelPlanRelation

	CommonWaiverID uuid.UUID `json:"commonWaiverID" db:"common_waiver_id"`
}

// NewSuggestedWaiver returns a new SuggestedWaiver object
func NewSuggestedWaiver(createdBy uuid.UUID, modelPlanID uuid.UUID, commonWaiverID uuid.UUID) *SuggestedWaiver {
	return &SuggestedWaiver{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		CommonWaiverID:    commonWaiverID,
	}
}
