package email

// AddressBook is a struct that contains all the standard email addresses used by MINT
type AddressBook struct {
	// DefaultSender is the default sender for all emails
	DefaultSender string

	// MINTTeamEmail is the email address of the MINT team
	MINTTeamEmail string

	// DevTeamEmail is the email address of the MINT development team
	DevTeamEmail string

	// ModelPlanDateChangedRecipients is the list of email addresses that should
	// receive notifications when one or more model plan dates are changed
	ModelPlanDateChangedRecipients []string
}
