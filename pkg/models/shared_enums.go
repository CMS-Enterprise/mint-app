package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// ModelCategory represents the category of a model
type ModelCategory string

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

type TeamRole string

const (
	TeamRoleModelLead  TeamRole = "MODEL_LEAD"
	TeamRoleModelTeam  TeamRole = "MODEL_TEAM"
	TeamRoleLeadership TeamRole = "LEADERSHIP"
	TeamRoleLearning   TeamRole = "LEARNING"
	TeamRoleEvaluation TeamRole = "EVALUATION"
)

/*

	ACCOUNTABLE_CARE,
	DEMONSTRATION,
	EPISODE_BASED_PAYMENT_INITIATIVES,
	INIT_MEDICAID_CHIP_POP,
	INIT__MEDICARE_MEDICAID_ENROLLEES,
	--INITIATIVES TO ACCELERATE THE DEVELOPMENT AND TESTING OF NEW PAYMENT AND SERVICE DELIVERY MODELS, --TOO BIG
	INIT_ACCEL_DEV_AND_TEST,
	INIT_SPEED_ADOPT_BEST_PRACTICE,
	PRIMARY_CARE_TRANSFORMATION,
	UNKNOWN
*/

// CMSCenter represents a CMS center
type CMSCenter string

const (
	CMSCMMI                                 CMSCenter = "CMMI"
	CMSCenterForMedicare                    CMSCenter = "CENTER_FOR_MEDICARE"
	CMSFederalCoordinatedHealthCareOffice   CMSCenter = "FEDERAL_COORDINATED_HEALTH_CARE_OFFICE"
	CMSCenterForClinicalStandardsAndQuality CMSCenter = "CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY"
	CMSCenterForProgramIntegrity            CMSCenter = "CENTER_FOR_PROGRAM_INTEGRITY"
	CMSOther                                CMSCenter = "OTHER"
)

//  CMMIGroup representes the group at CMMI
// type CMMIGroup EnumString

// const (
// 	CMMIPatientCareModels                       CMMIGroup = "PATIENT_CARE_MODELS_GROUP"
// 	CMMIPolicyAndPrograms                       CMMIGroup = "POLICY_AND_PROGRAMS_GROUP"
// 	CMMIPreventiveAndPopulationHealthCareModels CMMIGroup = "PREVENTIVE_AND_POPULATION_HEALTH_CARE_MODELS_GROUP"
// 	CMMISeamlessCareModels                      CMMIGroup = "SEAMLESS_CARE_MODELS_GROUP"
// 	CMMIStateInnovations                        CMMIGroup = "STATE_INNOVATIONS_GROUP"
// 	CMMITBD                                     CMMIGroup = "TBD"
// )

type ModelType string

const (
	MTVoluntary ModelType = "VOLUNTARY"
	MTMandatory ModelType = "MANDATORY"
	MTTBD       ModelType = "TBD"
)

type TriStateAnswer string

const (
	TriYes TriStateAnswer = "YES"
	TriNo  TriStateAnswer = "NO"
	TriTBD TriStateAnswer = "TBD" //Can also handle unsure
)

type TaskStatus string

const (
	TaskReady      TaskStatus = "READY"
	TaskInProgress TaskStatus = "IN_PROGRESS"
	TaskComplete   TaskStatus = "COMPLETE"
)

type EnumString string
type EnumArray []EnumString

// type EnumArray []interface{}

//inherit the type from enum array
type CMMIGroupSelection EnumArray

func (e EnumArray) Value() (driver.Value, error) {
	j, err := json.Marshal(e)
	return j, err

}

//Scan is used by sql.scan to read the values from the DB
func (e *EnumArray) Scan(src interface{}) error {
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}

	var i interface{}
	err := json.Unmarshal(source, &i)
	if err != nil {
		return err
	}

	*e, ok = i.([]EnumString)
	// *e, ok = i.([]interface{})
	if !ok {
		return errors.New("type assertion .([]string) failed")
	}

	return nil
}
