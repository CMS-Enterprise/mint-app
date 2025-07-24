package models

import "github.com/google/uuid"

type MTOCommonSolution struct {
	ID         int                                 `json:"id" db:"id"`
	Name       string                              `json:"name" db:"name"`
	Key        MTOCommonSolutionKey                `json:"key" db:"key"`
	Type       MTOSolutionType                     `json:"type" db:"type"`
	Subjects   EnumArray[MTOCommonSolutionSubject] `json:"subjects" db:"subjects"`
	FilterView *ModelViewFilter                    `json:"filterView" db:"filter_view"`
	// This field facilitate queries, but is not an actual database column (the mto_solution table joins to the model plan, and potentially to this table, unless it is a custom solution)
	ModelPlanID *uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
	// This field is here for the sake of simplifying DB queries, it comes from a linking table, and only provides some contextual data
	CommonMilestoneKey *MTOCommonMilestoneKey `json:"commonMilestoneKey" db:"mto_common_milestone_key"`
	// This field facilitate queries, but is not an actual database column. It is evaluated contextually in the database to note if a common solution has been added to an MTO for a specific model plan
	IsAdded bool `json:"isAdded" db:"is_added"`
}

type MTOCommonSolutionKey string

// IsTaggedEntity is a method to satisfy the IsTaggedEntity interface for MTOCommonSolution.
func (MTOCommonSolution) IsTaggedEntity() {}

const (
	MTOCSKInnovation     MTOCommonSolutionKey = "INNOVATION"
	MTOCSKAcoOs          MTOCommonSolutionKey = "ACO_OS"
	MTOCSKApps           MTOCommonSolutionKey = "APPS"
	MTOCSKCdx            MTOCommonSolutionKey = "CDX"
	MTOCSKCcw            MTOCommonSolutionKey = "CCW"
	MTOCSKCmsBox         MTOCommonSolutionKey = "CMS_BOX"
	MTOCSKCbosc          MTOCommonSolutionKey = "CBOSC"
	MTOCSKCpiVetting     MTOCommonSolutionKey = "CPI_VETTING"
	MTOCSKEft            MTOCommonSolutionKey = "EFT"
	MTOCSKEdfr           MTOCommonSolutionKey = "EDFR"
	MTOCSKGovdelivery    MTOCommonSolutionKey = "GOVDELIVERY"
	MTOCSKGs             MTOCommonSolutionKey = "GS"
	MTOCSKHdr            MTOCommonSolutionKey = "HDR"
	MTOCSKHpms           MTOCommonSolutionKey = "HPMS"
	MTOCSKHiglas         MTOCommonSolutionKey = "HIGLAS"
	MTOCSKIpc            MTOCommonSolutionKey = "IPC"
	MTOCSKIdr            MTOCommonSolutionKey = "IDR"
	MTOCSKLdg            MTOCommonSolutionKey = "LDG"
	MTOCSKLv             MTOCommonSolutionKey = "LV"
	MTOCSKMdmPor         MTOCommonSolutionKey = "MDM_POR"
	MTOCSKMarx           MTOCommonSolutionKey = "MARX"
	MTOCSKOutlookMailbox MTOCommonSolutionKey = "OUTLOOK_MAILBOX"
	MTOCSKQv             MTOCommonSolutionKey = "QV"
	MTOCSKRmada          MTOCommonSolutionKey = "RMADA"
	MTOCSKArs            MTOCommonSolutionKey = "ARS"
	MTOCSKConnect        MTOCommonSolutionKey = "CONNECT"
	MTOCSKLoi            MTOCommonSolutionKey = "LOI"
	MTOCSKPostPortal     MTOCommonSolutionKey = "POST_PORTAL"
	MTOCSKRfa            MTOCommonSolutionKey = "RFA"
	MTOCSKSharedSystems  MTOCommonSolutionKey = "SHARED_SYSTEMS"
	MTOCSKBcda           MTOCommonSolutionKey = "BCDA"
	MTOCSKIsp            MTOCommonSolutionKey = "ISP"
	MTOCSKMids           MTOCommonSolutionKey = "MIDS"
	MTOCSKMdmNcbp        MTOCommonSolutionKey = "MDM_NCBP"
	MTOCSKModelSpace     MTOCommonSolutionKey = "MODEL_SPACE"
	MTOCSKCdac           MTOCommonSolutionKey = "CDAC"
	MTOCSKRreg           MTOCommonSolutionKey = "RREG"
	MTOCSKFfrdc          MTOCommonSolutionKey = "FFRDC"
	MTOCSKArds           MTOCommonSolutionKey = "ARDS"
	MTOCSKTmiss          MTOCommonSolutionKey = "T_MISS"
	MTOCSKEppe           MTOCommonSolutionKey = "EPPE"
	MTOCSKDsep           MTOCommonSolutionKey = "DSEP"
	MTOCSKAms            MTOCommonSolutionKey = "AMS"
	MTOCSKIcLanding      MTOCommonSolutionKey = "IC_LANDING"
	MTOCSKRass           MTOCommonSolutionKey = "RASS"
	MTOCSKDdps           MTOCommonSolutionKey = "DDPS"
	MTOCSKOact           MTOCommonSolutionKey = "OACT"
	MTOCSKQpp            MTOCommonSolutionKey = "QPP"
	MTOCSKPam            MTOCommonSolutionKey = "PAM"
)

type MTOCommonSolutionSubject string

const (
	MTOCSSApplicationsAndParticipantInteractionAcoAndKidneyModels MTOCommonSolutionSubject = "APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS"
	MTOCSSApplicationsAndParticipantInteractionNonAcoModels       MTOCommonSolutionSubject = "APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS"
	MTOCSSMedicareFeeForService                                   MTOCommonSolutionSubject = "MEDICARE_FEE_FOR_SERVICE"
	MTOCSSContractVehicles                                        MTOCommonSolutionSubject = "CONTRACT_VEHICLES"
	MTOCSSLearning                                                MTOCommonSolutionSubject = "LEARNING"
	MTOCSSQuality                                                 MTOCommonSolutionSubject = "QUALITY"
	MTOCSSCommunicationToolsAndHelpDesk                           MTOCommonSolutionSubject = "COMMUNICATION_TOOLS_AND_HELP_DESK"
	MTOCSSMedicareAdvantageAndPartD                               MTOCommonSolutionSubject = "MEDICARE_ADVANTAGE_AND_PART_D"
	MTOCSSPaymentsAndFinancials                                   MTOCommonSolutionSubject = "PAYMENTS_AND_FINANCIALS"
	MTOCSSData                                                    MTOCommonSolutionSubject = "DATA"
	MTOCSSLegal                                                   MTOCommonSolutionSubject = "LEGAL"
	MTOCSSEvaluationAndReview                                     MTOCommonSolutionSubject = "EVALUATION_AND_REVIEW"
)

type MTOSolutionType string

const (
	MTOSolutionTypeItSystem   MTOSolutionType = "IT_SYSTEM"
	MTOSolutionTypeContractor MTOSolutionType = "CONTRACTOR"
	MTOCrossCuttingGroup      MTOSolutionType = "CROSS_CUTTING_GROUP"
	MTOSolutionTypeOther      MTOSolutionType = "OTHER"
)
