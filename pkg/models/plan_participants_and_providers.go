package models

import (
	"database/sql/driver"
	"time"

	"github.com/google/uuid"
)

//PlanParticipantsAndProviders represents the tasks list section that handles information around participants and providers
type PlanParticipantsAndProviders struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	//page 1
	Participants                      ParticipantsTypeG `json:"participants" db:"participants"`
	MedicareProviderType              *string           `json:"medicareProviderType" db:"medicare_provider_type"`
	StatesEngagement                  *string           `json:"statesEngagement" db:"states_engagement"`
	ParticipantsOther                 *string           `json:"participantsOther" db:"participants_other"`
	ParticipantsNote                  *string           `json:"participantsNote" db:"participants_note"`
	ParticipantsCurrentlyInModels     *bool             `json:"participantsCurrentlyInModels" db:"participants_currently_in_models" statusWeight:"1"`
	ParticipantsCurrentlyInModelsNote *string           `json:"participantsCurrentlyInModelsNote" db:"participants_currently_in_models_note"`
	ModelApplicationLevel             *string           `json:"modelApplicationLevel" db:"model_application_level"`

	//page 2
	ExpectedNumberOfParticipants *int                      `json:"expectedNumberOfParticipants" db:"expected_number_of_participants" statusWeight:"1"`
	EstimateConfidence           *ConfidenceType           `json:"estimateConfidence" db:"estimate_confidence" statusWeight:"1"`
	ConfidenceNote               *string                   `json:"confidenceNote" db:"confidence_note"`
	RecruitmentMethod            *RecruitmentType          `json:"recruitmentMethod" db:"recruitment_method" statusWeight:"1"`
	RecruitmentOther             *string                   `json:"recruitmentOther" db:"recruitment_other"`
	RecruitmentNote              *string                   `json:"recruitmentNote" db:"recruitment_note"`
	SelectionMethod              ParticipantSelectionTypeG `json:"selectionMethod" db:"selection_method"`
	SelectionOther               *string                   `json:"selectionOther" db:"selection_other"`
	SelectionNote                *string                   `json:"selectionNote" db:"selection_note"`

	//page 3
	CommunicationMethod      ParticipantCommunicationTypeG `json:"communicationMethod" db:"communication_method"`
	CommunicationMethodOther *string                       `json:"communicationMethodOther" db:"communication_method_other"`
	CommunicationNote        *string                       `json:"communicationNote" db:"communication_note"`
	ParticipantAssumeRisk    *bool                         `json:"participantAssumeRisk" db:"participant_assume_risk" statusWeight:"1"`
	RiskType                 *ParticipantRiskType          `json:"riskType" db:"risk_type"`
	RiskOther                *string                       `json:"riskOther" db:"risk_other"`
	RiskNote                 *string                       `json:"riskNote" db:"risk_note"`
	WillRiskChange           *bool                         `json:"willRiskChange" db:"will_risk_change" statusWeight:"1"`
	WillRiskChangeNote       *string                       `json:"willRiskChangeNote" db:"will_risk_change_note"`

	//page 4
	CoordinateWork         *bool               `json:"coordinateWork" db:"coordinate_work" statusWeight:"1"`
	CoordinateWorkNote     *string             `json:"coordinateWorkNote" db:"coordinate_work_note"`
	GainsharePayments      *bool               `json:"gainsharePayments" db:"gainshare_payments" statusWeight:"1"`
	GainsharePaymentsTrack *bool               `json:"gainsharePaymentsTrack" db:"gainshare_payments_track"`
	GainsharePaymentsNote  *string             `json:"gainsharePaymentsNote" db:"gainshare_payments_note"`
	ParticipantsIds        ParticipantsIDTypeG `json:"participantsIds" db:"participants_ids"`
	ParticipantsIdsOther   *string             `json:"participantsIdsOther" db:"participants_ids_other"`
	ParticipantsIDSNote    *string             `json:"participantsIDSNote" db:"participants_ids_note"`

	//page 5
	ProviderAdditionFrequency      *FrequencyType     `json:"providerAdditionFrequency" db:"provider_addition_frequency" statusWeight:"1"`
	ProviderAdditionFrequencyOther *string            `json:"providerAdditionFrequencyOther" db:"provider_addition_frequency_other"`
	ProviderAdditionFrequencyNote  *string            `json:"providerAdditionFrequencyNote" db:"provider_addition_frequency_note"`
	ProviderAddMethod              ProviderAddTypeG   `json:"providerAddMethod" db:"provider_add_method"`
	ProviderAddMethodOther         *string            `json:"providerAddMethodOther" db:"provider_add_method_other"`
	ProviderAddMethodNote          *string            `json:"providerAddMethodNote" db:"provider_add_method_note"`
	ProviderLeaveMethod            ProviderLeaveTypeG `json:"providerLeaveMethod" db:"provider_leave_method"`
	ProviderLeaveMethodOther       *string            `json:"providerLeaveMethodOther" db:"provider_leave_method_other"`
	ProviderLeaveMethodNote        *string            `json:"providerLeaveMethodNote" db:"provider_leave_method_note"`
	ProviderOverlap                *OverlapType       `json:"providerOverlap" db:"provider_overlap" statusWeight:"1"`
	ProviderOverlapHierarchy       *string            `json:"providerOverlapHierarchy" db:"provider_overlap_hierarchy"`
	ProviderOverlapNote            *string            `json:"providerOverlapNote" db:"provider_overlap_note"`

	// Meta
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
	Status      TaskStatus `json:"status" db:"status"`
}

//RecruitmentType represents the possible RecruitmentType options
type RecruitmentType string

//These constants represent the choices for Recruitment Type
const (
	RecruitmentLOI   RecruitmentType = "LOI"
	RecruitmentRFA   RecruitmentType = "RFA"
	RecruitmentNOFO  RecruitmentType = "NOFO"
	RecruitmentOTHER RecruitmentType = "OTHER"
	RecruitmentNA    RecruitmentType = "NA"
)

//ParticipantRiskType represents the possible RiskType values
type ParticipantRiskType string

//These constants represent the choices for Participant Risk Type
const (
	RiskTWOSIDED   ParticipantRiskType = "TWO_SIDED"
	RiskONESIDED   ParticipantRiskType = "ONE_SIDED"
	RiskCAPITATION ParticipantRiskType = "CAPITATION"
	RiskOTHER      ParticipantRiskType = "OTHER"
)

// CalcStatus returns a TaskStatus based on how many fields have been entered in the PlanParticipantsAndProviders struct
func (pp *PlanParticipantsAndProviders) CalcStatus() error {

	status, err := GenericallyCalculateStatus(*pp)
	if err != nil {
		return err
	}

	pp.Status = status
	return nil
}

// GetModelTypeName returns the name of the model
func (pp PlanParticipantsAndProviders) GetModelTypeName() string {
	return "Plan_Participants_And_Providers"
}

// GetID returns the ID property for a PlanParticipantsAndProviders struct
func (pp PlanParticipantsAndProviders) GetID() uuid.UUID {
	return pp.ID
}

// GetPlanID returns the ModelPlanID property for a PlanParticipantsAndProviders struct
func (pp PlanParticipantsAndProviders) GetPlanID() uuid.UUID {
	return pp.ModelPlanID
}

// GetModifiedBy returns the ModifiedBy property for a PlanParticipantsAndProviders struct
func (pp PlanParticipantsAndProviders) GetModifiedBy() *string {
	return pp.ModifiedBy
}

// GetCreatedBy returns the ModifiedBy property for a PlanParticipantsAndProviders struct
func (pp PlanParticipantsAndProviders) GetCreatedBy() string {
	return pp.CreatedBy
}

//ParticipantsTypeG is an array of ParticipantsType
type ParticipantsTypeG []ParticipantsType

//Scan is used by sql.scan to read the values from the DB
func (a *ParticipantsTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a ParticipantsTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// ParticipantsType represents the types of Participants types.
type ParticipantsType string

//These are the options for ParticipantsType
const (
	PTMedicareProviders                      ParticipantsType = "MEDICARE_PROVIDERS"
	PTEntities                               ParticipantsType = "ENTITIES"
	PTConvener                               ParticipantsType = "CONVENER"
	PTMedicareAdvantagePlans                 ParticipantsType = "MEDICARE_ADVANTAGE_PLANS"
	PTStandalonePartDPlans                   ParticipantsType = "STANDALONE_PART_D_PLANS"
	PTMedicareAdvantagePrescriptionDrugPlans ParticipantsType = "MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS"
	PTStateMedicaidAgencies                  ParticipantsType = "STATE_MEDICAID_AGENCIES"
	PTMedicaidManagedCareOrganizations       ParticipantsType = "MEDICAID_MANAGED_CARE_ORGANIZATIONS"
	PTMedicaidProviders                      ParticipantsType = "MEDICAID_PROVIDERS"
	PTStates                                 ParticipantsType = "STATES"
	PTCommunityBasedOrganizations            ParticipantsType = "COMMUNITY_BASED_ORGANIZATIONS"
	PTNonProfitOrganizations                 ParticipantsType = "NON_PROFIT_ORGANIZATIONS"
	PTCommercialPayers                       ParticipantsType = "COMMERCIAL_PAYERS"
	PTOther                                  ParticipantsType = "OTHER"
)

//ParticipantSelectionTypeG is an array of ParticipantSelectionType
type ParticipantSelectionTypeG []ParticipantSelectionType

//Scan is used by sql.scan to read the values from the DB
func (a *ParticipantSelectionTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a ParticipantSelectionTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// ParticipantSelectionType represents the types of ParticipantSelection types.
type ParticipantSelectionType string

//These are the options for ParticipantSelectionType
const (
	PSTModelTeamReviewApplications     ParticipantSelectionType = "MODEL_TEAM_REVIEW_APPLICATIONS"
	PSTSupportFromCmmi                 ParticipantSelectionType = "SUPPORT_FROM_CMMI"
	PSTCmsComponentOrProcess           ParticipantSelectionType = "CMS_COMPONENT_OR_PROCESS"
	PSTApplicationReviewAndScoringTool ParticipantSelectionType = "APPLICATION_REVIEW_AND_SCORING_TOOL"
	PSTApplicationSupportContractor    ParticipantSelectionType = "APPLICATION_SUPPORT_CONTRACTOR"
	PSTBasicCriteria                   ParticipantSelectionType = "BASIC_CRITERIA"
	PSTOther                           ParticipantSelectionType = "OTHER"
	PSTNoSelectingParticipants         ParticipantSelectionType = "NO_SELECTING_PARTICIPANTS"
)

//ParticipantCommunicationTypeG is an array of ParticipantCommunicationType
type ParticipantCommunicationTypeG []ParticipantCommunicationType

//Scan is used by sql.scan to read the values from the DB
func (a *ParticipantCommunicationTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a ParticipantCommunicationTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// ParticipantCommunicationType represents the types of ParticipantCommunication types.
type ParticipantCommunicationType string

//These are the options for ParticipantCommunicationType
const (
	PCTMassEmail       ParticipantCommunicationType = "MASS_EMAIL"
	PCTItTool          ParticipantCommunicationType = "IT_TOOL"
	PCTOther           ParticipantCommunicationType = "OTHER"
	PCTNoCommunication ParticipantCommunicationType = "NO_COMMUNICATION"
)

//ParticipantsIDTypeG is an array of ParticipantsIDType
type ParticipantsIDTypeG []ParticipantsIDType

//Scan is used by sql.scan to read the values from the DB
func (a *ParticipantsIDTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a ParticipantsIDTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// ParticipantsIDType represents the types of ParticipantsID types.
type ParticipantsIDType string

//These are the options for ParticipantsIDType
const (
	PIDTins          ParticipantsIDType = "TINS"
	PIDNpis          ParticipantsIDType = "NPIS"
	PIDCcns          ParticipantsIDType = "CCNS"
	PIDOther         ParticipantsIDType = "OTHER"
	PIDNoIdentifiers ParticipantsIDType = "NO_IDENTIFIERS"
)

//ProviderAddTypeG is an array of ProviderAddType
type ProviderAddTypeG []ProviderAddType

//Scan is used by sql.scan to read the values from the DB
func (a *ProviderAddTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a ProviderAddTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// ProviderAddType represents the types of ProviderAdd types.
type ProviderAddType string

//These are the options for ProviderAddType
const (
	PATProspectively   ProviderAddType = "PROSPECTIVELY"
	PATRetrospectively ProviderAddType = "RETROSPECTIVELY"
	PATVoluntarily     ProviderAddType = "VOLUNTARILY"
	PATMandatorily     ProviderAddType = "MANDATORILY"
	PATOnlineTools     ProviderAddType = "ONLINE_TOOLS"
	PATOther           ProviderAddType = "OTHER"
	PATNa              ProviderAddType = "NA"
)

//ProviderLeaveTypeG is an array of ProviderLeaveType
type ProviderLeaveTypeG []ProviderLeaveType

//Scan is used by sql.scan to read the values from the DB
func (a *ProviderLeaveTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a ProviderLeaveTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// ProviderLeaveType represents the types of ProviderLeave types.
type ProviderLeaveType string

//These are the options for ProviderLeaveType
const (
	PLTVoluntarilyWithoutImplications ProviderLeaveType = "VOLUNTARILY_WITHOUT_IMPLICATIONS"
	PLTAfterACertainWithImplications  ProviderLeaveType = "AFTER_A_CERTAIN_WITH_IMPLICATIONS"
	PLTVariesByTypeOfProvider         ProviderLeaveType = "VARIES_BY_TYPE_OF_PROVIDER"
	PLTNotAllowedToLeave              ProviderLeaveType = "NOT_ALLOWED_TO_LEAVE"
	PLTOther                          ProviderLeaveType = "OTHER"
	PLTNotApplicable                  ProviderLeaveType = "NOT_APPLICABLE"
)
