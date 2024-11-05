package worker

import (
	"bytes"
	"context"
	"testing"
	"time"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/storage"

	"github.com/99designs/gqlgen/graphql"
	faktory "github.com/contribsys/faktory/client"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

// WorkerSuite is the testify suite for the worker package
type WorkerSuite struct {
	suite.Suite
	testConfigs *TestConfigs
}

func (suite *WorkerSuite) stubFetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
	return &models.UserInfo{
		Username:    username,
		FirstName:   username,
		LastName:    "Doe",
		DisplayName: username + " Doe",
		Email:       username + ".doe@local.fake",
	}, nil
}

// SetupTest clears the database between each test
func (suite *WorkerSuite) SetupTest() {
	err := suite.testConfigs.Store.TruncateAllTablesDANGEROUS(suite.testConfigs.Logger)
	assert.NoError(suite.T(), err)

	//GET USER ACCOUNT EACH TIME!
	princ := suite.getTestPrincipal(suite.testConfigs.Store, suite.testConfigs.UserInfo.Username)
	suite.testConfigs.Principal = princ

	// Flush faktory after each test
	client, err := faktory.Open()
	assert.NoError(suite.T(), err)
	err = client.Flush()
	assert.NoError(suite.T(), err)
}

func (suite *WorkerSuite) createModelPlan(planName string) *models.ModelPlan {
	mp, err := resolvers.ModelPlanCreate(
		context.Background(),
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		planName,
		nil,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)
	suite.NoError(err)
	return mp
}

func (suite *WorkerSuite) createPlanDiscussion(mp *models.ModelPlan, content string) *models.PlanDiscussion {
	taggedContent, err := models.NewTaggedContentFromString(content)
	suite.NoError(err)
	input := &model.PlanDiscussionCreateInput{
		ModelPlanID:         mp.ID,
		Content:             models.TaggedHTML(taggedContent),
		UserRole:            models.DiscussionUserRolePointer(models.DiscussionRoleNoneOfTheAbove),
		UserRoleDescription: models.StringPointer("test role"),
	}
	pd, err := resolvers.CreatePlanDiscussion(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		input,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)
	suite.NoError(err)
	return pd
}

func (suite *WorkerSuite) createPlanCollaborator(
	mp *models.ModelPlan,
	userName string,
	_ string,
	teamRoles []models.TeamRole,
	_ string,
) *models.PlanCollaborator {
	collaboratorInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: mp.ID,
		UserName:    userName,
		TeamRoles:   teamRoles,
	}

	collaborator, _, err := resolvers.PlanCollaboratorCreate(
		context.Background(),
		suite.testConfigs.Store,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		collaboratorInput,
		suite.testConfigs.Principal,
		false,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
		false, // This needs to be false because there are no data loaders on the worker package
	)
	suite.NoError(err)
	return collaborator
}

func (suite *WorkerSuite) createPlanCR(mp *models.ModelPlan, idNumber string, dateInitated time.Time, dateImplemented time.Time, title string, note string) *models.PlanCR {
	input := &model.PlanCRCreateInput{
		ModelPlanID:     mp.ID,
		IDNumber:        idNumber,
		DateInitiated:   dateInitated,
		DateImplemented: dateImplemented,
		Title:           title,
		Note:            &note,
	}
	cr, err := resolvers.PlanCRCreate(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	return cr
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

func (suite *WorkerSuite) createAnalyzedAuditChange(modelNameChange string,
	modelStatusChanges []string,
	documentCount int,
	crTdlActivity bool,
	updatedSections []models.TableName,
	reviewSections []models.TableName,
	clearanceSections []models.TableName,
	addedLeads []models.AnalyzedModelLeadInfo, discussionActivity bool) *models.AnalyzedAuditChange {

	auditChange := models.AnalyzedAuditChange{
		ModelPlan: &models.AnalyzedModelPlan{
			OldName:       modelNameChange,
			StatusChanges: modelStatusChanges,
		},
		Documents: &models.AnalyzedDocuments{
			Count: documentCount,
		},
		CrTdls: &models.AnalyzedCrTdls{
			Activity: crTdlActivity,
		},
		PlanSections: &models.AnalyzedPlanSections{
			Updated:           updatedSections,
			ReadyForReview:    reviewSections,
			ReadyForClearance: clearanceSections,
		},
		ModelLeads: &models.AnalyzedModelLeads{
			Added: addedLeads,
		},
		PlanDiscussions: &models.AnalyzedPlanDiscussions{
			Activity: discussionActivity,
		},
		PlanDataExchangeApproach: &models.AnalyzedPlanDataExchangeApproach{
			Activity: true,
		},
	}

	return &auditChange
}

func (suite *WorkerSuite) createAnalyzedAudit(mp *models.ModelPlan, date time.Time, changes models.AnalyzedAuditChange) *models.AnalyzedAudit {
	principal := suite.getTestPrincipal(suite.testConfigs.Store, "TEST")
	newAnalyzedAudit, err := models.NewAnalyzedAudit(principal.UserAccount.ID, mp.ID, mp.ModelName, date, changes)
	suite.NoError(err)

	analyzedAudit, err := suite.testConfigs.Store.AnalyzedAuditCreate(suite.testConfigs.Logger, newAnalyzedAudit)
	suite.NoError(err)

	return analyzedAudit
}

// TestWorkerSuite runs the worker test suite
//
// Hey friend -- if you're here because you're trying to figure out why your test is failing, you're in the right place.
// This test suite is a bit of a mess, and it's not easy to figure out what's going on. Here's a tip:
//   - Ensure FAKTORY_PROCESS_JOBS is set to "false" in your .envrc.local -- this will prevent the Faktory worker from eating up & running jobs
//     before you can test them (this test suite relies on jobs being in the queue, and checking their state)
func TestWorkerSuite(t *testing.T) {
	rs := new(WorkerSuite)
	rs.testConfigs = GetDefaultTestConfigs()
	t.Setenv("FAKTORY_URL", "tcp://localhost:7419")
	suite.Run(t, rs)
}

// getTestPrincipal gets a user principal from database
func (suite *WorkerSuite) getTestPrincipal(store *storage.Store, userName string) *authentication.ApplicationPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(suite.testConfigs.Context, store, store, userName, true, false, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.testConfigs.OktaClient.FetchUserInfo))

	princ := &authentication.ApplicationPrincipal{
		Username:          userName,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
		JobCodeMAC:        false,
		JobCodeNonCMS:     false,
		UserAccount:       userAccount,
	}
	return princ

}
