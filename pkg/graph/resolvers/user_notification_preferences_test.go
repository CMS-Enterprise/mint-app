package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

func (s *ResolverSuite) TestUserNotificationPreferencesGetByUserID() {
	pref, err := UserNotificationPreferencesGetByUserID(s.testConfigs.Context, s.testConfigs.Principal.Account().ID)
	s.NoError(err)
	s.NotNil(pref)

	s.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.DailyDigestComplete)
	s.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.AddedAsCollaborator)
	s.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.TaggedInDiscussion)
	s.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.TaggedInDiscussionReply)
	s.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.NewDiscussionReply)
	s.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.ModelPlanShared)

}

func (s *ResolverSuite) TestUserNotificationPreferencesUpdate() {

	pref, err := UserNotificationPreferencesGetByUserID(s.testConfigs.Context, s.testConfigs.Principal.Account().ID)
	s.NoError(err)
	s.NotNil(pref)
	inAppOnly := models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp}
	changes := map[string]interface{}{
		"dailyDigestComplete":     inAppOnly,
		"addedAsCollaborator":     inAppOnly,
		"taggedInDiscussion":      inAppOnly,
		"taggedInDiscussionReply": inAppOnly,
		"newDiscussionReply":      inAppOnly,
		"modelPlanShared":         nil,
	}
	updatedPref, err := UserNotificationPreferencesUpdate(s.testConfigs.Context, s.testConfigs.Logger, s.testConfigs.Principal, s.testConfigs.Store, changes)
	s.NoError(err)
	s.NotNil(updatedPref)

	s.EqualValues(inAppOnly, updatedPref.DailyDigestComplete)
	s.EqualValues(inAppOnly, updatedPref.AddedAsCollaborator)
	s.EqualValues(inAppOnly, updatedPref.TaggedInDiscussion)
	s.EqualValues(inAppOnly, updatedPref.TaggedInDiscussionReply)
	s.EqualValues(inAppOnly, updatedPref.NewDiscussionReply)
	s.EqualValues(models.UserNotificationPreferenceFlags(nil), updatedPref.ModelPlanShared)

	// Ensure a nil reference evaluates correctly
	s.False(updatedPref.ModelPlanShared.InApp())
	s.False(updatedPref.ModelPlanShared.SendEmail())

}
