package payrecipient

// PayRecipient is an enumeration of options for this category
type PayRecipient string

const (
	// Providers indicates the pay recipient is a provider
	Providers PayRecipient = "PROVIDERS"
	// Beneficiaries indicates the pay recipient is a beneficiary
	Beneficiaries PayRecipient = "BENEFICIARIES"
	// Participants indicates the pay recipient is a participant
	Participants PayRecipient = "PARTICIPANTS"
	// States indicates the pay recipient is a state
	States PayRecipient = "STATES"
	// Other indicates the pay recipient is not included in the provided options
	Other PayRecipient = "OTHER"
)
