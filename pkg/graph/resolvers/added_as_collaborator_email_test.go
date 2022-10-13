package resolvers

import (
	"github.com/golang/mock/gomock"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (s *ResolverSuite) TestAddedAsCollaboratorEmail() {
	planName := "Plan For Milestones"
	plan := s.createModelPlan(planName)

	collaboratorInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: plan.ID,
		EuaUserID:   "CLAB",
		FullName:    "Clab O' Rater",
		TeamRole:    models.TeamRoleLeadership,
		Email:       "clab@rater.com",
	}

	testTemplate, expectedSubject, expectedBody := createAddedAsCollaboratorTemplateCacheHelper(planName, plan)

	s.testConfigs.EmailTemplateService.
		EXPECT().
		GetEmailTemplate(gomock.Eq(email.AddedAsCollaboratorTemplateName)).
		Return(testTemplate, nil).
		Times(1)

	s.testConfigs.EmailService.
		EXPECT().
		Send(
			gomock.Eq(s.testConfigs.EmailService),
			gomock.Eq([]string{collaboratorInput.Email}),
			gomock.Any(),
			gomock.Eq(expectedSubject),
			gomock.Any(),
			gomock.Eq(expectedBody),
		).
		Times(1)

	_, err := CreatePlanCollaborator(
		s.testConfigs.Logger,
		s.testConfigs.EmailService,
		s.testConfigs.EmailTemplateService,
		collaboratorInput,
		s.testConfigs.Principal,
		s.testConfigs.Store,
	)
	s.NoError(err)
}
