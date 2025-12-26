package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// MTOCommonSolutionSystemOwnerRemovedTemplateName is the template name for the MTOCommonSolutionSystemOwner removed email
const MTOCommonSolutionSystemOwnerRemovedTemplateName string = "mto_common_solution_system_owner_removed"

//go:embed templates/mto_common_solution_system_owner_removed_subject.html
var mtoCommonSolutionSystemOwnerRemovedSubjectTemplate string

//go:embed templates/mto_common_solution_system_owner_removed_body.html
var mtoCommonSolutionSystemOwnerRemovedBodyTemplate string

// MTOCommonSolutionSystemOwnerRemovedSubjectContent defines the parameters necessary for the email subject.
type MTOCommonSolutionSystemOwnerRemovedSubjectContent struct {
	SolutionAcronym string
	SolutionName    string
}

// MTOCommonSolutionSystemOwnerRemovedBodyContent defines the parameters necessary for the email body.
type MTOCommonSolutionSystemOwnerRemovedBodyContent struct {
	SolutionAcronym string
	SolutionName    string
	CmsComponent    string
	OwnerType       string
	ClientAddress   string
	Key             string
}

// NewMTOCommonSolutionSystemOwnerRemovedBodyContent constructs an email body content struct from an MTOCommonSolutionSystemOwner.
func NewMTOCommonSolutionSystemOwnerRemovedBodyContent(
	clientAddress string,
	systemOwner models.MTOCommonSolutionSystemOwner,
	solutionName string,
) MTOCommonSolutionSystemOwnerRemovedBodyContent {
	return MTOCommonSolutionSystemOwnerRemovedBodyContent{
		ClientAddress:   clientAddress,
		SolutionAcronym: string(systemOwner.Key),
		Key:             string(systemOwner.Key),
		SolutionName:    solutionName,
		CmsComponent:    ToTitleCase(string(systemOwner.CMSComponent)),
		OwnerType:       ToTitleCase(string(systemOwner.OwnerType)),
	}
}
