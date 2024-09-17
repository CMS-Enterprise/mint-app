package notifications

import (
	"context"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *NotificationsSuite) TestActivityAddedAsCollaboratorMetaCreate() {

	// we are just choosing a valid UUID to set for the entityID
	modelPlanID := uuid.New()
	// we are just choosing a valid UUID to set for the entityID
	collaboratorID := uuid.New()
	actorID := suite.testConfigs.Principal.Account().ID

	collabEUA := "FAKE"
	collabPrincipal, err := suite.testConfigs.GetTestPrincipal(suite.testConfigs.Store, collabEUA)
	suite.NoError(err)
	collaboratorAccountID := collabPrincipal.Account().ID

	mockFunc := func(ctx context.Context, user_id uuid.UUID) (*models.UserNotificationPreferences, error) {
		// Return mock data, all notifications enabled
		return models.NewUserNotificationPreferences(user_id), nil
	}

	testActivity, err := ActivityAddedAsCollaboratorCreate(suite.testConfigs.Context, suite.testConfigs.Store, actorID, modelPlanID, collaboratorID, collaboratorAccountID, mockFunc)

	suite.NoError(err)
	suite.NotNil(testActivity)
	suite.EqualValues(models.ActivityAddedAsCollaborator, testActivity.ActivityType)
	// Assert meta data is not deserialized here
	suite.Nil(testActivity.MetaData)
	//Assert meta data can be deserialized
	suite.NotNil(testActivity.MetaDataRaw)
	meta, err := parseRawActivityMetaData(testActivity.ActivityType, testActivity.MetaDataRaw)
	suite.NoError(err)
	suite.NotNil(meta)

	actorNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Principal)
	suite.NoError(err)
	suite.EqualValues(0, actorNots.NumUnreadNotifications())

	collabNots, err := UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, collabPrincipal)
	suite.NoError(err)
	suite.EqualValues(1, collabNots.NumUnreadNotifications())

}
