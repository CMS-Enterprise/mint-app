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
	changes := map[string]interface{}{
		"dailyDigestComplete":     models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp},
		"addedAsCollaborator":     models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp},
		"taggedInDiscussion":      models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp},
		"taggedInDiscussionReply": models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp},
		"newDiscussionReply":      models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp},
		"modelPlanShared":         models.UserNotificationPreferenceFlags{models.UserNotificationPreferenceInApp},
	}
	updatedPref, err := UserNotificationPreferencesUpdate(s.testConfigs.Context, s.testConfigs.Logger, s.testConfigs.Principal, s.testConfigs.Store, changes)
	s.NoError(err)
	s.NotNil(updatedPref)

	s.EqualValues(models.UserNotificationPreferenceInApp, updatedPref.DailyDigestComplete)
	s.EqualValues(models.UserNotificationPreferenceInApp, updatedPref.AddedAsCollaborator)
	s.EqualValues(models.UserNotificationPreferenceInApp, updatedPref.TaggedInDiscussion)
	s.EqualValues(models.UserNotificationPreferenceInApp, updatedPref.TaggedInDiscussionReply)
	s.EqualValues(models.UserNotificationPreferenceInApp, updatedPref.NewDiscussionReply)
	s.EqualValues(models.UserNotificationPreferenceInApp, updatedPref.ModelPlanShared)

}
