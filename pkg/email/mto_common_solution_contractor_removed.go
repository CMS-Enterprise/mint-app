package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOCommonSolutionContractorRemovedTemplateName is the template name for the contractor removed email
const MTOCommonSolutionContractorRemovedTemplateName = "mto_common_solution_contractor_removed"

//go:embed templates/mto_common_solution_contractor_removed_subject.html
var MTOCommonSolutionContractorRemovedSubjectTemplate string

//go:embed templates/mto_common_solution_contractor_removed_body.html
var MTOCommonSolutionContractorRemovedBodyTemplate string

// MTOCommonSolutionContractorRemovedSubjectContent defines the parameters necessary for the email subject.
type MTOCommonSolutionContractorRemovedSubjectContent struct {
	SolutionName string
}

// MTOCommonSolutionContractorRemovedBodyContent defines the parameters necessary for the email body.
type MTOCommonSolutionContractorRemovedBodyContent struct {
	ClientAddress  string
	Key            string
	SolutionName   string
	ContractorName string
	ContractTitle  string
}

// NewMTOCommonSolutionContractorRemovedBodyContent constructs the email body content when a contractor is removed.
func NewMTOCommonSolutionContractorRemovedBodyContent(
	clientAddress string,
	contractor models.MTOCommonSolutionContractor,
	solutionName string,
) MTOCommonSolutionContractorRemovedBodyContent {
	title := "Not Provided"

	if contractor.ContractTitle != nil {
		title = *contractor.ContractTitle
	}
	return MTOCommonSolutionContractorRemovedBodyContent{
		ClientAddress:  clientAddress,
		Key:            string(contractor.Key),
		SolutionName:   solutionName,
		ContractorName: contractor.ContractorName,
		ContractTitle:  title,
	}
}
