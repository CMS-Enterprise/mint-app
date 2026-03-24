package models

import "github.com/google/uuid"

// MTOCommonMilestoneKey is a stable string identifier for each common milestone.
// The key column is retained on mto_common_milestone even after the UUID primary key was introduced in V259.
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
	MTOCommonMilestoneKeyAcquireAnImpCont                            MTOCommonMilestoneKey = "ACQUIRE_AN_IMP_CONT"
	MTOCommonMilestoneKeyAcquireAPreImpCont                          MTOCommonMilestoneKey = "ACQUIRE_A_PRE_IMP_CONT"
	MTOCommonMilestoneKeyAcquireADataAggCont                         MTOCommonMilestoneKey = "ACQUIRE_A_DATA_AGG_CONT"
	MTOCommonMilestoneKeySendDashboardsReportsToPart                 MTOCommonMilestoneKey = "SEND_DASHBOARDS_REPORTS_TO_PART"
	MTOCommonMilestoneKeySendDataViaAPIToPart                        MTOCommonMilestoneKey = "SEND_DATA_VIA_API_TO_PART"
	MTOCommonMilestoneKeySendRawFilesToPart                          MTOCommonMilestoneKey = "SEND_RAW_FILES_TO_PART"
	MTOCommonMilestoneKeySignCooperativeAgreements                   MTOCommonMilestoneKey = "SIGN_COOPERATIVE_AGREEMENTS"
)

type MTOCommonMilestone struct {
	ID                uuid.UUID                 `json:"id" db:"id"`
	Key               MTOCommonMilestoneKey     `json:"key" db:"key"`
	Name              string                    `json:"name" db:"name"`
	Description       string                    `json:"description" db:"description"`
	CategoryName      string                    `json:"categoryName" db:"category_name"`
	SubCategoryName   *string                   `json:"subCategoryName" db:"sub_category_name"`
	FacilitatedByRole EnumArray[MTOFacilitator] `json:"facilitatedByRole" db:"facilitated_by_role"`

	// Section specifies the Task List Section that corresponds to suggesting this common milestone
	Section TaskListSection `json:"section" db:"section"`
	// These fields facilitate queries but are not actual columns on the mto_common_milestone table.
	// They are populated via JOINs when querying in the context of a model plan.
	ModelPlanID *uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
	IsArchived  bool       `json:"isArchived" db:"is_archived"`
	IsAdded     bool       `json:"isAdded" db:"is_added"`
	// MTOSuggestedMilestoneID is the ID of the mto_suggested_milestone row for this milestone+model plan,
	// or nil if the milestone is not currently suggested. Used to fetch suggestion reasons via dataloader.
	MTOSuggestedMilestoneID *uuid.UUID `json:"mtoSuggestedMilestoneID" db:"mto_suggested_milestone_id"`
}
