package email

import (
	_ "embed"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
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

//go:embed templates/shared_mto_common_solution_header.html
var sharedMTOCommonSolutionHeaderTemplate string

//go:embed templates/shared_mint_mailbox_footer.html
var sharedMintMailboxFooter string

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

// ModelPlanSuggestedPhaseTemplateName is the template name for the model plan suggested phase email
const ModelPlanSuggestedPhaseTemplateName string = "model_plan_suggested_phase"

//go:embed templates/model_plan_suggested_phase_subject.html
var modelPlanSuggestedPhaseSubjectTemplate string

//go:embed templates/model_plan_suggested_phase_body.html
var modelPlanSuggestedPhaseBodyTemplate string

// DataExchangeApproachMarkedCompleteTemplateName is the template name for the data exchange approach completed email
const DataExchangeApproachMarkedCompleteTemplateName string = "data_exchange_approach_marked_complete"

//go:embed templates/data_exchange_approach_marked_complete_body.html
var dataExchangeApproachMarkedCompleteBodyTemplate string

//go:embed templates/data_exchange_approach_marked_complete_subject.html
var dataExchangeApproachMarkedCompleteSubjectTemplate string

// MTOCommonSolutionOwnerAddedTemplateName is the template name for the owner added email
const MTOCommonSolutionOwnerAddedTemplateName = "mto_common_solution_owner_added"

//go:embed templates/mto_common_solution_owner_added_body.html
var MTOCommonSolutionOwnerAddedBodyTemplate string

//go:embed templates/mto_common_solution_owner_added_subject.html
var MTOCommonSolutionOwnerAddedSubjectTemplate string

// MTOCommonSolutionOwnerEditedTemplateName is the template name for the owner edited email
const MTOCommonSolutionOwnerEditedTemplateName = "mto_common_solution_owner_edited"

//go:embed templates/mto_common_solution_owner_edited_body.html
var MTOCommonSolutionOwnerEditedBodyTemplate string

//go:embed templates/mto_common_solution_owner_edited_subject.html
var MTOCommonSolutionOwnerEditedSubjectTemplate string

// MTOCommonSolutionPOCAddedTemplateName is the template name for the POC added email
const MTOCommonSolutionPOCAddedTemplateName = "mto_common_solution_poc_added"

//go:embed templates/mto_common_solution_poc_added_body.html
var MTOCommonSolutionPOCAddedBodyTemplate string

//go:embed templates/mto_common_solution_poc_added_subject.html
var MTOCommonSolutionPOCAddedSubjectTemplate string

// MTOCommonSolutionPOCEditedTemplateName is the template name for the POC edited email
const MTOCommonSolutionPOCEditedTemplateName = "mto_common_solution_poc_edited"

//go:embed templates/mto_common_solution_poc_edited_body.html
var MTOCommonSolutionPOCEditedBodyTemplate string

//go:embed templates/mto_common_solution_poc_edited_subject.html
var MTOCommonSolutionPOCEditedSubjectTemplate string

// MTOCommonSolutionPOCRemovedTemplateName is the template name for the POC removed email
const MTOCommonSolutionPOCRemovedTemplateName = "mto_common_solution_poc_removed"

//go:embed templates/mto_common_solution_poc_removed_body.html
var MTOCommonSolutionPOCRemovedBodyTemplate string

//go:embed templates/mto_common_solution_poc_removed_subject.html
var MTOCommonSolutionPOCRemovedSubjectTemplate string

// MTOCommonSolutionPOCWelcomeTemplateName is the template name for the POC welcome email
const MTOCommonSolutionPOCWelcomeTemplateName = "mto_common_solution_poc_welcome"

//go:embed templates/mto_common_solution_poc_welcome_body.html
var MTOCommonSolutionPOCWelcomeBodyTemplate string

//go:embed templates/mto_common_solution_poc_welcome_subject.html
var MTOCommonSolutionPOCWelcomeSubjectTemplate string

// MTOCommonSolutionContractorAddedTemplateName is the template name for the contractor added email
const MTOCommonSolutionContractorAddedTemplateName = "mto_common_solution_contractor_added"

//go:embed templates/mto_common_solution_contractor_added_body.html
var MTOCommonSolutionContractorAddedBodyTemplate string

//go:embed templates/mto_common_solution_contractor_added_subject.html
var MTOCommonSolutionContractorAddedSubjectTemplate string

// MTOCommonSolutionContractorEditedTemplateName is the template name for the contractor edited email
const MTOCommonSolutionContractorEditedTemplateName = "mto_common_solution_contractor_edited"

//go:embed templates/mto_common_solution_contractor_edited_body.html
var MTOCommonSolutionContractorEditedBodyTemplate string

//go:embed templates/mto_common_solution_contractor_edited_subject.html
var MTOCommonSolutionContractorEditedSubjectTemplate string

// MTOCommonSolutionContractorEditedTemplateName is the template name for the contractor edited email
const MTOCommonSolutionContractorRemovedTemplateName = "mto_common_solution_contractor_removed"

//go:embed templates/mto_common_solution_contractor_removed_body.html
var MTOCommonSolutionContractorRemovedBodyTemplate string

//go:embed templates/mto_common_solution_contractor_removed_subject.html
var MTOCommonSolutionContractorRemovedSubjectTemplate string

// TemplateServiceImpl is an implementation-specific structure loading all resources necessary for server execution
type TemplateServiceImpl struct {
	templateCache  *emailtemplates.TemplateCache
	emailTemplates map[string]*emailtemplates.EmailTemplate
}

// NewTemplateServiceImpl is a constructor for TemplateServiceImpl
func NewTemplateServiceImpl() (*TemplateServiceImpl, error) {
	service := &TemplateServiceImpl{templateCache: emailtemplates.NewTemplateCache()}

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

	err = t.loadEmailTemplate(OperationalSolutionSelectedTemplateName, operationalSolutionSelectedSubjectTemplate, operationalSolutionSelectedBodyTemplate)
	if err != nil {
		return err
	}
	err = t.loadEmailTemplate(MTOSolutionSelectedTemplateName, mtoSolutionSelectedSubjectTemplate, mtoSolutionSelectedBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(ModelPlanSuggestedPhaseTemplateName, modelPlanSuggestedPhaseSubjectTemplate, modelPlanSuggestedPhaseBodyTemplate)
	if err != nil {
		return err
	}

	err = t.loadEmailTemplate(DataExchangeApproachMarkedCompleteTemplateName, dataExchangeApproachMarkedCompleteSubjectTemplate, dataExchangeApproachMarkedCompleteBodyTemplate)
	if err != nil {
		return err
	}

	if err := t.loadEmailTemplate(MTOCommonSolutionOwnerAddedTemplateName, MTOCommonSolutionOwnerAddedSubjectTemplate, MTOCommonSolutionOwnerAddedBodyTemplate); err != nil {
		return err
	}

	if err := t.loadEmailTemplate(MTOCommonSolutionOwnerEditedTemplateName, MTOCommonSolutionOwnerEditedSubjectTemplate, MTOCommonSolutionOwnerEditedBodyTemplate); err != nil {
		return err
	}

	if err := t.loadEmailTemplate(MTOCommonSolutionPOCAddedTemplateName, MTOCommonSolutionPOCAddedSubjectTemplate, MTOCommonSolutionPOCAddedBodyTemplate); err != nil {
		return err
	}

	if err := t.loadEmailTemplate(MTOCommonSolutionPOCEditedTemplateName, MTOCommonSolutionPOCEditedSubjectTemplate, MTOCommonSolutionPOCEditedBodyTemplate); err != nil {
		return err
	}

	if err := t.loadEmailTemplate(MTOCommonSolutionPOCRemovedTemplateName, MTOCommonSolutionPOCRemovedSubjectTemplate, MTOCommonSolutionPOCRemovedBodyTemplate); err != nil {
		return err
	}

	if err := t.loadEmailTemplate(MTOCommonSolutionPOCWelcomeTemplateName, MTOCommonSolutionPOCWelcomeSubjectTemplate, MTOCommonSolutionPOCWelcomeBodyTemplate); err != nil {
		return err
	}

	if err := t.loadEmailTemplate(MTOCommonSolutionContractorAddedTemplateName, MTOCommonSolutionContractorAddedSubjectTemplate, MTOCommonSolutionContractorAddedBodyTemplate); err != nil {
		return err
	}

	if err := t.loadEmailTemplate(MTOCommonSolutionContractorEditedTemplateName, MTOCommonSolutionContractorEditedSubjectTemplate, MTOCommonSolutionContractorEditedBodyTemplate); err != nil {
		return err
	}

	if err := t.loadEmailTemplate(MTOCommonSolutionContractorRemovedTemplateName, MTOCommonSolutionContractorRemovedSubjectTemplate, MTOCommonSolutionContractorRemovedBodyTemplate); err != nil {
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
		"shared_style.html":                      sharedStyleTemplate,
		"shared_header.html":                     sharedHeaderTemplate,
		"shared_footer.html":                     sharedFooterTemplate,
		"shared_access_banner.html":              sharedAccessBannerTemplate,
		"shared_solution_poc_footer.html":        sharedSolutionPOCFooterTemplate,
		"shared_mto_common_solution_header.html": sharedMTOCommonSolutionHeaderTemplate,
		"shared_mint_mailbox_footer.html":        sharedMintMailboxFooter,
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
