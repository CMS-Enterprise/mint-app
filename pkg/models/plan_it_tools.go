package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// PlanITTools represents a Plan IT Tools model
type PlanITTools struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	//Page 1
	GcPartCD              pq.StringArray `json:"gcPartCD" db:"gc_part_c_d"`
	GcPartCDOther         *string        `json:"gcPartCDOther" db:"gc_part_c_d_other"`
	GcPartCDNote          *string        `json:"gcPartCDNote" db:"gc_part_c_d_note"`
	GcCollectBids         pq.StringArray `json:"gcCollectBids" db:"gc_collect_bids"`
	GcCollectBidsOther    *string        `json:"gcCollectBidsOther" db:"gc_collect_bids_other"`
	GcCollectBidsNote     *string        `json:"gcCollectBidsNote" db:"gc_collect_bids_note"`
	GcUpdateContract      pq.StringArray `json:"gcUpdateContract" db:"gc_update_contract"`
	GcUpdateContractOther *string        `json:"gcUpdateContractOther" db:"gc_update_contract_other"`
	GcUpdateContractNote  *string        `json:"gcUpdateContractNote" db:"gc_update_contract_note"`
	//Page 2
	PpToAdvertise               pq.StringArray `json:"ppToAdvertise" db:"pp_to_advertise"`
	PpToAdvertiseOther          *string        `json:"ppToAdvertiseOther" db:"pp_to_advertise_other"`
	PpToAdvertiseNote           *string        `json:"ppToAdvertiseNote" db:"pp_to_advertise_note"`
	PpCollectScoreReview        pq.StringArray `json:"ppCollectScoreReview" db:"pp_collect_score_review"`
	PpCollectScoreReviewOther   *string        `json:"ppCollectScoreReviewOther" db:"pp_collect_score_review_other"`
	PpCollectScoreReviewNote    *string        `json:"ppCollectScoreReviewNote" db:"pp_collect_score_review_note"`
	PpAppSupportContractor      pq.StringArray `json:"ppAppSupportContractor" db:"pp_app_support_contractor"`
	PpAppSupportContractorOther *string        `json:"ppAppSupportContractorOther" db:"pp_app_support_contractor_other"`
	PpAppSupportContractorNote  *string        `json:"ppAppSupportContractorNote" db:"pp_app_support_contractor_note"`
	//Page 3
	PpCommunicateWithParticipant      pq.StringArray `json:"ppCommunicateWithParticipant" db:"pp_communicate_with_participant"`
	PpCommunicateWithParticipantOther *string        `json:"ppCommunicateWithParticipantOther" db:"pp_communicate_with_participant_other"`
	PpCommunicateWithParticipantNote  *string        `json:"ppCommunicateWithParticipantNote" db:"pp_communicate_with_participant_note"`
	PpManageProviderOverlap           pq.StringArray `json:"ppManageProviderOverlap" db:"pp_manage_provider_overlap"`
	PpManageProviderOverlapOther      *string        `json:"ppManageProviderOverlapOther" db:"pp_manage_provider_overlap_other"`
	PpManageProviderOverlapNote       *string        `json:"ppManageProviderOverlapNote" db:"pp_manage_provider_overlap_note"`
	BManageBeneficiaryOverlap         pq.StringArray `json:"bManageBeneficiaryOverlap" db:"b_manage_beneficiary_overlap"`
	BManageBeneficiaryOverlapOther    *string        `json:"bManageBeneficiaryOverlapOther" db:"b_manage_beneficiary_overlap_other"`
	BManageBeneficiaryOverlapNote     *string        `json:"bManageBeneficiaryOverlapNote" db:"b_manage_beneficiary_overlap_note"`
	//Page 4
	OelWorkingAgreement      pq.StringArray `json:"oelWorkingAgreement" db:"oel_working_agreement"`
	OelWorkingAgreementOther *string        `json:"oelWorkingAgreementOther" db:"oel_working_agreement_other"`
	OelWorkingAgreementNote  *string        `json:"oelWorkingAgreementNote" db:"oel_working_agreement_note"`
	OelHelpdeskSupport       pq.StringArray `json:"oelHelpdeskSupport" db:"oel_helpdesk_support"`
	OelHelpdeskSupportOther  *string        `json:"oelHelpdeskSupportOther" db:"oel_helpdesk_support_other"`
	OelHelpdeskSupportNote   *string        `json:"oelHelpdeskSupportNote" db:"oel_helpdesk_support_note"`
	OelManageAco             pq.StringArray `json:"oelManageAco" db:"oel_manage_aco"`
	OelManageAcoOther        *string        `json:"oelManageAcoOther" db:"oel_manage_aco_other"`
	OelManageAcoNote         *string        `json:"oelManageAcoNote" db:"oel_manage_aco_note"`
	//Page 5
	OelPerformanceBenchmark      pq.StringArray `json:"oelPerformanceBenchmark" db:"oel_performance_benchmark"`
	OelPerformanceBenchmarkOther *string        `json:"oelPerformanceBenchmarkOther" db:"oel_performance_benchmark_other"`
	OelPerformanceBenchmarkNote  *string        `json:"oelPerformanceBenchmarkNote" db:"oel_performance_benchmark_note"`
	OelProcessAppeals            pq.StringArray `json:"oelProcessAppeals" db:"oel_process_appeals"`
	OelProcessAppealsOther       *string        `json:"oelProcessAppealsOther" db:"oel_process_appeals_other"`
	OelProcessAppealsNote        *string        `json:"oelProcessAppealsNote" db:"oel_process_appeals_note"`
	OelEvaluationContractor      pq.StringArray `json:"oelEvaluationContractor" db:"oel_evaluation_contractor"`
	OelEvaluationContractorOther *string        `json:"oelEvaluationContractorOther" db:"oel_evaluation_contractor_other"`
	OelEvaluationContractorNote  *string        `json:"oelEvaluationContractorNote" db:"oel_evaluation_contractor_note"`
	//Page 6
	OelCollectData              pq.StringArray `json:"oelCollectData" db:"oel_collect_data"`
	OelCollectDataOther         *string        `json:"oelCollectDataOther" db:"oel_collect_data_other"`
	OelCollectDataNote          *string        `json:"oelCollectDataNote" db:"oel_collect_data_note"`
	OelObtainData               pq.StringArray `json:"oelObtainData" db:"oel_obtain_data"`
	OelObtainDataOther          *string        `json:"oelObtainDataOther" db:"oel_obtain_data_other"`
	OelObtainDataNote           *string        `json:"oelObtainDataNote" db:"oel_obtain_data_note"`
	OelClaimsBasedMeasures      pq.StringArray `json:"oelClaimsBasedMeasures" db:"oel_claims_based_measures"`
	OelClaimsBasedMeasuresOther *string        `json:"oelClaimsBasedMeasuresOther" db:"oel_claims_based_measures_other"`
	OelClaimsBasedMeasuresNote  *string        `json:"oelClaimsBasedMeasuresNote" db:"oel_claims_based_measures_note"`
	//Page 7
	OelQualityScores           pq.StringArray `json:"oelQualityScores" db:"oel_quality_scores"`
	OelQualityScoresOther      *string        `json:"oelQualityScoresOther" db:"oel_quality_scores_other"`
	OelQualityScoresNote       *string        `json:"oelQualityScoresNote" db:"oel_quality_scores_note"`
	OelSendReports             pq.StringArray `json:"oelSendReports" db:"oel_send_reports"`
	OelSendReportsOther        *string        `json:"oelSendReportsOther" db:"oel_send_reports_other"`
	OelSendReportsNote         *string        `json:"oelSendReportsNote" db:"oel_send_reports_note"`
	OelLearningContractor      pq.StringArray `json:"oelLearningContractor" db:"oel_learning_contractor"`
	OelLearningContractorOther *string        `json:"oelLearningContractorOther" db:"oel_learning_contractor_other"`
	OelLearningContractorNote  *string        `json:"oelLearningContractorNote" db:"oel_learning_contractor_note"`
	//Page 8
	OelParticipantCollaboration      pq.StringArray `json:"oelParticipantCollaboration" db:"oel_participant_collaboration"`
	OelParticipantCollaborationOther *string        `json:"oelParticipantCollaborationOther" db:"oel_participant_collaboration_other"`
	OelParticipantCollaborationNote  *string        `json:"oelParticipantCollaborationNote" db:"oel_participant_collaboration_note"`
	OelEducateBeneficiaries          pq.StringArray `json:"oelEducateBeneficiaries" db:"oel_educate_beneficiaries"`
	OelEducateBeneficiariesOther     *string        `json:"oelEducateBeneficiariesOther" db:"oel_educate_beneficiaries_other"`
	OelEducateBeneficiariesNote      *string        `json:"oelEducateBeneficiariesNote" db:"oel_educate_beneficiaries_note"`
	PMakeClaimsPayments              pq.StringArray `json:"pMakeClaimsPayments" db:"p_make_claims_payments"`
	PMakeClaimsPaymentsOther         *string        `json:"pMakeClaimsPaymentsOther" db:"p_make_claims_payments_other"`
	PMakeClaimsPaymentsNote          *string        `json:"pMakeClaimsPaymentsNote" db:"p_make_claims_payments_note"`
	//Page 9
	PInformFfs                   pq.StringArray `json:"pInformFfs" db:"p_inform_ffs"`
	PInformFfsOther              *string        `json:"pInformFfsOther" db:"p_inform_ffs_other"`
	PInformFfsNote               *string        `json:"pInformFfsNote" db:"p_inform_ffs_note"`
	PNonClaimsBasedPayments      pq.StringArray `json:"pNonClaimsBasedPayments" db:"p_non_claims_based_payments"`
	PNonClaimsBasedPaymentsOther *string        `json:"pNonClaimsBasedPaymentsOther" db:"p_non_claims_based_payments_other"`
	PNonClaimsBasedPaymentsNote  *string        `json:"pNonClaimsBasedPaymentsNote" db:"p_non_claims_based_payments_note"`
	PSharedSavingsPlan           pq.StringArray `json:"pSharedSavingsPlan" db:"p_shared_savings_plan"`
	PSharedSavingsPlanOther      *string        `json:"pSharedSavingsPlanOther" db:"p_shared_savings_plan_other"`
	PSharedSavingsPlanNote       *string        `json:"pSharedSavingsPlanNote" db:"p_shared_savings_plan_note"`
	//Page 10
	PRecoverPayments      pq.StringArray `json:"pRecoverPayments" db:"p_recover_payments"`
	PRecoverPaymentsOther *string        `json:"pRecoverPaymentsOther" db:"p_recover_payments_other"`
	PRecoverPaymentsNote  *string        `json:"pRecoverPaymentsNote" db:"p_recover_payments_note"`

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

	// status, err := GenericallyCalculateStatus(*it)
	// if err != nil {
	// 	return err
	// }

	it.Status = TaskReady
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
