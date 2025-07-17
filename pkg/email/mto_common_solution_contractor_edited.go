package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// ContractorEditedSubjectContent defines the parameters necessary for the email subject.
type ContractorEditedSubjectContent struct {
	SolutionName string
}

// ContractorEditedBodyContent defines the parameters necessary for the email body.
type ContractorEditedBodyContent struct {
	ClientAddress  string
	Key            string
	SolutionName   string
	ContractorName string
	contractTitle  string
}

// NewContractorEditedBodyContent constructs the email body content when a contractor is edited.
func NewContractorEditedBodyContent(
	clientAddress string,
	contractor models.MTOCommonSolutionContractor,
	solutionName string,
) ContractorEditedBodyContent {
	title := "Not Provided"

	if contractor.ContractTitle != nil {
		title = *contractor.ContractTitle
	}
	return ContractorEditedBodyContent{
		ClientAddress:  clientAddress,
		Key:            string(contractor.Key),
		SolutionName:   solutionName,
		ContractorName: contractor.ContractorName,
		contractTitle:  title,
	}
}
