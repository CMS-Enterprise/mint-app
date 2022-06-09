package claimsbasedpaytype

// ClaimsBasedPayType is the enumeration of options for this category
type ClaimsBasedPayType string

const (
	// AdjustmentsToFFSPayments indicates adjustments to FFS payments
	AdjustmentsToFFSPayments ClaimsBasedPayType = "ADJUSTMENTS_TO_FFS_PAYMENTS"
	// CareManagementHomeVisits indicates care management home visits
	CareManagementHomeVisits ClaimsBasedPayType = "CARE_MANAGEMENT_HOME_VISITS"
	// SNFClaimsWithout3DayHospitalAdmissions indicates SNF claims without 3-Day hospital admissions
	SNFClaimsWithout3DayHospitalAdmissions ClaimsBasedPayType = "SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS"
	// TeleHealthServicesNotTraditionalMedicare indicates TeleHealth services not traditional medicare
	TeleHealthServicesNotTraditionalMedicare ClaimsBasedPayType = "TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE"
)
