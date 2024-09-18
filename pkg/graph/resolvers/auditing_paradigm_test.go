package resolvers

import (
	"fmt"

	"github.com/samber/lo"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

func (suite *ResolverSuite) TestDeletionActorAccuracy() {

	plan := suite.createModelPlan("Test Plan")
	discussion := suite.createPlanDiscussion(plan, "This is a test comment")

	taggedContent, err := models.NewTaggedContentFromString("This is a test reply")
	suite.NoError(err)

	input := &model.DiscussionReplyCreateInput{
		DiscussionID:        discussion.ID,
		Content:             models.TaggedHTML(taggedContent),
		UserRole:            models.DiscussionUserRolePointer(models.DiscussionRoleNoneOfTheAbove),
		UserRoleDescription: models.StringPointer("this is a test"),
	}

	/* Create 4 discussion replies, with different principals*/
	testPR1 := suite.getTestPrincipal(suite.testConfigs.Store, "TestDR1")
	testPR2 := suite.getTestPrincipal(suite.testConfigs.Store, "TestDR2")
	testPR3 := suite.getTestPrincipal(suite.testConfigs.Store, "TestDR3")
	testPR4 := suite.getTestPrincipal(suite.testConfigs.Store, "TestDR4")

	dr1, err := CreateDiscussionReply(suite.testConfigs.Context, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, input, testPR1, suite.testConfigs.Store, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.NoError(err)
	dr2, err := CreateDiscussionReply(suite.testConfigs.Context, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, input, testPR2, suite.testConfigs.Store, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.NoError(err)
	dr3, err := CreateDiscussionReply(suite.testConfigs.Context, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, input, testPR3, suite.testConfigs.Store, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.NoError(err)
	dr4, err := CreateDiscussionReply(suite.testConfigs.Context, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, input, testPR4, suite.testConfigs.Store, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))
	suite.NoError(err)

	/* Delete DRs async to simulate a race condition */
	deleteGroup, _ := errgroup.WithContext(suite.testConfigs.Context)

	deleteGroup.Go(func() error {
		return deleteDiscussionReply(suite, dr1, testPR1)
	})
	deleteGroup.Go(func() error {
		return deleteDiscussionReply(suite, dr2, testPR2)
	})
	deleteGroup.Go(func() error {
		return deleteDiscussionReply(suite, dr3, testPR3)
	})
	deleteGroup.Go(func() error {
		return deleteDiscussionReply(suite, dr4, testPR4)
	})
	deleteGroupError := deleteGroup.Wait()
	suite.NoError(deleteGroupError)

	/* Verify that the act of deletion is credited to the correct user. For simplicity, creator is the deletor*/
	g, _ := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyDeleteAuditChange(suite, dr1)
	})
	g.Go(func() error {
		return verifyDeleteAuditChange(suite, dr2)
	})
	g.Go(func() error {
		return verifyDeleteAuditChange(suite, dr3)
	})
	g.Go(func() error {
		return verifyDeleteAuditChange(suite, dr4)
	})
	errG := g.Wait()
	suite.NoError(errG)

}
func deleteDiscussionReply(suite *ResolverSuite, discussionReply *models.DiscussionReply, principal authentication.Principal) error {
	_, err := DeleteDiscussionReply(suite.testConfigs.Logger, discussionReply.ID, principal, suite.testConfigs.Store)
	if err != nil {
		return err
	}
	return nil

}

func verifyDeleteAuditChange(suite *ResolverSuite, discussionReply *models.DiscussionReply) error {

	auditChanges, err := AuditChangeCollectionByIDAndTable(suite.testConfigs.Logger, "discussion_reply", discussionReply.ID, suite.testConfigs.Store)
	if err != nil {
		return err
	}
	deleteEntry, entryFound := lo.Find(auditChanges, func(change *models.AuditChange) bool {
		return change.Action == "D"
	})

	if !entryFound {
		return fmt.Errorf("no audit entry found for deletion of discussion reply %s", discussionReply.ID)
	}
	if deleteEntry.ModifiedBy != discussionReply.CreatedBy {
		return fmt.Errorf("discussion reply audit of delete action credited to the incorrect user")
	}

	return nil
}
