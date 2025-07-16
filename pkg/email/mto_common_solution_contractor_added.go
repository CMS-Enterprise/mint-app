package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// ContractorAddedSubjectContent defines the parameters necessary for the email subject.
type ContractorAddedSubjectContent struct {
	SolutionName string
}

// ContractorAddedBodyContent defines the parameters necessary for the email body.
type ContractorAddedBodyContent struct {
	ClientAddress   string
	Key             string
	SolutionName    string
	ContractorName  string
	ContractorTitle string
}

// NewContractorAddedBodyContent constructs the email body content when a contractor is added.
func NewContractorAddedBodyContent(
	clientAddress string,
	contractor models.MTOCommonSolutionContractor,
	solutionName string,
) ContractorAddedBodyContent {
	title := "Not Provided"

	if contractor.ContractorTitle != nil {
		title = *contractor.ContractorTitle
	}
	return ContractorAddedBodyContent{
		ClientAddress:   clientAddress,
		Key:             string(contractor.Key),
		SolutionName:    solutionName,
		ContractorName:  contractor.ContractorName,
		ContractorTitle: title,
	}
}
