package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func (suite *ResolverSuite) TestPlanDataExchangeApproachGetByModelPlanIDLoader() {

	plan1 := suite.createModelPlan("model plan 1")
	approach1, err := PlanDataExchangeApproachGetByModelPlanIDLoader(suite.testConfigs.Context, plan1.ID)
	suite.NoError(err)
	suite.EqualValues(plan1.ID, approach1.ModelPlanID)
	plan2 := suite.createModelPlan("model plan 2")

	approach2, err := PlanDataExchangeApproachGetByModelPlanIDLoader(suite.testConfigs.Context, plan2.ID)
	suite.NoError(err)
	suite.EqualValues(plan2.ID, approach2.ModelPlanID)
	plan3 := suite.createModelPlan("model plan 3")
	approach3, err := PlanDataExchangeApproachGetByModelPlanIDLoader(suite.testConfigs.Context, plan3.ID)
	suite.NoError(err)
	suite.EqualValues(plan3.ID, approach3.ModelPlanID)
	expectedResults := []loaders.KeyAndExpected[uuid.UUID, uuid.UUID]{
		{Key: plan1.ID, Expected: approach1.ID},
		{Key: plan2.ID, Expected: approach2.ID},
		{Key: plan3.ID, Expected: approach3.ID},
	}

	verifyFunc := func(data *models.PlanDataExchangeApproach, expected uuid.UUID) bool {
		if suite.NotNil(data) {
			return suite.EqualValues(expected, data.ID)
		}
		return false

	}

	loaders.VerifyLoaders[uuid.UUID, *models.PlanDataExchangeApproach, uuid.UUID](suite.testConfigs.Context, &suite.Suite, loaders.PlanDataExchangeApproach.ByModelPlanID,
		expectedResults, verifyFunc)

}
