package email

import (
	_ "embed"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// OperationalSolutionSelectedTemplateName is the template name for the solution selected email that is sent to solution POCS
const OperationalSolutionSelectedTemplateName string = "operational_solution_selected"

//go:embed templates/operational_solution_selected_body.html
var operationalSolutionSelectedBodyTemplate string

//go:embed templates/operational_solution_selected_subject.html
var operationalSolutionSelectedSubjectTemplate string

// OperationalSolutionSelectedSubjectContent defines the parameters necessary for the corresponding email subject
type OperationalSolutionSelectedSubjectContent struct {
	ModelName    string
	SolutionName string
}

// OperationalSolutionSelectedBodyContent defines the parameters necessary for the corresponding email body
type OperationalSolutionSelectedBodyContent struct {
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
	ModelStartDate    *time.Time
}

// OperationalSolutionSelectedDB this represents the data retrieved from the database for when a solution is selected from the database
type OperationalSolutionSelectedDB struct {
	FilterView        *models.ModelViewFilter `json:"filterView" db:"filter_view"`
	SolutionName      string                  `json:"solName" db:"sol_name"` //From possible operational solution
	SolutionStatus    models.OpSolutionStatus `json:"solStatus" db:"sol_status"`
	ModelLeadNames    string                  `json:"modelLeadNames" db:"model_lead_names"` // This comes from plan collaborators and user account table
	NeedName          string                  `json:"needName" db:"need_name"`
	ModelID           uuid.UUID               `json:"modelID" db:"model_id"`
	ModelName         string                  `json:"modelName" db:"model_name"`
	ModelAbbreviation *string                 `json:"modelAbbreviation" db:"model_abbreviation"`
	ModelStatus       models.ModelStatus      `json:"modelStatus" db:"model_status"`
	ModelStartDate    *time.Time              `json:"modelStartDate" db:"model_start_date"` // from plan basics performance_period_starts
}

// ToSolutionSelectedBodyContent converts a SolutionSelectedDB struct to SolutionSelctedBodyContent
func (ssdb *OperationalSolutionSelectedDB) ToSolutionSelectedBodyContent(clientAddress string) OperationalSolutionSelectedBodyContent {
	return OperationalSolutionSelectedBodyContent{
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
		ModelStartDate:    ssdb.ModelStartDate,
	}
}

type operationalSolutionEmails struct {
	// The email to be sent when an operational solution is selected for use
	Selected *emailtemplates.GenEmailTemplate[OperationalSolutionSelectedSubjectContent, OperationalSolutionSelectedBodyContent]
}

var OperationalSolution = operationalSolutionEmails{
	Selected: NewEmailTemplate[OperationalSolutionSelectedSubjectContent, OperationalSolutionSelectedBodyContent](
		OperationalSolutionSelectedTemplateName,
		operationalSolutionSelectedSubjectTemplate,
		operationalSolutionSelectedBodyTemplate,
	),
}
