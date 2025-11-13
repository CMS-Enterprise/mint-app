package models

type ModelPlanStatusGroup string

var ModelPlanStatusGroupToModelStatus = map[ModelPlanStatusGroup][]ModelStatus{
	ModelPlanStatusGroupPreClearance: {ModelStatusPlanDraft, ModelStatusPlanComplete, ModelStatusIcipComplete},
	ModelPlanStatusGroupInClearance:  {ModelStatusInternalCmmiClearance, ModelStatusCmsClearance, ModelStatusHhsClearance, ModelStatusOmbAsrfClearance},
	ModelPlanStatusGroupCleared:      {ModelStatusCleared},
	ModelPlanStatusGroupAnnounced:    {ModelStatusAnnounced},
	ModelPlanStatusGroupActive:       {ModelStatusActive},
	ModelPlanStatusGroupEnded:        {ModelStatusEnded},
	ModelPlanStatusGroupCanceled:     {ModelStatusCanceled},
	ModelPlanStatusGroupPaused:       {ModelStatusPaused},
}

const (
	ModelPlanStatusGroupPreClearance ModelPlanStatusGroup = "PRE_CLEARANCE"
	ModelPlanStatusGroupInClearance  ModelPlanStatusGroup = "IN_CLEARANCE"
	ModelPlanStatusGroupCleared      ModelPlanStatusGroup = "CLEARED"
	ModelPlanStatusGroupAnnounced    ModelPlanStatusGroup = "ANNOUNCED"
	ModelPlanStatusGroupActive       ModelPlanStatusGroup = "ACTIVE"
	ModelPlanStatusGroupEnded        ModelPlanStatusGroup = "ENDED"
	ModelPlanStatusGroupCanceled     ModelPlanStatusGroup = "CANCELED"
	ModelPlanStatusGroupPaused       ModelPlanStatusGroup = "PAUSED"
)
