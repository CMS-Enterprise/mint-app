package models

// ModelCategory represents the category of a model
type ModelCategory string

const (
	MCAccountableCare           ModelCategory = "Accountable Care"
	MCDemonstration             ModelCategory = "Demonstration"
	MCEBPaymentInitiatives      ModelCategory = "Episode-based Payment Initiatives"
	MCMedicaidAndChip           ModelCategory = "Initiatives Focused on the Medicaid and CHIP Population"
	MCMedicareAndMedicaid       ModelCategory = "Initiatives Focused on the Medicare and Medicaid Enrollees"
	MCAccelerateDevAndTest      ModelCategory = "Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models" //too long here.
	MCSpeedBestPracticeAdopt    ModelCategory = "Initiatives to Speed the Adoption of Best Practices"
	MCPrimaryCareTransformation ModelCategory = "Primary Care Transformation"
	MCTBD                       ModelCategory = "TBD"
)

// CMSCenter represents a CMS center
type CMSCenter string

const (
	CMSCMMI                                 CMSCenter = "CMMI"
	CMSCenterForMedicare                    CMSCenter = "Center for Medicare (CM)"
	CMSFederalCoordinatedHealthCareOffice   CMSCenter = "Federal Coordinated Health Care Office"
	CMSCenterForClinicalStandardsAndQuality CMSCenter = "Center for Clinical Standards and Quality"
	CMSCenterForProgramIntegrity            CMSCenter = "Center for Program Integrity"
	CMSOther                                CMSCenter = "Other (please specify)"
)

//  CMMIGroup representes the group at CMMI
type CMMIGroup string

const (
	CMMIPatientCareModels                       CMMIGroup = "Patient Care Models Group (PCMG)"
	CMMIPolicyAndPrograms                       CMMIGroup = "Policy and Programs Group (PPG)"
	CMMIPreventiveAndPopulationHealthCareModels CMMIGroup = "Preventive and Population Health Care Models Group (PPHCMG)"
	CMMISeamlessCareModels                      CMMIGroup = "Seamless Care Models Group (SCMG)"
	CMMIStateInnovations                        CMMIGroup = "State Innovations Group (SIG)"
	CMMIUnknown                                 CMMIGroup = "Unknown/Unassigned or TBD?"
)

type ModelType string

const (
	MTVoluntary ModelType = "Voluntary"
	MTMandatory ModelType = "Mandatory"
	MTTBD       ModelType = "TBD"
)

type TriStateAnswer string

const (
	TriYes TriStateAnswer = "Yes"
	TriNo  TriStateAnswer = "No"
	TriTBD TriStateAnswer = "TBD" //Can also handle unsure
)
