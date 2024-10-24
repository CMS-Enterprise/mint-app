// Package emailtestconfigs provides shared utilities when you need to do local testing that requires email configuration
package emailtestconfigs

import (
	"fmt"

	"github.com/golang/mock/gomock"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

// TestEmailServiceConfig is a shared emailServiceConfig that can be used to test multiple test packages
var TestEmailServiceConfig = oddmail.GoSimpleMailServiceConfig{
	Enabled:       true,
	Host:          "localhost",
	Port:          1030,
	ClientAddress: "localhost:3005",
}

// InitializeOddMailService provides a shared implementation where an email service is desired for testing
func InitializeOddMailService() (oddmail.EmailService, error) {

	return oddmail.NewGoSimpleMailService(TestEmailServiceConfig)

}

// InitializeMockEmailService provides a shared entry to returning a MockEmailService. It utilized to TestEmailServiceConfig to generate the email service
func InitializeMockEmailService(mockController *gomock.Controller) *oddmail.MockEmailService {
	return oddmail.NewMockEmailService(mockController)
}

// InitializeEmailTemplateService provides a shared implementation for for an email template service to be used for testing
func InitializeEmailTemplateService() (email.TemplateService, error) {
	return email.NewTemplateServiceImpl()

}

// InitializeAddressBook provides a shared implementation for an address book to be used for testing
func InitializeAddressBook() email.AddressBook {
	return email.AddressBook{
		DefaultSender: "test@mint.dev.cms.gov",
		MINTTeamEmail: "test.team@mint.dev.cms.gov",
		DevTeamEmail:  "test.dev.team@mint.dev.cms.gov",

		ModelPlanDateChangedRecipients: []string{
			"test.receiver.1@mint.dev.cms.gov",
			"test.receiver.2@mint.dev.cms.gov",
		},
	}
}

// CreateTemplateCacheHelper creates a default test template
func CreateTemplateCacheHelper(
	planName string,
	plan *models.ModelPlan) (*emailtemplates.EmailTemplate, string, string) {

	return CreateTemplateCacheHelperWithInputTemplates(
		planName,
		plan,
		"{{.ModelName}}'s Test",
		"{{.ModelName}} {{.ModelID}}")
}

// CreateTemplateCacheHelperWithInputTemplates creates a test template with the given subject and body
func CreateTemplateCacheHelperWithInputTemplates(
	planName string,
	plan *models.ModelPlan,
	subject string,
	body string) (*emailtemplates.EmailTemplate, string, string) {
	templateCache := emailtemplates.NewTemplateCache()
	_ = templateCache.LoadTextTemplateFromString("testSubject", subject)
	_ = templateCache.LoadHTMLTemplateFromString("testBody", body, nil)
	testTemplate := emailtemplates.NewEmailTemplate(
		templateCache,
		"testSubject",
		"testBody",
	)

	expectedSubject := fmt.Sprintf("%s's Test", planName)
	expectedBody := fmt.Sprintf("%s %s", planName, plan.ID.String())
	return testTemplate, expectedSubject, expectedBody
}
