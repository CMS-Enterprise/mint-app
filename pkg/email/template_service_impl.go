package email

import (
	_ "embed"
	"fmt"
	"strings"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
)

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

// DiscussionReplyCreatedOriginatorTemplateName is the template name definition for the corresponding email template
const DiscussionReplyCreatedOriginatorTemplateName string = "discussion_reply_created_originator"

//go:embed templates/discussion_reply_created_originator_subject.html
var discussionReplyCreatedOriginatorSubjectTemplate string

//go:embed templates/discussion_reply_created_originator_body.html
var discussionReplyCreatedOriginatorBodyTemplate string

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

// MTOSolutionSelectedTemplateName is the template name for the solution selected email that is sent to an MTO solution POCS
const MTOSolutionSelectedTemplateName string = "mto_solution_selected"

//go:embed templates/mto_solution_selected_body.html
var mtoSolutionSelectedBodyTemplate string

//go:embed templates/mto_solution_selected_subject.html
var mtoSolutionSelectedSubjectTemplate string

// OperationalSolutionSelectedTemplateName is the template name for the solution selected email that is sent to solution POCS
const OperationalSolutionSelectedTemplateName string = "operational_solution_selected"

//go:embed templates/operational_solution_selected_body.html
var operationalSolutionSelectedBodyTemplate string

//go:embed templates/operational_solution_selected_subject.html
var operationalSolutionSelectedSubjectTemplate string

// DataExchangeApproachMarkedCompleteTemplateName is the template name for the data exchange approach completed email
const DataExchangeApproachMarkedCompleteTemplateName string = "data_exchange_approach_marked_complete"

//go:embed templates/data_exchange_approach_marked_complete_body.html
var dataExchangeApproachMarkedCompleteBodyTemplate string

//go:embed templates/data_exchange_approach_marked_complete_subject.html
var dataExchangeApproachMarkedCompleteSubjectTemplate string

// MTOMilestoneAssignedTemplateName is the template name for the milestone assigned email
const MTOMilestoneAssignedTemplateName string = "mto_milestone_assigned"

//go:embed templates/mto_milestone_assigned_subject.html
var mtoMilestoneAssignedSubjectTemplate string

//go:embed templates/mto_milestone_assigned_body.html
var mtoMilestoneAssignedBodyTemplate string

// TemplateServiceImpl is an implementation-specific structure loading all resources necessary for server execution
type TemplateServiceImpl struct {
	templateCache  *emailtemplates.TemplateCache
	emailTemplates map[string]*emailtemplates.EmailTemplate
	environment    appconfig.Environment
}

// NewTemplateServiceImpl is a constructor for TemplateServiceImpl
func NewTemplateServiceImpl(environment appconfig.Environment) (*TemplateServiceImpl, error) {
	service := &TemplateServiceImpl{
		templateCache: emailtemplates.NewTemplateCache(),
		environment:   environment,
	}

	err := service.Load()
	if err != nil {
		return nil, err
	}

	return service, nil
}

//TODO consider refactoring this so that templates don't need to be loaded with the load method, but instead instantiated as package vars

// Load caches all email templates which will be used by the template service
func (t *TemplateServiceImpl) Load() error {
	t.emailTemplates = make(map[string]*emailtemplates.EmailTemplate)
	var err error

	err = t.loadEmailTemplate(DailyDigestTemplateName, dailyDigestSubjectTemplate, dailyDigestBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(AggregatedDailyDigestTemplateName, aggregatedDailyDigestSubjectTemplate, aggregatedDailyDigestBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(DiscussionReplyCreatedOriginatorTemplateName, discussionReplyCreatedOriginatorSubjectTemplate, discussionReplyCreatedOriginatorBodyTemplate)
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

	err = t.loadEmailTemplate(OperationalSolutionSelectedTemplateName, operationalSolutionSelectedSubjectTemplate, operationalSolutionSelectedBodyTemplate)
	if err != nil {
		return err
	}
	err = t.loadEmailTemplate(MTOSolutionSelectedTemplateName, mtoSolutionSelectedSubjectTemplate, mtoSolutionSelectedBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(DataExchangeApproachMarkedCompleteTemplateName, dataExchangeApproachMarkedCompleteSubjectTemplate, dataExchangeApproachMarkedCompleteBodyTemplate)
	if err != nil {
		return err
	}

	if err := t.loadEmailTemplate(MTOMilestoneAssignedTemplateName, mtoMilestoneAssignedSubjectTemplate, mtoMilestoneAssignedBodyTemplate); err != nil {
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

	// Add environment prefix to subject if in dev, or impl
	if t.environment.Dev() || t.environment.Impl() {
		envName := strings.ToUpper(t.environment.String())
		subjectTemplate = fmt.Sprintf("[%s] %s", envName, subjectTemplate)
	}

	err := t.templateCache.LoadTextTemplateFromString(subjectEmailTemplateName, subjectTemplate)
	if err != nil {
		return err
	}

	err = t.templateCache.LoadHTMLTemplateFromString(bodyEmailTemplateName, bodyTemplate, predefinedTemplates)
	if err != nil {
		return err
	}

	t.emailTemplates[emailTemplateName] = emailtemplates.NewEmailTemplate(t.templateCache, subjectEmailTemplateName, bodyEmailTemplateName)

	return nil
}

// GetEmailTemplate fetches an emailtemplates.EmailTemplate by name from the emailtemplates.TemplateCache
func (t *TemplateServiceImpl) GetEmailTemplate(emailTemplateName string) (*emailtemplates.EmailTemplate, error) {
	emailTemplate, emailTemplateExists := t.emailTemplates[emailTemplateName]

	if !emailTemplateExists {
		return nil, fmt.Errorf("email template %s not found", emailTemplateName)
	}

	return emailTemplate, nil
}
