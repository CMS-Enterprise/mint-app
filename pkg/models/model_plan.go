package models

import (
	"github.com/google/uuid"
)

// ModelPlan is the top-level object for an entire draft model plan
type ModelPlan struct {
	baseStruct
	ModelName              string      `json:"modelName" db:"model_name"`
	Abbreviation           *string     `json:"abbreviation" db:"abbreviation"`
	Archived               bool        `json:"archived" db:"archived"`
	Status                 ModelStatus `json:"status" db:"status"`
	PreviousSuggestedPhase *ModelPhase `json:"previousSuggestedPhase" db:"previous_suggested_phase"`
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

// modelStatusChronologicalIndex maps ModelStatus to a chronological index as defined by product
// A lower index indicates an earlier status. If a value is not found for the provided status, -1 is returned.
// This allows for easy comparison of statuses, which is useful for status calculation strategies
var modelStatusChronologicalIndex = map[ModelStatus]int{
	ModelStatusPlanDraft:             0,
	ModelStatusPlanComplete:          1,
	ModelStatusIcipComplete:          2,
	ModelStatusInternalCmmiClearance: 3,
	ModelStatusCmsClearance:          4,
	ModelStatusHhsClearance:          5,
	ModelStatusOmbAsrfClearance:      6,
	ModelStatusCleared:               7,
	ModelStatusAnnounced:             8,
	ModelStatusActive:                9,
	ModelStatusEnded:                 10,
	ModelStatusPaused:                11,
	ModelStatusCanceled:              12,
}

// GetModelStatusChronologicalIndex returns the chronological index of the ModelStatus
// If a value is not found for the provided status, -1 is returned
func GetModelStatusChronologicalIndex(ms ModelStatus) int {
	index, ok := modelStatusChronologicalIndex[ms]
	if !ok {
		return -1
	}

	return index
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

// ModelShareSection is the section of the model plan that is being shared.
type ModelShareSection string

const (
	// // Include all sections below
	// ModelShareSectionAll ModelShareSection = "ALL"
	// Just share the model plan
	ModelShareSectionModelPlan ModelShareSection = "MODEL_PLAN"
	// Share all MTO info
	ModelShareSectionMtoAll ModelShareSection = "MTO_ALL"
	// Only share MTO Milestones
	ModelShareSectionMtoMilestones ModelShareSection = "MTO_MILESTONES"
	// Only share MTO Solutions
	ModelShareSectionMtoSolutions ModelShareSection = "MTO_SOLUTIONS"
)

var ModelShareSectionToRouteTranslation = map[ModelShareSection]string{
	// ModelShareSectionAll:           "model-basics",
	ModelShareSectionModelPlan:     "model-basics",
	ModelShareSectionMtoAll:        "milestones",
	ModelShareSectionMtoMilestones: "milestones",
	ModelShareSectionMtoSolutions:  "it-systems-and-solutions",
}

// todo, we might need to say "View this models to operations matrix" in the email

// ModelShareSectionHumanized controls what the email says after View _ details in MINT.
var ModelShareSectionHumanized = map[ModelShareSection]string{
	// ModelShareSectionAll:           "more",
	ModelShareSectionModelPlan:     "more",
	ModelShareSectionMtoAll:        "models to operations matrix",
	ModelShareSectionMtoMilestones: "models to operations matrix",
	ModelShareSectionMtoSolutions:  "models to operations matrix",
}

type ModelPhase string

const (
	ModelPhaseIcipComplete ModelPhase = "ICIP_COMPLETE"
	ModelPhaseInClearance  ModelPhase = "IN_CLEARANCE"
	ModelPhaseCleared      ModelPhase = "CLEARED"
	ModelPhaseAnnounced    ModelPhase = "ANNOUNCED"
	ModelPhaseActive       ModelPhase = "ACTIVE"
	ModelPhaseEnded        ModelPhase = "ENDED"
)
