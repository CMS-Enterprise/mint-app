package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/stretchr/testify/assert"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/email"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestCreatePlanDiscussion() {
	plan := suite.createModelPlan("Test Plan")

	input := &model.PlanDiscussionCreateInput{
		ModelPlanID:         plan.ID,
		Content:             "This is a test comment",
		UserRole:            models.DiscussionUserRolePointer(models.DiscussionRoleNoneOfTheAbove),
		UserRoleDescription: models.StringPointer("test role"),
	}

	result, err := CreatePlanDiscussion(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		input,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.NotNil(result.ID)
	suite.EqualValues(plan.ID, result.ModelPlanID)
	suite.EqualValues(input.Content, result.Content)
	suite.EqualValues(models.DiscussionUnAnswered, result.Status)
	suite.True(result.IsAssessment) // default principal for the test suite is an assessment user
	suite.Nil(result.ModifiedBy)
	suite.Nil(result.ModifiedDts)
}

func (suite *ResolverSuite) TestCreatePlanDiscussionAsRegularUser() {
	plan := suite.createModelPlan("Test Plan")

	input := &model.PlanDiscussionCreateInput{
		ModelPlanID:         plan.ID,
		Content:             "This is a test comment",
		UserRole:            models.DiscussionUserRolePointer(models.DiscussionRoleNoneOfTheAbove),
		UserRoleDescription: models.StringPointer("test role"),
	}

	regularUserPrincipal := suite.testConfigs.Principal
	regularUserPrincipal.JobCodeASSESSMENT = false
	regularUserPrincipal.JobCodeUSER = true
	result, err := CreatePlanDiscussion(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		input,
		regularUserPrincipal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.NotNil(result.ID)
	suite.EqualValues(plan.ID, result.ModelPlanID)
	suite.EqualValues(input.Content, result.Content)
	suite.EqualValues(models.DiscussionUnAnswered, result.Status)
	suite.False(result.IsAssessment)
	suite.Nil(result.ModifiedBy)
	suite.Nil(result.ModifiedDts)
}

func (suite *ResolverSuite) TestPlanDiscussionUserRole_ValidRoleNoDescription() {
	plan := suite.createModelPlan("Test Plan")
	userRole := models.DiscussionRoleCmsSystemServiceTeam

	planDiscussionInput := &model.PlanDiscussionCreateInput{
		ModelPlanID:         plan.ID,
		Content:             "This is a CMS_SYSTEM_SERVICE_TEAM test comment",
		UserRole:            &userRole,
		UserRoleDescription: nil, // Description not provided for CMS_SYSTEM_SERVICE_TEAM role
	}

	planDiscussion, err := CreatePlanDiscussion(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		planDiscussionInput,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)

	suite.NoError(err)
	suite.NotNil(planDiscussion.ID)
	suite.EqualValues(plan.ID, planDiscussion.ModelPlanID)
	suite.EqualValues(planDiscussionInput.Content, planDiscussion.Content)
	suite.EqualValues(planDiscussionInput.UserRole, planDiscussion.UserRole)
	suite.EqualValues(models.DiscussionUnAnswered, planDiscussion.Status)
	suite.True(planDiscussion.IsAssessment) // default principal for the test suite is an assessment user
	suite.Nil(planDiscussion.ModifiedBy)
	suite.Nil(planDiscussion.ModifiedDts)
}

func (suite *ResolverSuite) TestPlanDiscussionUserRole_NoDescription() {
	plan := suite.createModelPlan("Test Plan")
	userRole := models.DiscussionRoleNoneOfTheAbove

	planDiscussionInput := &model.PlanDiscussionCreateInput{
		ModelPlanID:         plan.ID,
		Content:             "This is a NONE_OF_THE_ABOVE test comment",
		UserRole:            &userRole,
		UserRoleDescription: nil, // Description not provided for NONE_OF_THE_ABOVE role
	}

	_, err := CreatePlanDiscussion(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		planDiscussionInput,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)

	suite.Error(err)
	suite.Contains(err.Error(), "violates check constraint \"user_role_check\"")
}

func (suite *ResolverSuite) TestPlanDiscussionUserRole_RoleNilDescriptionNil() {
	plan := suite.createModelPlan("Test Plan")

	planDiscussionInput := &model.PlanDiscussionCreateInput{
		ModelPlanID:         plan.ID,
		Content:             "This is a test comment",
		UserRole:            nil, // Role not provided
		UserRoleDescription: nil, // Description not provided
	}

	planDiscussion, err := CreatePlanDiscussion(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		planDiscussionInput,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)

	suite.NoError(err)
	suite.NotNil(planDiscussion.ID)
	suite.EqualValues(plan.ID, planDiscussion.ModelPlanID)
	suite.EqualValues(planDiscussionInput.Content, planDiscussion.Content)
	suite.EqualValues(planDiscussionInput.UserRole, planDiscussion.UserRole)
	suite.EqualValues(models.DiscussionUnAnswered, planDiscussion.Status)
	suite.True(planDiscussion.IsAssessment) // default principal for the test suite is an assessment user
	suite.Nil(planDiscussion.ModifiedBy)
	suite.Nil(planDiscussion.ModifiedDts)
}

func (suite *ResolverSuite) TestUpdatePlanDiscussion() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")

	changes := map[string]interface{}{
		"content": "This is now updated! Thanks for looking at my test",
		"status":  models.DiscussionAnswered,
	}
	result, err := UpdatePlanDiscussion(suite.testConfigs.Logger, discussion.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(discussion.ID, result.ID)
	suite.EqualValues(changes["content"], result.Content)
	suite.EqualValues(changes["status"], result.Status)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, result.CreatedBy)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestDeletePlanDiscussion() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")

	result, err := DeletePlanDiscussion(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(discussion, result)

	// Check that there's no plans for this user
	discussions, err := PlanDiscussionGetByModelPlanIDLOADER(suite.testConfigs.Context, discussion.ID)
	suite.NoError(err)
	suite.Len(discussions, 0)
}

func (suite *ResolverSuite) TestDeletePlanDiscussionWithReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	_ = suite.createDiscussionReply(discussion, "This is a test reply", false)

	_, err := DeletePlanDiscussion(suite.testConfigs.Logger, discussion.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Error(err)
	suite.Contains(err.Error(), "violates foreign key constraint") // maybe a weak check, and should be a custom error type, but works for now
}

func (suite *ResolverSuite) TestCreateDiscussionReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")

	input := &model.DiscussionReplyCreateInput{
		DiscussionID: discussion.ID,
		Content:      "This is a test reply",
		Resolution:   true,
	}

	result, err := CreateDiscussionReply(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(result.ID)
	suite.EqualValues(discussion.ID, result.DiscussionID)
	suite.EqualValues(input.Content, result.Content)
	suite.EqualValues(input.Resolution, result.Resolution)
	suite.True(result.IsAssessment) // default principal for the test suite is an assessment user
}

func (suite *ResolverSuite) TestCreateDiscussionReplyAsRegularUser() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")

	input := &model.DiscussionReplyCreateInput{
		DiscussionID: discussion.ID,
		Content:      "This is a test reply",
		Resolution:   true,
	}

	regularUserPrincipal := suite.testConfigs.Principal
	regularUserPrincipal.JobCodeASSESSMENT = false

	result, err := CreateDiscussionReply(suite.testConfigs.Logger, input, regularUserPrincipal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(result.ID)
	suite.EqualValues(discussion.ID, result.DiscussionID)
	suite.EqualValues(input.Content, result.Content)
	suite.EqualValues(input.Resolution, result.Resolution)
	suite.False(result.IsAssessment)
}

func (suite *ResolverSuite) TestUpdateDiscussionReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	reply := suite.createDiscussionReply(discussion, "This is a test reply", false)
	assert.Nil(suite.T(), reply.ModifiedBy)
	assert.Nil(suite.T(), reply.ModifiedDts)

	changes := map[string]interface{}{
		"content":    "This is now updated! Thanks for looking at my test",
		"resolution": true,
	}

	result, err := UpdateDiscussionReply(suite.testConfigs.Logger, reply.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(changes["content"], result.Content)
	suite.EqualValues(changes["resolution"], result.Resolution)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, result.CreatedBy)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestDiscussionReplyCollectionByDiscusionID() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	_ = suite.createDiscussionReply(discussion, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion, "This is another test reply", true)

	result, err := DiscussionReplyCollectionByDiscusionIDLOADER(suite.testConfigs.Context, discussion.ID)
	suite.NoError(err)
	suite.Len(result, 2)

	// Check that adding another dicussion doesn't affect the first one
	discussionTwo := suite.createPlanDiscussion(plan, "This is another test comment")
	_ = suite.createDiscussionReply(discussionTwo, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussionTwo, "This is another test reply", true)
	_ = suite.createDiscussionReply(discussionTwo, "This is a third test reply", true)

	// Assert the count on the _first_ discussion is still 2
	result, err = DiscussionReplyCollectionByDiscusionIDLOADER(suite.testConfigs.Context, discussion.ID)
	suite.NoError(err)
	suite.Len(result, 2)
}

func (suite *ResolverSuite) TestPlanDiscussionCollectionByModelPlanID() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	_ = suite.createDiscussionReply(discussion, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion, "This is another test reply", true)

	result, err := PlanDiscussionGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(result, 1)

	// Check that adding another dicussion doesn't affect the first one
	discussionTwo := suite.createPlanDiscussion(plan, "This is another test comment")
	_ = suite.createDiscussionReply(discussionTwo, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussionTwo, "This is another test reply", true)
	_ = suite.createDiscussionReply(discussionTwo, "This is a third test reply", true)

	// Assert the count on the is now 2 after adding another discussion
	result, err = PlanDiscussionGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(result, 2)
}

func (suite *ResolverSuite) TestDeleteDiscussionReply() {
	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")
	reply := suite.createDiscussionReply(discussion, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion, "This is another test reply", false)

	_, err := DeleteDiscussionReply(suite.testConfigs.Logger, reply.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	// Should only have 1 left now
	result, err := DiscussionReplyCollectionByDiscusionIDLOADER(suite.testConfigs.Context, discussion.ID)
	suite.NoError(err)
	suite.Len(result, 1)
}

func (suite *ResolverSuite) TestPlanDiscussionDataLoader() { //TODO update for discussion
	plan1 := suite.createModelPlan("Plan For Disc 1")
	_ = suite.createPlanDiscussion(plan1, "This is a test comment")
	plan2 := suite.createModelPlan("Plan For Disc 2")
	_ = suite.createPlanDiscussion(plan2, "This is a test comment")
	_ = suite.createPlanDiscussion(plan2, "This is a test comment")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyPlanDiscussionLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyPlanDiscussionLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

}
func verifyPlanDiscussionLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	discussions, err := PlanDiscussionGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}
	if len(discussions) < 1 {

		return fmt.Errorf("plan Discussion check didn't return any dicussions")
	}

	if modelPlanID != discussions[0].ModelPlanID {
		return fmt.Errorf("plan Discussion returned model plan ID %s, expected %s", discussions[0].ModelPlanID, modelPlanID)
	}
	return nil
}

func (suite *ResolverSuite) TestDiscussionReplyDataLoader() {
	plan1 := suite.createModelPlan("Plan For DiscR 1")
	discussion1 := suite.createPlanDiscussion(plan1, "This is a test comment")
	_ = suite.createDiscussionReply(discussion1, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion1, "This is another test reply", true)
	plan2 := suite.createModelPlan("Plan For DiscR 2")
	discussion2 := suite.createPlanDiscussion(plan2, "This is a test comment")
	_ = suite.createDiscussionReply(discussion2, "This is a test reply", false)
	_ = suite.createDiscussionReply(discussion2, "This is another test reply", true)

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyDiscussionReplyLoader(ctx, discussion1.ID)
	})
	g.Go(func() error {
		return verifyDiscussionReplyLoader(ctx, discussion2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

}
func verifyDiscussionReplyLoader(ctx context.Context, discussionID uuid.UUID) error {

	discRs, err := DiscussionReplyCollectionByDiscusionIDLOADER(ctx, discussionID)
	if err != nil {
		return err
	}

	if discussionID != discRs[0].DiscussionID {
		return fmt.Errorf("discussion Reply returned model plan ID %s, expected %s", discRs[0].DiscussionID, discussionID)
	}
	return nil
}
