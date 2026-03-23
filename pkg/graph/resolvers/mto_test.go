package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
)

func (suite *ResolverSuite) TestMTOToggleReadyForReview() {
	plan := suite.createModelPlan("plan for testing MTO mark ready for review")

	markedReadyPrinc := suite.getTestPrincipal(suite.testConfigs.Store, "tester")

	// don't set it
	mto1, err := MTOToggleReadyForReview(suite.testConfigs.Context, suite.testConfigs.Logger,
		suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID, false, nil, email.AddressBook{})
	suite.NoError(err)
	if suite.NotNil(mto1, "mto shouldn't be nil") {
		suite.Nil(mto1.ReadyForReviewBy)
		suite.Nil(mto1.ReadyForReviewDts)
	}

	// mark ready for review by the tester
	mto2, err2 := MTOToggleReadyForReview(suite.testConfigs.Context, suite.testConfigs.Logger,
		markedReadyPrinc, suite.testConfigs.Store, plan.ID, true, nil, email.AddressBook{})
	suite.NoError(err2)
	if suite.NotNil(mto2, "mto shouldn't be nil") {
		if suite.NotNil(mto2.ReadyForReviewBy) {
			suite.EqualValues(markedReadyPrinc.UserAccount.ID, *mto2.ReadyForReviewBy,
				"the mto should have been marked ready for review by the tester principal")
		}
		suite.NotNil(mto2.ReadyForReviewDts)
	}

	// try to mark ready for review by the default principal
	mto3, err3 := MTOToggleReadyForReview(suite.testConfigs.Context, suite.testConfigs.Logger,
		markedReadyPrinc, suite.testConfigs.Store, plan.ID, true, nil, email.AddressBook{})
	suite.NoError(err3)
	if suite.NotNil(mto3, "mto shouldn't be nil") {
		if suite.NotNil(mto3.ReadyForReviewBy) {
			suite.EqualValues(markedReadyPrinc.UserAccount.ID, *mto3.ReadyForReviewBy,
				"the mto should have been marked ready for review by the tester principal")
		}
		suite.NotNil(mto3.ReadyForReviewDts)
	}

	// try to mark not ready for review by the default principal
	mto4, err4 := MTOToggleReadyForReview(suite.testConfigs.Context, suite.testConfigs.Logger,
		markedReadyPrinc, suite.testConfigs.Store, plan.ID, false, nil, email.AddressBook{})
	suite.NoError(err4)
	if suite.NotNil(mto4, "mto shouldn't be nil") {
		suite.Nil(mto4.ReadyForReviewBy)
		suite.Nil(mto4.ReadyForReviewDts)
	}

	// try to mark ready for review by the default principal
	mto5, err5 := MTOToggleReadyForReview(suite.testConfigs.Context, suite.testConfigs.Logger,
		markedReadyPrinc, suite.testConfigs.Store, plan.ID, true, nil, email.AddressBook{})
	suite.NoError(err5)
	if suite.NotNil(mto5, "mto shouldn't be nil") {
		if suite.NotNil(mto5.ReadyForReviewBy) {
			suite.EqualValues(markedReadyPrinc.UserAccount.ID, *mto5.ReadyForReviewBy,
				"the mto should have been marked ready for review by the default principal")
		}
		suite.NotNil(mto5.ReadyForReviewDts)
	}
}

// TestMTOToggleReadyForReview_SendsNotification verifies that marking an MTO ready for review
// creates an in-app notification for users who have the preference set.
func (suite *ResolverSuite) TestMTOToggleReadyForReview_SendsNotification() {
	plan := suite.createModelPlan("plan for notification test")

	// The test principal is already a collaborator; set their preference to MY_MODELS in-app
	notifType := models.MTOReadyForReviewNotificationTypeMyModels
	changes := map[string]interface{}{
		"mtoReadyForReview":                 []models.UserNotificationPreferenceFlag{models.UserNotificationPreferenceInApp},
		"mtoReadyForReviewNotificationType": &notifType,
	}
	_, err := UserNotificationPreferencesUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		changes,
	)
	suite.NoError(err)

	// Mark the MTO ready for review
	_, err = MTOToggleReadyForReview(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		plan.ID,
		true,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	// Verify the in-app notification was created
	nots, err := notifications.UserNotificationCollectionGetByUser(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
	)
	suite.NoError(err)
	suite.EqualValues(1, nots.NumUnreadNotifications())
}

// TestMTOToggleReadyForReview_NoNotificationOnUnset verifies that toggling back to not-ready
// does not create a notification.
func (suite *ResolverSuite) TestMTOToggleReadyForReview_NoNotificationOnUnset() {
	plan := suite.createModelPlan("plan for no-notification test")

	notifType := models.MTOReadyForReviewNotificationTypeMyModels
	changes := map[string]interface{}{
		"mtoReadyForReview":                 []models.UserNotificationPreferenceFlag{models.UserNotificationPreferenceInApp},
		"mtoReadyForReviewNotificationType": &notifType,
	}
	_, err := UserNotificationPreferencesUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		changes,
	)
	suite.NoError(err)

	// Toggle to false — no notification expected
	_, err = MTOToggleReadyForReview(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		plan.ID,
		false,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	nots, err := notifications.UserNotificationCollectionGetByUser(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
	)
	suite.NoError(err)
	suite.EqualValues(0, nots.NumUnreadNotifications())
}
