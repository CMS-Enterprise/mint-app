package email

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOSolutionSelectedSubjectContent defines the parameters necessary for the corresponding email subject
type MTOSolutionSelectedSubjectContent struct {
	ModelName    string
	SolutionName string
}

// MTOSolutionSelectedBodyContent defines the parameters necessary for the corresponding email body
type MTOSolutionSelectedBodyContent struct {
	ClientAddress     string
	FilterView        string
	SolutionName      string // TODO do we need to get the short name for solution? Is this avaialble in the DB? We have the key, but I'm not sure that it actually maps
	SolutionStatus    string
	ModelLeadNames    string
	MilestoneNames    *string
	ModelID           string
	ModelName         string
	ModelAbbreviation string
	ModelStatus       string
	ModelStartDate    *time.Time
}

// MTOSolutionSelectedDB this represents the data retrieved from the database for when a solution is selected from the database
type MTOSolutionSelectedDB struct {
	FilterView        *models.ModelViewFilter      `json:"filterView" db:"filter_view"`
	SolutionName      string                       `json:"solName" db:"sol_name"` //From possible MTO solution
	SolutionStatus    models.MTOSolutionStatus     `json:"solStatus" db:"sol_status"`
	SolutionKey       models.MTOCommonMilestoneKey `json:"solKey" db:"sol_key"`
	ModelLeadNames    string                       `json:"modelLeadNames" db:"model_lead_names"` // This comes from plan collaborators and user account table
	MilestoneNames    *string                      `json:"milestoneNames" db:"milestone_names"`  // you can potentially return an array if better
	ModelID           uuid.UUID                    `json:"modelID" db:"model_id"`
	ModelName         string                       `json:"modelName" db:"model_name"`
	ModelAbbreviation *string                      `json:"modelAbbreviation" db:"model_abbreviation"`
	ModelStatus       models.ModelStatus           `json:"modelStatus" db:"model_status"`
	ModelStartDate    *time.Time                   `json:"modelStartDate" db:"model_start_date"` // from plan basics performance_period_starts
}

// ToSolutionSelectedBodyContent converts a SolutionSelectedDB struct to SolutionSelctedBodyContent
func (ssdb *MTOSolutionSelectedDB) ToSolutionSelectedBodyContent(clientAddress string) MTOSolutionSelectedBodyContent {
	return MTOSolutionSelectedBodyContent{
		ClientAddress:     clientAddress,
		FilterView:        ssdb.FilterView.ValueOrEmpty(),
		SolutionName:      ssdb.SolutionName,
		SolutionStatus:    ssdb.SolutionStatus.Humanize(),
		ModelLeadNames:    ssdb.ModelLeadNames,
		MilestoneNames:    ssdb.MilestoneNames,
		ModelID:           ssdb.ModelID.String(),
		ModelName:         ssdb.ModelName,
		ModelAbbreviation: models.ValueOrEmpty(ssdb.ModelAbbreviation),
		ModelStatus:       ssdb.ModelStatus.Humanize(),
		ModelStartDate:    ssdb.ModelStartDate,
	}
}
