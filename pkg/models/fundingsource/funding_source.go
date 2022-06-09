package fundingsource

// FundingSource is an enumeration of options for this category
type FundingSource string

const (
	// PatientProtectionAffordableCareAct indicates the funding source is categorically patient protection affordable care act
	PatientProtectionAffordableCareAct FundingSource = "PATIENT_PROTECTION_AFFORDABLE_CARE_ACT"
	// TrustFund indicates the funding source is categorically trust fund
	TrustFund FundingSource = "TRUST_FUND"
	// Other indicates the funding source is not included in the provided options
	Other FundingSource = "Other"
)
