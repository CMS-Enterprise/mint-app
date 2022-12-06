package resolvers

import (
	"testing"
	"time"

	"github.com/cmsgov/mint-app/pkg/email"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
)

// ResolverSuite is the testify suite for the resolver package
type ResolverSuite struct {
	suite.Suite
	testConfigs *TestConfigs
}

// SetupTest clears the database between each test
func (suite *ResolverSuite) SetupTest() {
	err := suite.testConfigs.Store.TruncateAllTablesDANGEROUS(suite.testConfigs.Logger)
	assert.NoError(suite.T(), err)
}

func (suite *ResolverSuite) createModelPlan(planName string) *models.ModelPlan {
	mp, err := ModelPlanCreate(suite.testConfigs.Logger, planName, suite.testConfigs.Store, suite.testConfigs.UserInfo, suite.testConfigs.Principal)
	suite.NoError(err)
	return mp
}

func (suite *ResolverSuite) createPlanDiscussion(mp *models.ModelPlan, content string) *models.PlanDiscussion {
	input := &model.PlanDiscussionCreateInput{
		ModelPlanID: mp.ID,
		Content:     content,
	}
	pd, err := CreatePlanDiscussion(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	return pd
}

func (suite *ResolverSuite) createDiscussionReply(pd *models.PlanDiscussion, content string, resolution bool) *models.DiscussionReply {
	input := &model.DiscussionReplyCreateInput{
		DiscussionID: pd.ID,
		Content:      content,
		Resolution:   resolution,
	}
	dr, err := CreateDiscussionReply(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	return dr
}

func (suite *ResolverSuite) createPlanCollaborator(mp *models.ModelPlan, EUAUserID string, fullName string, teamRole models.TeamRole, emailAddress string) *models.PlanCollaborator {
	collaboratorInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: mp.ID,
		EuaUserID:   EUAUserID,
		FullName:    fullName,
		TeamRole:    teamRole,
		Email:       emailAddress,
	}

	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailTemplateService := email.NewMockTemplateService(mockController)

	emailServiceConfig := &oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
		DefaultSender: "unit-test-execution@mint.cms.gov",
	}

	mockEmailService.
		EXPECT().
		GetConfig().
		Return(emailServiceConfig).
		AnyTimes()

	testTemplate, expectedSubject, expectedBody := createAddedAsCollaboratorTemplateCacheHelper(mp.ModelName, mp)
	mockEmailTemplateService.
		EXPECT().
		GetEmailTemplate(gomock.Eq(email.AddedAsCollaboratorTemplateName)).
		Return(testTemplate, nil).
		AnyTimes()

	mockEmailService.
		EXPECT().
		Send(
			gomock.Any(),
			gomock.Eq([]string{collaboratorInput.Email}),
			gomock.Any(),
			gomock.Eq(expectedSubject),
			gomock.Any(),
			gomock.Eq(expectedBody),
		).
		AnyTimes()

	collaborator, _, err := CreatePlanCollaborator(
		suite.testConfigs.Logger,
		mockEmailService,
		mockEmailTemplateService,
		collaboratorInput,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		false,
	)
	suite.NoError(err)
	return collaborator
}

func (suite *ResolverSuite) createPlanCrTdl(mp *models.ModelPlan, idNumber string, dateInitated time.Time, title string, note string) *models.PlanCrTdl {
	input := &model.PlanCrTdlCreateInput{
		ModelPlanID:   mp.ID,
		IDNumber:      idNumber,
		DateInitiated: dateInitated,
		Title:         title,
		Note:          &note,
	}
	crTdl, err := PlanCrTdlCreate(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	return crTdl
}

// func (suite *ResolverSuite) createOperationalSolution(opNeed *models.OperationalNeed, solutionType *models.OperationalSolutionKey, customSolutionType *string, needed bool) *models.OperationalSolution {

// 	changes := map[string]interface{}{

// 		"operational_need_id": opNeed.ID,
// 	}

// 	if solutionType != nil {
// 		sol, err := OperationalSolutionInsertOrUpdate(suite.testConfigs.Logger, opNeed.ID, *solutionType, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
// 		suite.NoError(err)
// 		return sol
// 	}

// 	sol, err := OperationalSolutionInsertOrUpdateCustom(suite.testConfigs.Logger, opNeed.ID, *customSolutionType, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
// 	suite.NoError(err)
// 	return sol

// }

// TestResolverSuite runs the resolver test suite
func TestResolverSuite(t *testing.T) {
	rs := new(ResolverSuite)
	rs.testConfigs = GetDefaultTestConfigs()
	suite.Run(t, rs)
}
