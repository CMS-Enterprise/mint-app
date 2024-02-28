package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

func (s *ResolverSuite) TestUserNotificationPreferencesGetByUserID() {
	pref, err := UserNotificationPreferencesGetByUserID(s.testConfigs.Context, s.testConfigs.Principal.Account().ID)
	s.NoError(err)
	s.NotNil(pref)

	s.EqualValues(models.UserNotificationPreferenceAll, pref.DailyDigestComplete)
	s.EqualValues(models.UserNotificationPreferenceAll, pref.AddedAsCollaborator)
	s.EqualValues(models.UserNotificationPreferenceAll, pref.TaggedInDiscussion)
	s.EqualValues(models.UserNotificationPreferenceAll, pref.TaggedInDiscussionReply)
	s.EqualValues(models.UserNotificationPreferenceAll, pref.NewDiscussionReply)
	s.EqualValues(models.UserNotificationPreferenceAll, pref.ModelPlanShared)

}

func (s *ResolverSuite) TestUserNotificationPreferencesUpdate() {

	pref, err := UserNotificationPreferencesGetByUserID(s.testConfigs.Context, s.testConfigs.Principal.Account().ID)
	s.NoError(err)
	s.NotNil(pref)
	changes := map[string]interface{}{
		"dailyDigestComplete":     "IN_APP_ONLY",
		"addedAsCollaborator":     "IN_APP_ONLY",
		"taggedInDiscussion":      "IN_APP_ONLY",
		"taggedInDiscussionReply": "IN_APP_ONLY",
		"newDiscussionReply":      "IN_APP_ONLY",
		"modelPlanShared":         "IN_APP_ONLY",
	}
	updatedPref, err := UserNotificationPreferencesUpdate(s.testConfigs.Context, s.testConfigs.Logger, s.testConfigs.Principal, s.testConfigs.Store, changes)
	s.NoError(err)
	s.NotNil(updatedPref)

	s.EqualValues(models.UserNotificationPreferenceInAppOnly, updatedPref.DailyDigestComplete)
	s.EqualValues(models.UserNotificationPreferenceInAppOnly, updatedPref.AddedAsCollaborator)
	s.EqualValues(models.UserNotificationPreferenceInAppOnly, updatedPref.TaggedInDiscussion)
	s.EqualValues(models.UserNotificationPreferenceInAppOnly, updatedPref.TaggedInDiscussionReply)
	s.EqualValues(models.UserNotificationPreferenceInAppOnly, updatedPref.NewDiscussionReply)
	s.EqualValues(models.UserNotificationPreferenceInAppOnly, updatedPref.ModelPlanShared)

}
