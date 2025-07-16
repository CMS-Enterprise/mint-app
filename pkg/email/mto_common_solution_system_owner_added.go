package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// SystemOwnerAddedSubjectContent defines the parameters necessary for the email subject.
type SystemOwnerAddedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// SystemOwnerAddedBodyContent defines the parameters necessary for the email body.
type SystemOwnerAddedBodyContent struct {
	SolutionAcronym string
	SolutionName    string
	CmsComponent    string
	OwnerType       string
	ClientAddress   string
	Key             string
}

// NewSystemOwnerAddedBodyContent constructs an email body content struct from an MTOCommonSolutionSystemOwner.
func NewSystemOwnerAddedBodyContent(
	clientAddress string,
	systemOwner models.MTOCommonSolutionSystemOwner,
	solutionName string,
) SystemOwnerAddedBodyContent {
	return SystemOwnerAddedBodyContent{
		ClientAddress:   clientAddress,
		Key:             string(systemOwner.Key),
		SolutionAcronym: string(systemOwner.Key),
		SolutionName:    solutionName,
		CmsComponent:    string(systemOwner.CMSComponent),
		OwnerType:       string(systemOwner.OwnerType),
	}
}
