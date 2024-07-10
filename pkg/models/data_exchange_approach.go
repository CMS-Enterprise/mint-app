package models

// DataExchangeApproach represents the data exchange approach section of the model plan task list
type DataExchangeApproach struct {
	baseTaskListSection

	// Page 1
	HighLevelOverview *string `json:"highLevelOverview" db:"high_level_overview"`
	NewMethods        *string `json:"newMethods" db:"new_methods"`

	// Page 2
	Feasibility       *string `json:"feasibility" db:"feasibility"`
	ParticipantBurden *string `json:"participantBurden" db:"participant_burden"`

	// Page 3
	CMMIImpact               *string `json:"cmmiImpact" db:"cmmi_impact"`
	AdditionalConsiderations *string `json:"additionalConsiderations" db:"additional_considerations"`
}

// NewDataExchangeApproach returns a new DataExchangeApproach
func NewDataExchangeApproach(tls baseTaskListSection) *DataExchangeApproach {
	return &DataExchangeApproach{
		baseTaskListSection: tls,
	}
}
