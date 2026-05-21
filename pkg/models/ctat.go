package models

// CTATContractType represents the possible contract types for a CTAT request.
type CTATContractType string

// Enum values for CTATContractType.
const (
	CTATContractTypeCostPlusFixedFee  CTATContractType = "COST_PLUS_FIXED_FEE"
	CTATContractTypeCostReimbursement CTATContractType = "COST_REIMBURSEMENT"
	CTATContractTypeFirmFixedPrice    CTATContractType = "FIRM_FIXED_PRICE"
	CTATContractTypeIncentiveContract CTATContractType = "INCENTIVE_CONTRACT"
	CTATContractTypeTimeAndMaterials  CTATContractType = "TIME_AND_MATERIALS"
	CTATContractTypeOther             CTATContractType = "OTHER"
)

// CTATContractActivityType represents the possible contract activity types for a CTAT request.
type CTATContractActivityType string

// Enum values for CTATContractActivityType.
const (
	CTATContractActivityTypeEvaluation          CTATContractActivityType = "EVALUATION"
	CTATContractActivityTypeImplementation      CTATContractActivityType = "IMPLEMENTATION"
	CTATContractActivityTypeLearning            CTATContractActivityType = "LEARNING"
	CTATContractActivityTypeTechnicalAssistance CTATContractActivityType = "TECHNICAL_ASSISTANCE"
	CTATContractActivityTypeOther               CTATContractActivityType = "OTHER"
)

// CTATRequestUrgency represents the possible urgency values for a CTAT request.
type CTATRequestUrgency string

// Enum values for CTATRequestUrgency.
const (
	CTATRequestUrgencyHigh   CTATRequestUrgency = "HIGH"
	CTATRequestUrgencyMedium CTATRequestUrgency = "MEDIUM"
	CTATRequestUrgencyLow    CTATRequestUrgency = "LOW"
)

// CTATStatus represents the possible status values for a CTAT request.
type CTATStatus string

// Enum values for CTATStatus.
const (
	CTATStatusInProgress CTATStatus = "IN_PROGRESS"
	CTATStatusNew        CTATStatus = "NEW"
	CTATStatusAssigned   CTATStatus = "ASSIGNED"
	CTATStatusClosed     CTATStatus = "CLOSED"
)

// CTATCMMIGroupOption represents the possible CMMI group values for a CTAT record.
type CTATCMMIGroupOption string

// Enum values for CTATCMMIGroupOption.
const (
	CTATCMMIGroupOptionBSG   CTATCMMIGroupOption = "BSG"
	CTATCMMIGroupOptionLDG   CTATCMMIGroupOption = "LDG"
	CTATCMMIGroupOptionPCMG  CTATCMMIGroupOption = "PCMG"
	CTATCMMIGroupOptionPPG   CTATCMMIGroupOption = "PPG"
	CTATCMMIGroupOptionRREG  CTATCMMIGroupOption = "RREG"
	CTATCMMIGroupOptionSCMG  CTATCMMIGroupOption = "SCMG"
	CTATCMMIGroupOptionSPHG  CTATCMMIGroupOption = "SPHG"
	CTATCMMIGroupOptionOther CTATCMMIGroupOption = "OTHER"
)

// CTATCMMIDivisionOption represents the possible CMMI division values for a CTAT record.
type CTATCMMIDivisionOption string

// Enum values for CTATCMMIDivisionOption.
const (
	CTATCMMIDivisionOptionBSGDBOM   CTATCMMIDivisionOption = "BSG_DBOM"
	CTATCMMIDivisionOptionBSGDCCS   CTATCMMIDivisionOption = "BSG_DCCS"
	CTATCMMIDivisionOptionBSGDSSOS  CTATCMMIDivisionOption = "BSG_DSSOS"
	CTATCMMIDivisionOptionBSGDTS    CTATCMMIDivisionOption = "BSG_DTS"
	CTATCMMIDivisionOptionLDGDMLS   CTATCMMIDivisionOption = "LDG_DMLS"
	CTATCMMIDivisionOptionLDGDAN    CTATCMMIDivisionOption = "LDG_DAN"
	CTATCMMIDivisionOptionPCMGDAPC  CTATCMMIDivisionOption = "PCMG_DAPC"
	CTATCMMIDivisionOptionPCMGDHCPM CTATCMMIDivisionOption = "PCMG_DHCPM"
	CTATCMMIDivisionOptionPCMGDSPM  CTATCMMIDivisionOption = "PCMG_DSPM"
	CTATCMMIDivisionOptionPCMGDAPM  CTATCMMIDivisionOption = "PCMG_DAPM"
	CTATCMMIDivisionOptionPCMGDPM   CTATCMMIDivisionOption = "PCMG_DPM"
	CTATCMMIDivisionOptionPPGDAPMI  CTATCMMIDivisionOption = "PPG_DAPMI"
	CTATCMMIDivisionOptionPPGDDA    CTATCMMIDivisionOption = "PPG_DDA"
	CTATCMMIDivisionOptionPPGDESP   CTATCMMIDivisionOption = "PPG_DESP"
	CTATCMMIDivisionOptionPPGDPMS   CTATCMMIDivisionOption = "PPG_DPMS"
	CTATCMMIDivisionOptionRREGDHSR  CTATCMMIDivisionOption = "RREG_DHSR"
	CTATCMMIDivisionOptionRREGDPAR  CTATCMMIDivisionOption = "RREG_DPAR"
	CTATCMMIDivisionOptionRREGDSPR  CTATCMMIDivisionOption = "RREG_DSPR"
	CTATCMMIDivisionOptionRREGDRAM  CTATCMMIDivisionOption = "RREG_DRAM"
	CTATCMMIDivisionOptionSCMGDHPI  CTATCMMIDivisionOption = "SCMG_DHPI"
	CTATCMMIDivisionOptionSCMGDFR   CTATCMMIDivisionOption = "SCMG_DFR"
	CTATCMMIDivisionOptionSCMGDSI   CTATCMMIDivisionOption = "SCMG_DSI"
	CTATCMMIDivisionOptionSCMGDDI   CTATCMMIDivisionOption = "SCMG_DDI"
	CTATCMMIDivisionOptionSPHGDMPM  CTATCMMIDivisionOption = "SPHG_DMPM"
	CTATCMMIDivisionOptionSPHGDHII  CTATCMMIDivisionOption = "SPHG_DHII"
	CTATCMMIDivisionOptionSPHGDPHII CTATCMMIDivisionOption = "SPHG_DPHII"
	CTATCMMIDivisionOptionSPHGDHCD  CTATCMMIDivisionOption = "SPHG_DHCD"
	CTATCMMIDivisionOptionSPHGDSBI  CTATCMMIDivisionOption = "SPHG_DSBI"
	CTATCMMIDivisionOptionOther     CTATCMMIDivisionOption = "OTHER"
)

// CTATHelpNeededType represents the possible types of help needed for a CTAT record.
type CTATHelpNeededType string

// Enum values for CTATHelpNeededType.
const (
	CTATHelpNeededTypeCalmSystemRequisitionSupport                     CTATHelpNeededType = "CALM_SYSTEM_REQUISITION_SUPPORT"
	CTATHelpNeededTypeContractChangeRequestCcrProcessing               CTATHelpNeededType = "CONTRACT_CHANGE_REQUEST_CCR_PROCESSING"
	CTATHelpNeededTypeCorTranscriptReview                              CTATHelpNeededType = "COR_TRANSCRIPT_REVIEW"
	CTATHelpNeededTypeDefiningAndDocumentingContractRequirements       CTATHelpNeededType = "DEFINING_AND_DOCUMENTING_CONTRACT_REQUIREMENTS"
	CTATHelpNeededTypeDeliverableEvaluationReviewDer                   CTATHelpNeededType = "DELIVERABLE_EVALUATION_REVIEW_DER"
	CTATHelpNeededTypeGuidanceOnDeterminationsAndFindingsDf            CTATHelpNeededType = "GUIDANCE_ON_DETERMINATIONS_AND_FINDINGS_DF"
	CTATHelpNeededTypeGuidanceOnJustificationAndApprovalJa             CTATHelpNeededType = "GUIDANCE_ON_JUSTIFICATION_AND_APPROVAL_JA"
	CTATHelpNeededTypeGuidanceOnMarketResearch                         CTATHelpNeededType = "GUIDANCE_ON_MARKET_RESEARCH"
	CTATHelpNeededTypeGuidanceOnTepMembershipScoringReporting          CTATHelpNeededType = "GUIDANCE_ON_TEP_MEMBERSHIP_SCORING_REPORTING"
	CTATHelpNeededTypeIndependentGovernmentCostEstimateIgcePreparation CTATHelpNeededType = "INDEPENDENT_GOVERNMENT_COST_ESTIMATE_IGCE_PREPARATION"
	CTATHelpNeededTypePostAwardActionsPaa                              CTATHelpNeededType = "POST_AWARD_ACTIONS_PAA"
	CTATHelpNeededTypeRequestForContractMemoRfc                        CTATHelpNeededType = "REQUEST_FOR_CONTRACT_MEMO_RFC"
	CTATHelpNeededTypeRequestForInformationRfi                         CTATHelpNeededType = "REQUEST_FOR_INFORMATION_RFI"
	CTATHelpNeededTypeRequestForProposalRfp                            CTATHelpNeededType = "REQUEST_FOR_PROPOSAL_RFP"
	CTATHelpNeededTypeRequestForQuotationRfq                           CTATHelpNeededType = "REQUEST_FOR_QUOTATION_RFQ"
	CTATHelpNeededTypeSowSooPwsDevelopment                             CTATHelpNeededType = "SOW_SOO_PWS_DEVELOPMENT" // #nosec G101 false positive - CTAT enum label abbreviating Statement of Work / Statement of Objectives / Performance Work Statement
	CTATHelpNeededTypeContractorPerformanceManagement                  CTATHelpNeededType = "CONTRACTOR_PERFORMANCE_MANAGEMENT"
	CTATHelpNeededTypeDataUseAgreementDua                              CTATHelpNeededType = "DATA_USE_AGREEMENT_DUA"
	CTATHelpNeededTypeDeliverableEvaluationReviewDerModification       CTATHelpNeededType = "DELIVERABLE_EVALUATION_REVIEW_DER_MODIFICATION"
	CTATHelpNeededTypeDocumentingAndSubmittingCpars                    CTATHelpNeededType = "DOCUMENTING_AND_SUBMITTING_CPARS"
	CTATHelpNeededTypeEnterpriseUserAdministrationEuaJobCodes          CTATHelpNeededType = "ENTERPRISE_USER_ADMINISTRATION_EUA_JOB_CODES"
	CTATHelpNeededTypeForeignNationalManagementSystemFnms              CTATHelpNeededType = "FOREIGN_NATIONAL_MANAGEMENT_SYSTEM_FNMS"
	CTATHelpNeededTypeIdentityAndCredentialingToolIct                  CTATHelpNeededType = "IDENTITY_AND_CREDENTIALING_TOOL_ICT"
	CTATHelpNeededTypeInvoiceProcessingPlatformIpp                     CTATHelpNeededType = "INVOICE_PROCESSING_PLATFORM_IPP"
	CTATHelpNeededTypeMaintainingTheElectronicCorEcorFile              CTATHelpNeededType = "MAINTAINING_THE_ELECTRONIC_COR_ECOR_FILE"
	CTATHelpNeededTypePostAwardActionsPaaModification                  CTATHelpNeededType = "POST_AWARD_ACTIONS_PAA_MODIFICATION"
	CTATHelpNeededTypeOther                                            CTATHelpNeededType = "OTHER"
)
