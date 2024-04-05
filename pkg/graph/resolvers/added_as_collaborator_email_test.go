package resolvers

import (
	"github.com/golang/mock/gomock"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

func (s *ResolverSuite) TestAddedAsCollaboratorEmail() {
	mockController := gomock.NewController(s.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailTemplateService := email.NewMockTemplateService(mockController)

	planName := "Plan For Milestones"
	plan := s.createModelPlan(planName)

	collaboratorInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: plan.ID,
		UserName:    "CLAB",
		TeamRoles:   []models.TeamRole{models.TeamRoleLeadership},
	}
	expectedEmail := "CLAB.doe@local.fake" // This comes from the stub fetch user info function

	testTemplate, expectedSubject, expectedBody := createAddedAsCollaboratorTemplateCacheHelper(planName, plan)
	mockEmailTemplateService.
		EXPECT().
		GetEmailTemplate(gomock.Eq(email.AddedAsCollaboratorTemplateName)).
		Return(testTemplate, nil).
		AnyTimes()

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
		AnyTimes()

	addressBook := email.AddressBook{
		DefaultSender: "unit-test-execution@mint.cms.gov",
	}

	emailServiceConfig := &oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}

	mockEmailService.
		EXPECT().
		GetConfig().
		Return(emailServiceConfig).
		AnyTimes()

	_, _, err := PlanCollaboratorCreate(
		s.testConfigs.Context,
		s.testConfigs.Store,
		s.testConfigs.Store,
		s.testConfigs.Logger,
		mockEmailService,
		mockEmailTemplateService,
		addressBook,
		collaboratorInput,
		s.testConfigs.Principal,
		false,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(s.stubFetchUserInfo),
		true,
	)
	s.NoError(err)
	mockController.Finish()
}
