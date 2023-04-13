package models

// PossibleOperationalSolution represents a possible solution to an Operational Need
type PossibleOperationalSolution struct {
	ID int `json:"id" db:"id"`
	createdByRelation
	modifiedByRelation

	Name         string                 `json:"name" db:"sol_name"`
	Key          OperationalSolutionKey `json:"key" db:"sol_key"`
	TreatAsOther bool                   `json:"treatAsOther" db:"treat_as_other"`
}

// OperationalSolutionKey represents the types of OperationalSolutionKey types.
type OperationalSolutionKey string

// These are the options for OperationalSolutionKey
const (
	OpSKInnovation                OperationalSolutionKey = "INNOVATION"
	OpSKAcoOs                     OperationalSolutionKey = "ACO_OS"
	OpSKApps                      OperationalSolutionKey = "APPS"
	OpSKCdx                       OperationalSolutionKey = "CDX"
	OpSKCcw                       OperationalSolutionKey = "CCW"
	OpSKCmsBox                    OperationalSolutionKey = "CMS_BOX"
	OpSKCmsQualtrics              OperationalSolutionKey = "CMS_QUALTRICS"
	OpSKCbosc                     OperationalSolutionKey = "CBOSC"
	OpSKContractor                OperationalSolutionKey = "CONTRACTOR"
	OpSKCpiVetting                OperationalSolutionKey = "CPI_VETTING"
	OpSKCrossModelContract        OperationalSolutionKey = "CROSS_MODEL_CONTRACT"
	OpSKEft                       OperationalSolutionKey = "EFT"
	OpSKExistingCmsDataAndProcess OperationalSolutionKey = "EXISTING_CMS_DATA_AND_PROCESS"
	OpSKEdfr                      OperationalSolutionKey = "EDFR"
	OpSKGovdelivery               OperationalSolutionKey = "GOVDELIVERY"
	OpSKGs                        OperationalSolutionKey = "GS"
	OpSKHdr                       OperationalSolutionKey = "HDR"
	OpSKHpms                      OperationalSolutionKey = "HPMS"
	OpSKHiglas                    OperationalSolutionKey = "HIGLAS"
	OpSKIpc                       OperationalSolutionKey = "IPC"
	OpSKIdr                       OperationalSolutionKey = "IDR"
	OpSKInternalStaff             OperationalSolutionKey = "INTERNAL_STAFF"
	OpSKLdg                       OperationalSolutionKey = "LDG"
	OpSKLv                        OperationalSolutionKey = "LV"
	OpSKMdm                       OperationalSolutionKey = "MDM"
	OpSKMarx                      OperationalSolutionKey = "MARX"
	OpSKOtherNewProcess           OperationalSolutionKey = "OTHER_NEW_PROCESS"
	OpSKOutlookMailbox            OperationalSolutionKey = "OUTLOOK_MAILBOX"
	OpSKQv                        OperationalSolutionKey = "QV"
	OpSKRmada                     OperationalSolutionKey = "RMADA"
	OpSKArs                       OperationalSolutionKey = "ARS"
	OpSKConnect                   OperationalSolutionKey = "CONNECT"
	OpSKLoi                       OperationalSolutionKey = "LOI"
	OpSKPostPortal                OperationalSolutionKey = "POST_PORTAL"
	OpSKRfa                       OperationalSolutionKey = "RFA"
	OpSKSharedSystems             OperationalSolutionKey = "SHARED_SYSTEMS"
)
