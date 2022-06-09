package nonclaimbasedpaymenttype

// NonClaimsBasedPaymentType is the enumeration of options for this category
type NonClaimsBasedPaymentType string

const (
	// AdvancedPayment indicates advanced payment
	AdvancedPayment NonClaimsBasedPaymentType = "ADVANCED_PAYMENT"
	// BundledEpisodeOfCare indicates bundled episode of care
	BundledEpisodeOfCare NonClaimsBasedPaymentType = "BUNDLED_EPISODE_OF_CARE"
	// CapitationPopulationBasedFull indicates capitation population based full
	CapitationPopulationBasedFull NonClaimsBasedPaymentType = "CAPITATION_POPULATION_BASED_FULL"
	// CapitationPopulationBasedPartial indicates capitation population based partial
	CapitationPopulationBasedPartial NonClaimsBasedPaymentType = "CAPITATION_POPULATION_BASED_PARTIAL"
	// CareCoordinationManagementFee indicates care coordination management fee
	CareCoordinationManagementFee NonClaimsBasedPaymentType = "CARE_COORDINATION_MANAGEMENT_FEE"
	// GlobalBudget indicates global budget
	GlobalBudget NonClaimsBasedPaymentType = "GLOBAL_BUDGET"
	// Grants indicates grants
	Grants NonClaimsBasedPaymentType = "GRANTS"
	// IncentivePayment indicates incentive payment
	IncentivePayment NonClaimsBasedPaymentType = "INCENTIVE_PAYMENT"
	// MAPDSharedSavings indicates MAPD shared savings
	MAPDSharedSavings NonClaimsBasedPaymentType = "MAPD_SHARED_SAVINGS"
	// SharedSavings indicates shared savings
	SharedSavings NonClaimsBasedPaymentType = "SHARED_SAVINGS"
	// Other indicates an option not provided
	Other NonClaimsBasedPaymentType = "OTHER"
)
