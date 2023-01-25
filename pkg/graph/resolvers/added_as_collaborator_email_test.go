package resolvers

import (
	"context"

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
		EuaUserID:   "CLAB",
		// FullName:    "Clab O' Rater",
		TeamRole: models.TeamRoleLeadership,
		// Email:       "clab@rater.com",
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

	emailServiceConfig := &oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
		DefaultSender: "unit-test-execution@mint.cms.gov",
	}

	mockEmailService.
		EXPECT().
		GetConfig().
		Return(emailServiceConfig).
		AnyTimes()

	_, _, err := CreatePlanCollaborator(
		context.Background(),
		s.testConfigs.Logger,
		mockEmailService,
		mockEmailTemplateService,
		collaboratorInput,
		s.testConfigs.Principal,
		s.testConfigs.Store,
		false,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(s.stubFetchUserInfo),
	)
	s.NoError(err)
	mockController.Finish()
}
