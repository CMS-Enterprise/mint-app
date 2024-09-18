package resolvers

import "github.com/cms-enterprise/mint-app/pkg/models"

func (suite *ResolverSuite) TestUserNotificationPreferencesGetByUserID() {
	pref, err := UserNotificationPreferencesGetByUserID(suite.testConfigs.Context, suite.testConfigs.Principal.Account().ID)
	suite.NoError(err)
	suite.NotNil(pref)

	suite.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.DailyDigestComplete)
	suite.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.AddedAsCollaborator)
	suite.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.TaggedInDiscussion)
	suite.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.TaggedInDiscussionReply)
	suite.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.NewDiscussionReply)
	suite.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.ModelPlanShared)

}

func (suite *ResolverSuite) TestUserNotificationPreferencesUpdate() {

	pref, err := UserNotificationPreferencesGetByUserID(suite.testConfigs.Context, suite.testConfigs.Principal.Account().ID)
	suite.NoError(err)
	suite.NotNil(pref)
	inAppOnly := models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp}
	changes := map[string]interface{}{
		"dailyDigestComplete":     inAppOnly,
		"addedAsCollaborator":     inAppOnly,
		"taggedInDiscussion":      inAppOnly,
		"taggedInDiscussionReply": inAppOnly,
		"newDiscussionReply":      inAppOnly,
		"modelPlanShared":         nil,
	}
	updatedPref, err := UserNotificationPreferencesUpdate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, changes)
	suite.NoError(err)
	suite.NotNil(updatedPref)

	suite.EqualValues(inAppOnly, updatedPref.DailyDigestComplete)
	suite.EqualValues(inAppOnly, updatedPref.AddedAsCollaborator)
	suite.EqualValues(inAppOnly, updatedPref.TaggedInDiscussion)
	suite.EqualValues(inAppOnly, updatedPref.TaggedInDiscussionReply)
	suite.EqualValues(inAppOnly, updatedPref.NewDiscussionReply)
	suite.EqualValues(models.UserNotificationPreferenceFlags(nil), updatedPref.ModelPlanShared)

	// Ensure a nil reference evaluates correctly
	suite.False(updatedPref.ModelPlanShared.InApp())
	suite.False(updatedPref.ModelPlanShared.SendEmail())

}
