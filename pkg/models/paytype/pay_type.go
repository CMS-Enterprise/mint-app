package paytype

// PayType is the enumeration of options for this category
type PayType string

const (
	// ClaimsBasedPayments indicates a claims based payment type
	ClaimsBasedPayments PayType = "CLAIMS_BASED_PAYMENTS"
	// NonClaimsBasedPayments indicates a non-claims based payment type
	NonClaimsBasedPayments PayType = "NON_CLAIMS_BASED_PAYMENTS"
	// Grants indicates payments will involve grants
	Grants PayType = "GRANTS"
)
