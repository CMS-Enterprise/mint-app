package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOCommonSolutionContractorAddedTemplateName is the template name for the contractor added email
const MTOCommonSolutionContractorAddedTemplateName = "mto_common_solution_contractor_added"

//go:embed templates/mto_common_solution_contractor_added_subject.html
var MTOCommonSolutionContractorAddedSubjectTemplate string

//go:embed templates/mto_common_solution_contractor_added_body.html
var MTOCommonSolutionContractorAddedBodyTemplate string

// MTOCommonSolutionContractorAddedSubjectContent defines the parameters necessary for the email subject.
type MTOCommonSolutionContractorAddedSubjectContent struct {
	SolutionName string
}

// MTOCommonSolutionContractorAddedBodyContent defines the parameters necessary for the email body.
type MTOCommonSolutionContractorAddedBodyContent struct {
	ClientAddress  string
	Key            string
	SolutionName   string
	ContractorName string
	ContractTitle  string
}

// NewMTOCommonSolutionContractorAddedBodyContent constructs the email body content when a contractor is added.
func NewMTOCommonSolutionContractorAddedBodyContent(
	clientAddress string,
	contractor models.MTOCommonSolutionContractor,
	solutionName string,
) MTOCommonSolutionContractorAddedBodyContent {
	title := "Not Provided"

	if contractor.ContractTitle != nil {
		title = *contractor.ContractTitle
	}
	return MTOCommonSolutionContractorAddedBodyContent{
		ClientAddress:  clientAddress,
		Key:            string(contractor.Key),
		SolutionName:   solutionName,
		ContractorName: contractor.ContractorName,
		ContractTitle:  title,
	}
}
