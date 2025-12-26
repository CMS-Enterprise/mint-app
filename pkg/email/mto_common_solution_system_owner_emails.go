package email

import "github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"

type mtoCommonSolutionSystemOwnerEmails struct {
	// The email to be sent when an MTOCommonSolutionSystemOwner is added
	Added *emailtemplates.GenEmailTemplate[MTOCommonSolutionSystemOwnerAddedSubjectContent, MTOCommonSolutionSystemOwnerAddedBodyContent]
	// The email to be sent when an MTOCommonSolutionSystemOwner is edited
	Edited *emailtemplates.GenEmailTemplate[MTOCommonSolutionSystemOwnerEditedSubjectContent, MTOCommonSolutionSystemOwnerEditedBodyContent]
	// The email to be sent when an MTOCommonSolutionSystemOwner is removed
	Removed *emailtemplates.GenEmailTemplate[MTOCommonSolutionSystemOwnerRemovedSubjectContent, MTOCommonSolutionSystemOwnerRemovedBodyContent]
}

// MTOCommonSolutionSystemOwner is the collection of all MTOCommonSolutionSystemOwner related email templates
var MTOCommonSolutionSystemOwner = mtoCommonSolutionSystemOwnerEmails{
	Added: NewEmailTemplate[MTOCommonSolutionSystemOwnerAddedSubjectContent, MTOCommonSolutionSystemOwnerAddedBodyContent](
		MTOCommonSolutionSystemOwnerAddedTemplateName,
		mtoCommonSolutionSystemOwnerAddedSubjectTemplate,
		mtoCommonSolutionSystemOwnerAddedBodyTemplate,
	),
	Edited: NewEmailTemplate[MTOCommonSolutionSystemOwnerEditedSubjectContent, MTOCommonSolutionSystemOwnerEditedBodyContent](
		MTOCommonSolutionSystemOwnerEditedTemplateName,
		mtoCommonSolutionSystemOwnerEditedSubjectTemplate,
		mtoCommonSolutionSystemOwnerEditedBodyTemplate,
	),
	Removed: NewEmailTemplate[MTOCommonSolutionSystemOwnerRemovedSubjectContent, MTOCommonSolutionSystemOwnerRemovedBodyContent](
		MTOCommonSolutionSystemOwnerRemovedTemplateName,
		mtoCommonSolutionSystemOwnerRemovedSubjectTemplate,
		mtoCommonSolutionSystemOwnerRemovedBodyTemplate,
	),
}
