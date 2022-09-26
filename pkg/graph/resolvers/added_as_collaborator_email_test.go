package resolvers

import (
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (s *ResolverSuite) TestAddedAsCollaboratorEmail() {
	input := model.PlanCollaboratorCreateInput{
		ModelPlanID: uuid.MustParse("ce3405a0-3399-4e3a-88d7-3cfc613d2905"),
		EuaUserID:   "FAKE",
		FullName:    "Nota Person",
		TeamRole:    models.TeamRoleLearning,
		Email:       "contact.tbrooks@gmail.com",
	}

	_, err := CreatePlanCollaborator(
		s.testConfigs.Logger,
		&s.testConfigs.EmailService,
		s.testConfigs.EmailTemplateService,
		&input,
		s.testConfigs.Principal,
		s.testConfigs.Store)
	assert.NoError(s.T(), err)
}
