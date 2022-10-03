package resolvers

import (
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (s *ResolverSuite) TestAddedAsCollaboratorEmail() {
	plan := s.createModelPlan("Plan For Milestones")

	collaboratorInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: plan.ID,
		EuaUserID:   "CLAB",
		FullName:    "Clab O' Rater",
		TeamRole:    models.TeamRoleLeadership,
		Email:       "clab@rater.com",
	}

	addCollabTemplate, err := s.testConfigs.EmailTemplateService.GetEmailTemplate(email.AddedAsCollaboratorTemplateName)
	assert.NoError(s.T(), err)

	executedSubject, err := addCollabTemplate.GetExecutedSubject(email.AddedAsCollaboratorSubjectContent{
		ModelName: plan.ModelName,
	})
	assert.NoError(s.T(), err)

	executedBody, err := addCollabTemplate.GetExecutedBody(email.AddedAsCollaboratorBodyContent{
		ModelName: plan.ModelName,
		ModelID:   plan.ID.String(),
	})
	assert.NoError(s.T(), err)

	s.testConfigs.EmailService.EXPECT().Send(
		gomock.Eq(email.DefaultSender),
		gomock.Eq(collaboratorInput.Email),
		gomock.Any(),
		gomock.Eq(executedSubject),
		gomock.Any(),
		gomock.Eq(executedBody),
	).Times(1)

	_, err = CreatePlanCollaborator(
		s.testConfigs.Logger,
		s.testConfigs.EmailService,
		s.testConfigs.EmailTemplateService,
		collaboratorInput,
		s.testConfigs.Principal,
		s.testConfigs.Store,
	)
	assert.NoError(s.T(), err)
}
