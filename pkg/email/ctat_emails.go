package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// CTATSubmittedTemplateName is the template name for the CTAT submitted email.
const CTATSubmittedTemplateName string = "ctat_submitted"

//go:embed templates/ctat_submitted_body.html
var ctatSubmittedBodyTemplate string

//go:embed templates/ctat_submitted_subject.html
var ctatSubmittedSubjectTemplate string

//go:embed templates/ctat_update_body.html
var ctatUpdateBodyTemplate string

//go:embed templates/ctat_update_subject.html
var ctatUpdateSubjectTemplate string

type ctatEmails struct {
	// Submitted is the email sent when a CTAT request is submitted.
	Submitted *emailtemplates.GenEmailTemplate[CTATSubmittedSubjectContent, CTATSubmittedBodyContent]
	// Update is the email sent when a CTAT request is updated.
	Update *emailtemplates.GenEmailTemplate[CTATUpdateSubjectContent, CTATUpdateBodyContent]
}

// CTAT is the collection of CTAT-related email templates.
var CTAT = ctatEmails{
	Submitted: NewEmailTemplate[CTATSubmittedSubjectContent, CTATSubmittedBodyContent](
		CTATSubmittedTemplateName,
		ctatSubmittedSubjectTemplate,
		ctatSubmittedBodyTemplate,
	),
	Update: NewEmailTemplate[CTATUpdateSubjectContent, CTATUpdateBodyContent](
		CTATUpdateTemplateName,
		ctatUpdateSubjectTemplate,
		ctatUpdateBodyTemplate,
	),
}

// CTATSubmittedSubjectContent defines the parameters necessary for the corresponding email subject.
type CTATSubmittedSubjectContent struct {
	TicketNumber string
}

// CTATSubmittedBodyContent defines the parameters necessary for the corresponding email body.
type CTATSubmittedBodyContent struct {
	ClientAddress          string
	CTATTicketID           string
	TicketNumber           string
	RequesterName          string
	RequesterEmail         string
	CMMIGroup              string
	CMMIDivision           string
	RelatedMINTModels      string
	ContractActivityType   string
	ContractName           string
	ContractType           string
	TypeOfHelpNeeded       string
	DescribeHelpNeeded     string
	RequestUrgency         string
	DateAssistanceNeededBy string
	UploadedFiles          string
}

// CTATUpdateTemplateName is the template name for the CTAT update email.
const CTATUpdateTemplateName string = "ctat_update"

// CTATUpdateSubjectContent defines the parameters necessary for the corresponding email subject.
type CTATUpdateSubjectContent struct {
	TicketNumber string
}

// CTATUpdateBodyContent defines the parameters necessary for the corresponding email body.
type CTATUpdateBodyContent struct {
	Status                    string
	StatusUpdated             bool
	AssignedTeamMemberUpdated bool
	AssignedTeamMemberName    string
	AssignedTeamMemberEmail   string
	ProgressNotesUpdated      bool
	ProgressNotes             string
	ResolutionUpdated         bool
	Resolution                string
	ClientAddress             string
	CTATTicketID              string
	TicketNumber              string
	RequesterName             string
	RequesterEmail            string
	CMMIGroup                 string
	CMMIDivision              string
	RelatedMINTModels         string
	ContractActivityType      string
	ContractName              string
	ContractType              string
	TypeOfHelpNeeded          string
	DescribeHelpNeeded        string
	RequestUrgency            string
	DateAssistanceNeededBy    string
	UploadedFiles             string
}
