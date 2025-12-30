package email

import "github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"

type mtoCommonSolutionPOCEmails struct {
	// The email to be sent when an MTOCommonSolutionContact is added as a POC
	Added *emailtemplates.GenEmailTemplate[MTOCommonSolutionPOCAddedSubjectContent, MTOCommonSolutionPOCAddedBodyContent]
	// The email to be sent when an MTOCommonSolutionContact's POC information is edited
	Edited *emailtemplates.GenEmailTemplate[MTOCommonSolutionPOCEditedSubjectContent, MTOCommonSolutionPOCEditedBodyContent]
	// The email to be sent when an MTOCommonSolutionContact is removed as a POC
	Removed *emailtemplates.GenEmailTemplate[MTOCommonSolutionPOCRemovedSubjectContent, MTOCommonSolutionPOCRemovedBodyContent]
	// The email to be sent when someone is added as a POC (welcome email)
	Welcome *emailtemplates.GenEmailTemplate[MTOCommonSolutionPOCWelcomeSubjectContent, MTOCommonSolutionPOCWelcomeBodyContent]
}

var mtoCommonSolutionPOC = mtoCommonSolutionPOCEmails{
	Added: NewEmailTemplate[MTOCommonSolutionPOCAddedSubjectContent, MTOCommonSolutionPOCAddedBodyContent](
		MTOCommonSolutionPOCAddedTemplateName,
		MTOCommonSolutionPOCAddedSubjectTemplate,
		MTOCommonSolutionPOCAddedBodyTemplate,
	),
	Edited: NewEmailTemplate[MTOCommonSolutionPOCEditedSubjectContent, MTOCommonSolutionPOCEditedBodyContent](
		MTOCommonSolutionPOCEditedTemplateName,
		MTOCommonSolutionPOCEditedSubjectTemplate,
		MTOCommonSolutionPOCEditedBodyTemplate,
	),
	Removed: NewEmailTemplate[MTOCommonSolutionPOCRemovedSubjectContent, MTOCommonSolutionPOCRemovedBodyContent](
		MTOCommonSolutionPOCRemovedTemplateName,
		MTOCommonSolutionPOCRemovedSubjectTemplate,
		MTOCommonSolutionPOCRemovedBodyTemplate,
	),
	Welcome: NewEmailTemplate[MTOCommonSolutionPOCWelcomeSubjectContent, MTOCommonSolutionPOCWelcomeBodyContent](
		MTOCommonSolutionPOCWelcomeTemplateName,
		MTOCommonSolutionPOCWelcomeSubjectTemplate,
		MTOCommonSolutionPOCWelcomeBodyTemplate,
	),
}
