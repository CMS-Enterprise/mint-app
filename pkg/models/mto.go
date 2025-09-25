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

type MTOMilestoneResponsibleComponent string

// These are the options for MTOMilestoneResponsibleComponent
const (
	MTOMilestoneResponsibleComponentCCIIO     MTOMilestoneResponsibleComponent = "CIIO"
	MTOMilestoneResponsibleComponentCCSQ      MTOMilestoneResponsibleComponent = "CCSQ"
	MTOMilestoneResponsibleComponentCM        MTOMilestoneResponsibleComponent = "CM"
	MTOMilestoneResponsibleComponentCMCS      MTOMilestoneResponsibleComponent = "CMCS"
	MTOMilestoneResponsibleComponentCMMIBSG   MTOMilestoneResponsibleComponent = "CMMI_BSG"
	MTOMilestoneResponsibleComponentCMMILDG   MTOMilestoneResponsibleComponent = "CMMI_LDG"
	MTOMilestoneResponsibleComponentCMMIPCMG  MTOMilestoneResponsibleComponent = "CMMI_PCMG"
	MTOMilestoneResponsibleComponentCMMIPPG   MTOMilestoneResponsibleComponent = "CMMI_PPG"
	MTOMilestoneResponsibleComponentCMMIRRCEG MTOMilestoneResponsibleComponent = "CMMI_RRCEG"
	MTOMilestoneResponsibleComponentCMMISCMG  MTOMilestoneResponsibleComponent = "CMMI_SCMG"
	MTOMilestoneResponsibleComponentCMMISPHG  MTOMilestoneResponsibleComponent = "CMMI_SPHG"
	MTOMilestoneResponsibleComponentCPI       MTOMilestoneResponsibleComponent = "CPI"
	MTOMilestoneResponsibleComponentFCHCO     MTOMilestoneResponsibleComponent = "FCHCO"
	MTOMilestoneResponsibleComponentOA        MTOMilestoneResponsibleComponent = "OA"
	MTOMilestoneResponsibleComponentOACT      MTOMilestoneResponsibleComponent = "OACT"
	MTOMilestoneResponsibleComponentOAGM      MTOMilestoneResponsibleComponent = "OAGM"
	MTOMilestoneResponsibleComponentOC        MTOMilestoneResponsibleComponent = "OC"
	MTOMilestoneResponsibleComponentOEDA      MTOMilestoneResponsibleComponent = "OEDA"
	MTOMilestoneResponsibleComponentOEOCR     MTOMilestoneResponsibleComponent = "OEOCR"
	MTOMilestoneResponsibleComponentOFM       MTOMilestoneResponsibleComponent = "OFM"
	MTOMilestoneResponsibleComponentOHC       MTOMilestoneResponsibleComponent = "OHC"
	MTOMilestoneResponsibleComponentOHEI      MTOMilestoneResponsibleComponent = "OHEI"
	MTOMilestoneResponsibleComponentOHI       MTOMilestoneResponsibleComponent = "OHI"
	MTOMilestoneResponsibleComponentOITAMG    MTOMilestoneResponsibleComponent = "OIT_AMG"
	MTOMilestoneResponsibleComponentOITBOG    MTOMilestoneResponsibleComponent = "OIT_BOG"
	MTOMilestoneResponsibleComponentOITEADG   MTOMilestoneResponsibleComponent = "OIT_EADG"
	MTOMilestoneResponsibleComponentOITESSG   MTOMilestoneResponsibleComponent = "OIT_ESSG"
	MTOMilestoneResponsibleComponentOITICPG   MTOMilestoneResponsibleComponent = "OIT_ICPG"
	MTOMilestoneResponsibleComponentOITISPG   MTOMilestoneResponsibleComponent = "OIT_ISPG"
	MTOMilestoneResponsibleComponentOITIUSG   MTOMilestoneResponsibleComponent = "OIT_IUSG"
	MTOMilestoneResponsibleComponentOITNTSS   MTOMilestoneResponsibleComponent = "OIT_NTSS"
	MTOMilestoneResponsibleComponentOL        MTOMilestoneResponsibleComponent = "OL"
	MTOMilestoneResponsibleComponentOMH       MTOMilestoneResponsibleComponent = "OMH"
	MTOMilestoneResponsibleComponentOPOLE     MTOMilestoneResponsibleComponent = "OPOLE"
	MTOMilestoneResponsibleComponentOSFLO     MTOMilestoneResponsibleComponent = "OSFLO"
	MTOMilestoneResponsibleComponentOSORA     MTOMilestoneResponsibleComponent = "OSORA"
	MTOMilestoneResponsibleComponentOSPR      MTOMilestoneResponsibleComponent = "OSPR"
)

type MTOFacilitator string

// These are the options for MTOFacilitator
const (
	MTOFacilitatorModelTeam                            MTOFacilitator = "MODEL_TEAM"
	MTOFacilitatorModelLead                            MTOFacilitator = "MODEL_LEAD"
	MTOFacilitatorITLead                               MTOFacilitator = "IT_LEAD"
	MTOFacilitatorSolutionArchitect                    MTOFacilitator = "SOLUTION_ARCHITECT"
	MTOFacilitatorITSystemProductOwner                 MTOFacilitator = "IT_SYSTEM_PRODUCT_OWNER"
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
	MTOFacilitatorDataAnalyticsContractor              MTOFacilitator = "DATA_ANALYTICS_CONTRACTOR"
	MTOFacilitatorModelDataLead                        MTOFacilitator = "MODEL_DATA_LEAD"
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
