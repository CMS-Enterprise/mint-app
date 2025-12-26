package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOCommonSolutionContractorEditedTemplateName is the template name for the contractor edited email
const MTOCommonSolutionContractorEditedTemplateName = "mto_common_solution_contractor_edited"

//go:embed templates/mto_common_solution_contractor_edited_subject.html
var MTOCommonSolutionContractorEditedSubjectTemplate string

//go:embed templates/mto_common_solution_contractor_edited_body.html
var MTOCommonSolutionContractorEditedBodyTemplate string

// MTOCommonSolutionContractorEditedSubjectContent defines the parameters necessary for the email subject.
type MTOCommonSolutionContractorEditedSubjectContent struct {
	SolutionName string
}

// MTOCommonSolutionContractorEditedBodyContent defines the parameters necessary for the email body.
type MTOCommonSolutionContractorEditedBodyContent struct {
	ClientAddress  string
	Key            string
	SolutionName   string
	ContractorName string
	ContractTitle  string
}

// NewMTOCommonSolutionContractorEditedBodyContent constructs the email body content when a contractor is edited.
func NewMTOCommonSolutionContractorEditedBodyContent(
	clientAddress string,
	contractor models.MTOCommonSolutionContractor,
	solutionName string,
) MTOCommonSolutionContractorEditedBodyContent {
	title := "Not Provided"

	if contractor.ContractTitle != nil {
		title = *contractor.ContractTitle
	}
	return MTOCommonSolutionContractorEditedBodyContent{
		ClientAddress:  clientAddress,
		Key:            string(contractor.Key),
		SolutionName:   solutionName,
		ContractorName: contractor.ContractorName,
		ContractTitle:  title,
	}
}
