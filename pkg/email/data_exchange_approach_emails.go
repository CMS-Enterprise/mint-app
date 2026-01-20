package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

// DataExchangeApproachMarkedCompleteTemplateName is the template name for the data exchange approach completed email
const DataExchangeApproachMarkedCompleteTemplateName string = "data_exchange_approach_marked_complete"

//go:embed templates/data_exchange_approach_marked_complete_body.html
var dataExchangeApproachMarkedCompleteBodyTemplate string

//go:embed templates/data_exchange_approach_marked_complete_subject.html
var dataExchangeApproachMarkedCompleteSubjectTemplate string

type dataExchangeApproachEmails struct {
	// The email to be sent when a data exchange approach is marked complete
	MarkedComplete *emailtemplates.GenEmailTemplate[DataExchangeApproachMarkedCompleteSubjectContent, DataExchangeApproachMarkedCompleteBodyContent]
}

var DataExchangeApproach = dataExchangeApproachEmails{
	MarkedComplete: NewEmailTemplate[DataExchangeApproachMarkedCompleteSubjectContent, DataExchangeApproachMarkedCompleteBodyContent](
		DataExchangeApproachMarkedCompleteTemplateName,
		dataExchangeApproachMarkedCompleteSubjectTemplate,
		dataExchangeApproachMarkedCompleteBodyTemplate,
	),
}
