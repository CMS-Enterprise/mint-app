package models

import "github.com/google/uuid"

type MTOCommonMilestone struct {
	Name              string                    `json:"name" db:"name"`
	Key               MTOCommonMilestoneKey     `json:"key" db:"key"`
	CategoryName      string                    `json:"categoryName" db:"category_name"`
	SubCategoryName   *string                   `json:"subCategoryName" db:"sub_category_name"`
	FacilitatedByRole EnumArray[MTOFacilitator] `json:"facilitatedByRole" db:"facilitated_by_role"`

	// Section specifies the Task List Section that corresponds to suggesting this common milestone
	Section TaskListSection `json:"section" db:"section"`

	ModelPlanID *uuid.UUID `json:"modelPlanID" db:"model_plan_id"` //TODO (mto) verify this, this would facilitate queries and is_added. This is not an actual database column
	IsAdded     bool       `json:"isAdded" db:"is_added"`          //TODO (mto) verify this
}

type MTOCommonMilestoneKey string

const (
	MTOCommonMilestoneKeyManageCd                                    MTOCommonMilestoneKey = "MANAGE_CD"
	MTOCommonMilestoneKeyRevColBids                                  MTOCommonMilestoneKey = "REV_COL_BIDS"
	MTOCommonMilestoneKeyUpdateContract                              MTOCommonMilestoneKey = "UPDATE_CONTRACT"
	MTOCommonMilestoneKeySignParticipationAgreements                 MTOCommonMilestoneKey = "SIGN_PARTICIPATION_AGREEMENTS"
	MTOCommonMilestoneKeyRecruitParticipants                         MTOCommonMilestoneKey = "RECRUIT_PARTICIPANTS"
	MTOCommonMilestoneKeyRevScoreApp                                 MTOCommonMilestoneKey = "REV_SCORE_APP"
	MTOCommonMilestoneKeyAppSupportCon                               MTOCommonMilestoneKey = "APP_SUPPORT_CON"
	MTOCommonMilestoneKeyCommWPart                                   MTOCommonMilestoneKey = "COMM_W_PART"
	MTOCommonMilestoneKeyVetProvidersForProgramIntegrity             MTOCommonMilestoneKey = "VET_PROVIDERS_FOR_PROGRAM_INTEGRITY"
	MTOCommonMilestoneKeyManageProvOverlap                           MTOCommonMilestoneKey = "MANAGE_PROV_OVERLAP"
	MTOCommonMilestoneKeyManageBenOverlap                            MTOCommonMilestoneKey = "MANAGE_BEN_OVERLAP"
	MTOCommonMilestoneKeyHelpdeskSupport                             MTOCommonMilestoneKey = "HELPDESK_SUPPORT"
	MTOCommonMilestoneKeyIddocSupport                                MTOCommonMilestoneKey = "IDDOC_SUPPORT"
	MTOCommonMilestoneKeyEstablishBench                              MTOCommonMilestoneKey = "ESTABLISH_BENCH"
	MTOCommonMilestoneKeyProcessPartAppeals                          MTOCommonMilestoneKey = "PROCESS_PART_APPEALS"
	MTOCommonMilestoneKeyAcquireAnEvalCont                           MTOCommonMilestoneKey = "ACQUIRE_AN_EVAL_CONT"
	MTOCommonMilestoneKeyDataToMonitor                               MTOCommonMilestoneKey = "DATA_TO_MONITOR"
	MTOCommonMilestoneKeyDataToSupportEval                           MTOCommonMilestoneKey = "DATA_TO_SUPPORT_EVAL"
	MTOCommonMilestoneKeyClaimsBasedMeasures                         MTOCommonMilestoneKey = "CLAIMS_BASED_MEASURES"
	MTOCommonMilestoneKeyQualityPerformanceScores                    MTOCommonMilestoneKey = "QUALITY_PERFORMANCE_SCORES"
	MTOCommonMilestoneKeySendRepdataToPart                           MTOCommonMilestoneKey = "SEND_REPDATA_TO_PART"
	MTOCommonMilestoneKeyUtilizeQualityMeasuresDevelopmentContractor MTOCommonMilestoneKey = "UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR"
	MTOCommonMilestoneKeyAcquireALearnCont                           MTOCommonMilestoneKey = "ACQUIRE_A_LEARN_CONT"
	MTOCommonMilestoneKeyPartToPartCollab                            MTOCommonMilestoneKey = "PART_TO_PART_COLLAB"
	MTOCommonMilestoneKeyEducateBenef                                MTOCommonMilestoneKey = "EDUCATE_BENEF"
	MTOCommonMilestoneKeyItPlatformForLearning                       MTOCommonMilestoneKey = "IT_PLATFORM_FOR_LEARNING"
	MTOCommonMilestoneKeyAdjustFfsClaims                             MTOCommonMilestoneKey = "ADJUST_FFS_CLAIMS"
	MTOCommonMilestoneKeyManageFfsExclPayments                       MTOCommonMilestoneKey = "MANAGE_FFS_EXCL_PAYMENTS"
	MTOCommonMilestoneKeyMakeNonClaimsBasedPayments                  MTOCommonMilestoneKey = "MAKE_NON_CLAIMS_BASED_PAYMENTS"
	MTOCommonMilestoneKeyComputeSharedSavingsPayment                 MTOCommonMilestoneKey = "COMPUTE_SHARED_SAVINGS_PAYMENT"
	MTOCommonMilestoneKeyRecoverPayments                             MTOCommonMilestoneKey = "RECOVER_PAYMENTS"
)
