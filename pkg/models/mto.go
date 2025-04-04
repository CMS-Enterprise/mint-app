package models

import (
	"time"

	"github.com/google/uuid"
)

type ModelsToOperationMatrix struct {
	// empty on purpose so we have to add resolvers
	// we could probably swap ModelPlan out for modelPlanRelation since we only really need the ID, but this works for now
	ModelPlan *ModelPlan
}
type MTO struct {
	baseStruct
	modelPlanRelation

	// Note a ready for review by relation could make sense here, and also be embedded for base task list section
	ReadyForReviewBy  *uuid.UUID `json:"readyForReviewBy" db:"ready_for_review_by"`
	ReadyForReviewDts *time.Time `json:"readyForReviewDts" db:"ready_for_review_dts"`
}

type MTOFacilitator string

// These are the options for MTOFacilitator
const (
	MTOFacilitatorModelTeam                            MTOFacilitator = "MODEL_TEAM"
	MTOFacilitatorModelLead                            MTOFacilitator = "MODEL_LEAD"
	MTOFacilitatorITLead                               MTOFacilitator = "IT_LEAD"
	MTOFacilitatorSolutionArchitect                    MTOFacilitator = "SOLUTION_ARCHITECT"
	MTOFacilitatorITSystemTeamOrProductOwner           MTOFacilitator = "IT_SYSTEM_TEAM_OR_PRODUCT_OWNER"
	MTOFacilitatorParticipants                         MTOFacilitator = "PARTICIPANTS"
	MTOFacilitatorApplicationSupportContractor         MTOFacilitator = "APPLICATION_SUPPORT_CONTRACTOR"
	MTOFacilitatorImplementationContractor             MTOFacilitator = "IMPLEMENTATION_CONTRACTOR"
	MTOFacilitatorEvaluationContractor                 MTOFacilitator = "EVALUATION_CONTRACTOR"
	MTOFacilitatorQualityMeasuresDevelopmentContractor MTOFacilitator = "QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR"
	MTOFacilitatorLearningContractor                   MTOFacilitator = "LEARNING_CONTRACTOR"
	MTOFacilitatorMonitoringContractor                 MTOFacilitator = "MONITORING_CONTRACTOR"
	MTOFacilitatorContractingOfficersRepresentative    MTOFacilitator = "CONTRACTING_OFFICERS_REPRESENTATIVE"
	MTOFacilitatorLearningAndDiffusionGroup            MTOFacilitator = "LEARNING_AND_DIFFUSION_GROUP"
	MTOFacilitatorResearchAndRapidCycleEvaluationGroup MTOFacilitator = "RESEARCH_AND_RAPID_CYCLE_EVALUATION_GROUP"
	MTOFacilitatorOther                                MTOFacilitator = "OTHER"
)

type MTORiskIndicator string

// These are the options for MTORiskIndicator
const (
	MTORiskIndicatorOnTrack  MTORiskIndicator = "ON_TRACK"
	MTORiskIndicatorOffTrack MTORiskIndicator = "OFF_TRACK"
	MTORiskIndicatorAtRisk   MTORiskIndicator = "AT_RISK"
)

type MTOStatus string

// These are the options for MTOStatus
const (
	MTOStatusReadyToStart   MTOStatus = "READY"
	MTOStatusInProgress     MTOStatus = "IN_PROGRESS"
	MTOStatusReadyForReview MTOStatus = "READY_FOR_REVIEW"
)
