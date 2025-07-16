package models

import (
	"fmt"

	"github.com/google/uuid"
)

// MTOCommonSolutionOwnerType is an enum that represents the types of owners for MTOCommonSolutionSystemOwner
type MTOCommonSolutionOwnerType string

// These constants represent the different values of MTOCommonSolutionOwnerType
const (
	SystemOwner   MTOCommonSolutionOwnerType = "SYSTEM_OWNER"
	BusinessOwner MTOCommonSolutionOwnerType = "BUSINESS_OWNER"
)

// MTOCommonSolutionCMSComponent is an enum that represents the CMS components for MTOCommonSolutionSystemOwner
type MTOCommonSolutionCMSComponent string

// These constants represent the different values of MTOCommonSolutionCMSComponent
const (
	OfficeOfTheAdministrator                          MTOCommonSolutionCMSComponent = "OFFICE_OF_THE_ADMINISTRATOR"
	OfficeOfHealthcareExperienceAndInteroperability   MTOCommonSolutionCMSComponent = "OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY"
	OfficeOfProgramOperationsAndLocalEngagement       MTOCommonSolutionCMSComponent = "OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE"
	OfficeOfEnterpriseDataAndAnalytics                MTOCommonSolutionCMSComponent = "OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA"
	OfficeOfEqualOpportunityAndCivilRights            MTOCommonSolutionCMSComponent = "OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS"
	OfficeOfCommunications                            MTOCommonSolutionCMSComponent = "OFFICE_OF_COMMUNICATIONS_OC"
	OfficeOfLegislation                               MTOCommonSolutionCMSComponent = "OFFICE_OF_LEGISLATION"
	FederalCoordinatedHealthCareOffice                MTOCommonSolutionCMSComponent = "FEDERAL_COORDINATED_HEALTH_CARE_OFFICE"
	OfficeOfMinorityHealth                            MTOCommonSolutionCMSComponent = "OFFICE_OF_MINORITY_HEALTH_OMH"
	OfficeOfTheActuary                                MTOCommonSolutionCMSComponent = "OFFICE_OF_THE_ACTUARY_OACT"
	OfficeOfStrategicOperationsAndRegulatoryAffairs   MTOCommonSolutionCMSComponent = "OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA"
	OfficeOfInformationTechnology                     MTOCommonSolutionCMSComponent = "OFFICE_OF_INFORMATION_TECHNOLOGY_OIT"
	OfficeOfAcquisitionAndGrantsManagement            MTOCommonSolutionCMSComponent = "OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM"
	OfficesOfHearingsAndInquiries                     MTOCommonSolutionCMSComponent = "OFFICES_OF_HEARINGS_AND_INQUIRIES"
	OfficeOfFinancialManagement                       MTOCommonSolutionCMSComponent = "OFFICE_OF_FINANCIAL_MANAGEMENT_OFM"
	OfficeOfStrategyPerformanceAndResults             MTOCommonSolutionCMSComponent = "OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR"
	OfficeOfSecurityFacilitiesAndLogisticsOperations  MTOCommonSolutionCMSComponent = "OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO"
	OfficeOfHumanCapital                              MTOCommonSolutionCMSComponent = "OFFICE_OF_HUMAN_CAPITAL"
	CenterForClinicalStandardsAndQuality              MTOCommonSolutionCMSComponent = "CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY_CCSQ"
	CenterForMedicareAndMedicaidInnovation            MTOCommonSolutionCMSComponent = "CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI"
	CenterForMedicare                                 MTOCommonSolutionCMSComponent = "CENTER_FOR_MEDICARE_CM"
	CenterForMedicaidAndChipServices                  MTOCommonSolutionCMSComponent = "CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS"
	CenterForProgramIntegrity                         MTOCommonSolutionCMSComponent = "CENTER_FOR_PROGRAM_INTEGRITY_CPI"
	CenterForConsumerInformationAndInsuranceOversight MTOCommonSolutionCMSComponent = "CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO"
)

// MTOCommonSolutionSystemOwnerInformation is a wrapper method that enables efficient fetching and sorting of MTOCommonSolutionSystemOwner information
type MTOCommonSolutionSystemOwnerInformation struct {
	SystemOwners []*MTOCommonSolutionSystemOwner `json:"systemOwners"`
}

func (mtoCSSOI *MTOCommonSolutionSystemOwnerInformation) SystemOwnersList() ([]*MTOCommonSolutionSystemOwner, error) {
	if mtoCSSOI == nil {
		return nil, fmt.Errorf("system owner information is not populated as expected")
	}
	return mtoCSSOI.SystemOwners, nil
}

type MTOCommonSolutionSystemOwner struct {
	baseStruct
	Key          MTOCommonSolutionKey          `json:"key" db:"mto_common_solution_key"`
	OwnerType    MTOCommonSolutionOwnerType    `db:"owner_type" json:"ownerType"`
	CMSComponent MTOCommonSolutionCMSComponent `db:"cms_component" json:"cmsComponent"`
}

// NewMTOCommonSolutionSystemOwner returns a new MTOCommonSolutionSystemOwner object
func NewMTOCommonSolutionSystemOwner(
	createdBy uuid.UUID,
	key MTOCommonSolutionKey,
	ownerType MTOCommonSolutionOwnerType,
	cmsComponent MTOCommonSolutionCMSComponent,
) *MTOCommonSolutionSystemOwner {
	return &MTOCommonSolutionSystemOwner{
		baseStruct:   NewBaseStruct(createdBy),
		Key:          key,
		OwnerType:    ownerType,
		CMSComponent: cmsComponent,
	}
}
