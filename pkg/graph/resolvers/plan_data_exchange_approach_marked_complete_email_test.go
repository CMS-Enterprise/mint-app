package resolvers

import (
	"github.com/golang/mock/gomock"

	"github.com/cms-enterprise/mint-app/pkg/testconfig/emailtestconfigs"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func (suite *ResolverSuite) TestDataExchangeApproachMarkedCompleteEmail() {
	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailTemplateService := email.NewMockTemplateService(mockController)

	planName := "Plan For Milestones"
	plan := suite.createModelPlan(planName)

	addressBook := email.AddressBook{
		DefaultSender: "unit-test-execution@mint.cms.gov",
		MINTTeamEmail: "mint.team@local.fake",
	}

	testTemplate, expectedSubject, expectedBody := emailtestconfigs.CreateTemplateCacheHelper(planName, plan)
	mockEmailTemplateService.
		EXPECT().
		GetEmailTemplate(gomock.Eq(email.DataExchangeApproachMarkedCompleteTemplateName)).
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

	err := SendDataExchangeApproachMarkedCompleteEmailNotification(
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
