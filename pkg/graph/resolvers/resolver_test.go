package resolvers

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

// ResolverSuite is the testify suite for the resolver package
type ResolverSuite struct {
	suite.Suite
	testConfigs *TestConfigs
}

// SetupTest clears the database between each test
func (suite *ResolverSuite) SetupTest() {
	err := suite.testConfigs.Store.TruncateAllTablesDANGEROUS(suite.testConfigs.Logger)
	assert.NoError(suite.T(), err)
}

func (suite *ResolverSuite) createModelPlan(planName string) *models.ModelPlan {
	mp, err := ModelPlanCreate(suite.testConfigs.Logger, planName, suite.testConfigs.Store, suite.testConfigs.UserInfo)
	suite.NoError(err)
	return mp
}

func (suite *ResolverSuite) createPlanDiscussion(mp *models.ModelPlan, content string) *models.PlanDiscussion {
	input := &model.PlanDiscussionCreateInput{
		ModelPlanID: mp.ID,
		Content:     content,
	}
	pd, err := CreatePlanDiscussion(suite.testConfigs.Logger, input, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	suite.NoError(err)
	return pd
}

func (suite *ResolverSuite) createDiscussionReply(pd *models.PlanDiscussion, content string, resolution bool) *models.DiscussionReply {
	input := &model.DiscussionReplyCreateInput{
		DiscussionID: pd.ID,
		Content:      content,
		Resolution:   resolution,
	}
	dr, err := CreateDiscussionReply(suite.testConfigs.Logger, input, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	suite.NoError(err)
	return dr
}

// TestResolverSuite runs the resolver test suite
func TestResolverSuite(t *testing.T) {
	rs := new(ResolverSuite)
	rs.testConfigs = GetDefaultTestConfigs()
	suite.Run(t, rs)
}
