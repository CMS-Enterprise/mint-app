package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// SystemOwnerRemovedSubjectContent defines the parameters necessary for the email subject.
type SystemOwnerRemovedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// SystemOwnerRemovedBodyContent defines the parameters necessary for the email body.
type SystemOwnerRemovedBodyContent struct {
	SolutionAcronym string
	SolutionName    string
	CmsComponent    string
	OwnerType       string
	ClientAddress   string
	Key             string
}

// NewSystemOwnerRemovedBodyContent constructs an email body content struct from an MTOCommonSolutionSystemOwner.
func NewSystemOwnerRemovedBodyContent(
	clientAddress string,
	systemOwner models.MTOCommonSolutionSystemOwner,
	solutionName string,
) SystemOwnerRemovedBodyContent {
	return SystemOwnerRemovedBodyContent{
		ClientAddress:   clientAddress,
		SolutionAcronym: string(systemOwner.Key),
		Key:             string(systemOwner.Key),
		SolutionName:    solutionName,
		CmsComponent:    ToTitleCase(string(systemOwner.CMSComponent)),
		OwnerType:       ToTitleCase(string(systemOwner.OwnerType)),
	}
}
