package models

import "github.com/google/uuid"

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

// GetModelPlanID returns the modelPlanID of the task list section
func (m ModelPlan) GetModelPlanID() uuid.UUID {
	return m.ID
}

// ModelCategory represents the category of a model
type ModelCategory string

// These constants represent the different values of ModelCategory
const (
	MCAccountableCare           ModelCategory = "ACCOUNTABLE_CARE"
	MCDemonstration             ModelCategory = "DEMONSTRATION"
	MCEBPaymentInitiatives      ModelCategory = "EPISODE_BASED_PAYMENT_INITIATIVES"
	MCMedicaidAndChip           ModelCategory = "INIT_MEDICAID_CHIP_POP"
	MCMedicareAndMedicaid       ModelCategory = "INIT__MEDICARE_MEDICAID_ENROLLEES"
	MCAccelerateDevAndTest      ModelCategory = "INIT_ACCEL_DEV_AND_TEST"
	MCSpeedBestPracticeAdopt    ModelCategory = "INIT_SPEED_ADOPT_BEST_PRACTICE"
	MCPrimaryCareTransformation ModelCategory = "PRIMARY_CARE_TRANSFORMATION"
	MCTBD                       ModelCategory = "UNKNOWN"
)

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
)

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
	ModelViewFilterIntegratedDataRepository                         ModelViewFilter = "IDR"
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
	ModelViewFilterIntegratedDataRepository:                         "Integrated Data Repository",
	ModelViewFilterOfficeOfTheActuary:                               "Office of the Actuary",
	ModelViewFilterProviderBillingGroup:                             "Provider Billing Group",
}
