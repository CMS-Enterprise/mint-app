package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOCommonSolutionSystemOwnerEditedTemplateName is the template name for the MTOCommonSolutionSystemOwner edited email
const MTOCommonSolutionSystemOwnerEditedTemplateName string = "mto_common_solution_system_owner_edited"

//go:embed templates/mto_common_solution_system_owner_edited_subject.html
var mtoCommonSolutionSystemOwnerEditedSubjectTemplate string

//go:embed templates/mto_common_solution_system_owner_edited_body.html
var mtoCommonSolutionSystemOwnerEditedBodyTemplate string

// MTOCommonSolutionSystemOwnerEditedSubjectContent defines the parameters necessary for the email subject.
type MTOCommonSolutionSystemOwnerEditedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// MTOCommonSolutionSystemOwnerEditedBodyContent defines the parameters necessary for the email body.
type MTOCommonSolutionSystemOwnerEditedBodyContent struct {
	SolutionAcronym string
	SolutionName    string
	CmsComponents   []string
	ClientAddress   string
	Key             string
}

// NewMTOCommonSolutionSystemOwnerEditedBodyContent constructs an email body content struct from an MTOCommonSolutionSystemOwner.
func NewMTOCommonSolutionSystemOwnerEditedBodyContent(
	clientAddress string,
	systemOwner models.MTOCommonSolutionSystemOwner,
	solutionName string,
	cmsComponents []models.MTOCommonSolutionCMSComponent,
) MTOCommonSolutionSystemOwnerEditedBodyContent {
	// Convert cmsComponents to a slice of strings
	stringCmsComponents := make([]string, len(cmsComponents))
	for i, component := range cmsComponents {
		stringCmsComponents[i] = ToTitleCase(string(component))
	}

	return MTOCommonSolutionSystemOwnerEditedBodyContent{
		ClientAddress:   clientAddress,
		SolutionAcronym: string(systemOwner.Key),
		Key:             string(systemOwner.Key),
		SolutionName:    solutionName,
		CmsComponents:   stringCmsComponents,
	}
}
