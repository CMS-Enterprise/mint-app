package resolvers

import (
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

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
	suite.EqualValues(models.UserNotificationPreferenceFlags(nil), pref.IncorrectModelStatus)
	suite.EqualValues(models.DefaultUserNotificationPreferencesFlags(), pref.ModelFollowerUpdate)
}

func (suite *ResolverSuite) TestUserAccountGetNotificationPreferencesForModelFollowerUpdate() {
	plan := suite.createModelPlan("Plan with followers")
	follower := suite.getTestPrincipal(suite.testConfigs.Store, "FOLO")
	optedOut := suite.getTestPrincipal(suite.testConfigs.Store, "OPTO")
	_ = suite.getTestPrincipal(suite.testConfigs.Store, "NOFO")

	for _, princ := range []*authentication.ApplicationPrincipal{follower, optedOut} {
		_, err := PlanFavoriteCreate(suite.testConfigs.Store, suite.testConfigs.Logger, princ, princ.Account().ID, suite.testConfigs.Store, plan.ID)
		suite.NoError(err)
	}

	_, err := UserNotificationPreferencesUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		optedOut,
		suite.testConfigs.Store,
		map[string]interface{}{"modelFollowerUpdate": models.UserNotificationPreferenceFlags{}},
	)
	suite.NoError(err)

	recipients, err := storage.UserAccountGetNotificationPreferencesForModelFollowerUpdate(suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	// The plan creator follows the plan automatically
	suite.Len(recipients, 2)

	recipientIDs := lo.Map(recipients, func(r *models.UserAccountAndNotificationPreferences, _ int) uuid.UUID { return r.ID })
	suite.ElementsMatch([]uuid.UUID{suite.testConfigs.Principal.Account().ID, follower.Account().ID}, recipientIDs)
	for _, recipient := range recipients {
		suite.EqualValues(models.DefaultUserNotificationPreferencesFlags(), recipient.PreferenceFlags)
	}
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
		"incorrectModelStatus":    inAppOnly,
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
	suite.EqualValues(inAppOnly, updatedPref.IncorrectModelStatus)

	// Ensure a nil reference evaluates correctly
	suite.False(updatedPref.ModelPlanShared.InApp())
	suite.False(updatedPref.ModelPlanShared.SendEmail())
}
