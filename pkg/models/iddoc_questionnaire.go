package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// IDDOCQuestionnaireStatus represents the work completion status of an IDDOC questionnaire
type IDDOCQuestionnaireStatus string

// These constants represent the different values of IDDOCQuestionnaireStatus
const (
	IDDOCQuestionnaireReady      IDDOCQuestionnaireStatus = "READY"
	IDDOCQuestionnaireInProgress IDDOCQuestionnaireStatus = "IN_PROGRESS"
	IDDOCQuestionnaireComplete   IDDOCQuestionnaireStatus = "COMPLETE"
)

// IDDOCQuestionnaireTaskListStatus represents the combined status for task list display
type IDDOCQuestionnaireTaskListStatus string

// These constants represent the different values of IDDOCQuestionnaireTaskListStatus
const (
	IDDOCQuestionnaireTaskListStatusNotNeeded  IDDOCQuestionnaireTaskListStatus = "NOT_NEEDED"
	IDDOCQuestionnaireTaskListStatusReady      IDDOCQuestionnaireTaskListStatus = "READY"
	IDDOCQuestionnaireTaskListStatusInProgress IDDOCQuestionnaireTaskListStatus = "IN_PROGRESS"
	IDDOCQuestionnaireTaskListStatusComplete   IDDOCQuestionnaireTaskListStatus = "COMPLETE"
)

// IDDOCFileType represents the types of files that can be exchanged
type IDDOCFileType string

// IDDOCFileTypeArray represents an array of IDDOCFileType
type IDDOCFileTypeArray []IDDOCFileType

// Value converts IDDOCFileTypeArray to a database value
func (a IDDOCFileTypeArray) Value() (driver.Value, error) {
	if a == nil {
		return nil, nil
	}
	stringArray := make([]string, len(a))
	for i, v := range a {
		stringArray[i] = string(v)
	}
	return pq.StringArray(stringArray).Value()
}

// Scan converts a database value to IDDOCFileTypeArray
func (a *IDDOCFileTypeArray) Scan(src interface{}) error {
	var stringArray pq.StringArray
	if err := stringArray.Scan(src); err != nil {
		return err
	}
	*a = make(IDDOCFileTypeArray, len(stringArray))
	for i, v := range stringArray {
		(*a)[i] = IDDOCFileType(v)
	}
	return nil
}

// MarshalJSON converts IDDOCFileTypeArray to JSON
func (a IDDOCFileTypeArray) MarshalJSON() ([]byte, error) {
	return json.Marshal([]IDDOCFileType(a))
}

// UnmarshalJSON converts JSON to IDDOCFileTypeArray
func (a *IDDOCFileTypeArray) UnmarshalJSON(data []byte) error {
	var arr []IDDOCFileType
	if err := json.Unmarshal(data, &arr); err != nil {
		return err
	}
	*a = IDDOCFileTypeArray(arr)
	return nil
}

// IDDOCQuestionnaire represents the IDDOC questionnaire for a model plan
type IDDOCQuestionnaire struct {
	baseStruct
	modelPlanRelation
	completedByRelation

	// Questionnaire fields - Page 1 Operations
	TechnicalContactsIdentified       *bool      `json:"technicalContactsIdentified" db:"technical_contacts_identified"`
	TechnicalContactsIdentifiedDetail *string    `json:"technicalContactsIdentifiedDetail" db:"technical_contacts_identified_detail"`
	TechnicalContactsIdentifiedNote   *string    `json:"technicalContactsIdentifiedNote" db:"technical_contacts_identified_note"`
	CaptureParticipantInfo            *bool      `json:"captureParticipantInfo" db:"capture_participant_info"`
	CaptureParticipantInfoNote        *string    `json:"captureParticipantInfoNote" db:"capture_participant_info_note"`
	IcdOwner                          *string    `json:"icdOwner" db:"icd_owner"`
	DraftIcdDueDate                   *time.Time `json:"draftIcdDueDate" db:"draft_icd_due_date"`
	IcdNote                           *string    `json:"icdNote" db:"icd_note"`

	// Page 2 Testing
	UatNeeds                  *string            `json:"uatNeeds" db:"uat_needs"`
	StcNeeds                  *string            `json:"stcNeeds" db:"stc_needs"`
	TestingTimelines          *string            `json:"testingTimelines" db:"testing_timelines"`
	TestingNote               *string            `json:"testingNote" db:"testing_note"`
	DataMonitoringFileTypes   IDDOCFileTypeArray `json:"dataMonitoringFileTypes" db:"data_monitoring_file_types"`
	DataMonitoringFileOther   *string            `json:"dataMonitoringFileOther" db:"data_monitoring_file_other"`
	DataResponseType          *string            `json:"dataResponseType" db:"data_response_type"`
	DataResponseFileFrequency *string            `json:"dataResponseFileFrequency" db:"data_response_file_frequency"`

	// Page 3 Monitoring
	DataFullTimeOrIncremental      *string `json:"dataFullTimeOrIncremental" db:"data_full_time_or_incremental"`
	EftSetUp                       *bool   `json:"eftSetUp" db:"eft_set_up"`
	UnsolicitedAdjustmentsIncluded *bool   `json:"unsolicitedAdjustmentsIncluded" db:"unsolicited_adjustments_included"`
	DataFlowDiagramsNeeded         *bool   `json:"dataFlowDiagramsNeeded" db:"data_flow_diagrams_needed"`
	ProduceBenefitEnhancementFiles *bool   `json:"produceBenefitEnhancementFiles" db:"produce_benefit_enhancement_files"`
	FileNamingConventions          *string `json:"fileNamingConventions" db:"file_naming_conventions"`
	DataMonitoringNote             *string `json:"dataMonitoringNote" db:"data_monitoring_note"`

	// Metadata
	Needed bool                     `json:"needed" db:"needed"` // Whether questionnaire is required (controlled by triggers)
	Status IDDOCQuestionnaireStatus `json:"status" db:"status"` // Work status enum (READY, IN_PROGRESS, COMPLETE)
}

// IsComplete returns whether the questionnaire has been marked as complete
func (iddoc *IDDOCQuestionnaire) IsComplete() bool {
	return iddoc.Status == IDDOCQuestionnaireComplete
}

// TaskListStatus returns the combined task list status for display.
// It combines the needed field with work status to provide a unified view.
func (iddoc *IDDOCQuestionnaire) TaskListStatus() IDDOCQuestionnaireTaskListStatus {
	// If not needed, return NOT_NEEDED regardless of status
	if !iddoc.Needed {
		return IDDOCQuestionnaireTaskListStatusNotNeeded
	}
	// Map work status to task list status
	switch iddoc.Status {
	case IDDOCQuestionnaireReady:
		return IDDOCQuestionnaireTaskListStatusReady
	case IDDOCQuestionnaireInProgress:
		return IDDOCQuestionnaireTaskListStatusInProgress
	case IDDOCQuestionnaireComplete:
		return IDDOCQuestionnaireTaskListStatusComplete
	default:
		return IDDOCQuestionnaireTaskListStatusReady
	}
}

// NewIDDOCQuestionnaire returns a new IDDOCQuestionnaire object
func NewIDDOCQuestionnaire(createdBy uuid.UUID, modelPlanID uuid.UUID) *IDDOCQuestionnaire {
	return &IDDOCQuestionnaire{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		Needed:            false,                   // Default: not needed
		Status:            IDDOCQuestionnaireReady, // Default: ready to start if needed
	}
}
