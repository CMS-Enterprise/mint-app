package email

import "github.com/cms-enterprise/mint-app/pkg/models"

// SystemOwnerEditedSubjectContent defines the parameters necessary for the email subject.
type SystemOwnerEditedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// SystemOwnerEditedBodyContent defines the parameters necessary for the email body.
type SystemOwnerEditedBodyContent struct {
	SolutionAcronym string
	SolutionName    string
	CmsComponents   []string
	ClientAddress   string
	Key             string
}

// NewSystemOwnerEditedBodyContent constructs an email body content struct from an MTOCommonSolutionSystemOwner.
func NewSystemOwnerEditedBodyContent(
	clientAddress string,
	systemOwner models.MTOCommonSolutionSystemOwner,
	solutionName string,
	cmsComponents []models.MTOCommonSolutionCMSComponent,
) SystemOwnerEditedBodyContent {
	// Convert cmsComponents to a slice of strings
	stringCmsComponents := make([]string, len(cmsComponents))
	for i, component := range cmsComponents {
		stringCmsComponents[i] = string(component)
	}

	return SystemOwnerEditedBodyContent{
		ClientAddress:   clientAddress,
		SolutionAcronym: string(systemOwner.Key),
		Key:             string(systemOwner.Key),
		SolutionName:    solutionName,
		CmsComponents:   stringCmsComponents,
	}
}
