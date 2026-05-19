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

// CTATBSGDivisionOption represents the possible BSG division values for a CTAT record.
type CTATBSGDivisionOption string

// Enum values for CTATBSGDivisionOption.
const (
	CTATBSGDivisionOptionDBOM  CTATBSGDivisionOption = "DBOM"
	CTATBSGDivisionOptionDCCS  CTATBSGDivisionOption = "DCCS"
	CTATBSGDivisionOptionDSSOS CTATBSGDivisionOption = "DSSOS"
	CTATBSGDivisionOptionDTS   CTATBSGDivisionOption = "DTS"
	CTATBSGDivisionOptionOther CTATBSGDivisionOption = "OTHER"
)

// CTATLDGDivisionOption represents the possible LDG division values for a CTAT record.
type CTATLDGDivisionOption string

// Enum values for CTATLDGDivisionOption.
const (
	CTATLDGDivisionOptionDMLS  CTATLDGDivisionOption = "DMLS"
	CTATLDGDivisionOptionDAN   CTATLDGDivisionOption = "DAN"
	CTATLDGDivisionOptionOther CTATLDGDivisionOption = "OTHER"
)

// CTATPCMGDivisionOption represents the possible PCMG division values for a CTAT record.
type CTATPCMGDivisionOption string

// Enum values for CTATPCMGDivisionOption.
const (
	CTATPCMGDivisionOptionDAPC  CTATPCMGDivisionOption = "DAPC"
	CTATPCMGDivisionOptionDHCPM CTATPCMGDivisionOption = "DHCPM"
	CTATPCMGDivisionOptionDSPM  CTATPCMGDivisionOption = "DSPM"
	CTATPCMGDivisionOptionDAPM  CTATPCMGDivisionOption = "DAPM"
	CTATPCMGDivisionOptionDPM   CTATPCMGDivisionOption = "DPM"
	CTATPCMGDivisionOptionOther CTATPCMGDivisionOption = "OTHER"
)

// CTATPPGDivisionOption represents the possible PPG division values for a CTAT record.
type CTATPPGDivisionOption string

// Enum values for CTATPPGDivisionOption.
const (
	CTATPPGDivisionOptionDAPMI CTATPPGDivisionOption = "DAPMI"
	CTATPPGDivisionOptionDDA   CTATPPGDivisionOption = "DDA"
	CTATPPGDivisionOptionDESP  CTATPPGDivisionOption = "DESP"
	CTATPPGDivisionOptionDPMS  CTATPPGDivisionOption = "DPMS"
	CTATPPGDivisionOptionOther CTATPPGDivisionOption = "OTHER"
)

// CTATRREGDivisionOption represents the possible RREG division values for a CTAT record.
type CTATRREGDivisionOption string

// Enum values for CTATRREGDivisionOption.
const (
	CTATRREGDivisionOptionDHSR  CTATRREGDivisionOption = "DHSR"
	CTATRREGDivisionOptionDPAR  CTATRREGDivisionOption = "DPAR"
	CTATRREGDivisionOptionDSPR  CTATRREGDivisionOption = "DSPR"
	CTATRREGDivisionOptionDRAM  CTATRREGDivisionOption = "DRAM"
	CTATRREGDivisionOptionOther CTATRREGDivisionOption = "OTHER"
)

// CTATSCMGDivisionOption represents the possible SCMG division values for a CTAT record.
type CTATSCMGDivisionOption string

// Enum values for CTATSCMGDivisionOption.
const (
	CTATSCMGDivisionOptionDHPI  CTATSCMGDivisionOption = "DHPI"
	CTATSCMGDivisionOptionDFR   CTATSCMGDivisionOption = "DFR"
	CTATSCMGDivisionOptionDSI   CTATSCMGDivisionOption = "DSI"
	CTATSCMGDivisionOptionDDI   CTATSCMGDivisionOption = "DDI"
	CTATSCMGDivisionOptionOther CTATSCMGDivisionOption = "OTHER"
)

// CTATSPHGDivisionOption represents the possible SPHG division values for a CTAT record.
type CTATSPHGDivisionOption string

// Enum values for CTATSPHGDivisionOption.
const (
	CTATSPHGDivisionOptionDMPM  CTATSPHGDivisionOption = "DMPM"
	CTATSPHGDivisionOptionDHII  CTATSPHGDivisionOption = "DHII"
	CTATSPHGDivisionOptionDPHII CTATSPHGDivisionOption = "DPHII"
	CTATSPHGDivisionOptionDHCD  CTATSPHGDivisionOption = "DHCD"
	CTATSPHGDivisionOptionDSBI  CTATSPHGDivisionOption = "DSBI"
	CTATSPHGDivisionOptionOther CTATSPHGDivisionOption = "OTHER"
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
