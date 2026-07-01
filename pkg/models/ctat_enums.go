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

// ctatContractTypeHumanized maps CTAT contract types to human-readable strings.
var ctatContractTypeHumanized = map[CTATContractType]string{
	CTATContractTypeCostPlusFixedFee:  "Cost Plus Fixed Fee",
	CTATContractTypeCostReimbursement: "Cost Reimbursement",
	CTATContractTypeFirmFixedPrice:    "Firm Fixed Price",
	CTATContractTypeIncentiveContract: "Incentive Contract",
	CTATContractTypeTimeAndMaterials:  "Time and Materials",
	CTATContractTypeOther:             "Other",
}

// Humanize returns the human-readable string of a CTAT contract type.
func (c CTATContractType) Humanize() string {
	return ctatContractTypeHumanized[c]
}

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

// ctatContractActivityTypeHumanized maps CTAT contract activity types to human-readable strings.
var ctatContractActivityTypeHumanized = map[CTATContractActivityType]string{
	CTATContractActivityTypeEvaluation:          "Evaluation",
	CTATContractActivityTypeImplementation:      "Implementation",
	CTATContractActivityTypeLearning:            "Learning",
	CTATContractActivityTypeTechnicalAssistance: "Technical Assistance",
	CTATContractActivityTypeOther:               "Other",
}

// Humanize returns the human-readable string of a CTAT contract activity type.
func (c CTATContractActivityType) Humanize() string {
	return ctatContractActivityTypeHumanized[c]
}

// CTATRequestUrgency represents the possible urgency values for a CTAT request.
type CTATRequestUrgency string

// Enum values for CTATRequestUrgency.
const (
	CTATRequestUrgencyHigh   CTATRequestUrgency = "HIGH"
	CTATRequestUrgencyMedium CTATRequestUrgency = "MEDIUM"
	CTATRequestUrgencyLow    CTATRequestUrgency = "LOW"
)

// ctatRequestUrgencyHumanized maps CTAT request urgency values to human-readable strings.
var ctatRequestUrgencyHumanized = map[CTATRequestUrgency]string{
	CTATRequestUrgencyHigh:   "High",
	CTATRequestUrgencyMedium: "Medium",
	CTATRequestUrgencyLow:    "Low",
}

// Humanize returns the human-readable string of a CTAT request urgency value.
func (c CTATRequestUrgency) Humanize() string {
	return ctatRequestUrgencyHumanized[c]
}

// CTATStatus represents the possible status values for a CTAT request.
type CTATStatus string

// Enum values for CTATStatus.
const (
	CTATStatusInProgress CTATStatus = "IN_PROGRESS"
	CTATStatusNew        CTATStatus = "NEW"
	CTATStatusAssigned   CTATStatus = "ASSIGNED"
	CTATStatusClosed     CTATStatus = "CLOSED"
)

// ctatStatusHumanized maps CTAT status values to human-readable strings.
var ctatStatusHumanized = map[CTATStatus]string{
	CTATStatusNew:        "New",
	CTATStatusAssigned:   "Assigned",
	CTATStatusInProgress: "In progress",
	CTATStatusClosed:     "Closed",
}

// Humanize returns the human-readable string of a CTAT status value.
func (c CTATStatus) Humanize() string {
	return ctatStatusHumanized[c]
}

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

// ctatCMMIGroupOptionHumanized maps CTAT CMMI group values to human-readable strings.
var ctatCMMIGroupOptionHumanized = map[CTATCMMIGroupOption]string{
	CTATCMMIGroupOptionBSG:   "Business Service Group (BSG)",
	CTATCMMIGroupOptionLDG:   "Learning and Diffusion Group (LDG)",
	CTATCMMIGroupOptionPCMG:  "Patient Care Model Group (PCMG)",
	CTATCMMIGroupOptionPPG:   "Policy and Programs Group (PPG)",
	CTATCMMIGroupOptionRREG:  "Research and Rapid Cycle Evaluation Group (RREG)",
	CTATCMMIGroupOptionSCMG:  "Seamless Care Model Group (SCMG)",
	CTATCMMIGroupOptionSPHG:  "State and Population Health Group (SPHG)",
	CTATCMMIGroupOptionOther: "Other",
}

// Humanize returns the human-readable string of a CTAT CMMI group value.
func (c CTATCMMIGroupOption) Humanize() string {
	return ctatCMMIGroupOptionHumanized[c]
}

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

// ctatCMMIDivisionOptionHumanized maps CTAT CMMI division values to human-readable strings.
var ctatCMMIDivisionOptionHumanized = map[CTATCMMIDivisionOption]string{
	CTATCMMIDivisionOptionBSGDBOM:   "Division of Business Operations & Management (BSG/DBOM)",
	CTATCMMIDivisionOptionBSGDCCS:   "Division of Central Contracts Services (BSG/DCCS)",
	CTATCMMIDivisionOptionBSGDSSOS:  "Division of Systems Support, Operation, & Security (BSG/DSSOS)",
	CTATCMMIDivisionOptionBSGDTS:    "Division of Technology Solutions (BSG/DTS)",
	CTATCMMIDivisionOptionLDGDMLS:   "Division of Model Learning Systems (LDG/DMLS)",
	CTATCMMIDivisionOptionLDGDAN:    "Division of Analysis & Networks (LDG/DAN)",
	CTATCMMIDivisionOptionPCMGDAPC:  "Division of Advance Primary Care (PCMG/DAPC)",
	CTATCMMIDivisionOptionPCMGDHCPM: "Division of Health Care Payment Models (PCMG/DHCPM)",
	CTATCMMIDivisionOptionPCMGDSPM:  "Division of Specialty Payment Models (PCMG/DSPM)",
	CTATCMMIDivisionOptionPCMGDAPM:  "Division of Ambulatory Payment Models (PCMG/DAPM)",
	CTATCMMIDivisionOptionPCMGDPM:   "Division of Payment Models (PCMG/DPM)",
	CTATCMMIDivisionOptionPPGDAPMI:  "Division of Alternative Payment Model Infrastructure (PPG/DAPMI)",
	CTATCMMIDivisionOptionPPGDDA:    "Division of Data Analytics (PPG/DDA)",
	CTATCMMIDivisionOptionPPGDESP:   "Division of Stakeholder Engagement & Policy (PPG/DESP)",
	CTATCMMIDivisionOptionPPGDPMS:   "Division of Portfolio Management & Strategy (PPG/DPMS)",
	CTATCMMIDivisionOptionRREGDHSR:  "Division of Health System Research (RREG/DHSR)",
	CTATCMMIDivisionOptionRREGDPAR:  "Division of Payment and Accountability Research (RREG/DPAR)",
	CTATCMMIDivisionOptionRREGDSPR:  "Division of Special Populations Research (RREG/DSPR)",
	CTATCMMIDivisionOptionRREGDRAM:  "Division of Data, Research, and Analytic Methods (RREG/DRAM)",
	CTATCMMIDivisionOptionSCMGDHPI:  "Division of Health Plan Innovation (SCMG/DHPI)",
	CTATCMMIDivisionOptionSCMGDFR:   "Division of Financial Risk (SCMG/DFR)",
	CTATCMMIDivisionOptionSCMGDSI:   "Division of Seamless Infrastructure (SCMG/DSI)",
	CTATCMMIDivisionOptionSCMGDDI:   "Division of Drug Innovation (SCMG/DDI)",
	CTATCMMIDivisionOptionSPHGDMPM:  "Division of Multi-Payer Models (SPHG/DMPM)",
	CTATCMMIDivisionOptionSPHGDHII:  "Division of Health Innovation & Integration (SPHG/DHII)",
	CTATCMMIDivisionOptionSPHGDPHII: "Division of Population Health Incentive & Infrastructure (SPHG/DPHII)",
	CTATCMMIDivisionOptionSPHGDHCD:  "Division of Health Care Delivery (SPHG/DHCD)",
	CTATCMMIDivisionOptionSPHGDSBI:  "Division of State Based initiatives (SPHG/DSBI)",
	CTATCMMIDivisionOptionOther:     "Other",
}

// Humanize returns the human-readable string of a CTAT CMMI division value.
func (c CTATCMMIDivisionOption) Humanize() string {
	return ctatCMMIDivisionOptionHumanized[c]
}

// CTATHelpNeededType represents the possible types of help needed for a CTAT record.
type CTATHelpNeededType string

// Enum values for CTATHelpNeededType.
const (
	CTATHelpNeededTypeCalmSystemRequisitionSupport                     CTATHelpNeededType = "CALM_SYSTEM_REQUISITION_SUPPORT"
	CTATHelpNeededTypePreAwardContractCostReviewCCRProcessing          CTATHelpNeededType = "PRE_AWARD_CONTRACT_COST_REVIEW_CCR_PROCESSING"
	CTATHelpNeededTypePostAwardContractCostReviewCCRProcessing         CTATHelpNeededType = "POST_AWARD_CONTRACT_COST_REVIEW_CCR_PROCESSING"
	CTATHelpNeededTypeCORTranscriptReview                              CTATHelpNeededType = "COR_TRANSCRIPT_REVIEW"
	CTATHelpNeededTypeDefiningAndDocumentingContractRequirements       CTATHelpNeededType = "DEFINING_AND_DOCUMENTING_CONTRACT_REQUIREMENTS"
	CTATHelpNeededTypeDepartmentEfficiencyReviewDER                    CTATHelpNeededType = "DEPARTMENTAL_EFFICIENCY_REVIEW_DER"
	CTATHelpNeededTypeGuidanceOnDeterminationsAndFindingsDF            CTATHelpNeededType = "GUIDANCE_ON_DETERMINATIONS_AND_FINDINGS_DF"
	CTATHelpNeededTypeGuidanceOnJustificationAndApprovalJA             CTATHelpNeededType = "GUIDANCE_ON_JUSTIFICATION_AND_APPROVAL_JA"
	CTATHelpNeededTypeGuidanceOnMarketResearch                         CTATHelpNeededType = "GUIDANCE_ON_MARKET_RESEARCH"
	CTATHelpNeededTypeGuidanceOnTEPMembershipScoringReporting          CTATHelpNeededType = "GUIDANCE_ON_TEP_MEMBERSHIP_SCORING_REPORTING"
	CTATHelpNeededTypeIndependentGovernmentCostEstimateIGCEPreparation CTATHelpNeededType = "INDEPENDENT_GOVERNMENT_COST_ESTIMATE_IGCE_PREPARATION"
	CTATHelpNeededTypePoliticalAppointeeApprovalPAA                    CTATHelpNeededType = "POLITICAL_APPOINTEE_APPROVAL_PAA"
	CTATHelpNeededTypeRequestForContractMemoRFC                        CTATHelpNeededType = "REQUEST_FOR_CONTRACT_MEMO_RFC"
	CTATHelpNeededTypeRequestForInformationRFI                         CTATHelpNeededType = "REQUEST_FOR_INFORMATION_RFI"
	CTATHelpNeededTypeRequestForProposalRFP                            CTATHelpNeededType = "REQUEST_FOR_PROPOSAL_RFP"
	CTATHelpNeededTypeRequestForQuotationRFQ                           CTATHelpNeededType = "REQUEST_FOR_QUOTATION_RFQ"
	CTATHelpNeededTypeSOWSOOPWSDevelopment                             CTATHelpNeededType = "SOW_SOO_PWS_DEVELOPMENT" // #nosec G101 false positive - CTAT enum label abbreviating Statement of Work / Statement of Objectives / Performance Work Statement
	CTATHelpNeededTypeContractorPerformanceManagement                  CTATHelpNeededType = "CONTRACTOR_PERFORMANCE_MANAGEMENT"
	CTATHelpNeededTypeDataUseAgreementDUA                              CTATHelpNeededType = "DATA_USE_AGREEMENT_DUA"
	CTATHelpNeededTypeDepartmentEfficiencyReviewDERModification        CTATHelpNeededType = "DEPARTMENTAL_EFFICIENCY_REVIEW_DER_MODIFICATION"
	CTATHelpNeededTypeDocumentingAndSubmittingCPARS                    CTATHelpNeededType = "DOCUMENTING_AND_SUBMITTING_CPARS"
	CTATHelpNeededTypeEnterpriseUserAdministrationEUAJobCodes          CTATHelpNeededType = "ENTERPRISE_USER_ADMINISTRATION_EUA_JOB_CODES"
	CTATHelpNeededTypeForeignNationalManagementSystemFNMS              CTATHelpNeededType = "FOREIGN_NATIONAL_MANAGEMENT_SYSTEM_FNMS"
	CTATHelpNeededTypeIdentityAndCredentialingToolICT                  CTATHelpNeededType = "IDENTITY_AND_CREDENTIALING_TOOL_ICT"
	CTATHelpNeededTypeInvoiceProcessingPlatformIPP                     CTATHelpNeededType = "INVOICE_PROCESSING_PLATFORM_IPP"
	CTATHelpNeededTypeMaintainingTheElectronicCorECORFile              CTATHelpNeededType = "MAINTAINING_THE_ELECTRONIC_COR_ECOR_FILE"
	CTATHelpNeededTypePoliticalAppointeeApprovalPAAModification        CTATHelpNeededType = "POLITICAL_APPOINTEE_APPROVAL_PAA_MODIFICATION"
	CTATHelpNeededTypeOther                                            CTATHelpNeededType = "OTHER"
)

// ctatHelpNeededTypeHumanized maps CTAT help needed values to human-readable strings.
var ctatHelpNeededTypeHumanized = map[CTATHelpNeededType]string{
	CTATHelpNeededTypeCalmSystemRequisitionSupport:                     "CALM system requisition support",
	CTATHelpNeededTypePreAwardContractCostReviewCCRProcessing:          "Contract Cost Review (CCR) processing - Pre-award",
	CTATHelpNeededTypePostAwardContractCostReviewCCRProcessing:         "Contract Cost Review (CCR) processing - Post-award",
	CTATHelpNeededTypeCORTranscriptReview:                              "COR Transcript Review",
	CTATHelpNeededTypeDefiningAndDocumentingContractRequirements:       "Defining and documenting contract requirements",
	CTATHelpNeededTypeDepartmentEfficiencyReviewDER:                    "Departmental Efficiency Review (DER)",
	CTATHelpNeededTypeGuidanceOnDeterminationsAndFindingsDF:            "Guidance on Determinations & Findings (D&F)",
	CTATHelpNeededTypeGuidanceOnJustificationAndApprovalJA:             "Guidance on Justification and Approval (J&A)",
	CTATHelpNeededTypeGuidanceOnMarketResearch:                         "Guidance on Market Research",
	CTATHelpNeededTypeGuidanceOnTEPMembershipScoringReporting:          "Guidance on Technical Evaluation Panel (TEP) membership, scoring, and/or reporting",
	CTATHelpNeededTypeIndependentGovernmentCostEstimateIGCEPreparation: "Independent Government Cost Estimate (IGCE) preparation",
	CTATHelpNeededTypePoliticalAppointeeApprovalPAA:                    "Political Appointee Approval (PAA)",
	CTATHelpNeededTypeRequestForContractMemoRFC:                        "Request for Contract Memo (RFC)",
	CTATHelpNeededTypeRequestForInformationRFI:                         "Request for Information (RFI)",
	CTATHelpNeededTypeRequestForProposalRFP:                            "Request for Proposal (RFP)",
	CTATHelpNeededTypeRequestForQuotationRFQ:                           "Request for Quotation (RFQ)",
	CTATHelpNeededTypeSOWSOOPWSDevelopment:                             "Statement of Work (SOW) / Statement of Objectives (SOO) / Performance Work Statement (PWS) development",
	CTATHelpNeededTypeContractorPerformanceManagement:                  "Contractor Performance Management",
	CTATHelpNeededTypeDataUseAgreementDUA:                              "Data Use Agreement (DUA)",
	CTATHelpNeededTypeDepartmentEfficiencyReviewDERModification:        "Departmental Efficiency Review (DER) Modification",
	CTATHelpNeededTypeDocumentingAndSubmittingCPARS:                    "Documenting and submitting contractor performance evaluations (CPARS)",
	CTATHelpNeededTypeEnterpriseUserAdministrationEUAJobCodes:          "Enterprise User Administration (EUA) job codes",
	CTATHelpNeededTypeForeignNationalManagementSystemFNMS:              "Foreign National Management System (FNMS)",
	CTATHelpNeededTypeIdentityAndCredentialingToolICT:                  "Identity and Credentialing Tool (ICT)",
	CTATHelpNeededTypeInvoiceProcessingPlatformIPP:                     "Invoice Processing Platform (IPP)",
	CTATHelpNeededTypeMaintainingTheElectronicCorECORFile:              "Maintaining the electronic COR (e-COR) file",
	CTATHelpNeededTypePoliticalAppointeeApprovalPAAModification:        "Political Appointee Approval (PAA) Modification",
	CTATHelpNeededTypeOther:                                            "Other",
}

// Humanize returns the human-readable string of a CTAT help needed value.
func (c CTATHelpNeededType) Humanize() string {
	return ctatHelpNeededTypeHumanized[c]
}
