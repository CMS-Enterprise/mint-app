package email

import (
	_ "embed"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/shared/emailTemplates"
)

// AddedAsCollaboratorTemplateName is the template name definition for the corresponding email template
const AddedAsCollaboratorTemplateName string = "added_as_collaborator"

//go:embed templates/added_as_collaborator_subject.html
var addedAsCollaboratorSubjectTemplate string

//go:embed templates/added_as_collaborator_body.html
var addedAsCollaboratorBodyTemplate string

// DailyDigestTemplateName is the template name definition for the corresponding email template
const DailyDigestTemplateName string = "daily_digest"

//go:embed templates/daily_digest_subject.html
var dailyDigestSubjectTemplate string

//go:embed templates/daily_digest_body.html
var dailyDigestBodyTemplate string

// AggregatedDailyDigestTemplateName is the template name definition for the corresponding email template
const AggregatedDailyDigestTemplateName string = "aggregated_daily_digest"

//go:embed templates/aggregated_daily_digest_subject.html
var aggregatedDailyDigestSubjectTemplate string

//go:embed templates/aggregated_daily_digest_body.html
var aggregatedDailyDigestBodyTemplate string

// ModelPlanCreatedTemplateName is the template name definition for the corresponding email template
const ModelPlanCreatedTemplateName string = "model_plan_created"

//go:embed templates/model_plan_created_subject.html
var modelPlanCreatedSubjectTemplate string

//go:embed templates/model_plan_created_body.html
var modelPlanCreatedBodyTemplate string

// PlanDiscussionCreatedTemplateName is the template name definition for the corresponding email template
const PlanDiscussionCreatedTemplateName string = "plan_discussion_created"

//go:embed templates/plan_discussion_created_subject.html
var planDiscussionCreatedSubjectTemplate string

//go:embed templates/plan_discussion_created_body.html
var planDiscussionCreatedBodyTemplate string

// DiscussionReplyCreatedOriginatorTemplateName is the template name definition for the corresponding email template
const DiscussionReplyCreatedOriginatorTemplateName string = "discussion_reply_created_originator"

//go:embed templates/discussion_reply_created_originator_subject.html
var discussionReplyCreatedOriginatorSubjectTemplate string

//go:embed templates/discussion_reply_created_originator_body.html
var discussionReplyCreatedOriginatorBodyTemplate string

// PlanDiscussionTaggedPossibleSolutionTemplateName is the template name definition for the corresponding email template
const PlanDiscussionTaggedPossibleSolutionTemplateName string = "plan_discussion_tagged_solution"

//go:embed templates/plan_discussion_tagged_solution_subject.html
var planDiscussionTaggedPossibleSolutionSubjectTemplate string

//go:embed templates/plan_discussion_tagged_solution_body.html
var planDiscussionTaggedPossibleSolutionBodyTemplate string

// PlanDiscussionTaggedUserTemplateName is the template name definition for the corresponding email template
const PlanDiscussionTaggedUserTemplateName string = "plan_discussion_tagged_user"

//go:embed templates/plan_discussion_tagged_user_subject.html
var planDiscussionTaggedUserSubjectTemplate string

//go:embed templates/plan_discussion_tagged_user_body.html
var planDiscussionTaggedUserBodyTemplate string

// ModelPlanDateChangedTemplateName is the template name definition for the corresponding email template
const ModelPlanDateChangedTemplateName string = "model_plan_date_changed"

//go:embed templates/model_plan_date_changed_subject.html
var modelPlanDateChangedSubjectTemplate string

//go:embed templates/model_plan_date_changed_body.html
var modelPlanDateChangedBodyTemplate string

// ModelPlanShareTemplateName is the template name definition for the corresponding email template
const ModelPlanShareTemplateName string = "model_plan_share"

//go:embed templates/model_plan_share_subject.html
var modelPlanShareSubjectTemplate string

//go:embed templates/model_plan_share_body.html
var modelPlanShareBodyTemplate string

//go:embed templates/shared_style.html
var sharedStyleTemplate string

//go:embed templates/shared_header.html
var sharedHeaderTemplate string

//go:embed templates/shared_access_banner.html
var sharedAccessBannerTemplate string

//go:embed templates/shared_footer.html
var sharedFooterTemplate string

//go:embed templates/shared_solution_poc_footer.html
var sharedSolutionPOCFooterTemplate string

// ReportAProblemTemplateName is the template name definition for the corresponding email template
const ReportAProblemTemplateName string = "report_a_problem"

//go:embed templates/report_a_problem_body.html
var reportAProblemBodyTemplate string

//go:embed templates/report_a_problem_subject.html
var reportAProblemSubjectTemplate string

// SendFeedbackTemplateName is the template name definition of the send feedback email template
const SendFeedbackTemplateName string = "send_feedback"

//go:embed templates/send_feedback_body.html
var sendFeedbackBodyTemplate string

//go:embed templates/send_feedback_subject.html
var sendFeedbackSubjectTemplate string

// SolutionSelectedTemplateName is the template name for the solution selected email that is sent to solution POCS
const SolutionSelectedTemplateName string = "solution_selected"

//go:embed templates/solution_selected_body.html
var solutionSelectedBodyTemplate string

//go:embed templates/solution_selected_subject.html
var solutionSelectedSubjectTemplate string

// DataExchangeApproachCompletedTemplateName is the template name for the data exchange approach completed email
const DataExchangeApproachCompletedTemplateName string = "data_exchange_approach_completed"

//go:embed templates/data_exchange_approach_completed_body.html
var dataExchangeApproachCompletedBodyTemplate string

//go:embed templates/data_exchange_approach_completed_subject.html
var dataExchangeApproachCompletedSubjectTemplate string

// TemplateServiceImpl is an implementation-specific structure loading all resources necessary for server execution
type TemplateServiceImpl struct {
	templateCache  *emailTemplates.TemplateCache
	emailTemplates map[string]*emailTemplates.EmailTemplate
}

// NewTemplateServiceImpl is a constructor for TemplateServiceImpl
func NewTemplateServiceImpl() (*TemplateServiceImpl, error) {
	service := &TemplateServiceImpl{templateCache: emailTemplates.NewTemplateCache()}

	err := service.Load()
	if err != nil {
		return nil, err
	}

	return service, nil
}

// Load caches all email templates which will be used by the template service
func (t *TemplateServiceImpl) Load() error {
	t.emailTemplates = make(map[string]*emailTemplates.EmailTemplate)

	err := t.loadEmailTemplate(AddedAsCollaboratorTemplateName, addedAsCollaboratorSubjectTemplate, addedAsCollaboratorBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(DailyDigestTemplateName, dailyDigestSubjectTemplate, dailyDigestBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(AggregatedDailyDigestTemplateName, aggregatedDailyDigestSubjectTemplate, aggregatedDailyDigestBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(ModelPlanCreatedTemplateName, modelPlanCreatedSubjectTemplate, modelPlanCreatedBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(PlanDiscussionCreatedTemplateName, planDiscussionCreatedSubjectTemplate, planDiscussionCreatedBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(DiscussionReplyCreatedOriginatorTemplateName, discussionReplyCreatedOriginatorSubjectTemplate, discussionReplyCreatedOriginatorBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(PlanDiscussionTaggedUserTemplateName, planDiscussionTaggedUserSubjectTemplate, planDiscussionTaggedUserBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(PlanDiscussionTaggedPossibleSolutionTemplateName, planDiscussionTaggedPossibleSolutionSubjectTemplate, planDiscussionTaggedPossibleSolutionBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(ModelPlanDateChangedTemplateName, modelPlanDateChangedSubjectTemplate, modelPlanDateChangedBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(ModelPlanShareTemplateName, modelPlanShareSubjectTemplate, modelPlanShareBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(ReportAProblemTemplateName, reportAProblemSubjectTemplate, reportAProblemBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(SendFeedbackTemplateName, sendFeedbackSubjectTemplate, sendFeedbackBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(SolutionSelectedTemplateName, solutionSelectedSubjectTemplate, solutionSelectedBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(DataExchangeApproachCompletedTemplateName, dataExchangeApproachCompletedSubjectTemplate, dataExchangeApproachCompletedBodyTemplate)
	if err != nil {
		return err
	}

	return nil
}

func (t *TemplateServiceImpl) loadEmailTemplate(emailTemplateName string, subjectTemplate string, bodyTemplate string) error {
	_, emailTemplateExists := t.emailTemplates[emailTemplateName]
	if emailTemplateExists {
		return fmt.Errorf("email template %s already exists", emailTemplateName)
	}

	subjectEmailTemplateName := emailTemplateName + "_subject"
	bodyEmailTemplateName := emailTemplateName + "_body"

	err := t.templateCache.LoadTextTemplateFromString(subjectEmailTemplateName, subjectTemplate)
	if err != nil {
		return err
	}

	predefinedTemplates := map[string]string{
		"shared_style.html":               sharedStyleTemplate,
		"shared_header.html":              sharedHeaderTemplate,
		"shared_footer.html":              sharedFooterTemplate,
		"shared_access_banner.html":       sharedAccessBannerTemplate,
		"shared_solution_poc_footer.html": sharedSolutionPOCFooterTemplate,
	}

	err = t.templateCache.LoadHTMLTemplateFromString(bodyEmailTemplateName, bodyTemplate, predefinedTemplates)
	if err != nil {
		return err
	}

	t.emailTemplates[emailTemplateName] = emailTemplates.NewEmailTemplate(t.templateCache, subjectEmailTemplateName, bodyEmailTemplateName)

	return nil
}

// GetEmailTemplate fetches an emailTemplates.EmailTemplate by name from the emailTemplates.TemplateCache
func (t *TemplateServiceImpl) GetEmailTemplate(emailTemplateName string) (*emailTemplates.EmailTemplate, error) {
	emailTemplate, emailTemplateExists := t.emailTemplates[emailTemplateName]

	if !emailTemplateExists {
		return nil, fmt.Errorf("email template %s not found", emailTemplateName)
	}

	return emailTemplate, nil
}
