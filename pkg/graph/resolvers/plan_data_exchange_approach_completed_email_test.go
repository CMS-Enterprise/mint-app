package resolvers

import (
	"github.com/golang/mock/gomock"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func (suite *ResolverSuite) TestDataExchangeApproachCompletedEmail() {
	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailTemplateService := email.NewMockTemplateService(mockController)

	planName := "Plan For Milestones"
	plan := suite.createModelPlan(planName)

	addressBook := email.AddressBook{
		DefaultSender: "unit-test-execution@mint.cms.gov",
		MINTTeamEmail: "mint.team@local.fake",
	}

	testTemplate, expectedSubject, expectedBody := createTemplateCacheHelper(planName, plan)
	mockEmailTemplateService.
		EXPECT().
		GetEmailTemplate(gomock.Eq(email.DataExchangeApproachCompletedTemplateName)).
		Return(testTemplate, nil).
		AnyTimes()
	expectedEmail := addressBook.MINTTeamEmail

	mockEmailService.
		EXPECT().
		Send(
			gomock.Any(),
			gomock.Eq([]string{expectedEmail}),
			gomock.Any(),
			gomock.Eq(expectedSubject),
			gomock.Any(),
			gomock.Eq(expectedBody),
		).
		Times(1)

	emailServiceConfig := &oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}

	mockEmailService.
		EXPECT().
		GetConfig().
		Return(emailServiceConfig).
		AnyTimes()

	err := SendDataExchangeApproachCompletedEmailNotification(
		mockEmailService,
		mockEmailTemplateService,
		addressBook,
		plan,
		expectedEmail,
		"Test User",
		false,
	)
	suite.NoError(err)

	mockController.Finish()
}
