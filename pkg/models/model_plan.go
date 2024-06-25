package models

import (
	"time"

	"github.com/google/uuid"
)

// ModelPlan is the top-level object for an entire draft model plan
type ModelPlan struct {
	baseStruct
	ModelName    string      `json:"modelName" db:"model_name"`
	Abbreviation *string     `json:"abbreviation" db:"abbreviation"`
	Archived     bool        `json:"archived" db:"archived"`
	Status       ModelStatus `json:"status" db:"status"`
}

// NewModelPlan returns a new unarchived model plan with a default status of ModelStatusPlanDraft
func NewModelPlan(createdBy uuid.UUID, modelName string) *ModelPlan {
	return &ModelPlan{
		ModelName:  modelName,
		baseStruct: NewBaseStruct(createdBy),
		Archived:   false,
		Status:     ModelStatusPlanDraft,
	}
}

// NewModelPlanFull returns a new model plan with all fields set
func NewModelPlanFull(
	id uuid.UUID,
	modelName string,
	abbreviation *string,
	archived bool,
	status ModelStatus,
	createdBy uuid.UUID,
	createdDts time.Time,
	modifiedBy *uuid.UUID,
	modifiedDts *time.Time,
) *ModelPlan {
	mp := ModelPlan{
		ModelName:    modelName,
		Abbreviation: abbreviation,
		Archived:     archived,
		Status:       status,
		baseStruct:   NewBaseStruct(createdBy),
	}

	mp.ID = id
	mp.CreatedDts = createdDts
	mp.ModifiedBy = modifiedBy
	mp.ModifiedDts = modifiedDts

	return &mp
}

func (m ModelPlan) isLinkedExistingModel() {}

// GetModelPlanID returns the modelPlanID of the task list section
func (m ModelPlan) GetModelPlanID() uuid.UUID {
	return m.ID
}

// ModelCategory represents the category of a model
type ModelCategory string

// These constants represent the different values of ModelCategory
const (
	MCAccountableCare            ModelCategory = "ACCOUNTABLE_CARE"
	MCDiseaseSpecificAndEpisodic ModelCategory = "DISEASE_SPECIFIC_AND_EPISODIC"
	MCHealthPlan                 ModelCategory = "HEALTH_PLAN"
	MCPrescriptionDrug           ModelCategory = "PRESCRIPTION_DRUG"
	MCStateBased                 ModelCategory = "STATE_BASED"
	MCStatutory                  ModelCategory = "STATUTORY"
	MCToBeDetermined             ModelCategory = "TO_BE_DETERMINED"
)

// ModelCategoryHumanized maps ModelCategory to a human-readable string
var ModelCategoryHumanized = map[ModelCategory]string{
	MCAccountableCare:            "Accountable Care",
	MCDiseaseSpecificAndEpisodic: "Disease-Specific & Episodic",
	MCHealthPlan:                 "Health Plan",
	MCPrescriptionDrug:           "Prescription Drug",
	MCStateBased:                 "State-Based",
	MCStatutory:                  "Statutory",
	MCToBeDetermined:             "To be determined",
}

// ModelStatus represents the possible statuses of a Model Plan
type ModelStatus string

// These constants represent the different values of ModelStatus
const (
	ModelStatusPlanDraft             ModelStatus = "PLAN_DRAFT"
	ModelStatusPlanComplete          ModelStatus = "PLAN_COMPLETE"
	ModelStatusIcipComplete          ModelStatus = "ICIP_COMPLETE"
	ModelStatusInternalCmmiClearance ModelStatus = "INTERNAL_CMMI_CLEARANCE"
	ModelStatusCmsClearance          ModelStatus = "CMS_CLEARANCE"
	ModelStatusHhsClearance          ModelStatus = "HHS_CLEARANCE"
	ModelStatusOmbAsrfClearance      ModelStatus = "OMB_ASRF_CLEARANCE"
	ModelStatusCleared               ModelStatus = "CLEARED"
	ModelStatusAnnounced             ModelStatus = "ANNOUNCED"
	ModelStatusActive                ModelStatus = "ACTIVE"
	ModelStatusEnded                 ModelStatus = "ENDED"
	ModelStatusPaused                ModelStatus = "PAUSED"
	ModelStatusCanceled              ModelStatus = "CANCELED"
)

// ModelStatusHumanized maps ModelStatus to a human-readable string
var ModelStatusHumanized = map[ModelStatus]string{
	ModelStatusPlanDraft:             "Draft model plan",
	ModelStatusPlanComplete:          "Model plan complete",
	ModelStatusIcipComplete:          "ICIP complete",
	ModelStatusInternalCmmiClearance: "Internal (CMMI) clearance",
	ModelStatusCmsClearance:          "CMS clearance",
	ModelStatusHhsClearance:          "HHS clearance",
	ModelStatusOmbAsrfClearance:      "OMB/ASRF clearance",
	ModelStatusCleared:               "Cleared",
	ModelStatusAnnounced:             "Announced",
	ModelStatusActive:                "Active",
	ModelStatusEnded:                 "Ended",
	ModelStatusPaused:                "Paused",
	ModelStatusCanceled:              "Canceled",
}

// Humanize returns the human-readable string of a Model Status
// if a value is not found for the provided status, an empty string is returned
func (ms ModelStatus) Humanize() string {
	return ModelStatusHumanized[ms]
}

// ValueOrEmpty returns either the string value of the Filter, or an empty string if it is nil
func (mvf *ModelViewFilter) ValueOrEmpty() string {
	if mvf == nil {
		return ""
	}
	return string(*mvf)
}

// ModelViewFilter represents the possible filters for a model plan view
type ModelViewFilter string

// These constants represent the different values of ModelViewFilter
const (
	ModelViewFilterChronicConditionsWarehouse                       ModelViewFilter = "CCW"
	ModelViewFilterCmmiCostEstimate                                 ModelViewFilter = "CMMI"
	ModelViewFilterConsolidatedBusinessOperationsSupportCenter      ModelViewFilter = "CBOSC"
	ModelViewFilterDivisionOfFinancialServicesAndDebtManagement     ModelViewFilter = "DFSDM"
	ModelViewFilterInnovationPaymentContractor                      ModelViewFilter = "IPC"
	ModelViewFilterInnovativeDesignDevelopmentAndOperationsContract ModelViewFilter = "IDDOC"
	ModelViewFilterMasterDataManagement                             ModelViewFilter = "MDM"
	ModelViewFilterOfficeOfTheActuary                               ModelViewFilter = "OACT"
	ModelViewFilterProviderBillingGroup                             ModelViewFilter = "PBG"
)

// ModelViewFilterHumanized maps ModelViewFilter to a human-readable string
var ModelViewFilterHumanized = map[ModelViewFilter]string{
	ModelViewFilterChronicConditionsWarehouse:                       "Chronic Conditions Warehouse",
	ModelViewFilterCmmiCostEstimate:                                 "CMMI Cost Estimate",
	ModelViewFilterConsolidatedBusinessOperationsSupportCenter:      "Consolidated Business Operations Support Center",
	ModelViewFilterDivisionOfFinancialServicesAndDebtManagement:     "Division of Financial Services and Debt Management",
	ModelViewFilterInnovationPaymentContractor:                      "Innovation Payment Contractor",
	ModelViewFilterInnovativeDesignDevelopmentAndOperationsContract: "Innovative Design Development and Operations Contract",
	ModelViewFilterMasterDataManagement:                             "Master Data Management",
	ModelViewFilterOfficeOfTheActuary:                               "Office of the Actuary",
	ModelViewFilterProviderBillingGroup:                             "Provider Billing Group",
}
