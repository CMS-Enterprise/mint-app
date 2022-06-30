package models

import (
	"database/sql/driver"
	"time"

	"github.com/google/uuid"
)

// PlanITTools represents a Plan IT Tools model
type PlanITTools struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	//Page 1
	GcPartCD              GcPartCDTypeG         `json:"gcPartCD" db:"gc_part_c_d"`
	GcPartCDOther         *string               `json:"gcPartCDOther" db:"gc_part_c_d_other"`
	GcPartCDNote          *string               `json:"gcPartCDNote" db:"gc_part_c_d_note"`
	GcCollectBids         GcCollectBidsTypeG    `json:"gcCollectBids" db:"gc_collect_bids"`
	GcCollectBidsOther    *string               `json:"gcCollectBidsOther" db:"gc_collect_bids_other"`
	GcCollectBidsNote     *string               `json:"gcCollectBidsNote" db:"gc_collect_bids_note"`
	GcUpdateContract      GcUpdateContractTypeG `json:"gcUpdateContract" db:"gc_update_contract"`
	GcUpdateContractOther *string               `json:"gcUpdateContractOther" db:"gc_update_contract_other"`
	GcUpdateContractNote  *string               `json:"gcUpdateContractNote" db:"gc_update_contract_note"`
	//Page 2
	PpToAdvertise               PpToAdvertiseTypeG          `json:"ppToAdvertise" db:"pp_to_advertise"`
	PpToAdvertiseOther          *string                     `json:"ppToAdvertiseOther" db:"pp_to_advertise_other"`
	PpToAdvertiseNote           *string                     `json:"ppToAdvertiseNote" db:"pp_to_advertise_note"`
	PpCollectScoreReview        PpCollectScoreReviewTypeG   `json:"ppCollectScoreReview" db:"pp_collect_score_review"`
	PpCollectScoreReviewOther   *string                     `json:"ppCollectScoreReviewOther" db:"pp_collect_score_review_other"`
	PpCollectScoreReviewNote    *string                     `json:"ppCollectScoreReviewNote" db:"pp_collect_score_review_note"`
	PpAppSupportContractor      PpAppSupportContractorTypeG `json:"ppAppSupportContractor" db:"pp_app_support_contractor"`
	PpAppSupportContractorOther *string                     `json:"ppAppSupportContractorOther" db:"pp_app_support_contractor_other"`
	PpAppSupportContractorNote  *string                     `json:"ppAppSupportContractorNote" db:"pp_app_support_contractor_note"`
	//Page 3
	PpCommunicateWithParticipant      PpCommunicateWithParticipantTypeG `json:"ppCommunicateWithParticipant" db:"pp_communicate_with_participant"`
	PpCommunicateWithParticipantOther *string                           `json:"ppCommunicateWithParticipantOther" db:"pp_communicate_with_participant_other"`
	PpCommunicateWithParticipantNote  *string                           `json:"ppCommunicateWithParticipantNote" db:"pp_communicate_with_participant_note"`
	PpManageProviderOverlap           PpManageProviderOverlapTypeG      `json:"ppManageProviderOverlap" db:"pp_manage_provider_overlap" statusWeight:"1"` //Always Required
	PpManageProviderOverlapOther      *string                           `json:"ppManageProviderOverlapOther" db:"pp_manage_provider_overlap_other"`
	PpManageProviderOverlapNote       *string                           `json:"ppManageProviderOverlapNote" db:"pp_manage_provider_overlap_note"`
	BManageBeneficiaryOverlap         BManageBeneficiaryOverlapTypeG    `json:"bManageBeneficiaryOverlap" db:"b_manage_beneficiary_overlap" statusWeight:"1"` //Always Required
	BManageBeneficiaryOverlapOther    *string                           `json:"bManageBeneficiaryOverlapOther" db:"b_manage_beneficiary_overlap_other"`
	BManageBeneficiaryOverlapNote     *string                           `json:"bManageBeneficiaryOverlapNote" db:"b_manage_beneficiary_overlap_note"`
	//Page 4
	OelHelpdeskSupport      OelHelpdeskSupportTypeG `json:"oelHelpdeskSupport" db:"oel_helpdesk_support"`
	OelHelpdeskSupportOther *string                 `json:"oelHelpdeskSupportOther" db:"oel_helpdesk_support_other"`
	OelHelpdeskSupportNote  *string                 `json:"oelHelpdeskSupportNote" db:"oel_helpdesk_support_note"`
	OelManageAco            OelManageAcoTypeG       `json:"oelManageAco" db:"oel_manage_aco"`
	OelManageAcoOther       *string                 `json:"oelManageAcoOther" db:"oel_manage_aco_other"`
	OelManageAcoNote        *string                 `json:"oelManageAcoNote" db:"oel_manage_aco_note"`
	//Page 5
	OelPerformanceBenchmark      OelPerformanceBenchmarkTypeG `json:"oelPerformanceBenchmark" db:"oel_performance_benchmark"`
	OelPerformanceBenchmarkOther *string                      `json:"oelPerformanceBenchmarkOther" db:"oel_performance_benchmark_other"`
	OelPerformanceBenchmarkNote  *string                      `json:"oelPerformanceBenchmarkNote" db:"oel_performance_benchmark_note"`
	OelProcessAppeals            OelProcessAppealsTypeG       `json:"oelProcessAppeals" db:"oel_process_appeals"`
	OelProcessAppealsOther       *string                      `json:"oelProcessAppealsOther" db:"oel_process_appeals_other"`
	OelProcessAppealsNote        *string                      `json:"oelProcessAppealsNote" db:"oel_process_appeals_note"`
	OelEvaluationContractor      OelEvaluationContractorTypeG `json:"oelEvaluationContractor" db:"oel_evaluation_contractor"`
	OelEvaluationContractorOther *string                      `json:"oelEvaluationContractorOther" db:"oel_evaluation_contractor_other"`
	OelEvaluationContractorNote  *string                      `json:"oelEvaluationContractorNote" db:"oel_evaluation_contractor_note"`
	//Page 6
	OelCollectData              OelCollectDataTypeG         `json:"oelCollectData" db:"oel_collect_data"`
	OelCollectDataOther         *string                     `json:"oelCollectDataOther" db:"oel_collect_data_other"`
	OelCollectDataNote          *string                     `json:"oelCollectDataNote" db:"oel_collect_data_note"`
	OelObtainData               OelObtainDataTypeG          `json:"oelObtainData" db:"oel_obtain_data"`
	OelObtainDataOther          *string                     `json:"oelObtainDataOther" db:"oel_obtain_data_other"`
	OelObtainDataNote           *string                     `json:"oelObtainDataNote" db:"oel_obtain_data_note"`
	OelClaimsBasedMeasures      OelClaimsBasedMeasuresTypeG `json:"oelClaimsBasedMeasures" db:"oel_claims_based_measures"`
	OelClaimsBasedMeasuresOther *string                     `json:"oelClaimsBasedMeasuresOther" db:"oel_claims_based_measures_other"`
	OelClaimsBasedMeasuresNote  *string                     `json:"oelClaimsBasedMeasuresNote" db:"oel_claims_based_measures_note"`
	//Page 7
	OelQualityScores           OelQualityScoresTypeG      `json:"oelQualityScores" db:"oel_quality_scores"`
	OelQualityScoresOther      *string                    `json:"oelQualityScoresOther" db:"oel_quality_scores_other"`
	OelQualityScoresNote       *string                    `json:"oelQualityScoresNote" db:"oel_quality_scores_note"`
	OelSendReports             OelSendReportsTypeG        `json:"oelSendReports" db:"oel_send_reports"`
	OelSendReportsOther        *string                    `json:"oelSendReportsOther" db:"oel_send_reports_other"`
	OelSendReportsNote         *string                    `json:"oelSendReportsNote" db:"oel_send_reports_note"`
	OelLearningContractor      OelLearningContractorTypeG `json:"oelLearningContractor" db:"oel_learning_contractor"`
	OelLearningContractorOther *string                    `json:"oelLearningContractorOther" db:"oel_learning_contractor_other"`
	OelLearningContractorNote  *string                    `json:"oelLearningContractorNote" db:"oel_learning_contractor_note"`
	//Page 8
	OelParticipantCollaboration      OelParticipantCollaborationTypeG `json:"oelParticipantCollaboration" db:"oel_participant_collaboration"`
	OelParticipantCollaborationOther *string                          `json:"oelParticipantCollaborationOther" db:"oel_participant_collaboration_other"`
	OelParticipantCollaborationNote  *string                          `json:"oelParticipantCollaborationNote" db:"oel_participant_collaboration_note"`
	OelEducateBeneficiaries          OelEducateBeneficiariesTypeG     `json:"oelEducateBeneficiaries" db:"oel_educate_beneficiaries"`
	OelEducateBeneficiariesOther     *string                          `json:"oelEducateBeneficiariesOther" db:"oel_educate_beneficiaries_other"`
	OelEducateBeneficiariesNote      *string                          `json:"oelEducateBeneficiariesNote" db:"oel_educate_beneficiaries_note"`
	PMakeClaimsPayments              PMakeClaimsPaymentsTypeG         `json:"pMakeClaimsPayments" db:"p_make_claims_payments"`
	PMakeClaimsPaymentsOther         *string                          `json:"pMakeClaimsPaymentsOther" db:"p_make_claims_payments_other"`
	PMakeClaimsPaymentsNote          *string                          `json:"pMakeClaimsPaymentsNote" db:"p_make_claims_payments_note"`
	//Page 9
	PInformFfs                   PInformFfsTypeG              `json:"pInformFfs" db:"p_inform_ffs"`
	PInformFfsOther              *string                      `json:"pInformFfsOther" db:"p_inform_ffs_other"`
	PInformFfsNote               *string                      `json:"pInformFfsNote" db:"p_inform_ffs_note"`
	PNonClaimsBasedPayments      PNonClaimsBasedPaymentsTypeG `json:"pNonClaimsBasedPayments" db:"p_non_claims_based_payments"`
	PNonClaimsBasedPaymentsOther *string                      `json:"pNonClaimsBasedPaymentsOther" db:"p_non_claims_based_payments_other"`
	PNonClaimsBasedPaymentsNote  *string                      `json:"pNonClaimsBasedPaymentsNote" db:"p_non_claims_based_payments_note"`
	PSharedSavingsPlan           PSharedSavingsPlanTypeG      `json:"pSharedSavingsPlan" db:"p_shared_savings_plan"`
	PSharedSavingsPlanOther      *string                      `json:"pSharedSavingsPlanOther" db:"p_shared_savings_plan_other"`
	PSharedSavingsPlanNote       *string                      `json:"pSharedSavingsPlanNote" db:"p_shared_savings_plan_note"`
	//Page 10
	PRecoverPayments      PRecoverPaymentsTypeG `json:"pRecoverPayments" db:"p_recover_payments"`
	PRecoverPaymentsOther *string               `json:"pRecoverPaymentsOther" db:"p_recover_payments_other"`
	PRecoverPaymentsNote  *string               `json:"pRecoverPaymentsNote" db:"p_recover_payments_note"`

	// Meta
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
	Status      TaskStatus `json:"status" db:"status"`
}

// CalcStatus returns a TaskStatus based on how many fields have been entered in the PlanITTools struct
func (it *PlanITTools) CalcStatus() error {
	//TODO: this section is largely conditional, it might be necessary to override the generic functionality in favor of a more specific one
	/*
		if desired, we can provide get other task list questions to determine if a question is required or not
	*/

	status, err := GenericallyCalculateStatus(*it)
	if err != nil {
		return err
	}

	// it.Status = TaskReady
	it.Status = status
	return nil
}

// GetModelTypeName returns the name of the model
func (it PlanITTools) GetModelTypeName() string {
	return "Plan_IT_Tools"
}

// GetID returns the ID property for a PlanITTools struct
func (it PlanITTools) GetID() uuid.UUID {
	return it.ID
}

// GetPlanID returns the ModelPlanID property for a PlanITTools struct
func (it PlanITTools) GetPlanID() uuid.UUID {
	return it.ModelPlanID
}

// GetModifiedBy returns the ModifiedBy property for a PlanITTools struct
func (it PlanITTools) GetModifiedBy() *string {
	return it.ModifiedBy
}

// GetCreatedBy returns the ModifiedBy property for a PlanITTools struct
func (it PlanITTools) GetCreatedBy() string {
	return it.CreatedBy
}

//GcPartCDTypeG is an array of GcPartCDType
type GcPartCDTypeG []GcPartCDType

//Scan is used by sql.scan to read the values from the DB
func (a *GcPartCDTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a GcPartCDTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// GcPartCDType represents the types of GcPartCD types.
type GcPartCDType string

//These are the options for GcPartCDType
const (
	GCPCDMarx  GcPartCDType = "MARX"
	GCPCDOther GcPartCDType = "OTHER"
)

//GcCollectBidsTypeG is an array of GcCollectBidsType
type GcCollectBidsTypeG []GcCollectBidsType

//Scan is used by sql.scan to read the values from the DB
func (a *GcCollectBidsTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a GcCollectBidsTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// GcCollectBidsType represents the types of GcCollectBids types.
type GcCollectBidsType string

//These are the options for GcCollectBidsType
const (
	GCBTHpms  GcCollectBidsType = "HPMS"
	GCBTOther GcCollectBidsType = "OTHER"
)

//GcUpdateContractTypeG is an array of GcUpdateContractType
type GcUpdateContractTypeG []GcUpdateContractType

//Scan is used by sql.scan to read the values from the DB
func (a *GcUpdateContractTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a GcUpdateContractTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// GcUpdateContractType represents the types of GcUpdateContract types.
type GcUpdateContractType string

//These are the options for GcUpdateContractType
const (
	GCUCTHpms  GcUpdateContractType = "HPMS"
	GCUCTOther GcUpdateContractType = "OTHER"
)

//PpToAdvertiseTypeG is an array of PpToAdvertiseType
type PpToAdvertiseTypeG []PpToAdvertiseType

//Scan is used by sql.scan to read the values from the DB
func (a *PpToAdvertiseTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a PpToAdvertiseTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// PpToAdvertiseType represents the types of PpToAdvertise types.
type PpToAdvertiseType string

//These are the options for PpToAdvertiseType
const (
	PPTATSalesforce     PpToAdvertiseType = "SALESFORCE"
	PPTATGrantSolutions PpToAdvertiseType = "GRANT_SOLUTIONS"
	PPTATOther          PpToAdvertiseType = "OTHER"
)

//PpCollectScoreReviewTypeG is an array of PpCollectScoreReviewType
type PpCollectScoreReviewTypeG []PpCollectScoreReviewType

//Scan is used by sql.scan to read the values from the DB
func (a *PpCollectScoreReviewTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a PpCollectScoreReviewTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// PpCollectScoreReviewType represents the types of PpCollectScoreReview types.
type PpCollectScoreReviewType string

//These are the options for PpCollectScoreReviewType
const (
	PPCSRRRfa            PpCollectScoreReviewType = "RFA"
	PPCSRRArs            PpCollectScoreReviewType = "ARS"
	PPCSRRGrantSolutions PpCollectScoreReviewType = "GRANT_SOLUTIONS"
	PPCSRROther          PpCollectScoreReviewType = "OTHER"
)

//PpAppSupportContractorTypeG is an array of PpAppSupportContractorType
type PpAppSupportContractorTypeG []PpAppSupportContractorType

//Scan is used by sql.scan to read the values from the DB
func (a *PpAppSupportContractorTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a PpAppSupportContractorTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// PpAppSupportContractorType represents the types of PpAppSupportContractor types.
type PpAppSupportContractorType string

//These are the options for PpAppSupportContractorType
const (
	PPASCTRmda  PpAppSupportContractorType = "RMDA"
	PPASCTOther PpAppSupportContractorType = "OTHER"
)

//PpCommunicateWithParticipantTypeG is an array of PpCommunicateWithParticipantType
type PpCommunicateWithParticipantTypeG []PpCommunicateWithParticipantType

//Scan is used by sql.scan to read the values from the DB
func (a *PpCommunicateWithParticipantTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a PpCommunicateWithParticipantTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// PpCommunicateWithParticipantType represents the types of PpCommunicateWithParticipant types.
type PpCommunicateWithParticipantType string

//These are the options for PpCommunicateWithParticipantType
const (
	PPCWPTOutlookMailbox   PpCommunicateWithParticipantType = "OUTLOOK_MAILBOX"
	PPCWPTGovDelivery      PpCommunicateWithParticipantType = "GOV_DELIVERY"
	PPCWPTSalesforcePortal PpCommunicateWithParticipantType = "SALESFORCE_PORTAL"
	PPCWPTOther            PpCommunicateWithParticipantType = "OTHER"
)

//PpManageProviderOverlapTypeG is an array of PpManageProviderOverlapType
type PpManageProviderOverlapTypeG []PpManageProviderOverlapType

//Scan is used by sql.scan to read the values from the DB
func (a *PpManageProviderOverlapTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a PpManageProviderOverlapTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// PpManageProviderOverlapType represents the types of PpManageProviderOverlap types.
type PpManageProviderOverlapType string

//These are the options for PpManageProviderOverlapType
const (
	PPMPOTMdm   PpManageProviderOverlapType = "MDM"
	PPMPOTOther PpManageProviderOverlapType = "OTHER"
	PPMPOTNa    PpManageProviderOverlapType = "NA"
)

//BManageBeneficiaryOverlapTypeG is an array of BManageBeneficiaryOverlapType
type BManageBeneficiaryOverlapTypeG []BManageBeneficiaryOverlapType

//Scan is used by sql.scan to read the values from the DB
func (a *BManageBeneficiaryOverlapTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a BManageBeneficiaryOverlapTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// BManageBeneficiaryOverlapType represents the types of BManageBeneficiaryOverlap types.
type BManageBeneficiaryOverlapType string

//These are the options for BManageBeneficiaryOverlapType
const (
	BMBOTMdm   BManageBeneficiaryOverlapType = "MDM"
	BMBOTOther BManageBeneficiaryOverlapType = "OTHER"
	BMBOTNa    BManageBeneficiaryOverlapType = "NA"
)

//OelHelpdeskSupportTypeG is an array of OelHelpdeskSupportType
type OelHelpdeskSupportTypeG []OelHelpdeskSupportType

//Scan is used by sql.scan to read the values from the DB
func (a *OelHelpdeskSupportTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelHelpdeskSupportTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelHelpdeskSupportType represents the types of OelHelpdeskSupport types.
type OelHelpdeskSupportType string

//These are the options for OelHelpdeskSupportType
const (
	OHSTCbosc      OelHelpdeskSupportType = "CBOSC"
	OHSTContractor OelHelpdeskSupportType = "CONTRACTOR"
	OHSTOther      OelHelpdeskSupportType = "OTHER"
)

//OelManageAcoTypeG is an array of OelManageAcoType
type OelManageAcoTypeG []OelManageAcoType

//Scan is used by sql.scan to read the values from the DB
func (a *OelManageAcoTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelManageAcoTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelManageAcoType represents the types of OelManageAco types.
type OelManageAcoType string

//These are the options for OelManageAcoType
const (
	OMATAcoOS      OelManageAcoType = "ACO_OS"
	OMATAcoUI      OelManageAcoType = "ACO_UI"
	OMATInnovation OelManageAcoType = "INNOVATION"
	OMATOther      OelManageAcoType = "OTHER"
)

//OelPerformanceBenchmarkTypeG is an array of OelPerformanceBenchmarkType
type OelPerformanceBenchmarkTypeG []OelPerformanceBenchmarkType

//Scan is used by sql.scan to read the values from the DB
func (a *OelPerformanceBenchmarkTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelPerformanceBenchmarkTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelPerformanceBenchmarkType represents the types of OelPerformanceBenchmark types.
type OelPerformanceBenchmarkType string

//These are the options for OelPerformanceBenchmarkType
const (
	OPBTIdr   OelPerformanceBenchmarkType = "IDR"
	OPBTCcw   OelPerformanceBenchmarkType = "CCW"
	OPBTOther OelPerformanceBenchmarkType = "OTHER"
)

//OelProcessAppealsTypeG is an array of OelProcessAppealsType
type OelProcessAppealsTypeG []OelProcessAppealsType

//Scan is used by sql.scan to read the values from the DB
func (a *OelProcessAppealsTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelProcessAppealsTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelProcessAppealsType represents the types of OelProcessAppeals types.
type OelProcessAppealsType string

//These are the options for OelProcessAppealsType
const (
	OPATMedicareAppealSystem OelProcessAppealsType = "MEDICARE_APPEAL_SYSTEM"
	OPATOther                OelProcessAppealsType = "OTHER"
)

//OelEvaluationContractorTypeG is an array of OelEvaluationContractorType
type OelEvaluationContractorTypeG []OelEvaluationContractorType

//Scan is used by sql.scan to read the values from the DB
func (a *OelEvaluationContractorTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelEvaluationContractorTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelEvaluationContractorType represents the types of OelEvaluationContractor types.
type OelEvaluationContractorType string

//These are the options for OelEvaluationContractorType
const (
	OECTRmda  OelEvaluationContractorType = "RMDA"
	OECTOther OelEvaluationContractorType = "OTHER"
)

//OelCollectDataTypeG is an array of OelCollectDataType
type OelCollectDataTypeG []OelCollectDataType

//Scan is used by sql.scan to read the values from the DB
func (a *OelCollectDataTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelCollectDataTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelCollectDataType represents the types of OelCollectData types.
type OelCollectDataType string

//These are the options for OelCollectDataType
const (
	OCDTIdr        OelCollectDataType = "IDR"
	OCDTCcw        OelCollectDataType = "CCW"
	OCDTIdos       OelCollectDataType = "IDOS"
	OCDTIsp        OelCollectDataType = "ISP"
	OCDTContractor OelCollectDataType = "CONTRACTOR"
	OCDTOther      OelCollectDataType = "OTHER"
)

//OelObtainDataTypeG is an array of OelObtainDataType
type OelObtainDataTypeG []OelObtainDataType

//Scan is used by sql.scan to read the values from the DB
func (a *OelObtainDataTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelObtainDataTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelObtainDataType represents the types of OelObtainData types.
type OelObtainDataType string

//These are the options for OelObtainDataType
const (
	OODTCcw   OelObtainDataType = "CCW"
	OODTIdos  OelObtainDataType = "IDOS"
	OODTIsp   OelObtainDataType = "ISP"
	OODTOther OelObtainDataType = "OTHER"
)

//OelClaimsBasedMeasuresTypeG is an array of OelClaimsBasedMeasuresType
type OelClaimsBasedMeasuresTypeG []OelClaimsBasedMeasuresType

//Scan is used by sql.scan to read the values from the DB
func (a *OelClaimsBasedMeasuresTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelClaimsBasedMeasuresTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelClaimsBasedMeasuresType represents the types of OelClaimsBasedMeasures types.
type OelClaimsBasedMeasuresType string

//These are the options for OelClaimsBasedMeasuresType
const (
	OCBMTIdr   OelClaimsBasedMeasuresType = "IDR"
	OCBMTCcw   OelClaimsBasedMeasuresType = "CCW"
	OCBMTOther OelClaimsBasedMeasuresType = "OTHER"
)

//OelQualityScoresTypeG is an array of OelQualityScoresType
type OelQualityScoresTypeG []OelQualityScoresType

//Scan is used by sql.scan to read the values from the DB
func (a *OelQualityScoresTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelQualityScoresTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelQualityScoresType represents the types of OelQualityScores types.
type OelQualityScoresType string

//These are the options for OelQualityScoresType
const (
	OQSTExistingDataAndProcess OelQualityScoresType = "EXISTING_DATA_AND_PROCESS"
	OQSTNewDataAndCmmiProcess  OelQualityScoresType = "NEW_DATA_AND_CMMI_PROCESS"
	OQSTOther                  OelQualityScoresType = "OTHER"
	OQSTNone                   OelQualityScoresType = "NONE"
)

//OelSendReportsTypeG is an array of OelSendReportsType
type OelSendReportsTypeG []OelSendReportsType

//Scan is used by sql.scan to read the values from the DB
func (a *OelSendReportsTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelSendReportsTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelSendReportsType represents the types of OelSendReports types.
type OelSendReportsType string

//These are the options for OelSendReportsType
const (
	OSRTIdos          OelSendReportsType = "IDOS"
	OSRTRmada         OelSendReportsType = "RMADA"
	OSRTInternalStaff OelSendReportsType = "INTERNAL_STAFF"
	OSRTOther         OelSendReportsType = "OTHER"
)

//OelLearningContractorTypeG is an array of OelLearningContractorType
type OelLearningContractorTypeG []OelLearningContractorType

//Scan is used by sql.scan to read the values from the DB
func (a *OelLearningContractorTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelLearningContractorTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelLearningContractorType represents the types of OelLearningContractor types.
type OelLearningContractorType string

//These are the options for OelLearningContractorType
const (
	OLCTRmada              OelLearningContractorType = "RMADA"
	OLCTCrossModelContract OelLearningContractorType = "CROSS_MODEL_CONTRACT"
	OLCTOther              OelLearningContractorType = "OTHER"
)

//OelParticipantCollaborationTypeG is an array of OelParticipantCollaborationType
type OelParticipantCollaborationTypeG []OelParticipantCollaborationType

//Scan is used by sql.scan to read the values from the DB
func (a *OelParticipantCollaborationTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelParticipantCollaborationTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelParticipantCollaborationType represents the types of OelParticipantCollaboration types.
type OelParticipantCollaborationType string

//These are the options for OelParticipantCollaborationType
const (
	OPCTConnect OelParticipantCollaborationType = "CONNECT"
	OPCTOther   OelParticipantCollaborationType = "OTHER"
)

//OelEducateBeneficiariesTypeG is an array of OelEducateBeneficiariesType
type OelEducateBeneficiariesTypeG []OelEducateBeneficiariesType

//Scan is used by sql.scan to read the values from the DB
func (a *OelEducateBeneficiariesTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a OelEducateBeneficiariesTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// OelEducateBeneficiariesType represents the types of OelEducateBeneficiaries types.
type OelEducateBeneficiariesType string

//These are the options for OelEducateBeneficiariesType
const (
	OEBTOc    OelEducateBeneficiariesType = "OC"
	OEBTOther OelEducateBeneficiariesType = "OTHER"
)

//PMakeClaimsPaymentsTypeG is an array of PMakeClaimsPaymentsType
type PMakeClaimsPaymentsTypeG []PMakeClaimsPaymentsType

//Scan is used by sql.scan to read the values from the DB
func (a *PMakeClaimsPaymentsTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a PMakeClaimsPaymentsTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// PMakeClaimsPaymentsType represents the types of PMakeClaimsPayments types.
type PMakeClaimsPaymentsType string

//These are the options for PMakeClaimsPaymentsType
const (
	PMCPTSharedSystems PMakeClaimsPaymentsType = "SHARED_SYSTEMS"
	PMCPTHiglas        PMakeClaimsPaymentsType = "HIGLAS"
	PMCPTOther         PMakeClaimsPaymentsType = "OTHER"
)

//PInformFfsTypeG is an array of PInformFfsType
type PInformFfsTypeG []PInformFfsType

//Scan is used by sql.scan to read the values from the DB
func (a *PInformFfsTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a PInformFfsTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// PInformFfsType represents the types of PInformFfs types.
type PInformFfsType string

//These are the options for PInformFfsType
const (
	PIFTFfsCompetencyCenter PInformFfsType = "FFS_COMPETENCY_CENTER"
	PIFTOther               PInformFfsType = "OTHER"
)

//PNonClaimsBasedPaymentsTypeG is an array of PNonClaimsBasedPaymentsType
type PNonClaimsBasedPaymentsTypeG []PNonClaimsBasedPaymentsType

//Scan is used by sql.scan to read the values from the DB
func (a *PNonClaimsBasedPaymentsTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a PNonClaimsBasedPaymentsTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// PNonClaimsBasedPaymentsType represents the types of PNonClaimsBasedPayments types.
type PNonClaimsBasedPaymentsType string

//These are the options for PNonClaimsBasedPaymentsType
const (
	PNCBTApps   PNonClaimsBasedPaymentsType = "APPS"
	PNCBTHiglas PNonClaimsBasedPaymentsType = "HIGLAS"
	PNCBTIpc    PNonClaimsBasedPaymentsType = "IPC"
	PNCBTMac    PNonClaimsBasedPaymentsType = "MAC"
	PNCBTOther  PNonClaimsBasedPaymentsType = "OTHER"
)

//PSharedSavingsPlanTypeG is an array of PSharedSavingsPlanType
type PSharedSavingsPlanTypeG []PSharedSavingsPlanType

//Scan is used by sql.scan to read the values from the DB
func (a *PSharedSavingsPlanTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a PSharedSavingsPlanTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// PSharedSavingsPlanType represents the types of PSharedSavingsPlan types.
type PSharedSavingsPlanType string

//These are the options for PSharedSavingsPlanType
const (
	PSSPTRmada PSharedSavingsPlanType = "RMADA"
	PSSPTOther PSharedSavingsPlanType = "OTHER"
)

//PRecoverPaymentsTypeG is an array of PRecoverPaymentsType
type PRecoverPaymentsTypeG []PRecoverPaymentsType

//Scan is used by sql.scan to read the values from the DB
func (a *PRecoverPaymentsTypeG) Scan(src interface{}) error {
	return GenericScan(src, a)
}

//Value implements the driver.Valuer interface.
func (a PRecoverPaymentsTypeG) Value() (driver.Value, error) {
	return GenericValue(a)
}

// PRecoverPaymentsType represents the types of PRecoverPayments types.
type PRecoverPaymentsType string

//These are the options for PRecoverPaymentsType
const (
	PRPTApps  PRecoverPaymentsType = "APPS"
	PRPTIpc   PRecoverPaymentsType = "IPC"
	PRPTMac   PRecoverPaymentsType = "MAC"
	PRPTOther PRecoverPaymentsType = "OTHER"
)
