package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// ContractorAddedSubjectContent defines the parameters necessary for the email subject.
type ContractorRemovedSubjectContent struct {
	SolutionName string
}

// ContractorRemovedBodyContent defines the parameters necessary for the email body.
type ContractorRemovedBodyContent struct {
	ClientAddress  string
	Key            string
	SolutionName   string
	ContractorName string
	contractTitle  string
}

// NewContractorRemovedBodyContent constructs the email body content when a contractor is removed.
func NewContractorRemovedBodyContent(
	clientAddress string,
	contractor models.MTOCommonSolutionContractor,
	solutionName string,
) ContractorRemovedBodyContent {
	title := "Not Provided"

	if contractor.ContractTitle != nil {
		title = *contractor.ContractTitle
	}
	return ContractorRemovedBodyContent{
		ClientAddress:  clientAddress,
		Key:            string(contractor.Key),
		SolutionName:   solutionName,
		ContractorName: contractor.ContractorName,
		contractTitle:  title,
	}
}
