package email

import (
	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
)

// SolutionSelectedSubjectContent defines the parameters necessary for the corresponding email subject
type SolutionSelectedSubjectContent struct {
	ModelName    string
	SolutionName string
}

// SolutionSelectedBodyContent defines the parameters necessary for the corresponding email body
type SolutionSelectedBodyContent struct {
	ClientAddress     string
	FilterView        string
	SolutionName      string
	SolutionStatus    string
	ModelLeadNames    string
	NeedName          string
	ModelID           string
	ModelName         string
	ModelAbbreviation string
	ModelStatus       string
	ModelStartDate    string
}

// SolutionSelectedDB this represents the data retrieved from the database for when a solution is selected from the database
type SolutionSelectedDB struct {
	FilterView        models.ModelViewFilter  `json:"filterView" db:"filter_view"`
	SolutionName      string                  `json:"solName" db:"sol_name"` //From possible operational solution
	SolutionStatus    models.OpSolutionStatus `json:"solStatus" db:"sol_status"`
	ModelLeadNames    string                  `json:"modelLeadNames" db:"model_lead_names"` // This comes from plan collaborators and user account table
	NeedName          string                  `json:"needName" db:"need_name"`
	ModelID           uuid.UUID               `json:"modelID" db:"model_id"`
	ModelName         string                  `json:"modelName" db:"model_name"`
	ModelAbbreviation *string                 `json:"modelAbbreviation" db:"model_abbreviation"`
	ModelStatus       models.ModelStatus      `json:"modelStatus" db:"model_status"`
	ModelStartDate    *time.Time              `json:"modelStartDate" db:"model_start_date"` // from plan basics
}

// ToSolutionSelectedBodyContent converts a SolutionSelectedDB struct to SolutionSelctedBodyContent
func (ssdb *SolutionSelectedDB) ToSolutionSelectedBodyContent(clientAddress string) SolutionSelectedBodyContent {
	return SolutionSelectedBodyContent{
		ClientAddress:     clientAddress,
		FilterView:        ssdb.FilterView.ValueOrEmpty(),
		SolutionName:      ssdb.SolutionName,
		SolutionStatus:    ssdb.SolutionStatus.Humanize(),
		ModelLeadNames:    ssdb.ModelLeadNames,
		NeedName:          ssdb.NeedName,
		ModelID:           ssdb.ModelID.String(),
		ModelName:         ssdb.ModelName,
		ModelAbbreviation: models.ValueOrEmpty(ssdb.ModelAbbreviation),
		ModelStatus:       ssdb.ModelStatus.Humanize(),
		ModelStartDate:    ssdb.ModelStartDate.String(), // TODO: SW double check the formatting here
	}
}
