package models

import "github.com/google/uuid"

type MTOCommonSolution struct {
	Name        string                              `json:"name" db:"name"`
	Key         MTOCommonSolutionKey                `json:"key" db:"key"`
	Type        MTOSolutionType                     `json:"type" db:"type"`
	Subject     EnumArray[MTOCommonSolutionSubject] `json:"subject" db:"subject"`
	FilterView  *ModelViewFilter                    `json:"filterView" db:"filter_view"`
	ModelPlanID *uuid.UUID                          `json:"modelPlanID" db:"model_plan_id"` //TODO (mto) verify this, this would facilitate queries and is_added. This is not an actual database column
	// This field is here for the sake of simplifying DB queries, it comes from a linking table, and only provides some contextual data
	CommonMilestoneKey *MTOCommonMilestoneKey `json:"commonMilestoneKey" db:"mto_common_milestone_key"` //TODO (mto) verify this,
	IsAdded            bool                   `json:"isAdded" db:"is_added"`                            //TODO (mto) verify this
}

type MTOCommonSolutionKey string

const (
	MTOCSKInnovation                MTOCommonSolutionKey = "INNOVATION"
	MTOCSKAcoOs                     MTOCommonSolutionKey = "ACO_OS"
	MTOCSKApps                      MTOCommonSolutionKey = "APPS"
	MTOCSKCdx                       MTOCommonSolutionKey = "CDX"
	MTOCSKCcw                       MTOCommonSolutionKey = "CCW"
	MTOCSKCmsBox                    MTOCommonSolutionKey = "CMS_BOX"
	MTOCSKCmsQualtrics              MTOCommonSolutionKey = "CMS_QUALTRICS"
	MTOCSKCbosc                     MTOCommonSolutionKey = "CBOSC"
	MTOCSKCpiVetting                MTOCommonSolutionKey = "CPI_VETTING"
	MTOCSKEft                       MTOCommonSolutionKey = "EFT"
	MTOCSKExistingCmsDataAndProcess MTOCommonSolutionKey = "EXISTING_CMS_DATA_AND_PROCESS"
	MTOCSKEdfr                      MTOCommonSolutionKey = "EDFR"
	MTOCSKGovdelivery               MTOCommonSolutionKey = "GOVDELIVERY"
	MTOCSKGs                        MTOCommonSolutionKey = "GS"
	MTOCSKHdr                       MTOCommonSolutionKey = "HDR"
	MTOCSKHpms                      MTOCommonSolutionKey = "HPMS"
	MTOCSKHiglas                    MTOCommonSolutionKey = "HIGLAS"
	MTOCSKIpc                       MTOCommonSolutionKey = "IPC"
	MTOCSKIdr                       MTOCommonSolutionKey = "IDR"
	MTOCSKLdg                       MTOCommonSolutionKey = "LDG"
	MTOCSKLv                        MTOCommonSolutionKey = "LV"
	MTOCSKMdmPor                    MTOCommonSolutionKey = "MDM_POR"
	MTOCSKMarx                      MTOCommonSolutionKey = "MARX"
	MTOCSKOutlookMailbox            MTOCommonSolutionKey = "OUTLOOK_MAILBOX"
	MTOCSKQv                        MTOCommonSolutionKey = "QV"
	MTOCSKRmada                     MTOCommonSolutionKey = "RMADA"
	MTOCSKArs                       MTOCommonSolutionKey = "ARS"
	MTOCSKConnect                   MTOCommonSolutionKey = "CONNECT"
	MTOCSKLoi                       MTOCommonSolutionKey = "LOI"
	MTOCSKPostPortal                MTOCommonSolutionKey = "POST_PORTAL"
	MTOCSKRfa                       MTOCommonSolutionKey = "RFA"
	MTOCSKSharedSystems             MTOCommonSolutionKey = "SHARED_SYSTEMS"
	MTOCSKBcda                      MTOCommonSolutionKey = "BCDA"
	MTOCSKIsp                       MTOCommonSolutionKey = "ISP"
	MTOCSKMids                      MTOCommonSolutionKey = "MIDS"
	MTOCSKMdmNcbp                   MTOCommonSolutionKey = "MDM_NCBP"
	MTOCSKModelSpace                MTOCommonSolutionKey = "MODEL_SPACE"
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
)

type MTOSolutionType string

const (
	MTOSolutionTypeItSystem   MTOSolutionType = "IT_SYSTEM"
	MTOSolutionTypeContractor MTOSolutionType = "CONTRACTOR"
	MTOCrossCuttingGroup      MTOSolutionType = "CROSS_CUTTING_GROUP"
	MTOSolutionTypeOther      MTOSolutionType = "OTHER"
)
