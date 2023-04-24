package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"
)

func (suite *ResolverSuite) TestExistingModelLinkDataLoader() {
	plan1 := suite.createModelPlan("Plan For Link 1")
	plan2 := suite.createModelPlan("Plan For Link 2")
	_, err := ExistingModelLinkCreate(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal, plan1.ID, nil, &plan2.ID)
	suite.NoError(err)
	_, err2 := ExistingModelLinkCreate(suite.testConfigs.Logger, suite.testConfigs.Store, suite.testConfigs.Principal, plan2.ID, nil, &plan1.ID)
	suite.NoError(err2)

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyExistingModelLinkLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyExistingModelLinkLoader(ctx, plan2.ID)
	})
	err3 := g.Wait()
	suite.NoError(err3)

}
func verifyExistingModelLinkLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	links, err := ExistingModelLinkGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}
	if len(links) < 1 {
		return fmt.Errorf("no existing Model Link returned model plan ID %s", modelPlanID)
	}

	if modelPlanID != links[0].ModelPlanID {
		return fmt.Errorf("existing Model Link returned model plan ID %s, expected %s", links[0].ModelPlanID, modelPlanID)
	}
	return nil
}
