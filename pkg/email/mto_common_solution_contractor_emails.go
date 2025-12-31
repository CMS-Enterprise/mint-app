package email

import "github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"

type mtoCommonSolutionContractorEmails struct {
	// The email to be sent when an MTOCommonSolutionContractor is added
	Added *emailtemplates.GenEmailTemplate[MTOCommonSolutionContractorAddedSubjectContent, MTOCommonSolutionContractorAddedBodyContent]
	// The email to be sent when an MTOCommonSolutionContractor is edited
	Edited *emailtemplates.GenEmailTemplate[MTOCommonSolutionContractorEditedSubjectContent, MTOCommonSolutionContractorEditedBodyContent]
	// The email to be sent when an MTOCommonSolutionContractor is removed
	Removed *emailtemplates.GenEmailTemplate[MTOCommonSolutionContractorRemovedSubjectContent, MTOCommonSolutionContractorRemovedBodyContent]
}

var mtoCommonSolutionContractor = mtoCommonSolutionContractorEmails{
	Added: NewEmailTemplate[MTOCommonSolutionContractorAddedSubjectContent, MTOCommonSolutionContractorAddedBodyContent](
		MTOCommonSolutionContractorAddedTemplateName,
		MTOCommonSolutionContractorAddedSubjectTemplate,
		MTOCommonSolutionContractorAddedBodyTemplate,
	),
	Edited: NewEmailTemplate[MTOCommonSolutionContractorEditedSubjectContent, MTOCommonSolutionContractorEditedBodyContent](
		MTOCommonSolutionContractorEditedTemplateName,
		MTOCommonSolutionContractorEditedSubjectTemplate,
		MTOCommonSolutionContractorEditedBodyTemplate,
	),
	Removed: NewEmailTemplate[MTOCommonSolutionContractorRemovedSubjectContent, MTOCommonSolutionContractorRemovedBodyContent](
		MTOCommonSolutionContractorRemovedTemplateName,
		MTOCommonSolutionContractorRemovedSubjectTemplate,
		MTOCommonSolutionContractorRemovedBodyTemplate,
	),
}
