package models

import (
	"context"
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
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

	// Questionnaire fields - Page 1 Operations
	TechnicalContactsIdentified       *bool      `json:"technicalContactsIdentified" db:"technical_contacts_identified"`
	TechnicalContactsIdentifiedDetail *string    `json:"technicalContactsIdentifiedDetail" db:"technical_contacts_identified_detail"`
	TechnicalContactsIdentifiedNote   *string    `json:"technicalContactsIdentifiedNote" db:"technical_contacts_identified_note"`
	CaptureParticipantInfo            *bool      `json:"captureParticipantInfo" db:"capture_participant_information"`
	CaptureParticipantInfoNote        *string    `json:"captureParticipantInfoNote" db:"capture_participant_info_note"`
	IcdOwner                          *string    `json:"icdOwner" db:"icd_owner"`
	DraftIcdDueDate                   *time.Time `json:"draftIcdDueDate" db:"draft_icd_required_by"`
	IcdNote                           *string    `json:"icdNote" db:"icd_note"`

	// Page 2 Testing
	UatNeeds                  *string            `json:"uatNeeds" db:"uat_test_data_needs"`
	StcNeeds                  *string            `json:"stcNeeds" db:"stc_test_data_needs"`
	TestingTimelines          *string            `json:"testingTimelines" db:"testing_timelines"`
	TestingNote               *string            `json:"testingNote" db:"testing_note"`
	DataMonitoringFileTypes   IDDOCFileTypeArray `json:"dataMonitoringFileTypes" db:"file_types"`
	DataMonitoringFileOther   *string            `json:"dataMonitoringFileOther" db:"data_monitoring_file_other"`
	DataResponseType          *string            `json:"dataResponseType" db:"response_types"`
	DataResponseFileFrequency *string            `json:"dataResponseFileFrequency" db:"file_frequency"`

	// Page 3 Monitoring
	DataFullTimeOrIncremental      *string `json:"dataFullTimeOrIncremental" db:"data_full_time_or_incremental"`
	EftSetUp                       *bool   `json:"eftSetUp" db:"eft_connectivity_setup"`
	UnsolicitedAdjustmentsIncluded *bool   `json:"unsolicitedAdjustmentsIncluded" db:"unsolicited_adjustments_included"`
	DataFlowDiagramsNeeded         *bool   `json:"dataFlowDiagramsNeeded" db:"data_flow_diagrams_needed"`
	ProduceBenefitEnhancementFiles *bool   `json:"produceBenefitEnhancementFiles" db:"produce_benefit_enhancement_files"`
	FileNamingConventions          *string `json:"fileNamingConventions" db:"file_naming_conventions"`
	DataMonitoringNote             *string `json:"dataMonitoringNote" db:"data_monitoring_note"`

	// Metadata
	Needed                       bool       `json:"needed" db:"needed"`
	IsIDDOCQuestionnaireComplete bool       `json:"isIDDOCQuestionnaireComplete" db:"is_iddoc_questionnaire_complete"`
	CompletedBy                  *uuid.UUID `json:"completedBy" db:"completed_by"`
	CompletedDts                 *time.Time `json:"completedDts" db:"completed_dts"`
}

// NewIDDOCQuestionnaire returns a new IDDOCQuestionnaire object
func NewIDDOCQuestionnaire(createdBy uuid.UUID, modelPlanID uuid.UUID) *IDDOCQuestionnaire {
	return &IDDOCQuestionnaire{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		Needed:            false, // Default to false
	}
}

// CompletedByUserAccount returns the user account for the user who completed the questionnaire
func (iddoc *IDDOCQuestionnaire) CompletedByUserAccount(ctx context.Context) (*authentication.UserAccount, error) {
	if iddoc.CompletedBy == nil {
		return nil, nil
	}

	service, err := appcontext.UserAccountService(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to get completed by user account, there is an issue with the user account service. err %w", err)
	}
	account, err := service(ctx, *iddoc.CompletedBy)
	if err != nil {
		return nil, err
	}
	return account, nil
}
