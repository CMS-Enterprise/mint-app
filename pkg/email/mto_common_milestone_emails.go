package email

import "github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"

type mtoCommonMilestoneEmails struct {
	Added   *emailtemplates.GenEmailTemplate[MTOCommonMilestoneCreatedSubjectContent, MTOCommonMilestoneCreatedBodyContent]
	Updated *emailtemplates.GenEmailTemplate[MTOCommonMilestoneUpdatedSubjectContent, MTOCommonMilestoneUpdatedBodyContent]
	Removed *emailtemplates.GenEmailTemplate[MTOCommonMilestoneRemovedSubjectContent, MTOCommonMilestoneRemovedBodyContent]
}

var mtoCommonMilestone = mtoCommonMilestoneEmails{
	Added: NewEmailTemplate[MTOCommonMilestoneCreatedSubjectContent, MTOCommonMilestoneCreatedBodyContent](
		MTOCommonMilestoneCreatedTemplateName,
		MTOCommonMilestoneCreatedSubjectTemplate,
		MTOCommonMilestoneCreatedBodyTemplate,
	),
	Updated: NewEmailTemplate[MTOCommonMilestoneUpdatedSubjectContent, MTOCommonMilestoneUpdatedBodyContent](
		MTOCommonMilestoneUpdatedTemplateName,
		MTOCommonMilestoneUpdatedSubjectTemplate,
		MTOCommonMilestoneUpdatedBodyTemplate,
	),
	Removed: NewEmailTemplate[MTOCommonMilestoneRemovedSubjectContent, MTOCommonMilestoneRemovedBodyContent](
		MTOCommonMilestoneRemovedTemplateName,
		MTOCommonMilestoneRemovedSubjectTemplate,
		MTOCommonMilestoneRemovedBodyTemplate,
	),
}
