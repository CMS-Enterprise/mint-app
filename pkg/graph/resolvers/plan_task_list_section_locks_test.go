package resolvers

import (
	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/models/pubsubevents"
	"github.com/cms-enterprise/mint-app/pkg/shared/pubsub/mockpubsub"
)

func (suite *ResolverSuite) TestGetTaskListSectionLocksWithLockedSections() {
	mockController := gomock.NewController(suite.T())
	ps := mockpubsub.NewMockPubSub(mockController)
	modelPlanID, _ := uuid.Parse("f11eb129-2c80-4080-9440-439cbe1a286f")
	lockResolver := NewPlanTaskListSectionLocksResolverImplementation()
	sections := [...]models.LockableSection{models.LockableSectionBasics, models.LockableSectionGeneralCharacteristics}

	ps.EXPECT().Publish(modelPlanID, pubsubevents.TaskListSectionLocksChanged, gomock.Any()).Times(4)

	resultsEmpty, err := lockResolver.GetTaskListSectionLocks(modelPlanID)
	suite.Assert().NoError(err)

	_, err = lockResolver.LockTaskListSection(ps, modelPlanID, sections[0], suite.testConfigs.Principal)
	suite.Assert().NoError(err)

	_, err = lockResolver.LockTaskListSection(ps, modelPlanID, sections[1], suite.testConfigs.Principal)
	suite.Assert().NoError(err)

	resultsFilled, err := lockResolver.GetTaskListSectionLocks(modelPlanID)
	suite.Assert().NoError(err)

	_, err = lockResolver.UnlockAllTaskListSections(ps, modelPlanID)
	suite.Assert().NoError(err)

	assert.Len(suite.T(), resultsEmpty, 0)
	assert.Len(suite.T(), resultsFilled, 2)
	assert.Contains(suite.T(), sections, (*resultsFilled[0]).Section)
	assert.Contains(suite.T(), sections, (*resultsFilled[1]).Section)
	assert.Equal(suite.T(), suite.testConfigs.Principal.Account().ID, (*resultsFilled[0]).LockedByUserAccount.ID)
	assert.Equal(suite.T(), suite.testConfigs.Principal.Account().ID, (*resultsFilled[1]).LockedByUserAccount.ID)
}

func (suite *ResolverSuite) TestLockTaskListSection() {
	mockController := gomock.NewController(suite.T())
	ps := mockpubsub.NewMockPubSub(mockController)
	modelPlanID, _ := uuid.Parse("f11eb129-2c80-4080-9440-439cbe1a286f")
	section := models.LockableSectionBasics

	ps.EXPECT().Publish(modelPlanID, pubsubevents.TaskListSectionLocksChanged, gomock.Any())

	_, err := NewPlanTaskListSectionLocksResolverImplementation().LockTaskListSection(ps, modelPlanID, section, suite.testConfigs.Principal)
	suite.Assert().NoError(err)
}
