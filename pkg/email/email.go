package email

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/models"
)

// Config holds application specific configs for SES
type Config struct {
	URLHost           string
	URLScheme         string
	TemplateDirectory string
}

// templates stores typed templates
// since the template.Template uses string access
type templates struct {
	// systemIntakeSubmissionTemplate             templateCaller
	// businessCaseSubmissionTemplate             templateCaller
	// intakeReviewTemplate                       templateCaller
	// namedRequestWithdrawTemplate               templateCaller
	// unnamedRequestWithdrawTemplate             templateCaller
	// issueLCIDTemplate                          templateCaller
	// extendLCIDTemplate                         templateCaller
	// rejectRequestTemplate                      templateCaller
	// newAccessibilityRequestTemplate            templateCaller
	// newAccessibilityRequestToRequesterTemplate templateCaller
	// removedAccessibilityRequestTemplate        templateCaller
	// newDocumentTemplate                        templateCaller
	// changeAccessibilityRequestStatus           templateCaller
	// newAccessibilityRequestNote                templateCaller
}

// sender is an interface for swapping out email provider implementations
type sender interface {
	Send(ctx context.Context, toAddress models.EmailAddress, ccAddress *models.EmailAddress, subject string, body string) error
}

// Client is an MINT SES client wrapper
type Client struct {
	config    Config
	templates templates
	sender    sender
}

// NewClient returns a new email client for MINT
func NewClient(config Config, sender sender) (Client, error) {
	// rawTemplates, err := template.ParseGlob(path.Join(config.TemplateDirectory, "*.gohtml"))
	// if err != nil {
	// 	return Client{}, err
	// }
	appTemplates := templates{}

	client := Client{
		config:    config,
		templates: appTemplates,
		sender:    sender,
	}
	return client, nil
}

// SendTestEmail sends an email to a no-reply address
func (c Client) SendTestEmail(ctx context.Context) error {
	testToAddress := models.NewEmailAddress("success@simulator.amazonses.com")
	return c.sender.Send(ctx, testToAddress, nil, "test", "test")
}
