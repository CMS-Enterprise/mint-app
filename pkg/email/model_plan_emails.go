package email

import "github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"

type modelPlanEmails struct {
	// The email to be sent when a model plan is created
	Created *emailtemplates.GenEmailTemplate[ModelPlanCreatedSubjectContent, ModelPlanCreatedBodyContent]
	// The email to be sent when a model plan is shared
	Shared *emailtemplates.GenEmailTemplate[ModelPlanShareSubjectContent, ModelPlanShareBodyContent]
	// The email to be sent when a model plan date is changed
	DateChanged *emailtemplates.GenEmailTemplate[ModelPlanDateChangedSubjectContent, ModelPlanDateChangedBodyContent]
	// The email to be sent when a model plan suggested phase is sent
	SuggestedPhase *emailtemplates.GenEmailTemplate[ModelPlanSuggestedPhaseSubjectContent, ModelPlanSuggestedPhaseBodyContent]
}

// ModelPlan is the collection of all model plan related email templates
var ModelPlan = modelPlanEmails{
	Created: NewEmailTemplate[ModelPlanCreatedSubjectContent, ModelPlanCreatedBodyContent](
		ModelPlanCreatedTemplateName,
		modelPlanCreatedSubjectTemplate,
		modelPlanCreatedBodyTemplate,
	),
	Shared: NewEmailTemplate[ModelPlanShareSubjectContent, ModelPlanShareBodyContent](
		ModelPlanShareTemplateName,
		modelPlanShareSubjectTemplate,
		modelPlanShareBodyTemplate,
	),
	DateChanged: NewEmailTemplate[ModelPlanDateChangedSubjectContent, ModelPlanDateChangedBodyContent](
		ModelPlanDateChangedTemplateName,
		modelPlanDateChangedSubjectTemplate,
		modelPlanDateChangedBodyTemplate,
	),
	SuggestedPhase: NewEmailTemplate[ModelPlanSuggestedPhaseSubjectContent, ModelPlanSuggestedPhaseBodyContent](
		ModelPlanSuggestedPhaseTemplateName,
		modelPlanSuggestedPhaseSubjectTemplate,
		modelPlanSuggestedPhaseBodyTemplate,
	),
}
