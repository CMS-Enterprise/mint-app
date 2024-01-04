package models

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
	"github.com/cmsgov/mint-app/pkg/sqlutils/sqlscripts"
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

//TODO: perhaps only export the save function so it only makes a record if the UUID is not nil, the toehr is a holdover from explicitly specifying a UUID

// createDBRecord Saves the inital model plan record to the database
func (m *ModelPlan) createDBRecord(np sqlutils.NamedPreparer, logger *zap.Logger) (*ModelPlan, error) {

	if m.ID == uuid.Nil { //TODO, should we always just make a new ID for this?
		m.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(sqlscripts.ModelPlanCreateSQL)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create model plan with error %s", err),
			zap.String("user", m.CreatedBy.String()),
		)
		return nil, err
	}
	defer stmt.Close()

	retPlan := ModelPlan{}

	m.ModifiedBy = nil
	m.ModifiedDts = nil

	err = stmt.Get(&retPlan, m)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create model plan with error %s", err),
			zap.String("user", m.CreatedBy.String()),
		)
		return nil, err

	}

	return &retPlan, nil

}

// updateDBRecord updates the db model
func (m *ModelPlan) updateDBRecord(np sqlutils.NamedPreparer, logger *zap.Logger) (*ModelPlan, error) {
	stmt, err := np.PrepareNamed(sqlscripts.ModelPlanUpdateSQL)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update system intake %s", err),
			zap.String("id", m.ID.String()),
			zap.String("user", UUIDValueOrEmpty(m.ModifiedBy)),
		)
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(m, m)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to update system intake %s", err),
			zap.String("id", m.ID.String()),
			zap.String("user", UUIDValueOrEmpty(m.ModifiedBy)),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Model:     m,
			Operation: apperrors.QueryUpdate,
		}
	}

	return m, nil
}

// SaveToDatabase will interacts with the model plan table in the db
// it will create a db record if the ID is nil
// or will update it if it is not nil
func (m *ModelPlan) SaveToDatabase(np sqlutils.NamedPreparer, logger *zap.Logger) (*ModelPlan, error) {
	if m.ID == uuid.Nil {
		return m.createDBRecord(np, logger)
	}
	return m.updateDBRecord(np, logger)
}
