package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// Normal path: respects user prefs (non-lead)
func (suite *NotificationsSuite) TestActivityIncorrectModelStatusCreate() {
	actorID := suite.testConfigs.Principal.Account().ID
	receiverPrincipal, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE")
	suite.NoError(err)

	mp := models.NewModelPlan(uuid.New(), "Test Plan")
	modelPlanID := mp.ID

	phaseSuggestion := &models.PhaseSuggestion{
		Phase:             models.ModelPhaseIcipComplete,
		SuggestedStatuses: []models.ModelStatus{models.ModelStatusActive},
	}

	// Receiver opts in to IncorrectModelStatus (non-lead)
	getPrefs := func(ctx context.Context, userID uuid.UUID) (*models.UserNotificationPreferences, error) {
		return &models.UserNotificationPreferences{
			UserID:               userID,
			IncorrectModelStatus: models.DefaultUserNotificationPreferencesFlags(),
		}, nil
	}
	isLead := func(userID uuid.UUID) (bool, error) { return false, nil }

	testActivity, err := ActivityIncorrectModelStatusCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		actorID,
		[]uuid.UUID{receiverPrincipal.Account().ID},
		phaseSuggestion,
		mp,
		getPrefs,
		isLead,
	)
	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityIncorrectModelStatus, testActivity.ActivityType)

	// Meta not deserialized on the model
	suite.Nil(testActivity.MetaData)

	// Meta can be parsed from raw
	suite.NotNil(testActivity.MetaDataRaw)
	meta, err := parseRawActivityMetaData(testActivity.ActivityType, testActivity.MetaDataRaw)
	suite.NoError(err)
	suite.NotNil(meta)

	// Validate meta fields
	ims := meta.(*models.IncorrectModelStatusActivityMeta)
	suite.EqualValues(modelPlanID, ims.ModelPlanID)
	suite.EqualValues(string(phaseSuggestion.Phase), ims.PhaseSuggestion.Phase)
	suite.EqualValues(mp.ModelName, ims.ModelPlanName)
	suite.EqualValues(mp.Status, ims.CurrentStatus)
	suite.Len(ims.PhaseSuggestion.SuggestedStatuses, len(phaseSuggestion.SuggestedStatuses))

	// Receiver got one notification
	receiverNots, err := UserNotificationCollectionGetByUser(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		receiverPrincipal,
	)
	suite.NoError(err)
	suite.EqualValues(1, receiverNots.NumUnreadNotifications())
}

// Lead override: user has no prefs but is a lead → still notify
func (suite *NotificationsSuite) TestActivityIncorrectModelStatusCreate_LeadOverridesPrefs() {
	actorID := suite.testConfigs.Principal.Account().ID
	receiverPrincipal, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, "FAKE2")
	suite.NoError(err)

	mp := models.NewModelPlan(uuid.New(), "Test Plan")

	phaseSuggestion := &models.PhaseSuggestion{
		Phase:             models.ModelPhaseIcipComplete,
		SuggestedStatuses: []models.ModelStatus{models.ModelStatusActive},
	}

	// Receiver has empty prefs (would normally suppress), but is a lead
	getPrefs := func(ctx context.Context, userID uuid.UUID) (*models.UserNotificationPreferences, error) {
		return &models.UserNotificationPreferences{
			UserID:               userID,
			IncorrectModelStatus: models.EmptyUserNotificationPreferencesFlags(),
		}, nil
	}
	isLead := func(userID uuid.UUID) (bool, error) { return true, nil }

	testActivity, err := ActivityIncorrectModelStatusCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		actorID,
		[]uuid.UUID{receiverPrincipal.Account().ID},
		phaseSuggestion,
		mp,
		getPrefs,
		isLead,
	)
	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityIncorrectModelStatus, testActivity.ActivityType)
	suite.Nil(testActivity.MetaData)

	meta, err := parseRawActivityMetaData(testActivity.ActivityType, testActivity.MetaDataRaw)
	suite.NoError(err)
	suite.NotNil(meta)

	receiverNots, err := UserNotificationCollectionGetByUser(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		receiverPrincipal,
	)
	suite.NoError(err)
	suite.EqualValues(1, receiverNots.NumUnreadNotifications())
}
