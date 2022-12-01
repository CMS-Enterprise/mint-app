package worker

import (
	"bytes"
	"testing"
	"time"

	"github.com/99designs/gqlgen/graphql"

	"github.com/cmsgov/mint-app/pkg/email"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
)

// WorkerSuite is the testify suite for the worker package
type WorkerSuite struct {
	suite.Suite
	testConfigs *TestConfigs
}

// SetupTest clears the database between each test
func (suite *WorkerSuite) SetupTest() {
	err := suite.testConfigs.Store.TruncateAllTablesDANGEROUS(suite.testConfigs.Logger)
	assert.NoError(suite.T(), err)
}

func (suite *WorkerSuite) createModelPlan(planName string) *models.ModelPlan {
	mp, err := resolvers.ModelPlanCreate(suite.testConfigs.Logger, planName, suite.testConfigs.Store, suite.testConfigs.UserInfo, suite.testConfigs.Principal)
	suite.NoError(err)
	return mp
}

func (suite *WorkerSuite) createPlanDiscussion(mp *models.ModelPlan, content string) *models.PlanDiscussion {
	input := &model.PlanDiscussionCreateInput{
		ModelPlanID: mp.ID,
		Content:     content,
	}
	pd, err := resolvers.CreatePlanDiscussion(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	return pd
}

func (suite *WorkerSuite) createPlanCollaborator(mp *models.ModelPlan, EUAUserID string, fullName string, teamRole models.TeamRole, emailAddress string) *models.PlanCollaborator {
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

	collaborator, err := resolvers.CreatePlanCollaborator(
		suite.testConfigs.Logger,
		mockEmailService,
		mockEmailTemplateService,
		collaboratorInput,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	return collaborator
}

func (suite *WorkerSuite) createPlanCrTdl(mp *models.ModelPlan, idNumber string, dateInitated time.Time, title string, note string) *models.PlanCrTdl {
	input := &model.PlanCrTdlCreateInput{
		ModelPlanID:   mp.ID,
		IDNumber:      idNumber,
		DateInitiated: dateInitated,
		Title:         title,
		Note:          &note,
	}
	crTdl, err := resolvers.PlanCrTdlCreate(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	return crTdl
}

func (suite *WorkerSuite) createPlanDocument(mp *models.ModelPlan) *models.PlanDocument {
	reader := bytes.NewReader([]byte("Some test file contents"))

	input := &model.PlanDocumentInput{
		ModelPlanID: mp.ID,
		FileData: graphql.Upload{
			File:        reader,
			Filename:    "sample.docx",
			Size:        reader.Size(),
			ContentType: "application/msword",
		},
		DocumentType: models.DocumentTypeConceptPaper,
	}
	document, err := resolvers.PlanDocumentCreate(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store, suite.testConfigs.S3Client)
	suite.NoError(err)

	return document
}

// TestWorkerSuite runs the worker test suite
func TestWorkerSuite(t *testing.T) {
	rs := new(WorkerSuite)
	rs.testConfigs = GetDefaultTestConfigs()
	suite.Run(t, rs)
}
