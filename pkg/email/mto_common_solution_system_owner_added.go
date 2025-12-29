package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOCommonSolutionSystemOwnerAddedTemplateName is the template name for the MTOCommonSolutionSystemOwner added email
const MTOCommonSolutionSystemOwnerAddedTemplateName string = "mto_common_solution_system_owner_added"

//go:embed templates/mto_common_solution_system_owner_added_subject.html
var mtoCommonSolutionSystemOwnerAddedSubjectTemplate string

//go:embed templates/mto_common_solution_system_owner_added_body.html
var mtoCommonSolutionSystemOwnerAddedBodyTemplate string

// MTOCommonSolutionSystemOwnerAddedSubjectContent defines the parameters necessary for the email subject.
type MTOCommonSolutionSystemOwnerAddedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// MTOCommonSolutionSystemOwnerAddedBodyContent defines the parameters necessary for the email body.
type MTOCommonSolutionSystemOwnerAddedBodyContent struct {
	SolutionAcronym string
	SolutionName    string
	CmsComponent    string
	OwnerType       string
	ClientAddress   string
	Key             string
}

// NewMTOCommonSolutionSystemOwnerAddedBodyContent constructs an email body content struct from an MTOCommonSolutionSystemOwner.
func NewMTOCommonSolutionSystemOwnerAddedBodyContent(
	clientAddress string,
	systemOwner models.MTOCommonSolutionSystemOwner,
	solutionName string,
) MTOCommonSolutionSystemOwnerAddedBodyContent {
	return MTOCommonSolutionSystemOwnerAddedBodyContent{
		ClientAddress:   clientAddress,
		Key:             string(systemOwner.Key),
		SolutionAcronym: string(systemOwner.Key),
		SolutionName:    solutionName,
		CmsComponent:    ToTitleCase(string(systemOwner.CMSComponent)),
		OwnerType:       ToTitleCase(string(systemOwner.OwnerType)),
	}
}
