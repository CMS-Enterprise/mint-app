package anticipatedpaymentfrequencytype

// AnticipatedPaymentFrequencyType is the enumeration of options for this category
type AnticipatedPaymentFrequencyType string

const (
	// Annually indicates annual payments
	Annually AnticipatedPaymentFrequencyType = "ANNUALLY"
	// Biannually indicates biannual payments
	Biannually AnticipatedPaymentFrequencyType = "BIANNUALLY"
	// Quarterly indicates payments every quarter
	Quarterly AnticipatedPaymentFrequencyType = "QUARTERLY"
	// Monthly indicates payments every month
	Monthly AnticipatedPaymentFrequencyType = "MONTHLY"
	// SemiMonthly indicates semi-monthly payments
	SemiMonthly AnticipatedPaymentFrequencyType = "SEMI-MONTHLY"
	// Weekly indicates payments every week
	Weekly AnticipatedPaymentFrequencyType = "WEEKLY"
	// Daily indicates payments every day
	Daily AnticipatedPaymentFrequencyType = "DAILY"
	// Other indicates another form of payment than provided
	Other AnticipatedPaymentFrequencyType = "OTHER"
)
