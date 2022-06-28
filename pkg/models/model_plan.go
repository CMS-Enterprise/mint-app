package models

import (
	"database/sql/driver"
	"time"

	"github.com/google/uuid"
)

// ModelPlan is the top-level object for an entire draft model plan
type ModelPlan struct {
	ID            uuid.UUID      `json:"id" db:"id"`
	ModelName     string         `json:"modelName" db:"model_name"`
	ModelCategory *ModelCategory `json:"modelCategory" db:"model_category"`
	CMSCenters    CMSCenterG     `json:"cmsCenters" db:"cms_centers"`
	CMSOther      *string        `json:"cmsOther" db:"cms_other"`
	CMMIGroups    CMMIGroupG     `json:"cmmiGroups" db:"cmmi_groups"`
	Archived      bool           `json:"archived" db:"archived"`
	Status        ModelStatus    `json:"status" db:"status"`
	CreatedBy     string         `json:"createdBy" db:"created_by"`
	CreatedDts    time.Time      `json:"createdDts" db:"created_dts"`
	ModifiedBy    *string        `json:"modifiedBy" db:"modified_by"`
	ModifiedDts   *time.Time     `json:"modifiedDts" db:"modified_dts"`
}

//CMSCenterG is an array of CMSCenter
type CMSCenterG []CMSCenter

//CMMIGroupG is an array of CMMIGroup
type CMMIGroupG []CMMIGroup

// GetModelTypeName returns a string name that represents the ModelPlan struct
func (m ModelPlan) GetModelTypeName() string {
	return "Model_Plan"
}

// GetPlanID returns the ModifiedBy property for a ModelPlan struct
func (m ModelPlan) GetPlanID() uuid.UUID {
	return m.ID
}

// GetModifiedBy returns the ModifiedBy property for a ModelPlan struct
func (m ModelPlan) GetModifiedBy() *string {
	return m.ModifiedBy
}

// GetCreatedBy implements the CreatedBy property
func (m ModelPlan) GetCreatedBy() string {
	return m.CreatedBy
}

//Scan is used by sql.scan to read the values from the DB
func (a *CMSCenterG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

// Value implements the driver.Valuer interface.
func (a CMSCenterG) Value() (driver.Value, error) {
	return GenericValue(a)
}

//Scan is used by sql.scan to read the values from the DB
func (a *CMMIGroupG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

// Value implements the driver.Valuer interface.
func (a CMMIGroupG) Value() (driver.Value, error) {
	return GenericValue(a)
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

//  CMMIGroup representes the group at CMMI
type CMMIGroup string

// These constancs represent the different values of a CMMIGroup
const (
	CMMIPatientCareModels                       CMMIGroup = "PATIENT_CARE_MODELS_GROUP"
	CMMIPolicyAndPrograms                       CMMIGroup = "POLICY_AND_PROGRAMS_GROUP"
	CMMIPreventiveAndPopulationHealthCareModels CMMIGroup = "PREVENTIVE_AND_POPULATION_HEALTH_CARE_MODELS_GROUP"
	CMMISeamlessCareModels                      CMMIGroup = "SEAMLESS_CARE_MODELS_GROUP"
	CMMIStateInnovations                        CMMIGroup = "STATE_INNOVATIONS_GROUP"
	CMMITBD                                     CMMIGroup = "TBD"
)

// CMSCenter represents a CMS center
type CMSCenter string

// These constants represent the different values of CMSCenter
const (
	CMSCMMI                                 CMSCenter = "CMMI"
	CMSCenterForMedicare                    CMSCenter = "CENTER_FOR_MEDICARE"
	CMSFederalCoordinatedHealthCareOffice   CMSCenter = "FEDERAL_COORDINATED_HEALTH_CARE_OFFICE"
	CMSCenterForClinicalStandardsAndQuality CMSCenter = "CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY"
	CMSCenterForProgramIntegrity            CMSCenter = "CENTER_FOR_PROGRAM_INTEGRITY"
	CMSOther                                CMSCenter = "OTHER"
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
)
