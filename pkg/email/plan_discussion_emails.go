package email

import "github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"

type planDiscussionEmails struct {
	// The email to be sent when a plan discussion is created
	Created *emailtemplates.GenEmailTemplate[PlanDiscussionCreatedSubjectContent, PlanDiscussionCreatedBodyContent]
	// The email to be sent when a user is tagged in a plan discussion
	TaggedUser *emailtemplates.GenEmailTemplate[PlanDiscussionTaggedUserSubjectContent, PlanDiscussionTaggedUserBodyContent]
	// The email to be sent when a solution is tagged in a plan discussion
	TaggedSolution *emailtemplates.GenEmailTemplate[PlanDiscussionTaggedSolutionSubjectContent, PlanDiscussionTaggedSolutionBodyContent]
}

// PlanDiscussion is the collection of all plan discussion related email templates
var PlanDiscussion = planDiscussionEmails{
	Created: NewEmailTemplate[PlanDiscussionCreatedSubjectContent, PlanDiscussionCreatedBodyContent](
		PlanDiscussionCreatedTemplateName,
		planDiscussionCreatedSubjectTemplate,
		planDiscussionCreatedBodyTemplate,
	),
	TaggedUser: NewEmailTemplate[PlanDiscussionTaggedUserSubjectContent, PlanDiscussionTaggedUserBodyContent](
		PlanDiscussionTaggedUserTemplateName,
		planDiscussionTaggedUserSubjectTemplate,
		planDiscussionTaggedUserBodyTemplate,
	),
	TaggedSolution: NewEmailTemplate[PlanDiscussionTaggedSolutionSubjectContent, PlanDiscussionTaggedSolutionBodyContent](
		PlanDiscussionTaggedMTOCommonSolutionTemplateName,
		planDiscussionTaggedPossibleSolutionSubjectTemplate,
		planDiscussionTaggedPossibleSolutionBodyTemplate,
	),
}
