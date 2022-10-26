package models

import (
	"time"
)

// PossibleOperationalNeed represents the need of a model plan
type PossibleOperationalNeed struct {
	ID          int        `json:"id" db:"id"`
	CreatedBy   string     `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`

	Name string             `json:"name" db:"need_name"`
	Key  OperationalNeedKey `json:"key" db:"need_key"`
}

// OperationalNeedKey represents the types of OperationalNeedKey types.
type OperationalNeedKey string

// These are the options for OperationalNeedKey
const (
	OpNKManageCd                    OperationalNeedKey = "MANAGE_CD"
	OpNKRevColBids                  OperationalNeedKey = "REV_COL_BIDS"
	OpNKUpdateContract              OperationalNeedKey = "UPDATE_CONTRACT"
	OpNKAdvertiseModel              OperationalNeedKey = "ADVERTISE_MODEL"
	OpNKColRevScoreApp              OperationalNeedKey = "COL_REV_SCORE_APP"
	OpNKAppSupportCon               OperationalNeedKey = "APP_SUPPORT_CON"
	OpNKCommWPart                   OperationalNeedKey = "COMM_W_PART"
	OpNKManageProvOverlap           OperationalNeedKey = "MANAGE_PROV_OVERLAP"
	OpNKManageBenOverlap            OperationalNeedKey = "MANAGE_BEN_OVERLAP"
	OpNKHelpdeskSupport             OperationalNeedKey = "HELPDESK_SUPPORT"
	OpNKIddocSupport                OperationalNeedKey = "IDDOC_SUPPORT"
	OpNKEstablishBench              OperationalNeedKey = "ESTABLISH_BENCH"
	OpNKProcessPartAppeals          OperationalNeedKey = "PROCESS_PART_APPEALS"
	OpNKAcquireAnEvalCont           OperationalNeedKey = "ACQUIRE_AN_EVAL_CONT"
	OpNKDataToMonitor               OperationalNeedKey = "DATA_TO_MONITOR"
	OpNKDataToSupportEval           OperationalNeedKey = "DATA_TO_SUPPORT_EVAL"
	OpNKClaimsBasedMeasures         OperationalNeedKey = "CLAIMS_BASED_MEASURES"
	OpNKQualityPerformanceScores    OperationalNeedKey = "QUALITY_PERFORMANCE_SCORES"
	OpNKSendRepdataToPart           OperationalNeedKey = "SEND_REPDATA_TO_PART"
	OpNKAcquireALearnCont           OperationalNeedKey = "ACQUIRE_A_LEARN_CONT"
	OpNKPartToPartCollab            OperationalNeedKey = "PART_TO_PART_COLLAB"
	OpNKEducateBenef                OperationalNeedKey = "EDUCATE_BENEF"
	OpNKAdjustFfsClaims             OperationalNeedKey = "ADJUST_FFS_CLAIMS"
	OpNKManageFfsExclPayments       OperationalNeedKey = "MANAGE_FFS_EXCL_PAYMENTS"
	OpNKMakeNonClaimsBasedPayments  OperationalNeedKey = "MAKE_NON_CLAIMS_BASED_PAYMENTS"
	OpNKComputeSharedSavingsPayment OperationalNeedKey = "COMPUTE_SHARED_SAVINGS_PAYMENT"
	OpNKRecoverPayments             OperationalNeedKey = "RECOVER_PAYMENTS"
)
