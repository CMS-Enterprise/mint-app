package models

// PossibleOperationalSolution represents a possible solution to an Operational Need
type PossibleOperationalSolution struct {
	ID int `json:"id" db:"id"`
	createdByRelation
	modifiedByRelation

	Name string                 `json:"name" db:"sol_name"`
	Key  OperationalSolutionKey `json:"key" db:"sol_key"`
}

// OperationalSolutionKey represents the types of OperationalSolutionKey types.
type OperationalSolutionKey string

// These are the options for OperationalSolutionKey
const (
	OpSKMarx                      OperationalSolutionKey = "MARX"
	OpSKHpms                      OperationalSolutionKey = "HPMS"
	OpSKSalesforce                OperationalSolutionKey = "SALESFORCE"
	OpSKGrantSolutions            OperationalSolutionKey = "GRANT_SOLUTIONS"
	OpSKRfa                       OperationalSolutionKey = "RFA"
	OpSKArs                       OperationalSolutionKey = "ARS"
	OpSKRmada                     OperationalSolutionKey = "RMADA"
	OpSKOutlookMailbox            OperationalSolutionKey = "OUTLOOK_MAILBOX"
	OpSKGovdelivery               OperationalSolutionKey = "GOVDELIVERY"
	OpSKSalesforcePortal          OperationalSolutionKey = "SALESFORCE_PORTAL"
	OpSKMdm                       OperationalSolutionKey = "MDM"
	OpSKCbosc                     OperationalSolutionKey = "CBOSC"
	OpSKThroughAContractor        OperationalSolutionKey = "THROUGH_A_CONTRACTOR"
	OpSKAcoOs                     OperationalSolutionKey = "ACO_OS"
	OpSKAcoUI                     OperationalSolutionKey = "ACO_UI"
	OpSKInnovation                OperationalSolutionKey = "INNOVATION"
	OpSKIdr                       OperationalSolutionKey = "IDR"
	OpSKCcw                       OperationalSolutionKey = "CCW"
	OpSKMedicareAppealSystem      OperationalSolutionKey = "MEDICARE_APPEAL_SYSTEM"
	OpSKIdos                      OperationalSolutionKey = "IDOS"
	OpSKIsp                       OperationalSolutionKey = "ISP"
	OpSKAnotherContractor         OperationalSolutionKey = "ANOTHER_CONTRACTOR"
	OpSKExistingCmsDataAndProcess OperationalSolutionKey = "EXISTING_CMS_DATA_AND_PROCESS"
	OpSKNewCmmiProcess            OperationalSolutionKey = "NEW_CMMI_PROCESS"
	OpSKOtherNewProcess           OperationalSolutionKey = "OTHER_NEW_PROCESS"
	OpSKInternalStaff             OperationalSolutionKey = "INTERNAL_STAFF"
	OpSKCrossModelContract        OperationalSolutionKey = "CROSS_MODEL_CONTRACT"
	OpSKConnect                   OperationalSolutionKey = "CONNECT"
	OpSKOc                        OperationalSolutionKey = "OC"
	OpSKSharedSystems             OperationalSolutionKey = "SHARED_SYSTEMS"
	OpSKHiglas                    OperationalSolutionKey = "HIGLAS"
	OpSKFfsCompetencyCenter       OperationalSolutionKey = "FFS_COMPETENCY_CENTER"
	OpSKApps                      OperationalSolutionKey = "APPS"
	OpSKIpc                       OperationalSolutionKey = "IPC"
	OpSKMac                       OperationalSolutionKey = "MAC"
	OpSKRmadaContractor           OperationalSolutionKey = "RMADA_CONTRACTOR"
)
