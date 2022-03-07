package email

import (
	"context"
	"fmt"
	"html/template"
	"io"
	"net/url"
	"path"

	"github.com/cmsgov/easi-app/pkg/models"
)

// Config holds EASi application specific configs for SES
type Config struct {
	GRTEmail               models.EmailAddress
	AccessibilityTeamEmail models.EmailAddress
	URLHost                string
	URLScheme              string
	TemplateDirectory      string
}

// templateCaller is an interface to helping with testing template dependencies
type templateCaller interface {
	Execute(wr io.Writer, data interface{}) error
}

// templates stores typed templates
// since the template.Template uses string access
type templates struct {
	systemIntakeSubmissionTemplate             templateCaller
	businessCaseSubmissionTemplate             templateCaller
	intakeReviewTemplate                       templateCaller
	namedRequestWithdrawTemplate               templateCaller
	unnamedRequestWithdrawTemplate             templateCaller
	issueLCIDTemplate                          templateCaller
	extendLCIDTemplate                         templateCaller
	rejectRequestTemplate                      templateCaller
	newAccessibilityRequestTemplate            templateCaller
	newAccessibilityRequestToRequesterTemplate templateCaller
	removedAccessibilityRequestTemplate        templateCaller
	newDocumentTemplate                        templateCaller
	changeAccessibilityRequestStatus           templateCaller
	newAccessibilityRequestNote                templateCaller
}

// sender is an interface for swapping out email provider implementations
type sender interface {
	Send(ctx context.Context, toAddress models.EmailAddress, ccAddress *models.EmailAddress, subject string, body string) error
}

// Client is an EASi SES client wrapper
type Client struct {
	config    Config
	templates templates
	sender    sender
}

// templateError is just a helper method for formatting errors
func templateError(name string) error {
	return fmt.Errorf("failed to get template: %s", name)
}

// NewClient returns a new email client for EASi
func NewClient(config Config, sender sender) (Client, error) {
	rawTemplates, err := template.ParseGlob(path.Join(config.TemplateDirectory, "*.gohtml"))
	if err != nil {
		return Client{}, err
	}
	appTemplates := templates{}

	systemIntakeSubmissionTemplateName := "system_intake_submission.gohtml"
	systemIntakeSubmissionTemplate := rawTemplates.Lookup(systemIntakeSubmissionTemplateName)
	if systemIntakeSubmissionTemplate == nil {
		return Client{}, templateError(systemIntakeSubmissionTemplateName)
	}
	appTemplates.systemIntakeSubmissionTemplate = systemIntakeSubmissionTemplate

	businessCaseSubmissionTemplateName := "business_case_submission.gohtml"
	businessCaseSubmissionTemplate := rawTemplates.Lookup(businessCaseSubmissionTemplateName)
	if businessCaseSubmissionTemplate == nil {
		return Client{}, templateError(businessCaseSubmissionTemplateName)
	}
	appTemplates.businessCaseSubmissionTemplate = businessCaseSubmissionTemplate

	intakeReviewTemplateName := "system_intake_review.gohtml"
	intakeReviewTemplate := rawTemplates.Lookup(intakeReviewTemplateName)
	if intakeReviewTemplate == nil {
		return Client{}, templateError(intakeReviewTemplateName)
	}
	appTemplates.intakeReviewTemplate = intakeReviewTemplate

	namedRequestWithdrawTemplateName := "named_request_withdrawal.gohtml"
	namedRequestWithdrawTemplate := rawTemplates.Lookup(namedRequestWithdrawTemplateName)
	if namedRequestWithdrawTemplate == nil {
		return Client{}, templateError(namedRequestWithdrawTemplateName)
	}
	appTemplates.namedRequestWithdrawTemplate = namedRequestWithdrawTemplate

	unnamedRequestWithdrawTemplateName := "unnamed_request_withdrawal.gohtml"
	unnamedRequestWithdrawTemplate := rawTemplates.Lookup(unnamedRequestWithdrawTemplateName)
	if unnamedRequestWithdrawTemplate == nil {
		return Client{}, templateError(unnamedRequestWithdrawTemplateName)
	}
	appTemplates.unnamedRequestWithdrawTemplate = unnamedRequestWithdrawTemplate

	issueLCIDTemplateName := "issue_lcid.gohtml"
	issueLCIDTemplate := rawTemplates.Lookup(issueLCIDTemplateName)
	if issueLCIDTemplate == nil {
		return Client{}, templateError(issueLCIDTemplateName)
	}
	appTemplates.issueLCIDTemplate = issueLCIDTemplate

	extendLCIDTemplateName := "extend_lcid.gohtml"
	extendLCIDTemplate := rawTemplates.Lookup(extendLCIDTemplateName)
	if extendLCIDTemplate == nil {
		return Client{}, templateError(extendLCIDTemplateName)
	}
	appTemplates.extendLCIDTemplate = extendLCIDTemplate

	rejectRequestTemplateName := "reject_request.gohtml"
	rejectRequestTemplate := rawTemplates.Lookup(rejectRequestTemplateName)
	if rejectRequestTemplate == nil {
		return Client{}, templateError(rejectRequestTemplateName)
	}
	appTemplates.rejectRequestTemplate = rejectRequestTemplate

	newAccessibilityRequestTemplateName := "new_508_request.gohtml"
	newAccessibilityRequestTemplate := rawTemplates.Lookup(newAccessibilityRequestTemplateName)
	if newAccessibilityRequestTemplate == nil {
		return Client{}, templateError(newAccessibilityRequestTemplateName)
	}
	appTemplates.newAccessibilityRequestTemplate = newAccessibilityRequestTemplate

	newAccessibilityRequestToRequesterTemplateName := "new_508_request_to_requester.gohtml"
	newAccessibilityRequestToRequesterTemplate := rawTemplates.Lookup(newAccessibilityRequestToRequesterTemplateName)
	if newAccessibilityRequestToRequesterTemplate == nil {
		return Client{}, templateError(newAccessibilityRequestToRequesterTemplateName)
	}
	appTemplates.newAccessibilityRequestToRequesterTemplate = newAccessibilityRequestToRequesterTemplate

	removedAccessibilityRequestTemplateName := "removed_508_request.gohtml"
	removedAccessibilityRequestTemplate := rawTemplates.Lookup(removedAccessibilityRequestTemplateName)
	if removedAccessibilityRequestTemplate == nil {
		return Client{}, templateError(removedAccessibilityRequestTemplateName)
	}
	appTemplates.removedAccessibilityRequestTemplate = removedAccessibilityRequestTemplate

	newDocumentTemplateName := "new_document.gohtml"
	newDocumentTemplate := rawTemplates.Lookup(newDocumentTemplateName)
	if newDocumentTemplate == nil {
		return Client{}, templateError(newDocumentTemplateName)
	}
	appTemplates.newDocumentTemplate = newDocumentTemplate

	changeAccessibilityRequestStatusTemplateName := "change_508_status.gohtml"
	changeAccessibilityRequestStatusTemplate := rawTemplates.Lookup(changeAccessibilityRequestStatusTemplateName)
	if changeAccessibilityRequestStatusTemplate == nil {
		return Client{}, templateError(changeAccessibilityRequestStatusTemplateName)
	}
	appTemplates.changeAccessibilityRequestStatus = changeAccessibilityRequestStatusTemplate

	newAccessibilityRequestNoteTemplateName := "new_508_note.gohtml"
	newAccessibilityRequestNoteTemplate := rawTemplates.Lookup(newAccessibilityRequestNoteTemplateName)
	if newAccessibilityRequestNoteTemplate == nil {
		return Client{}, templateError(newAccessibilityRequestNoteTemplateName)
	}
	appTemplates.newAccessibilityRequestNote = newAccessibilityRequestNoteTemplate

	client := Client{
		config:    config,
		templates: appTemplates,
		sender:    sender,
	}
	return client, nil
}

// urlFromPath uses the client's URL configs to format one with a specific path
func (c Client) urlFromPath(path string) string {
	u := url.URL{
		Scheme: c.config.URLScheme,
		Host:   c.config.URLHost,
		Path:   path,
	}
	return u.String()
}

// SendTestEmail sends an email to a no-reply address
func (c Client) SendTestEmail(ctx context.Context) error {
	testToAddress := models.NewEmailAddress("success@simulator.amazonses.com")
	return c.sender.Send(ctx, testToAddress, nil, "test", "test")
}
